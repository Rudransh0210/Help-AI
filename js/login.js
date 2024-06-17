import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { showToast } from './alert.js';

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showToast('Logged in successfully');
            setTimeout(() => {
                window.location.href = 'chatbot.html'; // Redirect to chatbot.html
            }, 1000); // Redirect after toast message
        })
        .catch((error) => {
            showToast('Invalid credentials');
        });
});
