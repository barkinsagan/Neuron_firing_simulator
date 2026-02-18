import { useState, useEffect, useRef } from 'react'

export default function Module3_SpeedProblem({ onAdvance }) {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const animRef = useRef(null)
  const startRef = useRef(0)

  // Animate a slow timer showing 1 second for unmyelinated
  const startTimer = () => {
    setRunning(true)
    setElapsed(0)
    startRef.current = performance.now()

    const tick = (ts) => {
      const dt = (ts - startRef.current) / 1000
      setElapsed(Math.min(dt, 1.0))
      if (dt < 1.0) {
        animRef.current = requestAnimationFrame(tick)
      } else {
        setRunning(false)
      }
    }
    animRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  const progress = Math.min(elapsed / 1.0, 1) * 100

  return (
    <div className="m3-step">
      <h3 className="m3-step-title">The Speed Problem</h3>

      <p className="m3-narration">
        Without any insulation, signals crawl along at only <strong>0.5–2 m/s</strong>.
        A signal from your fingertip to your spine (about 1 meter) would take
        a <strong>full second</strong>. That's far too slow for survival.
      </p>

      {/* Slow wave animation */}
      <div className="m3-speed-demo">
        <div className="m3-speed-track">
          <div className="m3-speed-labels">
            <span>Fingertip</span>
            <span>Spine</span>
          </div>
          <div className="m3-speed-bar">
            <div
              className="m3-speed-wave m3-speed-wave--slow"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="m3-speed-timer">
            {elapsed.toFixed(1)}s / 1.0s
          </div>
        </div>

        <button
          className="m3-action-btn m3-action-btn--primary"
          onClick={startTimer}
          disabled={running}
        >
          {running ? 'Traveling...' : elapsed >= 1 ? 'Replay' : 'Send Unmyelinated Signal'}
        </button>

        {elapsed >= 1 && (
          <p className="m3-hint m3-hint--alert">
            A full second! Imagine a lion lunging at you — by the time
            your brain gets the signal, it's already too late.
          </p>
        )}
      </div>

      <div className="m3-key-concept">
        <span className="m3-concept-icon">?</span>
        <p className="m3-concept-text">
          Evolution's solution: <strong>Myelin</strong> — a fatty insulating sheath
          that wraps around the axon, boosting speed by 50–100x.
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
