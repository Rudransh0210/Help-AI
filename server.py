from flask import Flask, request, jsonify
from flask_cors import CORS
from bots.mental_health_chat.mental_health_chat_bot import Mental_Health_Chatbot
from bots.medical_chat.medical_chat_bot_general import Medical_Chatbot
from bots.diagnosis_chat.diagnosis_chat_bot import Diagnosis_Chatbot
from twilio.rest import Client

app = Flask(__name__)
CORS(app)  

mental_health_chatbot = Mental_Health_Chatbot()
medical_chatbot = Medical_Chatbot()
diagnosis_chatbot = Diagnosis_Chatbot()

# Twilio configuration
twilio_account_sid = 'your_twilio_account_sid'
twilio_auth_token = 'your_auth_token'
twilio_phone_number = 'your_number'

client = Client(twilio_account_sid, twilio_auth_token)

@app.route('/send-sms', methods=['POST'])
def send_sms():
    data = request.get_json()
    number = data.get('number')
    
    if not number:
        return jsonify({'success': False, 'error': 'Missing number'}), 400
    
    try:
        message = client.messages.create(
            body='Mental Health Chatbot Emergency: Your assistance is needed!',
            from_=twilio_phone_number,
            to=number
        )
        return jsonify({'success': True, 'messageSid': message.sid}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/mental_health_chat', methods=['POST'])
def mental_health_chat():
    if request.method == 'POST':
        user_message = request.json.get('message')
        response = mental_health_chatbot.generate_responses(user_message)
        return jsonify({'response': response})
    else:
        return jsonify({'error': 'Invalid request method'}), 405

@app.route('/medical_chat', methods=['POST'])
def medical_chat():
    if request.method == 'POST':
        user_message = request.json.get('message')
        response = medical_chatbot.chatbot_response(user_message)
        return jsonify({'response': response})
    else:
        return jsonify({'error': 'Invalid request method'}), 405

@app.route('/diagnosis_chat', methods=['POST'])
def diagnosis_chat():
    if request.method == 'POST':
        user_message = request.json.get('message')
        response = diagnosis_chatbot.get_diagnosis(user_message)
        return jsonify({'response': response})
    else:
        return jsonify({'error': 'Invalid request method'}), 405
    
if __name__ == '__main__':
    app.run(port=5050)
