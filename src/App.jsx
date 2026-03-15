import { useState } from 'react'
import Profile from './components/Profile'
import DarkModeToggle from './components/DarkModeToggle'
import LockScreen from './components/LockScreen'

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  if (!isUnlocked) {
    return <LockScreen onUnlock={() => setIsUnlocked(true)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500">
      <DarkModeToggle />
      <Profile />
    </div>
  )
}

export default App
