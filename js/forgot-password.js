import { auth } from './firebase-config.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { showToast } from './alert.js';

document.getElementById('forgot-password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-password-email').value;

    sendPasswordResetEmail(auth, email)
        .then(() => {
            showToast("Password reset email sent!");
        })
        .catch((error) => {
            showToast(error.message);
        });
});
