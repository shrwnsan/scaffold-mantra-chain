# API Documentation

This document covers the updated API patterns and hook usage for the secure Scaffold MANTRA Chain project.

## graz 0.3.x Hook Reference

### Account Management

#### `useAccount()`
Get information about the connected wallet account.

```jsx
import { useAccount } from 'graz'

const WalletInfo = () => {
  const {
    data: account,
    isConnected,
    isConnecting,
    isDisconnected,
    isReconnecting
  } = useAccount()

  if (isConnecting) return <div>Connecting...</div>
  if (isDisconnected) return <div>Not connected</div>

  return (
    <div>
      <p>Address: {account?.bech32Address}</p>
      <p>Name: {account?.name}</p>
      <p>Pubkey: {account?.pubkey}</p>
    </div>
  )
}
```

#### `useConnect()`
Handle wallet connection with multiple wallet support.

```jsx
import { useConnect } from 'graz'

const ConnectWallet = () => {
  const { connect, isConnecting, error } = useConnect()

  const handleConnect = (walletType) => {
    connect({
      chainId: "mantra-1",
      walletType
    })
  }

  if (isConnecting) return <button disabled>Connecting...</button>

  return (
    <div>
      <button onClick={() => handleConnect('keplr')}>
        Connect Keplr
      </button>
      <button onClick={() => handleConnect('leap')}>
        Connect Leap
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
```

#### `useDisconnect()`
Handle wallet disconnection.

```jsx
import { useDisconnect } from 'graz'

const DisconnectWallet = () => {
  const { disconnect, isDisconnecting } = useDisconnect()

  return (
    <button
      onClick={() => disconnect()}
      disabled={isDisconnecting}
    >
      {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
    </button>
  )
}
```

### Chain Management

#### `useChain()`
Get information about the current chain.

```jsx
import { useChain } from 'graz'

const ChainInfo = () => {
  const { data: chain } = useChain()

  return (
    <div>
      <p>Chain ID: {chain?.chainId}</p>
      <p>Chain Name: {chain?.chainName}</p>
      <p>RPC: {chain?.rpc?.[0]}</p>
    </div>
  )
}
```

### Client Management

#### `useCosmWasmClient()`
Get a read-only CosmWasm client for querying contracts.

```jsx
import { useCosmWasmClient } from 'graz'

const ContractQuery = ({ contractAddress }) => {
  const { data: client, isLoading, error } = useCosmWasmClient()

  const queryContract = async () => {
    if (!client) return

    try {
      const result = await client.queryContractSmart(
        contractAddress,
        { get_config: {} }
      )
      return result
    } catch (err) {
      console.error('Query failed:', err)
    }
  }

  if (isLoading) return <div>Loading client...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <button onClick={queryContract}>
      Query Contract
    </button>
  )
}
```

#### `useSigningCosmWasmClient()`
Get a signing CosmWasm client for executing transactions.

```jsx
import { useSigningCosmWasmClient } from 'graz'

const ContractExecute = ({ contractAddress }) => {
  const { data: client, isLoading, error } = useSigningCosmWasmClient()
  const { data: account } = useAccount()

  const executeContract = async (message) => {
    if (!client || !account) return

    try {
      const result = await client.execute(
        account.bech32Address,
        contractAddress,
        message,
        'auto'
      )
      return result
    } catch (err) {
      console.error('Execute failed:', err)
    }
  }

  if (isLoading) return <div>Loading client...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <button onClick={() => executeContract({ some_action: {} })}>
      Execute Contract
    </button>
  )
}
```

## React Query Integration

### Query Patterns

