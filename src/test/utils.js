import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GrazProvider } from 'graz'
import { vi } from 'vitest'

// Mock providers configuration
export const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: Infinity,
      },
    },
  })
}

// Test wrapper with all providers
export const TestWrapper = ({ children }) => {
  const queryClient = createMockQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <GrazProvider>
        {children}
      </GrazProvider>
    </QueryClientProvider>
  )
}

// Custom render function with providers
export const renderWithProviders = (ui, options = {}) => {
  return render(ui, { wrapper: TestWrapper, ...options })
}

// Wait for a specified amount of time (useful for async operations)
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock blockchain responses
export const mockBlockchainResponse = (data) => {
  return {
    jsonrpc: '2.0',
    id: 1,
    result: data
  }
}

// Mock wallet state
export const mockWalletState = {
  isConnected: true,
  address: 'mantra1testaddress123456789',
  balance: {
    denom: 'umantra',
    amount: '1000000',
    formattedAmount: '1.000000 MANTRA'
  }
}

// Mock contract responses
export const mockContractQuery = (queryResponse) => {
  return {
    data: queryResponse
  }
}

// Mock error responses
export const mockError = (message, code = 500) => {
  const error = new Error(message)
  error.code = code
  return error
}

// Create mock transaction
export const mockTransaction = (hash = 'test-tx-hash') => ({
  hash,
  height: 12345,
  code: 0,
  gasUsed: 50000,
  gasWanted: 100000,
  timestamp: new Date().toISOString()
})

// Mock token balance
export const mockTokenBalance = (denom = 'umantra', amount = '1000000') => ({
  denom,
  amount,
  formattedAmount: `${(parseInt(amount) / 1000000).toFixed(6)} MANTRA`
})

// Mock contract execution
export const mockContractExecution = (result = {}) => ({
  logs: [],
  data: new Uint8Array(),
  events: [],
  gasUsed: 50000,
  height: 12345,
  transactionHash: 'test-tx-hash',
  ...result
})

// Mock contract query result
export const mockContractQueryResult = (data = {}) => ({
  data: {
    todos: [
      { id: 1, title: 'Test Todo 1', completed: false },
      { id: 2, title: 'Test Todo 2', completed: true }
    ],
    ...data
  }
})

// Helper to simulate user interactions with forms
export const fillForm = async (screen, fields) => {
  for (const [name, value] of Object.entries(fields)) {
    const input = screen.getByLabelText(name) || screen.getByPlaceholderText(name)
    await userEvent.type(input, value)
  }
}

// Helper to check if element has expected class
export const hasClass = (element, className) => {
  return element.classList.contains(className)
}

// Helper to mock window.location
export const mockLocation = (href = 'http://localhost:5173') => {
  delete window.location
  window.location = new URL(href)
}

// Helper to mock localStorage
export const mockLocalStorage = () => {
  const store = {}
  return {
    getItem: vi.fn((key) => store[key]),
    setItem: vi.fn((key, value) => {
      store[key] = value
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    })
  }
}

// Helper to create mock component props
export const createMockProps = (overrides = {}) => ({
  className: '',
  children: null,
  disabled: false,
  onClick: vi.fn(),
  ...overrides
})