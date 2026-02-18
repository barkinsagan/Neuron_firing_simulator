import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.06
// K+ channels just opening (~1.7ms, voltage ≈ +10 mV)
const K_OPEN_TIME = 1.7
// Hyperpolarization reached (~2.5ms, voltage ≈ -80 mV)
const HYPER_TIME = 2.5

export default function Module2_Falling({ onAdvance }) {
  const [playing, setPlaying] = useState(false)
  const [reachedBottom, setReachedBottom] = useState(false)
  const voltage = useStore((s) => s.voltage)
  const phase = useStore((s) => s.phase)
  const currentTime = useStore((s) => s.currentTime)
  const prevSpeedRef = useRef(1)

  // Start PAUSED at K+ channel opening point
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(K_OPEN_TIME)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().pause()
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  // Auto-pause when repolarization complete
  useEffect(() => {
    if (playing && !reachedBottom && currentTime >= HYPER_TIME) {
      useStore.getState().pause()
      setPlaying(false)
      setReachedBottom(true)
    }
  }, [currentTime, playing, reachedBottom])

  const watchFalling = () => {
    setPlaying(true)
    setReachedBottom(false)
    useStore.getState().setCurrentTime(K_OPEN_TIME)
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 200)
  }

  const vColor =
    voltage > 0 ? '#f44336' : voltage > -55 ? '#ff9800' : voltage < -75 ? '#1565c0' : '#81c784'

  return (
    <div className="m2-step">
      <h3 className="m2-step-title">The Falling Phase: K+ Exodus</h3>

      {/* Voltage display */}
      <div className="m2-voltage-meter m2-voltage-meter--compact">
        <div className="m2-voltage-header">
          <span className="m2-voltage-label">{phase.toUpperCase()}</span>
          <span className="m2-voltage-value" style={{ color: vColor }}>
            {voltage.toFixed(0)} mV
          </span>
        </div>
        <div className="m2-voltage-bar-track">
          <div
            className="m2-voltage-bar-fill"
            style={{
              width: `${Math.max(0, Math.min(100, ((voltage + 80) / 110) * 100))}%`,
              background: vColor,
            }}
          />
        </div>
      </div>

      <p className="m2-narration">
        Na+ channels are now inactivated (red caps). At this moment,
        <strong> voltage-gated K+ channels open</strong> — with a ~1ms delay after Na+.
        K+ is concentrated inside the cell, so when channels open, K+ rushes
        <strong> outward</strong>, making the inside negative again.
      </p>

      {/* Watch button */}
      <div className="m2-controls-row">
        {!reachedBottom ? (
          <button
            className="m2-action-btn m2-action-btn--stimulus"
            onClick={watchFalling}
            disabled={playing}
          >
            {playing ? 'Watching K+ rush out...' : 'Watch K+ Exodus'}
          </button>
        ) : (
          <div className="m2-pause-callout">
            <div className="m2-pause-badge">REPOLARIZATION COMPLETE</div>
            <p className="m2-concept">
              K+ has rushed out, bringing the voltage all the way down past
              resting potential to <strong>-80 mV</strong>. Notice the purple
              K+ particles streaming outward in the 3D view.
            </p>
            <button className="m2-action-btn" onClick={watchFalling}>
              Replay
            </button>
          </div>
        )}
      </div>

      {/* Side-by-side channel comparison */}
      <div className="m2-channel-compare m2-channel-compare--dual">
        <div className="m2-channel-card m2-channel-card--na">
          <div className="m2-channel-icon" style={{ background: '#f44336' }} />
          <div className="m2-channel-name">Na+ Channels</div>
          <span className="m2-state-tag m2-state-tag--inactivated">Inactivated</span>
          <p className="m2-channel-desc">
            Locked shut with red caps. No more sodium entering.
          </p>
        </div>
        <div className="m2-channel-card m2-channel-card--k">
          <div className="m2-channel-icon" style={{ background: '#9C27B0' }} />
          <div className="m2-channel-name">K+ Channels</div>
          <span className="m2-state-tag m2-state-tag--open">OPEN</span>
          <p className="m2-channel-desc">
            Purple glow — K+ flowing outward, restoring negative charge.
          </p>
        </div>
      </div>

      {/* Ion flow indicator */}
      <div className="m2-ion-flow">
        <div className="m2-ion-flow-item">
          <span className="m2-ion-dot" style={{ background: '#9C27B0' }} />
          <span className="m2-ion-label">K+ rushing outward through open channels</span>
          <span className="m2-ion-arrow">&larr;</span>
        </div>
      </div>

      <div className="m2-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
