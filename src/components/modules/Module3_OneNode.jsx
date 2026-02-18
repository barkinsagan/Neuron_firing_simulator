import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'
import { getVoltageAtTime, DURATION } from '../../lib/actionPotentialSimulation'

const EDU_SPEED = 0.04
// Focus on node 3 (middle of axon, nodeT ≈ 0.5)
const FOCUS_NODE_T = 0.5
const ARRIVAL_TIME = FOCUS_NODE_T * DURATION // 2ms

export default function Module3_OneNode({ onAdvance }) {
  const [phase, setPhase] = useState('waiting')
  const [playing, setPlaying] = useState(false)
  const [localV, setLocalV] = useState(-70)
  const currentTime = useStore((s) => s.currentTime)
  const prevSpeedRef = useRef(1)

  // Start paused just before wave arrives at this node
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(ARRIVAL_TIME - 0.3)
    useStore.getState().setSpeed(EDU_SPEED)
    // Zoom to middle of axon
    if (window.__cameraAnimateTo) {
      window.__cameraAnimateTo({
        position: [-1, 1.2, 2.5],
        target: [-1, 1, 0],
      })
    }
    return () => {
      useStore.getState().pause()
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  // Track local voltage at this node
  useEffect(() => {
    const localTime = currentTime - ARRIVAL_TIME
    if (localTime < 0) {
      setLocalV(-70)
      setPhase('waiting')
    } else if (localTime > DURATION) {
      setLocalV(-70)
      setPhase('done')
    } else {
      const v = getVoltageAtTime(Math.min(localTime + 0.5, DURATION))
      setLocalV(v)
      if (v > 20) setPhase('peak')
      else if (v > -55) setPhase('depolarizing')
      else if (v < -75) setPhase('hyperpolarized')
      else setPhase(localTime > 0.1 ? 'recovering' : 'threshold')
    }
  }, [currentTime])

  // Auto-pause at key moments
  useEffect(() => {
    if (!playing) return
    const localTime = currentTime - ARRIVAL_TIME
    // Pause at threshold (-55mV)
    if (phase === 'threshold' && localTime > 0 && localTime < 0.3) {
      // Let it continue — just passed threshold
    }
    // Pause at peak
    if (phase === 'peak' && localTime > 0.8 && localTime < 1.2) {
      useStore.getState().pause()
      setPlaying(false)
    }
  }, [phase, currentTime, playing])

  const watchNode = () => {
    setPlaying(true)
    useStore.getState().setCurrentTime(ARRIVAL_TIME - 0.2)
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 200)
  }

  const continueAfterPeak = () => {
    setPlaying(true)
    useStore.getState().setSpeed(EDU_SPEED)
    useStore.getState().play()
  }

  const vColor =
    localV > 20 ? '#f44336' : localV > -55 ? '#ff9800' : localV < -75 ? '#1565c0' : '#81c784'

  const phaseLabels = {
    waiting: 'Waiting for wave...',
    threshold: 'THRESHOLD REACHED',
    depolarizing: 'Na+ FLOODING IN',
    peak: 'PEAK — Na+ INACTIVATING',
    hyperpolarized: 'K+ REPOLARIZING',
    recovering: 'Recovering...',
    done: 'Ready to fire again',
  }

  return (
    <div className="m3-step">
      <h3 className="m3-step-title">Up Close: One Node of Ranvier</h3>

      <p className="m3-narration">
        Nodes of Ranvier are the <strong>only places</strong> where action potentials
        actually regenerate. Between nodes, the myelinated segments just passively
        conduct current forward.
      </p>

      {/* Node voltage display */}
      <div className="m3-node-detail">
        <div className="m3-node-detail-header">
          <span className="m3-node-detail-label">Node 3 — Local Voltage</span>
          <span className="m3-node-detail-phase" style={{ color: vColor }}>
            {phaseLabels[phase]}
          </span>
        </div>
        <div className="m3-node-voltage-big" style={{ color: vColor }}>
          {localV.toFixed(0)} mV
        </div>
      </div>

      {/* Sequence steps */}
      <div className="m3-sequence">
        <div className={`m3-seq-step ${phase === 'waiting' || phase === 'threshold' ? 'active' : (localV > -55 || phase === 'done') ? 'done' : ''}`}>
          <span className="m3-seq-num">1</span>
          <span className="m3-seq-text">Current arrives from previous node</span>
        </div>
        <div className={`m3-seq-step ${phase === 'depolarizing' ? 'active' : localV > 20 || phase === 'hyperpolarized' || phase === 'done' ? 'done' : ''}`}>
          <span className="m3-seq-num">2</span>
          <span className="m3-seq-text">Na+ channels OPEN → depolarize to +30mV</span>
        </div>
        <div className={`m3-seq-step ${phase === 'peak' ? 'active' : phase === 'hyperpolarized' || phase === 'done' ? 'done' : ''}`}>
          <span className="m3-seq-num">3</span>
          <span className="m3-seq-text">Current races under myelin to next node</span>
        </div>
        <div className={`m3-seq-step ${phase === 'hyperpolarized' ? 'active' : phase === 'done' ? 'done' : ''}`}>
          <span className="m3-seq-num">4</span>
          <span className="m3-seq-text">K+ channels open → repolarize to -70mV</span>
        </div>
      </div>

      {/* Controls */}
      <div className="m3-controls-row">
        {phase === 'waiting' && (
          <button className="m3-action-btn m3-action-btn--primary" onClick={watchNode}>
            Watch Wave Arrive at This Node
          </button>
        )}
        {phase === 'peak' && !playing && (
          <div className="m3-pause-callout">
            <div className="m3-pause-badge">PAUSED AT PEAK</div>
            <p className="m3-hint">
              Na+ channels just inactivated. Current is now racing under the
              myelin sheath toward the next node.
            </p>
            <button className="m3-action-btn" onClick={continueAfterPeak}>
              Continue Watching
            </button>
          </div>
        )}
        {(phase === 'done' || phase === 'recovering') && (
          <div>
            <p className="m3-hint" style={{ color: '#a5d6a7' }}>
              Node complete! It's now in its refractory period and will
              recover shortly — ready to fire again.
            </p>
            <button className="m3-action-btn" onClick={watchNode}>
              Replay
            </button>
          </div>
        )}
      </div>

      <div className="m3-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
