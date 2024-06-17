import json
import os
import pandas as pd
import numpy as np
import torch
from sentence_transformers import SentenceTransformer, util
from tqdm import tqdm

class IntentProcessor:
    def __init__(self):
        self.json_path = self.get_file_path('../../database/intents.json')
        self.csv_path = self.get_file_path('../../database/mental_health.csv')
        self.embedding_model_name = "all-mpnet-base-v2"
        self.embedding_model = SentenceTransformer(model_name_or_path=self.embedding_model_name, device="cpu")
        self.df = None
        self.patterns = []
        self.save_path = self.get_file_path('../../database/embeddings.csv')

    def get_file_path(self, filename):
        current_dir = os.path.dirname(__file__) if '__file__' in globals() else os.getcwd()
        return os.path.join(current_dir, filename)

    def load_json(self):
        with open(self.json_path, 'r') as json_file:
            self.json_data = json.load(json_file)

    def load_csv(self):
        df = pd.read_csv(self.csv_path, encoding='utf-8')
        self.csv_data = df.to_dict(orient='records')

    def preprocess_data(self):
        intents_list = []
        for intent in self.json_data['intents']:
            tag = intent['tag']
            patterns = intent['patterns']
            for pattern in patterns:
                intent_dict = {
                    'tag': tag,
                    'pattern': pattern
                }
                intents_list.append(intent_dict)
        for question in self.csv_data:
            tag = question['Question_ID']
            patterns = question['Questions']
            intent_dict = {
                'tag': tag,
                'pattern': patterns
            }
            intents_list.append(intent_dict)
        self.df = pd.DataFrame(intents_list)

    def embed_intents(self):
        intents = self.df.to_dict(orient="records")
        for item in tqdm(intents):
            item["embedding"] = self.embedding_model.encode(item["pattern"])
        self.df = pd.DataFrame(intents)

    def save_to_csv(self):
        self.df.to_csv(self.save_path, index=False)

    def load_from_csv(self):
        self.df = pd.read_csv(self.save_path)
        return self.df

    def process(self, load_csv=False):
        self.load_json()
        self.load_csv()
        self.preprocess_data()
        self.embed_intents()
        self.save_to_csv()
        if load_csv:
            return self.load_from_csv()

    def prepare_embeddings(self):
        self.df["embedding"] = self.df["embedding"].apply(lambda x: np.fromstring(x.strip("[]"), sep=" "))
        self.intents = self.df.to_dict(orient="records")
        self.embeddings = torch.tensor(np.array(self.df["embedding"].tolist()), dtype=torch.float32).to("cpu")

    def retrieve_relevant_intent(self, query: str):
        query_embedding = self.embedding_model.encode(query, convert_to_tensor=True)
        dot_scores = util.dot_score(query_embedding, self.embeddings)[0]
        scores, indices = torch.topk(input=dot_scores, k=1)
        relevant_intent = [self.intents[index]["tag"] for index in indices]
        return relevant_intent