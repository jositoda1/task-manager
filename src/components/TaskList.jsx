// src/components/TaskList.jsx

function TaskList({ tasks }) {
    if (tasks.length === 0) {
        return <p>No tasks yet. Add your first task.</p>
    }

    return (
        <section aria-labelledby="task-list-heading">
            <h2 id="task-list-heading">Tasks</h2>

            <ul>
                {tasks.map((task) => (
                    // I use a stable task ID as the React key because list positions
                    // can change later when tasks are deleted, filtered, or reordered.
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </section>
    )
}

export default TaskList