import { Box, Sphere, Cylinder } from '@react-three/drei'
import { useMemo } from 'react'

// Vesicle positions on the presynaptic side (left)
const VESICLES = [
  [-0.3, 0.15, 0.1],
  [-0.3, -0.1, -0.15],
  [-0.25, 0.05, -0.1],
  [-0.35, -0.15, 0.15],
  [-0.28, 0.2, -0.05],
]

// Receptor positions on the postsynaptic side (right)
const RECEPTORS = [
  [0.3, 0.12, 0.08],
  [0.3, -0.08, -0.12],
  [0.3, 0.0, 0.15],
  [0.3, -0.15, 0.05],
  [0.3, 0.18, -0.1],
]

export default function Synapse({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Synaptic cleft space */}
      <Box args={[0.4, 0.6, 0.5]}>
        <meshStandardMaterial
          color="#ff9800"
          transparent
          opacity={0.12}
          roughness={0.5}
          metalness={0.0}
        />
      </Box>

      {/* Cleft border lines — thin cylinders top and bottom */}
      <Cylinder args={[0.005, 0.005, 0.5, 6]} position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ff9800" transparent opacity={0.4} />
      </Cylinder>
      <Cylinder args={[0.005, 0.005, 0.5, 6]} position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#ff9800" transparent opacity={0.4} />
      </Cylinder>

      {/* Presynaptic vesicles */}
      {VESICLES.map((pos, i) => (
        <Sphere key={`vesicle-${i}`} args={[0.06, 12, 12]} position={pos}>
          <meshStandardMaterial
            color="#ffcc80"
            emissive="#e65100"
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.1}
          />
        </Sphere>
      ))}

      {/* Postsynaptic receptors — small Y-shaped markers approximated as tiny cylinders */}
      {RECEPTORS.map((pos, i) => (
        <group key={`receptor-${i}`} position={pos}>
          {/* Receptor stem */}
          <Cylinder args={[0.015, 0.015, 0.08, 6]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial
              color="#64b5f6"
              emissive="#1565c0"
              emissiveIntensity={0.3}
            />
          </Cylinder>
          {/* Receptor top arms */}
          <Cylinder args={[0.01, 0.01, 0.05, 6]} position={[0.04, 0.02, 0]} rotation={[0, 0, Math.PI / 4]}>
            <meshStandardMaterial color="#64b5f6" emissive="#1565c0" emissiveIntensity={0.3} />
          </Cylinder>
          <Cylinder args={[0.01, 0.01, 0.05, 6]} position={[0.04, -0.02, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <meshStandardMaterial color="#64b5f6" emissive="#1565c0" emissiveIntensity={0.3} />
          </Cylinder>
        </group>
      ))}
    </group>
  )
}
