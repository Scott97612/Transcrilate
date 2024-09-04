import { useState, useEffect, useRef, useCallback } from 'react'
import Transcription from './Transcription';
import Translation from './Translation';
import io from 'socket.io-client';

export default function Info(props) {
  // eslint-disable-next-line react/prop-types
  const {transcription} = props;

  const [tab, setTab] = useState('transcription');

  const anotherSocketRef = useRef(null);
  const [translationLoading, setTranslationLoading] = useState(false);
  const translationIsProcessingRef = useRef(false);
  const [translation, setTranslation] = useState(null);
  const [toLanguage, setToLanguage] = useState('Select Language');
  const BACKEND_ENDPOINT = 'http://localhost:5000';

  // Set up socket connection
  useEffect(() => {
    anotherSocketRef.current = io(BACKEND_ENDPOINT);

    anotherSocketRef.current.on('connect', () => {
      console.log('Another Socket connected');
    });

    anotherSocketRef.current.on('disconnect', () => {
      console.log('Another Socket disconnected');
    });

    return () => {
      if (anotherSocketRef.current) {
        anotherSocketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!anotherSocketRef.current) return;

    const onProcessing = (data) => {
      console.log('Translating event received:', data.status);
      translationIsProcessingRef.current = true;
      setTranslationLoading(true);             
    };

    const onComplete = async () => {
      console.log('Translation complete');
      translationIsProcessingRef.current = false;
      setTranslationLoading(false);

      try {
        const response = await fetch(`${BACKEND_ENDPOINT}/translation-result`);
        const result = await response.json();
        setTranslation(result.translation);
      } catch (error) {
        console.error('Error fetching translation:', error);
      }
    };

    const onError = (data) => {
      console.error('Error event received:', data.status);
      translationIsProcessingRef.current = false;
      setTranslationLoading(false);
    };

    anotherSocketRef.current.on('translating', onProcessing);
    anotherSocketRef.current.on('translated', onComplete);
    anotherSocketRef.current.on('translation_error', onError);

    return () => {
      anotherSocketRef.current.off('translating', onProcessing);
      anotherSocketRef.current.off('translated', onComplete);
      anotherSocketRef.current.off('translation_error', onError);
    };
  }, []);

  const languageSubmit = useCallback(async() => {
    try {
      setTranslationLoading(true);
      const formData = new FormData();
      formData.append('language', toLanguage);
      const response = await fetch(`${BACKEND_ENDPOINT}/send-language`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('Send language response:', data);
    
      // Wait for processing to complete
      await new Promise((resolve) => {
        const checkProcessing = setInterval(() => {
          if (!translationIsProcessingRef.current) {
            clearInterval(checkProcessing);
            resolve();
          }
        }, 100);
      });
    } catch (error) {
      console.error('Error sending language:', error);
      setTranslationLoading(false);
    }}, [toLanguage])
    
  function handleCopy() {
    navigator.clipboard.writeText(tab==='transcription'? transcription: translation);
  };

  function handleDownload() {
    const element = document.createElement('a');
    const file = new Blob([tab==='transcription'? transcription: translation], {type:'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Transcrilate-${new Date().toDateString()}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <main className='flex-1 p-4 flex flex-col justify-center gap-3 sm:gap-4 text-center pb-20 mx-auto w-full max-w-prose'>
        <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl animate-[rollingColor_4s_linear_infinite]'>Tran{tab==='transcription'? <span className='text-orange-400 bold'>scription</span>: <span className='text-orange-400 bold'>slation</span>}</h1>
        <div className='items-center mx-auto bg-white border-2 border-solid border-orange-400 shadow rounded-full overflow-hidden grid grid-cols-2'>
            <button onClick={() => {setTab('transcription')}} className={'px-4 py-1 font-medium duration-300 ' + (tab==='transcription'? 'bg-orange-400 text-white': 'bg-white text-orange-600 hover:text-slate-400')}>Transcription</button>
            <button onClick={() => {setTab('translation')}} className={'px-4 py-1 font-medium duration-300 ' + (tab==='translation'? 'bg-orange-400 text-white': 'bg-white text-orange-600 hover:text-slate-400')}>Translation</button>
        </div>

        <div className='flex flex-col my-8 '>
          {tab==='transcription'? 
          <Transcription transcription={transcription}/>: 
          <Translation translation={translation} toLanguage={toLanguage} setToLanguage={setToLanguage} translationLoading={translationLoading} languageSubmit={languageSubmit}/>}
        </div>

        <div className='flex items-center gap-4 mx-auto text-lg'>
          <button onClick={handleCopy} title='Copy' className='bg-tranparent px-4 hover:text-orange-400'>
            <i className="fa-regular fa-copy"></i>
          </button>
          <button onClick={handleDownload} title='Download' className='bg-transparent px-4 hover:text-orange-400'>
            <i className="fa-solid fa-download"></i>
          </button>
        </div>
    </main>
  )
}
