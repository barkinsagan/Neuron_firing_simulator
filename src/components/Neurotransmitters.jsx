import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../lib/store'

const NT_COUNT = 25
const SYNAPSE_DURATION = 1.5 // seconds for full NT transit
const RECEPTOR_X = 0.3       // postsynaptic receptor X position (in synapse-local space)

// Vesicle starting positions (presynaptic side)
const VESICLE_STARTS = [
  [-0.3, 0.15, 0.1],
  [-0.3, -0.1, -0.15],
  [-0.25, 0.05, -0.1],
  [-0.35, -0.15, 0.15],
  [-0.28, 0.2, -0.05],
]

function initNTParticles() {
  const particles = []
  for (let i = 0; i < NT_COUNT; i++) {
    // Start clustered near a random vesicle
    const vesicle = VESICLE_STARTS[i % VESICLE_STARTS.length]
    particles.push({
      start: new THREE.Vector3(
        vesicle[0] + (Math.random() - 0.5) * 0.08,
        vesicle[1] + (Math.random() - 0.5) * 0.08,
        vesicle[2] + (Math.random() - 0.5) * 0.08,
      ),
      // Target: random position near postsynaptic receptors
      target: new THREE.Vector3(
        RECEPTOR_X + (Math.random() - 0.5) * 0.06,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
      ),
      // Random offset for staggered release
      delay: Math.random() * 0.3,
      // Brownian wobble seed
      wobbleSeed: Math.random() * Math.PI * 2,
    })
  }
  return particles
}

export default function Neurotransmitters({ position = [0, 0, 0] }) {
  const instancesRef = useRef([])
  const particles = useMemo(() => initNTParticles(), [])
  const _pos = useMemo(() => new THREE.Vector3(), [])
  const boundTriggered = useRef(false)

  useFrame((state) => {
    const { synapseActive, synapseTime, speed } = useStore.getState()
    if (!synapseActive) {
      boundTriggered.current = false
      // Hide all particles when inactive
      for (let i = 0; i < NT_COUNT; i++) {
        const ref = instancesRef.current[i]
        if (ref) ref.scale.setScalar(0)
      }
      return
    }

    const elapsed = state.clock.getElapsedTime()
    // On first frame of activation, record the start time
    const store = useStore.getState()
    let t = store.synapseTime
    if (t === 0) {
      useStore.setState({ synapseTime: elapsed })
      t = elapsed
    }

    const timeSinceActivation = (elapsed - t) * (speed ?? 1)

    let allArrived = true
    for (let i = 0; i < NT_COUNT; i++) {
      const ref = instancesRef.current[i]
      if (!ref) continue

      const p = particles[i]
      const particleTime = timeSinceActivation - p.delay

      if (particleTime < 0) {
        // Not yet released
        ref.scale.setScalar(0)
        allArrived = false
        continue
      }

      const progress = Math.min(particleTime / SYNAPSE_DURATION, 1)
      ref.scale.setScalar(1)

      // Lerp from start to target with Brownian wobble
      _pos.lerpVectors(p.start, p.target, progress)

      // Add wobble that decreases as particle approaches target
      const wobbleAmt = (1 - progress) * 0.06
      _pos.x += Math.sin(elapsed * 8 + p.wobbleSeed) * wobbleAmt
      _pos.y += Math.cos(elapsed * 6 + p.wobbleSeed * 1.3) * wobbleAmt
      _pos.z += Math.sin(elapsed * 7 + p.wobbleSeed * 0.7) * wobbleAmt

      ref.position.copy(_pos)

      if (progress < 1) allArrived = false
    }

    // All NTs have reached receptors — trigger postsynaptic response
    if (allArrived && !boundTriggered.current) {
      boundTriggered.current = true
      useStore.getState().triggerPostsynaptic()
    }
  })

  return (
    <group position={position}>
      <Instances limit={NT_COUNT}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial
          color="#f48fb1"
          emissive="#e91e63"
          emissiveIntensity={0.7}
          roughness={0.3}
          metalness={0.1}
        />
        {particles.map((_, i) => (
          <Instance
            key={i}
            ref={(el) => { instancesRef.current[i] = el }}
            scale={0}
          />
        ))}
      </Instances>
    </group>
  )
}
