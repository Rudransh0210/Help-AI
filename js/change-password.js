import { auth } from './firebase-config.js';
import { updatePassword } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { showToast } from './alert.js';

document.getElementById('change-password-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match');
        return;
    }

    const user = auth.currentUser;
    updatePassword(user, newPassword).then(() => {
        showToast('Password changed successfully');
        setTimeout(() => {
            window.location.href = 'chatbot.html';
        }, 1000); // Redirect after toast message
    }).catch((error) => {
        showToast(`Error: ${error.message}`);
    });
});
