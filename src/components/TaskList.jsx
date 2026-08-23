// src/components/TaskList.jsximport TaskItem from './TaskItem'
import TaskItem from './TaskItem'
function TaskList({ tasks, onToggleTask, onDeleteTask }) {
    if (tasks.length === 0) {
        return <p>No tasks yet. Add your first task.</p>
    }

    return (
        <section aria-labelledby="task-list-heading">
            <h2 id="task-list-heading">Tasks</h2>

            <ul>
                {tasks.map((task) => (
                    // I keep TaskList focused on rendering the collection and forwarding
                    // task actions instead of letting it own application-level state.
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