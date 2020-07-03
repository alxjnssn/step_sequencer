/* 
   *   '*                             
           *                                                    '      *    
                *                                   *         '             '               '
                       *
               *
                     *
                                                .                     '             .               .
         .                      .
         .                      ;
         :                  - --+- -                    +                     .
         !           .          !
         |        .             .
         |_         +
      ,  | `.                                           
--- --+-<#>-+- ---  --  -                                     '                                                 .
      `._|_,'
         T
         |                                    +                         .
         !
         :         . :                                                                                  *
         .       *

████████╗██╗  ██╗███████╗    ██╗    ██╗██╗███████╗ █████╗ ██████╗ ██████╗ ███████╗    ██████╗  █████╗ ████████╗██╗  ██╗
╚══██╔══╝██║  ██║██╔════╝    ██║    ██║██║╚══███╔╝██╔══██╗██╔══██╗██╔══██╗██╔════╝    ██╔══██╗██╔══██╗╚══██╔══╝██║  ██║
   ██║   ███████║█████╗      ██║ █╗ ██║██║  ███╔╝ ███████║██████╔╝██║  ██║███████╗    ██████╔╝███████║   ██║   ███████║
   ██║   ██╔══██║██╔══╝      ██║███╗██║██║ ███╔╝  ██╔══██║██╔══██╗██║  ██║╚════██║    ██╔═══╝ ██╔══██║   ██║   ██╔══██║
   ██║   ██║  ██║███████╗    ╚███╔███╔╝██║███████╗██║  ██║██║  ██║██████╔╝███████║    ██║     ██║  ██║   ██║   ██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚══════╝     ╚══╝╚══╝ ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝    ╚═╝     ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
   By: Alexander James Janssen
   TWP-100-2020
*/

let steps = 12;
let mainSequenceGates = [];
let mainSequenceFrequencies = [];
let alternateSequenceGates = [];
let alternateSequenceFrequencies = [];
let activeGates = [];
let modifiedFrequencies = [];
let lastStepModified = 0;
let bpm = 120;
let oneSecond = 1000;
let secondsInAMinute = 60;
let delay = ((1 / (bpm / secondsInAMinute)) * oneSecond) * (4 / steps);
let active = false;
let output = null;
let intervalID = null;
let octave = [1, 2, 4, 8];
let selectedOctave = 0;
let selectedScale = 0;
let scales = [
  // Lydian Augmented Scale
  [262,294,330,370,415,440,494,523],
  // Hirajoshi Scale
  [262,311,349,415,466,523],
  // Phrygian Dominant Scale
  [262,311,330,349,392,466,466,523]
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
  }, delay);
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
  modifyRangeElement.addEventListener('input', event => {
      modifyCurrentSequence(event);
  });
}

const modifyCurrentSequence = event => {
  if (lastStepModified === event.target.value) {
    return;
  }
  
  if (lastStepModified > event.target.value) {
    frequencyLocationToPutBack = activeGates[lastStepModified - 1];
    frequencyToPutBack = modifiedFrequencies[modifiedFrequencies.length - 1];
    mainSequenceFrequencies[frequencyLocationToPutBack] = modifiedFrequencies[modifiedFrequencies.length - 1]; 

    modifiedFrequencies.pop();

    console.log(modifiedFrequencies);
    lastStepModified = event.target.value;
  }

  if (lastStepModified < event.target.value) {
    frequencyToModify = activeGates[event.target.value - 1];

    modifiedFrequencies.push(mainSequenceFrequencies[frequencyToModify]);
    mainSequenceFrequencies[frequencyToModify] = alternateSequenceFrequencies[frequencyToModify]; 
    
    mainSequenceFrequencies[frequencyToModify] = alternateSequenceFrequencies[frequencyToModify];  
    lastStepModified = event.target.value;
    console.log(modifiedFrequencies);
  }

  console.log(mainSequenceFrequencies);
  console.log(modifyRangeElement.value)
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
    toArray.push(element / octave[selectedOctave])
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