import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Global test setup file
    setupFiles: ['./src/__tests__/setup.js'],

    // Test environment
    environment: 'jsdom',

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.config.js',
        '**/*.config.jsx',
        'dist/',
        'coverage/',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },

    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'src/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    exclude: [
      'node_modules/',
      'dist/',
      '**/*.d.ts',
    ],

    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,

    // Verbose output
    verbose: true,

    // Watch mode settings
    watch: false,

    // Global variables
    globals: true,

    // Isolate tests
    isolate: true,

    // Single thread for debugging
    threads: false,

    // Environment specific settings
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },

    // Reporter settings
    reporter: ['default', 'html', 'json'],

    // Output directory for reports
    outputFile: {
      html: './test-results/index.html',
      json: './test-results/results.json',
    },

    // Test retry configuration
    retry: 2,

    // Fail fast on first error
    bail: 0,

    // Allow only certain tests
    allowOnly: true,

    // Pass/fail thresholds
    passWithNoTests: false,

    // Log heap usage
    logHeapUsage: true,

    // Disable console intercept
    disableConsoleIntercept: false,

    // Force file isolation
    sequence: {
      concurrent: true,
      shuffle: false,
      seed: 42,
    },

    // Include/exclude patterns for watch mode
    watchExclude: [
      'node_modules/',
      'dist/',
      'coverage/',
      '**/*.log',
    ],
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tests': resolve(__dirname, './src/__tests__'),
      '@utils': resolve(__dirname, './src/__tests__/utils'),
      '@mocks': resolve(__dirname, './src/__tests__/mocks'),
      '@helpers': resolve(__dirname, './src/__tests__/helpers'),
    },
  },

  // Define global constants
  define: {
    __DEV__: 'true',
    __TEST__: 'true',
    'process.env.NODE_ENV': '"test"',
  },
})