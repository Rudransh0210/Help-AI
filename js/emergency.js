import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { database } from './firebase-config.js';

export async function handleEmergency(userId) {
    const userRef = ref(database, `users/${userId}`);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const value = snapshot.val();
            const parentSpouseNumber = '+91' + value['parentSpouseNumber'];
            sendSMSMessage(parentSpouseNumber);
        } else {
            console.error('Emergency contact number not found in database.');
        }
    }).catch(error => {
        console.error('Error fetching emergency contact number:', error);
    });
}

async function sendSMSMessage(number) {
    try {
        const response = await fetch('http://localhost:5050/send-sms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ number })
        });
        const result = await response.json();
        if (result.success) {
            console.log('SMS message sent successfully:', result.messageSid);
        } else {
            console.error('Error sending SMS message:', result.error);
        }
    } catch (error) {
        console.error('Error sending SMS message:', error);
    }
}
