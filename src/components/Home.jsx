import { useEffect, useRef, useState } from "react";


export default function Home(props) {
  const {setFile, setAudioStream} = props;

  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const [audioSample, setAudioSample] = useState([]);
  const [duration, setDuration] = useState(0);
  const recorder = useRef(null);
  const mimeType = 'audio/webm';

  async function startRecording() {
    let tempStream;
    try {
        const streamData = navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        tempStream = streamData;
    } catch(error) {
        console.log(error.message);
        return
    }
    setRecordingStatus('recording');

    // use the temoStream to create a new MediaRecoder instance
    const media = new MediaRecorder(tempStream, {type: mimeType});
    recorder.current = media;
    // start recording
    recorder.current.start();

    let localAudioChunks = [];
    recorder.current.ondataavailable = (event) => {
        if (typeof event.data === 'undefined') {return};
        if (event.data.size === 0) {return};
        localAudioChunks.push(event.data);
    }

    setAudioSample(localAudioChunks);
  }

  async function stopRecoding() {
    setRecordingStatus('inactive');
    recorder.current.stop();
    recorder.current.onstop = () => {
        const audioBlob = new Blob(audioSample, {type: mimeType});
        setAudioStream(audioBlob);
        setAudioSample([]);
        setDuration(0);
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
    <main className='flex-1 p-4 flex flex-col justify-center gap-3 sm:gap-4 md:gap-5 text-center pb-20'>
        <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl animate-[rollingColor_4s_linear_infinite]'>Tran<span className='text-orange-400 bold'>Scrilate</span></h1>
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
            setFile(e.target.files[0])
        }}></input></label>an audio file</p>
    </main>
  )
}
