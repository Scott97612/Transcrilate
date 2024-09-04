export default function Transcription(props) {
  // eslint-disable-next-line react/prop-types
  const {transcription} = props;

  return (
    <div className="flex flex-col mx-auto text-orange-500 p-3 font-medium text-xl">
      {transcription}
    </div>
  )
}
