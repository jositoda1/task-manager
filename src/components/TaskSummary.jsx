// src/components/TaskSummary.jsx

function TaskSummary({
    activeCount,
    completedCount,
    onClearCompleted,
}) {
    return (
        <section
            className="task-summary"
            aria-label="Task summary"
        >
            <p className="task-summary__counts">
                <span>
                    {activeCount} {activeCount === 1 ? 'active task' : 'active tasks'}
                </span>

                <span aria-hidden="true">•</span>

                <span>
                    {completedCount}{' '}
                    {completedCount === 1
                        ? 'completed task'
                        : 'completed tasks'}
                </span>
            </p>

            <button
                className="button button--secondary button--small"
                type="button"
                onClick={onClearCompleted}
                disabled={completedCount === 0}
            >
                Clear completed
            </button>
        </section>
    )
}

export default TaskSummary