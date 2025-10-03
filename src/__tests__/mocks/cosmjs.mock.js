// Mock utilities for CosmJS clients and blockchain interactions
import { vi } from 'vitest'

// Mock CosmWasm client query responses
export const mockQueryClient = {
  queryContractSmart: vi.fn(),
  queryContractRaw: vi.fn(),
  getChainId: vi.fn(),
  getHeight: vi.fn(),
  getAccount: vi.fn(),
  getBalance: vi.fn(),
  getAllBalances: vi.fn(),
  getSupply: vi.fn(),
  getDenomsMetadata: vi.fn(),
  getInflation: vi.fn(),
  getAnnualProvisions: vi.fn(),
  getStakingParams: vi.fn(),
  getPool: vi.fn(),
  getDelegation: vi.fn(),
  getUnbondingDelegation: vi.fn(),
  getRedelegations: vi.fn(),
  getValidators: vi.fn(),
  getValidator: vi.fn(),
  getValidatorSigningInfo: vi.fn(),
  getSlashingParams: vi.fn(),
  simulate: vi.fn(),
  getTx: vi.fn(),
  searchTx: vi.fn(),
  broadcastTx: vi.fn(),
  getCodes: vi.fn(),
  getCode: vi.fn(),
  getContracts: vi.fn(),
  getContractCodeHistory: vi.fn(),
  getContractInfo: vi.fn(),
}

// Mock Signing CosmWasm client for transactions
export const mockSigningClient = {
  ...mockQueryClient,
  signAndBroadcast: vi.fn(),
  sign: vi.fn(),
  broadcast: vi.fn(),
  execute: vi.fn(),
  instantiate: vi.fn(),
  migrate: vi.fn(),
  updateAdmin: vi.fn(),
  clearAdmin: vi.fn(),
  sendTokens: vi.fn(),
  delegateTokens: vi.fn(),
  undelegateTokens: vi.fn(),
  redelegateTokens: vi.fn(),
  withdrawRewards: vi.fn(),
  submitProposal: vi.fn(),
  voteProposal: vi.fn(),
  depositProposal: vi.fn(),
  cancelProposal: vi.fn(),
  executeContract: vi.fn(),
}

// Mock transaction responses
export const mockTransactionResult = {
  height: 12345,
  gasUsed: 150000,
  gasWanted: 200000,
  transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
  code: 0,
  logs: [
    {
      msg_index: 0,
      log: '',
      events: [
        {
          type: 'execute_contract',
          attributes: [
            { key: 'action', value: 'execute' },
            { key: 'contract_address', value: 'mantra1contract1234567890abcdef' },
          ],
        },
      ],
    },
  ],
}

// Mock contract query responses
export const mockContractQueryResponse = {
  todos: [
    {
      id: 1,
      text: 'Test todo 1',
      completed: false,
      created_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      text: 'Test todo 2',
      completed: true,
      created_at: '2023-01-02T00:00:00Z',
    },
  ],
}

// Mock contract execute response
export const mockContractExecuteResponse = {
  data: new Uint8Array([1, 2, 3, 4]),
  height: 12345,
  gasUsed: 150000,
  gasWanted: 200000,
  transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
  logs: [
    {
      msg_index: 0,
      log: '',
      events: [
        {
          type: 'wasm',
          attributes: [
            { key: 'action', value: 'add_todo' },
            { key: 'todo_id', value: '3' },
          ],
        },
      ],
    },
  ],
}

// Helper function to setup CosmJS mocks
export const setupCosmJSMocks = () => {
  // Reset all mocks before setting them up
  vi.clearAllMocks()

  // Setup default success responses
  mockQueryClient.queryContractSmart.mockResolvedValue(mockContractQueryResponse)
  mockQueryClient.getChainId.mockResolvedValue('mantra-1')
  mockQueryClient.getHeight.mockResolvedValue(12345)

  mockSigningClient.signAndBroadcast.mockResolvedValue(mockTransactionResult)
  mockSigningClient.execute.mockResolvedValue(mockContractExecuteResponse)

  return {
    mockQueryClient,
    mockSigningClient,
    mockTransactionResult,
    mockContractQueryResponse,
    mockContractExecuteResponse,
  }
}

// Helper function to simulate network errors
export const simulateCosmJSError = (message = 'Network error') => {
  const error = new Error(message)
  error.code = 1
  mockQueryClient.queryContractSmart.mockRejectedValue(error)
  mockSigningClient.signAndBroadcast.mockRejectedValue(error)
  return error
}

// Helper function to simulate contract execution failure
export const simulateContractExecuteFailure = () => {
  const failedResult = {
    ...mockTransactionResult,
    code: 1,
    rawLog: 'contract execution failed: insufficient funds',
  }
  mockSigningClient.signAndBroadcast.mockResolvedValue(failedResult)
  return failedResult
}

// Mock hook for CosmWasm client
export const mockUseCosmWasmClient = vi.fn()
export const mockUseSigningCosmWasmClient = vi.fn()

// Setup mock implementations
mockUseCosmWasmClient.mockReturnValue({
  data: mockQueryClient,
  isLoading: false,
  isError: false,
  error: null,
})

mockUseSigningCosmWasmClient.mockReturnValue({
  data: mockSigningClient,
  isLoading: false,
  isError: false,
  error: null,
})

// Helper to configure mock hook states
export const configureCosmWasmClientMock = (state = 'success') => {
  switch (state) {
    case 'loading':
      mockUseCosmWasmClient.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      })
      break
    case 'error':
      mockUseCosmWasmClient.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('Failed to connect to blockchain'),
      })
      break
    default: // success
      mockUseCosmWasmClient.mockReturnValue({
        data: mockQueryClient,
        isLoading: false,
        isError: false,
        error: null,
      })
  }
}

export const configureSigningCosmWasmClientMock = (state = 'success') => {
  switch (state) {
    case 'loading':
      mockUseSigningCosmWasmClient.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      })
      break
    case 'error':
      mockUseSigningCosmWasmClient.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('Failed to create signing client'),
      })
      break
    default: // success
      mockUseSigningCosmWasmClient.mockReturnValue({
        data: mockSigningClient,
        isLoading: false,
        isError: false,
        error: null,
      })
  }
}