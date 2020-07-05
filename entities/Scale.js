class Scale {
  constructor(name) {
    switch (name) {
      case 'Lydian Augmented Scale':
        this._scale = [262,294,330,370,415,440,494,523]
        break;
      case 'Hirajoshi Scale':
        this._scale = [262,311,349,415,466,523]
        break;
      case 'Phrygian Dominant Scale':
        this._scale = [262,311,330,349,392,466,466,523]
        break;
      default:
        throw new Error('Invalid Name supplied to scale')
        break;
    }
  }

  getRandomNote() {
    const randomIndex = Math.floor((Math.random() * this._scale.length) + 0)
    return this._scale[randomIndex];
  }

  generateFrequency(octave) {
    return this.getRandomNote() / octave
  }
}

export default Scale