import { useEffect } from 'react'
import useStore from '../../lib/store'

export default function Module6_Feedback({ onAdvance }) {
  useEffect(() => {
    useStore.getState().pause()
    useStore.getState().setCurrentTime(0)
    if (window.__cameraAnimateTo) {
      window.__cameraAnimateTo({
        position: [2, 5, 16],
        target: [2, 1, 0],
      })
    }
  }, [])

  const exitTour = () => {
    useStore.getState().exitEducationalMode()
  }

  return (
    <div className="m6-step m6-step--summary">
      <h3 className="m6-step-title">Thank You!</h3>

      <p className="m6-narration" style={{ textAlign: 'center' }}>
        Thank you for taking this journey through neural signaling.
        From ion channels to neural circuits — you now understand how
        the brain's fundamental building blocks work.
      </p>

      <div className="m6-thankyou-visual">
        <div className="m6-thankyou-glow" />
        <div className="m6-thankyou-text">Keep Exploring</div>
      </div>

      {/* Share & contribute */}
      <div className="m6-share-box">
        <div className="m6-share-item">
          <span className="m6-share-icon">&#x1f4e4;</span>
          <span>Share this visualization with others</span>
        </div>
        <div className="m6-share-item">
          <span className="m6-share-icon">&#x1f4ac;</span>
          <span>Send us feedback on what could be improved</span>
        </div>
        <div className="m6-share-item">
          <span className="m6-share-icon">&#x2b50;</span>
          <span>Suggest topics for future modules</span>
        </div>
      </div>

      <div className="m6-final-nav">
        <button className="m6-action-btn m6-action-btn--secondary" onClick={() => useStore.getState().goToModule(0)}>
          Restart Tour
        </button>
        <button className="m6-action-btn m6-action-btn--finish" onClick={exitTour}>
          Exit to Free Explore
        </button>
      </div>
    </div>
  )
}
