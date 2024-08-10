// import { Swal } from '../sweetalert2';
import { CihuyPost } from 'https://c-craftjs.github.io/api/api.js';
import { BASE_URL_API } from '../global-variable.js';

document.getElementById('loginBtn').addEventListener('click', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const body = {
    email: email,
    password: password
  };

  try {
    const response = await CihuyPost(`${BASE_URL_API}/auth/login`, body);
    console.log('Response:', response);

    if (response && response.data && response.data.access_token) {
      showSuccessNotification('Login berhasil!');
      const accessToken = response.data.access_token;
      document.cookie = `access_token=${accessToken}; path=/`;
      localStorage.setItem('access_token', accessToken);
      setTimeout(() => {
        window.location.href = 'dashboard-admin.html';
      }, 2500);
    } else {
      showErrorNotification('Email atau Kata Sandi salah.');
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorNotification('Terjadi kesalahan saat melakukan login.');
  }
});

function showSuccessNotification(message) {
  Swal.fire({
    icon: 'success',
    title: 'Login Berhasil!',
    text: message,
    showConfirmButton: false,
    timer: 2000 
  });
}

function showErrorNotification(errorMessage) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: errorMessage,
    confirmButtonText: 'Tutup'
  });
}
