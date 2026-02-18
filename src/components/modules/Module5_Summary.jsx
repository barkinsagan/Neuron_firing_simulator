import { useEffect } from 'react'
import useStore from '../../lib/store'

const TAKEAWAYS = [
  'Spatial summation: Multiple inputs add together',
  'Temporal summation: Rapid inputs accumulate over time',
  'Neurons integrate excitation and inhibition to decide',
  'Convergence: Many inputs → one neuron (integration)',
  'Divergence: One input → many neurons (broadcast)',
  'Feedforward excitation: Signal relay chains',
  'Feedback inhibition: Self-limiting stability',
  'Lateral inhibition: Contrast enhancement and edge detection',
  'Circuits perform computation — from reflexes to consciousness',
]

const FUNCTIONS = [
  { region: 'Visual cortex', fn: 'Pattern recognition' },
  { region: 'Cerebellum', fn: 'Motor coordination' },
  { region: 'Hippocampus', fn: 'Memory formation' },
  { region: 'Amygdala', fn: 'Emotional responses' },
  { region: 'Cortical networks', fn: 'Consciousness itself' },
]

export default function Module5_Summary({ onAdvance }) {
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    if (window.__cameraAnimateTo) {
      window.__cameraAnimateTo({
        position: [2, 5, 16],
        target: [2, 1, 0],
      })
    }
  }, [])

  return (
    <div className="m5-step m5-step--summary">
      <h3 className="m5-step-title">Module 5 Complete: Neural Circuits</h3>

      <p className="m5-narration" style={{ textAlign: 'center' }}>
        Individual neurons are simple: they sum inputs and fire if threshold is reached.
        But when connected in circuits, neurons create <strong>sophisticated computation</strong>.
      </p>

      {/* Takeaways */}
      <div className="m5-takeaways">
        {TAKEAWAYS.map((t, i) => (
          <div key={i} className="m5-takeaway">
            <span className="m5-takeaway-check">&#10003;</span>
            <span className="m5-takeaway-text">{t}</span>
          </div>
        ))}
      </div>

      {/* Circuit functions */}
      <div className="m5-functions-box">
        <div className="m5-functions-title">Circuits in Action</div>
        <div className="m5-functions-grid">
          {FUNCTIONS.map((f, i) => (
            <div key={i} className="m5-function-item">
              <span className="m5-function-region">{f.region}</span>
              <span className="m5-function-arrow">→</span>
              <span className="m5-function-fn">{f.fn}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="m5-big-picture">
        <p>
          From single ion channels to neural circuits — you now understand how
          the brain computes. Every thought, memory, and action emerges from
          these fundamental building blocks working together.
        </p>
      </div>

      <div className="m5-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue to Conclusion
        </button>
      </div>
    </div>
  )
}
