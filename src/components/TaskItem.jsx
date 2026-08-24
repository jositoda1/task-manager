import { useState } from 'react'

function TaskItem({ task, onToggleTask, onDeleteTask, onEditTask }) {
    const [isEditing, setIsEditing] = useState(false)
    const [editTitle, setEditTitle] = useState(task.title)

    const handleStartEditing = () => {
        // I reset the draft from the saved title whenever editing starts so
        // reopening the editor always reflects the current application state.
        setEditTitle(task.title)
        setIsEditing(true)
    }

    const handleEditTitleChange = (event) => {
        setEditTitle(event.target.value)
    }

    const handleSave = () => {
        const trimmedTitle = editTitle.trim()

        // I prevent an empty edited title from replacing valid application data,
        // applying the same normalization rule used when creating a task.
        if (!trimmedTitle) {
            return
        }

        // I send the task identity and normalized title to App because App owns
        // the persistent task collection and remains responsible for updating it.
        onEditTask(task.id, trimmedTitle)
        setIsEditing(false)
    }

    const handleCancel = () => {
        // I discard the unfinished draft instead of changing application state
        // because Cancel should leave the saved task untouched.
        setEditTitle(task.title)
        setIsEditing(false)
    }
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
            {isEditing ? (
                <div className="task-item__edit">
                    <input
                        className="form-control"
                        type="text"
                        value={editTitle}
                        onChange={handleEditTitleChange}
                        aria-label={`Edit ${task.title}`}
                    />

                    <div className="task-item__actions">
                        <button
                            className="button button--primary button--small"
                            type="button"
                            onClick={handleSave}
                        >
                            Save
                        </button>

                        <button
                            className="button button--secondary button--small"
                            type="button"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <label className="task-item__content">
                        <input
                            className="task-item__checkbox"
                            type="checkbox"
                            checked={task.completed}
                            onChange={handleToggle}
                        />

                        <span className="task-item__title">{task.title}</span>
                    </label>

                    <div className="task-item__actions">
                        <button
                            className="button button--secondary button--small"
                            type="button"
                            onClick={handleStartEditing}
                            aria-label={`Edit ${task.title}`}
                        >
                            Edit
                        </button>

                        <button
                            className="button button--danger button--small"
                            type="button"
                            onClick={handleDelete}
                            aria-label={`Delete ${task.title}`}
                        >
                            Delete
                        </button>
                    </div>
                </>
            )}
        </li>
    )
}

export default TaskItem