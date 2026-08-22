// src/components/TaskForm.jsx
import { useState } from 'react'

// I keep the form state inside TaskForm because the input value is currently
// only relevant to this component. I will lift state up only when another
// component needs to own or share that data.
function TaskForm() {
    const [taskTitle, setTaskTitle] = useState('')

    const handleTitleChange = (event) => {
        setTaskTitle(event.target.value)
    }

    return (
        <form>
            <label htmlFor="task-title">Task</label>

            <input
                id="task-title"
                name="taskTitle"
                type="text"
                placeholder="What needs to be done?"
                value={taskTitle}
                onChange={handleTitleChange}
            />

            <button type="submit">Add task</button>
        </form>
    )
}

export default TaskForm