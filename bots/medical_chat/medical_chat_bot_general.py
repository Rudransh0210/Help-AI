import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline

class Medical_Chatbot:
    def __init__(self):
        self.filename = self.get_file_path('../../database/medical_chat_bot_general.json')
        self.patterns = []
        self.tags = []
        self.responses = {}
        self.vectorizer = TfidfVectorizer()
        self.mlb = MultiLabelBinarizer()
        self.model = Pipeline([
            ('tfidf', self.vectorizer),
            ('clf', OneVsRestClassifier(LinearSVC()))
        ])
        self.load_data()
        self.train_model()

    def get_file_path(self, filename):
        current_dir = os.path.dirname(__file__) if '__file__' in globals() else os.getcwd()
        return os.path.join(current_dir, filename)

    def load_data(self):
        with open(self.filename) as file:
            data = json.load(file)
        for intent in data['intents']:
            for pattern in intent['patterns']:
                self.patterns.append(pattern)
                self.tags.append(intent['tag'])
            self.responses[intent['tag']] = intent['responses']

    def clean_text(self, text):
        return text.lower().strip()

    def train_model(self):
        cleaned_patterns = [self.clean_text(pattern) for pattern in self.patterns]
        X = self.vectorizer.fit_transform(cleaned_patterns)
        y = self.mlb.fit_transform([[tag] for tag in self.tags])
        self.model.fit(cleaned_patterns, y)

    def predict_class(self, sentence):
        cleaned_sentence = self.clean_text(sentence)
        predictions = self.model.predict([cleaned_sentence])
        predicted_labels = self.mlb.inverse_transform(predictions)
        return predicted_labels[0] if predicted_labels else []

    def get_response(self, intents):
        if not intents:
            response = ["I'm sorry, I didn't understand that. Could you please rephrase?"]
            return response
        response = []
        for intent in intents:
            if intent in self.responses:
                response.append(self.responses[intent]) 
        return response

    def chatbot_response(self, message):
        intent = self.predict_class(message)
        response = self.get_response(intent)
        return response

