import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  BarChart3, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Star,
  Zap,
  Shield,
  PieChart,
  Activity,
  Users,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const Predictions: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 30,
    annualIncome: 75000,
    riskTolerance: 'moderate',
    investmentAmount: 10000,
    financialGoals: [] as string[],
    timeHorizon: '5-10 years',
    experience: 'intermediate',
    liquidity: 'moderate'
  });
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [simulationMode, setSimulationMode] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<any>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);

  const financialGoals = [
    { id: 'retirement', label: 'Retirement Planning', icon: Calendar, color: 'blue' },
    { id: 'wealth', label: 'Wealth Building', icon: TrendingUp, color: 'green' },
    { id: 'income', label: 'Income Generation', icon: DollarSign, color: 'purple' },
    { id: 'education', label: 'Education Funding', icon: Users, color: 'orange' },
    { id: 'home', label: 'Home Purchase', icon: Target, color: 'red' },
    { id: 'emergency', label: 'Emergency Fund', icon: Shield, color: 'yellow' }
  ];

  const riskToleranceOptions = [
    { value: 'conservative', label: 'Conservative', description: 'Low risk, stable returns', color: 'green' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced risk and return', color: 'yellow' },
    { value: 'aggressive', label: 'Aggressive', description: 'High risk, high potential', color: 'red' }
  ];

  const timeHorizons = [
    { value: '1-2 years', label: 'Short Term (1-2 years)', icon: Clock },
    { value: '3-5 years', label: 'Medium Term (3-5 years)', icon: Calendar },
    { value: '5-10 years', label: 'Long Term (5-10 years)', icon: Target },
    { value: '10+ years', label: 'Very Long Term (10+ years)', icon: TrendingUp }
  ];

  const investmentStrategies = [
    { id: 'growth', name: 'Growth Strategy', description: 'Focus on capital appreciation', risk: 'High', return: '12-15%' },
    { id: 'value', name: 'Value Strategy', description: 'Undervalued stocks with potential', risk: 'Medium', return: '8-12%' },
    { id: 'dividend', name: 'Dividend Strategy', description: 'Regular income from dividends', risk: 'Low', return: '6-10%' },
    { id: 'balanced', name: 'Balanced Strategy', description: 'Mix of growth and income', risk: 'Medium', return: '8-12%' },
    { id: 'index', name: 'Index Strategy', description: 'Broad market exposure', risk: 'Low', return: '7-10%' }
  ];

  useEffect(() => {
    // Animate values when prediction result changes
    if (predictionResult) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  }, [predictionResult]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goalId)
        ? prev.financialGoals.filter(g => g !== goalId)
        : [...prev.financialGoals, goalId]
    }));
  };

  const generatePrediction = async () => {
    setLoading(true);
    setIsAnimating(true);
    
    // Simulate AI prediction generation with more realistic data
    setTimeout(() => {
      const riskMultiplier = formData.riskTolerance === 'aggressive' ? 1.5 : formData.riskTolerance === 'moderate' ? 1.0 : 0.5;
      const expectedReturn = 8 + (Math.random() * 12 * riskMultiplier);
      const confidence = 75 + Math.random() * 20;
      const riskScore = formData.riskTolerance === 'aggressive' ? 8 : formData.riskTolerance === 'moderate' ? 5 : 3;
      
      const recommendations = [
        { 
          symbol: 'AAPL', 
          name: 'Apple Inc.',
          action: 'BUY', 
          allocation: 25, 
          confidence: 85, 
          reasoning: 'Strong fundamentals and growth potential',
          price: 175.50,
          change: 2.3,
          changePercent: 1.33,
          sector: 'Technology',
          marketCap: '2.8T',
          pe: 28.5,
          dividend: 0.96
        },
        { 
          symbol: 'GOOGL', 
          name: 'Alphabet Inc.',
          action: 'BUY', 
          allocation: 20, 
          confidence: 80, 
          reasoning: 'AI leadership and cloud growth',
          price: 142.30,
          change: 1.8,
          changePercent: 1.28,
          sector: 'Technology',
          marketCap: '1.8T',
          pe: 24.2,
          dividend: 0.0
        },
        { 
          symbol: 'MSFT', 
          name: 'Microsoft Corporation',
          action: 'BUY', 
          allocation: 15, 
          confidence: 82, 
          reasoning: 'Cloud computing dominance',
          price: 378.85,
          change: 3.2,
          changePercent: 0.85,
          sector: 'Technology',
          marketCap: '2.8T',
          pe: 32.1,
          dividend: 3.00
        },
        { 
          symbol: 'JNJ', 
          name: 'Johnson & Johnson',
          action: 'HOLD', 
          allocation: 10, 
          confidence: 70, 
          reasoning: 'Stable dividend income',
          price: 158.20,
          change: -0.5,
          changePercent: -0.32,
          sector: 'Healthcare',
          marketCap: '420B',
          pe: 15.8,
          dividend: 4.76
        },
        { 
          symbol: 'VTI', 
          name: 'Vanguard Total Stock Market ETF',
          action: 'BUY', 
          allocation: 30, 
          confidence: 90, 
          reasoning: 'Broad market diversification',
          price: 245.67,
          change: 1.2,
          changePercent: 0.49,
          sector: 'ETF',
          marketCap: '1.2T',
          pe: 18.5,
          dividend: 1.89
        }
      ];

      const marketAnalysis = {
        overallTrend: expectedReturn > 12 ? 'Bullish' : expectedReturn > 8 ? 'Neutral' : 'Bearish',
        volatility: riskScore > 6 ? 'High' : riskScore > 4 ? 'Medium' : 'Low',
        marketConditions: ['Low interest rates', 'Strong corporate earnings', 'Economic recovery'],
        risks: ['Inflation concerns', 'Geopolitical tensions', 'Market volatility'],
        opportunities: ['AI revolution', 'Green energy transition', 'Emerging markets']
      };

      setPredictionResult({
        expectedReturn,
        confidence,
        riskScore,
        marketAnalysis,
        recommendations,
        portfolioValue: formData.investmentAmount,
        projectedValue: formData.investmentAmount * (1 + expectedReturn / 100),
        timeHorizon: formData.timeHorizon,
        strategy: selectedStrategy || 'balanced'
      });
      
      setCurrentStep(4);
      setLoading(false);
      setIsAnimating(false);
    }, 2000);
  };

  const generateComparison = () => {
    setShowComparison(true);
    setComparisonData({
      conservative: { return: 6.5, risk: 2, volatility: 8 },
      moderate: { return: 9.2, risk: 5, volatility: 15 },
      aggressive: { return: 13.8, risk: 8, volatility: 25 }
    });
  };

  const steps = [
    { number: 1, title: 'Personal Info', description: 'Basic information about yourself', icon: Users },
    { number: 2, title: 'Financial Profile', description: 'Your financial situation and goals', icon: DollarSign },
    { number: 3, title: 'Investment Preferences', description: 'Risk tolerance and strategy', icon: Target },
    { number: 4, title: 'AI Analysis', description: 'Get your personalized recommendations', icon: Brain },
  ];

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
            <ChevronRight className={`w-5 h-5 mx-4 ${
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
        <label className="block text-sm font-medium text-gray-700">Investment Experience</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => handleInputChange('experience', level)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                formData.experience === level
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-medium capitalize">{level}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {level === 'beginner' ? 'New to investing' : 
                   level === 'intermediate' ? 'Some experience' : 'Expert level'}
                </div>
              </div>
            </button>
          ))}
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

      <div className="space-y-6 mb-8">
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
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Liquidity Needs</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['low', 'moderate', 'high'].map((level) => (
              <button
                key={level}
                onClick={() => handleInputChange('liquidity', level)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.liquidity === level
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium capitalize">{level}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {level === 'low' ? 'Can lock funds long-term' : 
                     level === 'moderate' ? 'Some flexibility needed' : 'Need quick access'}
                  </div>
                </div>
              </button>
            ))}
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
          <h2 className="text-2xl font-bold text-gray-900">Financial Goals</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {financialGoals.map((goal) => {
            const IconComponent = goal.icon;
            const isSelected = formData.financialGoals.includes(goal.id);
            
            return (
              <button
                key={goal.id}
                onClick={() => handleGoalToggle(goal.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? `border-${goal.color}-500 bg-${goal.color}-50 text-${goal.color}-700`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <IconComponent className={`w-6 h-6 mr-3 ${
                    isSelected ? `text-${goal.color}-600` : 'text-gray-400'
                  }`} />
                  <div className="text-left">
                    <div className="text-sm font-medium">{goal.label}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center mb-6">
          <Shield className="w-8 h-8 text-red-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Risk Tolerance</h2>
        </div>

        <div className="space-y-4 mb-8">
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Investment Strategy</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentStrategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedStrategy === strategy.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-left">
                  <div className="text-sm font-medium">{strategy.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{strategy.description}</div>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className={`px-2 py-1 rounded ${
                      strategy.risk === 'High' ? 'bg-red-100 text-red-700' :
                      strategy.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Risk: {strategy.risk}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Return: {strategy.return}
                    </span>
                  </div>
                </div>
              </button>
            ))}
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
          onClick={generatePrediction}
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
              Generate AI Prediction
            </>
          )}
        </button>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6">
      {predictionResult && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Expected Return</p>
                  <p className="text-3xl font-bold">{predictionResult.expectedReturn.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
              <div className="mt-4">
                <span className="text-green-200 text-sm">Annual projection</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Confidence Score</p>
                  <p className="text-3xl font-bold">{predictionResult.confidence.toFixed(0)}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-200" />
              </div>
              <div className="mt-4">
                <span className="text-blue-200 text-sm">AI confidence</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Risk Score</p>
                  <p className="text-3xl font-bold">{predictionResult.riskScore}/10</p>
                </div>
                <Shield className="w-8 h-8 text-purple-200" />
              </div>
              <div className="mt-4">
                <span className="text-purple-200 text-sm">Risk assessment</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Projected Value</p>
                  <p className="text-3xl font-bold">${predictionResult.projectedValue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-200" />
              </div>
              <div className="mt-4">
                <span className="text-orange-200 text-sm">In {formData.timeHorizon}</span>
              </div>
            </div>
          </div>

          {/* Market Analysis */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Market Analysis</h3>
              </div>
              <button
                onClick={generateComparison}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
              >
                Compare Strategies
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Market Conditions</h4>
                <div className="space-y-2">
                  {predictionResult.marketAnalysis.marketConditions.map((condition: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {condition}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Risks</h4>
                <div className="space-y-2">
                  {predictionResult.marketAnalysis.risks.map((risk: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                      {risk}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Opportunities</h4>
                <div className="space-y-2">
                  {predictionResult.marketAnalysis.opportunities.map((opportunity: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-blue-500 mr-2" />
                      {opportunity}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <PieChart className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">AI Recommendations</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSimulationMode(!simulationMode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    simulationMode 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {simulationMode ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {simulationMode ? 'Stop' : 'Simulate'}
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Restart
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {predictionResult.recommendations.map((rec: any, index: number) => (
                <div 
                  key={rec.symbol}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                    expandedRecommendation === rec.symbol
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onMouseEnter={() => setHoveredCard(rec.symbol)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">{rec.symbol[0]}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{rec.symbol}</h4>
                        <p className="text-sm text-gray-600">{rec.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Allocation</div>
                        <div className="text-lg font-semibold text-gray-900">{rec.allocation}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Confidence</div>
                        <div className="text-lg font-semibold text-gray-900">{rec.confidence}%</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        rec.action === 'BUY' ? 'bg-green-100 text-green-700' :
                        rec.action === 'SELL' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {rec.action}
                      </div>
                      <button
                        onClick={() => setExpandedRecommendation(
                          expandedRecommendation === rec.symbol ? null : rec.symbol
                        )}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          expandedRecommendation === rec.symbol ? 'rotate-90' : ''
                        }`} />
                      </button>
                    </div>
                  </div>

                  {expandedRecommendation === rec.symbol && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Current Price</div>
                          <div className="text-lg font-semibold text-gray-900">${rec.price}</div>
                          <div className={`text-sm ${rec.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {rec.change >= 0 ? '+' : ''}{rec.change} ({rec.changePercent}%)
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Sector</div>
                          <div className="text-lg font-semibold text-gray-900">{rec.sector}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Market Cap</div>
                          <div className="text-lg font-semibold text-gray-900">{rec.marketCap}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">P/E Ratio</div>
                          <div className="text-lg font-semibold text-gray-900">{rec.pe}</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-sm text-gray-500 mb-2">AI Reasoning</div>
                        <p className="text-gray-700">{rec.reasoning}</p>
                      </div>
                    </div>
                  )}
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
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Financial Predictions</h1>
          <p className="text-gray-600">Get personalized investment recommendations powered by advanced AI</p>
        </div>

        <StepIndicator />

        <div className="transition-all duration-500">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
        </div>
      </div>
    </div>
  );
};

export default Predictions;