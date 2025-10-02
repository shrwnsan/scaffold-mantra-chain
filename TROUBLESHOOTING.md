# Troubleshooting Guide

This guide covers common issues and solutions when working with the updated Scaffold MANTRA Chain project.

## Installation Issues

### Issue: npm install fails with peer dependency conflicts

**Old Problem** (Resolved):
```bash
npm install --legacy-peer-deps
```

**New Solution**:
```bash
npm install
```

If you still have peer dependency issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Cannot find module '@tanstack/react-query'

**Symptoms**:
- Import errors for QueryClient, QueryClientProvider
- Build failures

**Solutions**:
1. Install the missing dependency:
```bash
npm install @tanstack/react-query
```

2. Verify package.json includes:
```json
"@tanstack/react-query": "^5.0.0"
```

3. Clear and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Provider Issues

### Issue: "useQuery must be used within a QueryClientProvider"

**Symptoms**:
- React Query hooks fail to work
- Application crashes on startup

**Solutions**:
1. Ensure proper provider wrapping in App.jsx:
```jsx
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

2. Check that QueryClientProvider is the outermost provider

### Issue: GrazProvider configuration errors

**Symptoms**:
- Wallet connection fails
- Chain configuration errors

**Solutions**:
1. Update chain configuration to new ChainInfo format:
```jsx
const chainInfo = {
  chainId: "mantra-1",
  chainName: "MANTRA Chain",
  rpc: ["https://rpc.mantrachain.io"],
  rest: ["https://api.mantrachain.io"],
  // ... other required properties
}
```

2. Use environment variables for chain URLs:
```jsx
const chainInfo = {
  rpc: [import.meta.env.VITE_MANTRA_RPC_URL],
  rest: [import.meta.env.VITE_MANTRA_REST_URL],
}
```

## Wallet Connection Issues

### Issue: Wallet (Keplr/Leap) not connecting

**Symptoms**:
- Connection button does nothing
- Connection timeout errors

**Solutions**:
1. Ensure wallet extension is installed and enabled
2. Check that wallet supports MANTRA Chain
3. Verify chain configuration matches wallet's expectations
4. Try manually adding chain to wallet:
   - Chain ID: `mantra-1`
   - RPC URL: `https://rpc.mantrachain.io`
   - REST URL: `https://api.mantrachain.io`

### Issue: Account data not available

**Symptoms**:
- `useAccount()` returns undefined
- Cannot get wallet address

**Solutions**:
1. Check wallet connection status:
```jsx
const { data: account, isConnected, isConnecting } = useAccount()

if (isConnecting) return <div>Connecting...</div>
if (!isConnected) return <div>Not connected</div>

// Now use account data
console.log(account?.bech32Address)
```

2. Ensure wallet is properly connected before using account data

## Contract Interaction Issues

### Issue: useCosmWasmClient returns undefined

**Symptoms**:
- Cannot query contract state
- Contract client is null/undefined

**Solutions**:
1. Ensure wallet is connected before accessing clients:
```jsx
const { data: cosmWasmClient } = useCosmWasmClient()
const { isConnected } = useAccount()

if (!isConnected || !cosmWasmClient) {
  return <div>Please connect wallet</div>
}

// Now use the client
```

2. Check that RPC URL is accessible and responding
3. Verify network connectivity

### Issue: Contract query fails

**Symptoms**:
- QueryContractSmart returns errors
- Cannot read contract state

**Solutions**:
1. Verify contract address is correct:
```jsx
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
if (!contractAddress) {
  throw new Error('Contract address not configured')
}
```

2. Check query message format:
```jsx
const result = await cosmWasmClient.queryContractSmart(
  contractAddress,
  { get_todos: {} } // Use correct query format
)
```

3. Ensure contract is deployed and accessible on the chain

### Issue: Contract execution fails

**Symptoms**:
- Transactions fail or revert
- Gas estimation errors

**Solutions**:
1. Check wallet has sufficient balance for gas fees
2. Verify execute message format matches contract expectations:
```jsx
await signingClient.execute(
  account.address,
  contractAddress,
  { add_todo: { text: todoText } }, // Correct message format
  'auto' // Gas adjustment
)
```

