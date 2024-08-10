import { BASE_URL_API } from './global-variable.js';

function fetchUserProfile() {
  const url = `${BASE_URL_API}/calon-siswa/profil-user`;
  const token = localStorage.getItem("access_token");

  if (token !== null) {
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Terjadi kesalahan saat mengambil data profil pengguna. Silakan coba lagi."
          );
        }
        return response.json();
      })
      .then((data) => {
        replaceContentWithUserProfile(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Anda belum login. Silakan login terlebih dahulu.",
    });
  }
}

function replaceContentWithUserProfile(userProfile) {
  const nameElement = document.querySelector(".fw-medium.d-block");
  const breadcumbElement = document.querySelector(".fw-semibold");
  const emailElement = document.querySelector(".text-muted");

  if (nameElement && emailElement) {
    const shortenedName =
      userProfile.nama.length > 22
        ? userProfile.nama.substring(0, 10) + "..."
        : userProfile.nama;
    nameElement.textContent = shortenedName;
    breadcumbElement.textContent = userProfile.nama;
    emailElement.textContent = userProfile.email;
  } else {
    console.error("Element not found");
  }
}

fetchUserProfile();
