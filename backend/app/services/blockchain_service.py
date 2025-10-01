"""
Blockchain service for Web3 integration and smart contract interactions.
Handles Ethereum blockchain connectivity and smart contract operations.
"""

import asyncio
import time
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
import json
from pathlib import Path

try:
    from web3 import Web3
    from web3.middleware import geth_poa_middleware
    WEB3_AVAILABLE = True
except ImportError:
    WEB3_AVAILABLE = False
    Web3 = None

from app.core.config import settings
from app.core.logger import app_logger
from app.models.schemas import BlockchainStatus, TokenBalance, SmartContractCall


class BlockchainService:
    """Service for blockchain interactions and smart contract operations."""
    
    def __init__(self):
        """Initialize the blockchain service."""
        self.web3 = None
        self.connected = False
        self.contract_abi = None
        self.contract_address = settings.contract_address
        self.private_key = settings.private_key
        
        if WEB3_AVAILABLE and settings.blockchain_rpc_url:
            self._initialize_web3()
        else:
            app_logger.warning("Web3 not available or RPC URL not configured")
    
    def _initialize_web3(self) -> None:
        """Initialize Web3 connection."""
        try:
            self.web3 = Web3(Web3.HTTPProvider(settings.blockchain_rpc_url))
            
            # Add PoA middleware for networks like BSC, Polygon
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)
            
            # Test connection
            if self.web3.is_connected():
                self.connected = True
                app_logger.info("Successfully connected to blockchain")
            else:
                app_logger.error("Failed to connect to blockchain")
                self.connected = False
                
        except Exception as e:
            app_logger.error(f"Error initializing Web3: {str(e)}")
            self.connected = False
    
    def _load_contract_abi(self) -> Optional[Dict]:
        """Load smart contract ABI from file."""
        try:
            contract_path = Path("./contracts/Contract.json")
            if contract_path.exists():
                with open(contract_path, 'r') as f:
                    contract_data = json.load(f)
                    self.contract_abi = contract_data.get('abi', [])
                    app_logger.info("Contract ABI loaded successfully")
                    return self.contract_abi
            else:
                app_logger.warning("Contract ABI file not found, using mock ABI")
                return self._get_mock_abi()
        except Exception as e:
            app_logger.error(f"Error loading contract ABI: {str(e)}")
            return self._get_mock_abi()
    
    def _get_mock_abi(self) -> List[Dict]:
        """Get mock ABI for demonstration purposes."""
        return [
            {
                "inputs": [],
                "name": "getBalance",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    
    async def get_blockchain_status(self) -> BlockchainStatus:
        """
        Get current blockchain connection status and network information.
        
        Returns:
            BlockchainStatus with connection details
        """
        start_time = time.time()
        
        try:
            if not self.connected or not self.web3:
                return BlockchainStatus(
                    is_connected=False,
                    network_id=None,
                    latest_block=None,
                    gas_price=None,
                    connection_time=None
                )
            
            # Get network information
            network_id = self.web3.eth.chain_id
            latest_block = self.web3.eth.block_number
            
            # Get gas price
            try:
                gas_price_wei = self.web3.eth.gas_price
                gas_price_gwei = self.web3.from_wei(gas_price_wei, 'gwei')
            except Exception:
                gas_price_gwei = None
            
            connection_time = (time.time() - start_time) * 1000  # Convert to ms
            
            return BlockchainStatus(
                is_connected=True,
                network_id=network_id,
                latest_block=latest_block,
                gas_price=float(gas_price_gwei) if gas_price_gwei else None,
                connection_time=round(connection_time, 2)
            )
            
        except Exception as e:
            app_logger.error(f"Error getting blockchain status: {str(e)}")
            return BlockchainStatus(
                is_connected=False,
                network_id=None,
                latest_block=None,
                gas_price=None,
                connection_time=None
            )
    
    async def get_token_balance(self, wallet_address: str, 
                              token_address: Optional[str] = None) -> TokenBalance:
        """
        Get token balance for a wallet address.
        
        Args:
            wallet_address: Ethereum wallet address
            token_address: Token contract address (None for ETH)
            
        Returns:
            TokenBalance with balance information
        """
        try:
            if not self.connected or not self.web3:
                raise Exception("Blockchain not connected")
            
            if token_address:
                # ERC-20 token balance
                return await self._get_erc20_balance(wallet_address, token_address)
            else:
                # ETH balance
                balance_wei = self.web3.eth.get_balance(wallet_address)
                balance_eth = self.web3.from_wei(balance_wei, 'ether')
                
                return TokenBalance(
                    token_address="0x0000000000000000000000000000000000000000",  # ETH address
                    token_symbol="ETH",
                    balance=float(balance_eth),
                    balance_usd=None  # Would need price feed
                )
                
        except Exception as e:
            app_logger.error(f"Error getting token balance: {str(e)}")
            raise Exception(f"Failed to get token balance: {str(e)}")
    
    async def _get_erc20_balance(self, wallet_address: str, token_address: str) -> TokenBalance:
        """Get ERC-20 token balance."""
        try:
            # Load contract ABI if not already loaded
            if not self.contract_abi:
                self.contract_abi = self._load_contract_abi()
            
            # Create contract instance
            contract = self.web3.eth.contract(
                address=Web3.to_checksum_address(token_address),
                abi=self.contract_abi
            )
            
            # Get balance
            balance = contract.functions.balanceOf(
                Web3.to_checksum_address(wallet_address)
            ).call()
            
            # Get token symbol (assuming it has a symbol() function)
            try:
                symbol = contract.functions.symbol().call()
            except Exception:
                symbol = "UNKNOWN"
            
            # Convert balance (assuming 18 decimals)
            balance_formatted = balance / (10 ** 18)
            
            return TokenBalance(
                token_address=token_address,
                token_symbol=symbol,
                balance=float(balance_formatted),
                balance_usd=None  # Would need price feed
            )
            
        except Exception as e:
            app_logger.error(f"Error getting ERC-20 balance: {str(e)}")
            raise Exception(f"Failed to get ERC-20 token balance: {str(e)}")
    
    async def call_smart_contract(self, call_data: SmartContractCall) -> Dict[str, Any]:
        """
        Call a smart contract function.
        
        Args:
            call_data: Smart contract call parameters
            
        Returns:
            Function call result
        """
        try:
            if not self.connected or not self.web3:
                raise Exception("Blockchain not connected")
            
            # Load contract ABI if not already loaded
            if not self.contract_abi:
                self.contract_abi = self._load_contract_abi()
            
            # Create contract instance
            contract = self.web3.eth.contract(
                address=Web3.to_checksum_address(call_data.contract_address),
                abi=self.contract_abi
            )
            
            # Get function
            function = getattr(contract.functions, call_data.function_name)
            
            # Call function
            if call_data.parameters:
                result = function(*call_data.parameters).call()
            else:
                result = function().call()
            
            return {
                "success": True,
                "result": result,
                "function": call_data.function_name,
                "contract_address": call_data.contract_address,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            app_logger.error(f"Error calling smart contract: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "function": call_data.function_name,
                "contract_address": call_data.contract_address,
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def get_multiple_token_balances(self, wallet_address: str, 
                                        token_addresses: List[str]) -> List[TokenBalance]:
        """
        Get balances for multiple tokens.
        
        Args:
            wallet_address: Ethereum wallet address
            token_addresses: List of token contract addresses
            
        Returns:
            List of TokenBalance objects
        """
        balances = []
        
        for token_address in token_addresses:
            try:
                balance = await self.get_token_balance(wallet_address, token_address)
                balances.append(balance)
            except Exception as e:
                app_logger.error(f"Error getting balance for token {token_address}: {str(e)}")
                # Add error balance
                balances.append(TokenBalance(
                    token_address=token_address,
                    token_symbol="ERROR",
                    balance=0.0,
                    balance_usd=None
                ))
        
        return balances
    
    def get_network_info(self) -> Dict[str, Any]:
        """Get current network information."""
        if not self.connected or not self.web3:
            return {"error": "Blockchain not connected"}
        
        try:
            return {
                "chain_id": self.web3.eth.chain_id,
                "block_number": self.web3.eth.block_number,
                "gas_price": str(self.web3.eth.gas_price),
                "is_connected": self.web3.is_connected(),
                "client_version": self.web3.client_version if hasattr(self.web3, 'client_version') else "Unknown"
            }
        except Exception as e:
            return {"error": str(e)}


# Global blockchain service instance
blockchain_service = BlockchainService()
