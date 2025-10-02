# Migration Guide: Security Updates

This guide helps you migrate your Scaffold MANTRA Chain project from the old version (graz 0.1.31 + CosmJS 0.31.3) to the new secure version (graz 0.3.7 + CosmJS 0.36.0).

## 🚨 Security Alert

**Old Version Status**: ⚠️ 13 vulnerabilities (2 moderate, 5 high, 6 critical)
**New Version Status**: ✅ All vulnerabilities resolved

## Why Migrate?

The old version contains serious security vulnerabilities in transitive dependencies:
- **Critical**: Elliptic cryptographic vulnerability in @walletconnect/utils
- **Critical**: SES vulnerabilities in @cosmsnap/snapper
- **High**: Axios vulnerabilities in @cosmjs/tendermint-rpc
- **Moderate**: esbuild vulnerability in vite

## Migration Overview

The migration involves updating dependencies and making code changes to accommodate breaking changes in the graz library.

### What's New in the Secure Version?

- **graz 0.3.7**: Latest stable version with security patches
- **CosmJS 0.36.0**: Updated blockchain libraries with vulnerability fixes
- **TanStack React Query**: Added for proper state management and caching
- **Modern Provider Architecture**: Required QueryClientProvider wrapper
- **No Legacy Dependencies**: Clean installation without `--legacy-peer-deps`

## Step-by-Step Migration

### 1. Update Dependencies

**Update your `package.json`:**

```json
{
  "dependencies": {
    "@cosmjs/cosmwasm-stargate": "0.36.0",
    "@cosmjs/encoding": "0.36.0",
    "@cosmjs/stargate": "0.36.0",
    "@cosmjs/tendermint-rpc": "0.36.0",
    "@tanstack/react-query": "^5.0.0",
    "graz": "0.3.7"
  }
}
```

**Remove old dependencies:**
- Remove any `@walletconnect/*` packages if manually installed
- Remove `@cosmsnap/snapper` if manually installed

**Install new dependencies:**
```bash
npm install
```

Note: No more `--legacy-peer-deps` flag needed!

### 2. Update Provider Architecture

**Old App.jsx structure:**
```jsx
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { GrazProvider } from 'graz'

function App() {
  return (
    <GrazProvider>
      <ChakraProvider>
        {/* Your app content */}
      </ChakraProvider>
    </GrazProvider>
  )
}
```

**New App.jsx structure:**
```jsx
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GrazProvider } from 'graz'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GrazProvider>
        <ChakraProvider>
          {/* Your app content */}
        </ChakraProvider>
      </GrazProvider>
    </QueryClientProvider>
  )
}
```

### 3. Update Chain Configuration

**Old GrazChain format (deprecated):**
```jsx
const chain = {
  chainId: "mantra-1",
  chainName: "MANTRA Chain",
  rpc: "https://rpc.mantrachain.io",
  rest: "https://api.mantrachain.io",
  // ... other properties
}
```

**New ChainInfo format:**
```jsx
import { mainnet } from "graz"

// Use built-in mainnet or create custom chain info
const chainInfo = {
  chainId: "mantra-1",
  chainName: "MANTRA Chain",
  rpc: ["https://rpc.mantrachain.io"],
  rest: ["https://api.mantrachain.io"],
  stakeCurrency: {
    coinDenom: "MANTRA",
    coinMinimalDenom: "umantra",
    coinDecimals: 6,
    coinGeckoId: "mantra-dao",
    coinImageUrl: "https://example.com/mantra.png"
  },
  bip44: {
    coinType: 118
  },
  bech32Config: {
    bech32PrefixAccAddr: "mantra",
    bech32PrefixAccPub: "mantrapub",
    bech32PrefixValAddr: "mantravaloper",
    bech32PrefixValPub: "mantravaloperpub",
    bech32PrefixConsAddr: "mantravalcons",
    bech32PrefixConsPub: "mantravalconspub"
  },
  currencies: [{
    coinDenom: "MANTRA",
    coinMinimalDenom: "umantra",
    coinDecimals: 6,
    coinGeckoId: "mantra-dao",
    coinImageUrl: "https://example.com/mantra.png"
  }],
  feeCurrencies: [{
    coinDenom: "MANTRA",
    coinMinimalDenom: "umantra",
    coinDecimals: 6,
    coinGeckoId: "mantra-dao",
    coinImageUrl: "https://example.com/mantra.png"
  }],
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04
  }
}
```

### 4. Update Hook Usage

**Old hook patterns (graz 0.1.x):**
```jsx
import { useAccount, useConnect } from 'graz'

const { account, data } = useAccount()
const { connect } = useConnect()
```

**New hook patterns (graz 0.3.x):**
```jsx
import { useAccount, useConnect, useDisconnect } from 'graz'

// Account hook now returns object format
const { data: account, isConnected, isConnecting } = useAccount()

// Connect hook uses object parameters
const { connect, isConnecting } = useConnect({
  chainInfo: chainInfo
})

// Disconnect hook available
const { disconnect } = useDisconnect()
```

### 5. Update Contract Interaction Hooks

