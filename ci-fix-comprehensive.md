# Comprehensive CI Fix Strategy

## Recent Commits Analysis (from dfd7e2f754e12d0a98e801e32644ba7243347cb7)

### Commit Timeline:
1. **dfd7e2f** - "Fix integration issues and complete Issue #3 test infrastructure"
2. **8d058d3** - "Merge component and hook testing infrastructure from parallel development"
3. **5859107** - "Fix CI dependencies lock file and test infrastructure"
4. **32e21c6** - "Complete CI test infrastructure fixes and improvements"
5. **419a811** - Current commit with my initial fixes

## Root Cause Analysis

### 1. **Critical JSDOM Environment Errors**
**Error Pattern**: `TypeError: Cannot read properties of undefined (reading 'get')`
- **Location**: `node_modules/jsdom/node_modules/webidl-conversions/lib/index.js:325:94`
- **Impact**: All 5 test runs fail with unhandled JSDOM errors
- **Root Cause**: JSDOM 27.0.0 compatibility issues with Node.js 18.x/20.x

### 2. **Test File Structure Issues**
**Pattern**: "no tests" + "5 errors" in CI output
- **Problem**: Test files are being processed but no tests are discovered
- **Root Cause**: Broken import/export patterns in test files
- **Evidence**: Modified patterns file only contains 60 lines (incomplete)

### 3. **Missing Test Dependencies**
**Pattern**: Coverage report shows 0% coverage across all files
- **Problem**: Tests aren't being discovered or executed properly
- **Root Cause**: Test setup files not properly configured

### 4. **JSDOM Configuration Issues**
**Evidence**: The same JSDOM error repeated 5 times in CI
- **Problem**: jsdom environment setup is failing
- **Impact**: No DOM-based tests can run (all React tests)

## Comprehensive Fix Strategy

### Phase 1: Critical Infrastructure Fixes

#### 1.1 Fix JSDOM Environment (HIGH PRIORITY)
```javascript
// In vitest.config.js - update environment configuration
export default defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        pretendToBeVisual: true,
        url: 'http://localhost:3000'
      }
    }
  }
})
```

#### 1.2 Downgrade/Update JSDOM
```json
// Update package.json dependencies
"jsdom": "24.1.0"  // More stable version
```

#### 1.3 Add Node.js Version Pinning
```yaml
# In .github/workflows/test.yml
strategy:
  matrix:
    node-version: [20.9.0]  # Pin to stable version
```

### Phase 2: Test File Recovery

#### 2.1 Restore Complete Test Files
- The `async-blockchain-patterns.test.js` file was truncated (should be ~536 lines)
- Need to restore full file content from previous working version

#### 2.2 Fix Test Import Patterns
```javascript
// Fix imports in test files
import { describe, test, expect, beforeEach, vi } from 'vitest'
// Ensure all mock paths are correct
```

#### 2.3 Restore Test Setup
```javascript
// Ensure setup.js has proper MSW configuration
import { setupServer } from 'msw/node'
import { rest } from 'msw'
```

### Phase 3: Mock System Reconstruction

#### 3.1 Fix Graz Mocks
```javascript
// src/__tests__/mocks/graz.mock.js
export const mockUseAccount = vi.fn(() => ({
  data: { address: 'mantra1...' },
  isConnected: true
}))
```

#### 3.2 Fix CosmJS Mocks  
```javascript
// src/__tests__/mocks/cosmjs.mock.js
export const mockCosmWasmClient = vi.fn(() => ({
  queryContract: vi.fn()
}))
```

### Phase 4: Configuration Alignment

#### 4.1 Unified Vitest Configuration
```javascript
// Single working vitest.config.js
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      thresholds: {
        global: { branches: 70, functions: 70, lines: 70, statements: 70 }
      }
    }
  }
})
```

#### 4.2 Clean CI Workflow
```yaml
# Simplified .github/workflows/test.yml
- name: Run tests
  run: npm run test:ci
```

## Implementation Plan

### Step 1: Immediate JSDOM Fix
1. Update JSDOM to stable version
2. Add proper environment configuration
3. Test locally with Node.js 20.x

### Step 2: Restore Test Files
1. Check out working version of `async-blockchain-patterns.test.js`
2. Fix all import paths
3. Verify test discovery works

### Step 3: Fix Mock System
1. Update all mock files to use `vi.fn()`
2. Ensure proper export patterns
3. Test mock functionality

### Step 4: Validate CI
1. Run CI locally with act
2. Push test commit to verify
3. Monitor CI execution

## Expected Outcome

After implementing these fixes:
- ✅ JSDOM errors resolved
- ✅ Test discovery working (should find 89+ tests)
- ✅ Mock system functional
- ✅ Coverage reporting active
- ✅ CI passing on both Node.js versions

## Rollback Strategy

If fixes don't resolve issues:
1. Revert to known working commit (before test infrastructure additions)
2. Re-implement test infrastructure incrementally
3. Focus on basic test suite first

## Files to Modify

1. `package.json` - Update JSDOM version
2. `vitest.config.js` - Fix environment configuration  
3. `src/__tests__/patterns/async-blockchain-patterns.test.js` - Restore full content
4. `src/__tests__/mocks/graz.mock.js` - Fix mock exports
5. `src/__tests__/mocks/cosmjs.mock.js` - Fix mock exports
6. `.github/workflows/test.yml` - Simplify and pin Node.js version
7. `src/__tests__/setup.js` - Ensure proper MSW setup

## Success Metrics

- CI runs without JSDOM errors
- Test count: 89+ tests discovered
- Pass rate: 70%+ initially, 90%+ after fixes
- Coverage: 70%+ across all metrics
- CI duration: < 2 minutes per job
