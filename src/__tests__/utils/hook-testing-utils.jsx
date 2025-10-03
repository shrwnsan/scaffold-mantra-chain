// Custom React hook testing utilities and helpers

import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import React from 'react'

// Create a test-specific QueryClient
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

// Wrapper component for hooks that need QueryClient
export const createQueryWrapper = (client = createTestQueryClient()) => {
  return ({ children }) => (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}

// Wrapper component for hooks that need GrazProvider
export const createGrazWrapper = (GrazProvider = null, grazOptions = {}) => {
  const GrazWrapper = ({ children }) => {
    if (!GrazProvider) {
      return children
    }
    return (
      <GrazProvider grazOptions={grazOptions}>
        {children}
      </GrazProvider>
    )
  }
  return GrazWrapper
}

// Combined wrapper for hooks that need both QueryClient and GrazProvider
export const createFullWrapper = (options = {}) => {
  const { GrazProvider, grazOptions, queryClient } = options
  const QueryWrapper = createQueryWrapper(queryClient)
  const GrazWrapper = createGrazWrapper(GrazProvider, grazOptions)

  return ({ children }) => (
    <QueryWrapper>
      <GrazWrapper>
        {children}
      </GrazWrapper>
    </QueryWrapper>
  )
}

// Enhanced renderHook with common wrappers
export const renderHookWithProviders = (hook, options = {}) => {
  const {
    wrapper = 'query', // 'query', 'graz', 'full', or custom wrapper
    GrazProvider,
    grazOptions,
    queryClient,
    ...renderOptions
  } = options

  let testWrapper

  switch (wrapper) {
    case 'graz':
      testWrapper = createGrazWrapper(GrazProvider, grazOptions)
      break
    case 'full':
      testWrapper = createFullWrapper({ GrazProvider, grazOptions, queryClient })
      break
    case 'query':
    default:
      testWrapper = createQueryWrapper(queryClient)
      break
  }

  return renderHook(hook, {
    wrapper: testWrapper,
    ...renderOptions,
  })
}

// Helper to wait for loading states to resolve
export const waitForLoadingToFinish = async (result, timeout = 5000) => {
  await waitFor(
    () => {
      if (result.current.loading) {
        throw new Error('Still loading')
      }
    },
    { timeout }
  )
}

// Helper to wait for error states
export const waitForError = async (result, timeout = 5000) => {
  await waitFor(
    () => {
      if (!result.current.error) {
        throw new Error('No error present')
      }
    },
    { timeout }
  )
}

// Helper to wait for data to be present
export const waitForData = async (result, timeout = 5000) => {
  await waitFor(
    () => {
      if (!result.current.data) {
        throw new Error('No data present')
      }
    },
    { timeout }
  )
}

// Helper to test async hook patterns
export const testAsyncHook = async (hook, options = {}) => {
  const { initialProps = [], shouldWaitForData = true, timeout = 5000 } = options

  const result = renderHookWithProviders(
    () => hook(...initialProps),
    {
      wrapper: 'full',
      ...options,
    }
  )

  if (shouldWaitForData) {
    await waitForData(result.current, timeout)
  }

  return result
}

// Helper to test hook with different states
export const testHookStates = async (hook, stateConfigs = [], options = {}) => {
  const results = []

  for (const config of stateConfigs) {
    const { name, mockSetup, expectedState } = config

    // Setup mocks for this state
    if (mockSetup) {
      mockSetup()
    }

    const result = renderHookWithProviders(
      () => hook(...(config.initialProps || [])),
      {
        wrapper: config.wrapper || 'full',
        ...options,
      }
    )

    if (expectedState === 'loading') {
      await waitFor(() => {
        if (!result.current.loading) {
          throw new Error('Expected loading state')
        }
      })
    } else if (expectedState === 'error') {
      await waitForError(result.current)
    } else if (expectedState === 'success') {
      await waitForLoadingToFinish(result.current)
    }

    results.push({ name, result, config })
  }

  return results
}

// Helper to test hook with multiple renders
export const testHookRerender = (hook, propsArray, options = {}) => {
  const result = renderHookWithProviders(
    ({ props }) => hook(...props),
    {
      initialProps: { props: propsArray[0] },
      ...options,
    }
  )

  const renderResults = [result.current]

  for (let i = 1; i < propsArray.length; i++) {
    result.rerender({ props: propsArray[i] })
    renderResults.push(result.current)
  }

  return { result, renderResults }
}

// Helper to test hook cleanup
export const testHookCleanup = (hook, options = {}) => {
  const { onCleanup = vi.fn() } = options

  const result = renderHookWithProviders(() => hook(onCleanup), options)

  result.unmount()

  return { result, onCleanup }
}

// Helper to create test data for contracts
export const createContractTestData = (overrides = {}) => {
  return {
    contractAddress: 'mantra1contract1234567890abcdef',
    senderAddress: 'mantra1sender1234567890abcdef',
    funds: [{ denom: 'umantra', amount: '1000000' }],
    msg: { type: 'test', ...overrides },
    response: {
      data: new Uint8Array([1, 2, 3]),
      height: 12345,
      gasUsed: 150000,
      gasWanted: 200000,
      transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
      ...overrides.response,
    },
  }
}

// Helper to test blockchain interactions
export const testBlockchainInteraction = async (hookFunction, mockSetup, options = {}) => {
  const {
    args = [],
    expectedCallCount = 1,
    expectedArgs = null,
    expectedReturn = null,
    shouldThrow = false,
  } = options

  // Setup mocks
  mockSetup()

  const result = renderHookWithProviders(() => hookFunction, {
    wrapper: 'full',
  })

  // Call the function
  let returnedValue
  let caughtError

  try {
    returnedValue = await result.current(...args)
  } catch (error) {
    caughtError = error
  }

  // Assertions
  if (shouldThrow) {
    expect(caughtError).toBeDefined()
    expect(returnedValue).toBeUndefined()
  } else {
    expect(caughtError).toBeUndefined()
    expect(returnedValue).toBeDefined()
  }

  if (expectedReturn) {
    expect(returnedValue).toEqual(expectedReturn)
  }

  return { result, returnedValue, caughtError }
}

// Helper to test React Query integration
export const testReactQueryIntegration = async (hook, options = {}) => {
  const {
    queryKey = ['test'],
    initialData = null,
    shouldCache = true,
    shouldRefetch = false,
  } = options

  const queryClient = createTestQueryClient()

  const result = renderHookWithProviders(
    () => hook({ queryKey, initialData }),
    {
      queryClient,
      wrapper: 'query',
    }
  )

  // Wait for initial render
  await waitFor(() => {
    expect(result.current).toBeDefined()
  })

  // Test caching
  if (shouldCache) {
    const cachedData = queryClient.getQueryData(queryKey)
    expect(cachedData).toBeDefined()
  }

  // Test refetching
  if (shouldRefetch) {
    await result.current.refetch()
  }

  return { result, queryClient }
}

// Utility to create mock async functions with delays
export const createMockAsync = (returnValue, delay = 100, shouldFail = false) => {
  return vi.fn().mockImplementation(async (...args) => {
    await new Promise(resolve => setTimeout(resolve, delay))
    if (shouldFail) {
      throw new Error('Mock async function failed')
    }
    return typeof returnValue === 'function' ? returnValue(...args) : returnValue
  })
}

// Utility to test component integration with hooks
export const testHookInComponent = (HookComponent, options = {}) => {
  const { wrapper = null, ...renderOptions } = options

  return renderHookWithProviders(
    () => {
      // This would render your actual component that uses the hook
      return HookComponent
    },
    {
      wrapper: wrapper || 'full',
      ...renderOptions,
    }
  )
}