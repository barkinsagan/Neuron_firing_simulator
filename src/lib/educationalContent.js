/**
 * Educational module content for the guided tour.
 * Each module has a title, steps with narration, camera positions,
 * and optional simulation actions.
 */

export const MODULES = [
  {
    id: 0,
    title: 'Welcome & Overview',
    steps: [
      {
        title: 'Welcome',
        component: 'welcome',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Tutorial',
        component: 'tutorial',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Journey Preview',
        component: 'preview',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
    ],
  },
  {
    id: 1,
    title: 'Resting Potential',
    steps: [
      {
        title: 'The Resting State',
        text: 'At rest, the neuron maintains a voltage of about -70 mV across its membrane. This is called the resting membrane potential. The inside of the cell is negative relative to the outside.',
        camera: { position: [-2, 2.5, 6], target: [-1, 1, 0] },
      },
      {
        title: 'Ion Distribution',
        text: 'Gold particles are Na+ (sodium) ions, concentrated outside the cell. Purple particles are K+ (potassium) ions, concentrated inside. This uneven distribution creates the resting potential.',
        camera: { position: [-3, 2, 5], target: [-4, 1, 0] },
      },
      {
        title: 'Ion Channels',
        text: 'Small cylinders along the axon are ion channels. At rest, voltage-gated Na+ and K+ channels are closed (notice the caps). Leak channels (gray) are always partially open.',
        camera: { position: [-1, 1.5, 3], target: [-1, 1, 0] },
      },
    ],
  },
  {
    id: 2,
    title: 'Action Potential',
    steps: [
      {
        title: 'The Trigger',
        component: 'm2_trigger',
        camera: { position: [-5, 2, 5], target: [-4.5, 1.2, 0] },
        interactive: true,
      },
      {
        title: 'Threshold',
        component: 'm2_threshold',
        camera: { position: [-3, 2, 4], target: [-2.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Rising Phase',
        component: 'm2_rising',
        camera: { position: [-1, 1.5, 3], target: [-1, 1, 0] },
        interactive: true,
      },
      {
        title: 'Peak & Inactivation',
        component: 'm2_peak',
        camera: { position: [-1, 1.2, 2.5], target: [-1, 1, 0] },
        interactive: true,
      },
      {
        title: 'Falling Phase',
        component: 'm2_falling',
        camera: { position: [-1, 1.5, 3], target: [-1, 1, 0] },
        interactive: true,
      },
      {
        title: 'Hyperpolarization',
        component: 'm2_hyperpolarization',
        camera: { position: [-1, 2, 4], target: [-1, 1, 0] },
        interactive: true,
      },
      {
        title: 'Refractory Period',
        component: 'm2_refractory',
        camera: { position: [0, 3, 8], target: [0, 1, 0] },
        interactive: true,
      },
      {
        title: 'Summary',
        component: 'm2_summary',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
    ],
  },
  {
    id: 3,
    title: 'Propagation Along the Axon',
    steps: [
      {
        title: 'Long Distance',
        component: 'm3_longDistance',
        camera: { position: [2, 4, 12], target: [1, 1, 0] },
        interactive: true,
      },
      {
        title: 'Domino Effect',
        component: 'm3_dominoEffect',
        camera: { position: [0, 2.5, 6], target: [0, 1, 0] },
        interactive: true,
      },
      {
        title: 'Speed Problem',
        component: 'm3_speedProblem',
        camera: { position: [0, 2.5, 6], target: [0, 1, 0] },
        interactive: true,
      },
      {
        title: 'Saltatory Conduction',
        component: 'm3_saltatoryConduction',
        camera: { position: [0, 2, 5], target: [1, 1, 0] },
        interactive: true,
      },
      {
        title: 'One Node',
        component: 'm3_oneNode',
        camera: { position: [-1, 1.2, 2.5], target: [-1, 1, 0] },
        interactive: true,
      },
      {
        title: 'Summary',
        component: 'm3_summary',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
    ],
  },
  {
    id: 4,
    title: 'The Synapse',
    steps: [
      {
        title: 'The Synaptic Cleft',
        component: 'm4_theGap',
        camera: { position: [3.5, 2.5, 5], target: [2.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Why Chemical Signaling?',
        component: 'm4_whyChemical',
        camera: { position: [3, 2, 4], target: [2.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Calcium: The Trigger',
        component: 'm4_calcium',
        camera: { position: [2.2, 1.5, 2.5], target: [2.2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Vesicles & Neurotransmitters',
        component: 'm4_vesicles',
        camera: { position: [2.0, 1.3, 1.8], target: [2.2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Exocytosis',
        component: 'm4_exocytosis',
        camera: { position: [2.1, 1.2, 1.5], target: [2.3, 1, 0] },
        interactive: true,
      },
      {
        title: 'Diffusion',
        component: 'm4_diffusion',
        camera: { position: [2.5, 1.3, 2], target: [2.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Receptor Binding',
        component: 'm4_binding',
        camera: { position: [2.9, 1.2, 1.8], target: [2.8, 1, 0] },
        interactive: true,
      },
      {
        title: 'EPSP',
        component: 'm4_epsp',
        camera: { position: [4.5, 2, 4], target: [4.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Inhibition',
        component: 'm4_inhibitory',
        camera: { position: [4, 2, 5], target: [3.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Signal Termination',
        component: 'm4_termination',
        camera: { position: [2.5, 1.5, 3], target: [2.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Summary',
        component: 'm4_summary',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
    ],
  },
  {
    id: 5,
    title: 'Neural Circuits',
    steps: [
      {
        title: 'The Integration Problem',
        component: 'm5_integration',
        camera: { position: [4.5, 3, 8], target: [3, 1, 0] },
        interactive: true,
      },
      {
        title: 'Spatial Summation',
        component: 'm5_spatialSummation',
        camera: { position: [4, 2.5, 6], target: [3.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Temporal Summation',
        component: 'm5_temporalSummation',
        camera: { position: [4, 2.5, 6], target: [3.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Excitation vs Inhibition',
        component: 'm5_decision',
        camera: { position: [4, 2, 5], target: [3.5, 1, 0] },
        interactive: true,
      },
      {
        title: 'Convergence',
        component: 'm5_convergence',
        camera: { position: [3, 3, 10], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Divergence',
        component: 'm5_divergence',
        camera: { position: [3, 3, 10], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Feedforward Excitation',
        component: 'm5_feedforward',
        camera: { position: [2, 3, 8], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Feedback Inhibition',
        component: 'm5_feedbackInhibition',
        camera: { position: [2, 3, 8], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Lateral Inhibition',
        component: 'm5_lateralInhibition',
        camera: { position: [2, 3, 8], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'The Stretch Reflex',
        component: 'm5_stretchReflex',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Summary',
        component: 'm5_summary',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
    ],
  },
  {
    id: 6,
    title: 'Conclusion & Next Steps',
    steps: [
      {
        title: 'Journey Complete',
        component: 'm6_journeyComplete',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'The Bigger Context',
        component: 'm6_biggerContext',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Clinical Connections',
        component: 'm6_clinicalConnections',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Explore More',
        component: 'm6_exploreMore',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
      {
        title: 'Thank You',
        component: 'm6_feedback',
        camera: { position: [2, 5, 16], target: [2, 1, 0] },
        interactive: true,
      },
    ],
  },
]
