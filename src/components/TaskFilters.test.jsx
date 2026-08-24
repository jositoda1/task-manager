// src/components/TaskFilters.test.jsx

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import TaskFilters from './TaskFilters'

describe('TaskFilters', () => {
    it('marks the current filter as active', () => {
        render(
            <TaskFilters
                activeFilter="active"
                onFilterChange={vi.fn()}
            />,
        )

        // I verify the semantic pressed state instead of relying on a CSS class
        // because selection should remain meaningful without visual styling.
        expect(
            screen.getByRole('button', {
                name: /active/i,
            }),
        ).toHaveAttribute('aria-pressed', 'true')

        expect(
            screen.getByRole('button', {
                name: /all/i,
            }),
        ).toHaveAttribute('aria-pressed', 'false')
    })

    it('reports the selected filter when a filter button is clicked', async () => {
        const user = userEvent.setup()
        const onFilterChange = vi.fn()

        render(
            <TaskFilters
                activeFilter="all"
                onFilterChange={onFilterChange}
            />,
        )

        await user.click(
            screen.getByRole('button', {
                name: /completed/i,
            }),
        )

        // I test the component contract here because App will remain responsible
        // for storing the selected filter and deriving the visible task list.
        expect(onFilterChange).toHaveBeenCalledOnce()
        expect(onFilterChange).toHaveBeenCalledWith('completed')
    })
})