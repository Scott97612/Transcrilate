import React from 'react'

export default function FileDisplay(props) {
const {file, audioStream, resetAudio} = props;

  return (
    <main className='flex-1 p-4 flex flex-col justify-center gap-3 sm:gap-4 md:gap-5 text-center pb-20 mx-auto w-fit max-w-full'>
        <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl animate-[rollingColor_4s_linear_infinite]'>Your<span className='text-orange-400 bold'>File</span></h1>
        <div className='flex flex-col mx-auto text-left my-4'>
            <h3 className='bold font-semibold'>Name: </h3>
            <p>{file.name}</p>
        </div>

        <div className='flex items-center justify-between gap-4'>
            <button onClick={resetAudio} className='text-slate-400 simpleBtn'><p className='bold font-semibold'>Reset</p></button>
            <button className='specialBtn px-4 py-2 rounded-xl text-orange-400 flex items-center gap-2'>
                <p className='bold font-semibold'>Transcribe</p>
                <i className="fa-solid fa-feather"></i>
            </button>
        </div>
    </main>
  )
}