#### Basic Query with Caching
```jsx
import { useQuery } from '@tanstack/react-query'
import { useCosmWasmClient } from 'graz'

const useTodosQuery = (contractAddress) => {
  const { data: client } = useCosmWasmClient()

  return useQuery({
    queryKey: ['todos', contractAddress],
    queryFn: async () => {
      if (!client || !contractAddress) return []

      const result = await client.queryContractSmart(
        contractAddress,
        { get_todos: {} }
      )
      return result.todos || []
    },
    enabled: !!client && !!contractAddress,
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  })
}

const TodoList = ({ contractAddress }) => {
  const { data: todos, isLoading, error } = useTodosQuery(contractAddress)

  if (isLoading) return <div>Loading todos...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {todos?.map((todo, index) => (
        <li key={index}>{todo.text}</li>
      ))}
    </ul>
  )
}
```

#### Dependent Queries
```jsx
import { useQuery } from '@tanstack/react-query'

const useUserTodos = (userAddress) => {
  const { data: todos } = useTodosQuery(contractAddress)

  return useQuery({
    queryKey: ['user-todos', userAddress],
    queryFn: () => {
      return todos?.filter(todo => todo.creator === userAddress) || []
    },
    enabled: !!todos && !!userAddress
  })
}
```

### Mutation Patterns

#### Basic Mutation
```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSigningCosmWasmClient, useAccount } from 'graz'

const useAddTodoMutation = (contractAddress) => {
  const { data: client } = useSigningCosmWasmClient()
  const { data: account } = useAccount()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (todoText) => {
      if (!client || !account) {
        throw new Error('Wallet not connected')
      }

      const result = await client.execute(
        account.bech32Address,
        contractAddress,
        { add_todo: { text: todoText } },
        'auto'
      )
      return result
    },
    onSuccess: () => {
      // Invalidate and refetch todos
      queryClient.invalidateQueries(['todos', contractAddress])
    },
    onError: (error) => {
      console.error('Mutation failed:', error)
    }
  })
}

const AddTodoForm = ({ contractAddress }) => {
  const [text, setText] = useState('')
  const addTodo = useAddTodoMutation(contractAddress)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      addTodo.mutate(text)
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter todo..."
      />
      <button type="submit" disabled={addTodo.isPending}>
        {addTodo.isPending ? 'Adding...' : 'Add Todo'}
      </button>
      {addTodo.error && (
        <p>Error: {addTodo.error.message}</p>
      )}
    </form>
  )
}
```

#### Optimistic Updates
```jsx
const useOptimisticAddTodo = (contractAddress) => {
  const { data: client } = useSigningCosmWasmClient()
  const { data: account } = useAccount()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (todoText) => {
      // Execute transaction
      const result = await client.execute(
        account.bech32Address,
        contractAddress,
        { add_todo: { text: todoText } },
        'auto'
      )
      return result
    },
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['todos', contractAddress])

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['todos', contractAddress])

      // Optimistically update to the new value
      queryClient.setQueryData(['todos', contractAddress], (old) => [
        ...(old || []),
        {
          id: Date.now().toString(),
          text: newTodo,
          creator: account.bech32Address,
          completed: false,
          created_at: new Date().toISOString()
        }
      ])

      return { previousTodos }
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate
      queryClient.setQueryData(['todos', contractAddress], context.previousTodos)
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['todos', contractAddress])
    }
  })
}
```

## Complete Hook Example

