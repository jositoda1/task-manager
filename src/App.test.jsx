// src/App.test.jsx

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
    it('renders the application heading', () => {
        render(<App />)

        const heading = screen.getByRole('heading', {
            name: /task manager/i,
        })

        expect(heading).toBeInTheDocument()
    })
})