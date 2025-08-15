import { useState } from 'react'
import { WHEEL_PRESETS, createSegmentFromPreset } from '../data/presets'
import { useWheelStore } from '../state/wheel.store'

interface PresetPickerProps {
  onClose: () => void
}

export default function PresetPicker({ onClose }: PresetPickerProps) {
  const { loadPreset } = useWheelStore()
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)

  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId)
    const preset = WHEEL_PRESETS.find(p => p.id === presetId)
    if (preset) {
      const segments = createSegmentFromPreset(preset)
      loadPreset(segments)
      onClose()
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="preset-picker-overlay"
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="preset-picker-modal"
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
            프리셋 선택
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6B7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {WHEEL_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              style={{
                border: selectedPresetId === preset.id ? '2px solid #3B82F6' : '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                backgroundColor: selectedPresetId === preset.id ? '#F0F9FF' : 'white',
                transition: 'all 0.2s ease'
              }}
            >
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '16px', 
                fontWeight: '600',
                color: '#1F2937'
              }}>
                {preset.name}
              </h3>
              
              <p style={{ 
                margin: '0 0 12px 0', 
                fontSize: '14px', 
                color: '#6B7280'
              }}>
                {preset.description}
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px'
              }}>
                {preset.segments.slice(0, 6).map((segment, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 8px',
                      backgroundColor: segment.color + '20',
                      color: segment.color,
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: `1px solid ${segment.color}40`
                    }}
                  >
                    {segment.emoji} {segment.label}
                  </span>
                ))}
                {preset.segments.length > 6 && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 8px',
                    backgroundColor: '#F3F4F6',
                    color: '#6B7280',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    +{preset.segments.length - 6}개 더
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#F3F4F6',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}