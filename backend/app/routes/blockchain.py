"""
Blockchain integration endpoints.
Handles Web3 interactions and smart contract operations.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from app.core.logger import app_logger
from app.models.schemas import (
    BlockchainStatus,
    TokenBalance,
    SmartContractCall,
    ErrorResponse
)
from app.services.blockchain_service import blockchain_service
from app.utils.helpers import validate_ethereum_address

router = APIRouter(prefix="/blockchain", tags=["Blockchain"])


@router.get("/status", response_model=BlockchainStatus, summary="Get Blockchain Status")
async def get_blockchain_status():
    """
    Get current blockchain connection status and network information.
    
    Returns:
        BlockchainStatus with connection details and network info
    """
    try:
        status = await blockchain_service.get_blockchain_status()
        app_logger.info(f"Blockchain status retrieved: connected={status.is_connected}")
        return status
        
    except Exception as e:
        app_logger.error(f"Failed to get blockchain status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get blockchain status: {str(e)}"
        )


@router.get("/balance/{wallet_address}", response_model=TokenBalance, summary="Get Wallet Balance")
async def get_wallet_balance(
    wallet_address: str,
    token_address: Optional[str] = Query(None, description="Token contract address (None for ETH)")
):
    """
    Get token balance for a wallet address.
    
    Args:
        wallet_address: Ethereum wallet address
        token_address: Token contract address (None for ETH balance)
        
    Returns:
        TokenBalance with balance information
        
    Raises:
        HTTPException: If address is invalid or balance retrieval fails
    """
    try:
        # Validate wallet address
        if not validate_ethereum_address(wallet_address):
            raise HTTPException(
                status_code=400,
                detail="Invalid wallet address format"
            )
        
        # Validate token address if provided
        if token_address and not validate_ethereum_address(token_address):
            raise HTTPException(
                status_code=400,
                detail="Invalid token address format"
            )
        
        balance = await blockchain_service.get_token_balance(wallet_address, token_address)
        app_logger.info(f"Retrieved balance for wallet {wallet_address}: {balance.balance} {balance.token_symbol}")
        return balance
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Failed to get balance for wallet {wallet_address}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get wallet balance: {str(e)}"
        )


@router.get("/balances/{wallet_address}", response_model=List[TokenBalance], summary="Get Multiple Token Balances")
async def get_multiple_balances(
    wallet_address: str,
    token_addresses: str = Query(..., description="Comma-separated list of token addresses")
):
    """
    Get balances for multiple tokens for a wallet address.
    
    Args:
        wallet_address: Ethereum wallet address
        token_addresses: Comma-separated list of token contract addresses
        
    Returns:
        List of TokenBalance objects
        
    Raises:
        HTTPException: If address is invalid or balance retrieval fails
    """
    try:
        # Validate wallet address
        if not validate_ethereum_address(wallet_address):
            raise HTTPException(
                status_code=400,
                detail="Invalid wallet address format"
            )
        
        # Parse token addresses
        token_list = [addr.strip() for addr in token_addresses.split(",")]
        
        # Validate all token addresses
        for token_address in token_list:
            if not validate_ethereum_address(token_address):
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid token address format: {token_address}"
                )
        
        balances = await blockchain_service.get_multiple_token_balances(wallet_address, token_list)
        app_logger.info(f"Retrieved {len(balances)} token balances for wallet {wallet_address}")
        return balances
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Failed to get multiple balances for wallet {wallet_address}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get multiple token balances: {str(e)}"
        )


@router.post("/contract/call", summary="Call Smart Contract Function")
async def call_smart_contract(call_data: SmartContractCall):
    """
    Call a smart contract function.
    
    Args:
        call_data: Smart contract call parameters
        
    Returns:
        Function call result
        
    Raises:
        HTTPException: If contract call fails
    """
    try:
        # Validate contract address
        if not validate_ethereum_address(call_data.contract_address):
            raise HTTPException(
                status_code=400,
                detail="Invalid contract address format"
            )
        
        result = await blockchain_service.call_smart_contract(call_data)
        app_logger.info(f"Smart contract call completed: {call_data.function_name}")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Failed to call smart contract: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to call smart contract: {str(e)}"
        )


@router.get("/network/info", summary="Get Network Information")
async def get_network_info():
    """
    Get current blockchain network information.
    
    Returns:
        Network information including chain ID, block number, and gas price
    """
    try:
        network_info = blockchain_service.get_network_info()
        app_logger.info("Retrieved network information")
        return network_info
        
    except Exception as e:
        app_logger.error(f"Failed to get network info: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get network information: {str(e)}"
        )


@router.get("/gas/price", summary="Get Current Gas Price")
async def get_gas_price():
    """
    Get current gas price information.
    
    Returns:
        Gas price information in Gwei and Wei
    """
    try:
        status = await blockchain_service.get_blockchain_status()
        
        if not status.is_connected:
            raise HTTPException(
                status_code=503,
                detail="Blockchain not connected"
            )
        
        gas_info = {
            "gas_price_gwei": status.gas_price,
            "gas_price_wei": status.gas_price * 1e9 if status.gas_price else None,
            "network_id": status.network_id,
            "latest_block": status.latest_block,
            "timestamp": status.connection_time
        }
        
        app_logger.info(f"Retrieved gas price: {status.gas_price} Gwei")
        return gas_info
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Failed to get gas price: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get gas price: {str(e)}"
        )


@router.get("/tokens/popular", summary="Get Popular Token Addresses")
async def get_popular_tokens():
    """
    Get list of popular token contract addresses for common cryptocurrencies.
    
    Returns:
        List of popular token addresses and information
    """
    popular_tokens = {
        "ethereum": {
            "symbol": "ETH",
            "name": "Ethereum",
            "address": "0x0000000000000000000000000000000000000000",
            "decimals": 18,
            "type": "native"
        },
        "wrapped_ethereum": {
            "symbol": "WETH",
            "name": "Wrapped Ethereum",
            "address": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
            "decimals": 18,
            "type": "erc20"
        },
        "usd_coin": {
            "symbol": "USDC",
            "name": "USD Coin",
            "address": "0xA0b86a33E6441b8C4C8C0d4B0c8B8c8B8c8B8c8B",
            "decimals": 6,
            "type": "erc20"
        },
        "tether": {
            "symbol": "USDT",
            "name": "Tether USD",
            "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            "decimals": 6,
            "type": "erc20"
        },
        "chainlink": {
            "symbol": "LINK",
            "name": "Chainlink",
            "address": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
            "decimals": 18,
            "type": "erc20"
        },
        "uniswap": {
            "symbol": "UNI",
            "name": "Uniswap",
            "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
            "decimals": 18,
            "type": "erc20"
        }
    }
    
    return {
        "tokens": popular_tokens,
        "count": len(popular_tokens),
        "note": "These are example addresses for demonstration. Use actual contract addresses in production."
    }


@router.get("/transactions/{wallet_address}", summary="Get Wallet Transactions")
async def get_wallet_transactions(
    wallet_address: str,
    limit: int = Query(10, ge=1, le=100, description="Maximum number of transactions to return")
):
    """
    Get recent transactions for a wallet address (placeholder for future implementation).
    
    Args:
        wallet_address: Ethereum wallet address
        limit: Maximum number of transactions to return
        
    Returns:
        List of transactions
    """
    try:
        # Validate wallet address
        if not validate_ethereum_address(wallet_address):
            raise HTTPException(
                status_code=400,
                detail="Invalid wallet address format"
            )
        
        # This would be implemented with a blockchain explorer API in production
        return {
            "message": "Transaction history not yet implemented",
            "wallet_address": wallet_address,
            "limit": limit,
            "status": "not_implemented",
            "note": "This feature requires integration with a blockchain explorer API like Etherscan"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Failed to get transactions for wallet {wallet_address}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get wallet transactions: {str(e)}"
        )


@router.get("/contracts/verify", summary="Verify Contract Address")
async def verify_contract_address(contract_address: str):
    """
    Verify if an address is a valid smart contract.
    
    Args:
        contract_address: Contract address to verify
        
    Returns:
        Contract verification information
    """
    try:
        # Validate address format
        if not validate_ethereum_address(contract_address):
            raise HTTPException(
                status_code=400,
                detail="Invalid contract address format"
            )
        
        # This would be implemented with actual contract verification in production
        return {
            "contract_address": contract_address,
            "is_contract": True,  # Mock response
            "is_verified": False,  # Mock response
            "verification_status": "not_implemented",
            "note": "Contract verification requires integration with verification services"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        app_logger.error(f"Failed to verify contract address {contract_address}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to verify contract address: {str(e)}"
        )
