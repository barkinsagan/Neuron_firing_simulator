import { useState, useEffect, useCallback, useRef } from 'react'
import useStore from '../../lib/store'

const TASKS = [
  {
    id: 'rotate',
    label: 'Rotate the View',
    instruction: 'Try rotating the view with your mouse or touch',
    success: 'Great! You can rotate the view anytime',
  },
  {
    id: 'play',
    label: 'Play / Pause',
    instruction: 'Click the play button to start an animation',
    success: 'Perfect!',
  },
  {
    id: 'timeline',
    label: 'Timeline Scrubber',
    instruction: 'Drag the timeline slider to jump to any moment',
    success: 'Excellent!',
  },
  {
    id: 'toggle',
    label: 'Toggle Controls',
    instruction: 'Toggle "Show Ions" in the controls panel on the right',
    success: "You've got it!",
  },
]

export default function Module0_Tutorial({ onAdvance }) {
  const [completed, setCompleted] = useState({
    rotate: false,
    play: false,
    timeline: false,
    toggle: false,
  })
  const [activeTask, setActiveTask] = useState(0)
  const prevShowIons = useRef(useStore.getState().showIons)
  const prevIsPlaying = useRef(useStore.getState().isPlaying)

  const allDone = Object.values(completed).every(Boolean)

  const markDone = useCallback((id) => {
    setCompleted((prev) => {
      if (prev[id]) return prev
      const next = { ...prev, [id]: true }
      return next
    })
  }, [])

  // Enable orbit controls for the tutorial
  useEffect(() => {
    if (window.__orbitControls) {
      window.__orbitControls.enabled = true
    }
    return () => {
      // Will be managed by EducationalMode on next step
    }
  }, [])

  // Detect camera rotation via pointer events on canvas
  useEffect(() => {
    if (completed.rotate) return

    let startX = 0
    let startY = 0

    const onDown = (e) => {
      startX = e.clientX
      startY = e.clientY
    }
    const onUp = (e) => {
      const dx = Math.abs(e.clientX - startX)
      const dy = Math.abs(e.clientY - startY)
      if (dx > 30 || dy > 30) {
        markDone('rotate')
      }
    }

    const canvas = document.querySelector('canvas')
    if (canvas) {
      canvas.addEventListener('pointerdown', onDown)
      canvas.addEventListener('pointerup', onUp)
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('pointerdown', onDown)
        canvas.removeEventListener('pointerup', onUp)
      }
    }
  }, [completed.rotate, markDone])

  // Detect play button click via store subscription
  useEffect(() => {
    if (completed.play) return

    const unsub = useStore.subscribe((state) => {
      if (state.isPlaying !== prevIsPlaying.current) {
        prevIsPlaying.current = state.isPlaying
        markDone('play')
      }
    })
    return unsub
  }, [completed.play, markDone])

  // Detect timeline interaction via currentTime change
  useEffect(() => {
    if (completed.timeline) return

    let initialTime = useStore.getState().currentTime
    const unsub = useStore.subscribe((state) => {
      if (Math.abs(state.currentTime - initialTime) > 0.3) {
        markDone('timeline')
      }
    })
    return unsub
  }, [completed.timeline, markDone])

  // Detect showIons toggle
  useEffect(() => {
    if (completed.toggle) return

    const unsub = useStore.subscribe((state) => {
      if (state.showIons !== prevShowIons.current) {
        prevShowIons.current = state.showIons
        markDone('toggle')
      }
    })
    return unsub
  }, [completed.toggle, markDone])

  // Auto-advance active task indicator
  useEffect(() => {
    const taskOrder = ['rotate', 'play', 'timeline', 'toggle']
    for (let i = 0; i < taskOrder.length; i++) {
      if (!completed[taskOrder[i]]) {
        setActiveTask(i)
        return
      }
    }
    setActiveTask(taskOrder.length) // all done
  }, [completed])

  return (
    <div className="m0-tutorial">
      <h2 className="m0-tutorial-title">Quick Tutorial</h2>
      <p className="m0-tutorial-intro">
        Let's familiarize you with the controls. During the tour, the camera
        will move automatically, but you can always take manual control.
      </p>

      <div className="m0-tutorial-tasks">
        {TASKS.map((task, i) => {
          const isDone = completed[task.id]
          const isActive = i === activeTask && !isDone
          return (
            <div
              key={task.id}
              className={`m0-task ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
            >
              <div className="m0-task-check">
                {isDone ? '✓' : (i + 1)}
              </div>
              <div className="m0-task-content">
                <div className="m0-task-label">{task.label}</div>
                <div className="m0-task-instruction">
                  {isDone ? task.success : task.instruction}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {allDone && (
        <div className="m0-tutorial-complete">
          <p className="m0-tutorial-ready">You're ready to begin!</p>
          <button className="m0-btn-primary" onClick={onAdvance}>
            Continue
          </button>
        </div>
      )}

      {!allDone && (
        <button className="m0-btn-tertiary m0-tutorial-skip" onClick={onAdvance}>
          Skip tutorial
        </button>
      )}
    </div>
  )
}
