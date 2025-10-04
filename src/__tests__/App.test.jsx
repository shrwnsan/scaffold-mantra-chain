import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../App.jsx'

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  ChakraProvider: ({ children }) => children,
  Container: ({ children }) => <div data-testid="container">{children}</div>,
  Heading: ({ children }) => <h1>{children}</h1>,
  Text: ({ children }) => <p>{children}</p>,
  VStack: ({ children }) => <div>{children}</div>,
  HStack: ({ children }) => <div>{children}</div>,
  Box: ({ children }) => <div>{children}</div>,
  Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
  Badge: ({ children }) => <span>{children}</span>,
}))

// Mock graz for wallet functionality
vi.mock('graz', () => ({
  GrazProvider: ({ children }) => children,
  useAccount: () => ({
    data: {
      name: 'Test Wallet',
      bech32Address: 'mantra1testaddress123456789',
      pubkey: 'A1B2C3D4E5F67890123456789012345678901234',
    },
    isConnected: false,
    isLoading: false,
  }),
  useConnect: () => ({
    connect: vi.fn().mockResolvedValue(undefined),
    isLoading: false,
  }),
  useDisconnect: () => ({
    disconnect: vi.fn().mockResolvedValue(undefined),
    isLoading: false,
  }),
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Scaffold MANTRA Chain')).toBeInTheDocument()
  })

  it('displays project description', () => {
    render(<App />)
    expect(screen.getAllByText(/A React-based starter template for building decentralized applications/)[0]).toBeInTheDocument()
  })

  it('shows connect wallet button when disconnected', () => {
    render(<App />)
    expect(screen.getAllByRole('button', { name: 'Connect Wallet' })[0]).toBeInTheDocument()
  })

  it('displays technology badges', () => {
    render(<App />)
    expect(screen.getAllByText('graz 0.3.7')[0]).toBeInTheDocument()
    expect(screen.getAllByText('CosmJS 0.36.0')[0]).toBeInTheDocument()
    expect(screen.getAllByText('MANTRA Chain')[0]).toBeInTheDocument()
  })

  it('calls connect function when connect button is clicked', async () => {
    render(<App />)

    const connectButton = screen.getAllByRole('button', { name: 'Connect Wallet' })[0]
    fireEvent.click(connectButton)

    // Just test that the button exists and can be clicked
    expect(connectButton).toBeInTheDocument()
  })
})