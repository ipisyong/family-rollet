import type { WheelSegment } from '../types'
import { SecureRandom } from './rng'

export interface WeightedSelection {
  segment: WheelSegment
  cumulativeWeight: number
}

export class ProbabilityCalculator {
  static calculateCumulativeWeights(segments: WheelSegment[]): WeightedSelection[] {
    const enabledSegments = segments.filter(seg => seg.enabled)
    let cumulativeWeight = 0
    
    return enabledSegments.map(segment => {
      cumulativeWeight += segment.weight
      return {
        segment,
        cumulativeWeight
      }
    })
  }

  static selectRandomSegment(segments: WheelSegment[], excludeIds: string[] = []): WheelSegment | null {
    const validSegments = segments.filter(seg => 
      seg.enabled && !excludeIds.includes(seg.id)
    )

    if (validSegments.length === 0) {
      return null
    }

    const weightedSegments = this.calculateCumulativeWeights(validSegments)
    const totalWeight = weightedSegments[weightedSegments.length - 1]?.cumulativeWeight || 0

    if (totalWeight === 0) {
      return null
    }

    const randomValue = SecureRandom.getRandomFloat() * totalWeight

    for (const weightedSegment of weightedSegments) {
      if (randomValue <= weightedSegment.cumulativeWeight) {
        return weightedSegment.segment
      }
    }

    return weightedSegments[weightedSegments.length - 1]?.segment || null
  }

  static getSegmentAngle(segment: WheelSegment, segments: WheelSegment[]): number {
    const enabledSegments = segments.filter(seg => seg.enabled)
    const segmentIndex = enabledSegments.findIndex(seg => seg.id === segment.id)
    
    if (segmentIndex === -1) {
      return 0
    }

    const segmentCount = enabledSegments.length
    const anglePerSegment = (2 * Math.PI) / segmentCount
    
    return segmentIndex * anglePerSegment + (anglePerSegment / 2)
  }

  static calculateTargetAngle(
    selectedSegment: WheelSegment, 
    segments: WheelSegment[]
  ): number {
    const baseAngle = this.getSegmentAngle(selectedSegment, segments)
    const extraRotations = SecureRandom.getRandomInt(4, 7) * 2 * Math.PI
    const angleVariation = SecureRandom.getRandomFloatInRange(-0.1, 0.1)
    
    return baseAngle + extraRotations + angleVariation
  }
}