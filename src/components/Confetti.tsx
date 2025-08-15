import { useEffect, useRef } from 'react'

interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  gravity: number
  opacity: number
  fadeSpeed: number
  shape: 'circle' | 'square' | 'triangle' | 'star'
}

interface ConfettiProps {
  isActive: boolean
  duration?: number
  particleCount?: number
}

export default function Confetti({ isActive, duration = 4000, particleCount = 80 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<ConfettiParticle[]>([])
  const startTimeRef = useRef<number | undefined>(undefined)

  // Modern vibrant colors for dark theme
  const colors = [
    '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#ec4899', '#6366f1', '#84cc16', '#f97316', '#06b6d4',
    '#a855f7', '#059669', '#eab308', '#dc2626', '#be185d'
  ]

  const shapes: Array<'circle' | 'square' | 'triangle' | 'star'> = ['circle', 'square', 'triangle', 'star']

  const createParticle = (): ConfettiParticle => {
    const canvas = canvasRef.current
    if (!canvas) {
      return {
        x: 0, y: 0, vx: 0, vy: 0, rotation: 0, rotationSpeed: 0,
        color: colors[0], size: 4, gravity: 0.1, opacity: 1, fadeSpeed: 0.02,
        shape: 'circle'
      }
    }

    const centerX = canvas.width / 2
    const spread = canvas.width * 0.3

    return {
      x: centerX + (Math.random() - 0.5) * spread,
      y: -20,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * 4 + 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 6,
      gravity: Math.random() * 0.4 + 0.2,
      opacity: 1,
      fadeSpeed: Math.random() * 0.02 + 0.005,
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    }
  }

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: ConfettiParticle) => {
    ctx.save()
    ctx.translate(particle.x, particle.y)
    ctx.rotate((particle.rotation * Math.PI) / 180)
    ctx.globalAlpha = particle.opacity
    
    // Add glow effect
    ctx.shadowBlur = 10
    ctx.shadowColor = particle.color
    
    ctx.fillStyle = particle.color
    
    const halfSize = particle.size / 2
    
    switch (particle.shape) {
      case 'circle':
        ctx.beginPath()
        ctx.arc(0, 0, halfSize, 0, Math.PI * 2)
        ctx.fill()
        break
        
      case 'square':
        ctx.fillRect(-halfSize, -halfSize, particle.size, particle.size)
        break
        
      case 'triangle':
        ctx.beginPath()
        ctx.moveTo(0, -halfSize)
        ctx.lineTo(-halfSize, halfSize)
        ctx.lineTo(halfSize, halfSize)
        ctx.closePath()
        ctx.fill()
        break
        
      case 'star':
        ctx.beginPath()
        for (let i = 0; i < 5; i++) {
          const angle = (i * 144 - 90) * Math.PI / 180
          const x = Math.cos(angle) * halfSize
          const y = Math.sin(angle) * halfSize
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        break
    }
    
    ctx.restore()
  }

  const updateParticle = (particle: ConfettiParticle) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vy += particle.gravity
    particle.rotation += particle.rotationSpeed
    particle.opacity -= particle.fadeSpeed
    
    // Add air resistance
    particle.vx *= 0.999
    particle.vy *= 0.999
  }

  const animate = (currentTime: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    if (!startTimeRef.current) {
      startTimeRef.current = currentTime
    }

    const elapsed = currentTime - (startTimeRef.current || 0)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (elapsed < duration && isActive) {
      if (particlesRef.current.length < particleCount) {
        for (let i = particlesRef.current.length; i < particleCount; i++) {
          particlesRef.current.push(createParticle())
        }
      }

      particlesRef.current = particlesRef.current.filter(particle => {
        updateParticle(particle)
        drawParticle(ctx, particle)
        
        return particle.y < canvas.height + 50 && 
               particle.x > -50 && 
               particle.x < canvas.width + 50 &&
               particle.opacity > 0
      })

      animationRef.current = requestAnimationFrame(animateWrapper)
    } else {
      particlesRef.current = []
      startTimeRef.current = undefined
    }
  }

  const animateWrapper = (currentTime: number) => {
    animate(currentTime)
  }

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = undefined
      particlesRef.current = []
      animationRef.current = requestAnimationFrame(animateWrapper)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    />
  )
}