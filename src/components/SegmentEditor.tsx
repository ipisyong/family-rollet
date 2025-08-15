import { useState } from 'react'
import type { WheelSegment } from '../types'

interface SegmentEditorProps {
  segment: WheelSegment
  onSave: (updates: Partial<WheelSegment>) => void
  onDelete: () => void
  onClose: () => void
}

const PRESET_COLORS = [
  '#F59E0B', '#10B981', '#3B82F6', '#EF4444', 
  '#8B5CF6', '#F97316', '#EC4899', '#84CC16',
  '#06B6D4', '#6366F1', '#F472B6', '#A855F7'
]

const PRESET_EMOJIS = [
  '🎮', '🍪', '🎬', '🧽', '🍽️', '🧹', '💤', '🚶',
  '📚', '🎵', '🎨', '⚽', '🏠', '🛒', '🍕', '🎂',
  '🎁', '🌟', '💝', '🎉', '🔥', '⭐', '🎯', '🏆'
]

export default function SegmentEditor({ segment, onSave, onDelete, onClose }: SegmentEditorProps) {
  const [label, setLabel] = useState(segment.label)
  const [emoji, setEmoji] = useState(segment.emoji)
  const [color, setColor] = useState(segment.color)
  const [weight, setWeight] = useState(segment.weight)
  const [enabled, setEnabled] = useState(segment.enabled)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSave = () => {
    onSave({
      label: label.trim(),
      emoji,
      color,
      weight: Math.max(1, weight),
      enabled
    })
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="segment-editor-overlay"
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="segment-editor-modal"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-primary)',
          padding: '32px',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          width: '90%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <h2 style={{ 
          margin: '0 0 32px 0', 
          fontSize: '24px', 
          fontWeight: '700',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          🎨 세그먼트 편집
        </h2>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontSize: '16px'
          }}>
            라벨
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              fontSize: '16px',
              backgroundColor: 'var(--bg-button)',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            placeholder="라벨을 입력하세요"
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontSize: '16px'
          }}>
            이모지
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              style={{
                padding: '12px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-button)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'all 0.3s ease'
              }}
            >
              {emoji}
            </button>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: 'var(--bg-button)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              placeholder="이모지를 입력하세요"
            />
          </div>
          
          {showEmojiPicker && (
            <div style={{
              marginTop: '8px',
              padding: '12px',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-tertiary)',
              backdropFilter: 'var(--blur-sm)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '8px'
              }}>
                {PRESET_EMOJIS.map((presetEmoji) => (
                  <button
                    key={presetEmoji}
                    type="button"
                    onClick={() => {
                      setEmoji(presetEmoji)
                      setShowEmojiPicker(false)
                    }}
                    style={{
                      padding: '12px 8px',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                      backgroundColor: presetEmoji === emoji ? 'var(--accent-primary)' : 'var(--bg-button)',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {presetEmoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontSize: '16px'
          }}>
            색상
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: '48px',
                height: '48px',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                fontSize: '16px',
                fontFamily: 'monospace',
                backgroundColor: 'var(--bg-button)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
          
          <div style={{
            marginTop: '8px',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '4px'
          }}>
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                onClick={() => setColor(presetColor)}
                style={{
                  width: '100%',
                  height: '36px',
                  backgroundColor: presetColor,
                  border: color === presetColor ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            fontSize: '16px'
          }}>
            가중치 (확률)
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setWeight(Math.max(1, weight - 1))}
              style={{
                padding: '12px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-button)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              -
            </button>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                fontSize: '16px',
                textAlign: 'center',
                backgroundColor: 'var(--bg-button)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
            <button
              type="button"
              onClick={() => setWeight(weight + 1)}
              style={{
                padding: '12px 16px',
                border: '1px solid var(--border-primary)',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-button)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              +
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer',
            padding: '12px 16px',
            backgroundColor: 'var(--bg-button)',
            border: '1px solid var(--border-primary)',
            borderRadius: '12px',
            transition: 'all 0.3s ease'
          }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              style={{ 
                width: '20px', 
                height: '20px',
                accentColor: 'var(--accent-primary)'
              }}
            />
            <span style={{ 
              fontWeight: '600',
              color: 'var(--text-primary)',
              fontSize: '16px'
            }}>활성화</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button
            onClick={onDelete}
            style={{
              padding: '14px 20px',
              backgroundColor: 'var(--accent-danger)',
              color: 'white',
              border: '1px solid var(--accent-danger)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              minHeight: '48px'
            }}
          >
            삭제
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px 20px',
              backgroundColor: 'var(--bg-button)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              minHeight: '48px'
            }}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '14px 20px',
              backgroundColor: 'var(--accent-success)',
              color: 'white',
              border: '1px solid var(--accent-success)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              minHeight: '48px'
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}