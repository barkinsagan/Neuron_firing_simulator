import { Html } from '@react-three/drei'
import useStore from '../lib/store'

function Label({ position, children, offset = [0, 0] }) {
  return (
    <Html
      position={position}
      center
      distanceFactor={10}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div className="label-3d" style={{ transform: `translate(${offset[0]}px, ${offset[1]}px)` }}>
        <span className="label-arrow" />
        <span className="label-text">{children}</span>
      </div>
    </Html>
  )
}

export function PresynapticLabels() {
  const showLabels = useStore((s) => s.showLabels)
  if (!showLabels) return null

  return (
    <group>
      <Label position={[0, 0.9, 0]}>Soma</Label>
      <Label position={[3.3, 0.4, 0]}>Axon</Label>
      <Label position={[-1.3, 0.8, 0]}>Dendrites</Label>
      <Label position={[1.5, 0.45, 0]}>Node of Ranvier</Label>
      <Label position={[2.2, -0.35, 0]}>Myelin Sheath</Label>
      <Label position={[6.2, 0.4, 0]}>Axon Terminal</Label>
    </group>
  )
}

export function PostsynapticLabels() {
  const showLabels = useStore((s) => s.showLabels)
  if (!showLabels) return null

  return (
    <group>
      <Label position={[0, 0.9, 0]}>Soma</Label>
      <Label position={[-1.2, 0.7, 0]}>Dendrites</Label>
    </group>
  )
}

export function SynapseLabels({ position = [0, 0, 0] }) {
  const showLabels = useStore((s) => s.showLabels)
  if (!showLabels) return null

  return (
    <group position={position}>
      <Label position={[0, 0.55, 0]}>Synaptic Cleft</Label>
      <Label position={[-0.3, -0.35, 0]}>Vesicles</Label>
      <Label position={[0.3, -0.35, 0]}>Receptors</Label>
    </group>
  )
}
