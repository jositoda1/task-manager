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


    it('allows a user to mark a task as completed', async () => {
        const user = userEvent.setup()

        render(<App />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        const submitButton = screen.getByRole('button', {
            name: /add task/i,
        })

        await user.type(taskInput, 'Buy groceries')
        await user.click(submitButton)

        const taskCheckbox = screen.getByRole('checkbox', {
            name: /buy groceries/i,
        })

        expect(taskCheckbox).not.toBeChecked()

        // I test the complete user flow here because this verifies that TaskItem,
        // TaskList, and the parent-owned task state work correctly together.
        await user.click(taskCheckbox)

        expect(taskCheckbox).toBeChecked()
    })

    it('allows a user to delete a task', async () => {
        const user = userEvent.setup()

        render(<App />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        const submitButton = screen.getByRole('button', {
            name: /add task/i,
        })

        await user.type(taskInput, 'Buy groceries')
        await user.click(submitButton)

        expect(screen.getByText('Buy groceries')).toBeInTheDocument()
        expect(screen.getByText(/1 task added/i)).toBeInTheDocument()

        const deleteButton = screen.getByRole('button', {
            name: /delete/i,
        })

        // I test deletion through the complete user flow because this verifies
        // that the callback reaches App and updates the shared task collection.
        await user.click(deleteButton)

        expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument()
        expect(screen.getByText(/0 tasks added/i)).toBeInTheDocument()
    })
    it('allows a user to edit an existing task', async () => {
        const user = userEvent.setup()

        render(<App />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        await user.type(taskInput, 'Buy groceries')

        await user.click(
            screen.getByRole('button', {
                name: /add task/i,
            }),
        )

        await user.click(
            screen.getByRole('button', {
                name: /edit buy groceries/i,
            }),
        )

        const editInput = screen.getByRole('textbox', {
            name: /edit buy groceries/i,
        })

        await user.clear(editInput)
        await user.type(editInput, 'Buy vegetables')

        await user.click(
            screen.getByRole('button', {
                name: /save/i,
            }),
        )

        // I verify the complete editing flow through visible application output
        // because App owns the persistent title and must propagate it back down.
        expect(
            screen.queryByText('Buy groceries'),
        ).not.toBeInTheDocument()

        expect(
            screen.getByText('Buy vegetables'),
        ).toBeInTheDocument()
    })

    it('filters tasks by completion status', async () => {
        const user = userEvent.setup()

        render(<App />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        const addButton = screen.getByRole('button', {
            name: /add task/i,
        })

        await user.type(taskInput, 'Active task')
        await user.click(addButton)

        await user.type(taskInput, 'Completed task')
        await user.click(addButton)

        await user.click(
            screen.getByRole('checkbox', {
                name: /completed task/i,
            }),
        )

        // I first verify that both tasks are visible with the default All filter
        // so the test establishes the starting state before changing visibility.
        expect(screen.getByText('Active task')).toBeInTheDocument()
        expect(screen.getByText('Completed task')).toBeInTheDocument()

        await user.click(
            screen.getByRole('button', {
                name: /^active$/i,
            }),
        )

        // I use exact accessible-name matching for filter buttons because task
        // action labels can also contain words such as "Active" or "Completed".
        expect(screen.getByText('Active task')).toBeInTheDocument()
        expect(
            screen.queryByText('Completed task'),
        ).not.toBeInTheDocument()

        await user.click(
            screen.getByRole('button', {
                name: /^completed$/i,
            }),
        )

        expect(
            screen.queryByText('Active task'),
        ).not.toBeInTheDocument()

        expect(
            screen.getByText('Completed task'),
        ).toBeInTheDocument()

        await user.click(
            screen.getByRole('button', {
                name: /^all$/i,
            }),
        )

        expect(screen.getByText('Active task')).toBeInTheDocument()
        expect(screen.getByText('Completed task')).toBeInTheDocument()
    })
})