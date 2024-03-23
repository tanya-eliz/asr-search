from fastapi import FastAPI, Form, UploadFile
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
from datasets import Dataset, Audio
from pydub import AudioSegment
import torch
import os

# task 2a
app = FastAPI()
model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-large-960h")
processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-large-960h")

# task 2b
@app.get("/ping")
def health_check():
    return "pong"

# task 2c
@app.post("/asr")
def get_transcription_and_duration(file: UploadFile):
    
    # Read audio data into bytes
    audio_bytes = file.file.read()
    
    # Write to audio directory 
    with open('audio.wav', 'wb') as f:
        f.write(audio_bytes)
    
    # load into dataset
    ds = Dataset.from_dict({"audio": ["audio.wav"]}).cast_column("audio", Audio())
    
    # Get duration
    audio = AudioSegment.from_file('audio.wav')
    duration = audio.duration_seconds

    # tokenize input
    input_values = processor(ds[0]["audio"]["array"], return_tensors="pt", padding="longest", sampling_rate=16000).input_values
    
    # retrieve logits
    logits = model(input_values).logits
    
    # take argmax and decode
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)
    
    # Remove file 
    os.remove('audio.wav')
    
    # Format Response
    return {
        "transcription": transcription[0],
        "duration": f"{duration:.1f}"
    }