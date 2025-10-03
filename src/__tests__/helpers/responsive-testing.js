import { render, screen } from '@testing-library/react'
import { ReactElement } from 'react'

// Common viewport sizes for testing
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  widescreen: { width: 1920, height: 1080 },
  ultrawide: { width: 2560, height: 1440 },
}

// Mock window.matchMedia for responsive testing
export const createMockMatchMedia = (matches: boolean) => {
  return jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
}

// Set up mock matchMedia for testing
export const setupMockMatchMedia = (initialMatches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: createMockMatchMedia(initialMatches),
  })
}

// Clean up mock matchMedia
export const cleanupMockMatchMedia = () => {
  delete (window as any).matchMedia
}

// Helper to simulate viewport changes
export const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })

  // Trigger window resize event
  window.dispatchEvent(new Event('resize'))
}

// Helper to test responsive behavior
export const testResponsiveRendering = async (
  Component: ReactElement,
  tests: Array<{
    viewport: { width: number; height: number }
    assertions: () => Promise<void> | void
  }>
) => {
  const { unmount } = render(Component)

  for (const test of tests) {
    setViewport(test.viewport.width, test.viewport.height)

    // Wait for any re-renders to complete
    await new Promise(resolve => setTimeout(resolve, 0))

    await test.assertions()
  }

  unmount()
}

// Common media query tests
export const testBreakpoints = {
  isMobile: '(max-width: 767px)',
  isTablet: '(min-width: 768px) and (max-width: 1023px)',
  isDesktop: '(min-width: 1024px)',
  isWidescreen: '(min-width: 1280px)',
}

// Helper to test media query conditions
export const testMediaQuery = (query: string, matches: boolean) => {
  const mediaQueryList = window.matchMedia(query)
  expect(mediaQueryList.matches).toBe(matches)
}

// Test component visibility at different viewport sizes
export const expectResponsiveVisibility = async (
  component: ReactElement,
  {
    mobileShouldBeVisible = true,
    tabletShouldBeVisible = true,
    desktopShouldBeVisible = true,
  } = {}
) => {
  const { unmount } = render(component)

  // Test mobile view
  setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height)
  await new Promise(resolve => setTimeout(resolve, 0))

  if (mobileShouldBeVisible) {
    expect(screen.getByRole('generic', { hidden: true })).toBeInTheDocument()
  } else {
    expect(screen.queryByRole('generic', { hidden: true })).not.toBeInTheDocument()
  }

  // Test tablet view
  setViewport(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height)
  await new Promise(resolve => setTimeout(resolve, 0))

  if (tabletShouldBeVisible) {
    expect(screen.getByRole('generic', { hidden: true })).toBeInTheDocument()
  } else {
    expect(screen.queryByRole('generic', { hidden: true })).not.toBeInTheDocument()
  }

  // Test desktop view
  setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height)
  await new Promise(resolve => setTimeout(resolve, 0))

  if (desktopShouldBeVisible) {
    expect(screen.getByRole('generic', { hidden: true })).toBeInTheDocument()
  } else {
    expect(screen.queryByRole('generic', { hidden: true })).not.toBeInTheDocument()
  }

  unmount()
}

// Test layout changes at different screen sizes
export const expectResponsiveLayout = async (
  component: ReactElement,
  layoutTests: Array<{
    viewport: { width: number; height: number }
    expectedLayout: 'vertical' | 'horizontal' | 'stacked' | 'grid'
    elements?: string[]
  }>
) => {
  const { unmount } = render(component)

  for (const test of layoutTests) {
    setViewport(test.viewport.width, test.viewport.height)
    await new Promise(resolve => setTimeout(resolve, 0))

    if (test.elements) {
      for (const element of test.elements) {
        const foundElement = screen.getByText(element)
        expect(foundElement).toBeInTheDocument()
      }
    }

    // Additional layout-specific assertions could be added here
    // For example, checking flex direction, grid layout, etc.
  }

  unmount()
}

// Test text overflow and truncation at different sizes
export const expectTextResponsive = async (
  component: ReactElement,
  {
    longText,
    shouldTruncateMobile = false,
    shouldTruncateTablet = false,
    shouldTruncateDesktop = false,
  }
) => {
  const { unmount } = render(component)

  // Test mobile
  setViewport(VIEWPORTS.mobile.width, VIEWPORTS.mobile.height)
  await new Promise(resolve => setTimeout(resolve, 0))

  const mobileElement = screen.getByText(longText)
  expect(mobileElement).toBeInTheDocument()

  if (shouldTruncateMobile) {
    expect(mobileElement).toHaveClass('truncate') // or similar truncation indicator
  }

  // Test tablet
  setViewport(VIEWPORTS.tablet.width, VIEWPORTS.tablet.height)
  await new Promise(resolve => setTimeout(resolve, 0))

  const tabletElement = screen.getByText(longText)
  expect(tabletElement).toBeInTheDocument()

  if (shouldTruncateTablet) {
    expect(tabletElement).toHaveClass('truncate')
  }

  // Test desktop
  setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height)
  await new Promise(resolve => setTimeout(resolve, 0))

  const desktopElement = screen.getByText(longText)
  expect(desktopElement).toBeInTheDocument()

  if (shouldTruncateDesktop) {
    expect(desktopElement).toHaveClass('truncate')
  }

  unmount()
}

// Utility to reset viewport after tests
export const resetViewport = () => {
  setViewport(VIEWPORTS.desktop.width, VIEWPORTS.desktop.height)
}