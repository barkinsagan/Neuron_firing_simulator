import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

const REFLEX_STEPS = [
  {
    title: '1. Stimulus',
    desc: 'Doctor taps the patellar tendon with a reflex hammer. The quadriceps muscle stretches.',
    node: 'hammer',
  },
  {
    title: '2. Sensory Neuron',
    desc: 'Muscle spindle detects the stretch and fires an action potential along the sensory neuron to the spinal cord.',
    node: 'sensory',
  },
  {
    title: '3. Excitatory Synapse',
    desc: 'Sensory neuron synapses directly onto the motor neuron in the spinal cord. EPSP triggers an AP.',
    node: 'synapse',
  },
  {
    title: '4. Motor Neuron Fires',
    desc: 'Motor neuron fires an action potential back to the quadriceps muscle.',
    node: 'motor',
  },
  {
    title: '5. Muscle Contracts',
    desc: 'Quadriceps contracts — the leg kicks out! Total time: ~30-50 milliseconds.',
    node: 'muscle',
  },
  {
    title: '6. Reciprocal Inhibition',
    desc: 'Simultaneously, an inhibitory interneuron relaxes the hamstring (antagonist muscle), allowing smooth extension.',
    node: 'inhibit',
  },
]

export default function Module5_StretchReflex({ onAdvance }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [autoPlaying, setAutoPlaying] = useState(false)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  useEffect(() => {
    if (!autoPlaying) return
    if (currentStep >= REFLEX_STEPS.length - 1) {
      setAutoPlaying(false)
      return
    }
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), 1500)
    return () => clearTimeout(timer)
  }, [autoPlaying, currentStep])

  const playAll = () => {
    setCurrentStep(0)
    setAutoPlaying(true)
  }

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">From Neurons to Behavior: The Stretch Reflex</h3>

      <p className="m5-narration">
        Let's see a complete functional circuit. A doctor taps your knee with a hammer.
        Your leg kicks out. Here's the circuit that makes it happen —
        in just <strong>30–50 milliseconds</strong>.
      </p>

      {/* Reflex stepper */}
      <div className="m5-reflex-stepper">
        {REFLEX_STEPS.map((step, i) => (
          <div
            key={i}
            className={`m5-reflex-step ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
          >
            <div className="m5-reflex-num">
              {i < currentStep ? '\u2713' : i + 1}
            </div>
            <div className="m5-reflex-content">
              <div className="m5-reflex-title">{step.title}</div>
              {(i === currentStep || i < currentStep) && (
                <p className="m5-reflex-desc">{step.desc}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="m5-action-center">
        {currentStep < REFLEX_STEPS.length - 1 && !autoPlaying && (
          <>
            <button
              className="m5-action-btn m5-action-btn--primary"
              onClick={() => setCurrentStep((s) => Math.min(s + 1, REFLEX_STEPS.length - 1))}
            >
              Next Step
            </button>
            <button
              className="m5-action-btn m5-action-btn--secondary"
              onClick={playAll}
            >
              Auto-Play
            </button>
          </>
        )}
        {(currentStep >= REFLEX_STEPS.length - 1 || (!autoPlaying && currentStep > 0)) && (
          <button
            className="m5-action-btn m5-action-btn--reset"
            onClick={() => { setCurrentStep(0); setAutoPlaying(false) }}
          >
            Replay
          </button>
        )}
      </div>

      {currentStep >= REFLEX_STEPS.length - 1 && (
        <div className="m5-key-concept">
          <strong>Notice:</strong> This reflex doesn't involve the brain at all! It's a
          spinal circuit — faster than conscious awareness. By the time you notice
          the tap, your leg has already moved. This is automatic postural control.
        </div>
      )}

      <div className="m5-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
