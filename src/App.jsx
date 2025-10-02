import React from 'react'
import {
  ChakraProvider,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Box,
  useToast,
  HStack,
  Badge,
  Card,
  CardBody,
  Stack,
  Divider
} from '@chakra-ui/react'
import { GrazProvider, useGraz, useAccount, useConnect, useDisconnect } from 'graz'

// MANTRA Chain configuration
const mantraChain = {
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
  },
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
}

// Wallet Connection Component
function WalletConnection() {
  const { data: account, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const toast = useToast()

  const handleConnect = async () => {
    try {
      await connect()
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to MANTRA Chain',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast({
        title: 'Wallet Disconnected',
        description: 'Successfully disconnected from wallet',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Disconnection Failed',
        description: error.message || 'Failed to disconnect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (isConnected && account) {
    return (
      <Card maxW="md" mx="auto">
        <CardBody>
          <Stack spacing={4}>
            <VStack spacing={2}>
              <Text fontWeight="bold">Connected Wallet</Text>
              <Badge colorScheme="green" px={3} py={1}>
                {account.name || 'Unknown Wallet'}
              </Badge>
            </VStack>

            <Divider />

            <VStack spacing={2} align="start">
              <Text fontSize="sm" color="gray.600">Address:</Text>
              <Text fontSize="xs" fontFamily="mono" wordBreak="break-all">
                {account.bech32Address}
              </Text>
              <Text fontSize="sm" color="gray.600">Public Key:</Text>
              <Text fontSize="xs" fontFamily="mono" wordBreak="break-all">
                {account.pubkey}
              </Text>
            </VStack>

            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleDisconnect}
              size="sm"
            >
              Disconnect Wallet
            </Button>
          </Stack>
        </CardBody>
      </Card>
    )
  }

  return (
    <VStack spacing={4}>
      <Text fontSize="lg" color="gray.600">
        Connect your wallet to interact with MANTRA Chain
      </Text>
      <Button
        colorScheme="blue"
        size="lg"
        onClick={handleConnect}
        px={8}
      >
        Connect Wallet
      </Button>
    </VStack>
  )
}

// Main App Component
function App() {
  return (
    <GrazProvider
      grazOptions={{
        chains: [mantraChain],
        defaultChain: mantraChain,
        walletConnect: {
          projectId: process.env.VITE_WALLETCONNECT_PROJECT_ID || '',
          metadata: {
            name: 'Scaffold MANTRA Chain',
            description: 'A React-based dApp starter template for MANTRA Chain',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            icons: [],
          },
        },
      }}
    >
      <ChakraProvider>
        <Container maxW="container.md" py={10}>
          <VStack spacing={8} align="center">
            <VStack spacing={4} align="center">
              <Heading as="h1" size="2xl" color="blue.600">
                Scaffold MANTRA Chain
              </Heading>
              <Text fontSize="lg" textAlign="center" color="gray.600">
                A React-based starter template for building decentralized applications (dApps) on the MANTRA Chain blockchain.
              </Text>
              <Text fontSize="md" textAlign="center" color="gray.500">
                Built with graz 0.3.x for seamless wallet integration.
              </Text>
            </VStack>

            <Box width="100%">
              <WalletConnection />
            </Box>

            <VStack spacing={4} align="center" mt={8}>
              <HStack spacing={4}>
                <Badge colorScheme="green">graz 0.3.7</Badge>
                <Badge colorScheme="blue">CosmJS 0.36.0</Badge>
                <Badge colorScheme="purple">MANTRA Chain</Badge>
              </HStack>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Successfully migrated to graz 0.3.x with QueryClientProvider support
              </Text>
            </VStack>
          </VStack>
        </Container>
      </ChakraProvider>
    </GrazProvider>
  )
}

export default App