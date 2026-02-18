import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.04

export default function Module4_Calcium({ onAdvance }) {
  const [apFired, setApFired] = useState(false)
  const [pausedAtTerminal, setPausedAtTerminal] = useState(false)
  const [caBlocked, setCaBlocked] = useState(false)
  const currentTime = useStore((s) => s.currentTime)
  const prevSpeedRef = useRef(1)

  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  // Auto-pause when AP reaches terminal (~3.5ms)
  useEffect(() => {
    if (apFired && !pausedAtTerminal && currentTime >= 3.5) {
      useStore.getState().pause()
      setPausedAtTerminal(true)
    }
  }, [currentTime, apFired, pausedAtTerminal])

  const fireAP = () => {
    setApFired(true)
    setPausedAtTerminal(false)
    useStore.getState().reset()
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 300)
  }

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">Calcium: The Trigger</h3>

      <p className="m4-narration">
        When the action potential arrives at the axon terminal, it opens
        <strong> voltage-gated Ca²⁺ (calcium) channels</strong>. Calcium ions rush in
        from the extracellular fluid, and this influx is the trigger for everything
        that follows.
      </p>

      <div className="m4-action-center">
        <button
          className="m4-action-btn m4-action-btn--fire"
          onClick={fireAP}
        >
          {apFired ? 'Replay AP' : 'Fire Action Potential'}
        </button>
        {!apFired && (
          <p className="m4-hint">Watch the AP travel to the terminal</p>
        )}
      </div>

      {apFired && !pausedAtTerminal && (
        <p className="m4-hint m4-hint--watching">
          AP propagating toward the terminal...
        </p>
      )}

      {pausedAtTerminal && (
        <div className="m4-pause-callout">
          <div className="m4-pause-badge">AP REACHED TERMINAL</div>
          <p className="m4-concept">
            The action potential has arrived! Voltage-gated <strong>Ca²⁺ channels</strong> now
            open. Calcium floods in, and this calcium influx will trigger vesicle fusion
            in the next step.
          </p>
        </div>
      )}

      <div className="m4-ca-toggle">
        <label className="m4-toggle-label">
          <input
            type="checkbox"
            checked={caBlocked}
            onChange={(e) => setCaBlocked(e.target.checked)}
          />
          <span className="m4-toggle-text">Block Ca²⁺ channels</span>
        </label>
        {caBlocked && (
          <div className="m4-toggle-info">
            Without calcium entry, <strong>no neurotransmitter is released</strong>.
            This is how some anesthetics and toxins work — they block calcium channels
            at the terminal.
          </div>
        )}
      </div>

      <div className="m4-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
