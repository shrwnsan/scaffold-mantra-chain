#!/bin/bash

# Script to apply patches and validate CI fixes

echo "Starting CI test infrastructure fixes..."

# Apply JavaScript patch
if node fix-ci-patch.js; then
    echo "✅ JavaScript patch applied successfully"
else
    echo "❌ JavaScript patch failed"
    exit 1
fi

# Validate test files
echo "🔍 Validating test files..."

# Check for remaining jest references
if grep -r "jest\." src/__tests__/ --include="*.js" --include="*.jsx" | head -5; then
    echo "⚠️  Found remaining jest references"
    echo "Please manually replace with vitest equivalents"
fi

echo "🚀 Running basic test suite..."
if npm run test:hooks; then
    echo "✅ Hook tests passed"
else
    echo "⚠️  Hook tests failed - may need additional fixes"
fi

echo "📦 Running CI test command..."
if npm run test:ci; then
    echo "✅ CI tests passed - fix is complete!"
    exit 0
else
    echo "⚠️  Some CI tests still failing"
    echo "This may require additional test configuration updates"
    exit 1
fi
