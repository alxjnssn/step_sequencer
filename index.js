let steps = 16;
let mainSequenceGates = [];
let mainSequenceFrequencies = [];
let alternateSequenceGates = [];
let alternateSequenceFrequencies = [];
let activeGates = [];
let modifiedFrequencies = [];
let lastStepModified = 0;
let bpm = 120;
let active = false;
let output = null;
let intervalID = null;
let selectedScale = 0;
let scales = [
  // Lydian Augmented Scale
  [262,294,330,370,415,440,494,523]
]

const modifyRangeElement = document.getElementById('modify-sequence');
const display = document.getElementById('output-display');

const init = () => {
  initSequence();
  initDisplay();
  initControls()
  active = true;
  console.log({
    steps,
    mainSequenceGates,
    bpm,
    active,
    output,
    intervalID
  });
}

const populateSequence = (steps, gates, frequencies) => {
  for (let i = 0; i < steps; i++) {
    gates.push(0);
    frequencies.push(440);
  }
}

const initSequence = () => {
  populateSequence(steps, mainSequenceGates, mainSequenceFrequencies);
  const oneSecond = 1000;
  const secondsInAMinute = 60;
  const delay = ((1 / (bpm / secondsInAMinute)) * oneSecond) * (4 / steps);
  sequenceIndex = 0;
  reset = 0;
  
  intervalID = setInterval(() => {
    stepSequence();
  }, delay)
}

const stepSequence = () => {
  output = [mainSequenceGates[sequenceIndex], mainSequenceFrequencies[sequenceIndex]];

  if (sequenceIndex === steps - 1)
    sequenceIndex = reset;
  else {
    sequenceIndex = sequenceIndex + 1;
  }
} 

const initDisplay = () => {
  setInterval(() => {
    refreshDisplay();
  }, 1);
}

const refreshDisplay = () => {
  display.innerHTML = output;
}

const initControls = () => {
  armRandomSequenceElement();
  armModifySequenceElement();
}

const armModifySequenceElement = () => {
  populateSequence(steps, alternateSequenceGates, alternateSequenceFrequencies)
  modifyRangeElement.addEventListener('click', modifyCurrentSequence);
}

const modifyCurrentSequence = event => {
  if (lastStepModified === event.target.value) {
    return;
  }

  if (lastStepModified > event.target.value) {
    for (let i = 1; i <= lastStepModified - event.target.value; i++) {
      frequencyLocationToPutBack = activeGates[i];
      frequencyToPutBack = modifiedFrequencies[i];
      mainSequenceFrequencies[frequencyLocationToPutBack] = modifiedFrequencies[modifiedFrequencies.length - 1]; 

      modifiedFrequencies.pop();
    }

    console.log(modifiedFrequencies);
    lastStepModified = event.target.value;
  }

  if (lastStepModified < event.target.value) {
    
    for (let i = 0; i <= event.target.value - 1; i++) {
      frequencyToModify = activeGates[i];

      if (mainSequenceFrequencies[frequencyToModify] === alternateSequenceFrequencies[frequencyToModify]) {
        continue;
      } else {
        modifiedFrequencies.push(mainSequenceFrequencies[frequencyToModify]);
        mainSequenceFrequencies[frequencyToModify] = alternateSequenceFrequencies[frequencyToModify]; 
      }
    }
    
    mainSequenceFrequencies[frequencyToModify] = alternateSequenceFrequencies[frequencyToModify];  
    lastStepModified = event.target.value;
    console.log(modifiedFrequencies);
  }

  console.log(mainSequenceFrequencies);
}

const shuffle = array => {
  // ES6 Durstenfeld Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const armRandomSequenceElement = () => {
  const randomButtonElement = document.getElementById('random-sequence');
  randomButtonElement.addEventListener('click', generateRandomSequence);
}

const generateRandomSequence = () => {
  let newGates = [];
  let newFrequencies = [];
  let newAlternateGates = [];
  let newAlternateFrequencies = [];
  
  populateSequence(steps, newGates, newFrequencies)
  populateSequence(steps, newAlternateGates, newAlternateFrequencies)

  generateNewGates(newGates, mainSequenceGates)
  generateNewFrequencies(newFrequencies, mainSequenceFrequencies)

  generateNewGates(newAlternateGates, alternateSequenceGates)
  generateNewFrequencies(newAlternateFrequencies, alternateSequenceFrequencies)

  currentActiveGates();

  console.log(mainSequenceGates, mainSequenceFrequencies);
}

const generateNewGates = (fromArray, toArray) => {
  fromArray.forEach(element => {
    const onOrOff = Math.random();

    if (onOrOff >= 0.5) {
      element = 1;
      toArray.shift();
      toArray.push(element)
    } else {
      element = 0;
      toArray.shift();
      toArray.push(element)
    }
  })
}

const generateNewFrequencies = (fromArray, toArray) => {
  fromArray.forEach(element => {
    const noteIndex = Math.floor(Math.random() * scales[selectedScale].length) + 0;
    element = scales[selectedScale][noteIndex];

    toArray.shift();
    toArray.push(element)
  })
}

const currentActiveGates = () => {
  activeGates = [];

  mainSequenceGates.forEach((gate, index) => {
    const isActiveGate = gate === 1;

    if (isActiveGate) {
      activeGates.push(index);
    }
  })

  modifyRangeElement.max = activeGates.length;
  shuffle(activeGates);
  console.log(activeGates)
}

init();