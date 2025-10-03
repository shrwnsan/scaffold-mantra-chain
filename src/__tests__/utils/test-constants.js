// Test constants for consistent testing across the codebase

export const TEST_SELECTORS = {
  mainHeading: '[data-testid="main-heading"]',
  description: '[data-testid="description"]',
  connectButton: '[data-testid="connect-wallet-button"]',
  disconnectButton: '[data-testid="disconnect-wallet-button"]',
  walletInfo: '[data-testid="wallet-info"]',
  walletAddress: '[data-testid="wallet-address"]',
  walletPubkey: '[data-testid="wallet-pubkey"]',
  badges: '[data-testid="tech-badges"]',
  grazBadge: '[data-testid="graz-badge"]',
  cosmosBadge: '[data-testid="cosmos-badge"]',
  mantraBadge: '[data-testid="mantra-badge"]',
}

export const TEST_IDS = {
  mainHeading: 'main-heading',
  description: 'description',
  connectWalletButton: 'connect-wallet-button',
  disconnectWalletButton: 'disconnect-wallet-button',
  walletInfo: 'wallet-info',
  walletAddress: 'wallet-address',
  walletPubkey: 'wallet-pubkey',
  techBadges: 'tech-badges',
  grazBadge: 'graz-badge',
  cosmosBadge: 'cosmos-badge',
  mantraBadge: 'mantra-badge',
}

export const TEST_TEXTS = {
  mainHeading: 'Scaffold MANTRA Chain',
  description: 'A React-based starter template for building decentralized applications (dApps) on the MANTRA Chain blockchain.',
  subDescription: 'Built with graz 0.3.x for seamless wallet integration.',
  connectWallet: 'Connect Wallet',
  disconnectWallet: 'Disconnect Wallet',
  connectedWallet: 'Connected Wallet',
  connectPrompt: 'Connect your wallet to interact with MANTRA Chain',
  address: 'Address:',
  publicKey: 'Public Key:',
  successConnection: 'Successfully connected to MANTRA Chain!',
  successDisconnection: 'Successfully disconnected from wallet!',
  connectionError: 'Connection failed: Failed to connect wallet',
  disconnectionError: 'Disconnection failed: Failed to disconnect wallet',
  grazBadge: 'graz 0.3.7',
  cosmosBadge: 'CosmJS 0.36.0',
  mantraBadge: 'MANTRA Chain',
  migrationSuccess: 'Successfully migrated to graz 0.3.x with QueryClientProvider support',
}

export const TEST_TIMEOUTS = {
  default: 5000,
  long: 10000,
  short: 1000,
  animation: 300,
  network: 2000,
}

export const TEST_BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
  widescreen: 1920,
}

export const TEST_VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  mobileLandscape: { width: 667, height: 375 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1280, height: 720 },
  widescreen: { width: 1920, height: 1080 },
  ultrawide: { width: 2560, height: 1440 },
}

export const WALLET_MOCKS = {
  keplr: {
    name: 'Keplr',
    bech32Address: 'mantra1example123456789abcdefghijklmnopqrstuvwxyz',
    pubkey: 'A1B2C3D4E5F67890123456789012345678901234',
    algo: 'secp256k1',
  },
  leap: {
    name: 'Leap',
    bech32Address: 'mantra1leapexample123456789abcdefghijklmnopqrstuvwxyz',
    pubkey: 'B2C3D4E5F6A78901234567890123456789012345',
    algo: 'secp256k1',
  },
  cosmostation: {
    name: 'Cosmostation',
    bech32Address: 'mantra1cosmoexample123456789abcdefghijklmnopqrstuvwxyz',
    pubkey: 'C3D4E5F6A7B89012345678901234567890123456',
    algo: 'secp256k1',
  },
}

export const ERROR_MESSAGES = {
  networkError: 'Network connection failed',
  walletError: 'Wallet connection failed',
  invalidAddress: 'Invalid wallet address',
  insufficientFunds: 'Insufficient funds',
  transactionFailed: 'Transaction failed',
  userRejected: 'User rejected transaction',
}

export const SUCCESS_MESSAGES = {
  transactionSuccess: 'Transaction successful',
  connectionSuccess: 'Successfully connected',
  disconnectionSuccess: 'Successfully disconnected',
  walletReady: 'Wallet is ready',
}

export const MANTRA_CHAIN_CONFIG = {
  chainId: 'mantra-1',
  chainName: 'MANTRA Chain',
  rpc: 'https://rpc.mantrachain.io',
  rest: 'https://api.mantrachain.io',
  stakeCurrency: {
    coinDenom: 'MANTRA',
    coinMinimalDenom: 'umantra',
    coinDecimals: 6,
    coinGeckoId: 'mantra-dao',
  },
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: 'mantra',
    bech32PrefixAccPub: 'mantrapub',
    bech32PrefixValAddr: 'mantravaloper',
    bech32PrefixValPub: 'mantravaloperpub',
    bech32PrefixConsAddr: 'mantravalcons',
    bech32PrefixConsPub: 'mantravalconspub',
  },
  currencies: [
    {
      coinDenom: 'MANTRA',
      coinMinimalDenom: 'umantra',
      coinDecimals: 6,
      coinGeckoId: 'mantra-dao',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'MANTRA',
      coinMinimalDenom: 'umantra',
      coinDecimals: 6,
      coinGeckoId: 'mantra-dao',
    },
  ],
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
}