import { useRef, useCallback } from 'react'
import useStore from '../lib/store'
import { getVoltageAtTime, getPhaseAtTime, DURATION } from '../lib/actionPotentialSimulation'

// Timeline represents the full animation sequence:
// 0-40%   = presynaptic AP (DURATION=4ms)
// 40-60%  = synaptic transmission (~1.5s real)
// 60-100% = postsynaptic AP (DURATION=4ms)
const EVENTS = [
  { pct: 0, label: 'Rest' },
  { pct: 12.5, label: 'Threshold' },
  { pct: 25, label: 'Peak' },
  { pct: 40, label: 'Synapse' },
  { pct: 60, label: 'Post AP' },
  { pct: 100, label: 'Done' },
]

function getTimelineProgress() {
  const { isPlaying, currentTime, synapseActive, synapseTime, postPlaying, postTime } = useStore.getState()

  if (postPlaying) {
    // Postsynaptic phase: 60-100%
    return 60 + (postTime / DURATION) * 40
  }
  if (synapseActive && !isPlaying) {
    // Synapse phase: 40-60%
    return 50 // approximate mid-synapse
  }
  if (isPlaying || currentTime > 0) {
    // Presynaptic phase: 0-40%
    return (currentTime / DURATION) * 40
  }
  return 0
}

export default function Timeline() {
  const sliderRef = useRef()
  const isDragging = useRef(false)

  const progress = useStore((s) => {
    if (s.postPlaying) return 60 + (s.postTime / DURATION) * 40
    if (s.synapseActive && !s.isPlaying) return 50
    if (s.isPlaying || s.currentTime > 0) return (s.currentTime / DURATION) * 40
    return 0
  })

  const handleScrub = useCallback((e) => {
    const pct = parseFloat(e.target.value)
    isDragging.current = true

    // Pause any running animation
    useStore.setState({ isPlaying: false, postPlaying: false })

    if (pct <= 40) {
      // Presynaptic phase
      const simTime = (pct / 40) * DURATION
      const voltage = getVoltageAtTime(simTime)
      const phase = getPhaseAtTime(simTime)
      useStore.setState({
        currentTime: simTime,
        voltage,
        phase,
        synapseActive: false,
        synapseTime: 0,
        postVoltage: -70,
        postPhase: 'resting',
        postTime: 0,
      })
    } else if (pct <= 60) {
      // Synapse phase — show presynaptic complete, synapse active
      useStore.setState({
        currentTime: DURATION,
        voltage: -70,
        phase: 'resting',
        synapseActive: true,
        postVoltage: -70,
        postPhase: 'resting',
        postTime: 0,
      })
    } else {
      // Postsynaptic phase
      const postSimTime = ((pct - 60) / 40) * DURATION
      const postVoltage = getVoltageAtTime(postSimTime)
      const postPhase = getPhaseAtTime(postSimTime)
      useStore.setState({
        currentTime: DURATION,
        voltage: -70,
        phase: 'resting',
        synapseActive: true,
        postTime: postSimTime,
        postVoltage,
        postPhase,
      })
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div className="timeline">
      <div className="timeline-events">
        {EVENTS.map((evt) => (
          <div
            key={evt.label}
            className="timeline-event"
            style={{ left: `${evt.pct}%` }}
          >
            <span className="timeline-tick" />
            <span className="timeline-event-label">{evt.label}</span>
          </div>
        ))}
      </div>
      <input
        ref={sliderRef}
        type="range"
        className="timeline-slider"
        min={0}
        max={100}
        step={0.5}
        value={progress}
        onChange={handleScrub}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      />
    </div>
  )
}
