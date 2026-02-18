import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

const COMPARISON = [
  {
    feature: 'Speed',
    electrical: 'Very fast (<0.1 ms)',
    chemical: 'Slower (0.5–5 ms)',
  },
  {
    feature: 'Direction',
    electrical: 'Bidirectional',
    chemical: 'One-way only',
  },
  {
    feature: 'Signal modification',
    electrical: 'None — pass-through',
    chemical: 'Can amplify, inhibit, or modulate',
  },
  {
    feature: 'Plasticity',
    electrical: 'Fixed',
    chemical: 'Can strengthen or weaken (learning!)',
  },
  {
    feature: 'Where found',
    electrical: 'Heart, some brain regions',
    chemical: 'Most of the nervous system',
  },
]

export default function Module4_WhyChemical({ onAdvance }) {
  const [pollAnswer, setPollAnswer] = useState(null)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">Why Chemical Signaling?</h3>

      <p className="m4-narration">
        Neurons <em>could</em> use direct electrical connections (gap junctions).
        Some do! But most synapses are <strong>chemical</strong> — and there's a good reason.
      </p>

      <div className="m4-compare-table">
        <div className="m4-compare-row m4-compare-row--header">
          <div className="m4-compare-cell">Feature</div>
          <div className="m4-compare-cell m4-compare-cell--elec">Electrical</div>
          <div className="m4-compare-cell m4-compare-cell--chem">Chemical</div>
        </div>
        {COMPARISON.map((row, i) => (
          <div key={i} className="m4-compare-row">
            <div className="m4-compare-cell m4-compare-cell--feature">{row.feature}</div>
            <div className="m4-compare-cell m4-compare-cell--elec">{row.electrical}</div>
            <div className="m4-compare-cell m4-compare-cell--chem">{row.chemical}</div>
          </div>
        ))}
      </div>

      <div className="m4-poll">
        <p className="m4-poll-question">
          Which advantage do you think matters most for learning and memory?
        </p>
        <div className="m4-poll-options">
          {['Speed', 'One-way signaling', 'Signal modification', 'Plasticity'].map((opt) => (
            <button
              key={opt}
              className={`m4-poll-btn ${pollAnswer === opt ? 'm4-poll-btn--selected' : ''}`}
              onClick={() => setPollAnswer(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        {pollAnswer && (
          <div className="m4-poll-feedback">
            {pollAnswer === 'Plasticity' ? (
              <p><strong>Exactly!</strong> Plasticity — the ability to strengthen or weaken connections — is the physical basis of learning and memory.</p>
            ) : (
              <p>Good thought! But <strong>plasticity</strong> is the key — the ability to change connection strength is how we learn and form memories.</p>
            )}
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
