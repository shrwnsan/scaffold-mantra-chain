# Scaffold MANTRA Chain

A React-based starter template for building decentralized applications (dApps) on the MANTRA Chain blockchain. This scaffold provides a pre-configured foundation with wallet integration, smart contract interaction capabilities, and a modern UI framework.

## Features

- React frontend with Chakra UI and Framer Motion for animations
- Pre-configured CosmJS libraries for MANTRA Chain integration
- Wallet connection via graz library with React Query integration
- Vite for fast development experience
- Ready-to-use contract interaction hooks structure
- Security-first architecture with modern dependency management

## Prerequisites

- Node.js 18+ installed on your system

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 to view the application

## Tech Stack

### Frontend:
- **React**: JavaScript library for building user interfaces
- **Chakra UI**: Accessible and customizable component library
- **Framer Motion**: Animation library for React
- **Vite**: Fast build tool
- **TanStack React Query**: Data fetching and state management

### Blockchain Integration:
- **CosmJS 0.36.0**: Latest stable libraries for Cosmos SDK-based blockchains
- **Graz 0.3.7**: Modern React hooks for wallet management with enhanced security

## Development

The project includes a basic structure with template files:
- `src/App.jsx` - Main application component with provider setup
- `src/hooks/useTodoContract.js` - Custom hook for smart contract interactions

## Security Improvements

✅ **Security Status**: All critical vulnerabilities have been resolved in this version!

- **Updated Dependencies**: Upgraded to graz 0.3.7 and CosmJS 0.36.0
- **React Query Integration**: Added proper state management with QueryClientProvider
- **Modern Architecture**: Implements provider pattern with proper error handling
- **No Legacy Dependencies**: Removed `--legacy-peer-deps` requirement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the terms specified in the LICENSE.md file.