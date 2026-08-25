// src/App.test.jsx
import {
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'


describe('App', () => {
    beforeEach(() => {
        // I clear localStorage before every test so persisted data from one test
        // cannot influence another test and make the suite order-dependent.
        localStorage.clear()
    })
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

    it('loads previously saved tasks from localStorage', () => {
        const storedTasks = [
            {
                id: 'task-1',
                title: 'Persisted task',
                completed: false,
            },
        ]

        localStorage.setItem(
            'task-manager-tasks',
            JSON.stringify(storedTasks),
        )

        render(<App />)

        // I verify persistence through visible application behavior instead of
        // reading React state directly, keeping the test user-focused.
        expect(screen.getByText('Persisted task')).toBeInTheDocument()
        expect(screen.getByText(/1 task added/i)).toBeInTheDocument()
    })


    it('saves tasks to localStorage when the task collection changes', async () => {
        const user = userEvent.setup()

        render(<App />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        await user.type(taskInput, 'Persisted task')

        await user.click(
            screen.getByRole('button', {
                name: /add task/i,
            }),
        )

        // I read the stored data back through the browser API because this test
        // verifies the synchronization boundary between React and localStorage.
        await waitFor(() => {
            const storedTasks = JSON.parse(
                localStorage.getItem('task-manager-tasks'),
            )

            expect(storedTasks).toHaveLength(1)

            expect(storedTasks[0]).toMatchObject({
                title: 'Persisted task',
                completed: false,
            })
        })
    })

    it('keeps localStorage synchronized when a task changes and is deleted', async () => {
        const user = userEvent.setup()

        render(<App />)

        const taskInput = screen.getByRole('textbox', {
            name: /task/i,
        })

        await user.type(taskInput, 'Persisted task')

        await user.click(
            screen.getByRole('button', {
                name: /add task/i,
            }),
        )

        let persistedTaskId

        await waitFor(() => {
            const storedTasks = JSON.parse(
                localStorage.getItem('task-manager-tasks'),
            )

            expect(storedTasks).toHaveLength(1)

            persistedTaskId = storedTasks[0].id
        })

        await user.click(
            screen.getByRole('checkbox', {
                name: /persisted task/i,
            }),
        )

        // I verify that completion updates the same persisted task instead of
        // creating a different stored record with a new identity.
        await waitFor(() => {
            const storedTasks = JSON.parse(
                localStorage.getItem('task-manager-tasks'),
            )

            expect(storedTasks[0]).toMatchObject({
                id: persistedTaskId,
                title: 'Persisted task',
                completed: true,
            })
        })

        await user.click(
            screen.getByRole('button', {
                name: /^edit persisted task$/i,
            }),
        )

        const editInput = screen.getByRole('textbox', {
            name: /^edit persisted task$/i,
        })

        await user.clear(editInput)
        await user.type(editInput, 'Updated persisted task')

        await user.click(
            screen.getByRole('button', {
                name: /^save$/i,
            }),
        )

        // I verify that editing changes only the persisted title while preserving
        // the task identity and its existing completion state.
        await waitFor(() => {
            const storedTasks = JSON.parse(
                localStorage.getItem('task-manager-tasks'),
            )

            expect(storedTasks[0]).toMatchObject({
                id: persistedTaskId,
                title: 'Updated persisted task',
                completed: true,
            })
        })

        await user.click(
            screen.getByRole('button', {
                name: /^delete updated persisted task$/i,
            }),
        )

        // I verify deletion at the storage boundary because removed tasks should
        // not reappear after the application is reloaded.
        await waitFor(() => {
            const storedTasks = JSON.parse(
                localStorage.getItem('task-manager-tasks'),
            )

            expect(storedTasks).toEqual([])
        })
    })

    it('recovers safely from invalid localStorage data', () => {
        localStorage.setItem(
            'task-manager-tasks',
            '{invalid-json',
        )

        render(<App />)

        // I verify recovery through the visible empty application state because
        // corrupted persisted data should not prevent the interface from loading.
        expect(screen.getByText(/0 tasks added/i)).toBeInTheDocument()
        expect(
            screen.getByText(/no tasks yet/i),
        ).toBeInTheDocument()
    })

    it('ignores stored JSON that is not a task collection', () => {
        localStorage.setItem(
            'task-manager-tasks',
            JSON.stringify({
                unexpected: 'value',
            }),
        )

        render(<App />)

        // I validate the expected collection shape after parsing because syntactically
        // valid JSON can still contain data that the application cannot use as tasks.
        expect(screen.getByText(/0 tasks added/i)).toBeInTheDocument()
        expect(
            screen.getByText(/no tasks yet/i),
        ).toBeInTheDocument()
    })
    it('clears all completed tasks while keeping active tasks', async () => {
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

        expect(screen.getByText(/1 active task/i)).toBeInTheDocument()
        expect(screen.getByText(/1 completed task/i)).toBeInTheDocument()

        await user.click(
            screen.getByRole('button', {
                name: /^clear completed$/i,
            }),
        )

        // I verify the resulting collection through visible behavior because
        // clearing should remove completed tasks while preserving active tasks.
        expect(screen.getByText('Active task')).toBeInTheDocument()

        expect(
            screen.queryByText('Completed task'),
        ).not.toBeInTheDocument()

        expect(screen.getByText(/1 active task/i)).toBeInTheDocument()
        expect(screen.getByText(/0 completed tasks/i)).toBeInTheDocument()

        // I also verify that the action becomes unavailable when there is
        // nothing left to clear.
        expect(
            screen.getByRole('button', {
                name: /^clear completed$/i,
            }),
        ).toBeDisabled()

        // I also verify the persistence boundary because cleared completed tasks
        // should not return after the application is reloaded.
        await waitFor(() => {
            const storedTasks = JSON.parse(
                localStorage.getItem('task-manager-tasks'),
            )

            expect(storedTasks).toHaveLength(1)

            expect(storedTasks[0]).toMatchObject({
                title: 'Active task',
                completed: false,
            })
        })
    })


})