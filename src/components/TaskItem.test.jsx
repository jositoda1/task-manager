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
})