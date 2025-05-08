import './App.css'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/navbar/NavBar'
import Home from './components/home/Home'
import Players from './components/player/Players'
import Towns from './components/towns/Towns'
import Nations from './components/nations/Nations'
import Nearby from './components/nearby/Nearby'

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/players" element={<Players />} />
        <Route path="/towns" element={<Towns />} />
        <Route path="/nations" element={<Nations />} />
        <Route path="/nearby" element={<Nearby />} />
      </Routes>
    </>
  )
}

export default App
