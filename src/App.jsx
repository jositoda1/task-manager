import { useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'

function App() {
  const [tasks, setTasks] = useState([])

  const handleAddTask = (taskTitle) => {
    // I keep the task collection in App because multiple components will
    // eventually need access to it, including the form and the task list.
    setTasks((currentTasks) => [...currentTasks, taskTitle])
  }

  return (
    <main className="app">
      <h1>Task Manager</h1>
      <p>Organize your tasks and stay productive.</p>

      <TaskForm onAddTask={handleAddTask} />

      <p>
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} added
      </p>
    </main>
  )
}

export default App