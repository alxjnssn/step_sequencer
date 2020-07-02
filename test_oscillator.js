export default initOscillator = () => {
  const audioCtx = new AudioContext();

  const oscillator = new OscillatorNode(audioCtx);
  const gainNode = new GainNode(audioCtx);

  oscillator.connect(gainNode).connect(audioCtx.destination);

  oscillator.context;
  oscillator.numberOfInputs;
  oscillator.numberOfOutputs;
  oscillator.channelCount;
}

export default updateOscillator = (gate, freq) => {
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(gate, audioCtx.currentTime);
}
