import './App.css'
import TaskForm from './components/TaskForm'

function App() {
  return (
    <main className="app">
      <h1>Task Manager</h1>
      <p>Organize your tasks and stay productive.</p>

      <TaskForm />
    </main>
  )
}

export default App