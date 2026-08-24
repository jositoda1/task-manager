// src/components/TaskList.jsx
import TaskItem from './TaskItem'

function TaskList({
    tasks,
    onToggleTask,
    onDeleteTask,
    onEditTask,
}) {
    if (tasks.length === 0) {
        return (
            <p className="empty-state">
                No tasks yet. Add your first task.
            </p>
        )
    }

    return (
        <section className="task-list" aria-labelledby="task-list-heading">
            <h2 className="task-list__heading" id="task-list-heading">
                Tasks
            </h2>

            <ul className="task-list__items">
                {tasks.map((task) => (
                    // I keep TaskList responsible for rendering and forwarding actions
                    // while App remains the owner of the shared task collection.
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleTask={onToggleTask}
                        onDeleteTask={onDeleteTask}
                        onEditTask={onEditTask}
                    />
                ))}
            </ul>
        </section>
    )
}

export default TaskList