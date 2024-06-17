import { auth, database } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { showToast } from './alert.js';

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const phoneNumber = document.getElementById('register-phone').value;
    const parentSpouseNumber = document.getElementById('register-parent-spouse').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await set(ref(database, 'users/' + user.uid), {
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            parentSpouseNumber: parentSpouseNumber
        });
        showToast('Registered successfully');
        setTimeout(() => {
            window.location.href = 'chatbot.html';
        }, 1000); // Redirect after toast message
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            showToast('Email already in use');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000); // Redirect after toast message
        } else {
            showToast(`Error: ${error.message}`);
        }
    }
});
