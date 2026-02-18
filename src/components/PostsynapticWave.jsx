import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Trail } from '@react-three/drei'
import useStore from '../lib/store'
import { getVoltageAtTime, getPhaseAtTime, DURATION } from '../lib/actionPotentialSimulation'
import { getVoltageColor, getEmissiveIntensity } from '../lib/voltageColors'

export default function PostsynapticWave({ axonCurve }) {
  const markerRef = useRef()
  const materialRef = useRef()

  useFrame((_, delta) => {
    const { postPlaying, postTime, speed } = useStore.getState()
    if (!postPlaying) return

    const newTime = postTime + delta * (speed ?? 1) * 2
    if (newTime > DURATION) {
      // Postsynaptic AP complete — full reset
      useStore.setState({
        postPlaying: false,
        postTime: 0,
        postVoltage: -70,
        postPhase: 'resting',
        synapseActive: false,
        synapseTime: 0,
      })
      return
    }

    const voltage = getVoltageAtTime(newTime)
    const phase = getPhaseAtTime(newTime)

    useStore.setState({ postTime: newTime, postVoltage: voltage, postPhase: phase })

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
      color="#42a5f5"
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
