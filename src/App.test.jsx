// src/App.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
    it('renders the application heading', () => {
        render(<App />)

        // I query the heading by its accessible role and name because this keeps
        // the test focused on what the user can perceive in the interface.
        const heading = screen.getByRole('heading', {
            name: /task manager/i,
        })

        expect(heading).toBeInTheDocument()
    })

    it('updates the task count after a valid task is submitted', async () => {
        const user = userEvent.setup()

        render(<App />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        const submitButton = screen.getByRole('button', {
            name: /add task/i,
        })

        // I test the complete user flow through App because this verifies that
        // TaskForm and the parent state work correctly together.
        expect(screen.getByText(/0 tasks added/i)).toBeInTheDocument()

        await user.type(taskInput, 'Buy groceries')
        await user.click(submitButton)

        expect(screen.getByText(/1 task added/i)).toBeInTheDocument()
        // I also verify that the submitted task reaches the visible task list,
        // proving that the form and parent-owned collection work together.
        expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    })
})