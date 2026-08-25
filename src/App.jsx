import { useEffect, useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskFilters from './components/TaskFilters'


function App() {

  const TASKS_STORAGE_KEY = 'task-manager-tasks'

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY)

    // I return an empty collection when storage has no saved value because
    // a first-time user should start with a valid application state.
    if (!storedTasks) {
      return []
    }

    try {
      const parsedTasks = JSON.parse(storedTasks)

      // I validate the parsed structure because valid JSON is not necessarily
      // a valid task collection for this application.
      return Array.isArray(parsedTasks) ? parsedTasks : []
    } catch {
      // I recover from malformed persisted data instead of allowing corrupted
      // browser storage to prevent the application from rendering.
      return []
    }
  })




  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // I synchronize the task collection with browser storage whenever tasks
    // change because localStorage is an external system outside React state.
    localStorage.setItem(
      TASKS_STORAGE_KEY,
      JSON.stringify(tasks),
    )
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
  }

  const handleDeleteTask = (taskId) => {
    // I use filter to create a new collection without the selected task
    // instead of mutating the existing React state array.
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
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