import { useState, useEffect, useRef } from 'react'
import useStore from '../../lib/store'

const EDU_SPEED = 0.08

const QUIZ = {
  question: 'What causes the falling phase of the action potential?',
  options: [
    { id: 'a', text: 'Na+ channels closing' },
    { id: 'b', text: 'K+ channels opening' },
    { id: 'c', text: 'The Na+/K+ pump' },
    { id: 'd', text: 'Leak channels' },
  ],
  correct: 'b',
  feedback:
    'Yes! K+ channels open and K+ rushes out, bringing the voltage back down. The Na+/K+ pump works too slowly to cause the rapid repolarization.',
}

export default function Module2_Refractory({ onAdvance }) {
  const [tryFireResult, setTryFireResult] = useState(null)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [hasPlayed, setHasPlayed] = useState(false)
  const voltage = useStore((s) => s.voltage)
  const currentTime = useStore((s) => s.currentTime)
  const timerRef = useRef(null)
  const prevSpeedRef = useRef(1)

  // Start PAUSED at middle of refractory period (2ms, mid-repolarization)
  useEffect(() => {
    prevSpeedRef.current = useStore.getState().speed
    useStore.getState().pause()
    useStore.getState().setCurrentTime(2.0)
    useStore.getState().setSpeed(EDU_SPEED)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      useStore.getState().pause()
      useStore.getState().setSpeed(prevSpeedRef.current)
    }
  }, [])

  const playFullCycle = () => {
    setHasPlayed(true)
    useStore.getState().reset()
    useStore.getState().setSpeed(EDU_SPEED)
    setTimeout(() => useStore.getState().play(), 300)
  }

  const tryFireAgain = () => {
    const t = useStore.getState().currentTime
    if (t > 0.5 && t < 3.5) {
      // In refractory period
      setTryFireResult('blocked')
      timerRef.current = setTimeout(() => setTryFireResult(null), 3000)
    } else {
      // Can fire again
      setTryFireResult('success')
      useStore.getState().reset()
      useStore.getState().setSpeed(EDU_SPEED)
      setTimeout(() => useStore.getState().play(), 300)
      timerRef.current = setTimeout(() => setTryFireResult(null), 3000)
    }
  }

  return (
    <div className="m2-step">
      <h3 className="m2-step-title">The Refractory Period</h3>

      <p className="m2-narration">
        During and after an action potential, the neuron enters a
        <strong> refractory period</strong> — a time when it can't fire again.
        This limits firing rate to about 250–500 spikes per second.
      </p>

      {/* Voltage display */}
      <div className="m2-voltage-meter m2-voltage-meter--compact">
        <div className="m2-voltage-header">
          <span className="m2-voltage-label">Current Voltage</span>
          <span className="m2-voltage-value" style={{
            color: voltage > 0 ? '#f44336' : voltage < -75 ? '#1565c0' : '#81c784'
          }}>
            {voltage.toFixed(0)} mV
          </span>
        </div>
      </div>

      {/* Play full cycle button */}
      {!hasPlayed && (
        <div className="m2-controls-row">
          <button className="m2-action-btn m2-action-btn--stimulus" onClick={playFullCycle}>
            Watch Full AP Cycle (slowly)
          </button>
        </div>
      )}

      {/* Timeline visualization */}
      <div className="m2-timeline-vis">
        <div className="m2-timeline-phases">
          <div className="m2-tl-phase m2-tl-phase--rising" style={{ flex: '1.5' }}>
            <div className="m2-tl-bar" />
            <span className="m2-tl-label">Rising</span>
            <span className="m2-tl-time">0–1.5 ms</span>
          </div>
          <div className="m2-tl-phase m2-tl-phase--falling" style={{ flex: '1' }}>
            <div className="m2-tl-bar" />
            <span className="m2-tl-label">Falling</span>
            <span className="m2-tl-time">1.5–2.5 ms</span>
          </div>
          <div className="m2-tl-phase m2-tl-phase--refractory" style={{ flex: '1.5' }}>
            <div className="m2-tl-bar" />
            <span className="m2-tl-label">Recovery</span>
            <span className="m2-tl-time">2.5–4 ms</span>
          </div>
        </div>
        <div
          className="m2-tl-cursor"
          style={{ left: `${Math.min(100, (currentTime / 4) * 100)}%` }}
        />
      </div>

      {/* Two types of refractory */}
      <div className="m2-refractory-types">
        <div className="m2-refract-card m2-refract-card--absolute">
          <div className="m2-refract-header">
            <span className="m2-refract-icon">X</span>
            <strong>Absolute Refractory</strong>
          </div>
          <p className="m2-refract-desc">
            ~1–2 ms — Na+ channels inactivated. Impossible to fire,
            no matter how strong the stimulus.
          </p>
        </div>
        <div className="m2-refract-card m2-refract-card--relative">
          <div className="m2-refract-header">
            <span className="m2-refract-icon">!</span>
            <strong>Relative Refractory</strong>
          </div>
          <p className="m2-refract-desc">
            ~2–4 ms — Na+ channels recovering, voltage still hyperpolarized.
            Can fire, but needs a stronger stimulus.
          </p>
        </div>
      </div>

      {/* Try to fire again button */}
      <div className="m2-try-fire">
        <button className="m2-action-btn m2-action-btn--stimulus" onClick={tryFireAgain}>
          Try to Fire Again
        </button>
        {tryFireResult === 'blocked' && (
          <span className="m2-fire-result m2-fire-result--blocked">
            Blocked! Neuron is in refractory period — Na+ channels haven't reset yet.
          </span>
        )}
        {tryFireResult === 'success' && (
          <span className="m2-fire-result m2-fire-result--success">
            Neuron fires! Refractory period has passed.
          </span>
        )}
        <p className="m2-hint">
          Try clicking during and after the action potential to see the difference
        </p>
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
