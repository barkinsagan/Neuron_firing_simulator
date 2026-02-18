/**
 * Simplified action potential voltage profile.
 * Maps simulation time (ms) to membrane voltage (mV).
 * Total duration: ~4ms cycle.
 *
 * Phases:
 *   0–0.5ms   resting at -70 mV
 *   0.5–1.5ms depolarization: -70 → +30 mV
 *   1.5–2.5ms repolarization: +30 → -80 mV (undershoot)
 *   2.5–4.0ms recovery: -80 → -70 mV
 */

const DURATION = 4 // ms total cycle

export function getVoltageAtTime(t) {
  // Clamp to cycle duration
  const ct = Math.max(0, Math.min(t, DURATION))

  if (ct < 0.5) {
    // Resting
    return -70
  } else if (ct < 1.5) {
    // Depolarization: smooth rise from -70 to +30
    const p = (ct - 0.5) / 1.0
    // Use a sine curve for smooth acceleration/deceleration
    const s = Math.sin(p * Math.PI / 2) // 0→1 ease-out
    return -70 + 100 * s
  } else if (ct < 2.5) {
    // Repolarization: +30 → -80 (overshoot)
    const p = (ct - 1.5) / 1.0
    const s = Math.sin(p * Math.PI / 2)
    return 30 - 110 * s
  } else {
    // Recovery: -80 → -70
    const p = (ct - 2.5) / 1.5
    const s = 1 - Math.cos(p * Math.PI / 2) // ease-in
    return -80 + 10 * s
  }
}

export function getPhaseAtTime(t) {
  const ct = Math.max(0, Math.min(t, DURATION))
  if (ct < 0.5) return 'resting'
  if (ct < 1.5) return 'depolarizing'
  if (ct < 2.5) return 'repolarizing'
  return 'hyperpolarizing'
}

export { DURATION }
