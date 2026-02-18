import { useEffect, useRef } from 'react'
import useStore from '../lib/store'
import { MODULES } from '../lib/educationalContent'
import Module0_Welcome from './modules/Module0_Welcome'
import Module0_Tutorial from './modules/Module0_Tutorial'
import Module0_Preview from './modules/Module0_Preview'
import Module2_Trigger from './modules/Module2_Trigger'
import Module2_Threshold from './modules/Module2_Threshold'
import Module2_Rising from './modules/Module2_Rising'
import Module2_Peak from './modules/Module2_Peak'
import Module2_Falling from './modules/Module2_Falling'
import Module2_Hyperpolarization from './modules/Module2_Hyperpolarization'
import Module2_Refractory from './modules/Module2_Refractory'
import Module2_Summary from './modules/Module2_Summary'
import Module3_LongDistance from './modules/Module3_LongDistance'
import Module3_DominoEffect from './modules/Module3_DominoEffect'
import Module3_SpeedProblem from './modules/Module3_SpeedProblem'
import Module3_SaltatoryConduction from './modules/Module3_SaltatoryConduction'
import Module3_OneNode from './modules/Module3_OneNode'
import Module3_Summary from './modules/Module3_Summary'
import Module4_TheGap from './modules/Module4_TheGap'
import Module4_WhyChemical from './modules/Module4_WhyChemical'
import Module4_Calcium from './modules/Module4_Calcium'
import Module4_Vesicles from './modules/Module4_Vesicles'
import Module4_Exocytosis from './modules/Module4_Exocytosis'
import Module4_Diffusion from './modules/Module4_Diffusion'
import Module4_Binding from './modules/Module4_Binding'
import Module4_EPSP from './modules/Module4_EPSP'
import Module4_Inhibitory from './modules/Module4_Inhibitory'
import Module4_Termination from './modules/Module4_Termination'
import Module4_Summary from './modules/Module4_Summary'
import Module5_Integration from './modules/Module5_Integration'
import Module5_SpatialSummation from './modules/Module5_SpatialSummation'
import Module5_TemporalSummation from './modules/Module5_TemporalSummation'
import Module5_Decision from './modules/Module5_Decision'
import Module5_Convergence from './modules/Module5_Convergence'
import Module5_Divergence from './modules/Module5_Divergence'
import Module5_Feedforward from './modules/Module5_Feedforward'
import Module5_FeedbackInhibition from './modules/Module5_FeedbackInhibition'
import Module5_LateralInhibition from './modules/Module5_LateralInhibition'
import Module5_StretchReflex from './modules/Module5_StretchReflex'
import Module5_Summary from './modules/Module5_Summary'
import Module6_JourneyComplete from './modules/Module6_JourneyComplete'
import Module6_BiggerContext from './modules/Module6_BiggerContext'
import Module6_ClinicalConnections from './modules/Module6_ClinicalConnections'
import Module6_ExploreMore from './modules/Module6_ExploreMore'
import Module6_Feedback from './modules/Module6_Feedback'

// Map component string IDs to actual components
const STEP_COMPONENTS = {
  welcome: Module0_Welcome,
  tutorial: Module0_Tutorial,
  preview: Module0_Preview,
  m2_trigger: Module2_Trigger,
  m2_threshold: Module2_Threshold,
  m2_rising: Module2_Rising,
  m2_peak: Module2_Peak,
  m2_falling: Module2_Falling,
  m2_hyperpolarization: Module2_Hyperpolarization,
  m2_refractory: Module2_Refractory,
  m2_summary: Module2_Summary,
  m3_longDistance: Module3_LongDistance,
  m3_dominoEffect: Module3_DominoEffect,
  m3_speedProblem: Module3_SpeedProblem,
  m3_saltatoryConduction: Module3_SaltatoryConduction,
  m3_oneNode: Module3_OneNode,
  m3_summary: Module3_Summary,
  m4_theGap: Module4_TheGap,
  m4_whyChemical: Module4_WhyChemical,
  m4_calcium: Module4_Calcium,
  m4_vesicles: Module4_Vesicles,
  m4_exocytosis: Module4_Exocytosis,
  m4_diffusion: Module4_Diffusion,
  m4_binding: Module4_Binding,
  m4_epsp: Module4_EPSP,
  m4_inhibitory: Module4_Inhibitory,
  m4_termination: Module4_Termination,
  m4_summary: Module4_Summary,
  m5_integration: Module5_Integration,
  m5_spatialSummation: Module5_SpatialSummation,
  m5_temporalSummation: Module5_TemporalSummation,
  m5_decision: Module5_Decision,
  m5_convergence: Module5_Convergence,
  m5_divergence: Module5_Divergence,
  m5_feedforward: Module5_Feedforward,
  m5_feedbackInhibition: Module5_FeedbackInhibition,
  m5_lateralInhibition: Module5_LateralInhibition,
  m5_stretchReflex: Module5_StretchReflex,
  m5_summary: Module5_Summary,
  m6_journeyComplete: Module6_JourneyComplete,
  m6_biggerContext: Module6_BiggerContext,
  m6_clinicalConnections: Module6_ClinicalConnections,
  m6_exploreMore: Module6_ExploreMore,
  m6_feedback: Module6_Feedback,
}

