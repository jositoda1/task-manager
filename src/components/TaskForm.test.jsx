import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import TaskForm from './TaskForm'

describe('TaskForm', () => {
    it('renders an accessible task input', () => {
        render(<TaskForm />)

        // I query the input by its accessible role and label because this
        // reflects how users and assistive technologies identify the field.
        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        expect(taskInput).toBeInTheDocument()
    })

    it('renders the add task button', () => {
        render(<TaskForm />)

        // I query the button by role and visible name so the test stays focused
        // on user-facing behavior instead of CSS selectors or DOM structure.
        const submitButton = screen.getByRole('button', {
            name: /add task/i,
        })

        expect(submitButton).toBeInTheDocument()
    })

    it('updates the input when the user types a task title', async () => {
        // I use userEvent because it simulates the sequence of browser events
        // produced by real user interaction more closely than a low-level event.
        const user = userEvent.setup()

        render(<TaskForm />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        await user.type(taskInput, 'Buy groceries')

        expect(taskInput).toHaveValue('Buy groceries')
    })
})