import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, WheelSegment, AppSettings } from '../types'

const defaultSegments: WheelSegment[] = [
  { id: 'seg-1', label: '게임 30분', emoji: '🎮', color: '#F59E0B', weight: 1, enabled: true },
  { id: 'seg-2', label: '과자 고르기', emoji: '🍪', color: '#10B981', weight: 1, enabled: true },
  { id: 'seg-3', label: '영화 선택권', emoji: '🎬', color: '#3B82F6', weight: 1, enabled: true },
  { id: 'seg-4', label: '설거지 당번', emoji: '🧽', color: '#EF4444', weight: 1, enabled: true },
  { id: 'seg-5', label: '외식 메뉴', emoji: '🍽️', color: '#8B5CF6', weight: 1, enabled: true },
  { id: 'seg-6', label: '청소 당번', emoji: '🧹', color: '#F97316', weight: 1, enabled: true },
]

const defaultSettings: AppSettings = {
  theme: 'light',
  language: 'ko',
  noRepeatLast: 0,
  soundEnabled: true,
  vibrationEnabled: true,
  motionReduced: false,
}

interface WheelStore extends AppState {
  // Actions
  updateSegment: (id: string, updates: Partial<WheelSegment>) => void
  addSegment: (segment: Omit<WheelSegment, 'id'>) => void
  deleteSegment: (id: string) => void
  reorderSegments: (segments: WheelSegment[]) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  setSpinning: (spinning: boolean) => void
  addToHistory: (result: string) => void
  setLastResult: (result: string) => void
  resetWheel: () => void
  loadPreset: (segments: WheelSegment[]) => void
}

export const useWheelStore = create<WheelStore>()(
  persist(
    (set) => ({
      version: 1,
      wheel: {
        segments: defaultSegments,
      },
      settings: defaultSettings,
      history: [],
      isSpinning: false,
      lastResult: undefined,

      updateSegment: (id, updates) =>
        set((state) => ({
          wheel: {
            ...state.wheel,
            segments: state.wheel.segments.map((seg) =>
              seg.id === id ? { ...seg, ...updates } : seg
            ),
          },
        })),

      addSegment: (segment) =>
        set((state) => ({
          wheel: {
            ...state.wheel,
            segments: [
              ...state.wheel.segments,
              {
                ...segment,
                id: `seg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              },
            ],
          },
        })),

      deleteSegment: (id) =>
        set((state) => ({
          wheel: {
            ...state.wheel,
            segments: state.wheel.segments.filter((seg) => seg.id !== id),
          },
        })),

      reorderSegments: (segments) =>
        set((state) => ({
          wheel: {
            ...state.wheel,
            segments,
          },
        })),

      updateSettings: (settings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        })),

      setSpinning: (spinning) =>
        set(() => ({
          isSpinning: spinning,
        })),

      addToHistory: (result) =>
        set((state) => ({
          history: [result, ...state.history].slice(0, 20),
        })),

      setLastResult: (result) =>
        set(() => ({
          lastResult: result,
        })),

      resetWheel: () =>
        set(() => ({
          wheel: {
            segments: defaultSegments,
          },
          history: [],
          lastResult: undefined,
        })),

      loadPreset: (segments) =>
        set((state) => ({
          wheel: {
            ...state.wheel,
            segments,
          },
        })),
    }),
    {
      name: 'rollet-game-storage',
      version: 1,
    }
  )
)