import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Eye, 
  CreditCard, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Camera, 
  Upload, 
  Download, 
  Trash2, 
  Edit3, 
  Lock, 
  Unlock, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Globe, 
  Palette, 
  Clock, 
  Languages, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Activity, 
  BarChart3, 
  Users, 
  EyeOff, 
  Copy, 
  ExternalLink, 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  Star, 
  Heart, 
  Bookmark, 
  Share2, 
  Archive, 
  Flag, 
  HelpCircle, 
  LogOut, 
  Key, 
  Fingerprint, 
  Monitor, 
  Smartphone as Phone, 
  Tablet, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryLow, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Monitor as Computer, 
  Smartphone as Mobile, 
  Headphones, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MapPin, 
  Calendar, 
  Clock as Time, 
  Thermometer, 
  Droplets, 
  Wind, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  Sun as Sunny, 
  Moon as Night, 
  Sunrise, 
  Sunset, 
  Compass, 
  Navigation, 
  Route, 
  Map, 
  Layers, 
  Database, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  HardDrive as Storage, 
  Network, 
  Wifi as Internet, 
  Bluetooth, 
  BluetoothOff, 
  Signal, 
  SignalOff, 
  Radio, 
  RadioOff, 
  Tv, 
  TvOff, 
  Gamepad2, 
  Gamepad2Off, 
  Controller, 
  ControllerOff, 
  Mouse, 
  MouseOff, 
  Keyboard, 
  KeyboardOff, 
  Printer, 
  PrinterOff, 
  Scanner, 
  ScannerOff, 
  Fax, 
  FaxOff, 
  Phone as PhoneCall, 
  PhoneOff, 
  Voicemail, 
  VoicemailOff, 
  MessageCircle, 
  MessageCircleOff, 
  Mail as Email, 
  MailOff, 
  Send, 
  SendOff, 
  Inbox, 
  InboxOff, 
  Outbox, 
  OutboxOff, 
  Archive as ArchiveOff, 
  Trash, 
  TrashOff, 
  Folder, 
  FolderOff, 
  File, 
  FileOff, 
  FileText, 
  FileTextOff, 
  FileImage, 
  FileImageOff, 
  FileVideo, 
  FileVideoOff, 
  FileAudio, 
  FileAudioOff, 
  FilePdf, 
  FilePdfOff, 
  FileSpreadsheet, 
  FileSpreadsheetOff, 
  FilePresentation, 
  FilePresentationOff, 
  FileCode, 
  FileCodeOff, 
  FileArchive, 
  FileArchiveOff, 
  FileCheck, 
  FileCheckOff, 
  FileX, 
  FileXOff, 
  FilePlus, 
  FilePlusOff, 
  FileMinus, 
  FileMinusOff, 
  FileEdit, 
  FileEditOff, 
  FileSearch, 
  FileSearchOff, 
  FileDownload, 
  FileDownloadOff, 
  FileUpload, 
  FileUploadOff, 
  FileCopy, 
  FileCopyOff, 
  FileMove, 
  FileMoveOff, 
  FileLink, 
  FileLinkOff, 
  FileUnlink, 
  FileUnlinkOff, 
  FileLock, 
  FileLockOff, 
  FileUnlock, 
  FileUnlockOff, 
  FileShield, 
  FileShieldOff, 
  FileAlert, 
  FileAlertOff, 
  FileInfo, 
  FileInfoOff, 
  FileQuestion, 
  FileQuestionOff, 
  FileHeart, 
  FileHeartOff, 
  FileStar, 
  FileStarOff, 
  FileBookmark, 
  FileBookmarkOff, 
  FileFlag, 
  FileFlagOff, 
  FileTag, 
  FileTagOff, 
  FileLabel, 
  FileLabelOff, 
  FileBadge, 
  FileBadgeOff, 
  FileAward, 
  FileAwardOff, 
  FileTrophy, 
  FileTrophyOff, 
  FileMedal, 
  FileMedalOff, 
  FileRibbon, 
  FileRibbonOff, 
  FileCrown, 
  FileCrownOff, 
  FileGem, 
  FileGemOff, 
  FileDiamond, 
  FileDiamondOff, 
  FileGold, 
  FileGoldOff, 
  FileSilver, 
  FileSilverOff, 
  FileBronze, 
  FileBronzeOff, 
  FileCopper, 
  FileCopperOff, 
  FileIron, 
  FileIronOff, 
  FileSteel, 
  FileSteelOff, 
  FileAluminum, 
  FileAluminumOff, 
  FileTin, 
  FileTinOff, 
  FileLead, 
  FileLeadOff, 
  FileZinc, 
  FileZincOff, 
  FileNickel, 
  FileNickelOff, 
  FileChromium, 
  FileChromiumOff, 
  FileManganese, 
  FileManganeseOff, 
  FileCobalt, 
  FileCobaltOff, 
  FileTitanium, 
  FileTitaniumOff, 
  FileVanadium, 
  FileVanadiumOff, 
  FileMolybdenum, 
  FileMolybdenumOff, 
  FileTungsten, 
  FileTungstenOff, 
  FilePlatinum, 
  FilePlatinumOff, 
  FilePalladium, 
  FilePalladiumOff, 
  FileRhodium, 
  FileRhodiumOff, 
  FileIridium, 
  FileIridiumOff, 
  FileOsmium, 
  FileOsmiumOff, 
  FileRuthenium, 
  FileRutheniumOff, 
  FileRhenium, 
  FileRheniumOff, 
  FileHafnium, 
  FileHafniumOff, 
  FileTantalum, 
  FileTantalumOff, 
  FileNiobium, 
  FileNiobiumOff, 
  FileZirconium, 
  FileZirconiumOff, 
  FileYttrium, 
  FileYttriumOff, 
  FileScandium, 
  FileScandiumOff, 
  FileLanthanum, 
  FileLanthanumOff, 
  FileCerium, 
  FileCeriumOff, 
  FilePraseodymium, 
  FilePraseodymiumOff, 
  FileNeodymium, 
  FileNeodymiumOff, 
  FilePromethium, 
  FilePromethiumOff, 
  FileSamarium, 
  FileSamariumOff, 
  FileEuropium, 
  FileEuropiumOff, 
  FileGadolinium, 
  FileGadoliniumOff, 
  FileTerbium, 
  FileTerbiumOff, 
  FileDysprosium, 
  FileDysprosiumOff, 
  FileHolmium, 
  FileHolmiumOff, 
  FileErbium, 
  FileErbiumOff, 
  FileThulium, 
  FileThuliumOff, 
  FileYtterbium, 
  FileYtterbiumOff, 
  FileLutetium, 
  FileLutetiumOff, 
  FileActinium, 
  FileActiniumOff, 
  FileThorium, 
  FileThoriumOff, 
  FileProtactinium, 
  FileProtactiniumOff, 
  FileUranium, 
  FileUraniumOff, 
  FileNeptunium, 
  FileNeptuniumOff, 
  FilePlutonium, 
  FilePlutoniumOff, 
  FileAmericium, 
  FileAmericiumOff, 
  FileCurium, 
  FileCuriumOff, 
  FileBerkelium, 
  FileBerkeliumOff, 
  FileCalifornium, 
  FileCaliforniumOff, 
  FileEinsteinium, 
  FileEinsteiniumOff, 
  FileFermium, 
  FileFermiumOff, 
  FileMendelevium, 
  FileMendeleviumOff, 
  FileNobelium, 
  FileNobeliumOff, 
  FileLawrencium, 
  FileLawrenciumOff, 
  FileRutherfordium, 
  FileRutherfordiumOff, 
  FileDubnium, 
  FileDubniumOff, 
  FileSeaborgium, 
  FileSeaborgiumOff, 
  FileBohrium, 
  FileBohriumOff, 
  FileHassium, 
  FileHassiumOff, 
  FileMeitnerium, 
  FileMeitneriumOff, 
  FileDarmstadtium, 
  FileDarmstadtiumOff, 
  FileRoentgenium, 
  FileRoentgeniumOff, 
  FileCopernicium, 
  FileCoperniciumOff, 
  FileNihonium, 
  FileNihoniumOff, 
  FileFlerovium, 
  FileFleroviumOff, 
  FileMoscovium, 
  FileMoscoviumOff, 
  FileLivermorium, 
  FileLivermoriumOff, 
  FileTennessine, 
  FileTennessineOff, 
  FileOganesson, 
  FileOganessonOff
} from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profileImage: string | null;
  bio: string;
  website: string;
  socialMedia: {
    twitter: string;
    linkedin: string;
    github: string;
  };
}

