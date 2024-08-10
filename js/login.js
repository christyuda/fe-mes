// Import the BASE URL from your global variables if necessary
import { BASE_URL_API } from './global-variable.js';

document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById("loginButton");
  loginButton.addEventListener("click", handleLogin);
});

async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${BASE_URL_API}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  const data = await response.json();
  if (response.ok && data.token) {
    // Save token to localStorage and cookies
    localStorage.setItem('token', data.token);
    document.cookie = `token=${data.token}; path=/`;

    // Redirect to the dashboard based on role_id
    window.location.href = data.masuk_dashboard;
  } else {
    // Handle errors or invalid login
    alert(data.msg || "Login failed. Please check your credentials.");
  }
}
