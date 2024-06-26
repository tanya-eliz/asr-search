# This file should ingest cv-valid-dev.csv into elasticsearch.
import pandas as pd
from elasticsearch import Elasticsearch

# Load data
df = pd.read_csv('cv-valid-dev.csv')

# Connect to elasticsearch cluster hosted on AWS
es = Elasticsearch(
  "http://ec2-13-229-61-124.ap-southeast-1.compute.amazonaws.com:9200"
)

# Connect to elasticsearch cluster hosted on local machine
# es = Elasticsearch("http://localhost:9200")

index_name = 'cv-transcription'

# Refresh indices
# filename,text,up_votes,down_votes,age,gender,accent,duration,generated_text

es.indices.delete(index=index_name, ignore_unavailable=True)
es.indices.create(index=index_name)
es.indices.put_mapping(
    index=index_name,
    body={
      "properties": {
        "filename": {"type": "keyword"},
        "text": {"type": "text",
                  "fields": {
                    "suggest": {
                      "type": "search_as_you_type"
                      }
                    }
                  },
        "up_votes": {"type": "integer"},
        "down_votes": {"type": "integer"},
        "age": {"type": "text"},
        "gender": {"type": "keyword"},
        "accent": {"type": "text"},
        "duration": {"type": "float"},
        "generated_text": {"type": "text"},
        "text_completion": {"type": "completion"}
        }
      },
)

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