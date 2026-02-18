import useStore from '../../lib/store'

const JOURNEY_MODULES = [
  {
    id: 1,
    title: 'The Resting Neuron',
    icon: '⚡',
    iconLabel: '-70mV',
    time: '5–7 min',
    description: "Discover why neurons are always 'charged and ready'",
    color: '#4caf50',
  },
  {
    id: 2,
    title: 'The Action Potential',
    icon: '🔥',
    iconLabel: 'Spike',
    time: '8–10 min',
    description: 'Watch a neuron fire and see the voltage spike',
    color: '#ff9800',
  },
  {
    id: 3,
    title: 'Propagation Along the Axon',
    icon: '〰️',
    iconLabel: 'Wave',
    time: '5–7 min',
    description: 'Follow the signal as it speeds down the axon',
    color: '#2196f3',
  },
  {
    id: 4,
    title: 'The Synapse',
    icon: '🔗',
    iconLabel: 'Gap',
    time: '10–12 min',
    description: 'See how signals jump from one neuron to another',
    color: '#9c27b0',
  },
  {
    id: 5,
    title: 'Neural Circuits',
    icon: '🧠',
    iconLabel: 'Network',
    time: '8–10 min',
    description: 'Learn how neurons work together as networks',
    color: '#e91e63',
  },
]

export default function Module0_Preview({ onAdvance }) {
  const goToModule = useStore((s) => s.goToModule)
  const exitEducationalMode = useStore((s) => s.exitEducationalMode)
  const moduleProgress = useStore((s) => s.moduleProgress)

  return (
    <div className="m0-preview">
      <h2 className="m0-preview-title">The Journey Ahead</h2>

      <div className="m0-preview-cards">
        {JOURNEY_MODULES.map((mod) => {
          const done = moduleProgress[mod.id]
          return (
            <button
              key={mod.id}
              className={`m0-card ${done ? 'completed' : ''}`}
              onClick={() => goToModule(mod.id)}
              style={{ '--card-accent': mod.color }}
            >
              <div className="m0-card-icon">{mod.icon}</div>
              <div className="m0-card-number">Module {mod.id}</div>
              <div className="m0-card-title">{mod.title}</div>
              <div className="m0-card-desc">{mod.description}</div>
              <div className="m0-card-time">{mod.time}</div>
              {done && <div className="m0-card-badge">Completed</div>}
            </button>
          )
        })}
      </div>

      <div className="m0-preview-footer">
        <p className="m0-preview-total">
          Total estimated time: 40–45 minutes
        </p>
        <p className="m0-preview-note">
          You can pause, rewind, or skip ahead at any time
        </p>
      </div>

      <div className="m0-preview-actions">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Let's Go!
        </button>
        <button className="m0-btn-tertiary" onClick={exitEducationalMode}>
          I'll explore on my own
        </button>
      </div>
    </div>
  )
}
