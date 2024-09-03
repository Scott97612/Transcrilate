import React from 'react'

export default function Transcription(props) {
  // eslint-disable-next-line react/prop-types
  const {transcription} = props;

  return (
    <div>{transcription}</div>
  )
}
