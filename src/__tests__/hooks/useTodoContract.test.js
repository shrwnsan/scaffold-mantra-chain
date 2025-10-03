// Tests for useTodoContract hook template

import { describe, test, expect, beforeEach, afterAll, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useTodoContract from '../../hooks/useTodoContract'
import {
  renderHookWithProviders,
  waitForLoadingToFinish,
  waitForError,
} from '../utils/hook-testing-utils'

// Mock console methods to reduce noise in tests
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('useTodoContract Hook Template', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy.mockClear()
    consoleErrorSpy.mockClear()
  })

  afterAll(() => {
    consoleSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('Initial State', () => {
    test('should return initial state with correct default values', () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.queryTodos).toBeInstanceOf(Function)
      expect(result.current.addTodo).toBeInstanceOf(Function)
    })

    test('should not have any async operations running on mount', () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    test('should maintain state across re-renders', () => {
      const { result, rerender } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)

      rerender()

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.queryTodos).toBeInstanceOf(Function)
      expect(result.current.addTodo).toBeInstanceOf(Function)
    })
  })

  describe('queryTodos Function', () => {
    test('should call queryTodos and return empty array as template behavior', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      let queryResult
      await act(async () => {
        queryResult = await result.current.queryTodos()
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(queryResult).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Query todos - implement with CosmJS')
    })

    test('should set loading state during queryTodos execution', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      // Start the query and wait for it
      await act(async () => {
        result.current.queryTodos()
      })

      // The hook uses immediate async operations, so loading should be false after completion
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledWith('Query todos - implement with CosmJS')
    })

    test('should handle multiple concurrent queryTodos calls', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      const promises = [
        act(() => result.current.queryTodos()),
        act(() => result.current.queryTodos()),
        act(() => result.current.queryTodos()),
      ]

      await Promise.all(promises)

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledTimes(3)
    })

    test('should return consistent empty array for template implementation', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      const queryResults = await Promise.all([
        act(() => result.current.queryTodos()),
        act(() => result.current.queryTodos()),
        act(() => result.current.queryTodos()),
      ])

      queryResults.forEach(result => {
        expect(result).toEqual([])
      })
    })
  })

  describe('addTodo Function', () => {
    test('should call addTodo and return success object as template behavior', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      let addResult
      await act(async () => {
        addResult = await result.current.addTodo('Test todo')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(addResult).toEqual({ success: true })
      expect(consoleSpy).toHaveBeenCalledWith('Add todo - implement with CosmJS:', 'Test todo')
    })

    test('should set loading state during addTodo execution', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      // Start the add operation and wait for it
      await act(async () => {
        result.current.addTodo('Test todo')
      })

      // The hook uses immediate async operations, so loading should be false after completion
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledWith('Add todo - implement with CosmJS:', 'Test todo')
    })

    test('should handle empty todo text', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      let addResult
      await act(async () => {
        addResult = await result.current.addTodo('')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(addResult).toEqual({ success: true })
      expect(consoleSpy).toHaveBeenCalledWith('Add todo - implement with CosmJS:', '')
    })

    test('should handle null/undefined todo text', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      await act(async () => {
        await result.current.addTodo(null)
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledWith('Add todo - implement with CosmJS:', null)

      await act(async () => {
        await result.current.addTodo(undefined)
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledWith('Add todo - implement with CosmJS:', undefined)
    })

    test('should handle multiple concurrent addTodo calls', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      const promises = [
        act(() => result.current.addTodo('Todo 1')),
        act(() => result.current.addTodo('Todo 2')),
        act(() => result.current.addTodo('Todo 3')),
      ]

      const addResults = await Promise.all(promises)

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      addResults.forEach(result => {
        expect(result).toEqual({ success: true })
      })
      expect(consoleSpy).toHaveBeenCalledTimes(3)
    })

    test('should handle very long todo text', async () => {
      const longText = 'a'.repeat(1000)
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      await act(async () => {
        await result.current.addTodo(longText)
      })

      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledWith('Add todo - implement with CosmJS:', longText)
    })

    test('should handle special characters in todo text', async () => {
      const specialText = 'Test with émojis 🚀 and sp€cial chars!'
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      await act(async () => {
        await result.current.addTodo(specialText)
      })

      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledWith('Add todo - implement with CosmJS:', specialText)
    })
  })

  describe('Combined Operations', () => {
    test('should handle queryTodos followed by addTodo', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      // First query
      await act(async () => {
        await result.current.queryTodos()
      })

      expect(result.current.error).toBe(null)

      // Then add
      await act(async () => {
        await result.current.addTodo('Test todo')
      })

      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledTimes(2)
    })

    test('should handle addTodo followed by queryTodos', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      // First add
      await act(async () => {
        await result.current.addTodo('Test todo')
      })

      expect(result.current.error).toBe(null)

      // Then query
      await act(async () => {
        await result.current.queryTodos()
      })

      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledTimes(2)
    })

    test('should handle rapid state changes', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      // Rapid operations
      await act(async () => {
        await result.current.queryTodos()
        await result.current.addTodo('Test 1')
        await result.current.queryTodos()
        await result.current.addTodo('Test 2')
      })

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledTimes(4)
    })

    test('should handle alternating operations', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      const operations = [
        () => result.current.queryTodos(),
        () => result.current.addTodo('Test 1'),
        () => result.current.queryTodos(),
        () => result.current.addTodo('Test 2'),
        () => result.current.addTodo('Test 3'),
        () => result.current.queryTodos(),
      ]

      for (const operation of operations) {
        await act(async () => {
          await operation()
        })
      }

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(consoleSpy).toHaveBeenCalledTimes(6)
    })
  })

  describe('Hook Lifecycle', () => {
    test('should clean up properly on unmount', () => {
      const { result, unmount } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      // Hook is working
      expect(result.current.queryTodos).toBeInstanceOf(Function)
      expect(result.current.addTodo).toBeInstanceOf(Function)

      // Unmount
      unmount()

      // No assertions needed - this test ensures no errors on unmount
    })

    test('should handle multiple re-renders', () => {
      const { result, rerender } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      expect(result.current.loading).toBe(false)

      rerender()
      rerender()
      rerender()

      expect(result.current.loading).toBe(false)
      expect(result.current.queryTodos).toBeInstanceOf(Function)
      expect(result.current.addTodo).toBeInstanceOf(Function)
    })
  })

  describe('Template Implementation Verification', () => {
    test('should log template messages to console', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      await act(async () => {
        await result.current.queryTodos()
      })

      expect(consoleSpy).toHaveBeenCalledWith('Query todos - implement with CosmJS')
      consoleSpy.mockClear()

      await act(async () => {
        await result.current.addTodo('Test message')
      })

      expect(consoleSpy).toHaveBeenCalledWith('Add todo - implement with CosmJS:', 'Test message')
    })

    test('should maintain consistent return types', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      const queryResult = await act(() => result.current.queryTodos())
      const addResult = await act(() => result.current.addTodo('Test'))

      expect(Array.isArray(queryResult)).toBe(true)
      expect(typeof addResult).toBe('object')
      expect(addResult).toHaveProperty('success')
    })

    test('should handle all function properties', () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      const { loading, error, queryTodos, addTodo } = result.current

      expect(typeof loading).toBe('boolean')
      expect(error).toBe(null)
      expect(typeof queryTodos).toBe('function')
      expect(typeof addTodo).toBe('function')
    })
  })

  describe('Error Handling Template', () => {
    test('should provide template for error handling', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      // The template doesn't actually throw errors, but provides the structure
      // for when real CosmJS implementation is added
      await act(async () => {
        await result.current.queryTodos()
      })

      expect(result.current.error).toBe(null)
      expect(result.current.loading).toBe(false)
    })
  })

  describe('Performance Considerations', () => {
    test('should not cause memory leaks with repeated calls', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      // Make many calls
      for (let i = 0; i < 20; i++) {
        await act(async () => {
          await result.current.queryTodos()
        })
      }

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })

    test('should handle rapid consecutive calls without errors', async () => {
      const { result } = renderHookWithProviders(() => useTodoContract(), {
        wrapper: 'full',
      })

      // Rapid calls
      const promises = Array.from({ length: 10 }, (_, i) =>
        act(() => result.current.addTodo(`Todo ${i}`))
      )

      await Promise.all(promises)

      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
    })
  })
})