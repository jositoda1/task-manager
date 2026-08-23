// src/test/setup.js

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// I explicitly clean up the rendered DOM after every test so each test
// starts in isolation and cannot depend on elements created by another test.
afterEach(() => {
    cleanup()
})