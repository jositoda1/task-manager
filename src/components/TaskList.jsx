// src/components/TaskList.jsx
import TaskItem from './TaskItem'

function TaskList({ tasks, onToggleTask, onDeleteTask }) {
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
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleTask={onToggleTask}
                        onDeleteTask={onDeleteTask}
                    />
                ))}
            </ul>
        </section>
    )
}

export default TaskList