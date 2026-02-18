import { useState } from 'react'
import useStore from '../../lib/store'

const FEATURES = [
  { icon: '🔬', text: 'Understand neuron anatomy and function' },
  { icon: '⚡', text: 'See action potentials in real-time' },
  { icon: '🔗', text: 'Explore synaptic transmission' },
  { icon: '🧠', text: 'Learn how circuits process information' },
]

const MODULE_OPTIONS = [
  { id: 1, label: 'Module 1: The Resting Neuron' },
  { id: 2, label: 'Module 2: The Action Potential' },
  { id: 3, label: 'Module 3: Propagation Along the Axon' },
  { id: 4, label: 'Module 4: The Synapse' },
  { id: 5, label: 'Module 5: Neural Circuits' },
]

export default function Module0_Welcome({ onAdvance }) {
  const goToModule = useStore((s) => s.goToModule)
  const exitEducationalMode = useStore((s) => s.exitEducationalMode)
  const [showSkipMenu, setShowSkipMenu] = useState(false)

  return (
    <div className="m0-welcome">
      <div className="m0-welcome-hero">
        <h1 className="m0-welcome-title">Journey Through a Neuron</h1>
        <p className="m0-welcome-subtitle">
          From Electrical Signals to Synaptic Transmission
        </p>
      </div>

      <p className="m0-welcome-intro">
        Welcome! In this guided tour, you'll discover how neurons communicate
        through a fascinating combination of electrical and chemical signals.
        You'll follow a single signal as it travels from one neuron to another,
        seeing the mechanisms that make thought, movement, and sensation possible.
      </p>

      <div className="m0-welcome-features">
        {FEATURES.map((f, i) => (
          <div key={i} className="m0-feature-item">
            <span className="m0-feature-icon">{f.icon}</span>
            <span className="m0-feature-text">{f.text}</span>
          </div>
        ))}
      </div>

      <div className="m0-welcome-time">
        <span className="m0-time-label">Estimated Time</span>
        <span className="m0-time-value">40–45 minutes</span>
        <span className="m0-time-note">Or explore individual modules at your own pace</span>
      </div>

      <div className="m0-welcome-actions">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Begin Tour
        </button>

        <div className="m0-skip-wrapper">
          <button
            className="m0-btn-secondary"
            onClick={() => setShowSkipMenu(!showSkipMenu)}
          >
            Skip to Module...
          </button>
          {showSkipMenu && (
            <div className="m0-skip-menu">
              {MODULE_OPTIONS.map((mod) => (
                <button
                  key={mod.id}
                  className="m0-skip-option"
                  onClick={() => goToModule(mod.id)}
                >
                  {mod.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="m0-btn-tertiary" onClick={exitEducationalMode}>
          Free Exploration
        </button>
      </div>
    </div>
  )
}
