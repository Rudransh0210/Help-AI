export function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('visible');
    }, 100); // Slight delay to trigger CSS transition

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 1000); // Remove the toast after it's hidden
    }, 2000); // Visible duration
}
