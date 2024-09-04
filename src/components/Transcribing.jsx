export default function Transcribing() {

  return (
    <div className='flex flex-col items-center justify-center gap-10 md:gap-14 pb-24 text-center flex-1'>
        <div className='flex flex-col gap-3 sm:gap-4'>
            <h1 className='font-semibold text-5xl sm:text-6xl md:text-7xl animate-[rollingColor_4s_linear_infinite]'>Transcribing...</h1>
        </div>
        <div className='flex flex-col gap-2 sm:gap-4 max-w-[500px] mx-auto w-full p-4'>
            {[0, 1, 2].map(val => {
                return (
                    <div key={val} className={'rounded-full h-2 sm:h-3 bg-orange-300 loading ' + `loading${val}`}></div>
                )
            })}
        </div>
    </div>
        
  )
}
