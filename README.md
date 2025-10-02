# Scaffold MANTRA Chain

A simple React starter template for building dApps on MANTRA Chain with wallet integration and smart contract interaction capabilities.

## Quick Start

```bash
git clone <repository-url>
cd scaffold-mantra-chain
npm install
npm run dev
```

Open http://localhost:5173 to view the application.

## What's Included

- React 18 + Chakra UI for UI components
- Vite for fast development
- MANTRA Chain wallet integration via graz 0.3.7
- CosmJS 0.36.0 for blockchain interactions
- React Query for state management
- Template contract hook (`src/hooks/useTodoContract.js`)

## Environment Variables

Create a `.env` file:

```env
VITE_MANTRA_RPC_URL=https://rpc.mantrachain.io
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## Project Structure

```
src/
├── App.jsx         # Main app with GrazProvider and wallet hooks
├── index.jsx       # Entry point with QueryClientProvider
└── hooks/
    └── useTodoContract.js  # Contract interaction template
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Security Status

✅ All vulnerabilities resolved. Uses modern graz 0.3.7 and CosmJS 0.36.0 with no legacy dependencies.

## License

See LICENSE.md file.