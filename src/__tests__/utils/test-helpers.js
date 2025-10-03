import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { renderWithChakra } from './chakra-testing.jsx'
import { TEST_TIMEOUTS, TEST_TEXTS, WALLET_MOCKS } from './test-constants.js'

// Helper to render app with specific wallet state
export const renderAppWithWalletState = (
  walletState,
  renderOptions = {}
) => {
  // Mock the graz hooks based on wallet state
  const { useAccount, useConnect, useDisconnect } = require('graz')
  useAccount.mockReturnValue(walletState.useAccount)
  useConnect.mockReturnValue(walletState.useConnect)
  useDisconnect.mockReturnValue(walletState.useDisconnect)

  return renderWithChakra(require('../App.jsx').default, renderOptions)
}

// Helper to simulate wallet connection
export const simulateWalletConnection = async (
  mockConnect,
  shouldSucceed = true
) => {
  mockConnect.mockImplementation(async () => {
    if (!shouldSucceed) {
      throw new Error('Connection failed')
    }
    return Promise.resolve()
  })

  const connectButton = screen.getByRole('button', { name: TEST_TEXTS.connectWallet })
  await userEvent.click(connectButton)

  await waitFor(() => {
    expect(mockConnect).toHaveBeenCalledTimes(1)
  })

  if (shouldSucceed) {
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(TEST_TEXTS.successConnection)
    })
  } else {
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(TEST_TEXTS.connectionError)
    })
  }
}

// Helper to simulate wallet disconnection
export const simulateWalletDisconnection = async (
  mockDisconnect,
  shouldSucceed = true
) => {
  mockDisconnect.mockImplementation(async () => {
    if (!shouldSucceed) {
      throw new Error('Disconnection failed')
    }
    return Promise.resolve()
  })

  const disconnectButton = screen.getByRole('button', { name: TEST_TEXTS.disconnectWallet })
  await userEvent.click(disconnectButton)

  await waitFor(() => {
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })

  if (shouldSucceed) {
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(TEST_TEXTS.successDisconnection)
    })
  } else {
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(TEST_TEXTS.disconnectionError)
    })
  }
}

// Helper to wait for animations
export const waitForAnimation = () => {
  return new Promise(resolve => setTimeout(resolve, TEST_TIMEOUTS.animation))
}

// Helper to wait for network operations
export const waitForNetwork = () => {
  return new Promise(resolve => setTimeout(resolve, TEST_TIMEOUTS.network))
}

// Helper to test accessibility
export const testAccessibility = async (Component) => {
  const { container } = renderWithChakra(Component)

  // Basic accessibility checks
  expect(container.querySelector('h1')).toBeInTheDocument() // Main heading
  expect(container.querySelector('button')).toBeInTheDocument() // Interactive element

  // Check for proper semantic structure
  const mainContent = container.querySelector('main')
  expect(mainContent).toBeInTheDocument()

  // Check for proper button roles
  const buttons = container.querySelectorAll('button')
  buttons.forEach(button => {
    expect(button).toHaveAttribute('type', 'button')
  })

  return container
}

// Helper to test component visibility
export const expectComponentToBeVisible = (element) => {
  expect(element).toBeInTheDocument()
  expect(element).toBeVisible()
}

// Helper to test component is hidden
export const expectComponentToBeHidden = (element) => {
  expect(element).toBeInTheDocument()
  expect(element).not.toBeVisible()
}

// Helper to test text content
export const expectTextToBePresent = (text) => {
  expect(screen.getByText(text)).toBeInTheDocument()
  expect(screen.getByText(text)).toBeVisible()
}

// Helper to test button interactions
export const testButtonInteraction = async (buttonText, expectedCallback) => {
  const button = screen.getByRole('button', { name: buttonText })
  expect(button).toBeInTheDocument()
  expect(button).not.toBeDisabled()

  await userEvent.click(button)

  await waitFor(() => {
    expect(expectedCallback).toHaveBeenCalled()
  })
}

// Helper to test loading states
export const expectLoadingState = (buttonText) => {
  const button = screen.getByRole('button', { name: buttonText })
  expect(button).toBeInTheDocument()
  expect(button).toBeDisabled()
}

