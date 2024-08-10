import { BASE_URL_API } from '../global-variable.js';

document.getElementById('unduh-template-verifikasi-calon-siswa').addEventListener('click', async () => {
    // make file excel template with column name : no, user_id, nama_jalur_pendaftaran, status, catatan
    const data = [
        { no: 1, user_id: '123456', nama_jalur_pendaftaran: 'Nama Jalur Pendaftaran', status: 'sudah-diverifikasi', catatan: '' },
        { no: 2, user_id: '123457', nama_jalur_pendaftaran: 'Nama Jalur Pendaftaran', status: 'data-diperbaiki', catatan: 'Tambahakan catatan yang membuat data calon siswa ini harus diperbaiki ulang' },
        { no: 3, user_id: '123458', nama_jalur_pendaftaran: 'Nama Jalur Pendaftaran', status: 'data-ditolak', catatan: 'Tambahakan catatan yang membuat data calon siswa ini harus ditolak' },
        { no: 4, user_id: '123459', nama_jalur_pendaftaran: 'Nama Jalur Pendaftaran', status: 'terverifikasi', catatan: '' },
    ];

    const headers = [
        { header: 'No', key: 'no', width: 10 },
        { header: 'User ID', key: 'user_id', width: 15 },
        { header: 'Nama Jalur Pendaftaran', key: 'nama_jalur_pendaftaran', width: 25 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Catatan', key: 'catatan', width: 30 }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data, {
        header: headers.map(header => header.key),
        skipHeader: false
    });
    worksheet['!cols'] = headers.map(header => ({ wch: header.width }));

    XLSX.utils.book_append_sheet(workbook, worksheet, "template-verifikasi-calon-siswa");
    XLSX.writeFile(workbook, "template-verifikasi-calon-siswa.xlsx");

    //reload page
    window.location.reload(true);

});

document.getElementById('unduh-template-pengumuman-calon-siswa').addEventListener('click', async () => {
    // make file excel template with column name : no, user_id, nama_jalur_pendaftaran, status, catatan
    const data = [
        { no: 1, user_id: '123456', nama_jalur_pendaftaran: 'Nama Jalur Pendaftaran', nama_jurusan:'tkj', status: 'diterima', catatan: '' },
        { no: 2, user_id: '123457', nama_jalur_pendaftaran: 'Nama Jalur Pendaftaran', nama_jurusan:'tkp', status: 'cadangan', catatan: '' },
        { no: 3, user_id: '123458', nama_jalur_pendaftaran: 'Nama Jalur Pendaftaran', nama_jurusan:'', status: 'tidak-diterima', catatan: '' },
    ];

    const headers = [
        { header: 'No', key: 'no', width: 10 },
        { header: 'User ID', key: 'user_id', width: 15 },
        { header: 'Nama Jalur Pendaftaran', key: 'nama_jalur_pendaftaran', width: 25 },
        { header: 'Nama Jurusan', key: 'nama_jurusan', width: 25 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Catatan', key: 'catatan', width: 30 }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data, {
        header: headers.map(header => header.key),
        skipHeader: false
    });
    worksheet['!cols'] = headers.map(header => ({ wch: header.width }));

    XLSX.utils.book_append_sheet(workbook, worksheet, "template-pengumuman-calon-siswa");
    XLSX.writeFile(workbook, "template-pengumuman-calon-siswa.xlsx");

    //reload page
    window.location.reload(true);

});

