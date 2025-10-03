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

### Testing Commands
- `npm test` - Run all tests (Vitest)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI interface
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests for CI with JUnit output

## Technology Stack
- React 18.3.1 + Chakra UI + Framer Motion
- Vite 5.4.20 (build tool)
- TanStack React Query 5.0.0 (state management)
- CosmJS 0.36.0 (blockchain interaction)
- graz 0.3.7 (wallet integration)

### Testing Stack
- Vitest 3.2.4 (test runner)
- React Testing Library 16.3.0 (component testing)
- MSW 2.11.3 (API mocking)
- @vitest/coverage-v8 (coverage reporting)

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

## Testing Guidelines for AI Agents

### Required Testing Setup
1. **Always use TestWrapper**: Components and hooks must be tested with the provided TestWrapper from `src/test/utils.js`
2. **Mock blockchain interactions**: Use MSW handlers from `src/test/mockBlockchain.js` for API calls
3. **Test environment setup**: Copy `.env.test.example` to `.env.test` before running tests

### Test Structure Requirements
```javascript
// Component Tests
import { renderWithProviders, screen } from '../src/test/utils'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

// Hook Tests
import { renderHook, waitFor } from '@testing-library/react'
import { TestWrapper } from '../src/test/utils'
```

### Testing Requirements
- **Coverage**: Maintain minimum 80% coverage for lines, functions, branches, and statements
- **Wallet States**: Test disconnected, connecting, connected, and error states
- **Contract Interactions**: Test queries, transactions, and error scenarios
- **Loading States**: Test all loading and async states properly
- **Error Handling**: Verify error boundaries and user feedback

### Mock Requirements
- Use provided mock functions from `src/test/utils.js`
- Mock graz hooks with realistic wallet states
- Mock blockchain RPC responses using MSW
- Test both success and failure scenarios

### Before Submitting Work
1. Run `npm run test:coverage` - ensure 80%+ coverage
2. Run `npm run test:run` - ensure all tests pass
3. Run `npm run build` - ensure build works
4. Run `npm run preview` - ensure preview works

### Test File Naming
- Component tests: `ComponentName.test.jsx` in `__tests__` subdirectory
- Hook tests: `hookName.test.js` in `__tests__` subdirectory
- Util tests: `utilName.test.js` in `__tests__` subdirectory

### Example Test Template
```javascript
import { renderWithProviders, screen, waitFor } from '../../src/test/utils'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when wallet is connected', () => {
    renderWithProviders(<MyComponent />)
    expect(screen.getByText('Connected')).toBeInTheDocument()
  })

  it('handles button clicks properly', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MyComponent />)

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument()
    })
  })
})
```