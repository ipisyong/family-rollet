import { useState, useEffect } from 'react'
import Wheel3D from './components/Wheel3D'
import SegmentEditor from './components/SegmentEditor'
import PresetPicker from './components/PresetPicker'
import Confetti from './components/Confetti'
import { useWheelStore } from './state/wheel.store'
import { audioManager } from './lib/audio'
import type { WheelSegment } from './types'
import './App.css'

function App() {
  const { 
    settings, 
    history, 
    lastResult, 
    updateSegment, 
    deleteSegment, 
    addSegment,
    updateSettings,
    resetWheel
  } = useWheelStore()

  const [editingSegment, setEditingSegment] = useState<WheelSegment | null>(null)
  const [showPresetPicker, setShowPresetPicker] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    audioManager.setEnabled(settings.soundEnabled)
  }, [settings.soundEnabled])

  const handleSegmentClick = (segment: WheelSegment) => {
    setEditingSegment(segment)
  }

  const handleSegmentSave = (updates: Partial<WheelSegment>) => {
    if (editingSegment) {
      updateSegment(editingSegment.id, updates)
      setEditingSegment(null)
    }
  }

  const handleSegmentDelete = () => {
    if (editingSegment) {
      deleteSegment(editingSegment.id)
      setEditingSegment(null)
    }
  }

  const handleAddSegment = () => {
    addSegment({
      label: '새 세그먼트',
      emoji: '⭐',
      color: '#3B82F6',
      weight: 1,
      enabled: true
    })
  }

  const handleSpin = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleResetWheel = () => {
    if (confirm('롤렛을 초기화하시겠습니까? 모든 변경사항이 사라집니다.')) {
      resetWheel()
    }
  }

  return (
    <div className="app">
      <Confetti isActive={showConfetti} />
      
      <header className="app-header">
        <h1>🎲 가족 롤렛 게임</h1>
        <div className="header-controls">
          <button 
            onClick={() => setShowPresetPicker(true)}
            className="btn btn-secondary"
          >
            📋 프리셋
          </button>
          <button 
            onClick={() => setShowHistory(true)}
            className="btn btn-secondary"
          >
            📜 히스토리
          </button>
          <button 
            onClick={handleResetWheel}
            className="btn btn-danger"
          >
            🔄 초기화
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="wheel-section">
          <Wheel3D 
            onSegmentClick={handleSegmentClick}
            onSpin={handleSpin}
          />
        </div>

        {lastResult && (
          <div className="last-result">
            <h2>🎉 결과: {lastResult}</h2>
          </div>
        )}

        <div className="controls-section">
          <button 
            onClick={handleAddSegment}
            className="btn btn-primary"
          >
            ➕ 세그먼트 추가
          </button>
          
          <div className="settings-controls">
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              />
              🔊 효과음
            </label>
            
            <label className="setting-item">
              <input
                type="checkbox"
                checked={settings.vibrationEnabled}
                onChange={(e) => updateSettings({ vibrationEnabled: e.target.checked })}
              />
              📳 진동
            </label>
          </div>
        </div>

        <div className="instructions">
          <p>💡 <strong>사용법:</strong></p>
          <ul>
            <li>세그먼트를 클릭하여 편집하기</li>
            <li>스페이스바 또는 엔터키로 스핀하기</li>
            <li>프리셋으로 빠르게 시작하기</li>
          </ul>
        </div>
      </main>

      {editingSegment && (
        <SegmentEditor
          segment={editingSegment}
          onSave={handleSegmentSave}
          onDelete={handleSegmentDelete}
          onClose={() => setEditingSegment(null)}
        />
      )}

      {showPresetPicker && (
        <PresetPicker onClose={() => setShowPresetPicker(false)} />
      )}

      {showHistory && (
        <div 
          className="history-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowHistory(false)}
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
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              width: '90%',
              maxWidth: '400px',
              maxHeight: '70vh',
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
                🏆 결과 히스토리
              </h2>
              <button
                onClick={() => setShowHistory(false)}
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

            {history.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6B7280' }}>
                아직 결과가 없습니다
              </p>
            ) : (
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {history.map((result, index) => (
                  <li
                    key={index}
                    style={{
                      padding: '12px',
                      backgroundColor: index === 0 ? '#F0F9FF' : '#F9FAFB',
                      borderRadius: '8px',
                      border: index === 0 ? '1px solid #3B82F6' : '1px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: index === 0 ? '600' : '400' }}>
                      {result}
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#6B7280',
                      fontWeight: '500'
                    }}>
                      #{history.length - index}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App