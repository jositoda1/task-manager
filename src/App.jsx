import { useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

function App() {
  const [tasks, setTasks] = useState([])

  const handleAddTask = (taskTitle) => {
    const newTask = {
      // I assign each task a stable ID when it is created so React does not
      // need to rely on the item's array position when rendering the list.
      id: crypto.randomUUID(),
      title: taskTitle,
    }

    // I use a functional state update because the next collection depends
    // directly on the previous task collection.
    setTasks((currentTasks) => [...currentTasks, newTask])
  }

  return (
    <main className="app">
      <h1>Task Manager</h1>
      <p>Organize your tasks and stay productive.</p>

      <TaskForm onAddTask={handleAddTask} />

      <p>
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} added
      </p>

      <TaskList tasks={tasks} />
    </main>
  )
}

export default App