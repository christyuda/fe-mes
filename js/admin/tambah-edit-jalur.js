import { BASE_URL_API } from '../global-variable.js';

document.getElementById('perbaruiButton').addEventListener('click', function() {
 

  const data = {
      nama: document.getElementById('nama_jalur').value,
      tanggal_mulai: document.getElementById('tanggal_mulai').value,
      tanggal_selesai: document.getElementById('tanggal_selesai').value,
      kuota: parseInt(document.getElementById('kuota').value, 10),
      kategori_berkas: document.getElementById('kategori_berkas').value,
      kategori_nilai: document.getElementById('kategori_nilai').value,
      keterangan: document.getElementById('keterangan').value,
      is_izin_ubah_data: document.getElementById('is_izin_ubah_data').checked,
      is_aktif: document.getElementById('is_aktif').checked
  };
  const token = localStorage.getItem('access_token'); 

  fetch(`${BASE_URL_API}/jalur-pendaftaran`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          "Accept": "application/json"
      },
      body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data berhasil disimpan.'
    });
})
  .catch((error) => {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Error updating data.'
    });
    });
});
