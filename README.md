# Scaffold MANTRA Chain

## Project Initialization
To initialize your new Node.js project, run:
```bash
npm init -y
```

## Install Necessary Dependencies
To install the necessary dependencies based on the current tech stack, run:
```bash
npm install --legacy-peer-deps
```

### Dependencies
The following packages are included in the project:
- `@chakra-ui/react`: UI components for React
- `@chakra-ui/icons`: Icons for Chakra UI
- `@cosmjs/cosmwasm-stargate`: CosmWasm client for interacting with smart contracts
- `@cosmjs/encoding`: Encoding utilities for CosmJS
- `@cosmjs/stargate`: Stargate client for interacting with Cosmos SDK applications
- `@cosmjs/tendermint-rpc`: RPC client for Tendermint
- `dotenv`: Module to load environment variables from a `.env` file
- `framer-motion`: Animation library for React
- `graz`: A package for managing state and effects in React
- `react`: A JavaScript library for building user interfaces
- `react-dom`: React's DOM renderer
- `vite`: A build tool that aims to provide a faster and leaner development experience for modern web projects

## Notes
- If you encounter npm errors regarding dependency conflicts, you can use the `--legacy-peer-deps` flag during installation.
- The `package-lock.json` file is included in the repository to ensure consistent dependency versions across different environments.

## Vulnerabilities
After running `npm install`, you may see warnings about deprecated packages and vulnerabilities. You can address these by running:
```bash
npm audit fix
```
Or, to address all issues, including potential breaking changes:
```bash
npm audit fix --force
```

## Tech Stack Overview

This project utilizes a variety of technologies and libraries to create a robust application. These technologies work together to provide a seamless development experience and robust application performance.

### Frontend:
* React: A JavaScript library for building user interfaces.
* Chakra UI: A component library for React that provides accessible and customizable components.
* Framer Motion: A library for animations in React applications.
* Vite: A build tool that provides a fast development environment for modern web projects.

### Backend:
* CosmJS: A set of libraries for interacting with Cosmos SDK-based blockchains, including:
  * @cosmjs/cosmwasm-stargate: For interacting with CosmWasm smart contracts.
  * @cosmjs/stargate: For interacting with the Cosmos SDK.
  * @cosmjs/tendermint-rpc: For communicating with Tendermint nodes.
* Node.js: A JavaScript runtime for building server-side applications.

### Other:
* dotenv: A module for loading environment variables from a .env file.
* Graz: A library that seems to be used for some custom functionalities, possibly related to your blockchain interactions.

### Language:
* JavaScript: The primary language for the frontend.
* Rust: Used for the smart contracts.

## License

This project is licensed under the terms of the [LICENSE.md](LICENSE.md) file.