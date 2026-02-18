import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../lib/store'
import { getVoltageAtTime, DURATION } from '../lib/actionPotentialSimulation'

// Ion type definitions
const ION_TYPES = {
  Na: { color: '#FFD700', emissive: '#FFD700', label: 'Na+', count: 40, radius: 0.08 },
  K:  { color: '#9C27B0', emissive: '#9C27B0', label: 'K+',  count: 40, radius: 0.08 },
  Ca: { color: '#4CAF50', emissive: '#4CAF50', label: 'Ca2+', count: 20, radius: 0.06 },
  Cl: { color: '#2196F3', emissive: '#2196F3', label: 'Cl-', count: 20, radius: 0.07 },
}

// Bounce boundaries
const BOUNDS = { x: [-13, 13], y: [-3, 3], z: [-3, 3] }

// Channel interaction radius and teleport threshold
const CHANNEL_ATTRACT_RADIUS = 0.5
const CHANNEL_TELEPORT_RADIUS = 0.08
const K_DELAY_MS = 1.0

// ─── Axon geometry (mirrors Neuron.jsx) ──────────────────────────────
const AXON_LOCAL = [
  [0.4, 0, 0], [1.2, 0.1, 0.05], [2.5, -0.1, -0.05],
  [3.8, 0.15, 0.08], [5.0, -0.05, -0.03], [6.2, 0.08, 0.02],
]

// neuronIdx 0 = presynaptic (uses currentTime), 1 = postsynaptic (uses postTime)
const NEURON_OFFSETS = [[-4, 1, 0], [4.5, 1, 0]]

// ─── Precompute world-space membrane samples for general drift ───────
const MEMBRANE_SAMPLES = []
for (const offset of NEURON_OFFSETS) {
  MEMBRANE_SAMPLES.push(new THREE.Vector3(offset[0], offset[1], offset[2]))
  for (let i = 0; i < AXON_LOCAL.length - 1; i++) {
    const a = AXON_LOCAL[i]
    const b = AXON_LOCAL[i + 1]
    for (let t = 0; t <= 1; t += 0.25) {
      MEMBRANE_SAMPLES.push(new THREE.Vector3(
        a[0] + (b[0] - a[0]) * t + offset[0],
        a[1] + (b[1] - a[1]) * t + offset[1],
        a[2] + (b[2] - a[2]) * t + offset[2],
      ))
    }
  }
}

const _nearestMem = new THREE.Vector3()
function nearestMembranePoint(pos) {
  let bestDist = Infinity
  let bestIdx = 0
  for (let i = 0; i < MEMBRANE_SAMPLES.length; i++) {
    const d = pos.distanceToSquared(MEMBRANE_SAMPLES[i])
    if (d < bestDist) {
      bestDist = d
      bestIdx = i
    }
  }
  _nearestMem.copy(MEMBRANE_SAMPLES[bestIdx])
  return { point: _nearestMem, dist: Math.sqrt(bestDist) }
}

// ─── Precompute world-space channel registry ─────────────────────────
// Each entry: { type, neuronIdx, nodeT, pos, axonPoint, inwardDir, outwardDir }
const CHANNEL_REGISTRY = []

const axonCurves = NEURON_OFFSETS.map((offset) => {
  const points = AXON_LOCAL.map(p => new THREE.Vector3(
    p[0] + offset[0], p[1] + offset[1], p[2] + offset[2],
  ))
  return new THREE.CatmullRomCurve3(points)
})

for (let n = 0; n < NEURON_OFFSETS.length; n++) {
  const curve = axonCurves[n]
  const count = 7
  const startT = 0.12
  const endT = 0.88
  const step = (endT - startT) / count

  for (let i = 0; i < count - 1; i++) {
    const myelinT1 = startT + i * step + step * 0.15
    const myelinT2 = startT + (i + 1) * step + step * 0.15
    const nodeT = (myelinT1 + myelinT2) / 2

    const point = curve.getPointAt(nodeT)
    const tangent = curve.getTangentAt(nodeT).normalize()

    const up = new THREE.Vector3(0, 1, 0)
    const radial = new THREE.Vector3().crossVectors(tangent, up).normalize()
    if (radial.length() < 0.1) {
      radial.crossVectors(tangent, new THREE.Vector3(1, 0, 0)).normalize()
    }

    const offset = 0.12

    // Na+ channel (radial side)
    CHANNEL_REGISTRY.push({
      type: 'Na',
      neuronIdx: n,
      nodeT,
      pos: new THREE.Vector3(
        point.x + radial.x * offset,
        point.y + radial.y * offset,
        point.z + radial.z * offset,
      ),
      axonPoint: point.clone(),
      inwardDir: radial.clone().negate(),
      outwardDir: radial.clone(),
    })

    // K+ channel (opposite radial side)
    CHANNEL_REGISTRY.push({
      type: 'K',
      neuronIdx: n,
      nodeT,
      pos: new THREE.Vector3(
        point.x - radial.x * offset,
        point.y - radial.y * offset,
        point.z - radial.z * offset,
      ),
      axonPoint: point.clone(),
      inwardDir: radial.clone(),
      outwardDir: radial.clone().negate(),
    })
  }
}

