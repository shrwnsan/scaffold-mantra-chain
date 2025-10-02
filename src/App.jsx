import React from 'react'
import { ChakraProvider, Container, Heading, Text, VStack } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.md" py={10}>
        <VStack spacing={6} align="center">
          <Heading as="h1" size="2xl" color="blue.600">
            Scaffold MANTRA Chain
          </Heading>
          <Text fontSize="lg" textAlign="center" color="gray.600">
            A React-based starter template for building decentralized applications (dApps) on the MANTRA Chain blockchain.
          </Text>
          <Text fontSize="md" textAlign="center" color="gray.500">
            Ready to connect your wallet and interact with smart contracts.
          </Text>
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App