export default function Header(props) {

  // eslint-disable-next-line react/prop-types
  const {Reset} = props;

  return (
    <header className='flex items-center justify-between gap-4 p-4'>
        <a href='/' onClick={Reset}><h1 className='font-semibold text-xl animate-[rollingColor_4s_linear_infinite]'>Tran<span className='text-orange-400 bold'>Scrilate</span></h1></a>
        <a href='/' onClick={Reset}><button className='flex items-center gap-2 simpleBtn px-4 py-2 rounded-xl text-orange-400 text-xl'>
            <p className='bold'>New</p>
            <i className="fa-regular fa-square-plus"></i>
        </button></a>
    </header>
  )
}
