import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window APIs
global.alert = vi.fn()