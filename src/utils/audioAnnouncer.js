// Interactive Hospital Audio PA System & Speech Synthesis Engine

export const playHospitalChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Pleasant hospital chime chord (D5 -> A5)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc3.type = 'sine';

    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25); // A5

    osc2.frequency.setValueAtTime(440, ctx.currentTime); // A4
    osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.25); // E5

    osc3.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc3.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.3); // D6

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);

    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc3.start();
    osc1.stop(ctx.currentTime + 0.9);
    osc2.stop(ctx.currentTime + 0.9);
    osc3.stop(ctx.currentTime + 0.9);
  } catch (e) {
    // safe fallback
  }
};

export const announceTokenVoice = (tokenNumber, patientName, roomNumber) => {
  playHospitalChime();

  if ('speechSynthesis' in window) {
    // Cancel prior utterances
    window.speechSynthesis.cancel();

    setTimeout(() => {
      const spelledToken = tokenNumber ? tokenNumber.split('').join(' ') : 'next token';
      const text = `Attention please. Token ${spelledToken}. ${patientName || 'Patient'}, please proceed to ${roomNumber || 'Consultation Room 101'}.`;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // Clear hospital pace
      utterance.pitch = 1.05;
      
      // Select best clear voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female')));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    }, 450);
  }
};
