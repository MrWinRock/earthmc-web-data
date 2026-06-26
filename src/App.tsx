import './App.css'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/navbar/NavBar'
import Home from './components/home/Home'
import Players from './components/player/Players'
import Online from './components/online/Online'
import Towns from './components/towns/Towns'
import Nations from './components/nations/Nations'
import Quarters from './components/quarters/Quarters'
import Nearby from './components/nearby/Nearby'

function App() {
  return (
    <>
      <div className="app-backdrop map-grid" aria-hidden />
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/online" element={<Online />} />
          <Route path="/players" element={<Players />} />
          <Route path="/towns" element={<Towns />} />
          <Route path="/nations" element={<Nations />} />
          <Route path="/quarters" element={<Quarters />} />
          <Route path="/nearby" element={<Nearby />} />
        </Routes>
      </main>
    </>
  )
}

export default App
