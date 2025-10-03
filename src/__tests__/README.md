# React Hook Testing Infrastructure for MANTRA Chain dApps

This directory contains a comprehensive testing infrastructure for React hooks in MANTRA Chain dApps, specifically designed to work with graz 0.3.7 and CosmJS 0.36.0.

## Overview

The testing infrastructure provides:
- Mock utilities for CosmJS clients and blockchain operations
- Mock utilities for graz hooks (wallet interactions)
- Custom React hook testing utilities and helpers
- Comprehensive test patterns for async blockchain operations
- React Query integration testing

## Structure

```
src/__tests__/
├── setup.js                           # Jest setup and global mocks
├── mocks/
│   ├── cosmjs.mock.js                 # CosmJS client mocks
│   └── graz.mock.js                   # Graz hooks mocks
├── utils/
│   └── hook-testing-utils.js          # Custom testing utilities
├── hooks/
│   └── useTodoContract.test.js        # useTodoContract hook tests
├── patterns/
│   └── async-blockchain-patterns.test.js  # Async operation patterns
└── README.md                          # This documentation
```

## Key Components

### 1. CosmJS Mocks (`mocks/cosmjs.mock.js`)

Provides comprehensive mocks for:
- `mockQueryClient` - For read-only contract queries
- `mockSigningClient` - For contract executions and transactions
- Transaction responses and contract query responses
- Helper functions for setting up mock states
- Error simulation utilities

```javascript
import { setupCosmJSMocks, simulateCosmJSError } from '../mocks/cosmjs.mock'

// Setup successful mocks
const { mockQueryClient, mockSigningClient } = setupCosmJSMocks()

// Simulate network errors
simulateCosmJSError('Network timeout')
```

### 2. Graz Mocks (`mocks/graz.mock.js`)

Provides comprehensive mocks for:
- `mockUseAccount` - Wallet connection state
- `mockUseConnect` - Wallet connection functionality
- `mockUseDisconnect` - Wallet disconnection functionality
- State configuration helpers

```javascript
import { setupGrazMocks, configureAccountMock } from '../mocks/graz.mock'

// Setup wallet connected state
setupGrazMocks('connected')

// Configure specific account states
configureAccountMock('disconnected')
configureAccountMock('error')
```

### 3. Hook Testing Utilities (`utils/hook-testing-utils.js`)

Provides custom testing utilities:
- QueryClient wrapper setup
- GrazProvider wrapper setup
- Combined wrapper for both providers
- Async operation testing helpers
- React Query integration testing

```javascript
import { renderHookWithProviders, testAsyncHook } from '../utils/hook-testing-utils'

// Test hook with full provider support
const { result } = renderHookWithProviders(() => useYourHook(), {
  wrapper: 'full',
  GrazProvider,
  grazOptions
})
```

## Usage Examples

### Basic Hook Testing

```javascript
import { renderHookWithProviders } from '../utils/hook-testing-utils'
import { setupCosmJSMocks, setupGrazMocks } from '../mocks'

describe('Your Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    setupCosmJSMocks()
    setupGrazMocks('connected')
  })

  test('should handle successful operation', async () => {
    const { result } = renderHookWithProviders(() => useYourHook(), {
      wrapper: 'full'
    })

    await act(async () => {
      const response = await result.current.yourFunction()
      expect(response).toBeDefined()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })
})
```

### Testing Async Blockchain Operations

```javascript
import { testBlockchainInteraction } from '../utils/hook-testing-utils'
import { simulateCosmJSError } from '../mocks/cosmjs.mock'

test('should handle contract query', async () => {
  const { result, returnedValue } = await testBlockchainInteraction(
    () => yourHook().queryContract,
    () => setupCosmJSMocks(),
    {
      args: ['contract-address', { query: 'value' }],
      expectedReturn: mockData
    }
  )

  expect(returnedValue).toEqual(mockData)
})
```

### Testing Error States

```javascript
test('should handle network errors', async () => {
  simulateCosmJSError('Network timeout')

  const { result } = renderHookWithProviders(() => useYourHook(), {
    wrapper: 'full'
  })

  await act(async () => {
    await result.current.yourFunction()
  })

  expect(result.current.error).toBe('Network timeout')
})
```

### Testing React Query Integration