// ─── Channel state helpers (same logic as NodalChannels) ─────────────
function getLocalVoltage(currentTime, nodeT) {
  const arrivalTime = nodeT * DURATION
  const localTime = currentTime - arrivalTime
  if (localTime < 0) return -70
  if (localTime > DURATION) return -70
  // Offset by 0.5ms to skip the resting plateau so depolarization
  // starts immediately when the wave front arrives at this node.
  return getVoltageAtTime(Math.min(localTime + 0.5, DURATION))
}

function isNaOpen(currentTime, nodeT) {
  const v = getLocalVoltage(currentTime, nodeT)
  return v > -55 && v <= 20
}

function isKOpen(currentTime, nodeT) {
  const delayedTime = currentTime - K_DELAY_MS
  if (delayedTime <= 0) return false
  const v = getLocalVoltage(delayedTime, nodeT)
  return v >= 0
}

// ─── Particle helpers ────────────────────────────────────────────────
function randomInRange(min, max) {
  return min + Math.random() * (max - min)
}

function initParticles(type, count) {
  const particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      position: new THREE.Vector3(
        randomInRange(-12, 12),
        randomInRange(-2, 2),
        randomInRange(-2, 2),
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04,
        (Math.random() - 0.5) * 0.04,
      ),
      type,
      cooldown: 0, // prevent rapid re-teleporting
    })
  }
  return particles
}

