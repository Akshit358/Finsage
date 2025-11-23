import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wallet, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Lock, 
  Coins, 
  BarChart3, 
  Eye, 
  EyeOff,
  Copy,
  ExternalLink,
  Zap,
  Shield,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Bookmark,
  Download,
  Share2,
  Filter,
  Search,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Plus,
  Minus,
  Send,
  Receive,
  Swap,
  Stethoscope,
  Layers,
  Globe,
  Link2,
  Database,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';

interface DeFiPosition {
  id: string;
  protocol: string;
  token: string;
  amount: number;
  value: number;
  gain: number;
  gainPercent: number;
  apy: number;
  logo: string;
  category: 'lending' | 'staking' | 'liquidity' | 'yield';
}

interface NFTPortfolio {
  id: string;
  name: string;
  collection: string;
  image: string;
  floorPrice: number;
  lastSale: number;
  value: number;
  gain: number;
  gainPercent: number;
  rarity: string;
  traits: Array<{ trait: string; value: string; rarity: number }>;
}

interface Transaction {
  id: string;
  type: 'swap' | 'stake' | 'unstake' | 'lend' | 'borrow' | 'transfer';
  token: string;
  amount: number;
  value: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  hash: string;
  protocol: string;
}

interface WalletData {
  address: string;
  balance: number;
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  positions: DeFiPosition[];
  nfts: NFTPortfolio[];
  transactions: Transaction[];
  staking: {
    totalStaked: number;
    rewards: number;
    apy: number;
    validators: number;
  };
  lending: {
    totalSupplied: number;
    totalBorrowed: number;
    utilizationRate: number;
    healthFactor: number;
  };
}