```javascript
import { testReactQueryIntegration } from '../utils/hook-testing-utils'

test('should cache query results', async () => {
  const { result, queryClient } = await testReactQueryIntegration(
    useYourQuery,
    {
      queryKey: ['your-query'],
      shouldCache: true
    }
  )

  const cachedData = queryClient.getQueryData(['your-query'])
  expect(cachedData).toBeDefined()
})
```

## Available Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only hook tests
npm run test:hooks

# Run only pattern tests
npm run test:patterns

# Run tests in CI environment
npm run test:ci
```

## Mock Configuration

### CosmJS Client States

```javascript
import { configureCosmWasmClientMock, configureSigningCosmWasmClientMock } from '../mocks/cosmjs.mock'

// Configure query client states
configureCosmWasmClientMock('success')    // Default
configureCosmWasmClientMock('loading')
configureCosmWasmClientMock('error')

// Configure signing client states
configureSigningCosmWasmClientMock('success')  // Default
configureSigningCosmWasmClientMock('loading')
configureSigningCosmWasmClientMock('error')
```

### Graz Hook States

```javascript
import { configureAccountMock, configureConnectMock } from '../mocks/graz.mock'

// Configure account states
configureAccountMock('connected')     // Default
configureAccountMock('disconnected')
configureAccountMock('loading')
configureAccountMock('error')

// Configure connection states
configureConnectMock('success')       // Default
configureConnectMock('loading')
configureConnectMock('error')
```

## Test Patterns

### 1. Basic Hook Testing Pattern
- Test initial state
- Test successful operations
- Test error handling
- Test loading states

### 2. Async Operation Pattern
- Setup mocks
- Render hook with providers
- Perform async operation
- Assert results and state changes

### 3. Error Recovery Pattern
- Simulate errors
- Test error handling
- Test recovery mechanisms
- Test retry logic

### 4. Integration Pattern
- Test with React Query
- Test with GrazProvider
- Test state management
- Test caching behavior

## Best Practices

1. **Always clear mocks before each test**
   ```javascript
   beforeEach(() => {
     jest.clearAllMocks()
   })
   ```

2. **Use the provided wrapper utilities**
   ```javascript
   renderHookWithProviders(() => useYourHook(), { wrapper: 'full' })
   ```

3. **Test both success and error states**
   ```javascript
   // Test success
   setupCosmJSMocks()
   // Test error
   simulateCosmJSError('Test error')
   ```

4. **Use async/await for async operations**
   ```javascript
   await act(async () => {
     await result.current.yourAsyncFunction()
   })
   ```

5. **Test loading states properly**
   ```javascript
   // Check loading during operation
   expect(result.current.loading).toBe(true)
   // Wait for completion
   await waitForLoadingToFinish(result.current)
   expect(result.current.loading).toBe(false)
   ```

## Coverage Areas

The test infrastructure covers:
- ✅ Hook initial states
- ✅ Loading states during operations
- ✅ Error handling for various scenarios
- ✅ Success states and data handling
- ✅ Wallet connection states
- ✅ Contract query operations
- ✅ Contract execute operations
- ✅ React Query integration
- ✅ Caching behavior
- ✅ State management
- ✅ Error recovery
- ✅ Concurrent operations
- ✅ Performance considerations

## Troubleshooting

### Common Issues

1. **"Hook can only be called inside a React component"**
   - Make sure you're using the provided wrapper utilities
   - Check that you're calling the hook inside `renderHook`

2. **"Cannot read property of undefined"**
   - Ensure mocks are properly set up in `beforeEach`
   - Check that you're using the correct wrapper type

3. **Tests timing out**
   - Use the provided async utilities
   - Check for proper async/await usage
   - Consider increasing timeout if needed

### Debug Tips

1. **Check mock calls**
   ```javascript
   console.log(mockQueryClient.queryContractSmart.mock.calls)
   ```

2. **Inspect hook state**
   ```javascript
   console.log(result.current)
   ```

3. **Debug async operations**
   ```javascript
   await act(async () => {
     try {
       await result.current.yourFunction()
     } catch (error) {
       console.error('Operation failed:', error)
     }
   })
   ```

This testing infrastructure provides a solid foundation for testing React hooks in MANTRA Chain dApps, ensuring comprehensive coverage of blockchain interactions while maintaining clean, maintainable test code.