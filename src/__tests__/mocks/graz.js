import { vi } from 'vitest'

// Mock account data
export const mockAccount = {
  name: 'Keplr',
  bech32Address: 'mantra1example123456789abcdefghijklmnopqrstuvwxyz',
  pubkey: 'A1B2C3D4E5F67890123456789012345678901234',
  algo: 'secp256k1',
}

// Mock graz hooks
export const createMockUseAccount = (overrides = {}) => {
  return {
    data: null,
    isConnected: false,
    isLoading: false,
    error: null,
    reconnect: vi.fn(),
    disconnect: vi.fn(),
    ...overrides,
  }
}

export const createMockUseConnect = (overrides = {}) => {
  return {
    connect: vi.fn(),
    isLoading: false,
    error: null,
    isConnecting: false,
    ...overrides,
  }
}

export const createMockUseDisconnect = (overrides = {}) => {
  return {
    disconnect: vi.fn(),
    isLoading: false,
    error: null,
    ...overrides,
  }
}

// Mock GrazProvider context
export const createMockGrazContext = (overrides = {}) => {
  return {
    chains: [],
    activeChain: null,
    setActiveChain: vi.fn(),
    ...overrides,
  }
}

// Mock connect function behavior
export const createMockConnectFunction = (shouldSucceed = true) => {
  return vi.fn().mockImplementation(async () => {
    if (!shouldSucceed) {
      throw new Error('Connection failed')
    }
    return Promise.resolve()
  })
}

// Mock disconnect function behavior
export const createMockDisconnectFunction = (shouldSucceed = true) => {
  return vi.fn().mockImplementation(async () => {
    if (!shouldSucceed) {
      throw new Error('Disconnection failed')
    }
    return Promise.resolve()
  })
}

// Test data for different connection states
export const mockStates = {
  disconnected: {
    useAccount: createMockUseAccount({ isConnected: false, data: null }),
    useConnect: createMockUseConnect(),
    useDisconnect: createMockUseDisconnect(),
  },
  connected: {
    useAccount: createMockUseAccount({
      isConnected: true,
      data: mockAccount
    }),
    useConnect: createMockUseConnect(),
    useDisconnect: createMockUseDisconnect(),
  },
  connecting: {
    useAccount: createMockUseAccount({ isConnected: false, isLoading: true }),
    useConnect: createMockUseConnect({ isConnecting: true, isLoading: true }),
    useDisconnect: createMockUseDisconnect(),
  },
  error: {
    useAccount: createMockUseAccount({ error: new Error('Account error') }),
    useConnect: createMockUseConnect({ error: new Error('Connection error') }),
    useDisconnect: createMockUseDisconnect(),
  }
}