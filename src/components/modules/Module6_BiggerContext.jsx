import { useEffect } from 'react'
import useStore from '../../lib/store'

const BRAIN_STATS = [
  { label: 'Neurons', value: '~86 billion', icon: '🔬' },
  { label: 'Synapses', value: '~100 trillion', icon: '🔗' },
  { label: 'Storage capacity', value: '~1 petabyte', icon: '💾' },
  { label: 'Energy use', value: '20% of body', icon: '⚡' },
]

const CAPABILITIES = [
  { ability: 'Perception', examples: 'Sight, sound, touch' },
  { ability: 'Movement', examples: 'Walking, talking, playing instruments' },
  { ability: 'Thinking', examples: 'Problem-solving, creativity' },
  { ability: 'Memory', examples: 'Storing and recalling experiences' },
  { ability: 'Emotion', examples: 'Joy, fear, love' },
  { ability: 'Consciousness', examples: 'Self-awareness, subjective experience' },
]

export default function Module6_BiggerContext({ onAdvance }) {
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m6-step">
      <h3 className="m6-step-title">The Bigger Context</h3>

      <p className="m6-narration">
        The mechanisms you just learned about operate at an enormous scale inside
        your brain. Here's what those simple building blocks create:
      </p>

      {/* Brain stats */}
      <div className="m6-brain-stats">
        {BRAIN_STATS.map((s, i) => (
          <div key={i} className="m6-brain-stat">
            <span className="m6-brain-icon">{s.icon}</span>
            <div className="m6-brain-stat-info">
              <span className="m6-brain-stat-value">{s.value}</span>
              <span className="m6-brain-stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* What this enables */}
      <div className="m6-capabilities">
        <div className="m6-capabilities-title">What This Enables</div>
        {CAPABILITIES.map((c, i) => (
          <div key={i} className="m6-capability">
            <span className="m6-capability-name">{c.ability}</span>
            <span className="m6-capability-examples">{c.examples}</span>
          </div>
        ))}
      </div>

      {/* The mystery */}
      <div className="m6-mystery-box">
        <div className="m6-mystery-title">The Great Mystery</div>
        <p className="m6-mystery-text">
          How this electrical and chemical activity creates <strong>consciousness</strong> is
          still one of science's greatest unsolved puzzles. You now understand the
          fundamental building blocks — the rest is at the frontier of human knowledge.
        </p>
      </div>

      <div className="m6-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
