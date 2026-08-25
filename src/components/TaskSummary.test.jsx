// src/components/TaskSummary.test.jsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskSummary from './TaskSummary'

describe('TaskSummary', () => {
    it('renders the active and completed task counts', () => {
        render(
            <TaskSummary
                activeCount={2}
                completedCount={1}
                onClearCompleted={vi.fn()}
            />,
        )

        // I verify the user-facing summary text because these counts communicate
        // the current state of the task collection without exposing React state.
        expect(
            screen.getByText(/2 active tasks/i),
        ).toBeInTheDocument()

        expect(
            screen.getByText(/1 completed task/i),
        ).toBeInTheDocument()
    })

    it('disables clearing when there are no completed tasks', () => {
        render(
            <TaskSummary
                activeCount={2}
                completedCount={0}
                onClearCompleted={vi.fn()}
            />,
        )

        // I verify the native disabled state because a clear action should not be
        // available when the application has no completed tasks to remove.
        expect(
            screen.getByRole('button', {
                name: /clear completed/i,
            }),
        ).toBeDisabled()
    })

    it('requests clearing completed tasks when the button is clicked', async () => {
        const user = userEvent.setup()
        const onClearCompleted = vi.fn()

        render(
            <TaskSummary
                activeCount={1}
                completedCount={2}
                onClearCompleted={onClearCompleted}
            />,
        )

        await user.click(
            screen.getByRole('button', {
                name: /clear completed/i,
            }),
        )

        // I test the component contract here because App will remain responsible
        // for deciding how the shared task collection is changed.
        expect(onClearCompleted).toHaveBeenCalledOnce()
    })
})