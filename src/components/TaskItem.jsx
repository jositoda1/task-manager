// src/components/TaskItem.jsx

function TaskItem({ task, onToggleTask }) {
    const handleToggle = () => {
        // I send only the task ID to the parent because App owns the task
        // collection and should remain responsible for changing application state.
        onToggleTask(task.id)
    }

    return (
        <li>
            <label>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggle}
                />

                <span>{task.title}</span>
            </label>
        </li>
    )
}

export default TaskItem