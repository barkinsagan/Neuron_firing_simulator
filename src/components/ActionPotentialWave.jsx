import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Trail } from '@react-three/drei'
import useStore from '../lib/store'
import { getVoltageAtTime, getPhaseAtTime, DURATION } from '../lib/actionPotentialSimulation'
import { getVoltageColor, getEmissiveIntensity } from '../lib/voltageColors'

export default function ActionPotentialWave({ axonCurve }) {
  const markerRef = useRef()
  const materialRef = useRef()

  useFrame((_, delta) => {
    const { isPlaying, currentTime, speed } = useStore.getState()
    if (!isPlaying) return

    const newTime = currentTime + delta * (speed ?? 1) * 2
    if (newTime > DURATION) {
      // AP reached the terminal — trigger synapse, stop presynaptic animation
      useStore.setState({
        isPlaying: false,
        currentTime: DURATION,
        voltage: -70,
        phase: 'resting',
      })
      useStore.getState().triggerSynapse()
      return
    }

    const voltage = getVoltageAtTime(newTime)
    const phase = getPhaseAtTime(newTime)

    useStore.setState({ currentTime: newTime, voltage, phase })

    const t = Math.min(newTime / DURATION, 1)
    if (markerRef.current) {
      const point = axonCurve.getPointAt(t)
      markerRef.current.position.copy(point)
    }

    if (materialRef.current) {
      const color = getVoltageColor(voltage)
      materialRef.current.color.copy(color)
      materialRef.current.emissive.copy(color)
      materialRef.current.emissiveIntensity = getEmissiveIntensity(voltage)
    }
  })

  return (
    <Trail
      width={0.4}
      length={6}
      color="#ff9800"
      attenuation={(t) => t * t}
    >
      <Sphere ref={markerRef} args={[0.12, 16, 16]} position={[0.4, 0, 0]}>
        <meshStandardMaterial
          ref={materialRef}
          color="#2196f3"
          emissive="#2196f3"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.1}
        />
      </Sphere>
    </Trail>
  )
}
