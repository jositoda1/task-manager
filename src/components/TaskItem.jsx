// src/components/TaskItem.jsx

function TaskItem({ task, onToggleTask, onDeleteTask }) {
    const handleToggle = () => {
        // I send only the task ID because App owns the task collection
        // and remains responsible for updating application-level state.
        onToggleTask(task.id)
    }

    const handleDelete = () => {
        // I report the delete intention through the task ID instead of
        // allowing TaskItem to modify the shared task collection directly.
        onDeleteTask(task.id)
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

            <button
                type="button"
                onClick={handleDelete}
            >
                Delete
            </button>
        </li>
    )
}

export default TaskItem