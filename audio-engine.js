// SID-inspired 8-bit sound engine for OL BORÉLER.
// Original JavaScript implementation: no MIDI, samples, external libraries or audio files.
export function createSidEngine() {
  let context = null, master = null, enabled = false, timer = null, nextStepTime = 0, step = 0, noiseBuffer = null, volume = 0.65;
  const bpm = 132, stepDuration = 60 / bpm / 4, lookAhead = 0.12;
  const lead = [76,null,76,79,81,null,79,76,74,null,74,76,79,null,76,null,72,null,72,76,79,null,76,74,71,null,71,74,76,null,74,null];
  const counter = [null,64,null,67,null,67,null,64,null,62,null,66,null,66,null,62,null,60,null,64,null,64,null,60,null,59,null,62,null,62,null,59];
  const bass = [40,null,null,40,43,null,null,43,38,null,null,38,43,null,null,43,36,null,null,36,40,null,null,40,38,null,null,38,43,null,null,43];
  const hz = note => 440 * Math.pow(2, (note - 69) / 12);

  function getContext() {
    if (!context) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return null;
      context = new Audio();
      master = context.createGain(); master.gain.value = volume; master.connect(context.destination);
      const length = Math.floor(context.sampleRate * 0.18);
      noiseBuffer = context.createBuffer(1, length, context.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    }
    return context;
  }
  function voice(frequency, start, duration, waveform, volume, endFrequency = frequency) {
    if (!context) return;
    const osc = context.createOscillator(), gain = context.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(frequency, start);
    if (endFrequency !== frequency) osc.frequency.exponentialRampToValueAtTime(Math.max(1,endFrequency), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
    gain.gain.setValueAtTime(volume, Math.max(start + 0.012, start + duration * 0.72));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain); gain.connect(master);
    osc.start(start); osc.stop(start + duration + 0.015);
  }
  function noise(start, duration, volume) {
    if (!context || !noiseBuffer) return;
    const source = context.createBufferSource(), filter = context.createBiquadFilter(), gain = context.createGain();
    source.buffer = noiseBuffer; filter.type = "lowpass"; filter.frequency.setValueAtTime(1800, start);
    gain.gain.setValueAtTime(volume, start); gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter); filter.connect(gain); gain.connect(master);
    source.start(start); source.stop(start + duration);
  }
  function schedule(at, index) {
    const n = index % 32;
    if (lead[n] !== null) voice(hz(lead[n]), at, stepDuration * 0.82, "square", 0.065);
    if (counter[n] !== null) voice(hz(counter[n]), at, stepDuration * 0.58, "sawtooth", 0.018);
    if (bass[n] !== null) voice(hz(bass[n]), at, stepDuration * 1.65, "triangle", 0.075);
    if (n % 8 === 0) noise(at, 0.075, 0.12);
    else if (n % 8 === 4) noise(at, 0.045, 0.055);
  }
  function scheduler() {
    if (!enabled || !context) return;
    while (nextStepTime < context.currentTime + lookAhead) {
      schedule(nextStepTime, step++);
      nextStepTime += stepDuration;
    }
  }
  async function on() {
    const audio = getContext();
    if (!audio) return false;
    try {
      await audio.resume();
      if (audio.state !== "running") return false;
      enabled = true; step = 0; nextStepTime = audio.currentTime + 0.045;
      if (timer) clearInterval(timer);
      timer = setInterval(scheduler, 25);
      return true;
    } catch (_) { enabled = false; return false; }
  }
  function off() { enabled = false; if (timer) clearInterval(timer); timer = null; }
  function collision() {
    if (!enabled || !context || context.state !== "running") return;
    const now = context.currentTime + 0.015;
    [74,69,72,65,67,60].forEach((note, i) => voice(hz(note), now + i * 0.085, 0.075, "square", 0.07, hz(note - 3)));
    noise(now + 0.43, 0.12, 0.08);
  }
  return { async toggle() { return enabled ? (off(), false) : await on(); }, collision, isEnabled: () => enabled, setVolume(value) { volume = Math.max(0, Math.min(1, Number(value))); if (master && context) master.gain.setTargetAtTime(volume, context.currentTime, 0.025); }, stop: off };
}