3. Use explicit gas limits if needed:
```jsx
await signingClient.execute(
  account.address,
  contractAddress,
  { add_todo: { text: todoText } },
  {
    amount: [{ amount: "200000", denom: "umantra" }],
    gas: "200000"
  }
)
```

## React Query Issues

### Issue: Data not updating after mutations

**Symptoms**:
- UI shows stale data after contract execution
- Need to refresh page to see changes

**Solutions**:
1. Invalidate queries after mutations:
```jsx
const addTodoMutation = useMutation({
  mutationFn: async (todoText) => {
    // Execute transaction
  },
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries(['todos', contractAddress])
  }
})
```

2. Use query keys consistently:
```jsx
// Query
useQuery({
  queryKey: ['todos', contractAddress],
  queryFn: fetchTodos
})

// Mutation invalidation
queryClient.invalidateQueries(['todos', contractAddress])
```

### Issue: Queries running unnecessarily

**Symptoms**:
- Excessive network requests
- Performance issues

**Solutions**:
1. Use enabled option for conditional queries:
```jsx
useQuery({
  queryKey: ['todos', contractAddress],
  queryFn: fetchTodos,
  enabled: !!cosmWasmClient && !!contractAddress
})
```

2. Implement proper caching strategies:
```jsx
useQuery({
  queryKey: ['todos', contractAddress],
  queryFn: fetchTodos,
  staleTime: 30000, // 30 seconds
  cacheTime: 300000  // 5 minutes
})
```

## Development Issues

### Issue: Vite development server errors

**Symptoms**:
- `npm run dev` fails to start
- HMR (Hot Module Replacement) not working

**Solutions**:
1. Clear Vite cache:
```bash
rm -rf .vite dist
npm run dev
```

2. Check for port conflicts:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

3. Update Vite configuration if needed:
```javascript
// vite.config.js
export default {
  server: {
    port: 5173,
    host: true
  }
}
```

### Issue: Environment variables not working

**Symptoms**:
- `import.meta.env.VITE_*` returns undefined
- Configuration not loading

**Solutions**:
1. Ensure `.env` file exists in project root
2. Verify variables start with `VITE_`:
```env
# Correct
VITE_MANTRA_RPC_URL=https://rpc.mantrachain.io

# Incorrect (won't work)
MANTRA_RPC_URL=https://rpc.mantrachain.io
```

3. Restart development server after changing environment variables

## Build Issues

### Issue: Production build fails

**Symptoms**:
- `npm run build` throws errors
- Build output is incomplete

**Solutions**:
1. Check for missing dependencies:
```bash
npm ci --production=false
```

2. Verify all imports are correct
3. Check for unused imports that might cause errors
4. Build with verbose output for debugging:
```bash
npm run build -- --mode production --verbose
```

### Issue: Preview mode not working

**Symptoms**:
- `npm run preview` fails
- Production build doesn't work locally

**Solutions**:
1. Ensure build completed successfully first
2. Check build output in `dist/` directory
3. Try serving with a different tool:
```bash
npx serve dist
```

## Debugging Tips

### 1. Enable Debug Mode
Add to `.env`:
```env
VITE_DEBUG=true
```

### 2. Use Browser DevTools
- Check Console for errors
- Monitor Network requests
- Inspect React components with React DevTools

### 3. Add Logging
```jsx
import { useCosmWasmClient } from 'graz'

const MyComponent = () => {
  const { data: client } = useCosmWasmClient()

  useEffect(() => {
    console.log('CosmWasm Client:', client)
  }, [client])

  // ...
}
```

### 4. Check Chain Status
Use blockchain explorers to verify:
- Contract exists and is active
- Transactions are being processed
- Chain is operating normally

## Getting Help

If you encounter issues not covered in this guide:

1. **Check the console** for specific error messages
2. **Review the migration guide** for breaking changes
3. **Search existing issues** in the project repository
4. **Create a detailed issue report** including:
   - Error messages
   - Steps to reproduce
   - Environment details (Node.js version, OS, browser)
   - Code snippets where applicable

---

**Remember**: Most issues are related to the provider architecture changes. Ensure QueryClientProvider and GrazProvider are properly configured first.