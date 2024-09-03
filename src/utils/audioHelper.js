export async function createWavBlob(audioData, sampleRate) {
    // Creates a WAV file from the raw audio data
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);
  
    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
  
    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 32 + audioData.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, audioData.length * 2, true);
  
    /* PCM samples */
    let offset = 44;
    for (let i = 0; i < audioData.length; i++, offset += 2) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
  
    return new Blob([view], { type: 'audio/wav' });
  }

  export async function getAudioFrom(source) {
    // extracts audio from the file or recorded audio stream

    const samplingRate = 16000;
    const audioContext = new AudioContext({sampleRate: samplingRate});
    const response = await source.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(response);
    const audio = decoded.getChannelData(0);
    const wavBlob = createWavBlob(audio, samplingRate);
    return wavBlob;
  }
