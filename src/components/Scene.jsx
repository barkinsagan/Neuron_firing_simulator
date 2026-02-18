import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Neuron from './Neuron'
import Synapse from './Synapse'
import Neurotransmitters from './Neurotransmitters'
import { SynapseLabels } from './NeuronLabels'
import { CameraController } from './CameraPresets'
import IonParticles from './IonParticles'
import useStore from '../lib/store'

const postVoltageSelector = (s) => s.postVoltage
const postPhaseSelector = (s) => s.postPhase
const postTimeSelector = (s) => s.postTime

export default function Scene() {
  const showLabels = useStore((s) => s.showLabels)

  return (
    <>
      {/* Dark gradient background */}
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 15, 30]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-3, 3, -3]} intensity={0.5} color="#4488ff" />
      <pointLight position={[3, 1, 3]} intensity={0.3} color="#ff6644" />

      {/* Environment for reflections and ambient fill */}
      <Environment preset="night" />

      {/* Ground grid */}
      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#1a1a2e"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#2a2a4e"
        fadeDistance={20}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Presynaptic neuron (green, axon extends +X toward synapse) */}
      <Neuron position={[-4, 1, 0]} showIonParticles={false} />

      {/* Synapse cleft structure */}
      <Synapse position={[2.5, 1, 0]} />

      {/* Neurotransmitter particles (in synapse local space) */}
      <Neurotransmitters position={[2.5, 1, 0]} />

      {/* Synapse labels */}
      <SynapseLabels position={[2.5, 1, 0]} />

      {/* Postsynaptic neuron (blue, dendrites face -X toward synapse, axon extends +X away) */}
      <Neuron
        position={[4.5, 1, 0]}
        baseColor="#2196f3"
        dendriteColor="#1976d2"
        terminalColor="#64b5f6"
        terminalEmissive="#0d47a1"
        useVoltageColor={true}
        voltageSelector={postVoltageSelector}
        phaseSelector={postPhaseSelector}
        timeSelector={postTimeSelector}
        showWave={false}
        showPostWave={true}
        showIonParticles={false}
        labelType="post"
      />

      {/* Ion particles (world space, covers both neurons) */}
      <IonParticles />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
      </EffectComposer>

      {/* Camera controls */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2 + 0.2}
        target={[2, 1, 0]}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />

      {/* Camera animation controller */}
      <CameraController />
    </>
  )
}
