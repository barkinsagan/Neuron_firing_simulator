import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.04

export default function Module3_LongDistance({ onAdvance }) {
  const [showRegenerate, setShowRegenerate] = useState(false)
  const prevSpeedRef = useRef(1)

  // Pause simulation, reset to start
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    useStore.getState().setSpeed(EDU_SPEED)
    // Pull camera back to show full axon
    if (window.__cameraAnimateTo) {
      window.__cameraAnimateTo({
        position: [2, 4, 12],
        target: [1, 1, 0],
      })
    }
    return () => {
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  const showWavePropagation = () => {
    setShowRegenerate(true)
    useStore.getState().reset()
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 400)
  }

  return (
    <div className="m3-step">
      <h3 className="m3-step-title">The Problem: Long Distance</h3>

      <p className="m3-narration">
        The action potential started near the soma. But the target is way down at the
        axon terminal — in your body, that could be <strong>up to 1 meter away</strong>!
      </p>

      <div className="m3-comparison">
        <div className="m3-compare-card m3-compare-card--wrong">
          <div className="m3-compare-label">Passive Electricity</div>
          <div className="m3-compare-visual">
            <div className="m3-fade-bar" />
          </div>
          <p className="m3-compare-desc">
            Simple electrical current would <strong>fade out</strong> within
            a few millimeters — not enough to reach the terminal.
          </p>
        </div>

        <div className="m3-compare-card m3-compare-card--right">
          <div className="m3-compare-label">Regenerating Signal</div>
          <div className="m3-compare-visual">
            <div className="m3-regen-bar">
              <div className="m3-regen-pulse" />
              <div className="m3-regen-pulse m3-regen-pulse--2" />
              <div className="m3-regen-pulse m3-regen-pulse--3" />
            </div>
          </div>
          <p className="m3-compare-desc">
            Instead, the signal <strong>regenerates itself</strong> at each point
            along the axon — it never weakens!
          </p>
        </div>
      </div>

      <div className="m3-action-center">
        <button
          className="m3-action-btn m3-action-btn--primary"
          onClick={showWavePropagation}
        >
          {showRegenerate ? 'Replay Wave' : 'Watch Signal Propagate'}
        </button>
        {showRegenerate && (
          <p className="m3-hint">
            Watch the glowing wave travel along the axon in the 3D view —
            it regenerates at each Node of Ranvier.
          </p>
        )}
      </div>

      <div className="m3-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
