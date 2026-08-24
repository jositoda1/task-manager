// src/components/TaskItem.test.jsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskItem from './TaskItem'

describe('TaskItem', () => {
    it('renders the task title and an unchecked checkbox', () => {
        const task = {
            id: 'task-1',
            title: 'Buy groceries',
            completed: false,
        }

        render(<TaskItem task={task} onToggleTask={vi.fn()} />)

        // I query the checkbox through the task title because the label creates
        // an accessible relationship between the control and its task.
        const checkbox = screen.getByRole('checkbox', {
            name: /buy groceries/i,
        })

        expect(screen.getByText('Buy groceries')).toBeInTheDocument()
        expect(checkbox).not.toBeChecked()
    })

    it('renders the checkbox as checked for a completed task', () => {
        const task = {
            id: 'task-1',
            title: 'Buy groceries',
            completed: true,
        }

        render(<TaskItem task={task} onToggleTask={vi.fn()} />)

        // I verify the visible control state rather than inspecting the task
        // object after rendering because the user interacts with the checkbox.
        expect(
            screen.getByRole('checkbox', {
                name: /buy groceries/i,
            }),
        ).toBeChecked()
    })

    it('requests a toggle using the task ID when the checkbox is clicked', async () => {
        const user = userEvent.setup()
        const onToggleTask = vi.fn()

        const task = {
            id: 'task-1',
            title: 'Buy groceries',
            completed: false,
        }

        render(
            <TaskItem
                task={task}
                onToggleTask={onToggleTask}
            />,
        )

        const checkbox = screen.getByRole('checkbox', {
            name: /buy groceries/i,
        })

        await user.click(checkbox)

        // I verify the component contract rather than changing task state here:
        // TaskItem reports the action while the parent owns the actual update.
        expect(onToggleTask).toHaveBeenCalledOnce()
        expect(onToggleTask).toHaveBeenCalledWith('task-1')
    })

    it('requests deletion using the task ID when the delete button is clicked', async () => {
        const user = userEvent.setup()
        const onDeleteTask = vi.fn()

        const task = {
            id: 'task-1',
            title: 'Buy groceries',
            completed: false,
        }

        render(
            <TaskItem
                task={task}
                onToggleTask={vi.fn()}
                onDeleteTask={onDeleteTask}
            />,
        )

        const deleteButton = screen.getByRole('button', {
            name: /delete/i,
        })

        await user.click(deleteButton)

        // I verify that TaskItem reports which task should be deleted instead of
        // testing application state here, because state ownership belongs to App.
        expect(onDeleteTask).toHaveBeenCalledOnce()
        expect(onDeleteTask).toHaveBeenCalledWith('task-1')
    })

    it('enters edit mode with the current task title', async () => {
        const user = userEvent.setup()

        const task = {
            id: 'task-1',
            title: 'Buy groceries',
            completed: false,
        }

        render(
            <TaskItem
                task={task}
                onToggleTask={vi.fn()}
                onDeleteTask={vi.fn()}
                onEditTask={vi.fn()}
            />,
        )

        const editButton = screen.getByRole('button', {
            name: /edit buy groceries/i,
        })

        await user.click(editButton)

        // I verify that editing starts from the currently saved title so users
        // can modify the existing value instead of rebuilding it from scratch.
        const editInput = screen.getByRole('textbox', {
            name: /edit buy groceries/i,
        })

        expect(editInput).toHaveValue('Buy groceries')
    })

    it('submits a trimmed edited title and leaves edit mode', async () => {
        const user = userEvent.setup()
        const onEditTask = vi.fn()

        const task = {
            id: 'task-1',
            title: 'Buy groceries',
            completed: false,
        }

        render(
            <TaskItem
                task={task}
                onToggleTask={vi.fn()}
                onDeleteTask={vi.fn()}
                onEditTask={onEditTask}
            />,
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
        await user.type(editInput, '  Buy vegetables  ')

        await user.click(
            screen.getByRole('button', {
                name: /save/i,
            }),
        )

        // I include surrounding whitespace to verify that edited titles follow
        // the same normalization rule used when a new task is created.
        expect(onEditTask).toHaveBeenCalledOnce()
        expect(onEditTask).toHaveBeenCalledWith(
            'task-1',
            'Buy vegetables',
        )

        // I verify the interface state rather than reading local React state
        // directly, keeping the test focused on observable component behavior.
        expect(
            screen.queryByRole('textbox', {
                name: /edit buy groceries/i,
            }),
        ).not.toBeInTheDocument()
    })

    it('does not save a whitespace-only edited title', async () => {
        const user = userEvent.setup()
        const onEditTask = vi.fn()

        const task = {
            id: 'task-1',
            title: 'Buy groceries',
            completed: false,
        }

        render(
            <TaskItem
                task={task}
                onToggleTask={vi.fn()}
                onDeleteTask={vi.fn()}
                onEditTask={onEditTask}
            />,
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
        await user.type(editInput, '   ')

        await user.click(
            screen.getByRole('button', {
                name: /save/i,
            }),
        )

        // I test whitespace instead of only an empty value because whitespace
        // should not be accepted as meaningful task content during editing.
        expect(onEditTask).not.toHaveBeenCalled()

        // I keep edit mode open after invalid input so the user can correct
        // the value instead of losing the unfinished edit unexpectedly.
        expect(editInput).toBeInTheDocument()
    })

    it('cancels editing without changing the saved task', async () => {
        const user = userEvent.setup()
        const onEditTask = vi.fn()

        const task = {
            id: 'task-1',
            title: 'Buy groceries',
            completed: false,
        }

        render(
            <TaskItem
                task={task}
                onToggleTask={vi.fn()}
                onDeleteTask={vi.fn()}
                onEditTask={onEditTask}
            />,
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
        await user.type(editInput, 'Something else')

        await user.click(
            screen.getByRole('button', {
                name: /cancel/i,
            }),
        )

        // I verify that Cancel discards the temporary draft instead of
        // communicating a change to the application-level task state.
        expect(onEditTask).not.toHaveBeenCalled()

        expect(
            screen.queryByRole('textbox', {
                name: /edit buy groceries/i,
            }),
        ).not.toBeInTheDocument()

        expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    })
})