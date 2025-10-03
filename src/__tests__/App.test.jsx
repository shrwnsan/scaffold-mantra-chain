import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import App from '../App.jsx'
import { renderWithChakra, findChakraButton, findChakraHeading, findChakraText, expectButtonToBeEnabled, expectButtonToBeDisabled } from './utils/chakra-testing.jsx'
import { mockStates, mockAccount, createMockConnectFunction, createMockDisconnectFunction } from './mocks/graz.js'
import { testResponsiveRendering, VIEWPORTS, setViewport, expectResponsiveVisibility } from './helpers/responsive-testing.js'

// Mock the graz module
vi.mock('graz', () => ({
  GrazProvider: ({ children }) => children,
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useDisconnect: vi.fn(),
}))

const { useAccount, useConnect, useDisconnect } = await import('graz')

describe('App Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  afterEach(() => {
    // Clean up after each test
    jest.restoreAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders App component without crashing', () => {
      // Setup disconnected state
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      expect(() => {
        renderWithChakra(<App />)
      }).not.toThrow()
    })

    it('displays main heading', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      renderWithChakra(<App />)

      const heading = findChakraHeading('Scaffold MANTRA Chain', 1)
      expect(heading).toBeInTheDocument()
      expect(heading).toBeVisible()
    })

    it('displays description text', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      renderWithChakra(<App />)

      const description = findChakraText(/A React-based starter template for building decentralized applications/)
      expect(description).toBeInTheDocument()
      expect(description).toBeVisible()
    })

    it('displays technology badges', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      renderWithChakra(<App />)

      expect(findChakraText('graz 0.3.7')).toBeInTheDocument()
      expect(findChakraText('CosmJS 0.36.0')).toBeInTheDocument()
      expect(findChakraText('MANTRA Chain')).toBeInTheDocument()
    })
  })

  describe('Chakra UI Provider Integration', () => {
    it('renders with Chakra UI provider without errors', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      renderWithChakra(<App />)

      // Check that main container is rendered with Chakra styles
      const container = screen.getByRole('main')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('chakra-container')
    })

    it('applies proper spacing and layout with Chakra components', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      renderWithChakra(<App />)

      // Check for VStack spacing
      const mainContent = screen.getByRole('main')
      expect(mainContent).toBeInTheDocument()

      // Check that the layout follows Chakra's spacing system
      const connectButton = findChakraButton('Connect Wallet')
      expect(connectButton).toBeInTheDocument()
      expect(connectButton).toHaveClass('chakra-button')
    })
  })

  describe('Wallet Connection States', () => {
    describe('Disconnected State', () => {
      it('displays connect wallet button when disconnected', () => {
        useAccount.mockReturnValue(mockStates.disconnected.useAccount)
        useConnect.mockReturnValue(mockStates.disconnected.useConnect)
        useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

        renderWithChakra(<App />)

        const connectButton = findChakraButton('Connect Wallet')
        expect(connectButton).toBeInTheDocument()
        expectButtonToBeEnabled(connectButton)

        // Should not show disconnect button
        expect(screen.queryByRole('button', { name: 'Disconnect Wallet' })).not.toBeInTheDocument()
      })

      it('displays connection prompt text', () => {
        useAccount.mockReturnValue(mockStates.disconnected.useAccount)
        useConnect.mockReturnValue(mockStates.disconnected.useConnect)
        useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

        renderWithChakra(<App />)

        const promptText = findChakraText('Connect your wallet to interact with MANTRA Chain')
        expect(promptText).toBeInTheDocument()
        expect(promptText).toBeVisible()
      })
    })

    describe('Connected State', () => {
      it('displays wallet information when connected', () => {
        useAccount.mockReturnValue(mockStates.connected.useAccount)
        useConnect.mockReturnValue(mockStates.connected.useConnect)
        useDisconnect.mockReturnValue(mockStates.connected.useDisconnect)

        renderWithChakra(<App />)

        expect(findChakraText('Connected Wallet')).toBeInTheDocument()
        expect(findChakraText(mockAccount.name)).toBeInTheDocument()
        expect(findChakraText(mockAccount.bech32Address)).toBeInTheDocument()
        expect(findChakraText(mockAccount.pubkey)).toBeInTheDocument()

        // Should show disconnect button
        const disconnectButton = findChakraButton('Disconnect Wallet')
        expect(disconnectButton).toBeInTheDocument()
        expectButtonToBeEnabled(disconnectButton)

        // Should not show connect button
        expect(screen.queryByRole('button', { name: 'Connect Wallet' })).not.toBeInTheDocument()
      })

      it('displays wallet address and public key correctly', () => {
        useAccount.mockReturnValue(mockStates.connected.useAccount)
        useConnect.mockReturnValue(mockStates.connected.useConnect)
        useDisconnect.mockReturnValue(mockStates.connected.useDisconnect)

        renderWithChakra(<App />)

        const addressElement = screen.getByText(mockAccount.bech32Address)
        expect(addressElement).toBeInTheDocument()
        expect(addressElement).toHaveClass('monospace')

        const pubkeyElement = screen.getByText(mockAccount.pubkey)
        expect(pubkeyElement).toBeInTheDocument()
        expect(pubkeyElement).toHaveClass('monospace')
      })
    })

    describe('Loading States', () => {
      it('shows loading state when connecting', () => {
        useAccount.mockReturnValue(mockStates.connecting.useAccount)
        useConnect.mockReturnValue(mockStates.connecting.useConnect)
        useDisconnect.mockReturnValue(mockStates.connecting.useDisconnect)

        renderWithChakra(<App />)

        // Button should be disabled during connection
        const connectButton = findChakraButton('Connect Wallet')
        expect(connectButton).toBeInTheDocument()
        expectButtonToBeDisabled(connectButton)
      })
    })

    describe('Error States', () => {
      it('handles connection errors gracefully', () => {
        useAccount.mockReturnValue(mockStates.error.useAccount)
        useConnect.mockReturnValue(mockStates.error.useConnect)
        useDisconnect.mockReturnValue(mockStates.error.useDisconnect)

        expect(() => {
          renderWithChakra(<App />)
        }).not.toThrow()

        // Should still render basic UI even with errors
        expect(findChakraHeading('Scaffold MANTRA Chain', 1)).toBeInTheDocument()
      })
    })
  })

  describe('Wallet Interactions', () => {
    describe('Connect Wallet', () => {
      it('calls connect function when connect button is clicked', async () => {
        const mockConnect = createMockConnectFunction(true)
        useAccount.mockReturnValue(mockStates.disconnected.useAccount)
        useConnect.mockReturnValue({
          ...mockStates.disconnected.useConnect,
          connect: mockConnect,
        })
        useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

        renderWithChakra(<App />)

        const connectButton = findChakraButton('Connect Wallet')
        fireEvent.click(connectButton)

        expect(mockConnect).toHaveBeenCalledTimes(1)

        // Check if success alert was called
        await waitFor(() => {
          expect(window.alert).toHaveBeenCalledWith('Successfully connected to MANTRA Chain!')
        })
      })

      it('handles connection errors properly', async () => {
        const mockConnect = createMockConnectFunction(false)
        useAccount.mockReturnValue(mockStates.disconnected.useAccount)
        useConnect.mockReturnValue({
          ...mockStates.disconnected.useConnect,
          connect: mockConnect,
        })
        useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

        renderWithChakra(<App />)

        const connectButton = findChakraButton('Connect Wallet')
        fireEvent.click(connectButton)

        expect(mockConnect).toHaveBeenCalledTimes(1)

        // Check if error alert was called
        await waitFor(() => {
          expect(window.alert).toHaveBeenCalledWith('Connection failed: Failed to connect wallet')
        })
      })
    })

    describe('Disconnect Wallet', () => {
      it('calls disconnect function when disconnect button is clicked', async () => {
        const mockDisconnect = createMockDisconnectFunction(true)
        useAccount.mockReturnValue(mockStates.connected.useAccount)
        useConnect.mockReturnValue(mockStates.connected.useConnect)
        useDisconnect.mockReturnValue({
          ...mockStates.connected.useDisconnect,
          disconnect: mockDisconnect,
        })

        renderWithChakra(<App />)

        const disconnectButton = findChakraButton('Disconnect Wallet')
        fireEvent.click(disconnectButton)

        expect(mockDisconnect).toHaveBeenCalledTimes(1)

        // Check if success alert was called
        await waitFor(() => {
          expect(window.alert).toHaveBeenCalledWith('Successfully disconnected from wallet!')
        })
      })

      it('handles disconnection errors properly', async () => {
        const mockDisconnect = createMockDisconnectFunction(false)
        useAccount.mockReturnValue(mockStates.connected.useAccount)
        useConnect.mockReturnValue(mockStates.connected.useConnect)
        useDisconnect.mockReturnValue({
          ...mockStates.connected.useDisconnect,
          disconnect: mockDisconnect,
        })

        renderWithChakra(<App />)

        const disconnectButton = findChakraButton('Disconnect Wallet')
        fireEvent.click(disconnectButton)

        expect(mockDisconnect).toHaveBeenCalledTimes(1)

        // Check if error alert was called
        await waitFor(() => {
          expect(window.alert).toHaveBeenCalledWith('Disconnection failed: Failed to disconnect wallet')
        })
      })
    })
  })

  describe('Responsive Design', () => {
    it('renders properly on mobile devices', async () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      await testResponsiveRendering(<App />, [
        {
          viewport: VIEWPORTS.mobile,
          assertions: async () => {
            expect(findChakraHeading('Scaffold MANTRA Chain', 1)).toBeInTheDocument()
            expect(findChakraButton('Connect Wallet')).toBeInTheDocument()
          }
        }
      ])
    })

    it('renders properly on tablet devices', async () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      await testResponsiveRendering(<App />, [
        {
          viewport: VIEWPORTS.tablet,
          assertions: async () => {
            expect(findChakraHeading('Scaffold MANTRA Chain', 1)).toBeInTheDocument()
            expect(findChakraButton('Connect Wallet')).toBeInTheDocument()
          }
        }
      ])
    })

    it('renders properly on desktop devices', async () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      await testResponsiveRendering(<App />, [
        {
          viewport: VIEWPORTS.desktop,
          assertions: async () => {
            expect(findChakraHeading('Scaffold MANTRA Chain', 1)).toBeInTheDocument()
            expect(findChakraButton('Connect Wallet')).toBeInTheDocument()
          }
        }
      ])
    })

    it('maintains proper layout across different screen sizes', async () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      const { unmount } = renderWithChakra(<App />)

      // Test mobile view
      setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(findChakraHeading('Scaffold MANTRA Chain', 1)).toBeInTheDocument()

      // Test desktop view
      setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(findChakraHeading('Scaffold MANTRA Chain', 1)).toBeInTheDocument()

      // Test tablet view
      setViewport(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(findChakraHeading('Scaffold MANTRA Chain', 1)).toBeInTheDocument()

      unmount()
    })

    it('handles wallet connection UI on different screen sizes', async () => {
      useAccount.mockReturnValue(mockStates.connected.useAccount)
      useConnect.mockReturnValue(mockStates.connected.useConnect)
      useDisconnect.mockReturnValue(mockStates.connected.useDisconnect)

      const { unmount } = renderWithChakra(<App />)

      // Test that wallet info displays correctly on different sizes
      const viewports = [VIEWPORTS.mobile, VIEWPORTS.tablet, VIEWPORTS.desktop]

      for (const viewport of viewports) {
        setViewport(viewport.width, viewport.height)
        await new Promise(resolve => setTimeout(resolve, 0))

        expect(findChakraText('Connected Wallet')).toBeInTheDocument()
        expect(findChakraText(mockAccount.name)).toBeInTheDocument()
        expect(findChakraButton('Disconnect Wallet')).toBeInTheDocument()
      }

      unmount()
    })
  })

  describe('Provider Hierarchy', () => {
    it('properly wraps children with GrazProvider and ChakraProvider', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      renderWithChakra(<App />)

      // Verify that the app renders without provider-related errors
      expect(findChakraHeading('Scaffold MANTRA Chain', 1)).toBeInTheDocument()
      expect(findChakraButton('Connect Wallet')).toBeInTheDocument()

      // Check that the main container has proper Chakra styling
      const container = screen.getByRole('main')
      expect(container).toBeInTheDocument()
    })

    it('maintains proper provider order', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      // This test verifies that the providers are in the correct order
      // GrazProvider -> ChakraProvider -> App content
      renderWithChakra(<App />)

      // If the provider order was incorrect, we'd see errors here
      expect(findChakraHeading('Scaffold MANTRA Chain', 1)).toBeInTheDocument()
      expect(findChakraButton('Connect Wallet')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      renderWithChakra(<App />)

      // Main heading should be h1
      const mainHeading = screen.getByRole('heading', { level: 1, name: 'Scaffold MANTRA Chain' })
      expect(mainHeading).toBeInTheDocument()
    })

    it('buttons have proper roles and labels', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      renderWithChakra(<App />)

      const connectButton = screen.getByRole('button', { name: 'Connect Wallet' })
      expect(connectButton).toBeInTheDocument()
      expect(connectButton).toHaveAttribute('type', 'button')
    })

    it('text elements have proper semantic structure', () => {
      useAccount.mockReturnValue(mockStates.disconnected.useAccount)
      useConnect.mockReturnValue(mockStates.disconnected.useConnect)
      useDisconnect.mockReturnValue(mockStates.disconnected.useDisconnect)

      renderWithChakra(<App />)

      const description = screen.getByText(/A React-based starter template for building decentralized applications/)
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('P')
    })
  })
})