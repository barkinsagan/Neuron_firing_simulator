import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.04

export default function Module3_SaltatoryConduction({ onAdvance }) {
  const [raceStarted, setRaceStarted] = useState(false)
  const [raceElapsed, setRaceElapsed] = useState(0)
  const [unmyelProgress, setUnmyelProgress] = useState(0)
  const [myelProgress, setMyelProgress] = useState(0)
  const [raceFinished, setRaceFinished] = useState(false)
  const animRef = useRef(null)
  const prevSpeedRef = useRef(1)

  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    useStore.getState().setSpeed(EDU_SPEED)
    // Camera: zoom to myelin sheaths
    if (window.__cameraAnimateTo) {
      window.__cameraAnimateTo({
        position: [0, 2, 5],
        target: [1, 1, 0],
      })
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  const startRace = () => {
    setRaceStarted(true)
    setRaceFinished(false)
    setUnmyelProgress(0)
    setMyelProgress(0)
    setRaceElapsed(0)

    // Also play real simulation slowly
    useStore.getState().reset()
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 200)

    let startTs = null
    const tick = (ts) => {
      if (!startTs) startTs = ts
      const dtSec = (ts - startTs) / 1000

      // Race over 3 seconds of real time
      // Unmyelinated: 1 m/s → takes 1s (normalized to 3s view = 33%)
      // Myelinated: 100 m/s → takes 0.01s (nearly instant, but animate over 0.3s)
      const unmyel = Math.min(dtSec / 3.0, 1) * 100
      const myel = Math.min(dtSec / 0.3, 1) * 100

      setUnmyelProgress(unmyel)
      setMyelProgress(myel)
      setRaceElapsed(dtSec)

      if (unmyel < 100) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        setRaceFinished(true)
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }

  return (
    <div className="m3-step">
      <h3 className="m3-step-title">Myelin & Saltatory Conduction</h3>

      <p className="m3-narration">
        <strong>Myelin</strong> insulates the axon — current can't leak out sideways.
        Instead of regenerating every few micrometers, the action potential
        <strong> jumps</strong> from node to node.
      </p>

      <p className="m3-narration" style={{ marginTop: 0 }}>
        <em>"Saltatory"</em> comes from the Latin <em>saltare</em> — "to jump."
      </p>

      {/* Without vs With myelin */}
      <div className="m3-myelin-compare">
        <div className="m3-myelin-card">
          <div className="m3-myelin-label">Without Myelin</div>
          <div className="m3-myelin-visual">
            <div className="m3-axon-bare">
              <div className="m3-leak-arrows">
                <span>&uarr;</span><span>&darr;</span><span>&uarr;</span>
                <span>&darr;</span><span>&uarr;</span><span>&darr;</span>
              </div>
            </div>
          </div>
          <p className="m3-myelin-desc">
            Current leaks sideways. Must regenerate continuously. Very slow.
          </p>
        </div>
        <div className="m3-myelin-card m3-myelin-card--myelinated">
          <div className="m3-myelin-label">With Myelin</div>
          <div className="m3-myelin-visual">
            <div className="m3-axon-myelin">
              <div className="m3-sheath" />
              <div className="m3-node-gap" />
              <div className="m3-sheath" />
              <div className="m3-node-gap" />
              <div className="m3-sheath" />
            </div>
          </div>
          <p className="m3-myelin-desc">
            Insulated segments. Signal jumps between nodes. 50–100x faster!
          </p>
        </div>
      </div>

      {/* Side-by-side race */}
      <div className="m3-race">
        <div className="m3-race-header">Speed Race</div>

        <div className="m3-race-lane">
          <span className="m3-race-label">Unmyelinated (1 m/s)</span>
          <div className="m3-race-track">
            <div
              className="m3-race-bar m3-race-bar--slow"
              style={{ width: `${unmyelProgress}%` }}
            />
          </div>
        </div>

        <div className="m3-race-lane">
          <span className="m3-race-label">Myelinated (100 m/s)</span>
          <div className="m3-race-track">
            <div
              className="m3-race-bar m3-race-bar--fast"
              style={{ width: `${myelProgress}%` }}
            />
          </div>
        </div>

        <button
          className="m3-action-btn m3-action-btn--primary"
          onClick={startRace}
          disabled={raceStarted && !raceFinished}
        >
          {raceStarted && !raceFinished ? 'Racing...' : raceFinished ? 'Race Again' : 'Start Race'}
        </button>

        {raceFinished && (
          <p className="m3-hint" style={{ color: '#a5d6a7' }}>
            Myelinated wins by a factor of 100x!
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="m3-stats">
        <div className="m3-stat">
          <span className="m3-stat-value">0.5–2</span>
          <span className="m3-stat-unit">m/s</span>
          <span className="m3-stat-label">Unmyelinated</span>
        </div>
        <div className="m3-stat">
          <span className="m3-stat-value">50–120</span>
          <span className="m3-stat-unit">m/s</span>
          <span className="m3-stat-label">Myelinated</span>
        </div>
        <div className="m3-stat">
          <span className="m3-stat-value">10–20</span>
          <span className="m3-stat-unit">ms</span>
          <span className="m3-stat-label">Finger → Spine</span>
        </div>
      </div>

      <div className="m3-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
