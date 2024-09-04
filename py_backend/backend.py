from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from transformers import pipeline
import os
import soundfile as sf
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.DEBUG)
FRONTEND_ENDPOINT = "http://localhost:5173"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": FRONTEND_ENDPOINT}})
socketio = SocketIO(app, cors_allowed_origins=FRONTEND_ENDPOINT)

transcription_result, translation_result = [], []

@app.route('/upload-audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    # Emit a "processing" event to notify the frontend
    socketio.emit('processing', {'status': 'Processing the audio file...'})
    # logging.debug('processing emitted')
    
    audio_file = request.files['audio']
    audio_path = os.path.join('uploaded_audio.wav')
    audio_file.save(audio_path)

    try:
        audio_data, sample_rate = sf.read(audio_path)
        transcriber = pipeline("automatic-speech-recognition", model="openai/whisper-tiny.en")
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
    
@app.route('/send-language', methods=['POST'])
def translate():
    # first check cache
    try:
        socketio.emit('translating', {'status': 'Processing translation...'})
        form = request.form
        language = form['language']
        translater = pipeline("translation", model="facebook/nllb-200-distilled-600M")
        translation = translater(transcription_result[-1], tgt_lang=language, src_lang='eng_Latn')
        translation_result.append(translation[0]['translation_text'])
        socketio.emit('translated', {'status': 'Translation complete'})
        return jsonify({'message': 'Translation complete'}), 200

    except Exception as e:
        socketio.emit('translation_error', {'status': f'Error: {str(e)}'})
        return jsonify({'error': str(e)}), 500
    
@app.route('/translation-result', methods=['GET'])
def get_translation():
    if translation_result:
        return jsonify({'translation': translation_result[-1]}), 200
    else:
        return jsonify({'error': 'No translation available'}), 404
    
@app.route('/reset', methods=['POST'])
def reset():
    if 'action' in request.form and request.form['action'] == 'reset':
        # reset backend data
        transcription_result, translation_result = [], []
        # logging.debug(f'Here are data lists: {translation_result}, {transcription_result}')
        return jsonify({'message': "Data reset successfully"}), 200 
    else:
        return jsonify({"message": "No data received"}), 400 

if __name__ == '__main__':
    socketio.run(app, debug=True)
