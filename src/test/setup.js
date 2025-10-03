import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

// Mock blockchain RPC endpoints
export const handlers = [
  // Mock MANTRA Chain RPC endpoint
  rest.get('https://rpc.mantrachain.io', (req, res, ctx) => {
    return res(
      ctx.json({
        jsonrpc: '2.0',
        id: 1,
        result: {
          node_info: {
            protocol_version: { p2p: '8', block: '11', app: '0' },
            default_node_id: 'test-node-id',
            listen_addr: 'tcp://0.0.0.0:26656',
            network: 'mantrachain-1',
            version: '0.34.28',
            channels: '40141536278258',
            moniker: 'test-node',
            other: { tx_index: 'on', rpc_address: 'tcp://0.0.0.0:26657' }
          }
        }
      })
    )
  }),

  // Mock contract query endpoint
  rest.post('/cosmwasm/wasm/v1/contract/:address/smart', (req, res, ctx) => {
    const { address } = req.params
    return res(
      ctx.json({
        data: {
          // Mock contract query response
          todos: [
            { id: 1, title: 'Test Todo 1', completed: false },
            { id: 2, title: 'Test Todo 2', completed: true }
          ]
        }
      })
    )
  }),

  // Mock wallet balance query
  rest.get('/cosmos/bank/v1/balances/:address', (req, res, ctx) => {
    return res(
      ctx.json({
        balances: [
          { denom: 'umantra', amount: '1000000' },
          { denom: 'uatom', amount: '500000' }
        ]
      })
    )
  })
]

// Setup MSW server
export const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen())

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Close server after all tests
afterAll(() => server.close())

// Mock graz wallet hooks
vi.mock('graz', () => ({
  useAccount: () => ({
    data: {
      bech32Address: 'mantra1testaddress123456789',
      base64Address: 'test-base64-address'
    },
    isLoading: false,
    isConnected: true
  }),
  useConnect: () => ({
    connect: vi.fn(),
    connectKeplr: vi.fn(),
    connectLeap: vi.fn(),
    isLoading: false
  }),
  useDisconnect: () => ({
    disconnect: vi.fn(),
    isLoading: false
  }),
  useBalance: () => ({
    data: {
      denom: 'umantra',
      amount: '1000000',
      formattedAmount: '1.000000 MANTRA'
    },
    isLoading: false,
    refetch: vi.fn()
  }),
  useSendTokens: () => ({
    sendTokens: vi.fn(),
    isLoading: false
  })
}))

// Mock React Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: () => ({
      invalidateQueries: vi.fn(),
      refetchQueries: vi.fn()
    })
  }
})