**Old useTodoContract.js pattern:**
```jsx
import { useState, useEffect } from 'react'

const useTodoContract = () => {
  const [loading, setLoading] = useState(false)

  const queryTodos = async () => {
    // Direct CosmJS usage
  }

  return { loading, queryTodos }
}
```

**New useTodoContract.js pattern:**
```jsx
import { useState, useEffect } from 'react'
import { useCosmWasmClient, useSigningCosmWasmClient } from 'graz'
import { useQuery, useMutation } from '@tanstack/react-query'

const useTodoContract = (contractAddress) => {
  // Get clients from graz
  const { data: cosmWasmClient } = useCosmWasmClient()
  const { data: signingClient } = useSigningCosmWasmClient()

  // Use React Query for caching
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos', contractAddress],
    queryFn: async () => {
      if (!cosmWasmClient || !contractAddress) return []

      const result = await cosmWasmClient.queryContractSmart(
        contractAddress,
        { get_todos: {} }
      )
      return result.todos || []
    },
    enabled: !!cosmWasmClient && !!contractAddress
  })

  const addTodoMutation = useMutation({
    mutationFn: async (todoText) => {
      if (!signingClient || !contractAddress) {
        throw new Error('Wallet not connected or contract address missing')
      }

      return await signingClient.execute(
        account.address,
        contractAddress,
        { add_todo: { text: todoText } },
        'auto'
      )
    },
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries(['todos', contractAddress])
    }
  })

  return {
    todos,
    isLoading,
    error,
    addTodo: addTodoMutation.mutate,
    isAddingTodo: addTodoMutation.isPending
  }
}
```

### 6. Update Environment Variables

**Create or update `.env` file:**
```env
# MANTRA Chain Configuration
VITE_MANTRA_CHAIN_ID=mantra-1
VITE_MANTRA_RPC_URL=https://rpc.mantrachain.io
VITE_MANTRA_REST_URL=https://api.mantrachain.io

# Your Contract Address
VITE_CONTRACT_ADDRESS=your_contract_address_here

# Optional: Gas configuration
VITE_GAS_PRICE=0.025umantra
VITE_GAS_LIMIT=200000
```

### 7. Update Wallet Connection UI

**Old wallet connection:**
```jsx
const { connect } = useConnect()
const { account } = useAccount()

<button onClick={() => connect('keplr')}>
  Connect Wallet
</button>
```

**New wallet connection:**
```jsx
import { useAccount, useConnect, useDisconnect } from 'graz'

const WalletConnection = () => {
  const { data: account, isConnected, isConnecting } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnecting) {
    return <button disabled>Connecting...</button>
  }

  if (isConnected && account) {
    return (
      <div>
        <span>Connected: {account.bech32Address}</span>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <button onClick={() => connect()}>
      Connect Wallet
    </button>
  )
}
```

## Testing Your Migration

### 1. Basic Connectivity Tests
- [ ] Application starts without errors
- [ ] Can connect to wallet (Keplr, Leap, etc.)
- [ ] Wallet address displays correctly
- [ ] Can disconnect from wallet

### 2. Contract Interaction Tests
- [ ] Can query contract state
- [ ] Can execute contract functions
- [ ] Transactions complete successfully
- [ ] Error handling works correctly

### 3. React Query Tests
- [ ] Data caching works properly
- [ ] Loading states display correctly
- [ ] Error states handle gracefully
- [ ] Data refetches on mutations

### 4. Build and Production Tests
- [ ] `npm run build` completes successfully
- [ ] `npm run preview` works correctly
- [ ] All functionality works in production build

## Common Issues and Solutions

### Issue 1: QueryClientProvider missing
**Error**: "useQuery must be used within a QueryClientProvider"

**Solution**: Ensure QueryClientProvider wraps your entire app:
```jsx
<QueryClientProvider client={queryClient}>
  <GrazProvider>
    {/* App content */}
  </GrazProvider>
</QueryClientProvider>
```

### Issue 2: Chain configuration error
**Error**: "Invalid chain configuration"

**Solution**: Update to new ChainInfo format with all required properties.

### Issue 3: Hook parameter changes
**Error**: "Hook expects object parameters"

**Solution**: Update hook calls to use object parameters instead of positional arguments.

### Issue 4: Missing React Query dependency
**Error**: Cannot resolve '@tanstack/react-query'

**Solution**: Install the dependency: `npm install @tanstack/react-query`

### Issue 5: Contract client not available
**Error**: cosmwasmClient is undefined

**Solution**: Ensure wallet is connected before using contract clients, use proper loading states.

## Rollback Plan

If you need to rollback to the old version:

1. **Restore package.json** to old dependency versions
2. **Remove QueryClientProvider** wrapper from App.jsx
3. **Restore old hook patterns** in your components
4. **Update chain configuration** back to GrazChain format
5. **Install with legacy peer deps**: `npm install --legacy-peer-deps`

## Need Help?

- Check the [AGENTS.md](./AGENTS.md) file for detailed implementation guidelines
- Review the updated code examples in the documentation
- Test thoroughly before deploying to production
- Consider running the migration in a dedicated branch first

---

**Migration Complete!** 🎉

Your application is now running with the latest secure dependencies and modern React patterns. All security vulnerabilities have been resolved.