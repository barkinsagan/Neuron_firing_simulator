import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.04

const RECAP_PHASES = [
  { label: 'Resting neuron', time: 0, color: '#81c784' },
  { label: 'Action potential fires', time: 0.8, color: '#ff9800' },
  { label: 'Propagation down axon', time: 2, color: '#f44336' },
  { label: 'Synaptic transmission', time: 3.5, color: '#9c27b0' },
  { label: 'Postsynaptic response', time: 5, color: '#2196f3' },
  { label: 'Circuit integration', time: 6, color: '#26c6da' },
]

const ACHIEVEMENTS = [
  'Neuron structure and function',
  'Resting potential and ion gradients',
  'Action potential mechanism',
  'Propagation and myelin',
  'Synaptic transmission',
  'Circuit integration',
]

export default function Module6_JourneyComplete({ onAdvance }) {
  const [replaying, setReplaying] = useState(false)
  const [activePhase, setActivePhase] = useState(-1)
  const prevSpeedRef = useRef(1)
  const timerRef = useRef(null)

  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    return () => {
      useStore.getState().setSpeed(prevSpeedRef.current)
      clearInterval(timerRef.current)
    }
  }, [])

  const playRecap = () => {
    setReplaying(true)
    setActivePhase(0)
    useStore.getState().reset()
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 300)

    let phase = 0
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      phase++
      if (phase >= RECAP_PHASES.length) {
        clearInterval(timerRef.current)
        setReplaying(false)
        return
      }
      setActivePhase(phase)
    }, 1200)
  }

  return (
    <div className="m6-step m6-step--summary">
      <h3 className="m6-step-title">Journey Complete!</h3>

      <p className="m6-narration" style={{ textAlign: 'center' }}>
        Congratulations! You've followed a signal all the way from one neuron
        to another, and seen how neurons work together in circuits.
      </p>

      {/* Time-lapse recap */}
      <div className="m6-recap-timeline">
        {RECAP_PHASES.map((p, i) => (
          <div
            key={i}
            className={`m6-recap-phase ${i <= activePhase ? 'm6-recap-phase--active' : ''}`}
          >
            <div className="m6-recap-dot" style={{ background: i <= activePhase ? p.color : undefined }} />
            <span className="m6-recap-label" style={{ color: i <= activePhase ? p.color : undefined }}>
              {p.label}
            </span>
            {i < RECAP_PHASES.length - 1 && (
              <div className={`m6-recap-connector ${i < activePhase ? 'm6-recap-connector--active' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div className="m6-action-center">
        <button className="m6-action-btn m6-action-btn--primary" onClick={playRecap}>
          {replaying ? 'Replaying...' : 'Watch Full Replay'}
        </button>
      </div>

      {/* What you now understand */}
      <div className="m6-achievements">
        <div className="m6-achievements-title">What You Now Understand</div>
        {ACHIEVEMENTS.map((a, i) => (
          <div key={i} className="m6-achievement">
            <span className="m6-achievement-check">&#10003;</span>
            <span className="m6-achievement-text">{a}</span>
          </div>
        ))}
      </div>

      <div className="m6-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
