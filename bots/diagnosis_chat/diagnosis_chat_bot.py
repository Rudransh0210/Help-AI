from bots.diagnosis_chat.question_classifier import QuestionClassifier
from bots.diagnosis_chat.question_parser import QuestionPaser
from bots.diagnosis_chat.answer_search import AnswerSearcher
from bots.diagnosis_chat.build_medical_graph import MedicalGraph


class Diagnosis_Chatbot:
    def __init__(self):
        self.graph = MedicalGraph()
        self.graph.create_graphnodes()
        self.graph.create_graphrels()
        self.classifier = QuestionClassifier()
        self.parser = QuestionPaser()
        self.searcher = AnswerSearcher()

    def get_diagnosis(self, sent):
        response = []
        answer = ["Hello, I am Diagnosis Assistant, I hope I can help you. If I don't answer it, I suggest you consult a professional doctor. I wish you a great body!"]
        res_classify = self.classifier.classify(sent)
        if not res_classify:
            return answer
        res_sql = self.parser.parser_main(res_classify)
        final_answers = self.searcher.search_main(res_sql)
        for answers in final_answers:
            response.append(answers)
        if not final_answers:
            return answer
        else:
            return response