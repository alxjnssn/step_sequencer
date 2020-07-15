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
   1.0.0.0
*/

import Scale from './entities/Scale'
import Sequence from './entities/Sequence'

let steps = 16;

let bpm = 120;
let oneSecond = 1000;
let secondsInAMinute = 60;
let delay = ((1 / (bpm / secondsInAMinute)) * oneSecond) * (4 / steps);
let intervalID = null;
let output = null;

const mainSequence = new Sequence(steps, delay)
const alternateSequence = new Sequence(steps, delay)

const OCTAVES = [1, 2, 4, 8];
const SELECTED_OCTAVE = 0;
const octave = OCTAVES[SELECTED_OCTAVE]

const SELECTED_SCALE = 0;
const SCALES = [
  new Scale('Hirajoshi Scale'),
]

const scale = SCALES[SELECTED_SCALE]

const audioCtx = new AudioContext();
const oscillator = new OscillatorNode(audioCtx);
const gainNode = new GainNode(audioCtx);

const modifyRangeElement = document.getElementById('modify-sequence');
const modifyGateRangeElement = document.getElementById('modify-gates');
const display = document.getElementById('output-display');

const init = () => {
  initOscillator();
  initControls()
  console.log(
    steps,
    mainSequence.gates,
    bpm,
    output,
    intervalID
  );
}

const refreshDisplay = sequenceOutput => {
  display.innerHTML = sequenceOutput;
}

const initControls = () => {
  armStartSequenceElement();
  armRandomSequenceElement();
  armModifySequenceElement();
  armSequenceStepsElement();
  armModifyGateSequenceElement();
}

const armStartSequenceElement = () => {
  const startSequenceElement = document.getElementById('start-sequence');
  startSequenceElement.addEventListener('click', () => {
    oscillator.start();
    mainSequence.start((gate, freq) => {
      updateOscillator(gate, freq)
      refreshDisplay(`${gate}, ${freq}`)
    })
  });
}

const armSequenceStepsElement = () => {
  const modifyStepsElement = document.getElementById('modify-steps');
  modifyStepsElement.addEventListener('input', event => {
    updateSequenceSteps(event);
  });
}

const updateSequenceSteps = (event) => {
  steps = parseInt(event.target.value) * 2;
}

const armModifySequenceElement = () => {
  modifyRangeElement.addEventListener('input', event => {
      modifyCurrentSequence(event);
  });
}

const modifyCurrentSequence = event => {
  mainSequence.swapAlternateFrequency(parseInt(event.target.value));
}

const armModifyGateSequenceElement = () => {
  modifyGateRangeElement.addEventListener('input', event => {
    modifyCurrentGateSequence(event);
  });
}

const modifyCurrentGateSequence = event => {
  mainSequence.swapAlternateGates(parseInt(event.target.value));
}

const armRandomSequenceElement = () => {
  const randomButtonElement = document.getElementById('random-sequence');
  randomButtonElement.addEventListener('click', generateRandomSequence);
}

const generateRandomSequence = () => {
  mainSequence.randomizeFrequencies(scale, octave)
  mainSequence.randomizeGates()
  modifyRangeElement.max = mainSequence.activeGates.length;
  modifyGateRangeElement.max = mainSequence.closedGates.length;

  console.log(mainSequence.gates, mainSequence.frequencies, steps);
}

const initOscillator = () => {
  oscillator.connect(gainNode).connect(audioCtx.destination);
  oscillator.context;
  oscillator.numberOfInputs;
  oscillator.numberOfOutputs;
  oscillator.channelCount;
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // value in hertz
}

const updateOscillator = (gate, freq) => {
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(gate, audioCtx.currentTime);
}


init();