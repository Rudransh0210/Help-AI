import { auth } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { showToast } from './alert.js';

document.getElementById('logout-button').addEventListener('click', () => {
    signOut(auth).then(() => {
        showToast('Logged out successfully');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000); // Redirect after toast message
    }).catch((error) => {
        showToast(`Logout error: ${error.message}`);
    });
});
