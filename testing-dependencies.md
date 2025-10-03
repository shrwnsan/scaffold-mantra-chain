# Testing Dependencies for Component Testing Infrastructure

## Required Dev Dependencies

When setting up the core testing framework, add these dependencies to `package.json`:

```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@vitejs/plugin-react": "^4.7.0",
    "@vitest/coverage-v8": "^1.0.4",
    "@vitest/ui": "^1.0.4",
    "jsdom": "^23.0.1",
    "vitest": "^1.0.4"
  }
}
```

## Updated Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "test:component": "vitest run src/__tests__/App.test.jsx"
  }
}
```

## Installation Commands

```bash
# Install testing dependencies
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event

# Install Vitest and coverage tools
npm install --save-dev vitest @vitest/coverage-v8 @vitest/ui jsdom

# Install TypeScript support (if needed)
npm install --save-dev @vitest/eslint-plugin vitest-github-actions-reporter
```

## Configuration Files Created

1. **vitest.config.js** - Complete Vitest configuration
2. **src/__tests__/setup.js** - Global test setup
3. **src/__tests__/App.test.jsx** - Main component tests
4. **src/__tests__/README.md** - Testing documentation

## Environment Variables

Add to `.env.test` (if using environment-specific configs):

```env
VITE_WALLETCONNECT_PROJECT_ID=test-project-id
VITE_APP_ENV=test
```

## Test Commands Usage

```bash
# Run all tests
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode (interactive)
npm run test:ui

# Watch mode for development
npm run test:watch

# Run only component tests
npm run test:component
```

## Coverage Thresholds

Current configuration targets:
- 70% branch coverage
- 70% function coverage
- 70% line coverage
- 70% statement coverage

## CI/CD Integration

The test suite is ready for CI/CD integration with:
- GitHub Actions support
- GitLab CI compatibility
- Coverage reporting
- Test result artifacts
- Parallel execution support

## Notes for Setup

1. **Framework Order**: Install Vitest first, then testing libraries
2. **jsdom**: Required for DOM testing environment
3. **Coverage**: V8 provider is faster and requires less setup
4. **UI Mode**: Interactive test runner for development
5. **Watch Mode**: Continuous testing during development