import { useEffect, useRef, useState } from "react";


export default function Home(props) {
  // eslint-disable-next-line react/prop-types
  const {setFile, setAudioStream} = props;

  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const [audioSample, setAudioSample] = useState([]);
  const [duration, setDuration] = useState(0);
  const recorder = useRef(null);
  const mimeType = 'audio/webm';

  async function startRecording() {
    let tempStream;
    try {
        const streamData = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        tempStream = streamData;
    } catch(error) {
        console.log(error.message);
        return
    }
    setRecordingStatus('recording');

    // use the tempStream to create a new MediaRecoder instance
    const media = new MediaRecorder(tempStream, {type: mimeType});
    recorder.current = media;
    // start recording
    recorder.current.start();

    let localAudioChunks = [];
    recorder.current.ondataavailable = (event) => {
        if (typeof event.data === 'undefined') {return};
        if (event.data.size === 0) {return};
        // Array.push() is append
        localAudioChunks.push(event.data);
    }

    setAudioSample(localAudioChunks);
  }

  async function stopRecoding() {
    setRecordingStatus('inactive');
    recorder.current.stop();
    // console.log('stop')
    recorder.current.onstop = () => {
        const audioBlob = new Blob(audioSample, {type: mimeType});
        // audioSample is a variable in this component to hold the media
        // audioStream is a variable passed here via props as the main variable for the recording
        setAudioStream(audioBlob);
        setAudioSample([]);
        setDuration(0);

        // Stop all tracks on the media stream to release the microphone
        if (recorder.current.stream) {
            recorder.current.stream.getTracks().forEach(track => track.stop());
        }
    }
  }

  useEffect(() => {
    if (recordingStatus === 'inactive') {return};

    const interval = setInterval(() => {
        setDuration(curr => curr + 1)
    }, 1000);

    return () => clearInterval(interval);
  })

  return (
    <main className='flex-1 p-4 flex flex-col justify-center gap-3 sm:gap-4 text-center pb-20'>
        <a href="/"><h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl animate-[rollingColor_4s_linear_infinite]'>Tran<span className='text-orange-400 bold'>Scrilate</span></h1></a>
        <h3 className='font-medium md:text-large'>Recording &rarr; Transcribe &rarr; Translate</h3>
        <button className='flex items-center text-base justify-between gap-4 mx-auto w-72 max-w-full my-4 specialBtn px-4 py-2 rounded-xl'
        onClick={recordingStatus==='inactive'? startRecording: stopRecoding}>
            <p className='text-orange-400 bold whitespace-nowrap'>{recordingStatus==='inactive'? 'Record': 'Stop Recording'}</p>
            <div className="flex items-center gap-2 whitespace-nowrap">
                {duration!==0 && (<p className="text-sm">{duration<59? `${duration} secs`:`${Math.floor(duration/60)} mins ${duration%60} secs`}</p>)}
                {recordingStatus==='inactive'? (<i className="fa-solid fa-microphone-lines"></i>): <i className="fa-solid fa-microphone-lines-slash"></i>}
            </div>
            
        </button>

        <p className='text-base'>Or <label className='text-blue-400 bold cursor-pointer hover:text-orange-600'>Upload <input className='hidden' type='file' accept='.mp3, .wav' onChange={(e)=>{
            const tempFile = e.target.files[0];
            setFile(tempFile);
        }}></input></label>an audio file</p>
    </main>
  )
}
