# Testing Infrastructure

This directory contains the comprehensive testing infrastructure for the MANTRA Chain dApp using Vitest and React Testing Library.

## Directory Structure

```
src/__tests__/
├── README.md                    # This documentation file
├── App.test.jsx                 # Component tests for App.jsx
├── hooks/
│   └── useTodoContract.test.js  # Hook tests for useTodoContract
├── mocks/
│   ├── graz.js                  # graz library mocks
│   └── cosmjs.mock.js           # CosmJS library mocks
├── utils/
│   ├── chakra-testing.js        # Chakra UI testing utilities
│   ├── test-constants.js        # Test data and selectors
│   ├── test-helpers.js          # Common testing patterns
│   └── hook-testing-utils.js    # React Hook testing utilities
├── helpers/
│   └── responsive-testing.js    # Responsive design testing
└── patterns/
    └── async-blockchain-patterns.test.js  # Async operation patterns
```

## Usage

All tests use Vitest with React Testing Library. Components and hooks should be tested using the provided utilities from `../src/test/utils.js`.

### Component Testing
```javascript
import { renderWithProviders, screen } from '../src/test/utils'
import { describe, it, expect } from 'vitest'
import App from '../src/App'

describe('App', () => {
  it('renders correctly', () => {
    renderWithProviders(<App />)
    expect(screen.getByText(/Connect Wallet/i)).toBeInTheDocument()
  })
})
```

### Hook Testing
```javascript
import { renderHook, waitFor } from '@testing-library/react'
import { useTodoContract } from '../src/hooks/useTodoContract'
import { TestWrapper } from '../src/test/utils'

describe('useTodoContract', () => {
  it('should initialize correctly', async () => {
    const { result } = renderHook(() => useTodoContract(), {
      wrapper: TestWrapper
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })
})
```

## Mock Coverage

The test infrastructure includes comprehensive mocking for:
- graz library hooks (useAccount, useConnect, useDisconnect)
- CosmJS clients (query and signing clients)
- MANTRA Chain RPC endpoints
- Browser APIs (window.matchMedia, etc.)

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Run only component tests
npm run test:run -- src/__tests__/App.test.jsx

# Run only hook tests
npm run test:hooks
```