// src/components/TaskList.test.jsx

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TaskList from './TaskList'

describe('TaskList', () => {
    it('shows an empty state when there are no tasks', () => {
        render(<TaskList tasks={[]} />)

        // I verify the user-facing empty state because an empty collection
        // should still provide clear guidance instead of showing a blank area.
        expect(
            screen.getByText(/no tasks yet\. add your first task\./i),
        ).toBeInTheDocument()
    })

    it('renders the provided task titles', () => {
        const tasks = [
            {
                id: 'task-1',
                title: 'Buy groceries',
            },
            {
                id: 'task-2',
                title: 'Study React',
            },
        ]

        render(<TaskList tasks={tasks} />)

        // I assert visible task titles rather than internal list implementation
        // so the test remains focused on what the user can actually observe.
        expect(screen.getByText('Buy groceries')).toBeInTheDocument()
        expect(screen.getByText('Study React')).toBeInTheDocument()
    })
})