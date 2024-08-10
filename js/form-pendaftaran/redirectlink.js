import { BASE_URL_API } from '../global-variable.js';

function cekRedirectLink() {
    const url = `${BASE_URL_API}/calon-siswa/status-pengisian-formulir`;
    const token = localStorage.getItem('access_token');

    if (token !== null) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',

            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Terjadi kesalahan saat mengambil data. Silakan coba lagi.');
            }
            return response.json();
        })
        .then(data => {
            if (Object.keys(data).length === 0) {
              
                window.location.href = 'form-pendaftaran.html';
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

cekRedirectLink();  