export default function EducationalMode() {
  const educationalMode = useStore((s) => s.educationalMode)
  const currentModule = useStore((s) => s.currentModule)
  const currentStep = useStore((s) => s.currentStep)
  const interactivePause = useStore((s) => s.interactivePause)
  const nextStep = useStore((s) => s.nextStep)
  const previousStep = useStore((s) => s.previousStep)
  const exitEducationalMode = useStore((s) => s.exitEducationalMode)
  const goToModule = useStore((s) => s.goToModule)
  const moduleProgress = useStore((s) => s.moduleProgress)

  const prevStepKey = useRef('')

  const mod = MODULES[currentModule]
  const step = mod?.steps[currentStep]
  const hasComponent = step?.component && STEP_COMPONENTS[step.component]

  // When step changes, animate camera and run step action
  useEffect(() => {
    if (!educationalMode || !step) return

    const stepKey = `${currentModule}-${currentStep}`
    if (stepKey === prevStepKey.current) return
    prevStepKey.current = stepKey

    // Animate camera to step's target
    if (step.camera && window.__cameraAnimateTo) {
      window.__cameraAnimateTo(step.camera)
    }

    // Disable orbit controls during narration (re-enable on interactive pause)
    if (window.__orbitControls) {
      window.__orbitControls.enabled = !!step.interactive
    }

    // Run simulation actions
    if (step.action === 'play') {
      useStore.getState().play()
    } else if (step.action === 'reset') {
      useStore.getState().reset()
    }
  }, [educationalMode, currentModule, currentStep, step])

  // Re-enable controls when exiting educational mode
  useEffect(() => {
    if (!educationalMode && window.__orbitControls) {
      window.__orbitControls.enabled = true
    }
  }, [educationalMode])

  // Keyboard navigation (disabled for component steps — they handle their own flow)
  useEffect(() => {
    if (!educationalMode || hasComponent) return

    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextStep()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        previousStep()
      } else if (e.key === 'Escape') {
        exitEducationalMode()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [educationalMode, hasComponent, nextStep, previousStep, exitEducationalMode])

  // Always allow Escape even on component steps
  useEffect(() => {
    if (!educationalMode || !hasComponent) return

    const handleEsc = (e) => {
      if (e.key === 'Escape') exitEducationalMode()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [educationalMode, hasComponent, exitEducationalMode])

  // Toggle body class so CSS can shift the Leva panel out of the way
  useEffect(() => {
    if (educationalMode) {
      document.body.classList.add('edu-active')
    } else {
      document.body.classList.remove('edu-active')
    }
    return () => document.body.classList.remove('edu-active')
  }, [educationalMode])

  if (!educationalMode || !mod || !step) return null

  // Calculate global progress
  const totalSteps = MODULES.reduce((sum, m) => sum + m.steps.length, 0)
  let completedSteps = 0
  for (let m = 0; m < currentModule; m++) {
    completedSteps += MODULES[m].steps.length
  }
  completedSteps += currentStep

  const isFirstStep = currentModule === 0 && currentStep === 0
  const isLastModule = currentModule === MODULES.length - 1
  const isLastStep = currentStep === mod.steps.length - 1

  // ─── Component-based step: render the rich component instead of text ───
  if (hasComponent) {
    const StepComponent = STEP_COMPONENTS[step.component]
    return (
      <>
        <div className="edu-overlay edu-overlay--side" />
        <div className="edu-panel-wide">
          <StepComponent onAdvance={nextStep} />
        </div>
      </>
    )
  }

  // ─── Standard text-based step ─────────────────────────────────────────
  return (
    <>
      <div className="edu-overlay" />

      <div className="edu-panel">
        {/* Progress bar */}
        <div className="edu-progress-bar">
          <div
            className="edu-progress-fill"
            style={{ width: `${(completedSteps / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Module navigation dots */}
        <div className="edu-module-nav">
          {MODULES.map((m, i) => (
            <button
              key={m.id}
              className={`edu-module-dot ${i === currentModule ? 'active' : ''} ${moduleProgress[i] ? 'completed' : ''}`}
              onClick={() => goToModule(i)}
              title={m.title}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="edu-header">
          <span className="edu-module-label">
            Module {currentModule + 1} of {MODULES.length}
          </span>
          <span className="edu-step-label">
            Step {currentStep + 1} of {mod.steps.length}
          </span>
        </div>

        <h2 className="edu-title">{mod.title}</h2>
        <h3 className="edu-step-title">{step.title}</h3>
        <p className="edu-text">{step.text}</p>

        {interactivePause && !hasComponent && (
          <div className="edu-interactive-badge">
            Interactive — explore freely, then continue
          </div>
        )}

        {/* Navigation buttons */}
        <div className="edu-nav">
          <button
            className="edu-btn edu-btn-secondary"
            onClick={previousStep}
            disabled={isFirstStep}
          >
            Previous
          </button>

          <button
            className="edu-btn edu-btn-secondary"
            onClick={exitEducationalMode}
          >
            Exit Tour
          </button>

          <button
            className="edu-btn edu-btn-primary"
            onClick={nextStep}
          >
            {isLastModule && isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </>
  )
}

export function TourToggleButton() {
  const educationalMode = useStore((s) => s.educationalMode)
  const enterEducationalMode = useStore((s) => s.enterEducationalMode)
  const exitEducationalMode = useStore((s) => s.exitEducationalMode)

  return (
    <button
      className="tour-toggle-btn"
      onClick={educationalMode ? exitEducationalMode : enterEducationalMode}
    >
      {educationalMode ? 'Exit Tour' : 'Start Guided Tour'}
    </button>
  )
}
