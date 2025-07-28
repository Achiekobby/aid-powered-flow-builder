# USSD Builder - Ghana & Africa

A modern, no-code platform for building and deploying USSD applications across Ghana and Africa. Built with React, Laravel, and cutting-edge technologies.

![USSD Builder](https://img.shields.io/badge/USSD-Builder-green)
![React](https://img.shields.io/badge/React-18.0-blue)
![Laravel](https://img.shields.io/badge/Laravel-10.0-red)
![Three.js](https://img.shields.io/badge/Three.js-3D-000000)
![Framer Motion](https://img.shields.io/badge/Framer-Motion-Animation-0055FF)

## 🌟 Features

### 🎯 Core Functionality
- **No-Code USSD Builder** - Drag, drop, and launch USSD applications
- **Ghana & Africa Focused** - Optimized for African mobile networks and languages
- **Multi-Language Support** - Twi, Ga, Ewe, and more local languages
- **Mobile Money Integration** - MTN Mobile Money, Vodafone Cash, AirtelTigo Money
- **Survey Capabilities** - Conduct surveys and collect data via USSD

### 🔐 Authentication System
- **Modern 3D Animated UI** - Built with Three.js and Framer Motion
- **Complete Auth Flow** - Login, Register, Email Verification, Password Reset
- **4-Digit OTP Verification** - Secure account verification process
- **Password Strength Indicator** - Real-time password validation
- **Redux State Management** - Centralized authentication state

### 🎨 User Experience
- **Responsive Design** - Works perfectly on all devices
- **Smooth Animations** - Framer Motion powered transitions
- **Modern UI/UX** - Glassmorphism, gradients, and modern design patterns
- **Split Layout** - Content and form side-by-side on desktop
- **Mobile Optimized** - Touch-friendly interface

### 🛡️ Security Features
- **Enterprise Security** - Bank-grade encryption and security
- **Session Management** - Secure token-based authentication
- **Form Validation** - Client and server-side validation
- **Protected Routes** - Route-level authentication guards

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PHP (v8.1 or higher)
- Composer
- MySQL/PostgreSQL

### Frontend Setup

```bash
# Navigate to frontend directory
cd ussd-builder/frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Setup

```bash
# Navigate to backend directory
cd ussd-builder/backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ussd_builder
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

## 📁 Project Structure

```
ussd-builder/
├── frontend/                 # React Frontend Application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── Layout/     # Layout components
│   │   │   └── Landing/    # Landing page components
│   │   ├── pages/          # Page components
│   │   │   ├── Auth/       # Authentication pages
│   │   │   └── Dashboard/  # Dashboard pages
│   │   ├── store/          # Redux store configuration
│   │   │   └── slices/     # Redux slices
│   │   ├── hooks/          # Custom React hooks
│   │   └── App.js          # Main application component
│   ├── package.json
│   └── README.md
├── backend/                 # Laravel Backend API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   └── Models/
│   ├── config/
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   └── composer.json
└── README.md
```

## 🎨 Component Architecture

### Authentication Components
- **LoginForm** - 3D animated login with split layout
- **AnimatedSignupForm** - Comprehensive registration form
- **VerifyAccountForm** - 4-digit OTP verification
- **ForgotPasswordForm** - Email + OTP password reset flow
- **ResetPasswordForm** - New password with strength indicator

### Landing Page Components
- **Hero** - Dynamic hero section with rotating gradients
- **Features** - Ghana/Africa-focused feature showcase
- **Pricing** - Modern pricing cards with popular plan highlighting
- **Contact** - Contact form with custom social media icons

### Layout Components
- **Header** - Responsive navigation with dynamic styling
- **Footer** - Modern footer with newsletter signup
- **MainLayout** - Main layout wrapper
- **ProtectedRoute** - Authentication route protection

## 🔧 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Redux Toolkit** - State management with async thunks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animations
- **Three.js** - 3D graphics and animations
- **Lucide React** - Beautiful icon library

### Backend
- **Laravel 10** - PHP web framework
- **MySQL/PostgreSQL** - Database
- **Laravel Sanctum** - API authentication
- **Laravel Mail** - Email functionality

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 🌍 Africa-Focused Features

### Localization
- **Ghanaian Languages** - Twi, Ga, Ewe support
- **Local Content** - Ghana and Africa-specific messaging
- **Cultural Relevance** - Designed with African users in mind

### Mobile Money Integration
- **MTN Mobile Money** - Ghana's leading mobile money service
- **Vodafone Cash** - Alternative mobile money option
- **AirtelTigo Money** - Combined service integration

### Network Optimization
- **Low Bandwidth** - Optimized for slower connections
- **Offline Capability** - Works with intermittent connectivity
- **USSD Compatibility** - Designed for USSD protocol requirements

## 🔐 Authentication Flow

```
1. User Registration → Email Verification → Dashboard
2. User Login → Dashboard
3. Forgot Password → Email → OTP → New Password → Login
```

### Security Features
- **JWT Tokens** - Secure session management
- **Password Hashing** - Bcrypt encryption
- **CSRF Protection** - Cross-site request forgery prevention
- **Rate Limiting** - API request throttling
- **Input Validation** - Server-side validation

## 🎯 Key Features

### USSD Builder
- **Visual Flow Builder** - Drag and drop interface
- **Template Library** - Pre-built USSD flows
- **Testing Environment** - Simulate USSD interactions
- **Deployment Tools** - One-click deployment to carriers

### Analytics & Monitoring
- **Real-time Analytics** - User interaction tracking
- **Performance Metrics** - Response time monitoring
- **Error Tracking** - Comprehensive error logging
- **Usage Reports** - Detailed usage statistics

### Integration Capabilities
- **API Endpoints** - RESTful API for external integrations
- **Webhook Support** - Real-time event notifications
- **Third-party Services** - Payment gateways, SMS providers
- **Custom Integrations** - Flexible integration framework

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to hosting service (Netlify, Vercel, etc.)
```

### Backend Deployment
```bash
# Production environment setup
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation** - [docs.ussdbuilder.com](https://docs.ussdbuilder.com)
- **Email Support** - support@ussdbuilder.com
- **Community Forum** - [community.ussdbuilder.com](https://community.ussdbuilder.com)

## 🙏 Acknowledgments

- **Ghana Tech Community** - For local insights and feedback
- **African Developers** - For contributing to the ecosystem
- **Open Source Community** - For the amazing tools and libraries

---

**Built with ❤️ for Ghana and Africa**

*Empowering African businesses with no-code USSD solutions* 