// Helper to test error states
export const expectErrorState = (errorText) => {
  expect(screen.getByText(errorText)).toBeInTheDocument()
  expect(screen.getByText(errorText)).toBeVisible()
}

// Helper to create mock wallet with custom data
export const createMockWallet = (overrides = {}) => {
  return {
    name: 'Test Wallet',
    bech32Address: 'mantra1test123456789abcdefghijklmnopqrstuvwxyz',
    pubkey: 'TESTPUBKEY1234567890ABCDEF',
    algo: 'secp256k1',
    ...overrides,
  }
}

// Helper to test wallet information display
export const testWalletInfoDisplay = (wallet) => {
  expect(screen.getByText(TEST_TEXTS.connectedWallet)).toBeInTheDocument()
  expect(screen.getByText(wallet.name)).toBeInTheDocument()
  expect(screen.getByText(wallet.bech32Address)).toBeInTheDocument()
  expect(screen.getByText(wallet.pubkey)).toBeInTheDocument()

  // Check that address and pubkey are displayed in monospace font
  const addressElement = screen.getByText(wallet.bech32Address)
  expect(addressElement).toHaveClass('monospace')

  const pubkeyElement = screen.getByText(wallet.pubkey)
  expect(pubkeyElement).toHaveClass('monospace')
}

// Helper to test badge components
export const testBadgeDisplay = (badgeText, expectedColor = null) => {
  const badge = screen.getByText(badgeText)
  expect(badge).toBeInTheDocument()
  expect(badge).toBeVisible()

  if (expectedColor) {
    // This would need to be adjusted based on actual badge implementation
    expect(badge.closest('[data-badge]')).toBeInTheDocument()
  }
}

// Helper to test responsive layout changes
export const testResponsiveLayout = async (component, viewportTests) => {
  const { unmount } = renderWithChakra(component)

  for (const test of viewportTests) {
    // Set viewport size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: test.viewport.width,
    })

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: test.viewport.height,
    })

    // Trigger resize event
    window.dispatchEvent(new Event('resize'))

    // Wait for layout to update
    await waitForAnimation()

    // Run viewport-specific assertions
    await test.assertions()
  }

  unmount()
}

// Helper to test form submissions
export const testFormSubmission = async (formData, submitCallback) => {
  for (const [fieldName, value] of Object.entries(formData)) {
    const field = screen.getByLabelText(fieldName)
    await userEvent.type(field, value)
  }

  const submitButton = screen.getByRole('button', { type: 'submit' })
  await userEvent.click(submitButton)

  await waitFor(() => {
    expect(submitCallback).toHaveBeenCalledWith(formData)
  })
}

// Helper to test keyboard navigation
export const testKeyboardNavigation = async (elements) => {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]

    // Tab to the element
    await userEvent.tab()

    // Verify the element has focus
    expect(document.activeElement).toBe(element)

    // If it's a button, test Enter key
    if (element.tagName === 'BUTTON') {
      await userEvent.keyboard('{Enter}')
    }
  }
}

// Helper to test clipboard operations
export const testClipboardCopy = async (copyButton, textToCopy) => {
  // Mock navigator.clipboard
  const mockClipboard = {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(textToCopy),
  }
  Object.assign(navigator, { clipboard: mockClipboard })

  await userEvent.click(copyButton)

  await waitFor(() => {
    expect(mockClipboard.writeText).toHaveBeenCalledWith(textToCopy)
  })
}

// Helper to test local storage operations
export const testLocalStorageOperation = (key, value) => {
  // Set value
  localStorage.setItem(key, JSON.stringify(value))

  // Get value
  const stored = JSON.parse(localStorage.getItem(key))
  expect(stored).toEqual(value)

  // Remove value
  localStorage.removeItem(key)
  expect(localStorage.getItem(key)).toBeNull()
}

// Helper to test component unmounting
export const testComponentUnmount = (Component) => {
  const { unmount } = renderWithChakra(Component)

  // Component should be mounted
  expect(screen.getByRole('main')).toBeInTheDocument()

  // Unmount component
  unmount()

  // Component should be unmounted
  expect(screen.queryByRole('main')).not.toBeInTheDocument()
}