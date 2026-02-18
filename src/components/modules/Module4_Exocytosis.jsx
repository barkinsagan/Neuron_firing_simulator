import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.04

const SUBSTEPS = [
  {
    title: '1. Vesicle Docking',
    desc: 'Vesicles move to the presynaptic membrane and dock at specialized release sites called active zones.',
  },
  {
    title: '2. Calcium Binding',
    desc: 'Ca²⁺ ions bind to synaptotagmin proteins on the vesicle surface, acting as the calcium sensor.',
  },
  {
    title: '3. Membrane Fusion',
    desc: 'SNARE proteins pull the vesicle membrane and cell membrane together, creating a fusion pore.',
  },
  {
    title: '4. NT Release!',
    desc: 'Neurotransmitters spill into the synaptic cleft through the fusion pore. This is exocytosis!',
  },
]

export default function Module4_Exocytosis({ onAdvance }) {
  const [currentSub, setCurrentSub] = useState(0)
  const [released, setReleased] = useState(false)
  const prevSpeedRef = useRef(1)

  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  const advanceSubstep = () => {
    if (currentSub < SUBSTEPS.length - 1) {
      setCurrentSub(currentSub + 1)
    } else if (!released) {
      // Final substep — trigger synapse
      setReleased(true)
      useStore.getState().setSpeed(EDU_SPEED)
      useStore.getState().triggerSynapse()
    }
  }

  return (
    <div className="m4-step">
      <h3 className="m4-step-title">Exocytosis: Vesicle Release</h3>

      <p className="m4-narration">
        The calcium influx triggers a precise molecular chain reaction
        that fuses vesicles with the membrane and releases neurotransmitters.
      </p>

      <div className="m4-exo-stepper">
        {SUBSTEPS.map((sub, i) => (
          <div
            key={i}
            className={`m4-exo-step ${i === currentSub ? 'active' : ''} ${i < currentSub || released ? 'done' : ''}`}
          >
            <div className="m4-exo-num">
              {i < currentSub || released ? '\u2713' : i + 1}
            </div>
            <div className="m4-exo-content">
              <div className="m4-exo-title">{sub.title}</div>
              {(i === currentSub || i < currentSub || released) && (
                <p className="m4-exo-desc">{sub.desc}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="m4-action-center">
        {!released ? (
          <button
            className="m4-action-btn m4-action-btn--primary"
            onClick={advanceSubstep}
          >
            {currentSub < SUBSTEPS.length - 1 ? 'Next Step' : 'Release Neurotransmitters!'}
          </button>
        ) : (
          <div className="m4-release-callout">
            <div className="m4-pause-badge" style={{ background: 'rgba(255, 152, 0, 0.15)', color: '#ffcc80' }}>
              NT RELEASED
            </div>
            <p className="m4-hint">
              Watch the neurotransmitter particles flood into the synaptic cleft in the 3D view!
            </p>
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