### Enhanced useTodoContract Hook
```jsx
import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCosmWasmClient, useSigningCosmWasmClient, useAccount } from 'graz'

const useTodoContract = (contractAddress) => {
  const { data: client } = useCosmWasmClient()
  const { data: signingClient } = useSigningCosmWasmClient()
  const { data: account, isConnected } = useAccount()
  const queryClient = useQueryClient()

  // Query todos
  const {
    data: todos = [],
    isLoading: isLoadingTodos,
    error: todosError,
    refetch: refetchTodos
  } = useQuery({
    queryKey: ['todos', contractAddress],
    queryFn: async () => {
      if (!client || !contractAddress) return []

      const result = await client.queryContractSmart(
        contractAddress,
        { get_todos: {} }
      )
      return result.todos || []
    },
    enabled: !!client && !!contractAddress,
    staleTime: 30000,
  })

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: async (todoText) => {
      if (!signingClient || !account) {
        throw new Error('Wallet not connected')
      }

      return await signingClient.execute(
        account.bech32Address,
        contractAddress,
        { add_todo: { text: todoText } },
        'auto'
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', contractAddress])
    }
  })

  // Toggle todo mutation
  const toggleTodoMutation = useMutation({
    mutationFn: async (todoId) => {
      if (!signingClient || !account) {
        throw new Error('Wallet not connected')
      }

      return await signingClient.execute(
        account.bech32Address,
        contractAddress,
        { toggle_todo: { id: todoId } },
        'auto'
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', contractAddress])
    }
  })

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId) => {
      if (!signingClient || !account) {
        throw new Error('Wallet not connected')
      }

      return await signingClient.execute(
        account.bech32Address,
        contractAddress,
        { delete_todo: { id: todoId } },
        'auto'
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['todos', contractAddress])
    }
  })

  // Memoized functions
  const addTodo = useCallback((text) => {
    if (text.trim()) {
      addTodoMutation.mutate(text.trim())
    }
  }, [addTodoMutation])

  const toggleTodo = useCallback((id) => {
    toggleTodoMutation.mutate(id)
  }, [toggleTodoMutation])

  const deleteTodo = useCallback((id) => {
    deleteTodoMutation.mutate(id)
  }, [deleteTodoMutation])

  // Computed state
  const isLoading = isLoadingTodos || addTodoMutation.isPending ||
                   toggleTodoMutation.isPending || deleteTodoMutation.isPending

  const error = todosError || addTodoMutation.error ||
                toggleTodoMutation.error || deleteTodoMutation.error

  const userTodos = todos.filter(todo => todo.creator === account?.bech32Address)

  return {
    // Data
    todos,
    userTodos,

    // State
    isLoading,
    error,
    isConnected,

    // Actions
    addTodo,
    toggleTodo,
    deleteTodo,
    refetchTodos
  }
}

export default useTodoContract
```

## Usage Examples

### Complete Component Example
```jsx
import React, { useState } from 'react'
import {
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Input,
  List,
  ListItem,
  Checkbox,
  Spinner
} from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from 'graz'
import useTodoContract from '../hooks/useTodoContract'

const TodoApp = () => {
  const [newTodo, setNewTodo] = useState('')
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const {
    todos,
    userTodos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo
  } = useTodoContract(import.meta.env.VITE_CONTRACT_ADDRESS)

  const handleAddTodo = (e) => {
    e.preventDefault()
    addTodo(newTodo)
    setNewTodo('')
  }

  if (!isConnected) {
    return (
      <Container maxW="container.md" py={10}>
        <VStack spacing={6}>
          <Heading>Connect Wallet</Heading>
          <Text>Please connect your wallet to continue</Text>
          <Button onClick={() => connect()}>
            Connect Keplr
          </Button>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6}>
        <VStack>
          <Heading>Todo dApp</Heading>
          <Button onClick={() => disconnect()} size="sm">
            Disconnect
          </Button>
        </VStack>

        <form onSubmit={handleAddTodo}>
          <VStack>
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !newTodo.trim()}>
              {isLoading ? <Spinner size="sm" /> : 'Add Todo'}
            </Button>
          </VStack>
        </form>

        {error && (
          <Text color="red.500">Error: {error.message}</Text>
        )}

        <VStack align="start" w="full">
          <Heading size="md">Your Todos</Heading>
          {isLoading ? (
            <Spinner />
          ) : userTodos.length === 0 ? (
            <Text>No todos yet. Create one above!</Text>
          ) : (
            <List w="full">
              {userTodos.map((todo) => (
                <ListItem key={todo.id} display="flex" alignItems="center" p={2}>
                  <Checkbox
                    isChecked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    mr={3}
                  />
                  <Text flex={1}>{todo.text}</Text>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </VStack>
      </VStack>
    </Container>
  )
}

export default TodoApp
```

This API documentation provides comprehensive examples of the new hook patterns and React Query integration for the secure Scaffold MANTRA Chain project.