import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

const TRIALS = [
  {
    name: 'Only Excitation',
    excitatory: 5,
    inhibitory: 0,
    excMv: 15,
    inhMv: 0,
    result: -55,
    fires: true,
  },
  {
    name: 'Excitation + Inhibition',
    excitatory: 5,
    inhibitory: 2,
    excMv: 15,
    inhMv: -10,
    result: -65,
    fires: false,
  },
  {
    name: 'Strong Inhibition',
    excitatory: 5,
    inhibitory: 4,
    excMv: 15,
    inhMv: -20,
    result: -75,
    fires: false,
  },
]

export default function Module5_Decision({ onAdvance }) {
  const [activeTrial, setActiveTrial] = useState(0)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  const trial = TRIALS[activeTrial]
  const netMv = trial.excMv + trial.inhMv
  const vColor = trial.fires ? '#ff9800' : '#81c784'

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">Excitation + Inhibition = Decision</h3>

      <p className="m5-narration">
        Neurons constantly balance <strong>excitation</strong> and <strong>inhibition</strong>.
        The net sum determines whether the neuron fires.
      </p>

      {/* Trial selector */}
      <div className="m5-trial-tabs">
        {TRIALS.map((t, i) => (
          <button
            key={i}
            className={`m5-trial-tab ${i === activeTrial ? 'm5-trial-tab--active' : ''}`}
            onClick={() => setActiveTrial(i)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Balance visualization */}
      <div className="m5-balance-viz">
        <div className="m5-balance-side m5-balance-side--exc">
          <div className="m5-balance-label">Excitatory</div>
          <div className="m5-balance-arrows">
            {Array.from({ length: trial.excitatory }).map((_, i) => (
              <div key={i} className="m5-arrow m5-arrow--up">↑</div>
            ))}
          </div>
          <div className="m5-balance-value" style={{ color: '#4caf50' }}>
            +{trial.excMv} mV
          </div>
        </div>

        <div className="m5-balance-divider">
          <div className="m5-balance-net" style={{ color: vColor }}>
            Net: {netMv > 0 ? '+' : ''}{netMv} mV
          </div>
        </div>

        <div className="m5-balance-side m5-balance-side--inh">
          <div className="m5-balance-label">Inhibitory</div>
          <div className="m5-balance-arrows">
            {Array.from({ length: trial.inhibitory }).map((_, i) => (
              <div key={i} className="m5-arrow m5-arrow--down">↓</div>
            ))}
            {trial.inhibitory === 0 && <span className="m5-no-input">none</span>}
          </div>
          <div className="m5-balance-value" style={{ color: '#f44336' }}>
            {trial.inhMv === 0 ? '0 mV' : `${trial.inhMv} mV`}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className={`m5-decision-result ${trial.fires ? 'm5-decision-result--fires' : 'm5-decision-result--silent'}`}>
        <div className="m5-decision-voltage">
          -70 + ({netMv > 0 ? '+' : ''}{netMv}) = <strong>{trial.result} mV</strong>
        </div>
        <div className="m5-decision-outcome">
          {trial.fires ? '✓ FIRES — reached threshold!' : '✗ Does NOT fire — below threshold'}
        </div>
      </div>

      <div className="m5-key-concept">
        <strong>Key insight:</strong> Inhibition isn't just "turning off" — it's active
        control. It can veto excitation and provide precise timing. In your motor cortex,
        excitatory neurons say "contract muscle" while inhibitory neurons say "relax
        opponent muscle." Both are needed for smooth movement.
      </div>

      <div className="m5-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
