# Neural Circuit Visualizer

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://barkinsagan.github.io/neural-visualizer)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb)](https://react.dev)

## What Is This?

An interactive 3D visualization of neural signaling, from resting potential to circuit-level computation. Walk through a guided tour that explains how neurons fire, propagate signals, communicate across synapses, and form functional circuits — all rendered in real-time 3D with accurate biophysics.

## Live Demo

**[https://barkinsagan.github.io/neural-visualizer](https://barkinsagan.github.io/neural-visualizer)**

## Features

- Interactive 3D neuron visualization with realistic morphology
- Action potential propagation with voltage-gated ion channel animations
- Na+, K+, and Ca2+ ion particle systems
- Synaptic transmission with neurotransmitter release and diffusion
- Postsynaptic response with EPSP/IPSP demonstration
- 7 guided educational modules (40+ interactive steps)
- Spatial and temporal summation simulations
- Circuit motif demonstrations (feedforward, feedback inhibition, lateral inhibition)
- Smooth camera animations between learning stages
- Real-time voltage tracking and threshold detection

## Screenshots

<!-- Add screenshots here -->
<!-- ![Overview](screenshots/overview.png) -->
<!-- ![Action Potential](screenshots/action-potential.png) -->
<!-- ![Synapse](screenshots/synapse.png) -->

## Tech Stack

| Library | Purpose |
|---------|---------|
| [React](https://react.dev) + [Vite](https://vite.dev) | UI framework and build tool |
| [Three.js](https://threejs.org) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | 3D rendering |
| [@react-three/drei](https://github.com/pmndrs/drei) | 3D helpers (OrbitControls, Environment, Grid) |
| [@react-three/postprocessing](https://github.com/pmndrs/postprocessing) | Bloom and visual effects |
| [Zustand](https://zustand-demo.pmnd.rs) | State management |
| [GSAP](https://gsap.com) | Camera and UI animations |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/barkinsagan/neural-visualizer.git
cd neural-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Educational Content

The guided tour covers 7 modules with 40+ interactive steps:

| Module | Topic | Key Concepts |
|--------|-------|-------------|
| 0 | Welcome & Overview | Introduction, tutorial, journey preview |
| 1 | Resting Potential | Ion gradients, membrane voltage, leak channels |
| 2 | Action Potential | Threshold, depolarization, repolarization, refractory period |
| 3 | Propagation | Domino effect, myelin, saltatory conduction, nodes of Ranvier |
| 4 | The Synapse | Calcium trigger, vesicles, exocytosis, receptor binding, EPSP/IPSP |
| 5 | Neural Circuits | Spatial/temporal summation, convergence/divergence, circuit motifs, stretch reflex |
| 6 | Conclusion | Clinical connections, brain-scale context, further resources |

## Scientific Accuracy

The simulation models real electrophysiological values:

| Parameter | Value |
|-----------|-------|
| Resting potential | -70 mV |
| Threshold | -55 mV |
| Peak voltage | +30 mV |
| Hyperpolarization | -80 mV |
| AP duration | ~4 ms |
| Synaptic cleft width | 20-40 nm |
| Saltatory conduction speed | 50-120 m/s |
| EPSP size | ~0.5-3 mV per synapse |

## Future Features

- Segmented voltage display along the axon
- Additional circuit motifs (oscillators, central pattern generators)
- Adjustable ion concentrations and channel densities
- VR/AR support for immersive exploration
- Multi-language support
- Exportable simulation snapshots

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please feel free to:

- [Open an issue](https://github.com/barkinsagan/neural-visualizer/issues) for bugs or feature requests
- Submit a pull request with improvements
- Suggest new educational content or modules

---

Built with care for neuroscience education.
