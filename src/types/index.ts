export interface WheelSegment {
  id: string
  label: string
  emoji: string
  color: string
  weight: number
  enabled: boolean
}

export interface WheelConfiguration {
  segments: WheelSegment[]
}

export interface AppSettings {
  theme: 'light' | 'dark'
  language: 'ko' | 'en'
  noRepeatLast: number
  soundEnabled: boolean
  vibrationEnabled: boolean
  motionReduced: boolean
}

export interface AppState {
  version: number
  wheel: WheelConfiguration
  settings: AppSettings
  history: string[]
  isSpinning: boolean
  lastResult?: string
}

export interface SpinResult {
  segmentId: string
  segment: WheelSegment
  finalAngle: number
  duration: number
}

export interface WheelPreset {
  id: string
  name: string
  description: string
  segments: Omit<WheelSegment, 'id'>[]
}