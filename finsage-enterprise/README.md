# FinSage Enterprise - Financial Intelligence Platform

A modern, enterprise-grade financial intelligence platform built with React, TypeScript, and Tailwind CSS. FinSage provides AI-powered investment insights, portfolio management, real-time market data, and advanced analytics for banks and financial institutions.

## 🚀 Features

### Core Features
- **AI-Powered Predictions**: Get personalized investment recommendations using advanced AI analysis
- **Portfolio Management**: Track and manage multiple investment portfolios with real-time updates
- **Advanced Analytics**: Deep insights into portfolio performance with risk metrics and optimization
- **Robo-Advisor**: Automated investment recommendations based on your financial profile
- **Sentiment Analysis**: Real-time market sentiment analysis for stocks and sectors
- **Blockchain Integration**: Web3 wallet connection and DeFi features
- **Real-time Market Data**: Live market indicators, crypto prices, and news feeds

### Technical Features
- **Modern React Architecture**: Built with React 19, TypeScript, and Vite
- **State Management**: Zustand for global state management
- **Data Fetching**: React Query for efficient API data management
- **UI Components**: Custom design system with Tailwind CSS and Radix UI
- **Charts & Visualizations**: Interactive charts with Recharts
- **Responsive Design**: Mobile-first approach with full responsive support
- **Type Safety**: Full TypeScript implementation with strict type checking

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Recharts** - Composable charting library
- **React Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend Integration
- **FastAPI** - Python backend API
- **RESTful APIs** - Well-structured API endpoints
- **Real-time Data** - WebSocket and polling support
- **Authentication** - JWT-based auth system

## 📦 Installation

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or yarn
- Backend API running (see backend setup)

### Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finsage-enterprise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://54.227.68.44:8000
   VITE_APP_NAME=FinSage Enterprise
   VITE_APP_VERSION=1.0.0
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Card, Input, etc.)
│   ├── layout/          # Layout components (Sidebar, TopBar, Layout)
│   └── charts/          # Chart components (LineChart, PieChart, BarChart)
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard with widgets
│   ├── Predictions.tsx  # AI prediction interface
│   ├── Portfolio.tsx    # Portfolio management
│   ├── Analytics.tsx    # Advanced analytics
│   ├── RoboAdvisor.tsx  # Robo-advisor questionnaire
│   ├── Sentiment.tsx    # Sentiment analysis
│   ├── Blockchain.tsx   # Web3 integration
│   └── Settings.tsx     # User settings
├── hooks/               # Custom React hooks
│   └── useApi.ts        # API integration hooks
├── services/            # API services
│   └── api.ts           # API client and endpoints
├── store/               # State management
│   └── useStore.ts      # Zustand store
├── types/               # TypeScript type definitions
│   └── index.ts         # All type definitions
├── lib/                 # Utility functions
│   ├── utils.ts         # Helper functions
│   └── queryClient.ts   # React Query configuration
└── App.tsx              # Main application component
```

## 🎨 Design System

### Color Palette
- **Primary**: Professional financial blues (#3b82f6)
- **Accent**: Trust and success greens (#10b981)
- **Warning**: Financial attention (#f59e0b)
- **Error**: Risk indicators (#ef4444)
- **Neutral**: Professional grays (#6b7280)

### Typography
- **Headings**: Inter (weights: 600, 700)
- **Body**: Inter (weights: 400, 500)
- **Numbers**: JetBrains Mono (weights: 400, 500, 600)

### Components
- **Glassmorphic Cards**: Semi-transparent with backdrop blur
- **Animated Counters**: For financial metrics
- **Loading Skeletons**: For async data
- **Toast Notifications**: Success/error feedback
- **Interactive Charts**: Hover effects and tooltips

## 🔌 API Integration

### Backend Endpoints
The application integrates with a FastAPI backend providing:

- **Portfolio API**: `/api/v1/portfolio/{user_id}`
- **Market Data API**: `/api/v1/advanced/market/indicators`
- **AI Predictions API**: `/api/v1/prediction/predict`
- **Sentiment Analysis API**: `/api/v1/advanced/sentiment/analyze`
- **Portfolio Optimization API**: `/api/v1/advanced/portfolio/optimize`
- **Robo-Advisor API**: `/api/v1/advanced/robo-advisor/recommendations`
- **Blockchain API**: `/api/v1/blockchain/status`

### Data Flow
1. **React Query** manages all API calls with caching and background updates
2. **Zustand** stores global application state
3. **Custom hooks** provide clean API integration
4. **TypeScript** ensures type safety across the data flow

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 375px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: 1440px+

### Mobile Features
- Collapsible sidebar navigation
- Touch-friendly interactions
- Optimized chart sizes
- Swipe gestures for navigation
- Mobile-specific layouts

## 🚀 Performance Optimizations

### Code Splitting
- Route-based code splitting with React.lazy
- Dynamic imports for heavy components
- Lazy loading of chart libraries

### Caching Strategy
- React Query for API response caching
- Local storage for user preferences
- Service worker for offline support (planned)

### Bundle Optimization
- Tree shaking for unused code
- Image optimization
- CSS purging with Tailwind
- Gzip compression

## 🧪 Testing

### Test Setup
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- Component rendering tests
- Hook functionality tests
- API integration tests
- User interaction tests

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=FinSage Enterprise
VITE_APP_VERSION=1.0.0
```

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Enterprise hosting
- **Docker**: Containerized deployment

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Style
- ESLint configuration for code quality
- Prettier for code formatting
- TypeScript strict mode
- Consistent naming conventions

## 📊 Features Overview

### Dashboard
- Portfolio overview with performance charts
- Market sentiment indicator
- AI prediction quick form
- Live market data feed
- Daily insights panel

### AI Predictions
- Multi-step questionnaire
- Real-time form validation
- AI-powered recommendations
- Asset allocation visualization
- Export to PDF functionality

### Portfolio Management
- Multiple portfolio support
- Real-time price updates
- Performance analytics
- Asset allocation charts
- Transaction history

### Advanced Analytics
- Performance metrics (Sharpe ratio, Sortino ratio, etc.)
- Portfolio optimization
- Benchmark comparison
- Risk analysis
- Custom time periods

### Robo-Advisor
- Comprehensive questionnaire
- Risk assessment
- Personalized recommendations
- Investment strategy
- Educational resources

### Sentiment Analysis
- Real-time sentiment scoring
- News sentiment analysis
- Social media buzz
- Historical trends
- Contributing factors

### Blockchain Integration
- Wallet connection
- Token balance tracking
- Transaction history
- DeFi integration
- Network status

## 🔐 Security

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Secure token storage
- Session management

### Data Protection
- Input validation with Zod
- XSS protection
- CSRF protection
- Secure API communication

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add JSDoc comments for functions
- Maintain test coverage above 80%

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Documentation
- Component documentation in Storybook
- API documentation in Swagger
- User guide in the application

### Contact
- Email: support@finsage.com
- Documentation: https://docs.finsage.com
- Issues: GitHub Issues

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core platform features
- ✅ AI predictions
- ✅ Portfolio management
- ✅ Real-time data

### Phase 2 (Next)
- 🔄 Mobile app (React Native)
- 🔄 Advanced charting (TradingView)
- 🔄 Real-time notifications
- 🔄 Social trading features

### Phase 3 (Future)
- 📋 Machine learning models
- 📋 Advanced risk management
- 📋 Multi-currency support
- 📋 White-label solutions

---

**FinSage Enterprise** - Empowering financial institutions with AI-driven insights and modern technology.