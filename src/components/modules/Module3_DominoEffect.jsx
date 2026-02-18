import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'
import { getVoltageAtTime, DURATION } from '../../lib/actionPotentialSimulation'

const EDU_SPEED = 0.03
const NODE_COUNT = 6
// Node positions along the axon (0–1), matching NodalChannels
const NODE_POSITIONS = Array.from({ length: NODE_COUNT }, (_, i) => {
  const startT = 0.12
  const endT = 0.88
  const step = (endT - startT) / 7
  const myelinT1 = startT + i * step + step * 0.15
  const myelinT2 = startT + (i + 1) * step + step * 0.15
  return (myelinT1 + myelinT2) / 2
})

function getLocalVoltage(currentTime, nodeT) {
  const arrivalTime = nodeT * DURATION
  const localTime = currentTime - arrivalTime
  if (localTime < 0) return -70
  if (localTime > DURATION) return -70
  // Offset by 0.5ms to skip the resting plateau so depolarization
  // starts immediately when the wave front arrives at this node.
  return getVoltageAtTime(Math.min(localTime + 0.5, DURATION))
}

function getNodePhase(voltage) {
  if (voltage > 20) return 'peak'
  if (voltage > -55) return 'depolarizing'
  if (voltage < -75) return 'hyperpolarized'
  return 'resting'
}

export default function Module3_DominoEffect({ onAdvance }) {
  const [playing, setPlaying] = useState(false)
  const currentTime = useStore((s) => s.currentTime)
  const prevSpeedRef = useRef(1)

  // Start paused at rest
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().pause()
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  const playDomino = () => {
    setPlaying(true)
    useStore.getState().reset()
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 300)
  }

  // Manual timeline scrub
  const handleScrub = (e) => {
    const t = parseFloat(e.target.value)
    useStore.getState().pause()
    useStore.getState().setCurrentTime(t)
    setPlaying(false)
  }

  return (
    <div className="m3-step">
      <h3 className="m3-step-title">The Domino Effect</h3>

      <p className="m3-narration">
        Each segment that fires triggers the next one — like <strong>dominoes falling</strong>.
        The segment behind is in its refractory period, so the signal can only travel
        <strong> forward</strong>.
      </p>

      {/* Node status grid */}
      <div className="m3-node-grid">
        {NODE_POSITIONS.map((nodeT, i) => {
          const v = getLocalVoltage(currentTime, nodeT)
          const phase = getNodePhase(v)
          return (
            <div key={i} className={`m3-node-cell m3-node-cell--${phase}`}>
              <div className="m3-node-label">Node {i + 1}</div>
              <div className="m3-node-voltage">{v.toFixed(0)} mV</div>
              <div className="m3-node-state">
                {phase === 'peak' && 'FIRING'}
                {phase === 'depolarizing' && 'Rising'}
                {phase === 'hyperpolarized' && 'Refractory'}
                {phase === 'resting' && (
                  currentTime > 0 && nodeT * DURATION > currentTime ? 'Waiting' : 'At Rest'
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Timeline scrubber */}
      <div className="m3-scrubber">
        <div className="m3-scrubber-header">
          <span className="m3-scrubber-label">Timeline</span>
          <span className="m3-scrubber-time">{currentTime.toFixed(1)} ms</span>
        </div>
        <input
          type="range"
          min="0"
          max={DURATION}
          step="0.05"
          value={currentTime}
          onChange={handleScrub}
          className="m3-scrubber-slider"
        />
        <div className="m3-scrubber-marks">
          <span>0 ms</span>
          <span>2 ms</span>
          <span>4 ms</span>
        </div>
      </div>

      {/* Controls */}
      <div className="m3-controls-row">
        <button
          className="m3-action-btn m3-action-btn--primary"
          onClick={playDomino}
        >
          {playing ? 'Watching dominoes fall...' : 'Watch Domino Effect'}
        </button>
      </div>

      <div className="m3-key-concept">
        <span className="m3-concept-icon">!</span>
        <p className="m3-concept-text">
          The <strong>refractory period</strong> (shown as dim/blue nodes) ensures
          one-way propagation. A node that just fired cannot fire again immediately,
          so the signal only moves forward.
        </p>
      </div>

      <div className="m3-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
