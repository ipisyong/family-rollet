import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, PerspectiveCamera } from '@react-three/drei'
import { Group, Mesh, Color } from 'three'
import { useSpring, animated } from '@react-spring/three'
import { useWheelStore } from '../state/wheel.store'
import { WheelPhysics, type SpinPhysics } from '../lib/physics'
import { ProbabilityCalculator } from '../lib/probability'
import { audioManager } from '../lib/audio'
import type { WheelSegment } from '../types'

interface WheelSegmentProps {
  segment: WheelSegment
  index: number
  totalSegments: number
  radius: number
  onClick: (segment: WheelSegment) => void
}

function WheelSegment3D({ segment, index, totalSegments, radius, onClick }: WheelSegmentProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const anglePerSegment = (Math.PI * 2) / totalSegments
  const startAngle = index * anglePerSegment

  const points: [number, number, number][] = []
  points.push([0, 0, 0])
  
  const segments = 32
  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (anglePerSegment * i) / segments
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    points.push([x, y, 0])
  }

  const color = new Color(segment.color)
  const hoverColor = color.clone().multiplyScalar(1.2)

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={() => onClick(segment)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <ringGeometry args={[0, radius, totalSegments, 1, startAngle, anglePerSegment]} />
        <meshLambertMaterial 
          color={hovered ? hoverColor : color} 
          transparent 
          opacity={segment.enabled ? 1 : 0.5}
        />
      </mesh>
      
      <Text
        position={[
          Math.cos(startAngle + anglePerSegment / 2) * (radius * 0.7),
          Math.sin(startAngle + anglePerSegment / 2) * (radius * 0.7),
          0.01
        ]}
        fontSize={0.3}
        color={segment.enabled ? '#ffffff' : '#999999'}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
      >
        {segment.emoji} {segment.label}
      </Text>
    </group>
  )
}

interface WheelProps {
  onSegmentClick: (segment: WheelSegment) => void
  spinPhysics: SpinPhysics | null
  onSpinComplete: (segment: WheelSegment) => void
}

function Wheel({ onSegmentClick, spinPhysics, onSpinComplete }: WheelProps) {
  const groupRef = useRef<Group>(null)
  const allSegments = useWheelStore(state => state.wheel.segments)
  const segments = useMemo(() => allSegments.filter(seg => seg.enabled), [allSegments])
  const [currentAngle, setCurrentAngle] = useState(0)
  const [lastTickAngle, setLastTickAngle] = useState(0)
  const [animationStartTime, setAnimationStartTime] = useState<number | null>(null)

  const { rotation } = useSpring({
    rotation: currentAngle,
    config: { duration: 100 }
  })

  useFrame(() => {
    if (!spinPhysics || !animationStartTime) return

    const elapsedTime = Date.now() - animationStartTime
    
    if (elapsedTime >= spinPhysics.duration) {
      setCurrentAngle(spinPhysics.targetAngle)
      setAnimationStartTime(null)
      
      const finalAngle = spinPhysics.targetAngle % (Math.PI * 2)
      const segmentAngle = (Math.PI * 2) / segments.length
      const segmentIndex = Math.floor((Math.PI * 2 - finalAngle) / segmentAngle) % segments.length
      const selectedSegment = segments[segmentIndex]
      
      if (selectedSegment) {
        onSpinComplete(selectedSegment)
      }
      return
    }

    const newAngle = WheelPhysics.calculateCurrentAngle(spinPhysics, elapsedTime)
    setCurrentAngle(newAngle)

    if (WheelPhysics.shouldPlayTickSound(lastTickAngle, newAngle, segments.length)) {
      const velocity = WheelPhysics.calculateCurrentVelocity(spinPhysics, elapsedTime)
      const frequency = 400 + (velocity * 10)
      audioManager.playTickSound(frequency, 30)
      setLastTickAngle(newAngle)
    }

    if (WheelPhysics.isNearBoundary(newAngle, segments.length)) {
      audioManager.triggerVibration(50)
    }
  })

  useEffect(() => {
    if (spinPhysics) {
      setAnimationStartTime(Date.now())
      setCurrentAngle(0)
      setLastTickAngle(0)
    }
  }, [spinPhysics])

  if (segments.length === 0) {
    return (
      <Text position={[0, 0, 0]} fontSize={0.5} color="#ffffff" anchorX="center" anchorY="middle">
        세그먼트를 추가해주세요
      </Text>
    )
  }

  return (
    <animated.group ref={groupRef} rotation-z={rotation}>
      {segments.map((segment, index) => (
        <WheelSegment3D
          key={segment.id}
          segment={segment}
          index={index}
          totalSegments={segments.length}
          radius={3}
          onClick={onSegmentClick}
        />
      ))}
      
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.1, 32]} />
        <meshLambertMaterial color="#333333" />
      </mesh>
      
      <mesh position={[0, 3.2, 0.01]} rotation-z={Math.PI}>
        <coneGeometry args={[0.1, 0.3, 3]} />
        <meshLambertMaterial color="#ff0000" />
      </mesh>
    </animated.group>
  )
}

interface Wheel3DProps {
  onSegmentClick: (segment: WheelSegment) => void
  onSpin: () => void
}

export default function Wheel3D({ onSegmentClick, onSpin }: Wheel3DProps) {
  const { isSpinning, wheel, addToHistory, setLastResult, setSpinning } = useWheelStore()
  const [spinPhysics, setSpinPhysics] = useState<SpinPhysics | null>(null)

  const handleSpin = async () => {
    if (isSpinning) return

    const segments = wheel.segments.filter(seg => seg.enabled)
    if (segments.length === 0) return

    setSpinning(true)
    await audioManager.playSpinStartSound()

    const selectedSegment = ProbabilityCalculator.selectRandomSegment(segments)
    if (!selectedSegment) {
      setSpinning(false)
      return
    }

    const targetAngle = ProbabilityCalculator.calculateTargetAngle(selectedSegment, segments)
    const physics = WheelPhysics.calculateSpinPhysics(targetAngle)
    
    setSpinPhysics(physics)
    onSpin()
  }

  const handleSpinComplete = async (segment: WheelSegment) => {
    setSpinning(false)
    setSpinPhysics(null)
    addToHistory(`${segment.emoji} ${segment.label}`)
    setLastResult(`${segment.emoji} ${segment.label}`)
    
    await audioManager.playWinSound()
    await audioManager.triggerVibration([200, 100, 200])
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault()
        handleSpin()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isSpinning])

  return (
    <div className="wheel-container" style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <Wheel 
          onSegmentClick={onSegmentClick}
          spinPhysics={spinPhysics}
          onSpinComplete={handleSpinComplete}
        />
      </Canvas>
      
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="btn btn-primary"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '16px 32px',
          fontSize: '18px',
          fontWeight: '700',
          borderRadius: '50px',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          minWidth: '120px',
          boxShadow: isSpinning 
            ? 'var(--shadow-sm)' 
            : 'var(--shadow-lg), 0 0 25px rgba(6, 182, 212, 0.4)',
          opacity: isSpinning ? 0.6 : 1
        }}
      >
        {isSpinning ? '돌리는 중...' : '🎯 스핀!'}
      </button>
    </div>
  )
}