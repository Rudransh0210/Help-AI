# 🌿 Help AI

Welcome to Help AI! Our platform hosts three specialized chatbots designed to provide assistance in critical areas: *First Aid, **Mental Health, and **General Diagnosis*. Each chatbot employs advanced technology to ensure accurate and helpful responses.

---

## 🌟 Sub-Bots

### 🩹 First Aid Bot
The First Aid Bot offers immediate assistance and guidance for various first aid situations using TF-IDF (Term Frequency-Inverse Document Frequency) to process and retrieve information from a comprehensive JSON file.

*Features:*
- Instant guidance on first aid procedures
- Easy-to-follow instructions for various emergencies
- Reliable information sourced from a detailed JSON file
- Session history with timestamps for user reference

### 🧠 Mental Health Bot
The Mental Health Bot provides support and information related to mental health issues, leveraging advanced embeddings for better understanding and response accuracy.

*Features:*
- Support and information on mental health topics
- Uses embeddings for improved understanding and responses
- *Star Feature:* Sends an alert message to a close one's phone number if the user is detected to be in distress using Twilio
- Session history with timestamps for user reference

### 🩺 General Diagnosis Bot
The General Diagnosis Bot helps users diagnose common symptoms and health conditions using a knowledge graph to ensure accurate and comprehensive information.

*Features:*
- Assists in diagnosing common symptoms and conditions
- Utilizes a knowledge graph built with Neo4j for detailed responses
- Covers a wide range of general health issues
- Session history with timestamps for user reference

---

## 💡 Technologies Used
- *TF-IDF:* First Aid Bot
- *Embeddings:* Mental Health Bot
- *Knowledge Graph:* General Diagnosis Bot, built using Neo4j
- *Data Storage:* User data is stored in Firebase
- *Alert Messaging:* Twilio is used to send alert messages

---
## 📦 Requirements
To set up the project locally, you can install the required dependencies using the requirements.txt file.

```bash
pip install -r requirements.txt
```

___

## 🛠 How to Use Locally
1. Clone the repository: `git clone <repository_url>`
2. Navigate into the project folder: `cd <repository_folder>`
3. Install dependencies: `pip install -r requirements.txt`
4. Update `firebase-config.json` with Firebase credentials.
5. Set up Neo4j and update connection details in `build_medical_graph.py` and `answer_search.py` to ensure proper integration with the Neo4j database.
6. Configure Twilio with Account SID, Auth Token, and phone number and update in `server.py`.
7. Run the Flask server: `python server.py`
8. Open `login.html` in your web browser to access the application.

---

Thank you for using Help AI! 🌿

