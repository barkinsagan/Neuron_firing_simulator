import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../lib/store'
import { getVoltageAtTime, DURATION } from '../lib/actionPotentialSimulation'
import IonChannel from './IonChannel'
import { useRef } from 'react'

/**
 * Compute the local voltage at a node based on the AP wave's position.
 * The wave takes DURATION ms to traverse from t=0 to t=1 along the axon.
 * Each node starts its own voltage cycle once the wave front reaches it.
 *
 * @param {number} currentTime - global simulation time (ms)
 * @param {number} nodeT - node position along axon (0–1)
 * @returns {number} local voltage in mV
 */
function getLocalVoltage(currentTime, nodeT) {
  // Time at which the wave front reaches this node
  const arrivalTime = nodeT * DURATION
  const localTime = currentTime - arrivalTime

  if (localTime < 0) return -70       // wave hasn't arrived yet
  if (localTime > DURATION) return -70 // cycle completed, back to resting
  // Offset by 0.5ms to skip the resting plateau in getVoltageAtTime,
  // so the node begins depolarizing immediately when the wave front arrives.
  return getVoltageAtTime(Math.min(localTime + 0.5, DURATION))
}

/**
 * Determine Na+ channel state from local voltage.
 *   voltage < -55 mV  → closed
 *   -55 to +20 mV     → open
 *   > +20 mV          → inactivated
 */
function getNaState(voltage) {
  if (voltage > 20) return 'inactivated'
  if (voltage > -55) return 'open'
  return 'closed'
}

/**
 * Determine K+ channel state from local voltage (delayed opening).
 * The 1ms delay is handled by the caller offsetting the time.
 *   voltage < 0 mV → closed
 *   voltage >= 0 mV → open
 */
function getKState(voltage) {
  if (voltage >= 0) return 'open'
  return 'closed'
}

// K+ channel opens ~1ms after Na+ at the same node
const K_DELAY_MS = 1.0

export default function NodalChannels({ axonCurve, timeSelector = (s) => s.currentTime }) {
  const channelsRef = useRef([])

  // Compute static geometry for channels at Nodes of Ranvier
  const channelDefs = useMemo(() => {
    const defs = []
    const count = 7
    const startT = 0.12
    const endT = 0.88
    const step = (endT - startT) / count

    for (let i = 0; i < count - 1; i++) {
      const myelinT1 = startT + i * step + step * 0.15
      const myelinT2 = startT + (i + 1) * step + step * 0.15
      const nodeT = (myelinT1 + myelinT2) / 2

      const point = axonCurve.getPointAt(nodeT)
      const tangent = axonCurve.getTangentAt(nodeT).normalize()

      // Perpendicular radial vectors
      const up = new THREE.Vector3(0, 1, 0)
      const radial = new THREE.Vector3().crossVectors(tangent, up).normalize()
      if (radial.length() < 0.1) {
        radial.crossVectors(tangent, new THREE.Vector3(1, 0, 0)).normalize()
      }
      const radial2 = new THREE.Vector3().crossVectors(tangent, radial).normalize()

      const offset = 0.12

      // Na+ channel
      defs.push({
        key: `na-${i}`,
        type: 'sodium',
        nodeT,
        position: [
          point.x + radial.x * offset,
          point.y + radial.y * offset,
          point.z + radial.z * offset,
        ],
        orientation: [radial.x, radial.y, radial.z],
      })

      // K+ channel
      defs.push({
        key: `k-${i}`,
        type: 'potassium',
        nodeT,
        position: [
          point.x - radial.x * offset,
          point.y - radial.y * offset,
          point.z - radial.z * offset,
        ],
        orientation: [-radial.x, -radial.y, -radial.z],
      })

      // Leak channel (every other node)
      if (i % 2 === 0) {
        defs.push({
          key: `leak-${i}`,
          type: 'leak',
          nodeT,
          position: [
            point.x + radial2.x * offset,
            point.y + radial2.y * offset,
            point.z + radial2.z * offset,
          ],
          orientation: [radial2.x, radial2.y, radial2.z],
        })
      }
    }

    return defs
  }, [axonCurve])

  // Compute channel states per-frame based on local voltage at each node
  const statesRef = useRef(channelDefs.map((d) =>
    d.type === 'leak' ? 'open' : 'closed'
  ))

  useFrame(() => {
    const currentTime = timeSelector(useStore.getState())

    const newStates = []
    for (let i = 0; i < channelDefs.length; i++) {
      const def = channelDefs[i]

      if (def.type === 'leak') {
        newStates.push('open')
        continue
      }

      if (def.type === 'sodium') {
        const localV = getLocalVoltage(currentTime, def.nodeT)
        newStates.push(getNaState(localV))
      } else {
        // Potassium — delayed by K_DELAY_MS
        const delayedTime = currentTime - K_DELAY_MS
        const localV = delayedTime > 0
          ? getLocalVoltage(delayedTime, def.nodeT)
          : -70
        newStates.push(getKState(localV))
      }
    }

    statesRef.current = newStates

    // Push states to channel refs for GSAP-driven transitions
    for (let i = 0; i < channelsRef.current.length; i++) {
      const ch = channelsRef.current[i]
      if (ch && ch.setState) {
        ch.setState(newStates[i])
      }
    }
  })

  return (
    <group>
      {channelDefs.map((ch, i) => (
        <IonChannel
          key={ch.key}
          ref={(el) => { channelsRef.current[i] = el }}
          position={ch.position}
          type={ch.type}
          state={statesRef.current[i] || (ch.type === 'leak' ? 'open' : 'closed')}
          orientation={ch.orientation}
        />
      ))}
    </group>
  )
}
