// src/components/TaskForm.jsx
import { useState } from 'react'

// I keep the unfinished input value inside TaskForm because no other component
// needs to know what the user is typing before the form is submitted.
function TaskForm({ onAddTask }) {
    const [taskTitle, setTaskTitle] = useState('')

    const handleTitleChange = (event) => {
        setTaskTitle(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const trimmedTitle = taskTitle.trim()

        // I reject empty or whitespace-only titles here so invalid data never
        // reaches the parent component or the future task collection.
        if (!trimmedTitle) {
            return
        }

        // I communicate with the parent through a callback prop instead of
        // managing the task collection inside this form component.
        onAddTask(trimmedTitle)

        // I clear the controlled input only after a valid submission so the
        // form is immediately ready for the next task.
        setTaskTitle('')
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <label className="task-form__label" htmlFor="task-title">
                Task
            </label>

            <div className="task-form__row">
                <input
                    className="form-control"
                    id="task-title"
                    name="taskTitle"
                    type="text"
                    placeholder="What needs to be done?"
                    value={taskTitle}
                    onChange={handleTitleChange}
                />

                <button className="button button--primary" type="submit">
                    Add task
                </button>
            </div>
        </form>
    )
}

export default TaskForm