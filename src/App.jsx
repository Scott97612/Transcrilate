import { useState, useEffect, useCallback, useRef } from 'react';
import io from 'socket.io-client';
import Home from './components/Home';
import Header from './components/Header';
import FileDisplay from './components/FileDisplay';
import Info from './components/Info';
import Transcribing from './components/Transcribing';
import { getAudioFrom } from './utils/audioHelper';

function App() {
  const BACKEND_ENDPOINT = 'http://localhost:5000';
  
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transcribe, setTranscribe] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [renderedComponent, setRenderedComponent] = useState(null);
  
  const socketRef = useRef(null);
  const isProcessingRef = useRef(false);

  // Set up socket connection
  useEffect(() => {
    socketRef.current = io(BACKEND_ENDPOINT);

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!socketRef.current) return;

    const onProcessing = (data) => {
      console.log('Processing event received:', data.status);
      isProcessingRef.current = true;
      setLoading(true);             
    };

    const onComplete = async () => {
      console.log('Transcription complete');
      isProcessingRef.current = false;
      setLoading(false);
      setTranscribe(true);

      try {
        const response = await fetch(`${BACKEND_ENDPOINT}/transcription-result`);
        const result = await response.json();
        setTranscription(result.transcription);
      } catch (error) {
        console.error('Error fetching transcription:', error);
      }
    };

    const onError = (data) => {
      console.error('Error event received:', data.status);
      isProcessingRef.current = false;
      setLoading(false);
    };

    socketRef.current.on('processing', onProcessing);
    socketRef.current.on('complete', onComplete);
    socketRef.current.on('error', onError);

    return () => {
      socketRef.current.off('processing', onProcessing);
      socketRef.current.off('complete', onComplete);
      socketRef.current.off('error', onError);
    };
  }, []);

  const formSubmit = useCallback(async () => {
    if (!file && !audioStream) return;
    if (isProcessingRef.current) {
      console.log('Already processing, please wait');
      return;
    }

    try {
      let audioBlob = await getAudioFrom(file? file: audioStream);
      const formData = new FormData();
      formData.append('audio', audioBlob);

      setLoading(true);
      const response = await fetch(`${BACKEND_ENDPOINT}/upload-audio`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log('Upload response:', data);

      // Wait for processing to complete
      await new Promise((resolve) => {
        const checkProcessing = setInterval(() => {
          if (!isProcessingRef.current) {
            clearInterval(checkProcessing);
            resolve();
          }
        }, 100);
      });

    } catch (error) {
      console.error('Error uploading audio:', error);
      setLoading(false);
    }
  }, [file, audioStream]);

  const Reset = useCallback(async () => {
    setFile(null);
    setAudioStream(null);
    setTranscribe(false);
    setTranscription(null);
    setLoading(false);
    // reset the backend data as well
    const formData = new FormData();
    formData.append('action', 'reset');
    const response = await fetch(`${BACKEND_ENDPOINT}/reset`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log('Reset response:', data);
  }, []);

  useEffect(() => {
    const audioSource = file || audioStream;

    if (transcribe && transcription) {
      setRenderedComponent(<Info transcription={transcription} />);
    } else if (loading) {
      // console.log('Loading triggered');
      setRenderedComponent(<Transcribing />);
    } else if (audioSource) {
      setRenderedComponent(
        <FileDisplay 
          file={file}  
          Reset={Reset} 
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
  }, [transcribe, transcription, loading, file, audioStream, Reset, formSubmit]);

  return (
    <div className='flex flex-col mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header Reset={Reset}/>
        {renderedComponent}
      </section>
    </div>
  );
}

export default App;