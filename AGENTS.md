# AI Agent Development Guide

This guide helps AI agents work effectively with this MANTRA Chain dApp scaffold.

## Project Overview
React-based starter template for MANTRA Chain dApps with wallet integration and smart contract interaction capabilities.

## Key Architecture
- **Provider Setup**: App.jsx wrapped with QueryClientProvider → GrazProvider → ChakraProvider
- **Wallet Integration**: Uses graz 0.3.7 hooks (useAccount, useConnect, useDisconnect)
- **Blockchain**: CosmJS 0.36.0 for contract interactions
- **State Management**: React Query for caching and async operations

## File Structure
```
src/
├── App.jsx         # Main app with providers and wallet hooks
├── index.jsx       # Entry point with QueryClientProvider
└── hooks/
    └── useTodoContract.js  # Contract interaction template
```

## Development Commands
- `npm install` - Install dependencies (no --legacy-peer-deps needed)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technology Stack
- React 18.3.1 + Chakra UI + Framer Motion
- Vite 5.4.20 (build tool)
- TanStack React Query 5.0.0 (state management)
- CosmJS 0.36.0 (blockchain interaction)
- graz 0.3.7 (wallet integration)

## Implementation Guidelines

### Provider Pattern (Required)
```jsx
<QueryClientProvider client={queryClient}>
  <GrazProvider>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </GrazProvider>
</QueryClientProvider>
```

### Wallet Hook Usage
```jsx
import { useAccount, useConnect, useDisconnect } from 'graz'

const { data: account, isConnected } = useAccount()
const { connect } = useConnect()
const { disconnect } = useDisconnect()
```

### Contract Hook Pattern
Use `useCosmWasmClient` for queries, `useSigningCosmWasmClient` for transactions with React Query for caching.

## Security Status
✅ All vulnerabilities resolved. Uses modern dependencies with security patches.

## Environment Variables
```env
VITE_MANTRA_RPC_URL=https://rpc.mantrachain.io
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## Code Style
- React hooks start with "use"
- Use Chakra UI components
- Implement proper error handling
- Use camelCase for variables
- 2-space indentation for JSX

## Testing Notes
- Test wallet connection states (disconnected, connecting, connected)
- Verify contract queries and transactions
- Test error handling scenarios
- Build and preview must work after changes