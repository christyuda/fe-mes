import { BASE_URL_API } from '../global-variable.js';

function setAvatars() {
    const url = `${BASE_URL_API}/calon-siswa/biodata`;
    const token = localStorage.getItem('access_token'); 

    if (token !== null) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Terjadi kesalahan saat mengambil data. Silakan coba lagi.');
            }
            return response.json(); 
        })
        .then(data => {
            if (data.jenis_kelamin) {
                const avatarElements = document.querySelectorAll('.avatar img');
                avatarElements.forEach(avatar => {
                    if (data.jenis_kelamin === "L") {
                        avatar.src = '../../assets/img/avatars/1.png';
                    } else if (data.jenis_kelamin === "P") {
                        avatar.src = '../../assets/img/avatars/2.png';
                    } 
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
            });
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Anda belum login. Silakan login terlebih dahulu.',
        });
    }
}

setAvatars();


