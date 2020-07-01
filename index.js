let steps = 16;
let mainSequenceGates = [];
let mainSequenceFrequencies = [];
let bpm = 120;
let active = false;
let output = false;
let intervalID = null;
let selectedScale = 0;
let scales = [
  // Lydian Augmented Scale
  [262,294,330,370,415,440,494,523]
]

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
        gates.push(true);
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
    const display = document.getElementById('output-display');
    display.innerHTML = output;
}

const initControls = () => {
    armRandomSequenceElement();
}

const armRandomSequenceElement = () => {
    const randomButtonElement = document.getElementById('random-sequence');
    randomButtonElement.addEventListener('click', generateRandomSequence);
}

const generateRandomSequence = () => {
    let newGates = [];
    let newFrequencies = [];
    populateSequence(steps, newGates, newFrequencies)
    newGates.forEach(gate => {
        const onOrOff = Math.random();

        if (onOrOff <= 0.5) {
            gate = true;
            mainSequenceGates.shift();
            mainSequenceGates.push(gate)
        } else {
            gate = false;
            mainSequenceGates.shift();
            mainSequenceGates.push(gate)
        }
    })
    newFrequencies.forEach(frequency => {
        const noteIndex = Math.floor(Math.random() * scales[selectedScale].length) + 0;
        frequency = scales[selectedScale][noteIndex];

        mainSequenceFrequencies.shift();
        mainSequenceFrequencies.push(frequency)
    })
    console.log(mainSequenceGates, mainSequenceFrequencies);
}

init();