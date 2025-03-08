import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Games from './Games'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Games/>
    </>
  )
}

export default App
