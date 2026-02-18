import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

export default function Module4_Inhibitory({ onAdvance }) {
  const [showIPSP, setShowIPSP] = useState(false)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">Inhibition: The Other Side</h3>

      <p className="m4-narration">
        Not all synapses are excitatory. <strong>Inhibitory</strong> synapses release
        NTs like GABA that make the postsynaptic neuron <em>less</em> likely to fire.
      </p>

      {/* EPSP vs IPSP toggle */}
      <div className="m4-inhibit-toggle">
        <button
          className={`m4-toggle-btn ${!showIPSP ? 'm4-toggle-btn--active' : ''}`}
          onClick={() => setShowIPSP(false)}
        >
          EPSP (Excitatory)
        </button>
        <button
          className={`m4-toggle-btn ${showIPSP ? 'm4-toggle-btn--active' : ''}`}
          onClick={() => setShowIPSP(true)}
        >
          IPSP (Inhibitory)
        </button>
      </div>

      <div className={`m4-signal-display ${showIPSP ? 'm4-signal-display--ipsp' : 'm4-signal-display--epsp'}`}>
        <div className="m4-signal-bar">
          <div className="m4-signal-rest-line" />
          <div className={`m4-signal-curve ${showIPSP ? 'm4-signal-curve--down' : 'm4-signal-curve--up'}`} />
        </div>
        <div className="m4-signal-info">
          {showIPSP ? (
            <>
              <div className="m4-signal-title" style={{ color: '#2196f3' }}>IPSP — Inhibitory</div>
              <p className="m4-signal-desc">
                GABA opens <strong>Cl⁻ channels</strong> or <strong>K⁺ channels</strong>,
                making the inside more negative (hyperpolarization). This moves the
                voltage <em>away</em> from threshold.
              </p>
              <div className="m4-signal-change">-70 mV → -75 mV</div>
            </>
          ) : (
            <>
              <div className="m4-signal-title" style={{ color: '#4caf50' }}>EPSP — Excitatory</div>
              <p className="m4-signal-desc">
                Glutamate opens <strong>Na⁺ channels</strong>, making the inside less
                negative (depolarization). This moves the voltage <em>toward</em> threshold.
              </p>
              <div className="m4-signal-change">-70 mV → -60 mV</div>
            </>
          )}
        </div>
      </div>

      <div className="m4-clinical-note">
        <div className="m4-clinical-header">Clinical Connection</div>
        <p className="m4-clinical-text">
          <strong>Epilepsy</strong> can result from too little inhibition — without
          enough GABA signaling, neurons fire uncontrollably. Many anti-epileptic
          drugs work by enhancing GABA's inhibitory effects.
        </p>
      </div>

      <div className="m4-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
