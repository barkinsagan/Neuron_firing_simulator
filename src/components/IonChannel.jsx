import { useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

const TYPE_COLORS = {
  sodium:    '#FFD700',
  potassium: '#9C27B0',
  leak:      '#999999',
}

const INACTIVATED_CAP_COLOR = '#FF1744'

// Target values for each state
const STATE_TARGETS = {
  closed:      { opacity: 0.7, emissive: 0,   capScale: 1, capOpacity: 0.8 },
  open:        { opacity: 0.9, emissive: 0.8, capScale: 0, capOpacity: 0   },
  inactivated: { opacity: 0.5, emissive: 0,   capScale: 1, capOpacity: 0.8 },
}

const TRANSITION_DURATION = 0.1 // seconds

const IonChannel = forwardRef(function IonChannel({
  position = [0, 0, 0],
  type = 'sodium',
  state: initialState = 'closed',
  orientation = [0, 1, 0],
}, ref) {
  const groupRef = useRef()
  const bodyRef = useRef()
  const bodyMatRef = useRef()
  const capRef = useRef()
  const capMatRef = useRef()
  const currentStateRef = useRef(initialState)

  // Animated values that GSAP tweens
  const animValues = useRef({
    opacity: STATE_TARGETS[initialState].opacity,
    emissive: STATE_TARGETS[initialState].emissive,
    capScale: STATE_TARGETS[initialState].capScale,
    capOpacity: STATE_TARGETS[initialState].capOpacity,
  })

  // Track which cap color to use
  const capColorRef = useRef(initialState === 'inactivated' ? INACTIVATED_CAP_COLOR : TYPE_COLORS[type])

  const color = TYPE_COLORS[type]

  // Compute rotation to align Y-axis with orientation
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(...orientation).normalize(),
  )
  const euler = new THREE.Euler().setFromQuaternion(quaternion)
  const rotation = [euler.x, euler.y, euler.z]

  // Expose setState for imperative updates from NodalChannels
  useImperativeHandle(ref, () => ({
    setState: (newState) => {
      if (newState === currentStateRef.current) return
      currentStateRef.current = newState

      const targets = STATE_TARGETS[newState]

      // Update cap color immediately (before tween)
      capColorRef.current = newState === 'inactivated'
        ? INACTIVATED_CAP_COLOR
        : color

      // GSAP tween to smoothly transition visual properties
      gsap.to(animValues.current, {
        opacity: targets.opacity,
        emissive: targets.emissive,
        capScale: targets.capScale,
        capOpacity: targets.capOpacity,
        duration: TRANSITION_DURATION,
        ease: 'power2.inOut',
        overwrite: true,
      })
    },
  }))

  // Handle initial state and prop-driven state changes
  useEffect(() => {
    if (initialState !== currentStateRef.current) {
      currentStateRef.current = initialState
      const targets = STATE_TARGETS[initialState]
      capColorRef.current = initialState === 'inactivated'
        ? INACTIVATED_CAP_COLOR
        : color
      gsap.to(animValues.current, {
        ...targets,
        duration: TRANSITION_DURATION,
        ease: 'power2.inOut',
        overwrite: true,
      })
    }
  }, [initialState, color])

  useFrame((clock) => {
    const t = clock.clock.elapsedTime
    const vals = animValues.current
    const isOpen = currentStateRef.current === 'open'

    // Subtle rotation to show "alive" state
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 1.5) * 0.1
    }

    // Apply animated material properties to body
    if (bodyMatRef.current) {
      bodyMatRef.current.opacity = vals.opacity
      bodyMatRef.current.emissiveIntensity = vals.emissive
    }

    // Open state: gentle scale pulse on body
    if (bodyRef.current) {
      if (isOpen) {
        const pulse = 1 + Math.sin(t * 4) * 0.05
        bodyRef.current.scale.set(pulse, 1, pulse)
      } else {
        bodyRef.current.scale.set(1, 1, 1)
      }
    }

    // Animate cap scale and opacity
    if (capRef.current) {
      const s = vals.capScale
      capRef.current.scale.set(s, s, s)
      capRef.current.visible = s > 0.01
    }
    if (capMatRef.current) {
      capMatRef.current.opacity = vals.capOpacity
      capMatRef.current.color.set(capColorRef.current)
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Channel body — cylinder spanning membrane */}
      <Cylinder ref={bodyRef} args={[0.05, 0.05, 0.3, 8]}>
        <meshStandardMaterial
          ref={bodyMatRef}
          color={color}
          emissive={color}
          emissiveIntensity={0}
          transparent
          opacity={0.7}
          roughness={0.4}
          metalness={0.2}
        />
      </Cylinder>

      {/* Cap — always rendered, animated in/out via scale + opacity */}
      <Sphere ref={capRef} args={[0.055, 8, 8]} position={[0, 0.15, 0]}>
        <meshStandardMaterial
          ref={capMatRef}
          color={color}
          transparent
          opacity={0.8}
          roughness={0.4}
          metalness={0.2}
        />
      </Sphere>
    </group>
  )
})

export default IonChannel
