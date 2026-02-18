import { useState, useEffect, useRef, useCallback } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.06

const QUIZ = {
  question: 'What happens if a stimulus brings voltage to -60 mV (below threshold)?',
  options: [
    { id: 'a', text: 'Full action potential fires' },
    { id: 'b', text: 'Partial action potential' },
    { id: 'c', text: 'Nothing special, voltage returns to rest' },
  ],
  correct: 'c',
  feedback:
    "Correct! Below threshold, the neuron doesn't fire. It's all-or-nothing — the stimulus either reaches -55 mV and triggers a full spike, or the voltage simply decays back to rest.",
}

export default function Module2_Threshold({ onAdvance }) {
  const [stimStrength, setStimStrength] = useState(0)
  const [demoVoltage, setDemoVoltage] = useState(-70)
  const [fired, setFired] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const animRef = useRef(null)
  const prevSpeedRef = useRef(1)

  // Pause simulation on mount, position at rest
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  // Slow demo animation using requestAnimationFrame with time-based stepping
  const animateDemoVoltage = useCallback((targetV, shouldFire) => {
    if (animRef.current) cancelAnimationFrame(animRef.current)

    let v = -70
    let lastTs = null
    setFired(false)
    setDemoVoltage(-70)

    const step = (ts) => {
      if (!lastTs) { lastTs = ts }
      const dtSec = (ts - lastTs) / 1000
      lastTs = ts

      if (shouldFire) {
        v += 40 * dtSec // ~40 mV/s → takes ~2.5s to reach +30
        if (v >= 30) {
          setDemoVoltage(30)
          setFired(true)
          // Pause at peak briefly, then fall
          setTimeout(() => {
            let fv = 30
            let fLastTs = null
            const fallStep = (fts) => {
              if (!fLastTs) { fLastTs = fts }
              const fdt = (fts - fLastTs) / 1000
              fLastTs = fts
              fv -= 50 * fdt
              if (fv <= -80) {
                setDemoVoltage(-70)
                setFired(false)
                return
              }
              setDemoVoltage(fv)
              animRef.current = requestAnimationFrame(fallStep)
            }
            animRef.current = requestAnimationFrame(fallStep)
          }, 800)
          return
        }
        if (v >= -55 && !fired) setFired(true)
        setDemoVoltage(v)
        animRef.current = requestAnimationFrame(step)
      } else {
        if (v < targetV) {
          v += 15 * dtSec
          setDemoVoltage(v)
          animRef.current = requestAnimationFrame(step)
        } else {
          // Hold briefly then decay
          setTimeout(() => {
            let dv = targetV
            let dLastTs = null
            const decay = (dts) => {
              if (!dLastTs) { dLastTs = dts }
              const ddt = (dts - dLastTs) / 1000
              dLastTs = dts
              dv -= 10 * ddt
              if (dv <= -70) {
                setDemoVoltage(-70)
                return
              }
              setDemoVoltage(dv)
              animRef.current = requestAnimationFrame(decay)
            }
            animRef.current = requestAnimationFrame(decay)
          }, 600)
        }
      }
    }
    animRef.current = requestAnimationFrame(step)
  }, [fired])

  const handleSliderChange = (e) => {
    setStimStrength(parseInt(e.target.value, 10))
  }

  const handleTestStimulus = () => {
    if (stimStrength < 50) {
      const targetV = -70 + (stimStrength / 50) * 10
      animateDemoVoltage(targetV, false)
    } else {
      animateDemoVoltage(-55, true)
      // Also trigger real simulation slowly
      useStore.getState().reset()
      useStore.getState().setSpeed(EDU_SPEED)
      setTimeout(() => useStore.getState().play(), 200)
    }
  }

  const vColor = demoVoltage > -55 ? '#ff9800' : demoVoltage > -65 ? '#ffb74d' : '#81c784'

  return (
    <div className="m2-step">
      <h3 className="m2-step-title">Threshold: The Point of No Return</h3>

      <p className="m2-narration">
        If the voltage reaches <strong>-55 mV</strong> (the threshold), something dramatic
        happens. This is the <strong>all-or-nothing principle</strong>: either the stimulus
        reaches threshold and the neuron fires completely, or it doesn't fire at all.
      </p>

      {/* Demo voltage meter */}
      <div className="m2-voltage-meter">
        <div className="m2-voltage-header">
          <span className="m2-voltage-label">Demo Voltage</span>
          <span className="m2-voltage-value" style={{ color: vColor }}>
            {demoVoltage.toFixed(0)} mV
            {fired && <span className="m2-fired-badge">FIRED!</span>}
          </span>
        </div>
        <div className="m2-voltage-bar-track">
          <div
            className="m2-voltage-bar-fill"
            style={{
              width: `${Math.max(0, Math.min(100, ((demoVoltage + 80) / 110) * 100))}%`,
              background: vColor,
            }}
          />
          <div
            className="m2-voltage-threshold"
            style={{ left: `${(((-55) + 80) / 110) * 100}%` }}
          >
            <span className="m2-threshold-label">Threshold</span>
          </div>
        </div>
      </div>

      {/* Stimulus strength slider */}
      <div className="m2-slider-group">
        <div className="m2-slider-header">
          <span className="m2-slider-label">Stimulus Strength</span>
          <span className="m2-slider-value">
            {stimStrength < 50 ? 'Sub-threshold' : stimStrength === 50 ? 'At threshold' : 'Above threshold'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={stimStrength}
          onChange={handleSliderChange}
          className="m2-slider"
        />
        <div className="m2-slider-marks">
          <span>Weak</span>
          <span>Threshold</span>
          <span>Strong</span>
        </div>
        <button className="m2-action-btn" onClick={handleTestStimulus}>
          Test Stimulus
        </button>
        <p className="m2-hint">Try sub-threshold vs threshold — notice the difference!</p>
      </div>

      {/* Knowledge check */}
      <div className="m2-quiz">
        <p className="m2-quiz-question">{QUIZ.question}</p>
        <div className="m2-quiz-options">
          {QUIZ.options.map((opt) => {
            const isSelected = quizAnswer === opt.id
            const isCorrect = opt.id === QUIZ.correct
            const showResult = quizAnswer !== null
            return (
              <button
                key={opt.id}
                className={`m2-quiz-option ${isSelected ? 'selected' : ''} ${
                  showResult && isCorrect ? 'correct' : ''
                } ${showResult && isSelected && !isCorrect ? 'wrong' : ''}`}
                onClick={() => setQuizAnswer(opt.id)}
                disabled={quizAnswer !== null}
              >
                <span className="m2-quiz-letter">{opt.id.toUpperCase()}</span>
                {opt.text}
              </button>
            )
          })}
        </div>
        {quizAnswer && (
          <p className={`m2-quiz-feedback ${quizAnswer === QUIZ.correct ? 'correct' : 'wrong'}`}>
            {quizAnswer === QUIZ.correct
              ? QUIZ.feedback
              : `Not quite. ${QUIZ.feedback}`}
          </p>
        )}
      </div>

      <div className="m2-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
