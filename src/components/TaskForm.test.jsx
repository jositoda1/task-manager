import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
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
        // I use userEvent because it reproduces user interaction more closely
        // than manually dispatching individual low-level DOM events.
        const user = userEvent.setup()

        render(<TaskForm />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        await user.type(taskInput, 'Buy groceries')

        expect(taskInput).toHaveValue('Buy groceries')
    })

    it('submits a trimmed task title and clears the input', async () => {
        const user = userEvent.setup()
        const onAddTask = vi.fn()

        render(<TaskForm onAddTask={onAddTask} />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        const submitButton = screen.getByRole('button', {
            name: /add task/i,
        })

        // I include surrounding spaces to verify that the component normalizes
        // valid user input before sending it to the parent component.
        await user.type(taskInput, '  Buy groceries  ')
        await user.click(submitButton)

        expect(onAddTask).toHaveBeenCalledOnce()
        expect(onAddTask).toHaveBeenCalledWith('Buy groceries')

        // I verify the visible result instead of inspecting React state directly,
        // keeping the test independent from the internal implementation.
        expect(taskInput).toHaveValue('')
    })

    it('does not submit a whitespace-only task title', async () => {
        const user = userEvent.setup()
        const onAddTask = vi.fn()

        render(<TaskForm onAddTask={onAddTask} />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        const submitButton = screen.getByRole('button', {
            name: /add task/i,
        })

        // I test whitespace rather than only an empty field because whitespace
        // should not be accepted as meaningful task content.
        await user.type(taskInput, '   ')
        await user.click(submitButton)

        expect(onAddTask).not.toHaveBeenCalled()
    })
})