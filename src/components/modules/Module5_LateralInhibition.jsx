import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

const BASE_ACTIVITY = [20, 30, 50, 90, 95, 100, 95, 90, 50, 30, 20]

export default function Module5_LateralInhibition({ onAdvance }) {
  const [strength, setStrength] = useState(50)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  // Apply lateral inhibition: subtract neighbors' activity scaled by strength
  const inhibited = BASE_ACTIVITY.map((val, i) => {
    const left = i > 0 ? BASE_ACTIVITY[i - 1] : 0
    const right = i < BASE_ACTIVITY.length - 1 ? BASE_ACTIVITY[i + 1] : 0
    const avgNeighbor = (left + right) / 2
    const inhibition = (avgNeighbor * strength) / 100
    return Math.max(0, val - inhibition * 0.5)
  })

  const maxInhib = Math.max(...inhibited)

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">Circuit Motif: Lateral Inhibition</h3>

      <p className="m5-narration">
        The most active neuron <strong>suppresses its neighbors</strong> through
        inhibitory interneurons. This enhances contrast and sharpens signals —
        making the "winner" stand out.
      </p>

      {/* Bar chart comparison */}
      <div className="m5-lateral-chart">
        <div className="m5-lateral-row">
          <div className="m5-lateral-label">Raw input</div>
          <div className="m5-lateral-bars">
            {BASE_ACTIVITY.map((val, i) => (
              <div key={i} className="m5-lateral-bar-wrap">
                <div
                  className="m5-lateral-bar m5-lateral-bar--raw"
                  style={{ height: `${val * 0.6}px` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="m5-lateral-row">
          <div className="m5-lateral-label">After inhibition</div>
          <div className="m5-lateral-bars">
            {inhibited.map((val, i) => (
              <div key={i} className="m5-lateral-bar-wrap">
                <div
                  className="m5-lateral-bar m5-lateral-bar--inhibited"
                  style={{
                    height: `${(val / maxInhib) * 60}px`,
                    opacity: val / maxInhib < 0.1 ? 0.3 : 1,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strength slider */}
      <div className="m5-lateral-control">
        <label className="m5-lateral-control-label">Lateral Inhibition Strength</label>
        <input
          type="range"
          min="0"
          max="100"
          value={strength}
          onChange={(e) => setStrength(parseInt(e.target.value))}
          className="m5-lateral-slider"
        />
        <span className="m5-lateral-value">{strength}%</span>
      </div>

      <div className="m5-lateral-hint">
        {strength === 0 && 'No inhibition — all neurons respond equally to their input'}
        {strength > 0 && strength < 40 && 'Mild sharpening — edges become slightly more distinct'}
        {strength >= 40 && strength < 70 && 'Good contrast — the peak stands out clearly from neighbors'}
        {strength >= 70 && 'Strong inhibition — only the peak neurons survive, others are silenced'}
      </div>

      <div className="m5-motif-info">
        <div className="m5-motif-function">
          <strong>Function:</strong> Edge detection, contrast enhancement, winner-take-all
          competition.
        </div>
        <div className="m5-motif-example">
          <strong>In your retina:</strong> Lateral inhibition makes edges look sharper.
          This is why you see enhanced contrast at boundaries — the famous
          <em> Mach bands</em> optical illusion.
        </div>
      </div>

      <div className="m5-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
