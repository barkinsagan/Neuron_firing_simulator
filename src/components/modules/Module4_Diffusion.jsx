import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.04

export default function Module4_Diffusion({ onAdvance }) {
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const prevSpeedRef = useRef(1)

  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    // Ensure synapse is active so NT particles are visible
    const state = useStore.getState()
    if (!state.synapseActive) {
      state.triggerSynapse()
    }
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">Diffusion Across the Cleft</h3>

      <p className="m4-narration">
        Once released, neurotransmitters don't travel in a straight line.
        They undergo <strong>Brownian motion</strong> — random collisions with water
        molecules push them in all directions. Despite the randomness, the short
        distance (~20 nm) means most reach the other side in <strong>&lt;1 ms</strong>.
      </p>

      {/* CSS Brownian motion demo */}
      <div className="m4-brownian-demo">
        <div className="m4-brownian-label m4-brownian-label--pre">Pre</div>
        <div className="m4-brownian-cleft" style={{ '--speed-mult': speedMultiplier }}>
          <div className="m4-brownian-particle m4-bp-1" />
          <div className="m4-brownian-particle m4-bp-2" />
          <div className="m4-brownian-particle m4-bp-3" />
          <div className="m4-brownian-particle m4-bp-4" />
          <div className="m4-brownian-particle m4-bp-5" />
          <div className="m4-brownian-particle m4-bp-6" />
        </div>
        <div className="m4-brownian-label m4-brownian-label--post">Post</div>
      </div>

      <div className="m4-speed-control">
        <label className="m4-speed-label">Animation Speed</label>
        <input
          type="range"
          min="0.25"
          max="3"
          step="0.25"
          value={speedMultiplier}
          onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
          className="m4-speed-slider"
        />
        <span className="m4-speed-value">{speedMultiplier}x</span>
      </div>

      <div className="m4-key-fact">
        <strong>Key insight:</strong> The cleft is so narrow that diffusion is nearly
        instant. But it's wide enough to allow enzymes and reuptake pumps to clear
        the signal — crucial for precise timing.
      </div>

      <div className="m4-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
