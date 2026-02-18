import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

export default function Module4_Binding({ onAdvance }) {
  const [bound, setBound] = useState(false)

  useEffect(() => {
    useStore.getState().pause()
  }, [])

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">Receptor Binding: Lock and Key</h3>

      <p className="m4-narration">
        The postsynaptic membrane is studded with <strong>receptor proteins</strong>.
        Each receptor only accepts specific neurotransmitters — like a lock
        that only opens with the right key.
      </p>

      {/* Lock and key animation */}
      <div className="m4-lockkey-demo">
        <div
          className={`m4-lockkey-nt ${bound ? 'm4-lockkey-nt--bound' : ''}`}
          onClick={() => setBound(!bound)}
        >
          <div className="m4-lockkey-key" />
          <span className="m4-lockkey-key-label">NT</span>
        </div>
        <div className={`m4-lockkey-receptor ${bound ? 'm4-lockkey-receptor--open' : ''}`}>
          <div className="m4-lockkey-lock" />
          <span className="m4-lockkey-lock-label">Receptor</span>
        </div>
      </div>

      <div className="m4-action-center">
        <button
          className="m4-action-btn m4-action-btn--primary"
          onClick={() => setBound(!bound)}
        >
          {bound ? 'Unbind NT' : 'Bind NT to Receptor'}
        </button>
      </div>

      {bound && (
        <div className="m4-concept">
          <p>
            When the NT binds, the receptor <strong>changes shape</strong> (conformational
            change). This opens an ion channel built into the receptor, allowing
            specific ions to flow through — directly changing the postsynaptic
            membrane voltage.
          </p>
          <p style={{ marginTop: '6px' }}>
            These are called <strong>ligand-gated ion channels</strong> — unlike the
            voltage-gated channels of the action potential, these open in response
            to a chemical signal.
          </p>
        </div>
      )}

      <div className="m4-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
