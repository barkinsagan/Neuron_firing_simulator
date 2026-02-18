import { useState, useEffect, useRef, useCallback } from 'react'
import useStore from '../../lib/store'

const REST = -70
const THRESHOLD = -55
const EPSP_SIZE = 3
const DECAY_RATE = 0.15 // mV per tick lost

export default function Module5_TemporalSummation({ onAdvance }) {
  const [frequency, setFrequency] = useState(10) // Hz
  const [running, setRunning] = useState(false)
  const [voltage, setVoltage] = useState(REST)
  const [fired, setFired] = useState(false)
  const [spikeTimes, setSpikeTimes] = useState([])
  const intervalRef = useRef(null)
  const tickRef = useRef(null)

  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    return () => {
      clearInterval(intervalRef.current)
      clearInterval(tickRef.current)
    }
  }, [])

  const startSim = useCallback(() => {
    setRunning(true)
    setFired(false)
    setVoltage(REST)
    setSpikeTimes([])

    // Decay tick: every 50ms
    clearInterval(tickRef.current)
    tickRef.current = setInterval(() => {
      setVoltage((v) => {
        if (v <= REST) return REST
        const decayed = v - DECAY_RATE
        return decayed < REST ? REST : decayed
      })
    }, 50)

    // Spike interval
    clearInterval(intervalRef.current)
    const ms = 1000 / frequency
    intervalRef.current = setInterval(() => {
      setSpikeTimes((prev) => [...prev, Date.now()])
      setVoltage((v) => {
        const next = v + EPSP_SIZE
        if (next >= THRESHOLD) {
          clearInterval(intervalRef.current)
          clearInterval(tickRef.current)
          setFired(true)
          setRunning(false)
          return THRESHOLD
        }
        return next
      })
    }, ms)
  }, [frequency])

  const stopSim = () => {
    setRunning(false)
    clearInterval(intervalRef.current)
    clearInterval(tickRef.current)
  }

  const resetSim = () => {
    stopSim()
    setVoltage(REST)
    setFired(false)
    setSpikeTimes([])
  }

  const vColor = voltage >= THRESHOLD ? '#ff9800' : voltage > -65 ? '#ffb74d' : '#81c784'

  return (
    <div className="m5-step">
      <h3 className="m5-step-title">Temporal Summation</h3>

      <p className="m5-narration">
        Summation also happens <strong>in time</strong>. If the same synapse fires
        repeatedly, the effects can add up before the first EPSP decays.
        The postsynaptic potential lasts ~10-20 ms.
      </p>

      {/* Frequency slider */}
      <div className="m5-freq-control">
        <label className="m5-freq-label">Firing Frequency</label>
        <input
          type="range"
          min="2"
          max="100"
          value={frequency}
          onChange={(e) => { setFrequency(parseInt(e.target.value)); resetSim() }}
          className="m5-freq-slider"
          disabled={running}
        />
        <span className="m5-freq-value">{frequency} Hz</span>
      </div>

      <div className="m5-freq-hint">
        {frequency < 20 && 'Slow — EPSPs will decay before the next arrives'}
        {frequency >= 20 && frequency < 60 && 'Getting faster — some accumulation possible'}
        {frequency >= 60 && 'Fast enough for temporal summation!'}
      </div>

      {/* Voltage meter */}
      <div className="m5-voltage-meter">
        <div className="m5-voltage-header">
          <span className="m5-voltage-label">Membrane Voltage</span>
          <span className="m5-voltage-value" style={{ color: vColor }}>
            {voltage.toFixed(0)} mV
          </span>
        </div>
        <div className="m5-voltage-bar-track">
          <div
            className="m5-voltage-bar-fill"
            style={{
              width: `${Math.max(0, Math.min(100, ((voltage + 80) / 110) * 100))}%`,
              background: vColor,
            }}
          />
          <div
            className="m5-voltage-threshold"
            style={{ left: `${((THRESHOLD + 80) / 110) * 100}%` }}
          >
            <span className="m5-threshold-label">-55 mV</span>
          </div>
        </div>
      </div>

      {/* Spike counter */}
      <div className="m5-spike-counter">
        <span className="m5-spike-label">Spikes:</span>
        <span className="m5-spike-value">{spikeTimes.length}</span>
      </div>

      <div className="m5-action-center">
        {!running && !fired && (
          <button className="m5-action-btn m5-action-btn--primary" onClick={startSim}>
            Start Firing
          </button>
        )}
        {running && (
          <button className="m5-action-btn m5-action-btn--stop" onClick={stopSim}>
            Stop
          </button>
        )}
        {(fired || (!running && spikeTimes.length > 0)) && (
          <button className="m5-action-btn m5-action-btn--reset" onClick={resetSim}>
            Reset
          </button>
        )}
      </div>

      {fired && (
        <div className="m5-fire-callout">
          <div className="m5-fire-badge">THRESHOLD REACHED!</div>
          <p className="m5-concept">
            At <strong>{frequency} Hz</strong>, inputs arrive faster than they decay.
            After <strong>{spikeTimes.length} spikes</strong>, the voltage accumulated
            to threshold. This is <strong>temporal summation</strong> — adding inputs
            across time.
          </p>
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
