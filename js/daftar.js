import { BASE_URL_API } from './global-variable.js';

document.getElementById("registerBtn").addEventListener("click", async function (event) {
  event.preventDefault();

  const name = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role_id = document.getElementById("role_id").value;

  // Simple frontend validation
  if (!name || !email || !password || !role_id) {
    showErrorNotification("Please fill in all fields correctly.");
    return;
  }

  const body = JSON.stringify({
    name: name,
    email: email,
    password: password,
    role_id: role_id
  });

  try {
    const response = await fetch(`${BASE_URL_API}auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });
    const data = await response.json();

    if (!response.ok || data.error) {
      showErrorNotification(data.error || "Error occurred during registration.");
    } else {
      showSuccessNotification();
    }
  } catch (error) {
    showErrorNotification("Network or server error occurred.");
  }
});

function showSuccessNotification() {
  alert("Pendaftaran Berhasil! Anda telah berhasil mendaftar.");
  window.location.href = "masuk.html";
}

function showErrorNotification(error) {
  if (typeof error === "object" && error !== null) {
    error = Object.values(error).join("\n");
  }
  alert("Perhatian: " + (error || "Terjadi kesalahan saat melakukan pendaftaran."));
}
