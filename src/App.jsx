import { Canvas } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import Scene from './components/Scene'
import EducationalMode from './components/EducationalMode'
import useStore from './lib/store'
import './App.css'

function SpeedToggle() {
  const speed = useStore((s) => s.speed)
  const setSpeed = useStore((s) => s.setSpeed)
  const fast = speed > 0.5

  return (
    <label className="speed-toggle">
      <input
        type="checkbox"
        checked={fast}
        onChange={(e) => setSpeed(e.target.checked ? 1 : 0.04)}
      />
      <span className="speed-toggle-label">{fast ? 'Fast' : 'Slow'}</span>
    </label>
  )
}

function App() {
  return (
    <div className="app-container">
      <EducationalMode />
      <SpeedToggle />

      <Canvas
        camera={{ position: [2, 5, 16], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Scene />
        <Stats />
      </Canvas>
    </div>
  )
}

export default App
