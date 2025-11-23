import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  BarChart3, 
  PieChart, 
  Users,
  Calendar,
  Clock,
  Shield,
  Zap,
  Brain,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Settings,
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  Volume2,
  Layers,
  Grid3X3,
  Maximize,
  Minimize,
  Activity,
  Building,
  Globe,
  Heart,
  Leaf,
  Award,
  Trophy,
  Gift,
  Home,
  Car,
  GraduationCap,
  Briefcase,
  PiggyBank,
  CreditCard,
  Banknote,
  Calculator,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const RoboAdvisor: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    age: 30,
    annualIncome: 75000,
    employmentStatus: 'employed',
    dependents: 0,
    
    // Financial Situation
    totalAssets: 100000,
    totalDebt: 25000,
    monthlyExpenses: 4000,
    emergencyFund: 10000,
    
    // Investment Experience
    experience: 'beginner',
    riskTolerance: 'moderate',
    investmentAmount: 10000,
    timeHorizon: '5-10',
    
    // Goals
    primaryGoal: 'retirement',
    secondaryGoals: [] as string[],
    targetAmount: 1000000,
    targetDate: '2035',
    
    // Preferences
    investmentStyle: 'balanced',
    rebalancingFrequency: 'quarterly',
    taxConsideration: true,
    esgInvesting: false
  });
  
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);
  const [favoriteRecommendations, setFavoriteRecommendations] = useState<Set<string>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<any>({});

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic information about yourself', icon: Users },
    { number: 2, title: 'Financial Profile', description: 'Your current financial status', icon: DollarSign },
    { number: 3, title: 'Investment Profile', description: 'Your investment experience and preferences', icon: Target },
    { number: 4, title: 'Goals & Timeline', description: 'What you want to achieve', icon: Calendar },
    { number: 5, title: 'Preferences', description: 'Investment style and preferences', icon: Settings },
    { number: 6, title: 'Recommendations', description: 'Your personalized investment plan', icon: Brain }
  ];

  const employmentOptions = [
    { value: 'employed', label: 'Employed', icon: Briefcase, description: 'Full-time employment' },
    { value: 'self-employed', label: 'Self-Employed', icon: Building, description: 'Freelance or business owner' },
    { value: 'retired', label: 'Retired', icon: Award, description: 'Retirement income' },
    { value: 'student', label: 'Student', icon: GraduationCap, description: 'Currently studying' },
    { value: 'unemployed', label: 'Unemployed', icon: Users, description: 'Looking for work' }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to investing', color: 'green' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience', color: 'blue' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced investor', color: 'purple' },
    { value: 'expert', label: 'Expert', description: 'Professional level', color: 'red' }
  ];

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative', description: 'Low risk, stable returns', color: 'green' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced risk and return', color: 'yellow' },
    { value: 'aggressive', label: 'Aggressive', description: 'High risk, high potential', color: 'red' }
  ];

  const timeHorizons = [
    { value: '1-3', label: 'Short Term (1-3 years)', icon: Clock, description: 'Near-term goals' },
    { value: '3-5', label: 'Medium Term (3-5 years)', icon: Calendar, description: 'Mid-term planning' },
    { value: '5-10', label: 'Long Term (5-10 years)', icon: Target, description: 'Long-term growth' },
    { value: '10+', label: 'Very Long Term (10+ years)', icon: TrendingUp, description: 'Retirement planning' }
  ];

  const primaryGoals = [
    { value: 'retirement', label: 'Retirement Planning', icon: Award, color: 'blue' },
    { value: 'wealth', label: 'Wealth Building', icon: TrendingUp, color: 'green' },
    { value: 'income', label: 'Income Generation', icon: DollarSign, color: 'purple' },
    { value: 'education', label: 'Education Funding', icon: GraduationCap, color: 'orange' },
    { value: 'home', label: 'Home Purchase', icon: Home, color: 'red' },
    { value: 'emergency', label: 'Emergency Fund', icon: Shield, color: 'yellow' }
  ];

  const secondaryGoals = [
    { value: 'travel', label: 'Travel Fund', icon: Globe, color: 'blue' },
    { value: 'vehicle', label: 'Vehicle Purchase', icon: Car, color: 'green' },
    { value: 'wedding', label: 'Wedding Fund', icon: Heart, color: 'pink' },
    { value: 'business', label: 'Business Investment', icon: Building, color: 'purple' },
    { value: 'charity', label: 'Charitable Giving', icon: Gift, color: 'orange' },
    { value: 'hobby', label: 'Hobby Investment', icon: Star, color: 'yellow' }
  ];

  const investmentStyles = [
    { value: 'conservative', label: 'Conservative', description: 'Low risk, stable returns', expectedReturn: '6-8%', volatility: 'Low' },
    { value: 'balanced', label: 'Balanced', description: 'Moderate risk and return', expectedReturn: '8-10%', volatility: 'Medium' },
    { value: 'growth', label: 'Growth', description: 'Higher risk for growth', expectedReturn: '10-12%', volatility: 'High' },
    { value: 'aggressive', label: 'Aggressive', description: 'Maximum growth potential', expectedReturn: '12-15%', volatility: 'Very High' }
  ];

  const rebalancingFrequencies = [
    { value: 'monthly', label: 'Monthly', description: 'Frequent rebalancing' },
    { value: 'quarterly', label: 'Quarterly', description: 'Regular rebalancing' },
    { value: 'annually', label: 'Annually', description: 'Annual rebalancing' },
    { value: 'never', label: 'Never', description: 'No rebalancing' }
  ];

  useEffect(() => {
    // Animate values when recommendations change
    if (recommendations) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [recommendations]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateRecommendations = async () => {
    setLoading(true);
    setIsAnimating(true);
    
    setTimeout(() => {
      // Calculate risk score based on inputs
      let riskScore = 5; // Base moderate risk
      
      // Age factor
      if (formData.age < 30) riskScore += 2;
      else if (formData.age > 50) riskScore -= 2;
      
      // Experience factor
      if (formData.experience === 'expert') riskScore += 2;
      else if (formData.experience === 'beginner') riskScore -= 1;
      
      // Time horizon factor
      if (formData.timeHorizon === '10+') riskScore += 2;
      else if (formData.timeHorizon === '1-3') riskScore -= 2;
      
      // Income stability
      if (formData.employmentStatus === 'self-employed') riskScore -= 1;
      
      riskScore = Math.max(1, Math.min(10, riskScore));
      
      // Generate portfolio based on risk score
      const portfolios = {
        conservative: {
          stocks: 30,
          bonds: 50,
          cash: 15,
          alternatives: 5,
          expectedReturn: 6.5,
          volatility: 8.2,
          sharpeRatio: 0.8,
          maxDrawdown: -3.2
        },
        moderate: {
          stocks: 60,
          bonds: 30,
          cash: 5,
          alternatives: 5,
          expectedReturn: 8.5,
          volatility: 12.1,
          sharpeRatio: 1.0,
          maxDrawdown: -5.8
        },
        aggressive: {
          stocks: 80,
          bonds: 15,
          cash: 0,
          alternatives: 5,
          expectedReturn: 10.2,
          volatility: 18.7,
          sharpeRatio: 1.2,
          maxDrawdown: -8.5
        }
      };
      
      let portfolioType = 'moderate';
      if (riskScore <= 3) portfolioType = 'conservative';
      else if (riskScore >= 7) portfolioType = 'aggressive';
      
      const portfolio = portfolios[portfolioType as keyof typeof portfolios];
      
      // Generate specific recommendations
      const stockRecommendations = [
        { 
          symbol: 'VTI', 
          name: 'Vanguard Total Stock Market ETF', 
          allocation: portfolio.stocks * 0.4, 
          reasoning: 'Broad market exposure',
          expenseRatio: 0.03,
          riskLevel: 'Low',
          category: 'US Large Cap',
          performance: { '1Y': 12.5, '3Y': 8.2, '5Y': 10.1 },
          isFavorite: false
        },
        { 
          symbol: 'VEA', 
          name: 'Vanguard FTSE Developed Markets ETF', 
          allocation: portfolio.stocks * 0.3, 
          reasoning: 'International diversification',
          expenseRatio: 0.05,
          riskLevel: 'Medium',
          category: 'International',
          performance: { '1Y': 8.7, '3Y': 5.4, '5Y': 7.2 },
          isFavorite: false
        },
        { 
          symbol: 'VWO', 
          name: 'Vanguard FTSE Emerging Markets ETF', 
          allocation: portfolio.stocks * 0.2, 
          reasoning: 'Emerging market growth',
          expenseRatio: 0.10,
          riskLevel: 'High',
          category: 'Emerging Markets',
          performance: { '1Y': 15.2, '3Y': 6.8, '5Y': 8.9 },
          isFavorite: false
        },
        { 
          symbol: 'VUG', 
          name: 'Vanguard Growth ETF', 
          allocation: portfolio.stocks * 0.1, 
          reasoning: 'Growth potential',
          expenseRatio: 0.04,
          riskLevel: 'Medium',
          category: 'Growth',
          performance: { '1Y': 18.3, '3Y': 12.1, '5Y': 14.7 },
          isFavorite: false
        }
      ];
      
      const bondRecommendations = [
        { 
          symbol: 'BND', 
          name: 'Vanguard Total Bond Market ETF', 
          allocation: portfolio.bonds * 0.6, 
          reasoning: 'Core bond exposure',
          expenseRatio: 0.035,
          riskLevel: 'Low',
          category: 'Total Bond',
          performance: { '1Y': 2.1, '3Y': 3.2, '5Y': 2.8 },
          isFavorite: false
        },
        { 
          symbol: 'VGLT', 
          name: 'Vanguard Long-Term Treasury ETF', 
          allocation: portfolio.bonds * 0.4, 
          reasoning: 'Interest rate protection',
          expenseRatio: 0.05,
          riskLevel: 'Low',
          category: 'Treasury',
          performance: { '1Y': 1.8, '3Y': 2.9, '5Y': 2.5 },
          isFavorite: false
        }
      ];
      
      const cashRecommendations = [
        { 
          symbol: 'VMMXX', 
          name: 'Vanguard Prime Money Market Fund', 
          allocation: portfolio.cash, 
          reasoning: 'Liquidity and safety',
          expenseRatio: 0.16,
          riskLevel: 'Very Low',
          category: 'Money Market',
          performance: { '1Y': 4.2, '3Y': 2.1, '5Y': 1.8 },
          isFavorite: false
        }
      ];
      
      setRecommendations({
        riskScore,
        portfolioType,
        portfolio,
        allocations: [...stockRecommendations, ...bondRecommendations, ...cashRecommendations],
        monthlyContribution: Math.max(100, Math.floor(formData.investmentAmount / 12)),
        rebalancingFrequency: formData.rebalancingFrequency,
        expectedValue: {
          '1year': formData.investmentAmount * (1 + portfolio.expectedReturn / 100),
          '5year': formData.investmentAmount * Math.pow(1 + portfolio.expectedReturn / 100, 5),
          '10year': formData.investmentAmount * Math.pow(1 + portfolio.expectedReturn / 100, 10)
        },
        nextSteps: [
          'Open a brokerage account if you don\'t have one',
          'Set up automatic monthly contributions',
          'Implement the recommended asset allocation',
          'Schedule quarterly portfolio reviews',
          'Consider tax-advantaged accounts (401k, IRA)'
        ],
        riskAnalysis: {
          suitability: riskScore >= 6 ? 'High' : riskScore >= 4 ? 'Medium' : 'Low',
          diversification: 'Well-diversified across asset classes',
          liquidity: portfolio.cash > 5 ? 'Adequate' : 'Consider increasing',
          taxEfficiency: formData.taxConsideration ? 'Tax-optimized' : 'Standard'
        }
      });
      
      setCurrentStep(6);
      setLoading(false);
      setIsAnimating(false);
    }, 2000);
  };

  const generateComparison = () => {
    setShowComparison(true);
    setComparisonData({
      conservative: { return: 6.5, risk: 2, volatility: 8.2 },
      moderate: { return: 8.5, risk: 5, volatility: 12.1 },
      aggressive: { return: 10.2, risk: 8, volatility: 18.7 }
    });
  };

  const toggleFavorite = (symbol: string) => {
    setFavoriteRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  const toggleRecommendationExpansion = (symbol: string) => {
    setExpandedRecommendation(prev => prev === symbol ? null : symbol);
  };

  const StepIndicator = () => (
    <div className="flex justify-between items-center mb-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
            currentStep >= step.number 
              ? 'border-blue-500 bg-blue-500 text-white shadow-lg' 
              : 'border-gray-300 bg-white text-gray-400'
          }`}>
            {currentStep > step.number ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <step.icon className="w-6 h-6" />
            )}
          </div>
          <div className="ml-4">
            <p className={`text-sm font-medium ${
              currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {step.title}
            </p>
            <p className="text-xs text-gray-400">{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className={`w-5 h-5 mx-4 ${
              currentStep > step.number ? 'text-blue-500' : 'text-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const Step1 = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center mb-6">
        <Users className="w-8 h-8 text-blue-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <div className="relative">
            <input
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="18"
              max="100"
            />
            <div className="absolute right-3 top-3 text-gray-400">years</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Annual Income</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.annualIncome}
              onChange={(e) => handleInputChange('annualIncome', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <label className="block text-sm font-medium text-gray-700">Employment Status</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employmentOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleInputChange('employmentStatus', option.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.employmentStatus === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <IconComponent className="w-6 h-6 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <label className="block text-sm font-medium text-gray-700">Number of Dependents</label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleInputChange('dependents', Math.max(0, formData.dependents - 1))}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="text-2xl font-bold text-gray-900 w-12 text-center">{formData.dependents}</div>
          <button
            onClick={() => handleInputChange('dependents', formData.dependents + 1)}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Next Step
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-center mb-6">
        <DollarSign className="w-8 h-8 text-green-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Financial Profile</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Total Assets</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.totalAssets}
              onChange={(e) => handleInputChange('totalAssets', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Total Debt</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.totalDebt}
              onChange={(e) => handleInputChange('totalDebt', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Monthly Expenses</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.monthlyExpenses}
              onChange={(e) => handleInputChange('monthlyExpenses', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Emergency Fund</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.emergencyFund}
              onChange={(e) => handleInputChange('emergencyFund', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Next Step
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <Target className="w-8 h-8 text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Investment Experience</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Experience Level</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleInputChange('experience', level.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.experience === level.value
                      ? `border-${level.color}-500 bg-${level.color}-50 text-${level.color}-700`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium capitalize">{level.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Risk Tolerance</label>
            <div className="space-y-4">
              {riskToleranceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('riskTolerance', option.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.riskTolerance === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-lg font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.riskTolerance === option.value
                        ? `border-${option.color}-500 bg-${option.color}-500`
                        : 'border-gray-300'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={formData.investmentAmount}
                onChange={(e) => handleInputChange('investmentAmount', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                min="1000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Time Horizon</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timeHorizons.map((horizon) => (
                <button
                  key={horizon.value}
                  onClick={() => handleInputChange('timeHorizon', horizon.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.timeHorizon === horizon.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <horizon.icon className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="text-sm font-medium">{horizon.label}</div>
                      <div className="text-xs text-gray-500">{horizon.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(4)}
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Next Step
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <Calendar className="w-8 h-8 text-orange-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Financial Goals</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Primary Goal</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {primaryGoals.map((goal) => {
                const IconComponent = goal.icon;
                return (
                  <button
                    key={goal.value}
                    onClick={() => handleInputChange('primaryGoal', goal.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.primaryGoal === goal.value
                        ? `border-${goal.color}-500 bg-${goal.color}-50 text-${goal.color}-700`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent className="w-6 h-6 mr-3" />
                      <div className="text-left">
                        <div className="text-sm font-medium">{goal.label}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Secondary Goals (Optional)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {secondaryGoals.map((goal) => {
                const IconComponent = goal.icon;
                const isSelected = formData.secondaryGoals.includes(goal.value);
                return (
                  <button
                    key={goal.value}
                    onClick={() => handleMultiSelect('secondaryGoals', goal.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? `border-${goal.color}-500 bg-${goal.color}-50 text-${goal.color}-700`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <IconComponent className="w-6 h-6 mr-3" />
                      <div className="text-left">
                        <div className="text-sm font-medium">{goal.label}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Target Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => handleInputChange('targetAmount', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  min="1000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Target Date</label>
              <input
                type="number"
                value={formData.targetDate}
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                min="2024"
                max="2100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(3)}
          className="flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(5)}
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Next Step
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <Settings className="w-8 h-8 text-red-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Investment Preferences</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Investment Style</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investmentStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => handleInputChange('investmentStyle', style.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.investmentStyle === style.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-medium">{style.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{style.description}</div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                        Return: {style.expectedReturn}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        Risk: {style.volatility}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rebalancing Frequency</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rebalancingFrequencies.map((frequency) => (
                <button
                  key={frequency.value}
                  onClick={() => handleInputChange('rebalancingFrequency', frequency.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.rebalancingFrequency === frequency.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium">{frequency.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{frequency.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Tax Considerations</label>
                <p className="text-xs text-gray-500">Optimize for tax efficiency</p>
              </div>
              <button
                onClick={() => handleInputChange('taxConsideration', !formData.taxConsideration)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  formData.taxConsideration ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    formData.taxConsideration ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">ESG Investing</label>
                <p className="text-xs text-gray-500">Environmental, Social, and Governance focus</p>
              </div>
              <button
                onClick={() => handleInputChange('esgInvesting', !formData.esgInvesting)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  formData.esgInvesting ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    formData.esgInvesting ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(4)}
          className="flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <button
          onClick={generateRecommendations}
          disabled={loading}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="w-5 h-5 mr-2" />
              Generate Recommendations
            </>
          )}
        </button>
      </div>
    </div>
  );

  const Step6 = () => (
    <div className="space-y-6">
      {recommendations && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Risk Score</p>
                  <p className="text-3xl font-bold">{recommendations.riskScore}/10</p>
                </div>
                <Shield className="w-8 h-8 text-green-200" />
              </div>
              <div className="mt-4">
                <span className="text-green-200 text-sm">Risk Assessment</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Expected Return</p>
                  <p className="text-3xl font-bold">{recommendations.portfolio.expectedReturn.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
              <div className="mt-4">
                <span className="text-blue-200 text-sm">Annual projection</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Volatility</p>
                  <p className="text-3xl font-bold">{recommendations.portfolio.volatility.toFixed(1)}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-200" />
              </div>
              <div className="mt-4">
                <span className="text-purple-200 text-sm">Risk level</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Monthly Contribution</p>
                  <p className="text-3xl font-bold">${recommendations.monthlyContribution.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-200" />
              </div>
              <div className="mt-4">
                <span className="text-orange-200 text-sm">Recommended</span>
              </div>
            </div>
          </div>

          {/* Portfolio Allocation */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recommended Portfolio</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={generateComparison}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Compare Strategies
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Download className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {recommendations.allocations.map((allocation: any, index: number) => (
                <div 
                  key={allocation.symbol}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                    expandedRecommendation === allocation.symbol
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredCard(allocation.symbol)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">{allocation.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-semibold text-gray-900">{allocation.symbol}</h4>
                          <button
                            onClick={() => toggleFavorite(allocation.symbol)}
                            className="transition-colors duration-200"
                          >
                            {favoriteRecommendations.has(allocation.symbol) ? (
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            ) : (
                              <StarOff className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{allocation.name}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{allocation.category}</span>
                          <span>•</span>
                          <span>{allocation.expenseRatio}% expense ratio</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded ${
                            allocation.riskLevel === 'Very Low' ? 'bg-green-100 text-green-700' :
                            allocation.riskLevel === 'Low' ? 'bg-blue-100 text-blue-700' :
                            allocation.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            allocation.riskLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {allocation.riskLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Allocation</div>
                        <div className="text-lg font-semibold text-gray-900">{allocation.allocation.toFixed(1)}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">1Y Performance</div>
                        <div className={`text-lg font-semibold ${allocation.performance['1Y'] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {allocation.performance['1Y'] >= 0 ? '+' : ''}{allocation.performance['1Y'].toFixed(1)}%
                        </div>
                      </div>
                      <button
                        onClick={() => toggleRecommendationExpansion(allocation.symbol)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          expandedRecommendation === allocation.symbol ? 'rotate-180' : ''
                        }`} />
                      </button>
                    </div>
                  </div>

                  {expandedRecommendation === allocation.symbol && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Reasoning</div>
                          <p className="text-gray-700 mt-1">{allocation.reasoning}</p>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Performance History</div>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>3Y:</span>
                              <span className={allocation.performance['3Y'] >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {allocation.performance['3Y'] >= 0 ? '+' : ''}{allocation.performance['3Y'].toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>5Y:</span>
                              <span className={allocation.performance['5Y'] >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {allocation.performance['5Y'] >= 0 ? '+' : ''}{allocation.performance['5Y'].toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Risk Analysis</div>
                          <div className="mt-1">
                            <div className="text-sm text-gray-700">Risk Level: {allocation.riskLevel}</div>
                            <div className="text-sm text-gray-700">Category: {allocation.category}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Projected Returns */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Projected Returns</h3>
              <button
                onClick={() => setSimulationMode(!simulationMode)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  simulationMode 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {simulationMode ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                {simulationMode ? 'Stop' : 'Simulate'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">1 Year</div>
                <div className="text-3xl font-bold text-gray-900">
                  ${recommendations.expectedValue['1year'].toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  +{((recommendations.expectedValue['1year'] - formData.investmentAmount) / formData.investmentAmount * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">5 Years</div>
                <div className="text-3xl font-bold text-gray-900">
                  ${recommendations.expectedValue['5year'].toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  +{((recommendations.expectedValue['5year'] - formData.investmentAmount) / formData.investmentAmount * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">10 Years</div>
                <div className="text-3xl font-bold text-gray-900">
                  ${recommendations.expectedValue['10year'].toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  +{((recommendations.expectedValue['10year'] - formData.investmentAmount) / formData.investmentAmount * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Next Steps</h3>
              <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200">
                <Download className="w-4 h-4 mr-1" />
                Export Plan
              </button>
            </div>

            <div className="space-y-4">
              {recommendations.nextSteps.map((step: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Modal */}
          {showComparison && comparisonData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Strategy Comparison</h3>
                  <button
                    onClick={() => setShowComparison(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(comparisonData).map(([strategy, data]: [string, any]) => (
                    <div key={strategy} className="p-6 border border-gray-200 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 capitalize mb-4">{strategy}</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected Return:</span>
                          <span className="font-semibold">{data.return}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Risk Level:</span>
                          <span className="font-semibold">{data.risk}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Volatility:</span>
                          <span className="font-semibold">{data.volatility}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(5)}
          className="flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(1)}
          className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Start Over
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Robo-Advisor</h1>
          <p className="text-gray-600 text-lg">Get personalized investment recommendations powered by advanced AI</p>
        </div>

        <StepIndicator />

        <div className="transition-all duration-500">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
          {currentStep === 5 && <Step5 />}
          {currentStep === 6 && <Step6 />}
        </div>
      </div>
    </div>
  );
};

export default RoboAdvisor;