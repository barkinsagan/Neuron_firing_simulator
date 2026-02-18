import { create } from 'zustand'
import { getVoltageAtTime, getPhaseAtTime } from './actionPotentialSimulation'
import { MODULES } from './educationalContent'

const useStore = create((set) => ({
  // Presynaptic simulation state
  isPlaying: false,
  currentTime: 0,
  voltage: -70,
  phase: 'resting', // 'resting' | 'depolarizing' | 'repolarizing' | 'hyperpolarizing'
  speed: 1,
  showIons: true,
  showLabels: true,

  // Synapse state
  synapseActive: false,  // true when AP reaches terminal, triggers NT release
  synapseTime: 0,        // time since synapse activation

  // Postsynaptic state
  postVoltage: -70,
  postPhase: 'resting',
  postPlaying: false,
  postTime: 0,

  // Educational mode state
  educationalMode: true,
  currentModule: 0,
  currentStep: 0,
  moduleProgress: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
  interactivePause: false,

  // Actions
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false, postPlaying: false }),
  reset: () => set({
    isPlaying: false, currentTime: 0, voltage: -70, phase: 'resting',
    synapseActive: false, synapseTime: 0,
    postVoltage: -70, postPhase: 'resting', postPlaying: false, postTime: 0,
  }),
  setCurrentTime: (t) => set({
    currentTime: t,
    voltage: getVoltageAtTime(t),
    phase: getPhaseAtTime(t),
  }),
  setVoltage: (voltage) => set({ voltage }),
  setSpeed: (speed) => set({ speed }),
  setShowIons: (showIons) => set({ showIons }),
  setShowLabels: (showLabels) => set({ showLabels }),
  triggerSynapse: () => set({ synapseActive: true, synapseTime: 0 }),
  triggerPostsynaptic: () => set({ postPlaying: true, postTime: 0 }),

  // Educational mode actions
  enterEducationalMode: () => set({
    educationalMode: true,
    currentModule: 0,
    currentStep: 0,
    interactivePause: false,
  }),
  exitEducationalMode: () => set({
    educationalMode: false,
    interactivePause: false,
  }),
  nextStep: () => set((state) => {
    const mod = MODULES[state.currentModule]
    if (!mod) return {}
    const nextStep = state.currentStep + 1
    if (nextStep < mod.steps.length) {
      return {
        currentStep: nextStep,
        interactivePause: mod.steps[nextStep].interactive || false,
      }
    }
    // Module complete — advance to next module
    const nextModule = state.currentModule + 1
    if (nextModule < MODULES.length) {
      return {
        currentModule: nextModule,
        currentStep: 0,
        interactivePause: MODULES[nextModule].steps[0].interactive || false,
        moduleProgress: { ...state.moduleProgress, [state.currentModule]: true },
      }
    }
    // All modules complete
    return {
      moduleProgress: { ...state.moduleProgress, [state.currentModule]: true },
      educationalMode: false,
      interactivePause: false,
    }
  }),
  previousStep: () => set((state) => {
    if (state.currentStep > 0) {
      const prevStep = state.currentStep - 1
      const mod = MODULES[state.currentModule]
      return {
        currentStep: prevStep,
        interactivePause: mod?.steps[prevStep]?.interactive || false,
      }
    }
    if (state.currentModule > 0) {
      const prevModule = state.currentModule - 1
      const prevMod = MODULES[prevModule]
      const lastStep = prevMod ? prevMod.steps.length - 1 : 0
      return {
        currentModule: prevModule,
        currentStep: lastStep,
        interactivePause: prevMod?.steps[lastStep]?.interactive || false,
      }
    }
    return {}
  }),
  goToModule: (moduleNumber) => set({
    currentModule: moduleNumber,
    currentStep: 0,
    interactivePause: MODULES[moduleNumber]?.steps[0]?.interactive || false,
  }),
}))

export default useStore