const Blockchain: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('portfolio');
  const [showBalance, setShowBalance] = useState(true);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [favoritePositions, setFavoritePositions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('value');

  // Real-time data simulation
  useEffect(() => {
    if (!realTimeEnabled || !walletData) return;

    const interval = setInterval(() => {
      setWalletData(prev => {
        if (!prev) return prev;
        
        const updatedPositions = prev.positions.map(position => ({
          ...position,
          value: position.value * (1 + (Math.random() - 0.5) * 0.02),
          gain: position.gain * (1 + (Math.random() - 0.5) * 0.01),
          apy: Math.max(0, position.apy + (Math.random() - 0.5) * 0.5)
        }));

        const newTotalValue = updatedPositions.reduce((sum, pos) => sum + pos.value, 0);
        const newTotalGain = updatedPositions.reduce((sum, pos) => sum + pos.gain, 0);
        
        return {
          ...prev,
          positions: updatedPositions,
          totalValue: newTotalValue,
          totalGain: newTotalGain,
          totalGainPercent: (newTotalGain / (newTotalValue - newTotalGain)) * 100,
          staking: {
            ...prev.staking,
            rewards: prev.staking.rewards + Math.random() * 0.1,
            apy: Math.max(0, prev.staking.apy + (Math.random() - 0.5) * 0.2)
          },
          lending: {
            ...prev.lending,
            utilizationRate: Math.max(0, Math.min(100, prev.lending.utilizationRate + (Math.random() - 0.5) * 2))
          }
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeEnabled, walletData]);

  useEffect(() => {
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletConnected(true);
      loadWalletData(savedWallet);
    }
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setWalletConnected(true);
      localStorage.setItem('walletAddress', mockAddress);
      loadWalletData(mockAddress);
      setLoading(false);
      
      addNotification('success', 'Wallet Connected', `Successfully connected wallet ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`);
    }, 1500);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletData(null);
    localStorage.removeItem('walletAddress');
    addNotification('info', 'Wallet Disconnected', 'Your wallet has been disconnected');
  };

  const loadWalletData = useCallback((address: string) => {
    setLoading(true);
    
    setTimeout(() => {
      const mockData: WalletData = {
        address,
        balance: 2.5,
        totalValue: 125000 + Math.random() * 10000,
        totalGain: 15000 + Math.random() * 2000,
        totalGainPercent: 13.64 + Math.random() * 2,
        positions: [
          {
            id: '1',
            protocol: 'Uniswap V3',
            token: 'ETH',
            amount: 2.5,
            value: 6250 + Math.random() * 500,
            gain: 1250 + Math.random() * 200,
            gainPercent: 25.0 + Math.random() * 5,
            apy: 8.5 + Math.random() * 2,
            logo: '🦄',
            category: 'liquidity'
          },
          {
            id: '2',
            protocol: 'Compound',
            token: 'USDC',
            amount: 10000,
            value: 10000 + Math.random() * 200,
            gain: 500 + Math.random() * 100,
            gainPercent: 5.0 + Math.random() * 1,
            apy: 4.2 + Math.random() * 1,
            logo: '🏦',
            category: 'lending'
          },
          {
            id: '3',
            protocol: 'Aave',
            token: 'WBTC',
            amount: 0.1,
            value: 3500 + Math.random() * 300,
            gain: 700 + Math.random() * 150,
            gainPercent: 25.0 + Math.random() * 3,
            apy: 12.3 + Math.random() * 2,
            logo: '🦅',
            category: 'lending'
          },
          {
            id: '4',
            protocol: 'Yearn Finance',
            token: 'DAI',
            amount: 5000,
            value: 5000 + Math.random() * 200,
            gain: 250 + Math.random() * 50,
            gainPercent: 5.3 + Math.random() * 1,
            apy: 6.8 + Math.random() * 1.5,
            logo: '🏛️',
            category: 'yield'
          },
          {
            id: '5',
            protocol: 'Lido',
            token: 'stETH',
            amount: 10,
            value: 20000 + Math.random() * 1000,
            gain: 2000 + Math.random() * 300,
            gainPercent: 11.1 + Math.random() * 2,
            apy: 5.2 + Math.random() * 1,
            logo: '🏛️',
            category: 'staking'
          }
        ],
        nfts: [
          {
            id: '1',
            name: 'CryptoPunk #1234',
            collection: 'CryptoPunks',
            image: 'https://via.placeholder.com/150',
            floorPrice: 25.5 + Math.random() * 5,
            lastSale: 30.0 + Math.random() * 3,
            value: 30.0 + Math.random() * 4,
            gain: 4.5 + Math.random() * 2,
            gainPercent: 17.6 + Math.random() * 3,
            rarity: 'Rare',
            traits: [
              { trait: 'Type', value: 'Alien', rarity: 0.09 },
              { trait: 'Accessory', value: 'Cap Forward', rarity: 0.14 }
            ]
          },
          {
            id: '2',
            name: 'Bored Ape #5678',
            collection: 'Bored Ape Yacht Club',
            image: 'https://via.placeholder.com/150',
            floorPrice: 15.2 + Math.random() * 3,
            lastSale: 18.0 + Math.random() * 2,
            value: 18.0 + Math.random() * 3,
            gain: 2.8 + Math.random() * 1,
            gainPercent: 18.4 + Math.random() * 2,
            rarity: 'Common',
            traits: [
              { trait: 'Background', value: 'Blue', rarity: 0.15 },
              { trait: 'Fur', value: 'Brown', rarity: 0.12 }
            ]
          },
          {
            id: '3',
            name: 'Art Blocks #9999',
            collection: 'Art Blocks',
            image: 'https://via.placeholder.com/150',
            floorPrice: 2.1 + Math.random() * 1,
            lastSale: 2.5 + Math.random() * 0.5,
            value: 2.5 + Math.random() * 0.8,
            gain: 0.4 + Math.random() * 0.3,
            gainPercent: 19.0 + Math.random() * 2,
            rarity: 'Epic',
            traits: [
              { trait: 'Algorithm', value: 'Fidenza', rarity: 0.05 },
              { trait: 'Color', value: 'Red', rarity: 0.08 }
            ]
          }
        ],
        transactions: [
          {
            id: '1',
            type: 'swap',
            token: 'ETH',
            amount: 1.5,
            value: 3750,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'completed',
            hash: '0x1234...5678',
            protocol: 'Uniswap V3'
          },
          {
            id: '2',
            type: 'stake',
            token: 'ETH',
            amount: 2.0,
            value: 5000,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            status: 'completed',
            hash: '0x2345...6789',
            protocol: 'Lido'
          },
          {
            id: '3',
            type: 'lend',
            token: 'USDC',
            amount: 5000,
            value: 5000,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: 'completed',
            hash: '0x3456...7890',
            protocol: 'Compound'
          }
        ],
        staking: {
          totalStaked: 50000 + Math.random() * 5000,
          rewards: 2500 + Math.random() * 200,
          apy: 5.0 + Math.random() * 1,
          validators: 3
        },
        lending: {
          totalSupplied: 30000 + Math.random() * 3000,
          totalBorrowed: 15000 + Math.random() * 1500,
          utilizationRate: 50.0 + Math.random() * 10,
          healthFactor: 2.5 + Math.random() * 0.5
        }
      };
      
      setWalletData(mockData);
      setLoading(false);
      setIsRefreshing(false);
      
      addNotification('success', 'Portfolio Loaded', 'Your DeFi portfolio has been updated');
    }, 2000);
  }, []);

  const refreshPortfolio = () => {
    if (walletConnected && walletData) {
      setIsRefreshing(true);
      loadWalletData(walletData.address);
    }
  };

  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const toggleFavorite = (positionId: string) => {
    setFavoritePositions(prev => 
      prev.includes(positionId) 
        ? prev.filter(id => id !== positionId)
        : [...prev, positionId]
    );
  };

  const copyAddress = () => {
    if (walletData) {
      navigator.clipboard.writeText(walletData.address);
      addNotification('success', 'Address Copied', 'Wallet address copied to clipboard');
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap': return <Swap className="w-4 h-4 text-blue-600" />;
      case 'stake': return <Lock className="w-4 h-4 text-green-600" />;
      case 'unstake': return <Unlock className="w-4 h-4 text-orange-600" />;
      case 'lend': return <ArrowUpRight className="w-4 h-4 text-purple-600" />;
      case 'borrow': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'transfer': return <Send className="w-4 h-4 text-gray-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredPositions = walletData?.positions.filter(position => {
    const matchesSearch = position.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.token.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || position.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'value': return b.value - a.value;
      case 'gain': return b.gain - a.gain;
      case 'apy': return b.apy - a.apy;
      default: return 0;
    }
  });

  const tabs = [
    { id: 'portfolio', name: 'Portfolio', icon: Wallet },
    { id: 'nfts', name: 'NFTs', icon: Layers },
    { id: 'staking', name: 'Staking', icon: Lock },
    { id: 'lending', name: 'Lending', icon: Coins },
    { id: 'transactions', name: 'Transactions', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: Activity }
  ];

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Link2 className="w-8 h-8 text-purple-600" />
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Blockchain & Web3</h1>
                    <p className="text-sm text-gray-500">Connect your wallet to access DeFi features</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Connect Wallet Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
              <p className="text-lg text-gray-600 mb-8">
                Connect your Web3 wallet to view your DeFi portfolio, NFTs, and manage your crypto assets
              </p>
            </div>
            
            <button
              onClick={connectWallet}
              disabled={loading}
              className="w-full max-w-md mx-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Wallet className="w-6 h-6" />
                  <span>Connect Wallet</span>
                </div>
              )}
            </button>

            {/* Supported Wallets */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Wallets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'MetaMask', icon: '🦊', color: 'bg-orange-100 text-orange-700' },
                  { name: 'WalletConnect', icon: '🔗', color: 'bg-blue-100 text-blue-700' },
                  { name: 'Coinbase', icon: '🔵', color: 'bg-blue-100 text-blue-700' },
                  { name: 'Trust Wallet', icon: '🛡️', color: 'bg-green-100 text-green-700' }
                ].map((wallet) => (
                  <div key={wallet.name} className={`p-3 rounded-xl ${wallet.color} text-center`}>
                    <div className="text-2xl mb-1">{wallet.icon}</div>
                    <div className="text-sm font-medium">{wallet.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">DeFi Portfolio</h4>
                <p className="text-sm text-gray-600">Track your yield farming and liquidity positions</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <Layers className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">NFT Collection</h4>
                <p className="text-sm text-gray-600">View and manage your NFT portfolio</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 mb-1">Real-time Analytics</h4>
                <p className="text-sm text-gray-600">Monitor your crypto performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Link2 className="w-8 h-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Blockchain & Web3</h1>
                  <p className="text-sm text-gray-500">
                    {walletData?.address.slice(0, 6)}...{walletData?.address.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  realTimeEnabled 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>{realTimeEnabled ? 'Live' : 'Static'}</span>
              </button>
              
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{showBalance ? 'Show' : 'Hide'}</span>
              </button>
              
              <button
                onClick={refreshPortfolio}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={disconnectWallet}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${
                  notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
                  notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                  notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                  'bg-blue-50 border-blue-400 text-blue-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                    {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                    {notification.type === 'info' && <Info className="w-5 h-5" />}
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm opacity-90">{notification.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Portfolio Overview */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Portfolio Overview</h2>
              <p className="text-gray-600">Your DeFi portfolio performance</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyAddress}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Address</span>
              </button>
              <a
                href={`https://etherscan.io/address/${walletData?.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Etherscan</span>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {showBalance ? `$${walletData?.totalValue.toLocaleString()}` : '••••••'}
              </div>
              <div className="text-sm text-gray-600 mb-2">Total Value</div>
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  {showBalance ? `+$${walletData?.totalGain.toLocaleString()}` : '••••'}
                </span>
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {showBalance ? `+${walletData?.totalGainPercent.toFixed(2)}%` : '••••'}
              </div>
              <div className="text-sm text-gray-600 mb-2">Total Return</div>
              <div className="text-xs text-gray-500">24h change</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {walletData?.positions.length || 0}
              </div>
              <div className="text-sm text-gray-600 mb-2">Active Positions</div>
              <div className="text-xs text-gray-500">Across protocols</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {walletData?.nfts.length || 0}
              </div>
              <div className="text-sm text-gray-600 mb-2">NFTs Owned</div>
              <div className="text-xs text-gray-500">In collections</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Tab */}
        {selectedTab === 'portfolio' && walletData && (
          <div className="space-y-8">
            {/* Search and Filters */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search protocols or tokens..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Categories</option>
                    <option value="lending">Lending</option>
                    <option value="staking">Staking</option>
                    <option value="liquidity">Liquidity</option>
                    <option value="yield">Yield Farming</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="value">Sort by Value</option>
                    <option value="gain">Sort by Gain</option>
                    <option value="apy">Sort by APY</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Positions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPositions?.map((position) => (
                <div key={position.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-xl">
                        {position.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{position.protocol}</h3>
                        <p className="text-sm text-gray-600">{position.token}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(position.id)}
                      className="text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      <Star className={`w-5 h-5 ${favoritePositions.includes(position.id) ? 'fill-current text-yellow-500' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount</span>
                      <span className="font-medium">{position.amount} {position.token}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Value</span>
                      <span className="font-semibold text-lg">
                        {showBalance ? `$${position.value.toLocaleString()}` : '••••'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">APY</span>
                      <span className="font-medium text-green-600">{position.apy.toFixed(2)}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Gain</span>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          {showBalance ? `+$${position.gain.toLocaleString()}` : '••••'}
                        </div>
                        <div className="text-sm text-green-600">
                          +{position.gainPercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">{position.category}</span>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NFTs Tab */}
        {selectedTab === 'nfts' && walletData && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">NFT Portfolio</h2>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {walletData.nfts.map((nft) => (
                <div key={nft.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <div className="text-6xl">🖼️</div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{nft.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        nft.rarity === 'Rare' ? 'bg-purple-100 text-purple-700' :
                        nft.rarity === 'Epic' ? 'bg-pink-100 text-pink-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {nft.rarity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{nft.collection}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Value</span>
                        <span className="font-semibold text-lg">
                          {showBalance ? `${nft.value.toFixed(2)} ETH` : '•••• ETH'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Floor Price</span>
                        <span className="text-sm">{nft.floorPrice.toFixed(2)} ETH</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Gain</span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {showBalance ? `+${nft.gain.toFixed(2)} ETH` : '••••'}
                          </div>
                          <div className="text-xs text-green-600">
                            +{nft.gainPercent.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">Traits</div>
                      <div className="space-y-1">
                        {nft.traits.slice(0, 2).map((trait, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600">{trait.trait}</span>
                            <span className="text-gray-900">{trait.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staking Tab */}
        {selectedTab === 'staking' && walletData && (
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Staking Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <Lock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {showBalance ? `${walletData.staking.totalStaked.toLocaleString()} ETH` : '•••• ETH'}
                  </div>
                  <div className="text-sm text-gray-600">Total Staked</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {showBalance ? `${walletData.staking.rewards.toLocaleString()} ETH` : '•••• ETH'}
                  </div>
                  <div className="text-sm text-gray-600">Rewards Earned</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {walletData.staking.apy.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-600">APY</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                  <Shield className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {walletData.staking.validators}
                  </div>
                  <div className="text-sm text-gray-600">Validators</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lending Tab */}
        {selectedTab === 'lending' && walletData && (
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lending Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <ArrowUpRight className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {showBalance ? `$${walletData.lending.totalSupplied.toLocaleString()}` : '••••'}
                  </div>
                  <div className="text-sm text-gray-600">Total Supplied</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl">
                  <ArrowDownRight className="w-8 h-8 text-red-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {showBalance ? `$${walletData.lending.totalBorrowed.toLocaleString()}` : '••••'}
                  </div>
                  <div className="text-sm text-gray-600">Total Borrowed</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <Activity className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {walletData.lending.utilizationRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Utilization Rate</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {walletData.lending.healthFactor.toFixed(1)}x
                  </div>
                  <div className="text-sm text-gray-600">Health Factor</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {selectedTab === 'transactions' && walletData && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {walletData.transactions.map((tx) => (
                <div key={tx.id} className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">{tx.type}</h3>
                        <p className="text-sm text-gray-600">{tx.protocol}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {showBalance ? `${tx.amount} ${tx.token}` : '••••'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {showBalance ? `$${tx.value.toLocaleString()}` : '••••'}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {tx.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Analytics</h2>
            <div className="h-64 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Analytics Dashboard</p>
                <p className="text-sm">Advanced portfolio analytics and insights will be displayed here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blockchain;