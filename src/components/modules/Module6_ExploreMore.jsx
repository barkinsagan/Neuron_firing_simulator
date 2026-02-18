import { useEffect } from 'react'
import useStore from '../../lib/store'

const RESOURCES = [
  {
    type: 'Textbook',
    name: 'Principles of Neural Science',
    author: 'Kandel et al.',
  },
  {
    type: 'Online',
    name: 'Neuroscience Online',
    author: 'UTHealth Houston',
  },
  {
    type: 'Videos',
    name: '2-Minute Neuroscience',
    author: 'YouTube series',
  },
  {
    type: 'Interactive',
    name: 'This visualization',
    author: 'Keep exploring!',
  },
]

export default function Module6_ExploreMore({ onAdvance }) {
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
  }, [])

  return (
    <div className="m6-step">
      <h3 className="m6-step-title">Explore More</h3>

      <p className="m6-narration">
        The guided tour is complete, but your exploration doesn't have to end here.
        All features are now unlocked — take your time to experiment.
      </p>

      {/* Free exploration features */}
      <div className="m6-features-box">
        <div className="m6-features-title">Free Exploration Mode</div>
        <div className="m6-feature-list">
          <div className="m6-feature-item">
            <span className="m6-feature-check">&#10003;</span>
            <span>Replay the full signal sequence at any speed</span>
          </div>
          <div className="m6-feature-item">
            <span className="m6-feature-check">&#10003;</span>
            <span>Rotate and zoom the 3D visualization freely</span>
          </div>
          <div className="m6-feature-item">
            <span className="m6-feature-check">&#10003;</span>
            <span>Toggle ion visibility and labels</span>
          </div>
          <div className="m6-feature-item">
            <span className="m6-feature-check">&#10003;</span>
            <span>Use camera presets to jump between regions</span>
          </div>
          <div className="m6-feature-item">
            <span className="m6-feature-check">&#10003;</span>
            <span>Adjust simulation speed with the controls</span>
          </div>
        </div>
      </div>

      {/* Additional resources */}
      <div className="m6-resources">
        <div className="m6-resources-title">Additional Resources</div>
        {RESOURCES.map((r, i) => (
          <div key={i} className="m6-resource-item">
            <span className="m6-resource-type">{r.type}</span>
            <div className="m6-resource-info">
              <span className="m6-resource-name">{r.name}</span>
              <span className="m6-resource-author">{r.author}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="m6-nav-row">
        <button className="m0-btn-primary" onClick={onAdvance}>
          Continue
        </button>
      </div>
    </div>
  )
}
