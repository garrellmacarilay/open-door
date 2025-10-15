import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CalendarDashboard from './testing/CalendarDashoard.jsx'
// import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CalendarDashboard/>
    </>
  )
}

export default App
