# asr-search
Automated Speech Recognition with Search Interface

# task2 testing (to be updated when dockerised)

1. Start python virtual environment
```source venv/bin/activate```

2. Install dependencies
```pip install -r requirements.txt```

<!-- deactivate and reactivate (step 1)-->
<!-- brew install ffmpeg (for mac) -->

3. cd into the directory with api
```cd asr```

4. To run the FASTAPI server with hot reload
```uvicorn main:app --reload```

5. Test on localhost http://127.0.0.1:8000/docs#/default

6, To deactivate the virtual environment
```deactivate```