interface Preferences {
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    portfolioUpdates: boolean;
    marketAlerts: boolean;
    newsDigest: boolean;
    securityAlerts: boolean;
    priceAlerts: boolean;
    orderUpdates: boolean;
    socialUpdates: boolean;
  };
  privacy: {
    profileVisibility: 'private' | 'friends' | 'public';
    dataSharing: boolean;
    analytics: boolean;
    marketing: boolean;
    locationSharing: boolean;
    activityTracking: boolean;
  };
  trading: {
    defaultOrderType: 'market' | 'limit' | 'stop' | 'stop-limit';
    confirmOrders: boolean;
    stopLoss: boolean;
    takeProfit: boolean;
    riskManagement: boolean;
    autoRebalance: boolean;
    taxOptimization: boolean;
  };
  display: {
    chartType: 'line' | 'candlestick' | 'area';
    defaultTimeframe: string;
    showGrid: boolean;
    showVolume: boolean;
    showIndicators: boolean;
    compactMode: boolean;
  };
}

interface Security {
  twoFactorEnabled: boolean;
  biometricLogin: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  deviceManagement: boolean;
  passwordExpiry: number;
  loginAttempts: number;
  trustedDevices: Array<{
    id: string;
    name: string;
    type: string;
    lastUsed: Date;
    location: string;
  }>;
}

