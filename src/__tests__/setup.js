import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'

// Setup browser APIs that might be missing in test environment
beforeAll(() => {
  // Mock window.alert
  global.alert = jest.fn()

  // Mock window.location
  Object.defineProperty(window, 'location', {
    value: {
      origin: 'http://localhost:3000',
      href: 'http://localhost:3000',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
    },
    writable: true,
  })

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock ResizeObserver
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))

  // Mock crypto for any hash functions
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: jest.fn(() => 'mock-uuid'),
      getRandomValues: jest.fn(() => new Uint8Array(16)),
    },
    writable: true,
  })
})

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()

  // Reset window properties to defaults
  if (window.matchMedia.mockReset) {
    window.matchMedia.mockReset()
  }
})

// Global cleanup
afterAll(() => {
  jest.restoreAllMocks()
})

// Silence console warnings for known test issues
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    // Suppress specific warnings that are expected in tests
    if (
      typeof args[0] === 'string' &&
      args[0].includes('validateDOMNesting')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Mock environment variables
process.env.VITE_WALLETCONNECT_PROJECT_ID = 'test-project-id'

// Global test utilities
global.createMockEvent = (type: string, properties = {}) => {
  return new Event(type, { bubbles: true, ...properties })
}

// Add custom matchers if needed
expect.extend({
  toBeInTheDocument(received) {
    const pass = received && document.body.contains(received)
    return {
      message: () =>
        `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass,
    }
  },

  toBeVisible(received) {
    const pass = received &&
      received.offsetHeight > 0 &&
      received.offsetWidth > 0 &&
      window.getComputedStyle(received).visibility !== 'hidden'

    return {
      message: () =>
        `expected element ${pass ? 'not ' : ''}to be visible`,
      pass,
    }
  },

  toHaveClass(received, className) {
    const pass = received && received.classList.contains(className)
    return {
      message: () =>
        `expected element ${pass ? 'not ' : ''}to have class "${className}"`,
      pass,
    }
  },
})