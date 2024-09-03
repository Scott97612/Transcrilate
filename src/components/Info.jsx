import React from 'react'
import { useState } from 'react'
import Transcription from './Transcription';
import Translation from './Translation';

export default function Info(props) {
  const {transcription, translation} = props;

  const [tab, setTab] = useState('transcription');

  function handleCopy() {
    navigator.clipboard.writeText(tab==='transcription'? transcription: translation);
  };

  function handleDownload() {
    const element = document.createElement('a');
    const file = new Blob([], {type:'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download(`Transcrilate-${new Date().toDateString()}.txt`);
    element.body.appendChild(element);
    element.click();
  };

  return (
    <main className='flex-1 p-4 flex flex-col justify-center gap-3 sm:gap-4 text-center pb-20 mx-auto w-full max-w-prose'>
        <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl animate-[rollingColor_4s_linear_infinite]'>Tran<span className='text-orange-400 bold'>scription</span></h1>
        <div className='items-center mx-auto bg-white border-2 border-solid border-orange-400 shadow rounded-full overflow-hidden grid grid-cols-2'>
            <button onClick={() => {setTab('transcription')}} className={'px-4 py-1 font-medium duration-300 ' + (tab==='transcription'? 'bg-orange-400 text-white': 'bg-white text-orange-600 hover:text-slate-400')}>Transcription</button>
            <button onClick={() => {setTab('translation')}} className={'px-4 py-1 font-medium duration-300 ' + (tab==='translation'? 'bg-orange-400 text-white': 'bg-white text-orange-600 hover:text-slate-400')}>Translation</button>
        </div>

        <div className='flex flex-col my-8 '>
          {tab==='transcription'? <Transcription transcription={transcription}/>: <Translation translation={translation}/>}
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
