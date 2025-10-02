# AI Agent Development Guide for Scaffold MANTRA Chain

This file provides context and instructions to help AI coding agents work on this project effectively.

## Project Overview
Scaffold MANTRA Chain is a React-based dApp scaffold for MANTRA Chain, a Cosmos SDK-based blockchain. The project provides a foundation with wallet integration, smart contract interaction capabilities, and a modern UI framework.

The project provides template files with basic setup to allow developers to implement blockchain interactions using the CosmJS library and MANTRA Chain. The App.jsx includes a modern provider setup with QueryClientProvider and GrazProvider, and index.jsx provides React rendering setup.

## File Structure
```
src/
├── App.jsx         # Main application component with provider setup
├── index.jsx       # Entry point (React rendering)
├── hooks/
│   └── useTodoContract.js # Contract interaction hook (template with functions)
└── ...
Additional files:
├── index.html      # HTML template for Vite
├── vite.config.js  # Vite configuration for React
└── dist/           # Build output directory (generated)
```

## Build and Test Commands
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`
- Install dependencies with exact versions: `npm ci`

## Technology Stack
- **Frontend**: React 18.3.1 with Chakra UI and Framer Motion
- **Build Tool**: Vite 5.4.20
- **State Management**: TanStack React Query 5.0.0
- **Blockchain**: CosmJS 0.36.0 (cosmwasm-stargate, stargate, tendermint-rpc, encoding)
- **Wallet Integration**: graz 0.3.7
- **Environment**: dotenv 16.6.1

## Key Dependencies & Constraints
- CosmJS packages updated to 0.36.0 for latest security patches
- Graz updated to 0.3.7 with enhanced security features
- React Query added for proper state management and caching
- React locked at 18.3.1 for ecosystem compatibility
- No legacy peer dependencies required - modern installation
- Dependencies pinned to exact versions for deterministic builds
- **SECURITY STATUS**: All critical vulnerabilities resolved

## Code Style Guidelines
- Follow React hooks best practices and naming conventions (hooks should start with "use")
- Use Chakra UI components for consistent UI design
- Implement proper error handling for asynchronous operations
- Use environment variables for configuration
- Follow existing project structure and file naming conventions
- Use camelCase for JavaScript variables and functions
- Use consistent indentation (2 spaces for JSX)
- Note: React components use .jsx extensions for proper Vite JSX handling

## Testing Instructions
- Test React components using React Testing Library
- Create integration tests for blockchain interactions using CosmJS test utilities
- Test wallet connection flows in different states (disconnected, connecting, connected)
- Verify contract queries and transactions work properly
- Test error handling scenarios

## Implementation Guidelines

### For App.jsx Implementation
- **Required**: Wrap application with QueryClientProvider and GrazProvider from @tanstack/react-query and graz respectively
- Use the new graz 0.3.x provider pattern with proper chain configuration
- Implement wallet connection UI using new graz hooks (useAccount, useConnect, useDisconnect)
- Include proper error boundary handling with React Query error boundaries
- Follow Chakra UI component patterns
- Include responsive design considerations
- Configure chain info using the new ChainInfo format (not GrazChain)

**Required Provider Setup:**
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GrazProvider } from 'graz'

const queryClient = new QueryClient()

// App structure:
<QueryClientProvider client={queryClient}>
  <GrazProvider>
    <ChakraProvider>
      {/* Your app content */}
    </ChakraProvider>
  </GrazProvider>
</QueryClientProvider>
```

### For useTodoContract.js Implementation
- Implement CosmWasm contract interaction functions using new CosmJS 0.36.0 APIs
- Use useCosmWasmClient for queries and useSigningCosmWasmClient for transactions
- Include proper error handling and loading states
- Follow React hook patterns with appropriate return types
- Implement both query and execute functions for contract interactions
- Use React Query for caching and state management
- Leverage new graz hooks for wallet state management

### Security Implementation Patterns
- Validate addresses before any blockchain operations
- Implement proper error sanitization for UI display
- Use safe execution patterns for contract interactions
- React Query provides automatic retry and error recovery

## Security Considerations
- **Current State**: ✅ **SECURE** - All vulnerabilities resolved!
- **Previous Issues**: 13 vulnerabilities existed (2 moderate, 5 high, 6 critical) in transitive dependencies
- **Resolution**: Upgraded to graz 0.3.7 and CosmJS 0.36.0
- **Benefits**:
  - No more axios vulnerabilities
  - Resolved elliptic cryptographic vulnerability
  - Fixed SES vulnerabilities
  - Updated esbuild dependency
  - Modern React Query integration

### Security Best Practices
- Validate all user inputs before blockchain operations
- Sanitize error messages before showing to users
- Never expose sensitive data in console logs
- Consider running blockchain operations through backend when possible
- Use React Query's built-in error handling and retry mechanisms
- Implement proper loading states for better UX

## Environment Setup
1. Install Node.js 18+ and npm
2. Run `npm install` to install dependencies (no legacy flags needed)
3. Set up environment variables for RPC endpoints and contract addresses
4. Configure wallet connection options in GrazProvider with new chain format

**Environment Variables (.env):**
```
VITE_MANTRA_RPC_URL=https://rpc.mantrachain.io
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## Development Workflow
- When implementing new features, consider the security implications of any blockchain interactions
- Always test wallet connections in various states (disconnected, connecting, connected)
- Verify that all contract interactions handle errors gracefully
- Use the development server to test UI components
- Run production build to ensure everything works end-to-end
- Test React Query caching and invalidation strategies
- Verify the new provider setup works correctly

## Migration Guide (For Users Upgrading)
The security migration is complete! Here's what changed:

### Required Updates for Existing Projects
1. **Dependencies**: Update to graz 0.3.7 and CosmJS 0.36.0
2. **Provider Setup**: Add QueryClientProvider wrapper
3. **Chain Configuration**: Update from GrazChain to ChainInfo format
4. **Hook Usage**: Update to new graz 0.3.x hook patterns
5. **Installation**: No more `--legacy-peer-deps` needed

### Breaking Changes
- Provider architecture now requires QueryClientProvider
- Chain configuration format changed
- Hook parameters changed from positional to object format
- Some graz hooks have been renamed or restructured

### Migration Steps
1. Update package.json dependencies
2. Add QueryClient setup and provider wrapper
3. Update chain configuration in GrazProvider
4. Update hook usage to new patterns
5. Test all wallet connections and contract interactions
6. Remove legacy peer dependency flags

## PR Instructions
- Include tests for any new functionality
- Update documentation if adding new features
- Ensure all security considerations are addressed
- Verify the application builds and runs after changes
- Update the AGENTS.md file if adding new conventions or requirements