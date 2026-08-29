import { useEffect, useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskFilters from './components/TaskFilters'
import TaskSummary from './components/TaskSummary'
import { securityLogger } from './services/securityLogger'

const TASKS_STORAGE_KEY = 'task-manager-tasks'

const isValidTask = (task) =>
  task !== null
  && typeof task === 'object'
  && typeof task.id === 'string'
  && typeof task.title === 'string'
  && typeof task.completed === 'boolean'

function App() {
  const [tasks, setTasks] = useState(() => {
    let storedTasks

    try {
      storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)
    } catch {
      securityLogger.error('storage.read_failed')
      return []
    }

    // I return an empty collection when storage has no saved value because
    // a first-time user should start with a valid application state.
    if (!storedTasks) {
      return []
    }

    try {
      const parsedTasks = JSON.parse(storedTasks)

      // I validate the parsed structure because valid JSON is not necessarily
      // a valid task collection for this application.
      if (!Array.isArray(parsedTasks) || !parsedTasks.every(isValidTask)) {
        securityLogger.warn('storage.invalid_schema')
        return []
      }

      return parsedTasks
    } catch {
      // I recover from malformed persisted data instead of allowing corrupted
      // browser storage to prevent the application from rendering.
      securityLogger.warn('storage.invalid_json')
      return []
    }
  })




  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // I synchronize the task collection with browser storage whenever tasks
    // change because localStorage is an external system outside React state.
    try {
      localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(tasks),
      )
    } catch {
      securityLogger.error('storage.write_failed', {
        taskCount: tasks.length,
      })
    }
  }, [tasks])

  const handleAddTask = (taskTitle) => {
    const newTask = {
      // I create a stable ID once so the task keeps the same identity as its
      // properties change throughout the application lifecycle.
      id: crypto.randomUUID(),
      title: taskTitle,
      completed: false,
    }

    // I use a functional state update because the next collection depends
    // directly on the previous task collection.
    setTasks((currentTasks) => [...currentTasks, newTask])
    securityLogger.info('task.created')
  }
  const handleToggleTask = (taskId) => {
    // I update the collection immutably because React state should not be
    // modified directly, and unchanged tasks can keep their existing objects.
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task,
      ),
    )
    securityLogger.info('task.completion_changed')
  }

  const handleDeleteTask = (taskId) => {
    // I use filter to create a new collection without the selected task
    // instead of mutating the existing React state array.
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
    securityLogger.info('task.deleted')
  }

  const handleEditTask = (taskId, newTitle) => {
    // I update only the matching task while preserving every other task
    // and property through an immutable state transformation.
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, title: newTitle }
          : task,
      ),
    )
    securityLogger.info('task.edited')
  }
  const handleClearCompleted = () => {
    const removedCount = completedCount

    // I derive a new collection containing only active tasks instead of
    // mutating the existing array or deleting completed tasks individually.
    setTasks((currentTasks) =>
      currentTasks.filter((task) => !task.completed),
    )
    securityLogger.info('task.completed_cleared', { removedCount })
  }
  // I derive the visible collection from the source task state and the
  // selected filter instead of storing a duplicated filtered task list.
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') {
      return !task.completed
    }

    if (filter === 'completed') {
      return task.completed
    }

    return true
  })


  // I derive task counts from the source collection instead of storing them
  // separately because they can always be calculated from the current tasks.
  const activeCount = tasks.filter((task) => !task.completed).length

  const completedCount = tasks.filter((task) => task.completed).length
  return (
    <main className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>Organize your tasks and stay productive.</p>
      </header>

      <section className="app-content">
        <TaskForm onAddTask={handleAddTask} />

        <p className="task-count">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} added
        </p>

        <TaskSummary
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={handleClearCompleted}
        />

        <TaskFilters
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        <TaskList
          tasks={visibleTasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      </section>
    </main>
  )
}

export default App
