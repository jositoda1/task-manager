// src/components/TaskFilters.jsx

const filters = [
    {
        value: 'all',
        label: 'All',
    },
    {
        value: 'active',
        label: 'Active',
    },
    {
        value: 'completed',
        label: 'Completed',
    },
]

function TaskFilters({ activeFilter, onFilterChange }) {
    return (
        <div className="task-filters" aria-label="Task filters">
            {filters.map((filter) => {
                const isActive = activeFilter === filter.value

                return (
                    <button
                        className={`button button--filter${isActive ? ' button--filter-active' : ''
                            }`}
                        key={filter.value}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onFilterChange(filter.value)}
                    >
                        {filter.label}
                    </button>
                )
            })}
        </div>
    )
}

export default TaskFilters