export class AudioManager {
  private audioContext: AudioContext | null = null
  private isInitialized = false
  private isEnabled = true

  private async initializeAudioContext(): Promise<void> {
    if (!this.isInitialized && this.isEnabled) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume()
        }
        
        this.isInitialized = true
      } catch (error) {
        console.warn('Failed to initialize audio context:', error)
        this.isEnabled = false
      }
    }
  }

  async playTickSound(frequency: number = 800, duration: number = 50): Promise<void> {
    if (!this.isEnabled) return

    await this.initializeAudioContext()
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = 'square'

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration / 1000)
    } catch (error) {
      console.warn('Failed to play tick sound:', error)
    }
  }

  async playSpinStartSound(): Promise<void> {
    if (!this.isEnabled) return

    await this.initializeAudioContext()
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
      oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + 0.3)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Failed to play spin start sound:', error)
    }
  }

  async playWinSound(): Promise<void> {
    if (!this.isEnabled) return

    await this.initializeAudioContext()
    if (!this.audioContext) return

    try {
      const frequencies = [523, 659, 784, 1047]
      
      for (let i = 0; i < frequencies.length; i++) {
        const oscillator = this.audioContext.createOscillator()
        const gainNode = this.audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        oscillator.frequency.setValueAtTime(frequencies[i], this.audioContext.currentTime)
        oscillator.type = 'sine'

        const startTime = this.audioContext.currentTime + (i * 0.15)
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2)

        oscillator.start(startTime)
        oscillator.stop(startTime + 0.2)
      }
    } catch (error) {
      console.warn('Failed to play win sound:', error)
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  async triggerVibration(pattern: number | number[] = 100): Promise<void> {
    if ('vibrate' in navigator && this.isEnabled) {
      try {
        navigator.vibrate(pattern)
      } catch (error) {
        console.warn('Failed to trigger vibration:', error)
      }
    }
  }
}

export const audioManager = new AudioManager()