document.addEventListener('DOMContentLoaded', function () {
    const endpoint = `${BASE_URL_API}/jalur-pendaftaran`;
    const token = localStorage.getItem("access_token");

    fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('table-body');
            data.data.forEach((item, index) => {
                const row = document.createElement('tr');

                const cellsData = [
                    item.nama,
                    // item.tanggal_mulai,
                    // item.tanggal_selesai,
                    // item.kuota,
                    item.kategori_berkas.replace(/,/g, ', '),
                    item.kategori_nilai.replace(/,/g, ', '),
                    item.is_aktif ? 'Aktif' : 'Tidak Aktif'
                ];

                cellsData.forEach(text => {
                    const cell = document.createElement('td');
                    cell.textContent = text;
                    cell.className = "text-center";
                    row.appendChild(cell);
                });

                const actionCell = document.createElement('td');
                actionCell.className = "text-center";
                actionCell.innerHTML = `
                <input type="file" id="verify-file-input-${index}" style="display: none;" accept=".xlsx, .xls">
                <button type="button" class="btn btn-warning btn-sm" onclick="document.getElementById('verify-file-input-${index}').click()">
                    <i class="mdi mdi-account-check" title="Verify"></i>
                </button>
                <button type="button" class="btn btn-primary btn-sm" onclick="editRow(${item.id})">
                    <i class="mdi mdi-table-edit" title="Edit"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteRow(${item.id})">
                    <i class="mdi mdi-delete" title="Delete"></i>
                </button>
            `;
                row.appendChild(actionCell);
                tableBody.appendChild(row);

                // Attach event listener to input
                document.getElementById(`verify-file-input-${index}`).addEventListener('change', function (event) {
                    handleVerifyUpload(event, item.id, item.nama);
                });
            });
        })
        .catch(error => {
            console.error('Terjadi kesalahan saat mengambil data:', error);
        });
});
function handleVerifyUpload(event, jalurPendaftaranId, jalurPendaftaranNama) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const token = localStorage.getItem("access_token");
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);
        postExcelData(rows, jalurPendaftaranId, jalurPendaftaranNama, token);
    };
    reader.readAsArrayBuffer(file);
}
function postExcelData(rows, jalurPendaftaranId, jalurPendaftaranNama, token) {
    if (!token) {
        console.error("Token tidak tersedia untuk permintaan POST.");
        return;
    }

    // Validate nama jalur pendaftaran
    const isValid = validateNamaJalurPendaftaran(jalurPendaftaranNama, rows[0].nama_jalur_pendaftaran);
    if (!isValid) {
        Swal.fire({
            title: 'Kesalahan!',
            text: 'Nama Jalur Pendaftaran tidak sesuai dengan data yang diunggah.',
            icon: 'warning',
        });
        return;
    }

    const verifikasi = rows.map(row => ({
        no: row.no || '',
        user_id: row.user_id || '',
        nama_jalur_pendaftaran: jalurPendaftaranNama || '',
        jalur_pendaftaran_id: jalurPendaftaranId,
        status: row.status || '',
        catatan: row.catatan || ''
    }));

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
            fetch(`${BASE_URL_API}/admin-sekolah/verifikasi-calon-siswa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ verifikasi })
            })
                .then(response => {
                    if (!response.ok) throw new Error(`Kesalahan HTTP! status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    displayUploadedData(data.berhasil, data.gagal, jalurPendaftaranNama);
                })
                .catch(error => {
                    console.error('Kesalahan:', error);
                    Swal.fire(
                        'Kesalahan!',
                        'Terjadi masalah saat mengunggah data.',
                        'error'
                    );
                });
        }
    });
}

function validateNamaJalurPendaftaran(namaDariExcel, namaDariAPI) {
    return namaDariExcel === namaDariAPI;
}

function displayUploadedData(berhasil, gagal, jalurPendaftaranNama) {
    let berhasilHtml = "";
    let gagalHtml = "";

    if (berhasil === null) {
        berhasilHtml = '<tr><td colspan="4">Tidak ada data yang berhasil diunggah</td></tr>';
    } else {
        berhasilHtml = berhasil.map((row, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${row.user_id}</td>
                <td>${jalurPendaftaranNama}</td>
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
                <td>${jalurPendaftaranNama}</td>
                <td>${row.error}</td>
            </tr>
        `).join('');
    }

    Swal.fire({
        title: 'File berhasil diunggah',
        html: `
      <div style="max-height: 400px; overflow-y: auto;">
      <h4>Berhasil Verifikasi</h4>
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
        <h4>Gagal Verifikasi</h4>
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
