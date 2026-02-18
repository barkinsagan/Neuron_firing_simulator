import { useState, useEffect } from 'react'
import useStore from '../../lib/store'

const CHAIN = [
  { id: 'A', label: 'Neuron A', example: 'Retina' },
  { id: 'B', label: 'Neuron B', example: 'Thalamus' },
  { id: 'C', label: 'Neuron C', example: 'Visual Cortex' },
]

export default function Module5_Feedforward({ onAdvance }) {
  const [activeNode, setActiveNode] = useState(-1)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  const runAnimation = () => {
    setAnimating(true)
    setActiveNode(0)
    setTimeout(() => setActiveNode(1), 800)
    setTimeout(() => setActiveNode(2), 1600)
    setTimeout(() => {
      setAnimating(false)
    }, 2400)
  }

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">Circuit Motif: Feedforward Excitation</h3>

      <p className="m5-narration">
        Neural circuits have recurring patterns called <strong>motifs</strong>.
        The simplest is <strong>feedforward excitation</strong> — a chain where each
        neuron activates the next.
      </p>

      {/* Chain diagram */}
      <div className="m5-chain-diagram">
        {CHAIN.map((node, i) => (
          <div key={node.id} className="m5-chain-item">
            <div className={`m5-chain-node ${activeNode >= i ? 'm5-chain-node--active' : ''}`}>
              <div className="m5-chain-letter">{node.id}</div>
            </div>
            <div className="m5-chain-info">
              <span className="m5-chain-label">{node.label}</span>
              <span className="m5-chain-example">{node.example}</span>
            </div>
            {i < CHAIN.length - 1 && (
              <div className={`m5-chain-arrow ${activeNode > i ? 'm5-chain-arrow--active' : ''}`}>
                →
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="m5-action-center">
        <button
          className="m5-action-btn m5-action-btn--primary"
          onClick={runAnimation}
          disabled={animating}
        >
          {animating ? 'Propagating...' : 'Fire the Chain'}
        </button>
      </div>

      <div className="m5-motif-info">
        <div className="m5-motif-function">
          <strong>Function:</strong> Signal transmission and amplification.
          Common in sensory pathways.
        </div>
        <div className="m5-motif-example">
          <strong>Classic example:</strong> Retina → Thalamus → Visual Cortex.
          Light information is relayed and processed at each stage.
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
