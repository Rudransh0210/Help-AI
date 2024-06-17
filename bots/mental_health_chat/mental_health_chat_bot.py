import json
import os
import pandas as pd
import random
import spacy
from bots.mental_health_chat.intent_processor import IntentProcessor

class Mental_Health_Chatbot:
    def __init__(self):
        self.intent_processor = IntentProcessor()
        self.intent_processor.process(load_csv=True)
        self.intent_processor.prepare_embeddings()
        self.json_path = self.get_file_path('../../database/intents.json')
        self.csv_path = self.get_file_path('../../database/mental_health.csv')
        self.nlp = spacy.load("en_core_web_sm")
        self.nlp.add_pipe('sentencizer')
        self.intents = self.load_json()
        self.csv_data = self.load_csv()

    def get_file_path(self, filename):
        current_dir = os.path.dirname(__file__) if '__file__' in globals() else os.getcwd()
        return os.path.join(current_dir, filename)

    def load_json(self):
        with open(self.json_path, 'r') as json_file:
            return json.load(json_file)['intents']

    def load_csv(self):
        df = pd.read_csv(self.csv_path, encoding='utf-8')
        return df.to_dict(orient='records')

    def recognize_intent(self, user_input):
        return self.intent_processor.retrieve_relevant_intent(user_input)

    def generate_responses(self, user_input):
        responses = []
        unknown_responses = []
        alert_flag = False

        doc = self.nlp(user_input)
        for sent in doc.sents:
            known = False

            detected_intents = self.recognize_intent(sent.text)
            for intent in detected_intents:
                known = True

                if intent.isdigit():
                    response = self.search_csv(intent)
                else:
                    response = self.search_json(intent)
                    if intent.lower() in ['self_harm', 'extreme']:
                        alert_flag = True

                responses.append(response)

            if not known:
                unknown_responses.append("I'm not sure how to help with that part: '{}'".format(sent.text))

        if unknown_responses:
            responses.extend(unknown_responses)

        if alert_flag:
            responses.append("<ALERT>")

        return responses


    def search_csv(self, intent):
        result = next((item['Answers'] for item in self.csv_data if str(item['Question_ID']).strip() == intent), "No answer found.")
        return result

    def search_json(self, intent):
        result = next((random.choice(item['responses']) for item in self.intents if item['tag'] == intent), "No answer found.")
        return result
