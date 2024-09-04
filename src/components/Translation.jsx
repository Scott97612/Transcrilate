import {LANGUAGES} from '../utils/presets'
import { useEffect, useState } from 'react';

export default function Translation(props) {

  // eslint-disable-next-line react/prop-types
  const {translation, toLanguage, setToLanguage, translationLoading, languageSubmit} = props;
  const [renderedTranslationComponent, setRenderedTranslationComponent] = useState(null);

  useEffect(() => {
    if (translationLoading) {
      setRenderedTranslationComponent(<div className="loadingState"><i className="fa-solid fa-spinner"></i></div>);
    }
    else {
      setRenderedTranslationComponent(<div className="flex flex-col mx-auto text-orange-500 p-3 font-medium text-xl">{translation}</div>);
    }
  }, [translationLoading, translation, setRenderedTranslationComponent]);

  return (
    <div className="flex flex-col gap-2 max-w-[500px] w-full mx-auto">
      <div className="flex items-stretch gap-2">
        <select className='flex-1 bg-white focus:outline-none border border-solid border-transparent hover:border-orange-400 duration-300 px-3 py-2 rounded-lg' value={toLanguage} onChange={
          (e) => {
            setToLanguage(e.target.value);
          }}>
            <option value={'Select Language'}>
              Select Language
            </option>
            {Object.entries(LANGUAGES).map(([key, value]) => {
              return (
                <option key={key} value={value}>{key}</option>)
            })}

        </select>

        <button onClick={languageSubmit} className='specialBtn px-3 py-2 border-2 border-solid border-orange-400 shadow rounded-lg text-black hover:text-orange-600 duration-300'>
            Translate
        </button>
      </div>
      
      {renderedTranslationComponent}

    </div>
  )
}
