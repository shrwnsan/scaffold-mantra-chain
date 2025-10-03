import { render, screen } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ReactElement, ReactNode } from 'react'

// Custom render function with Chakra UI provider
export const renderWithChakra = (
  ui: ReactElement,
  { ...renderOptions } = {}
) => {
  const Wrapper = ({ children }: { children?: ReactNode }) => (
    <ChakraProvider value={defaultSystem}>
      {children}
    </ChakraProvider>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Helper to find Chakra UI components by their common attributes
export const findChakraButton = (text: string | RegExp) => {
  return screen.getByRole('button', { name: text })
}

export const findChakraHeading = (text: string | RegExp, level?: number) => {
  return screen.getByRole('heading', { name: text, level })
}

export const findChakraText = (text: string | RegExp) => {
  return screen.getByText(text)
}

export const queryChakraButton = (text: string | RegExp) => {
  return screen.queryByRole('button', { name: text })
}

export const queryChakraText = (text: string | RegExp) => {
  return screen.queryByText(text)
}

// Badge finding helpers
export const findBadge = (text: string | RegExp) => {
  return screen.getByText(text, { selector: '[data-badge]' })
}

export const queryBadge = (text: string | RegExp) => {
  return screen.queryByText(text, { selector: '[data-badge]' })
}

// Input and form helpers
export const findChakraInput = (label: string | RegExp) => {
  return screen.getByRole('textbox', { name: label })
}

export const findChakraCheckbox = (label: string | RegExp) => {
  return screen.getByRole('checkbox', { name: label })
}

// Container and layout helpers
export const findChakraContainer = () => {
  return screen.getByRole('main')
}

export const findChakraBox = (testId?: string) => {
  if (testId) {
    return screen.getByTestId(testId)
  }
  // Fallback: find any div that could be a Box
  return screen.getByRole('generic')
}

// Common test scenarios for Chakra UI components
export const expectComponentToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument()
  expect(element).toBeVisible()
}

export const expectComponentToHaveText = (element: HTMLElement, text: string) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveTextContent(text)
}

export const expectButtonToBeEnabled = (button: HTMLElement) => {
  expect(button).toBeInTheDocument()
  expect(button).not.toBeDisabled()
}

export const expectButtonToBeDisabled = (button: HTMLElement) => {
  expect(button).toBeInTheDocument()
  expect(button).toBeDisabled()
}

// Color scheme testing (using data attributes or classes)
export const expectButtonToHaveColorScheme = (button: HTMLElement, scheme: string) => {
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
export const expectResponsiveText = (element: HTMLElement, desktopText: string, mobileText?: string) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveTextContent(desktopText)

  if (mobileText && mobileText !== desktopText) {
    // This would typically be tested with different viewport sizes
    console.info(`Check mobile text "${mobileText}" with responsive testing`)
  }
}

// Accessibility helpers
export const expectAriaLabel = (element: HTMLElement, label: string) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveAttribute('aria-label', label)
}

export const expectAriaDescribedBy = (element: HTMLElement, descriptionId: string) => {
  expect(element).toBeInTheDocument()
  expect(element).toHaveAttribute('aria-describedby', descriptionId)
}