// ─── IonGroup component ──────────────────────────────────────────────
function IonGroup({ type, config }) {
  const instancesRef = useRef([])
  const particles = useMemo(() => initParticles(type, config.count), [type, config.count])
  const _dir = useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    const { voltage, phase, showIons, currentTime, postTime } = useStore.getState()
    const dt = Math.min(delta, 0.05)

    const naActive = type === 'Na' && voltage > -55
    const kActive = type === 'K' && (phase === 'repolarizing' || phase === 'hyperpolarizing')
    const isActive = naActive || kActive
    const hasChannelInteraction = type === 'Na' || type === 'K'

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const ref = instancesRef.current[i]
      if (!ref) continue

      // Decrease cooldown
      if (p.cooldown > 0) p.cooldown -= dt

      // --- Brownian motion ---
      const brownianScale = isActive ? 0.02 : 0.08
      p.velocity.x += (Math.random() - 0.5) * brownianScale * dt
      p.velocity.y += (Math.random() - 0.5) * brownianScale * dt
      p.velocity.z += (Math.random() - 0.5) * brownianScale * dt

      // --- Channel interaction (Na+ and K+ only) ---
      let channelHandled = false

      if (hasChannelInteraction && isActive && p.cooldown <= 0) {
        // Find nearest open channel of matching type
        let nearestCh = null
        let nearestDistSq = CHANNEL_ATTRACT_RADIUS * CHANNEL_ATTRACT_RADIUS

        for (let c = 0; c < CHANNEL_REGISTRY.length; c++) {
          const ch = CHANNEL_REGISTRY[c]
          if (ch.type !== type) continue

          // Check if this channel is open using the correct neuron's time
          const time = ch.neuronIdx === 0 ? currentTime : postTime
          const open = type === 'Na' ? isNaOpen(time, ch.nodeT) : isKOpen(time, ch.nodeT)
          if (!open) continue

          const dSq = p.position.distanceToSquared(ch.pos)
          if (dSq < nearestDistSq) {
            nearestDistSq = dSq
            nearestCh = ch
          }
        }

        if (nearestCh) {
          const dist = Math.sqrt(nearestDistSq)
          channelHandled = true

          if (dist < CHANNEL_TELEPORT_RADIUS) {
            // ─── TELEPORT through membrane ───
            if (type === 'Na') {
              // Na+ passes inward: appear on the axon-center side of the channel
              p.position.copy(nearestCh.axonPoint)
                .addScaledVector(nearestCh.inwardDir, 0.2)
              // Burst velocity inward
              p.velocity.copy(nearestCh.inwardDir).multiplyScalar(4.0)
            } else {
              // K+ passes outward: appear on the outside of the channel
              p.position.copy(nearestCh.pos)
                .addScaledVector(nearestCh.outwardDir, 0.25)
              // Burst velocity outward
              p.velocity.copy(nearestCh.outwardDir).multiplyScalar(4.0)
            }
            // Add slight random spread to burst direction
            p.velocity.x += (Math.random() - 0.5) * 0.5
            p.velocity.y += (Math.random() - 0.5) * 0.5
            p.velocity.z += (Math.random() - 0.5) * 0.5
            // Prevent rapid re-teleporting
            p.cooldown = 0.3
          } else {
            // ─── Strong attraction toward channel ───
            _dir.copy(nearestCh.pos).sub(p.position).divideScalar(dist) // normalize
            // Force increases as particle gets closer (inverse-ish falloff)
            const attractStrength = 15.0 * (1.0 - dist / CHANNEL_ATTRACT_RADIUS)
            p.velocity.x += _dir.x * attractStrength * dt
            p.velocity.y += _dir.y * attractStrength * dt
            p.velocity.z += _dir.z * attractStrength * dt
          }
        }
      }

      // --- General voltage-dependent drift (fallback when no channel nearby) ---
      if (!channelHandled) {
        if (naActive) {
          const strength = Math.min((voltage + 55) / 85, 1)
          const { point, dist } = nearestMembranePoint(p.position)
          if (dist > 0.05) {
            _dir.copy(point).sub(p.position).divideScalar(dist)
            const proximityBoost = Math.min(3.0 / (dist + 0.5), 6.0)
            const driftMag = strength * 8.0 * proximityBoost * dt
            p.velocity.x += _dir.x * driftMag
            p.velocity.y += _dir.y * driftMag
            p.velocity.z += _dir.z * driftMag
          }
        } else if (kActive) {
          const strength = Math.max((voltage + 70) / 110, 0.15)
          const { point, dist } = nearestMembranePoint(p.position)
          if (dist > 0.05) {
            _dir.copy(p.position).sub(point).divideScalar(dist)
            const proximityBoost = Math.min(4.0 / (dist + 0.3), 8.0)
            const driftMag = strength * 10.0 * proximityBoost * dt
            p.velocity.x += _dir.x * driftMag
            p.velocity.y += _dir.y * driftMag
            p.velocity.z += _dir.z * driftMag
          } else {
            _dir.set(
              (Math.random() - 0.5),
              (Math.random() - 0.5),
              (Math.random() - 0.5),
            ).normalize()
            p.velocity.x += _dir.x * 5.0 * dt
            p.velocity.y += _dir.y * 5.0 * dt
            p.velocity.z += _dir.z * 5.0 * dt
          }
        }
      }

      // Damping — less during active drift for snappier movement
      p.velocity.multiplyScalar(isActive ? 0.92 : 0.98)

      // --- Update position ---
      p.position.x += p.velocity.x * dt
      p.position.y += p.velocity.y * dt
      p.position.z += p.velocity.z * dt

      // --- Boundary bounce ---
      if (p.position.x < -13) { p.position.x = -13; p.velocity.x = Math.abs(p.velocity.x) }
      else if (p.position.x > 13) { p.position.x = 13; p.velocity.x = -Math.abs(p.velocity.x) }
      if (p.position.y < -3) { p.position.y = -3; p.velocity.y = Math.abs(p.velocity.y) }
      else if (p.position.y > 3) { p.position.y = 3; p.velocity.y = -Math.abs(p.velocity.y) }
      if (p.position.z < -3) { p.position.z = -3; p.velocity.z = Math.abs(p.velocity.z) }
      else if (p.position.z > 3) { p.position.z = 3; p.velocity.z = -Math.abs(p.velocity.z) }

      // --- Update instance transform ---
      ref.position.copy(p.position)
      ref.scale.setScalar(showIons ? 1 : 0)
    }
  })

  return (
    <Instances limit={config.count}>
      <sphereGeometry args={[config.radius, 8, 8]} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.emissive}
        emissiveIntensity={0.6}
        roughness={0.3}
        metalness={0.1}
      />
      {particles.map((_, i) => (
        <Instance
          key={i}
          ref={(el) => { instancesRef.current[i] = el }}
          position={[0, 0, 0]}
        />
      ))}
    </Instances>
  )
}

export default function IonParticles() {
  const showIons = useStore((s) => s.showIons)

  if (!showIons) return null

  return (
    <group>
      {Object.entries(ION_TYPES).map(([type, config]) => (
        <IonGroup key={type} type={type} config={config} />
      ))}
    </group>
  )
}
