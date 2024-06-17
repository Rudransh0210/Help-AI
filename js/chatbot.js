import { auth, database } from './firebase-config.js';
import { handleEmergency } from './emergency.js';
import { ref, push, get, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
let currentSessionId;
let userId;
let selectedBot = 'medical_chat'; // Initial selection: medical_chat

document.querySelector(`.menu-item[data-value=${selectedBot}]`).classList.add('selected');

function generateSessionId() {
    return 'session-' + Math.random().toString(36).substr(2, 9);
}

const loadChatHistory = async (userId) => {
    const chatHistoryRef = ref(database, `chats/${userId}/${selectedBot}`); 
    onValue(chatHistoryRef, (snapshot) => {
        const chatHistory = snapshot.val();
        const chatHistoryList = document.getElementById('chat-history');
        chatHistoryList.innerHTML = '';
        for (let sessionId in chatHistory) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="session-info">
                    <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z"/></svg>
                    <span>${sessionId}</span>
                </div>
            `;
            listItem.onclick = () => loadSessionChats(userId, sessionId);
            chatHistoryList.appendChild(listItem);
        }
    });
};


const loadSessionChats = (userId, sessionId) => {
    currentSessionId = sessionId; // Set currentSessionId to the selected session
    const sessionChatRef = ref(database, `chats/${userId}/${selectedBot}/${currentSessionId}`);
    
    onValue(sessionChatRef, (snapshot) => {
        const chatMessages = snapshot.val();
        const chatWindow = document.getElementById('chat-window');
        chatWindow.innerHTML = '';

        // Display initial message based on selected bot
        let initialMessage = '';
        switch (selectedBot) {
            case 'medical_chat':
                initialMessage = "Welcome! Let's get you the first aid assistance you need";
                break;
            case 'mental_health_chat':
                initialMessage = "Hello! How can I help you feel better today?";
                break;
            case 'diagnosis_chat':
                initialMessage = "Welcome! How can I assist with your medical diagnosis today?";
                break;
            default:
                initialMessage = "Welcome.";
        }

        const initialMessageElement = document.createElement('div');
        initialMessageElement.classList.add('bot-message', 'initial-message');

        // Create and append avatar image
        const avatarElement = document.createElement('img');
        avatarElement.src = '../images/logo.png';
        avatarElement.alt = 'Avatar';
        avatarElement.classList.add('message-avatar-initial');
        initialMessageElement.appendChild(avatarElement);

        // Create and append message text
        const messageText = document.createElement('p');
        messageText.textContent = initialMessage;
        initialMessageElement.appendChild(messageText);

        // Clear existing content and append the initial message element
        chatWindow.innerHTML = '';
        chatWindow.appendChild(initialMessageElement);


        // Display chat messages
        if (chatMessages) {
            chatWindow.innerHTML = '';
            for (let key in chatMessages) {
                const messageData = chatMessages[key];
                const messageElement = document.createElement('div');
                const avatarElement = document.createElement('img');
                const messageBubble = document.createElement('div');
                
                if (messageData.user === 'user') {
                    messageElement.classList.add('user-message');
                    avatarElement.src = '../images/avatar.png'; 
                    avatarElement.alt = 'Avatar';
                } else {
                    messageElement.classList.add('bot-message');
                    avatarElement.src = '../images/logo.png';
                    avatarElement.alt = 'Bot';
                }

                avatarElement.classList.add('message-avatar');
                messageElement.appendChild(avatarElement);
                messageBubble.classList.add('message-bubble');
                messageBubble.textContent = messageData.message;
                messageElement.appendChild(messageBubble);
                chatWindow.appendChild(messageElement);
            }
        }
    });
};

const createNewSession = () => {
    currentSessionId = generateSessionId();
    document.getElementById('message-input').disabled = false;
    loadSessionChats(userId, currentSessionId);
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        const userRef = ref(database, 'users/' + userId);

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                document.getElementById('username').innerText = `${userData.username}`;
                loadChatHistory(userId);
                createNewSession();
            }
        });

        document.getElementById('message-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const messageInput = document.getElementById('message-input');
            const message = messageInput.value;
            const timestamp = new Date().toISOString();

            push(ref(database, `chats/${userId}/${selectedBot}/${currentSessionId}`), {
                user: 'user',
                message: message,
                timestamp: timestamp
            });

            messageInput.value = '';
            messageInput.disabled = true;

            fetch(`http://localhost:5050/${selectedBot}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message
                })
            }).then(response => response.json())
            .then(botReplies => {
                if (botReplies && Object.keys(botReplies).length !== 0) {
                    const responses = botReplies.response;
                    if (responses && Array.isArray(responses)) {
                        responses.forEach(reply => {
                            if (reply == "<ALERT>") {
                                handleEmergency(userId);
                            } else {
                                const botMessage = {
                                    user: 'bot',
                                    message: reply, 
                                    timestamp: new Date().toISOString()
                                };
                                push(ref(database, `chats/${userId}/${selectedBot}/${currentSessionId}`), botMessage);
                            }
                        });
                    }
                }
                messageInput.disabled = false;
            }).catch(error => {
                console.error('Error:', error);
                messageInput.disabled = false;
            });
        });

        document.getElementById('new-chat-button').addEventListener('click', createNewSession);

        document.getElementById('change-password-button').addEventListener('click', () => {
            window.location.href = 'change-password.html';
        });

        function selectItem(element) {
            document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('selected'));
            element.classList.add('selected');
            const selectBox = document.getElementById('model-select');
            selectBox.value = element.getAttribute('data-value');
            selectedBot = element.getAttribute('data-value');
            loadChatHistory(userId);
            createNewSession();
        }
        
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (event) => {
                selectItem(event.target);
            });
        });
        

    } else {
        window.location.href = 'login.html';
    }
});
