import { useState, useEffect, useCallback} from 'react'
import Home from './components/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import FileDisplay from './components/FileDisplay'
import Info from './components/Info'
import Transcribing from './components/Transcribing'
import io from 'socket.io-client';
import { getAudioFrom } from './utils/audioHelper'


function App() {

  // if the audio is uploaded or recorded, the main part will display file instead
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const audioSource = file || audioStream;
  // transcribe is a flag to tell if the transcribing process is complete
  const [transcribe, setTranscribe] = useState(false);
  // transcription is a variable holding the transcription
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [renderedComponent, setRenderedComponent] = useState(null);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  function resetAudio() {
    setFile(null);
    setAudioStream(null);
  }

  const handleComplete = useCallback(async () => {
    console.log('Transcription complete');
    setLoading(false);
    setTranscribe(true);

    try {
      const response = await fetch('http://localhost:5000/transcription-result');
      const result = await response.json();
      console.log(result);
      setTranscription(result.transcription);
      
    } catch (error) {
      console.error('Error fetching transcription:', error);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('processing', (data) => {
      console.log(data.status);
      setLoading(true);
    });

    socket.on('complete', handleComplete);

    socket.on('error', (data) => {
      console.error(data.status);
      setLoading(false);
    });

    return () => {
      socket.off('processing');
      socket.off('complete');
      socket.off('error');
    };
  }, [socket, handleComplete]);

  useEffect(() => {
    if (transcribe && transcription) {
      setRenderedComponent(<Info transcription={transcription} />);
    } else if (loading) {
      setRenderedComponent(<Transcribing />);
    } else if (audioSource) {
      setRenderedComponent(
        <FileDisplay 
          file={file}  
          resetAudio={resetAudio} 
          formSubmit={formSubmit} 
        />
      );
    } else {
      setRenderedComponent(
        <Home 
          setFile={setFile} 
          setAudioStream={setAudioStream} 
        />
      );
    }
  }, [transcribe, transcription, loading, audioSource]);

  async function formSubmit() {
    if (!file && !audioStream) {return};

    let audioBlob = await getAudioFrom(file ? file : audioStream);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    const response = await fetch('http://localhost:5000/upload-audio', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    console.log(data);
  }

  return (
    <div className='flex flex-col mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header/>

        {renderedComponent}
      
      </section>

      <Footer/>
    </div>
  )
}

export default App
