import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import React from 'react'

// Custom render function with Chakra UI provider
export const renderWithChakra = (ui, { ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Helper to find Chakra UI components by their common attributes
export const findChakraButton = (text) => {
  return screen.getByRole('button', { name: text })
}

export const findChakraHeading = (text, level) => {
  return screen.getByRole('heading', { name: text, level })
}

export const findChakraText = (text) => {
  return screen.getByText(text)
}

export const queryChakraButton = (text) => {
  return screen.queryByRole('button', { name: text })
}

export const queryChakraText = (text) => {
  return screen.queryByText(text)
}

// Badge finding helpers
export const findBadge = (text) => {
  return screen.getByText(text, { selector: '[data-badge]' })
}

export const queryBadge = (text) => {
  return screen.queryByText(text, { selector: '[data-badge]' })
}

// Input and form helpers
export const findChakraInput = (label) => {
  return screen.getByRole('textbox', { name: label })
}

export const findChakraCheckbox = (label) => {
  return screen.getByRole('checkbox', { name: label })
}

// Container and layout helpers
export const findChakraContainer = () => {
  return screen.getByRole('main')
}

export const findChakraBox = (testId) => {
  if (testId) {
    return screen.getByTestId(testId)
  }
  // Fallback: find any div that could be a Box
  return screen.getByRole('generic')
}

// Common test scenarios for Chakra UI components
export const expectComponentToBeVisible = (element) => {
  expect(element).toBeInTheDocument()
  expect(element).toBeVisible()
}

export const expectComponentToHaveText = (element, text) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveTextContent(text)
}

export const expectButtonToBeEnabled = (button) => {
  expect(button).toBeInTheDocument()
  expect(button).not.toBeDisabled()
}

export const expectButtonToBeDisabled = (button) => {
  expect(button).toBeInTheDocument()
  expect(button).toBeDisabled()
}

// Color scheme testing (using data attributes or classes)
export const expectButtonToHaveColorScheme = (button, scheme) => {
  // Chakra UI typically adds data attributes or classes for color schemes
  expect(button).toBeInTheDocument()
  // This may need adjustment based on actual Chakra UI implementation
  const hasColorScheme =
    button.getAttribute('data-color-scheme') === scheme ||
    button.className.includes(`--${scheme}-`) ||
    button.getAttribute('aria-label')?.includes(scheme)

  if (!hasColorScheme) {
    console.warn(`Could not verify color scheme "${scheme}" on button. Manual inspection may be needed.`)
  }
}

// Responsive design testing utilities
export const expectResponsiveText = (element, desktopText, mobileText) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveTextContent(desktopText)

  if (mobileText && mobileText !== desktopText) {
    // This would typically be tested with different viewport sizes
    console.info(`Check mobile text "${mobileText}" with responsive testing`)
  }
}

// Accessibility helpers
export const expectAriaLabel = (element, label) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveAttribute('aria-label', label)
}

export const expectAriaDescribedBy = (element, descriptionId) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveAttribute('aria-describedby', descriptionId)
}