# This file should ingest cv-valid-dev.csv into elasticsearch.
import pandas as pd
from elasticsearch import Elasticsearch

# Load data
df = pd.read_csv('cv-valid-dev.csv')

# Connect to local Elasticsearch
es = Elasticsearch()

index_name = 'cv-transcription'

# Refresh indices
es.indices.delete(index=index_name, ignore_unavailable=True)
es.indices.create(index=index_name)

# Index data
for i, row in df.iterrows():
  row_dict = row.to_dict()
  # Replace all nan values with None to prevent type errors
  for key in row_dict.keys():
    if pd.isnull(row_dict[key]):
      row_dict[key] = None
  response = es.index(index=index_name, document=row_dict)

    
# Check if data is indexed, if successful, you should see data printed out
print(es.search(index=index_name, body={'query': {'match_all': {}}}))