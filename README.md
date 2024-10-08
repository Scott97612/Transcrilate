## Transcrilate

A web app that can transcribe English speech audio into text, and translate it into 19 most common languages. Audio can be uploaded as .wav and .mp3 file, or recordings right on the app.

<img width="1919" alt="image" src="https://github.com/user-attachments/assets/1a08b68a-4929-4002-b949-47c2bc67bdd0">

### Languages supported for translation: 

Spanish, French, German, Portuguese, Modern Standard Arabic, Simplified Chinese, Traditional Chinese, Russian, Hindi, Japanese, Italian, Finnish, Czech, Danish, Greek, Polish, Swedish, Norwegian, Korean.

### Use

Python backend `py_backend/backend.py` mainly uses flask and transformers, check `py_backend/requirements.txt` for dependencies.

React uses Tailwind for styling.

--------------------------------

`cd transcrilate/py_backend`

Create a conda env first, then

`conda activate transcrilate` 

`pip install -r requirements.txt`

`python3 backend.py`

Install Node.js, npm first, then

`cd transcrilate`

`npm install`

`npm run dev`

Get the localhost address to the browser.
