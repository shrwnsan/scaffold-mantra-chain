# Scaffold MANTRA Chain - Project Context

## Project Overview
Scaffold MANTRA Chain is a React-based frontend application designed to interact with MANTRA Chain, which is a Cosmos SDK-based blockchain. The project includes smart contract integration capabilities using CosmJS libraries and provides a UI framework using Chakra UI and Framer Motion for animations.

This appears to be a starter template or scaffold for building decentralized applications (dApps) on the MANTRA Chain blockchain, with pre-configured dependencies and a basic project structure.

## Architecture & Tech Stack

### Frontend:
- **React**: JavaScript library for building user interfaces
- **Chakra UI**: Component library for React that provides accessible and customizable components
- **Framer Motion**: Animation library for React applications
- **Vite**: Build tool that provides a fast development environment

### Blockchain Integration:
- **CosmJS**: Suite of libraries for interacting with Cosmos SDK-based blockchains
  - `@cosmjs/cosmwasm-stargate`: For interacting with CosmWasm smart contracts
  - `@cosmjs/stargate`: For interacting with the Cosmos SDK
  - `@cosmjs/tendermint-rpc`: For communicating with Tendermint nodes
  - `@cosmjs/encoding`: Encoding utilities for CosmJS

### Other Dependencies:
- `dotenv`: Module for loading environment variables from `.env` files
- `graz`: Library for managing state and effects in React, likely used for blockchain interactions

## Project Structure
```
src/
├── App.js          # Main application component (currently empty)
├── index.js        # Application entry point (currently empty)
└── hooks/
    └── useTodoContract.js # Custom hook for smart contract interaction (currently empty)
```

## Building and Running the Project

### Prerequisites
- Node.js installed on your system

### Installation
1. Initialize the project:
   ```bash
   npm init -y
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Notes
- If you encounter npm errors regarding dependency conflicts, use the `--legacy-peer-deps` flag during installation
- After installation, you may see warnings about deprecated packages and vulnerabilities. Address them with:
  ```bash
  npm audit fix
  ```
  Or for all issues (with potential breaking changes):
  ```bash
  npm audit fix --force
  ```

## Development Conventions

### Current State
The project includes a basic structure with empty files, indicating it's a template ready for development. The naming convention `useTodoContract.js` suggests that hooks for blockchain contract interactions should follow the React hook naming convention (starting with "use").

### Expected Patterns
- Smart contract interaction hooks in the `src/hooks/` directory
- Component-based architecture following React best practices
- CosmJS libraries used for blockchain interactions
- Chakra UI components for consistent UI design

## Testing
The project template includes a basic test script in `package.json` that currently just echoes an error message. You should implement proper tests for your components and blockchain interactions using a testing framework like Jest or React Testing Library.

## Future Development
The current project is a scaffold with empty files, ready for implementation. When building features, consider:
- Implementing the main App component
- Developing the blockchain interaction hooks
- Following React best practices for state management
- Using the CosmJS libraries for blockchain operations
- Leveraging Chakra UI for consistent design
- Adding proper error handling for blockchain interactions

## License
This project is licensed under the terms specified in the LICENSE.md file.

## Recent Changes
Recent updates to this project include:

### Dependency Resolution (October 2025)
- Resolved peer dependency conflicts between `graz` (0.1.31) and CosmJS packages
- Downgraded CosmJS packages to version 0.31.3 for compatibility
- Changed React from version 19 to 18.3.1 for ecosystem compatibility
- Updated Vite to version 5.4.11
- Added development scripts: `dev`, `build`, `preview`
- Added `@vitejs/plugin-react` as a dev dependency

### Security Note
While dependency conflicts have been resolved, there are still outstanding security vulnerabilities (13 total: 2 moderate, 5 high, 6 critical) from underlying blockchain libraries. These vulnerabilities are in transitive dependencies and would require major version upgrades to resolve, which may introduce breaking changes.

### Project Context Documentation
- Created comprehensive AGENTS.md file to provide project context for future development