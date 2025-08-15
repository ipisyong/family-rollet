export class SecureRandom {
  static getRandomFloat(): number {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0] / (0xffffffff + 1)
  }

  static getRandomInt(min: number, max: number): number {
    const range = max - min + 1
    const randomFloat = this.getRandomFloat()
    return Math.floor(randomFloat * range) + min
  }

  static getRandomFloatInRange(min: number, max: number): number {
    const randomFloat = this.getRandomFloat()
    return randomFloat * (max - min) + min
  }
}

export default SecureRandom