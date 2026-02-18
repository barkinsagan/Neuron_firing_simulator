import useStore from '../lib/store'

export default function PlaybackControls() {
  const isPlaying = useStore((s) => s.isPlaying)
  const postPlaying = useStore((s) => s.postPlaying)
  const synapseActive = useStore((s) => s.synapseActive)
  const play = useStore((s) => s.play)
  const pause = useStore((s) => s.pause)
  const reset = useStore((s) => s.reset)
  const phase = useStore((s) => s.phase)
  const voltage = useStore((s) => s.voltage)
  const postVoltage = useStore((s) => s.postVoltage)
  const postPhase = useStore((s) => s.postPhase)

  const anyActive = isPlaying || synapseActive || postPlaying

  return (
    <div className="playback-controls">
      <div className="playback-status">
        <div className="neuron-status">
          <span className="neuron-label pre">Pre</span>
          <span className="phase-label">{phase}</span>
          <span className="voltage-readout">{Math.round(voltage)} mV</span>
        </div>
        <div className="neuron-status">
          <span className="neuron-label post">Post</span>
          <span className="phase-label">{postPhase}</span>
          <span className="voltage-readout">{Math.round(postVoltage)} mV</span>
        </div>
      </div>
      <div className="playback-buttons">
        {anyActive ? (
          <button onClick={pause} className="btn btn-pause" title="Pause">
            &#9646;&#9646;
          </button>
        ) : (
          <button onClick={play} className="btn btn-play" title="Play">
            &#9654;
          </button>
        )}
        <button onClick={reset} className="btn btn-reset" title="Reset">
          &#8634;
        </button>
      </div>
    </div>
  )
}
