import { Sphere, Tube, Cylinder } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import useStore from '../lib/store'
import { getVoltageColor, getEmissiveIntensity } from '../lib/voltageColors'
import ActionPotentialWave from './ActionPotentialWave'
import PostsynapticWave from './PostsynapticWave'
import IonParticles from './IonParticles'
import NodalChannels from './NodalChannels'
import { PresynapticLabels, PostsynapticLabels } from './NeuronLabels'

function createCurve(points) {
  return new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)))
}

const AXON_POINTS = [
  [0.4, 0, 0],
  [1.2, 0.1, 0.05],
  [2.5, -0.1, -0.05],
  [3.8, 0.15, 0.08],
  [5.0, -0.05, -0.03],
  [6.2, 0.08, 0.02],
]

const DENDRITE_POINTS = [
  [[-0.4, 0.1, 0], [-1.0, 0.5, 0.3], [-1.7, 0.9, 0.5]],
  [[-0.4, -0.1, 0.1], [-1.1, -0.6, 0.2], [-1.8, -1.0, 0.1]],
  [[-0.35, 0.15, -0.2], [-0.9, 0.7, -0.5], [-1.6, 1.1, -0.8]],
  [[-0.35, -0.15, -0.15], [-1.0, -0.4, -0.6], [-1.9, -0.7, -0.9]],
  [[-0.4, 0.0, 0.25], [-1.2, 0.2, 0.7], [-1.7, 0.1, 1.2]],
]

export default function Neuron({
  position = [0, 0, 0],
  mirror = false,
  baseColor = '#4caf50',
  dendriteColor,
  terminalColor = '#81c784',
  terminalEmissive = '#2e7d32',
  useVoltageColor = true,
  voltageSelector = (s) => s.voltage,
  phaseSelector = (s) => s.phase,
  timeSelector = (s) => s.currentTime,
  showWave = true,
  showPostWave = false,
  showIonParticles = true,
  labelType = 'pre', // 'pre' | 'post' | 'none'
}) {
  const voltage = useStore(voltageSelector)
  const phase = useStore(phaseSelector)
  const isPlaying = useStore((s) => s.isPlaying)
  const postPlaying = useStore((s) => s.postPlaying)

  const activeVoltageColor = useVoltageColor ? getVoltageColor(voltage) : null
  const emissiveIntensity = useVoltageColor ? getEmissiveIntensity(voltage) : 0.3
  const somaColor = activeVoltageColor || baseColor
  const axonColor = activeVoltageColor || baseColor
  const dendColor = dendriteColor || baseColor

  const axonCurve = useMemo(() => {
    const pts = mirror ? AXON_POINTS.map(p => [-p[0], p[1], p[2]]) : AXON_POINTS
    return createCurve(pts)
  }, [mirror])

  const dendriteCurves = useMemo(() => {
    return DENDRITE_POINTS.map(pts => {
      const transformed = mirror ? pts.map(p => [-p[0], p[1], p[2]]) : pts
      return createCurve(transformed)
    })
  }, [mirror])

  const myelinSegments = useMemo(() => {
    const segments = []
    const count = 7
    const startT = 0.12
    const endT = 0.88
    const step = (endT - startT) / count
    for (let i = 0; i < count; i++) {
      const t = startT + i * step + step * 0.15
      const point = axonCurve.getPointAt(t)
      const tangent = axonCurve.getTangentAt(t)
      const quaternion = new THREE.Quaternion()
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent.normalize())
      const euler = new THREE.Euler().setFromQuaternion(quaternion)
      segments.push({ position: [point.x, point.y, point.z], rotation: [euler.x, euler.y, euler.z] })
    }
    return segments
  }, [axonCurve])

  const terminalPos = useMemo(() => {
    const p = axonCurve.getPointAt(1)
    return [p.x, p.y, p.z]
  }, [axonCurve])

  return (
    <group position={position}>
      {/* Soma */}
      <Sphere args={[0.5, 32, 32]}>
        <meshStandardMaterial
          color={somaColor}
          emissive={somaColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.2}
        />
      </Sphere>

      {/* Axon */}
      <Tube args={[axonCurve, 64, 0.08, 8, false]}>
        <meshStandardMaterial
          color={axonColor}
          emissive={axonColor}
          emissiveIntensity={useVoltageColor ? emissiveIntensity * 0.6 : 0.15}
          roughness={0.5}
          metalness={0.1}
        />
      </Tube>

      {/* Dendrites */}
      {dendriteCurves.map((curve, i) => (
        <Tube key={`dendrite-${i}`} args={[curve, 32, 0.06, 8, false]}>
          <meshStandardMaterial color={dendColor} roughness={0.5} metalness={0.1} />
        </Tube>
      ))}

      {/* Myelin sheaths */}
      {myelinSegments.map((seg, i) => (
        <Cylinder
          key={`myelin-${i}`}
          args={[0.15, 0.15, 0.5, 12]}
          position={seg.position}
          rotation={seg.rotation}
        >
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            roughness={0.3}
            metalness={0.1}
          />
        </Cylinder>
      ))}

      {/* Axon terminal (synaptic bouton) */}
      <Sphere args={[0.15, 16, 16]} position={terminalPos}>
        <meshStandardMaterial
          color={terminalColor}
          emissive={terminalEmissive}
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.2}
        />
      </Sphere>

      {/* Presynaptic action potential wave */}
      {showWave && isPlaying && <ActionPotentialWave axonCurve={axonCurve} />}

      {/* Postsynaptic action potential wave */}
      {showPostWave && postPlaying && <PostsynapticWave axonCurve={axonCurve} />}

      {/* Ion channels at Nodes of Ranvier — driven by local AP voltage */}
      <NodalChannels axonCurve={axonCurve} timeSelector={timeSelector} />

      {/* Ion particles */}
      {showIonParticles && <IonParticles />}

      {/* 3D labels */}
      {labelType === 'pre' && <PresynapticLabels />}
      {labelType === 'post' && <PostsynapticLabels />}
    </group>
  )
}
