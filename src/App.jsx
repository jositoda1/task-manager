import { useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

function App() {
  const [tasks, setTasks] = useState([])

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

        <TaskList
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />
      </section>
    </main>
  )
}

export default App