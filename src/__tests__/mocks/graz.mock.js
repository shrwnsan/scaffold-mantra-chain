// Mock utilities for graz hooks and wallet interactions
import { vi } from 'vitest'

// Mock account data
export const mockAccount = {
  name: 'Test Wallet',
  address: 'mantra1testaddress1234567890abcdef',
  bech32Address: 'mantra1testaddress1234567890abcdef',
  pubkey: 'testpubkey1234567890abcdef',
  algo: 'secp256k1',
  addressHash: undefined,
  addressLength: undefined,
  prefix: 'mantra',
  type: 'cosmos',
  username: 'testuser',
  logo: 'test-logo.png',
}

// Mock graz hooks
export const mockUseAccount = vi.fn()
export const mockUseConnect = vi.fn()
export const mockUseDisconnect = vi.fn()
export const mockUseBalance = vi.fn()
export const mockUseStake = vi.fn()
export const mockUseCosmWasmClient = vi.fn()
export const mockUseSigningCosmWasmClient = vi.fn()

// Default successful mock implementations
mockUseAccount.mockReturnValue({
  data: mockAccount,
  isConnected: true,
  isLoading: false,
  isError: false,
  error: null,
})

mockUseConnect.mockReturnValue({
  connect: jest.fn().mockResolvedValue(undefined),
  isLoading: false,
  isError: false,
  error: null,
})

mockUseDisconnect.mockReturnValue({
  disconnect: jest.fn().mockResolvedValue(undefined),
  isLoading: false,
  isError: false,
  error: null,
})

mockUseBalance.mockReturnValue({
  data: {
    denom: 'umantra',
    amount: '1000000',
    displayDenom: 'MANTRA',
    displayAmount: '1.0',
  },
  isLoading: false,
  isError: false,
  error: null,
})

mockUseStake.mockReturnValue({
  data: {
    delegations: [],
    unbondings: [],
    rewards: [],
  },
  isLoading: false,
  isError: false,
  error: null,
})

// Helper functions to configure mock states
export const configureAccountMock = (state = 'connected') => {
  switch (state) {
    case 'disconnected':
      mockUseAccount.mockReturnValue({
        data: null,
        isConnected: false,
        isLoading: false,
        isError: false,
        error: null,
      })
      break
    case 'loading':
      mockUseAccount.mockReturnValue({
        data: null,
        isConnected: false,
        isLoading: true,
        isError: false,
        error: null,
      })
      break
    case 'error':
      mockUseAccount.mockReturnValue({
        data: null,
        isConnected: false,
        isLoading: false,
        isError: true,
        error: new Error('Failed to connect wallet'),
      })
      break
    case 'connected':
    default:
      mockUseAccount.mockReturnValue({
        data: mockAccount,
        isConnected: true,
        isLoading: false,
        isError: false,
        error: null,
      })
      break
  }
}

export const configureConnectMock = (state = 'success') => {
  const mockConnect = jest.fn()

  switch (state) {
    case 'loading':
      mockConnect.mockReturnValue(new Promise(() => {})) // Never resolves
      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isLoading: true,
        isError: false,
        error: null,
      })
      break
    case 'error':
      const connectError = new Error('Connection failed')
      mockConnect.mockRejectedValue(connectError)
      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isLoading: false,
        isError: true,
        error: connectError,
      })
      break
    case 'success':
    default:
      mockConnect.mockResolvedValue(undefined)
      mockUseConnect.mockReturnValue({
        connect: mockConnect,
        isLoading: false,
        isError: false,
        error: null,
      })
      break
  }
}

export const configureDisconnectMock = (state = 'success') => {
  const mockDisconnect = jest.fn()

  switch (state) {
    case 'loading':
      mockDisconnect.mockReturnValue(new Promise(() => {})) // Never resolves
      mockUseDisconnect.mockReturnValue({
        disconnect: mockDisconnect,
        isLoading: true,
        isError: false,
        error: null,
      })
      break
    case 'error':
      const disconnectError = new Error('Disconnection failed')
      mockDisconnect.mockRejectedValue(disconnectError)
      mockUseDisconnect.mockReturnValue({
        disconnect: mockDisconnect,
        isLoading: false,
        isError: true,
        error: disconnectError,
      })
      break
    case 'success':
    default:
      mockDisconnect.mockResolvedValue(undefined)
      mockUseDisconnect.mockReturnValue({
        disconnect: mockDisconnect,
        isLoading: false,
        isError: false,
        error: null,
      })
      break
  }
}

export const configureBalanceMock = (state = 'success', balanceData = null) => {
  switch (state) {
    case 'loading':
      mockUseBalance.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      })
      break
    case 'error':
      mockUseBalance.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('Failed to fetch balance'),
      })
      break
    case 'success':
    default:
      mockUseBalance.mockReturnValue({
        data: balanceData || {
          denom: 'umantra',
          amount: '1000000',
          displayDenom: 'MANTRA',
          displayAmount: '1.0',
        },
        isLoading: false,
        isError: false,
        error: null,
      })
      break
  }
}

// Helper function to setup all graz mocks
export const setupGrazMocks = (accountState = 'connected', connectState = 'success') => {
  jest.clearAllMocks()

  configureAccountMock(accountState)
  configureConnectMock(connectState)
  configureDisconnectMock('success')
  configureBalanceMock('success')

  return {
    mockUseAccount,
    mockUseConnect,
    mockUseDisconnect,
    mockUseBalance,
    mockAccount,
  }
}

// Mock GrazProvider for React components
export const mockGrazProvider = ({ children }) => children

// Mock graz module
export const mockGraz = {
  useAccount: mockUseAccount,
  useConnect: mockUseConnect,
  useDisconnect: mockUseDisconnect,
  useBalance: mockUseBalance,
  useStake: mockUseStake,
  useCosmWasmClient: mockUseCosmWasmClient,
  useSigningCosmWasmClient: mockUseSigningCosmWasmClient,
  GrazProvider: mockGrazProvider,
}

// Helper to mock entire graz module
export const mockGrazModule = () => {
  jest.mock('graz', () => mockGraz)
  return mockGraz
}

// Helper to create custom account data
export const createMockAccount = (overrides = {}) => {
  return {
    ...mockAccount,
    ...overrides,
  }
}

// Helper to simulate wallet events
export const simulateWalletEvent = (eventType, data = {}) => {
  const event = new CustomEvent(eventType, { detail: data })
  window.dispatchEvent(event)
}