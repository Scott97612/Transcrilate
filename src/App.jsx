import { useState } from 'react'
import Home from './components/Home'
import Header from './components/Header'
import Footer from './components/Footer'
import FileDisplay from './components/FileDisplay'

function App() {

  // if the audio is uploaded or recorded, the main part will display file instead
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const audioSource = file || audioStream;

  function resetAudio() {
    setFile(null);
    setAudioStream(null);
  }

  return (
    <div className='flex flex-col mx-auto w-full'>
      <section className='min-h-screen flex flex-col'>
        <Header/>
        {audioSource ? (<FileDisplay file={file} audioStream={audioStream} resetAudio={resetAudio}/>): (<Home setFile={setFile} setAudioStream={setAudioStream}/>)}
      </section>

      <Footer/>
    </div>
  )
}

export default App
