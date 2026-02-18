import * as THREE from 'three'

const COLOR_RESTING = new THREE.Color('#2196f3')   // blue, below -55 mV
const COLOR_RISING = new THREE.Color('#9c27b0')     // purple, -55 to 0 mV
const COLOR_PEAK = new THREE.Color('#ff9800')        // orange, 0 to 30 mV
const COLOR_OVERSHOOT = new THREE.Color('#f44336')   // red, above 30 mV

const _result = new THREE.Color()

/**
 * Maps a membrane voltage (mV) to a color with smooth interpolation.
 * Returns a THREE.Color instance (reused — clone if you need to keep it).
 */
export function getVoltageColor(voltage) {
  if (voltage <= -55) {
    _result.copy(COLOR_RESTING)
  } else if (voltage <= 0) {
    const t = (voltage + 55) / 55 // 0 at -55, 1 at 0
    _result.copy(COLOR_RESTING).lerp(COLOR_RISING, t)
  } else if (voltage <= 30) {
    const t = voltage / 30 // 0 at 0, 1 at 30
    _result.copy(COLOR_RISING).lerp(COLOR_PEAK, t)
  } else {
    const t = Math.min((voltage - 30) / 10, 1) // 0 at 30, 1 at 40
    _result.copy(COLOR_PEAK).lerp(COLOR_OVERSHOOT, t)
  }
  return _result
}

/**
 * Returns emissive intensity (0–1) based on depolarization level.
 * Resting state has low glow; peak depolarization has strong glow.
 */
export function getEmissiveIntensity(voltage) {
  // Map from [-90, 40] to [0.1, 1.0]
  const t = Math.max(0, Math.min(1, (voltage + 90) / 130))
  return 0.1 + t * 0.9
}