interface Billing {
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  nextBilling: Date;
  amount: number;
  currency: string;
  paymentMethod: {
    type: string;
    last4: string;
    expiry: string;
  };
  billingHistory: Array<{
    id: string;
    date: Date;
    amount: number;
    description: string;
    status: 'paid' | 'pending' | 'failed';
  }>;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-01',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    profileImage: null,
    bio: 'Passionate investor and financial analyst with 10+ years of experience in the markets.',
    website: 'https://johndoe.com',
    socialMedia: {
      twitter: '@johndoe',
      linkedin: 'johndoe',
      github: 'johndoe'
    }
  });

  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'light',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    notifications: {
      email: true,
      push: true,
      sms: false,
      portfolioUpdates: true,
      marketAlerts: true,
      newsDigest: true,
      securityAlerts: true,
      priceAlerts: true,
      orderUpdates: true,
      socialUpdates: false
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true,
      marketing: false,
      locationSharing: false,
      activityTracking: true
    },
    trading: {
      defaultOrderType: 'market',
      confirmOrders: true,
      stopLoss: true,
      takeProfit: false,
      riskManagement: true,
      autoRebalance: false,
      taxOptimization: true
    },
    display: {
      chartType: 'candlestick',
      defaultTimeframe: '1D',
      showGrid: true,
      showVolume: true,
      showIndicators: true,
      compactMode: false
    }
  });

  const [security, setSecurity] = useState<Security>({
    twoFactorEnabled: true,
    biometricLogin: false,
    sessionTimeout: 30,
    loginNotifications: true,
    deviceManagement: true,
    passwordExpiry: 90,
    loginAttempts: 3,
    trustedDevices: [
      {
        id: '1',
        name: 'MacBook Pro',
        type: 'laptop',
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
        location: 'New York, NY'
      },
      {
        id: '2',
        name: 'iPhone 15',
        type: 'mobile',
        lastUsed: new Date(Date.now() - 30 * 60 * 1000),
        location: 'New York, NY'
      }
    ]
  });

  const [billing, setBilling] = useState<Billing>({
    plan: 'FinSage Pro',
    status: 'active',
    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    amount: 29.99,
    currency: 'USD',
    paymentMethod: {
      type: 'visa',
      last4: '4242',
      expiry: '12/25'
    },
    billingHistory: [
      {
        id: '1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        amount: 29.99,
        description: 'FinSage Pro Monthly',
        status: 'paid'
      },
      {
        id: '2',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        amount: 29.99,
        description: 'FinSage Pro Monthly',
        status: 'paid'
      }
    ]
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = useCallback(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedPreferences = localStorage.getItem('userPreferences');
    const savedSecurity = localStorage.getItem('securitySettings');
    const savedBilling = localStorage.getItem('billingSettings');

    if (savedProfile) setUserProfile(JSON.parse(savedProfile));
    if (savedPreferences) setPreferences(JSON.parse(savedPreferences));
    if (savedSecurity) setSecurity(JSON.parse(savedSecurity));
    if (savedBilling) setBilling(JSON.parse(savedBilling));
  }, []);

  const saveSettings = () => {
    setLoading(true);
    setSaved(false);
    
    setTimeout(() => {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      localStorage.setItem('securitySettings', JSON.stringify(security));
      localStorage.setItem('billingSettings', JSON.stringify(billing));
      
      setLoading(false);
      setSaved(true);
      addNotification('success', 'Settings Saved', 'Your settings have been saved successfully');
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
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

  const handleProfileChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUserProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setUserProfile(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePreferenceChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setPreferences(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSecurityChange = (field: string, value: any) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const removeTrustedDevice = (deviceId: string) => {
    setSecurity(prev => ({
      ...prev,
      trustedDevices: prev.trustedDevices.filter(device => device.id !== deviceId)
    }));
    addNotification('info', 'Device Removed', 'Trusted device has been removed');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'preferences', name: 'Preferences', icon: SettingsIcon },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Eye },
    { id: 'billing', name: 'Billing', icon: CreditCard }
  ];

  const ProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Image */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl">
            {userProfile.profileImage ? (
              <img src={userProfile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-12 h-12" />
            )}
          </div>
          <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{userProfile.firstName} {userProfile.lastName}</h3>
          <p className="text-gray-600">{userProfile.email}</p>
          <div className="flex items-center space-x-4 mt-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={userProfile.firstName}
            onChange={(e) => handleProfileChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={userProfile.lastName}
            onChange={(e) => handleProfileChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={userProfile.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={userProfile.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={userProfile.dateOfBirth}
            onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={userProfile.website}
            onChange={(e) => handleProfileChange('website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          value={userProfile.bio}
          onChange={(e) => handleProfileChange('bio', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Social Media */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
            <input
              type="text"
              value={userProfile.socialMedia.twitter}
              onChange={(e) => handleProfileChange('socialMedia.twitter', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="@username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <input
              type="text"
              value={userProfile.socialMedia.linkedin}
              onChange={(e) => handleProfileChange('socialMedia.linkedin', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
            <input
              type="text"
              value={userProfile.socialMedia.github}
              onChange={(e) => handleProfileChange('socialMedia.github', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="username"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={userProfile.address.street}
              onChange={(e) => handleProfileChange('address.street', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={userProfile.address.city}
              onChange={(e) => handleProfileChange('address.city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={userProfile.address.state}
              onChange={(e) => handleProfileChange('address.state', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              value={userProfile.address.zipCode}
              onChange={(e) => handleProfileChange('address.zipCode', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              value={userProfile.address.country}
              onChange={(e) => handleProfileChange('address.country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="space-y-8">
      {/* General Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={preferences.currency}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
            <select
              value={preferences.timeFormat}
              onChange={(e) => handlePreferenceChange('timeFormat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="12h">12 Hour</option>
              <option value="24h">24 Hour</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trading Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Order Type</label>
            <select
              value={preferences.trading.defaultOrderType}
              onChange={(e) => handlePreferenceChange('trading.defaultOrderType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="market">Market Order</option>
              <option value="limit">Limit Order</option>
              <option value="stop">Stop Order</option>
              <option value="stop-limit">Stop-Limit Order</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.trading.confirmOrders}
              onChange={(e) => handlePreferenceChange('trading.confirmOrders', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Require confirmation for all orders</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.trading.stopLoss}
              onChange={(e) => handlePreferenceChange('trading.stopLoss', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable stop-loss by default</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.trading.takeProfit}
              onChange={(e) => handlePreferenceChange('trading.takeProfit', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable take-profit by default</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.trading.riskManagement}
              onChange={(e) => handlePreferenceChange('trading.riskManagement', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable automatic risk management</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.trading.autoRebalance}
              onChange={(e) => handlePreferenceChange('trading.autoRebalance', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable automatic portfolio rebalancing</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.trading.taxOptimization}
              onChange={(e) => handlePreferenceChange('trading.taxOptimization', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable tax-loss harvesting</span>
          </label>
        </div>
      </div>

      {/* Display Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
            <select
              value={preferences.display.chartType}
              onChange={(e) => handlePreferenceChange('display.chartType', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="line">Line Chart</option>
              <option value="candlestick">Candlestick Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Timeframe</label>
            <select
              value={preferences.display.defaultTimeframe}
              onChange={(e) => handlePreferenceChange('display.defaultTimeframe', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="1m">1 Minute</option>
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1D">1 Day</option>
              <option value="1W">1 Week</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.display.showGrid}
              onChange={(e) => handlePreferenceChange('display.showGrid', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show chart grid</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.display.showVolume}
              onChange={(e) => handlePreferenceChange('display.showVolume', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show volume indicators</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.display.showIndicators}
              onChange={(e) => handlePreferenceChange('display.showIndicators', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Show technical indicators</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.display.compactMode}
              onChange={(e) => handlePreferenceChange('display.compactMode', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Use compact mode</span>
          </label>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-8">
      {/* Security Settings */}
      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.twoFactorEnabled}
                onChange={(e) => handleSecurityChange('twoFactorEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {security.twoFactorEnabled && (
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>2FA is enabled and protecting your account</span>
            </div>
          )}
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Fingerprint className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Biometric Login</h3>
                <p className="text-sm text-gray-600">Use fingerprint or face recognition to log in</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={security.biometricLogin}
                onChange={(e) => handleSecurityChange('biometricLogin', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Session Timeout</h3>
                <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
              </div>
            </div>
            <select
              value={security.sessionTimeout}
              onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Security Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Additional Security</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={security.loginNotifications}
              onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Get notified of new login attempts</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={security.deviceManagement}
              onChange={(e) => handleSecurityChange('deviceManagement', e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable device management</span>
          </label>
        </div>
      </div>

      {/* Trusted Devices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Trusted Devices</h3>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Device</span>
          </button>
        </div>
        
        <div className="space-y-3">
          {security.trustedDevices.map((device) => (
            <div key={device.id} className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                    {device.type === 'laptop' ? <Monitor className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{device.name}</h4>
                    <p className="text-sm text-gray-600">{device.location} • Last used {device.lastUsed.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeTrustedDevice(device.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Password Management */}
      <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Key className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Password</h3>
              <p className="text-sm text-gray-600">Last changed 30 days ago</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-8">
      {/* Notification Channels */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications.email}
                  onChange={(e) => handlePreferenceChange('notifications.email', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications.push}
                  onChange={(e) => handlePreferenceChange('notifications.push', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <div>
                  <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications.sms}
                  onChange={(e) => handlePreferenceChange('notifications.sms', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'portfolioUpdates', label: 'Portfolio Updates', icon: BarChart3, color: 'text-blue-600' },
            { key: 'marketAlerts', label: 'Market Alerts', icon: TrendingUp, color: 'text-green-600' },
            { key: 'newsDigest', label: 'News Digest', icon: Globe, color: 'text-purple-600' },
            { key: 'securityAlerts', label: 'Security Alerts', icon: Shield, color: 'text-red-600' },
            { key: 'priceAlerts', label: 'Price Alerts', icon: Target, color: 'text-orange-600' },
            { key: 'orderUpdates', label: 'Order Updates', icon: Activity, color: 'text-indigo-600' },
            { key: 'socialUpdates', label: 'Social Updates', icon: Users, color: 'text-pink-600' }
          ].map(({ key, label, icon: Icon, color }) => (
            <div key={key} className="p-4 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications[key as keyof typeof preferences.notifications]}
                    onChange={(e) => handlePreferenceChange(`notifications.${key}`, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-8">
      {/* Privacy Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={preferences.privacy.profileVisibility}
              onChange={(e) => handlePreferenceChange('privacy.profileVisibility', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Data & Analytics</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.privacy.dataSharing}
                  onChange={(e) => handlePreferenceChange('privacy.dataSharing', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Allow data sharing for research purposes</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.privacy.analytics}
                  onChange={(e) => handlePreferenceChange('privacy.analytics', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable usage analytics</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.privacy.marketing}
                  onChange={(e) => handlePreferenceChange('privacy.marketing', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Receive marketing communications</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.privacy.locationSharing}
                  onChange={(e) => handlePreferenceChange('privacy.locationSharing', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Share location data</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.privacy.activityTracking}
                  onChange={(e) => handlePreferenceChange('privacy.activityTracking', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Track activity for personalization</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all text-left">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-600">Download your personal data</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all text-left">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-medium text-gray-900">Delete Account</h4>
                <p className="text-sm text-gray-600">Permanently delete your account</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const BillingTab = () => (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{billing.plan}</h3>
            <p className="text-gray-600">Current subscription plan</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${billing.amount}/month</div>
            <div className="text-sm text-gray-600">Next billing: {billing.nextBilling.toLocaleDateString()}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade Plan
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Change Plan
          </button>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="p-6 bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Update
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
            {billing.paymentMethod.type.toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">**** **** **** {billing.paymentMethod.last4}</div>
            <div className="text-sm text-gray-600">Expires {billing.paymentMethod.expiry}</div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
        <div className="space-y-3">
          {billing.billingHistory.map((bill) => (
            <div key={bill.id} className="p-4 bg-white border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{bill.description}</h4>
                  <p className="text-sm text-gray-600">{bill.date.toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">${bill.amount}</div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    bill.status === 'paid' ? 'bg-green-100 text-green-700' :
                    bill.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {bill.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SettingsIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-500">Manage your account settings and preferences</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={saveSettings}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sticky top-24">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'preferences' && <PreferencesTab />}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'privacy' && <PrivacyTab />}
              {activeTab === 'billing' && <BillingTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;