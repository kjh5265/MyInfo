import Profile from './components/Profile'
import DarkModeToggle from './components/DarkModeToggle'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <DarkModeToggle />
      <Profile />
    </div>
  )
}

export default App
