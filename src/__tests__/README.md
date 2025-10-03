# Component Testing Infrastructure

This directory contains the comprehensive testing infrastructure for the MANTRA Chain dApp React components.

## Directory Structure

```
src/__tests__/
├── README.md                    # This documentation file
├── setup.js                     # Test setup and global configuration
├── App.test.jsx                 # Main App component tests
├── mocks/                       # Mock implementations
│   └── graz.js                  # graz library mocks
├── utils/                       # Testing utilities
│   ├── chakra-testing.js        # Chakra UI testing helpers
│   ├── test-constants.js        # Test constants and data
│   └── test-helpers.js          # Common testing patterns
└── helpers/                     # Specialized helpers
    └── responsive-testing.js    # Responsive design testing
```

## Test Coverage Areas

### 1. Basic Component Rendering
- ✅ App renders without crashing
- ✅ Main heading displays correctly
- ✅ Description text renders
- ✅ Technology badges show properly

### 2. Chakra UI Provider Integration
- ✅ ChakraProvider renders without errors
- ✅ Proper spacing and layout applied
- ✅ Chakra components styled correctly

### 3. Wallet Connection States
- ✅ Disconnected state shows connect button
- ✅ Connected state shows wallet information
- ✅ Loading states handle correctly
- ✅ Error states handled gracefully

### 4. Wallet Interactions
- ✅ Connect button triggers connection
- ✅ Disconnect button triggers disconnection
- ✅ Success/error alerts show appropriately
- ✅ Mock wallet data displays correctly

### 5. Responsive Design
- ✅ Renders on mobile devices
- ✅ Renders on tablet devices
- ✅ Renders on desktop devices
- ✅ Layout adapts to screen size changes

### 6. Provider Hierarchy
- ✅ GrazProvider wraps correctly
- ✅ ChakraProvider wraps correctly
- ✅ Provider order maintained

### 7. Accessibility
- ✅ Proper heading hierarchy
- ✅ Buttons have correct roles
- ✅ Semantic HTML structure

## Mock Implementations

### graz Library Mocks (`mocks/graz.js`)

Complete mock implementation for:
- `useAccount` hook
- `useConnect` hook
- `useDisconnect` hook
- `GrazProvider` component
- Mock wallet data and states

Predefined mock states:
- `disconnected` - Default wallet state
- `connected` - Connected with mock account data
- `connecting` - Loading/connecting state
- `error` - Error states for testing error handling

### Test Utilities

#### Chakra UI Testing (`utils/chakra-testing.js`)
- `renderWithChakra()` - Render with Chakra provider
- Component finders for buttons, headings, text, badges
- Visibility and interaction expectations
- Color scheme testing helpers

#### Responsive Testing (`helpers/responsive-testing.js`)
- Viewport constants for different device sizes
- Mock `window.matchMedia` implementation
- Viewport change simulation
- Responsive rendering test helpers

#### Test Helpers (`utils/test-helpers.js`)
- Wallet state simulation
- Connection/disconnection helpers
- Accessibility testing
- Form and keyboard navigation testing

#### Test Constants (`utils/test-constants.js`)
- Centralized test data and selectors
- Timeout values
- Viewport configurations
- Mock wallet data
- Error/success messages

## Running Tests

When the core testing framework is set up, tests can be run with:

```bash
# Run all tests
npm test

# Run specific test file
npm test App.test.jsx

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Configuration

### Setup (`setup.js`)

Global test configuration includes:
- Jest DOM matchers
- Browser API mocks (alert, location, matchMedia)
- ResizeObserver and IntersectionObserver mocks
- Crypto API mocks
- Console warning suppression for known test issues

### Environment Variables

Required test environment variables:
- `VITE_WALLETCONNECT_PROJECT_ID` - Set to test value in setup

## Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Test one behavior per test case
- Use helper functions for common operations

### 2. Mock Management
- Reset mocks before each test
- Use specific mock data for consistency
- Test both success and error scenarios
- Clean up mocks after tests

### 3. Responsive Testing
- Test across multiple viewport sizes
- Verify layout changes at breakpoints
- Test component visibility at different sizes
- Use viewport constants for consistency

### 4. Accessibility Testing
- Verify semantic HTML structure
- Test keyboard navigation
- Check proper ARIA attributes
- Validate heading hierarchy

### 5. Component Integration
- Test provider hierarchy
- Verify component interactions
- Test state management
- Check error boundaries

## Future Enhancements

When the core framework is ready, consider adding:

1. **E2E Testing** - Full application flow testing
2. **Visual Regression** - Screenshot comparison testing
3. **Performance Testing** - Component render performance
4. **Contract Integration** - Smart contract interaction testing
5. **Network Testing** - Real network request mocking
6. **Internationalization** - Multi-language support testing

## Troubleshooting

### Common Issues

1. **graz imports not mocked**: Ensure `jest.mock('graz')` is at test file top
2. **Chakra styles not applying**: Use `renderWithChakra()` helper
3. **Responsive tests failing**: Check viewport setup and timing
4. **Async operations timing**: Use `waitFor()` for async assertions

### Debug Tips

- Use `screen.debug()` to inspect rendered output
- Check mock call counts with `expect(mockFn).toHaveBeenCalledTimes(n)`
- Verify component state with proper test setup
- Use proper async/await patterns for async operations

## Test Data

Mock data includes realistic wallet addresses, public keys, and transaction data to closely match real-world usage while maintaining test isolation and predictability.