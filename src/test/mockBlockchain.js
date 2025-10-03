import { rest } from 'msw'

// Mock blockchain API handlers
export const blockchainHandlers = [
  // Mock RPC endpoint
  rest.post('https://rpc.mantrachain.io', (req, res, ctx) => {
    const { method } = req.body

    switch (method) {
      case 'status':
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
              },
              sync_info: {
                latest_block_hash: 'test-block-hash',
                latest_app_hash: 'test-app-hash',
                latest_block_height: '12345',
                latest_block_time: '2024-01-01T00:00:00Z',
                earliest_block_hash: 'test-earliest-hash',
                earliest_block_height: '1',
                earliest_block_time: '2024-01-01T00:00:00Z',
                catching_up: false
              },
              validator_info: {
                address: 'test-validator-address',
                pub_key: { type: 'tendermint/PubKeyEd25519', value: 'test-pub-key' },
                voting_power: '100'
              }
            }
          })
        )

      case 'block':
        return res(
          ctx.json({
            jsonrpc: '2.0',
            id: 1,
            result: {
              block: {
                header: {
                  version: { block: '11', app: '0' },
                  chain_id: 'mantrachain-1',
                  height: '12345',
                  time: '2024-01-01T00:00:00Z',
                  last_block_id: { hash: 'test-last-block-hash' },
                  last_commit_hash: 'test-last-commit-hash',
                  data_hash: 'test-data-hash',
                  validators_hash: 'test-validators-hash',
                  next_validators_hash: 'test-next-validators-hash',
                  consensus_hash: 'test-consensus-hash',
                  app_hash: 'test-app-hash',
                  last_results_hash: 'test-last-results-hash',
                  evidence_hash: 'test-evidence-hash',
                  proposer_address: 'test-proposer-address'
                },
                data: {
                  txs: ['test-tx-data']
                },
                evidence: {
                  evidence: []
                },
                last_commit: {
                  block_id: { hash: 'test-block-id' },
                  signatures: []
                }
              }
            }
          })
        )

      default:
        return res(
          ctx.status(404),
          ctx.json({ error: 'Method not found' })
        )
    }
  }),

  // Mock REST API endpoints
  rest.get('https://api.mantrachain.io/cosmos/bank/v1/balances/:address', (req, res, ctx) => {
    const { address } = req.params

    return res(
      ctx.json({
        balances: [
          { denom: 'umantra', amount: '1000000' },
          { denom: 'uatom', amount: '500000' }
        ]
      })
    )
  }),

  rest.get('https://api.mantrachain.io/cosmos/staking/v1beta1/validators', (req, res, ctx) => {
    return res(
      ctx.json({
        validators: [
          {
            operator_address: 'mantravaloper1testaddress',
            consensus_pubkey: { '@type': '/cosmos.crypto.ed25519.PubKey', key: 'test-pubkey' },
            jailed: false,
            status: 'BOND_STATUS_BONDED',
            tokens: '1000000000',
            delegator_shares: '1000000000',
            description: { moniker: 'Test Validator', identity: '', website: '', security_contact: '', details: '' },
            unbonding_height: '0',
            unbonding_time: '1970-01-01T00:00:00Z',
            commission: {
              commission_rates: { rate: '0.100000000000000000', max_rate: '0.200000000000000000', max_change_rate: '0.010000000000000000' },
              update_time: '2024-01-01T00:00:00Z'
            },
            min_self_delegation: '1'
          }
        ]
      })
    )
  }),

  // Mock CosmWasm contract queries
  rest.get('https://api.mantrachain.io/cosmwasm/wasm/v1/contract/:address/smart', (req, res, ctx) => {
    const { address } = req.params
    const query = req.url.searchParams.get('query_msg')

    try {
      const queryData = JSON.parse(query)

      if (queryData.get_todos) {
        return res(
          ctx.json({
            data: JSON.stringify({
              todos: [
                { id: 1, title: 'Test Todo 1', completed: false },
                { id: 2, title: 'Test Todo 2', completed: true }
              ]
            })
          })
        )
      }

      if (queryData.get_todo) {
        return res(
          ctx.json({
            data: JSON.stringify({
              id: queryData.get_todo.id,
              title: 'Test Todo',
              completed: false
            })
          })
        )
      }

      return res(
        ctx.json({
          data: JSON.stringify({})
        })
      )
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Invalid query' })
      )
    }
  }),

  // Mock contract execution
  rest.post('https://api.mantrachain.io/cosmos/tx/v1beta1/txs', (req, res, ctx) => {
    return res(
      ctx.json({
        tx_response: {
          height: '12345',
          txhash: 'test-tx-hash',
          codespace: '',
          code: 0,
          data: '',
          raw_log: '[{"events":[{"type":"message","attributes":[{"key":"action","value":"execute"}]}]}]',
          logs: [{ msg_index: 0, log: '', events: [] }],
          info: '',
          gas_wanted: '200000',
          gas_used: '150000',
          tx: null,
          timestamp: '2024-01-01T00:00:00Z',
          events: []
        }
      })
    )
  }),

  // Mock NFT queries
  rest.get('https://api.mantrachain.io/cosmwasm/wasm/v1/contract/:address/nfts', (req, res, ctx) => {
    return res(
      ctx.json({
        tokens: [
          {
            token_id: '1',
            owner: 'mantra1testaddress123456789',
            extension: {
              name: 'Test NFT',
              description: 'This is a test NFT',
              image: 'https://example.com/image.png'
            }
          }
        ]
      })
    )
  })
]

// Helper functions for custom mock responses
export const createMockTransaction = (overrides = {}) => ({
  hash: 'test-tx-hash',
  height: 12345,
  code: 0,
  gasUsed: 50000,
  gasWanted: 100000,
  timestamp: '2024-01-01T00:00:00Z',
  logs: [],
  ...overrides
})

export const createMockBalance = (denom = 'umantra', amount = '1000000') => ({
  denom,
  amount: amount.toString(),
  formattedAmount: `${(parseInt(amount) / 1000000).toFixed(6)} MANTRA`
})

export const createMockValidator = (overrides = {}) => ({
  operator_address: 'mantravaloper1testaddress',
  consensus_pubkey: { '@type': '/cosmos.crypto.ed25519.PubKey', key: 'test-pubkey' },
  jailed: false,
  status: 'BOND_STATUS_BONDED',
  tokens: '1000000000',
  delegator_shares: '1000000000',
  description: { moniker: 'Test Validator', identity: '', website: '', security_contact: '', details: '' },
  ...overrides
})