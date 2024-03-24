import csv
import requests
import os
from pathlib import Path
import pandas as pd

# Define constants
API_URL = 'http://localhost:8000/asr'
CSV_FILE = 'common_voice/cv-valid-dev.csv'
# CSV_FILE2 = './common_voice/cv-valid-dev2.csv'
AUDIO_FOLDER = 'common_voice/cv-valid-dev' 

def transcribe_audio(audio_file):
    """
    Transcribe audio file using ASR API
    """
    with open(audio_file, 'rb') as f:
        files = {'file': f}
        response = requests.post(API_URL, files=files)
        if response.status_code == 200:
            result = response.json()
            return result.get('transcription', ''), result.get('duration', '')
        else:
            return None, None

def main():
    # Read CSV file
    df = pd.read_csv(CSV_FILE)
    if 'generated_text' not in df.columns:
        df['generated_text'] = None
    
    # Find indexes of rows with missing transcriptions
    missing_transcriptions = df[df['generated_text'].isnull()]
    index_chunks = [missing_transcriptions.index[i:i+10] for i in range(0, missing_transcriptions.shape[0], 10)]
    
    # Transcribe audio files in batches of 10 and update CSV file
    for indexes in index_chunks:
        try:
            for index in indexes:
                row = df.loc[index]
                audio_file = os.path.join(AUDIO_FOLDER, row['filename'])
                print("Transcribing audio file: ", audio_file)
                transcription, duration = transcribe_audio(audio_file)
                df.at[index, 'generated_text'] = transcription
                df.at[index, 'duration'] = duration
                print(f"Transcribed {audio_file}: {transcription}")
            df.to_csv(CSV_FILE, index=False)
        except Exception as e:
            print(f"Error transcribing audio files: {e}")
            return False
    return True


if __name__ == "__main__":
    completed = False
    while not completed:
        completed = main()
