import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.06
// Time at peak voltage (+30 mV)
const PEAK_TIME = 1.5
// Time when Na+ channels are fully inactivated (~1.8ms, voltage ~+10mV)
const INACTIVATED_TIME = 1.8

export default function Module2_Peak({ onAdvance }) {
  const [playing, setPlaying] = useState(false)
  const [showedInactivation, setShowedInactivation] = useState(false)
  const voltage = useStore((s) => s.voltage)
  const phase = useStore((s) => s.phase)
  const currentTime = useStore((s) => s.currentTime)
  const prevSpeedRef = useRef(1)

  // Start PAUSED at peak (+30 mV)
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(PEAK_TIME)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().pause()
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  // Auto-pause at inactivation point
  useEffect(() => {
    if (playing && !showedInactivation && currentTime >= INACTIVATED_TIME) {
      useStore.getState().pause()
      setPlaying(false)
      setShowedInactivation(true)
    }
  }, [currentTime, playing, showedInactivation])

  const watchInactivation = () => {
    setPlaying(true)
    setShowedInactivation(false)
    useStore.getState().setCurrentTime(PEAK_TIME)
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 200)
  }

  const atPeak = voltage > 20

  return (
    <div className="m2-step">
      <h3 className="m2-step-title">The Peak & Inactivation</h3>

      {/* Voltage display */}
      <div className="m2-voltage-meter m2-voltage-meter--compact">
        <div className="m2-voltage-header">
          <span className="m2-voltage-label">{phase.toUpperCase()}</span>
          <span
            className="m2-voltage-value"
            style={{ color: atPeak ? '#f44336' : '#ff9800' }}
          >
            {voltage.toFixed(0)} mV
            {atPeak && <span className="m2-fired-badge">PEAK</span>}
          </span>
        </div>
      </div>

      <p className="m2-narration">
        The voltage has peaked at <strong>+30 mV</strong>. Now something crucial happens:
        the sodium channels <strong>self-inactivate</strong>. They have a built-in timer —
        after ~1 millisecond, an inactivation gate swings shut.
      </p>

      {/* Watch inactivation button */}
      <div className="m2-controls-row">
        {!showedInactivation ? (
          <button
            className="m2-action-btn m2-action-btn--stimulus"
            onClick={watchInactivation}
            disabled={playing}
          >
            {playing ? 'Watching channels inactivate...' : 'Watch Channels Inactivate'}
          </button>
        ) : (
          <div className="m2-pause-callout">
            <div className="m2-pause-badge">Na+ CHANNELS INACTIVATED</div>
            <p className="m2-concept">
              Look at the 3D view — Na+ channels now show <strong>red caps</strong>.
              The gold particle flow has stopped. These channels are locked shut.
            </p>
          </div>
        )}
      </div>

      {/* Channel state comparison */}
      <div className="m2-channel-compare">
        <div className="m2-channel-card">
          <div className="m2-channel-icon" style={{ background: showedInactivation ? '#f44336' : '#FFD700' }} />
          <div className="m2-channel-name">Na+ Channel</div>
          <div className="m2-channel-states">
            <span className={`m2-state-tag ${showedInactivation ? 'm2-state-tag--inactivated' : 'm2-state-tag--open'}`}>
              {showedInactivation ? 'Inactivated' : 'Open'}
            </span>
            {!showedInactivation && (
              <>
                <span className="m2-state-arrow">&rarr;</span>
                <span className="m2-state-tag m2-state-tag--inactivated">Inactivated</span>
              </>
            )}
          </div>
          <p className="m2-channel-desc">
            {showedInactivation
              ? 'Red cap — channel locked shut. Cannot reopen until it resets.'
              : 'Currently open and glowing gold. About to inactivate...'}
          </p>
        </div>
      </div>

      <div className="m2-key-concept">
        <span className="m2-concept-icon">!</span>
        <p className="m2-concept-text">
          Inactivation is different from closing. A closed channel <em>can</em> reopen
          if voltage rises again. An inactivated channel needs time to reset — this
          is why the signal can only travel in one direction.
        </p>
      </div>

      <div className="m2-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
