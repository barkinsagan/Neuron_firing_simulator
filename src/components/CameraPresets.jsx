import { useThree } from '@react-three/fiber'
import { useCallback } from 'react'
import gsap from 'gsap'

const PRESETS = [
  {
    id: 'overview',
    label: 'Overview',
    position: [2, 5, 16],
    target: [2, 1, 0],
  },
  {
    id: 'synapse',
    label: 'Synapse',
    position: [2.5, 1.8, 3],
    target: [2.5, 1, 0],
  },
  {
    id: 'presynaptic',
    label: 'Pre Neuron',
    position: [-2, 2.5, 6],
    target: [-1, 1, 0],
  },
  {
    id: 'postsynaptic',
    label: 'Post Neuron',
    position: [6, 2.5, 6],
    target: [5.5, 1, 0],
  },
]

function CameraController() {
  const { camera, controls } = useThree()

  const animateTo = useCallback((preset) => {
    if (!controls) return
    // Animate camera position
    gsap.to(camera.position, {
      x: preset.position[0],
      y: preset.position[1],
      z: preset.position[2],
      duration: 2,
      ease: 'power2.inOut',
    })
    // Animate orbit target
    gsap.to(controls.target, {
      x: preset.target[0],
      y: preset.target[1],
      z: preset.target[2],
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => controls.update(),
    })
  }, [camera, controls])

  // Expose animateTo and controls on window for UI components to call
  window.__cameraAnimateTo = animateTo
  window.__orbitControls = controls

  return null
}

function CameraPresetsUI() {
  const handleClick = (preset) => {
    if (window.__cameraAnimateTo) {
      window.__cameraAnimateTo(preset)
    }
  }

  return (
    <div className="camera-presets">
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          className="preset-btn"
          onClick={() => handleClick(preset)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}

export { CameraController, CameraPresetsUI, PRESETS }
