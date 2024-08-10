import { BASE_URL_API } from '../global-variable.js';

document.getElementById(`unggah-pengumuman-hasil-seleksi`).addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);
        postAnnouncementData(rows);
    };
    reader.readAsArrayBuffer(file);
});

function postAnnouncementData(rows) {
    const announcements = rows.filter((row) => Object.values(row).some((value) => value)).map((row) => ({
        user_id: row.user_id,
        jalur_pendaftaran_id: row.nama_jalur_pendaftaran,
        jurusan_id: row.nama_jurusan,
        status: row.status,
        catatan: row.catatan,
    }));

    //user_id, jalur_pendaftaran_id, status is required (not null, not empty, not undefined, not NaN, not false, not 0, not "", not ' ')
    const requiredFields = ['user_id', 'jalur_pendaftaran_id', 'status'];
    const invalidRows = announcements.filter((row) => requiredFields.some((field) => !row[field]));
    if (invalidRows.length > 0) {
        Swal.fire(
            'Perhatian!',
            `Ada baris yang tidak valid. Pastikan kolom user_id, nama_jalur_pendaftaran dan status tidak kosong.`,
            'warning'
        );
        return;
    }

    Swal.fire({
        title: 'Unggah File?',
        text: "Apakah Anda yakin ingin mengunggah file ini?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, unggah!',
        cancelButtonText: 'Batal',
        heightAuto: false,
        customClass: {
            popup: 'swal-wide'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${BASE_URL_API}/admin-sekolah/pengumuman-hasil-seleksi`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({ pengumuman: announcements })
            })
                .then(response => {
                    console.log(response);
                    if (!response.ok) throw new Error(`Kesalahan HTTP! status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    displayUploadedData(data.berhasil, data.gagal);
                })
                .catch(error => {
                    Swal.fire(
                        'Kesalahan!',
                        error.message,
                        'error'
                    );
                });
        }
    });
}

function displayUploadedData(berhasil, gagal) {

    let berhasilHtml = ""

    let gagalHtml = ""

    if (berhasil === null) {
        berhasilHtml = '<tr><td colspan="4">Tidak ada data yang berhasil diunggah</td></tr>';
    } else {
        berhasilHtml = berhasil.map((row, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${row.user_id}</td>
             <td>${row.jalur_pendaftaran_id}</td>
            <td>${row.status}</td>
        </tr>
    `).join('');
    }

    if (gagal === null) {
        gagalHtml = '<tr><td colspan="4">Tidak ada data yang gagal diunggah</td></tr>';
    } else {
        gagalHtml = gagal.map((row, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${row.user_id}</td>
             <td>${row.jalur_pendaftaran_id}</td>
            <td>${row.error}</td>
        </tr>
    `).join('');
    }

    Swal.fire({
        title: 'File berhasil diunggah',
        html: `
      <div style="max-height: 400px; overflow-y: auto;">
      <h4>Berhasil Unggah Pengumuman</h4>
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>No</th>
                    <th>User ID</th>
                    <th>Nama Jalur</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>${berhasilHtml}</tbody>
        </table>
        <br>
        <h4>Gagal Unggah Pengumuman</h4>
        <table border="1" style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th>No</th>
                    <th>User ID</th>
                    <th>Nama Jalur</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>${gagalHtml}</tbody>
        </table>
      </div>
      `,
        icon: 'info',
        width: '800px',
        customClass: {
            popup: 'formatted-swal'
        }
    }).then(() => {
        window.location.reload(true);
    });
}



