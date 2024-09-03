from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from transformers import pipeline
import os
import soundfile as sf
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

transcriber = pipeline("automatic-speech-recognition", model="openai/whisper-tiny.en")
transcription_result = []

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    audio_path = os.path.join('uploaded_audio.wav')
    audio_file.save(audio_path)

    # Emit a "processing" event to notify the frontend
    socketio.emit('processing', {'status': 'Processing the audio file...'})

    try:
        audio_data, sample_rate = sf.read(audio_path)
        transcription = transcriber(audio_data, return_timestamps=False)
        transcription_result.append(transcription['text'])

        # delete the uploaded file
        os.remove(audio_path)

        # Emit a "complete" event to notify the frontend that transcription is done
        socketio.emit('complete', {'status': 'Transcription complete'})
        
        return jsonify({'message': 'Transcription complete'}), 200

    except Exception as e:
        socketio.emit('error', {'status': f'Error: {str(e)}'})
        return jsonify({'error': str(e)}), 500

@app.route('/transcription-result', methods=['GET'])
def get_transcription():
    if transcription_result:
        return jsonify({'transcription': transcription_result[-1]}), 200
    else:
        return jsonify({'error': 'No transcription available'}), 404

if __name__ == '__main__':
    socketio.run(app, debug=True)
