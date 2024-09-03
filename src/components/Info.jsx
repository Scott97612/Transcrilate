import React from 'react'
import { useState } from 'react'
import Transcription from './Transcription';
import Translation from './Translation';

export default function Info(props) {

  const [tab, setTab] = useState('transcription');

  return (
    <main className='flex-1 p-4 flex flex-col justify-center gap-3 sm:gap-4 text-center pb-20 mx-auto w-full max-w-prose'>
        <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl animate-[rollingColor_4s_linear_infinite]'>Tran<span className='text-orange-400 bold'>scription</span></h1>
        <div className='items-center mx-auto bg-white border-2 border-solid border-orange-400 shadow rounded-full overflow-hidden grid grid-cols-2'>
            <button onClick={() => {setTab('transcription')}} className={'px-4 py-1 font-medium duration-300 ' + (tab==='transcription'? 'bg-orange-400 text-white': 'bg-white text-orange-600 hover:text-slate-400')}>Transcription</button>
            <button onClick={() => {setTab('translation')}} className={'px-4 py-1 font-medium duration-300 ' + (tab==='translation'? 'bg-orange-400 text-white': 'bg-white text-orange-600 hover:text-slate-400')}>Translation</button>
        </div>

        {tab==='transcription'? <Transcription {...props}/>: <Translation/>}
    </main>
  )
}
