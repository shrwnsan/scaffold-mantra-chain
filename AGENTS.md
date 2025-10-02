# AI Agent Development Guide for Scaffold MANTRA Chain

This file provides context and instructions to help AI coding agents work on this project effectively.

## Project Overview
Scaffold MANTRA Chain is a React-based dApp scaffold for MANTRA Chain, a Cosmos SDK-based blockchain. The project provides a foundation with wallet integration, smart contract interaction capabilities, and a modern UI framework.

The project uses empty template files with the intention of allowing developers to implement blockchain interactions using the CosmJS library and MANTRA Chain.

## File Structure
```
src/
├── App.js          # Main application component (currently empty)
├── index.js        # Entry point (currently empty)
└── hooks/
    └── useTodoContract.js # Contract interaction hook (currently empty)
```

## Build and Test Commands
- Install dependencies: `npm install --legacy-peer-deps`
- Start development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Install dependencies with exact versions: `npm ci`

## Technology Stack
- **Frontend**: React 18.3.1 with Chakra UI and Framer Motion
- **Build Tool**: Vite 5.4.20
- **Blockchain**: CosmJS 0.31.3 (cosmwasm-stargate, stargate, tendermint-rpc, encoding)
- **Wallet Integration**: graz 0.1.31
- **Environment**: dotenv 16.6.1

## Key Dependencies & Constraints
- CosmJS packages locked at 0.31.3 for graz 0.1.31 compatibility
- React locked at 18.3.1 for ecosystem compatibility  
- Legacy peer dependencies required during installation due to graz/cosmjs compatibility
- Dependencies pinned to exact versions for deterministic builds
- Security vulnerabilities exist in transitive dependencies (see Security section)

## Code Style Guidelines
- Follow React hooks best practices and naming conventions (hooks should start with "use")
- Use Chakra UI components for consistent UI design
- Implement proper error handling for asynchronous operations
- Use environment variables for configuration
- Follow existing project structure and file naming conventions
- Use camelCase for JavaScript variables and functions
- Use consistent indentation (2 spaces for JSX)

## Testing Instructions
- Test React components using React Testing Library
- Create integration tests for blockchain interactions using CosmJS test utilities
- Test wallet connection flows in different states (disconnected, connecting, connected)
- Verify contract queries and transactions work properly
- Test error handling scenarios

## Implementation Guidelines

### For App.js Implementation
- Wrap application with QueryClientProvider and GrazProvider from react-query and graz respectively
- Implement wallet connection UI using graz hooks
- Include proper error boundary handling
- Follow Chakra UI component patterns
- Include responsive design considerations

### For useTodoContract.js Implementation  
- Implement CosmWasm contract interaction functions
- Use useCosmWasmClient for queries and useSigningCosmWasmClient for transactions
- Include proper error handling and loading states
- Follow React hook patterns with appropriate return types
- Implement both query and execute functions for contract interactions

### Security Implementation Patterns
- Validate addresses before any blockchain operations
- Implement proper error sanitization for UI display
- Use safe execution patterns for contract interactions

## Security Considerations
- **Current State**: 13 vulnerabilities exist (2 moderate, 5 high, 6 critical) in transitive dependencies
- **Axios vulnerabilities** in @cosmjs/tendermint-rpc (high severity)
- **Elliptic cryptographic vulnerability** in @walletconnect/utils (critical)
- **SES vulnerabilities** in @cosmsnap/snapper (critical)
- **esbuild vulnerability** in vite (moderate)

### Security Best Practices
- Validate all user inputs before blockchain operations
- Sanitize error messages before showing to users
- Never expose sensitive data in console logs
- Consider running blockchain operations through backend when possible

## Environment Setup
1. Install Node.js 18+ and npm
2. Run `npm install --legacy-peer-deps` to install dependencies
3. Set up environment variables for RPC endpoints and contract addresses
4. Configure wallet connection options in GrazProvider

## Development Workflow
- When implementing new features, consider the security implications of any blockchain interactions
- Always test wallet connections in various states
- Verify that all contract interactions handle errors gracefully
- Use the development server to test UI components
- Run production build to ensure everything works end-to-end

## Migration Path for Security Improvements
- Upgrading to graz 0.3.x would resolve security vulnerabilities
- Requires updating CosmJS packages to >=0.32.4
- Breaking changes include: provider wrapping with QueryClientProvider, chain configuration changes from GrazChain to ChainInfo, hook parameter format changes from positional to object parameters
- Would need to update all blockchain interaction code
- Recommended to perform migration in a dedicated branch with thorough testing

## PR Instructions
- Include tests for any new functionality
- Update documentation if adding new features
- Ensure all security considerations are addressed
- Verify the application builds and runs after changes
- Update the AGENTS.md file if adding new conventions or requirements