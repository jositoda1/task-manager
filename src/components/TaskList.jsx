// src/components/TaskList.jsximport TaskItem from './TaskItem'
import TaskItem from './TaskItem'
function TaskList({ tasks, onToggleTask }) {
    if (tasks.length === 0) {
        return <p>No tasks yet. Add your first task.</p>
    }

    return (
        <section aria-labelledby="task-list-heading">
            <h2 id="task-list-heading">Tasks</h2>

            <ul>
                {tasks.map((task) => (
                    // I delegate individual task behavior to TaskItem now that each task
                    // has its own interactive state and user action.
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleTask={onToggleTask}
                    />
                ))}
            </ul>
        </section>
    )
}

export default TaskList