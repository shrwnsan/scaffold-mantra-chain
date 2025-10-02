# Scaffold MANTRA Chain

A React-based starter template for building decentralized applications (dApps) on the MANTRA Chain blockchain. This scaffold provides a pre-configured foundation with wallet integration, smart contract interaction capabilities, and a modern UI framework.

## Features

- React frontend with Chakra UI and Framer Motion for animations
- Pre-configured CosmJS libraries for MANTRA Chain integration
- Wallet connection via graz library
- Vite for fast development experience
- Ready-to-use contract interaction hooks structure

## Prerequisites

- Node.js installed on your system

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
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

### Blockchain Integration:
- **CosmJS**: Libraries for Cosmos SDK-based blockchains
- **Graz**: React hooks for wallet management

## Development

The project includes a basic structure with template files:
- `src/App.js` - Main application component
- `src/hooks/useTodoContract.js` - Custom hook for smart contract interactions

## Security Considerations

⚠️ **Important Security Note**: This project has known security vulnerabilities in transitive dependencies (13 total: 2 moderate, 5 high, 6 critical) from underlying blockchain libraries. See AGENTS.md for detailed security analysis and mitigation strategies.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the terms specified in the LICENSE.md file.