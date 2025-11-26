// Clear all stored tokens
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
sessionStorage.removeItem('access_token');
sessionStorage.removeItem('refresh_token');

console.log('All tokens cleared. Please refresh and login again.');

// Redirect to login
window.location.href = '/login';