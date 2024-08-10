
import { CihuyGetCookie } from '../cookies.js';
const token = CihuyGetCookie('access_token'); 

document.getElementById('logoutBtn').addEventListener('click', function() {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('access_token');
    window.location.href = 'masuk-admin.html';
});
if (localStorage.getItem('access_token') === null) {
    window.location.href = 'masuk-admin.html';
}
if ((token) === null){
    window.location.href = 'masuk-admin.html';
}
