import type { WheelPreset, WheelSegment } from '../types'

export const WHEEL_PRESETS: WheelPreset[] = [
  {
    id: 'family-rewards',
    name: '가족 보상',
    description: '가족을 위한 즐거운 보상들',
    segments: [
      { label: '게임 30분', emoji: '🎮', color: '#F59E0B', weight: 1, enabled: true },
      { label: '과자 고르기', emoji: '🍪', color: '#10B981', weight: 1, enabled: true },
      { label: '영화 선택권', emoji: '🎬', color: '#3B82F6', weight: 1, enabled: true },
      { label: '10시 취침 패스', emoji: '💤', color: '#8B5CF6', weight: 1, enabled: true },
      { label: '용돈 1000원', emoji: '💰', color: '#EC4899', weight: 1, enabled: true },
      { label: '외식 메뉴 선택', emoji: '🍽️', color: '#84CC16', weight: 1, enabled: true }
    ]
  },
  {
    id: 'chore-assignment',
    name: '당번 정하기',
    description: '집안일 당번을 공정하게',
    segments: [
      { label: '설거지 당번', emoji: '🧽', color: '#EF4444', weight: 1, enabled: true },
      { label: '청소 당번', emoji: '🧹', color: '#F97316', weight: 1, enabled: true },
      { label: '쓰레기 버리기', emoji: '🗑️', color: '#6B7280', weight: 1, enabled: true },
      { label: '빨래 개기', emoji: '👕', color: '#06B6D4', weight: 1, enabled: true },
      { label: '화분 물주기', emoji: '🪴', color: '#10B981', weight: 1, enabled: true }
    ]
  },
  {
    id: 'menu-selection',
    name: '메뉴 고르기',
    description: '오늘 뭐 먹을지 정하기',
    segments: [
      { label: '치킨', emoji: '🍗', color: '#F59E0B', weight: 1, enabled: true },
      { label: '피자', emoji: '🍕', color: '#EF4444', weight: 1, enabled: true },
      { label: '짜장면', emoji: '🍜', color: '#8B5CF6', weight: 1, enabled: true },
      { label: '한식', emoji: '🍚', color: '#10B981', weight: 1, enabled: true },
      { label: '분식', emoji: '🥞', color: '#F97316', weight: 1, enabled: true },
      { label: '중식', emoji: '🥢', color: '#3B82F6', weight: 1, enabled: true },
      { label: '집밥', emoji: '🏠', color: '#84CC16', weight: 1, enabled: true }
    ]
  },
  {
    id: 'weekend-activity',
    name: '주말 활동',
    description: '주말에 무엇을 할까?',
    segments: [
      { label: '영화관 가기', emoji: '🎬', color: '#3B82F6', weight: 1, enabled: true },
      { label: '공원 산책', emoji: '🌳', color: '#10B981', weight: 1, enabled: true },
      { label: '보드게임', emoji: '🎲', color: '#F59E0B', weight: 1, enabled: true },
      { label: '카페 가기', emoji: '☕', color: '#8B5CF6', weight: 1, enabled: true },
      { label: '쇼핑몰', emoji: '🛒', color: '#EC4899', weight: 1, enabled: true },
      { label: '집에서 휴식', emoji: '🏠', color: '#6B7280', weight: 1, enabled: true }
    ]
  },
  {
    id: 'study-break',
    name: '공부 휴식',
    description: '공부하다 지칠 때',
    segments: [
      { label: '15분 휴식', emoji: '😌', color: '#10B981', weight: 2, enabled: true },
      { label: '스트레칭', emoji: '🤸', color: '#F97316', weight: 2, enabled: true },
      { label: '물 마시기', emoji: '💧', color: '#06B6D4', weight: 3, enabled: true },
      { label: '간식 먹기', emoji: '🍪', color: '#F59E0B', weight: 1, enabled: true },
      { label: '5분 산책', emoji: '🚶', color: '#84CC16', weight: 2, enabled: true }
    ]
  },
  {
    id: 'birthday-gifts',
    name: '생일 선물',
    description: '생일 선물 아이디어',
    segments: [
      { label: '책', emoji: '📚', color: '#8B5CF6', weight: 1, enabled: true },
      { label: '게임', emoji: '🎮', color: '#F59E0B', weight: 1, enabled: true },
      { label: '옷', emoji: '👕', color: '#EC4899', weight: 1, enabled: true },
      { label: '운동용품', emoji: '⚽', color: '#10B981', weight: 1, enabled: true },
      { label: '문구용품', emoji: '✏️', color: '#3B82F6', weight: 1, enabled: true },
      { label: '간식 세트', emoji: '🍫', color: '#F97316', weight: 1, enabled: true }
    ]
  }
]

export function createSegmentFromPreset(preset: WheelPreset): WheelSegment[] {
  return preset.segments.map((segment, index) => ({
    ...segment,
    id: `preset-${preset.id}-${index}-${Date.now()}`
  }))
}

export function findPresetById(id: string): WheelPreset | undefined {
  return WHEEL_PRESETS.find(preset => preset.id === id)
}