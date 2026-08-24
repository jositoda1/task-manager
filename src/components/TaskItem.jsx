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
        <li
            className={`task-item${task.completed ? ' task-item--completed' : ''}`}
        >
            <label className="task-item__content">
                <input
                    className="task-item__checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggle}
                />

                <span className="task-item__title">{task.title}</span>
            </label>

            <button
                className="button button--danger button--small"
                type="button"
                onClick={handleDelete}
                aria-label={`Delete ${task.title}`}
            >
                Delete
            </button>
        </li>
    )
}

export default TaskItem