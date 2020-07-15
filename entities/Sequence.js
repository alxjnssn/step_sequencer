import shuffle from '../utilities'

class Sequence {
  constructor(length, delay) {
    this.gates = new Array(length).fill(0)
    this.frequencies = new Array(length).fill(440)
    this.alternateFrequencies = new Array(length).fill(440)
    this.delay = delay
    this.index = 0
    this.interval = null

    this.frequecyHistory = []
    this.gateHistory = []
    this.activeGates = []
    this.closedGates = [];
    this.modifiedFrequencies = [];
    this.frequencyToModify = 0;
    this.frequencyLocationToPutBack = 0;
    this.frequencyToPutBack = 0;
    this.lastStepModified = 0;
    this.lastGateStepModified = 0;
  }

  randomizeGates() {
    this.clearGateHistory()
    this.clearActiveGates()

    this.gates = this.gates.map(() => Math.random() > 0.5 ? 1 : 0)
    this.gateHistory.push(this.gates)
    this.setActiveGates()
  }

  randomizeFrequencies(scale, octave) {
    this.frequencies = this.frequencies.map(() => scale.generateFrequency(octave))
    this.alternateFrequencies = this.alternateFrequencies.map(() => scale.generateFrequency(octave))
    this.clearFrequencyHistory()
    this.frequecyHistory.push(this.frequencies)
  }

  swapAlternateFrequency(index) {
    if (this.lastStepModified === index) {
      return;
    }
    
    if (this.lastStepModified > index) {
      this.frequencyLocationToPutBack = this.activeGates[this.lastStepModified - 1];
      this.frequencyToPutBack = this.modifiedFrequencies[this.modifiedFrequencies.length - 1];
      this.frequencies[this.frequencyLocationToPutBack] = this.modifiedFrequencies[this.modifiedFrequencies.length - 1]; 
  
      this.modifiedFrequencies.pop();
  
      console.log(this.modifiedFrequencies);
      this.lastStepModified = index;
    }
  
    if (this.lastStepModified < index) {
      this.frequencyToModify = this.activeGates[index - 1];
  
      this.modifiedFrequencies.push(this.frequencies[this.frequencyToModify]);
      this.frequencies[this.frequencyToModify] = this.alternateFrequencies[this.frequencyToModify]; 
      
      this.frequencies[this.frequencyToModify] = this.alternateFrequencies[this.frequencyToModify];  
      this.lastStepModified = index;
      console.log(this.modifiedFrequencies);
    }
  }

  swapAlternateGates(index) {
    if (index === 0) {
      return;
    }
    
    if (this.lastGateStepModified > index) {
      this.gates[this.closedGates[index - 1]] = 0;
      console.log(this.gates);
      this.lastGateStepModified = index;
    }

    if (this.lastGateStepModified < index) {
      this.gates[this.closedGates[index - 1]] = 1;
      console.log(this.gates);
      this.lastGateStepModified = index;
    }
    console.log(this.closedGates, this.gates)
  }

  setActiveGates() {
    this.gates.forEach((gate, index) => {
      if (gate === 1) {
        console.log(index, "open")
        this.activeGates.push(index)
      } else {
        console.log(index, "closed")
        this.closedGates.push(index)
      }
    })
    this.activeGates = shuffle(this.activeGates);
    this.closedGates = shuffle(this.closedGates);
  }

  resetFreq(stepsBack) {
    this.frequencies = this.frequecyHistory[stepsBack]
  }

  clearFrequencyHistory() {
    this.frequecyHistory = [];
  }

  clearGateHistory() {
    this.gateHistory = [];
  }
  
  clearActiveGates() {
    this.activeGates = [];
  }

  step() {
    const result = [this.gates[this.index], this.frequencies[this.index]]
    this.index = this.index === (this.gates.length - 1) ? 0 : this.index + 1
    return result
  }

  start(callback) {
    this.interval = setInterval(() => {
      const [gate, freq] = this.step()
      callback(gate, freq)
    }, this.delay)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
    } else {
      throw new Error('Sequence not started, can\'t stop')
    }
  }
}

export default Sequence