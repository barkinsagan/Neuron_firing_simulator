import { useState, useEffect, useRef, useCallback } from 'react'
import useStore from '../../lib/store'

export default function Module5_FeedbackInhibition({ onAdvance }) {
  const [withInhibition, setWithInhibition] = useState(true)
  const [running, setRunning] = useState(false)
  const [eFiring, setEFiring] = useState(false)
  const [iFiring, setIFiring] = useState(false)
  const [fireCount, setFireCount] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    return () => clearInterval(intervalRef.current)
  }, [])

  const runDemo = useCallback(() => {
    setRunning(true)
    setFireCount(0)
    let count = 0

    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      count++
      setFireCount(count)

      // E fires
      setEFiring(true)
      setTimeout(() => setEFiring(false), 200)

      if (withInhibition) {
        // I fires after E, then suppresses
        setTimeout(() => {
          setIFiring(true)
          setTimeout(() => setIFiring(false), 200)
        }, 300)
      }

      // Without inhibition: runaway — stop after 20
      // With inhibition: stable — stop after 8
      const limit = withInhibition ? 8 : 20
      if (count >= limit) {
        clearInterval(intervalRef.current)
        setRunning(false)
      }
    }, withInhibition ? 600 : 150)
  }, [withInhibition])

  const stopDemo = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setEFiring(false)
    setIFiring(false)
  }

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">Circuit Motif: Feedback Inhibition</h3>

      <p className="m5-narration">
        This motif is crucial for stability. An excitatory neuron activates
        an inhibitory neuron that <strong>feeds back</strong> to suppress it —
        applying the brakes.
      </p>

      {/* Circuit diagram */}
      <div className="m5-feedback-diagram">
        <div className={`m5-fb-node m5-fb-node--exc ${eFiring ? 'm5-fb-node--firing' : ''}`}>
          <span>E</span>
        </div>
        <div className="m5-fb-arrow m5-fb-arrow--forward">→</div>
        <div className={`m5-fb-node m5-fb-node--inh ${iFiring ? 'm5-fb-node--firing' : ''} ${!withInhibition ? 'm5-fb-node--disabled' : ''}`}>
          <span>I</span>
        </div>
        {withInhibition && (
          <div className="m5-fb-arrow m5-fb-arrow--back">
            <span className="m5-fb-back-line">↩</span>
          </div>
        )}
      </div>

      {/* Toggle */}
      <div className="m5-inhibit-toggle">
        <button
          className={`m5-toggle-btn ${withInhibition ? 'm5-toggle-btn--active' : ''}`}
          onClick={() => { setWithInhibition(true); stopDemo() }}
        >
          With Inhibition
        </button>
        <button
          className={`m5-toggle-btn ${!withInhibition ? 'm5-toggle-btn--active' : ''}`}
          onClick={() => { setWithInhibition(false); stopDemo() }}
        >
          Without Inhibition
        </button>
      </div>

      {/* Fire counter */}
      <div className="m5-fire-counter">
        <span className="m5-fire-counter-label">E neuron fires:</span>
        <div className="m5-fire-counter-bar">
          <div
            className={`m5-fire-counter-fill ${!withInhibition && fireCount > 10 ? 'm5-fire-counter-fill--danger' : ''}`}
            style={{ width: `${Math.min(100, (fireCount / 20) * 100)}%` }}
          />
        </div>
        <span className="m5-fire-counter-value">{fireCount}</span>
      </div>

      <div className="m5-action-center">
        {!running ? (
          <button className="m5-action-btn m5-action-btn--primary" onClick={runDemo}>
            Run Circuit
          </button>
        ) : (
          <button className="m5-action-btn m5-action-btn--stop" onClick={stopDemo}>
            Stop
          </button>
        )}
      </div>

      {!running && fireCount > 0 && (
        <div className={`m5-fb-result ${withInhibition ? 'm5-fb-result--stable' : 'm5-fb-result--runaway'}`}>
          {withInhibition ? (
            <p><strong>Stable:</strong> Feedback inhibition limits E to controlled, rhythmic firing ({fireCount} spikes). The brake works!</p>
          ) : (
            <p><strong>Runaway!</strong> Without inhibition, E fires uncontrollably ({fireCount} rapid spikes). This is essentially what happens during a <strong>seizure</strong>.</p>
          )}
        </div>
      )}

      <div className="m5-clinical-note">
        <div className="m5-clinical-header">Clinical Connection</div>
        <p className="m5-clinical-text">
          In <strong>epilepsy</strong>, this inhibitory brake fails. Excitatory neurons
          activate each other uncontrollably, leading to seizures. Anti-epileptic drugs
          often enhance GABAergic (inhibitory) signaling.
        </p>
      </div>

      <div className="m5-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
