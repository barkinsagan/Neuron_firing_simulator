import useStore from '../lib/store'

const PHASE_INFO = {
  resting: {
    label: 'Resting',
    color: '#2196f3',
    description: 'Neuron at resting potential (-70 mV). Na+/K+ pump maintains ion gradient.',
  },
  depolarizing: {
    label: 'Depolarizing',
    color: '#9c27b0',
    description: 'Na+ channels open, sodium ions rush inward. Membrane potential rises rapidly.',
  },
  repolarizing: {
    label: 'Repolarizing',
    color: '#ff9800',
    description: 'K+ channels open, potassium ions flow outward. Voltage returns toward resting.',
  },
  hyperpolarizing: {
    label: 'Undershoot',
    color: '#f44336',
    description: 'K+ channels slow to close, voltage briefly dips below resting potential.',
  },
}

export default function PhaseDisplay() {
  const phase = useStore((s) => s.phase)
  const postPhase = useStore((s) => s.postPhase)
  const synapseActive = useStore((s) => s.synapseActive)
  const postPlaying = useStore((s) => s.postPlaying)
  const isPlaying = useStore((s) => s.isPlaying)

  // Determine the most relevant phase to display
  let displayPhase
  let context
  if (postPlaying) {
    displayPhase = PHASE_INFO[postPhase] || PHASE_INFO.resting
    context = 'Postsynaptic Response'
  } else if (synapseActive && !isPlaying) {
    displayPhase = {
      label: 'Synaptic Transmission',
      color: '#e91e63',
      description: 'Neurotransmitters released from vesicles, diffusing across the synaptic cleft to bind postsynaptic receptors.',
    }
    context = 'Synapse'
  } else {
    displayPhase = PHASE_INFO[phase] || PHASE_INFO.resting
    context = 'Presynaptic Neuron'
  }

  return (
    <div className="phase-display">
      <div className="phase-context">{context}</div>
      <div className="phase-badge" style={{ borderColor: displayPhase.color }}>
        <span className="phase-dot" style={{ backgroundColor: displayPhase.color }} />
        {displayPhase.label}
      </div>
      <div className="phase-description">{displayPhase.description}</div>
    </div>
  )
}
