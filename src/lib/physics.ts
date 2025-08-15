import { SecureRandom } from './rng'

export interface SpinPhysics {
  duration: number
  targetAngle: number
  startVelocity: number
  friction: number
}

export class WheelPhysics {
  static calculateSpinPhysics(targetAngle: number): SpinPhysics {
    const baseDuration = 4.5 * 1000
    const durationVariation = SecureRandom.getRandomFloatInRange(-1.5, 1.5) * 1000
    const duration = Math.max(3000, baseDuration + durationVariation)

    const startVelocity = SecureRandom.getRandomFloatInRange(15, 25)

    const friction = this.calculateFriction(targetAngle, duration, startVelocity)

    return {
      duration,
      targetAngle,
      startVelocity,
      friction
    }
  }

  private static calculateFriction(
    targetAngle: number,
    duration: number,
    startVelocity: number
  ): number {
    const timeInSeconds = duration / 1000
    return (startVelocity * timeInSeconds - targetAngle) / (0.5 * timeInSeconds * timeInSeconds)
  }

  static easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3)
  }

  static easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4)
  }

  static calculateCurrentAngle(
    physics: SpinPhysics,
    elapsedTime: number
  ): number {
    const t = Math.min(elapsedTime / physics.duration, 1)
    const easedProgress = this.easeOutCubic(t)
    return easedProgress * physics.targetAngle
  }

  static calculateCurrentVelocity(
    physics: SpinPhysics,
    elapsedTime: number
  ): number {
    if (elapsedTime >= physics.duration) return 0
    
    const t = elapsedTime / physics.duration
    const remainingProgress = 1 - t
    return physics.startVelocity * Math.pow(remainingProgress, 2)
  }

  static isNearBoundary(
    currentAngle: number,
    segmentCount: number,
    threshold: number = 3
  ): boolean {
    const segmentAngle = (2 * Math.PI) / segmentCount
    const normalizedAngle = ((currentAngle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)
    const segmentPosition = normalizedAngle % segmentAngle
    const thresholdRadians = (threshold * Math.PI) / 180

    return segmentPosition < thresholdRadians || 
           segmentPosition > (segmentAngle - thresholdRadians)
  }

  static shouldPlayTickSound(
    previousAngle: number,
    currentAngle: number,
    segmentCount: number
  ): boolean {
    const segmentAngle = (2 * Math.PI) / segmentCount
    const prevSegment = Math.floor(previousAngle / segmentAngle)
    const currentSegment = Math.floor(currentAngle / segmentAngle)
    
    return prevSegment !== currentSegment
  }
}