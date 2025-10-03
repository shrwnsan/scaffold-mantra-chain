# Scaffold MANTRA Chain

A simple React starter template for building dApps on MANTRA Chain with wallet integration and smart contract interaction capabilities.

## Quick Start

```bash
git clone <repository-url>
cd scaffold-mantra-chain
npm install
npm run dev
```

Open http://localhost:5173 to view the application.

## What's Included

- React 18 + Chakra UI for UI components
- Vite for fast development
- MANTRA Chain wallet integration via graz 0.3.7
- CosmJS 0.36.0 for blockchain interactions
- React Query for state management
- Template contract hook (`src/hooks/useTodoContract.js`)

## Environment Variables

Create a `.env` file:

```env
VITE_MANTRA_RPC_URL=https://rpc.mantrachain.io
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## Project Structure

```
src/
├── App.jsx         # Main app with GrazProvider and wallet hooks
├── index.jsx       # Entry point with QueryClientProvider
└── hooks/
    └── useTodoContract.js  # Contract interaction template
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Testing

This project uses Vitest for testing with React Testing Library and MSW for API mocking.

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI interface
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests for CI (with JUnit output)
npm run test:ci
```

### Test Environment Setup

1. Copy the test environment file:
```bash
cp .env.test.example .env.test
```

2. The test environment includes:
- Mock blockchain RPC endpoints
- Mock wallet states
- Test-specific configuration variables
- MSW for API mocking

### Writing Tests

#### Component Tests

```javascript
import { renderWithProviders, screen } from '../src/test/utils'
import { describe, it, expect } from 'vitest'
import MyComponent from '../src/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

#### Hook Tests

```javascript
import { renderHook, waitFor } from '@testing-library/react'
import { useTodoContract } from '../src/hooks/useTodoContract'
import { TestWrapper } from '../src/test/utils'

describe('useTodoContract', () => {
  it('should fetch todos successfully', async () => {
    const { result } = renderHook(() => useTodoContract(), {
      wrapper: TestWrapper
    })

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })
  })
})
```

#### Mocking Blockchain Interactions

The test setup includes comprehensive mocking for:
- MANTRA Chain RPC endpoints
- CosmWasm contract queries and executions
- Wallet connections and balance queries
- Token transfers and staking operations

Example of using mocked blockchain data:

```javascript
import { mockWalletState, mockContractQueryResult } from '../src/test/utils'

// In your test setup or before each test
vi.mock('graz', () => ({
  useAccount: () => ({
    data: mockWalletState,
    isConnected: true
  })
}))
```

### Coverage

- Coverage reports are generated in the `coverage/` directory
- Coverage threshold is set to 80% for all metrics
- HTML coverage report can be viewed at `coverage/index.html`

Coverage metrics tracked:
- **Lines**: Minimum 80%
- **Functions**: Minimum 80%
- **Branches**: Minimum 80%
- **Statements**: Minimum 80%

### Test Structure

```
src/
├── test/
│   ├── setup.js              # Global test setup
│   ├── utils.js              # Test utilities and helpers
│   └── mockBlockchain.js     # Blockchain mocking helpers
├── components/
│   └── __tests__/
│       └── Component.test.jsx
├── hooks/
│   └── __tests__/
│       └── hook.test.js
└── ...
```

### Testing Best Practices

1. **Use the TestWrapper**: Always wrap your components and hooks with the provided TestWrapper to ensure proper context and providers.

2. **Mock blockchain interactions**: Use the pre-configured MSW handlers to mock API calls and blockchain interactions.

3. **Test user interactions**: Use `userEvent` from `@testing-library/user-event` for simulating user actions.

4. **Test async operations**: Use `waitFor` and proper async/await patterns for testing asynchronous code.

5. **Keep tests focused**: Each test should verify a single behavior or feature.

6. **Use meaningful assertions**: Write descriptive test names and assertions that clearly indicate what is being tested.

### Continuous Integration

Tests run automatically on:
- Pull requests to `main` branch
- Pushes to `main` and `develop` branches

Coverage reports are uploaded to Codecov and commented on pull requests.

## Security Status

✅ All vulnerabilities resolved. Uses modern graz 0.3.7 and CosmJS 0.36.0 with no legacy dependencies.

## License

See LICENSE.md file.