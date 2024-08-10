import { BASE_URL_API } from '../global-variable.js';

function fetchDataFromEndpoint() {
    const url = `${BASE_URL_API}/admin-sekolah/laporan-jumlah-calon-siswa`;
    const token = localStorage.getItem("access_token");
  
    if (token !== null) {
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
          }
          return response.json();
        })
        .then(data => {
          const tbody = document.getElementById('data-body');
          tbody.innerHTML = ''; 
          data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td class="text-left">${item.slug.toUpperCase()}</td>
              <td class="text-center">${item.jumlah_pendaftar.pilihan_1}</td>
              <td class="text-center">${item.jumlah_pendaftar.pilihan_2}</td>
              <td class="text-center">${item.jumlah_pendaftar.pilihan_3}</td>
            `;
            tbody.appendChild(tr);
          });
        })
        .catch(error => {
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
  
  document.addEventListener('DOMContentLoaded', () => {
    fetchDataFromEndpoint(); 
  
    document.getElementById('unduhBtn').addEventListener('click', async () => {
        const allStudents = await fetchAllStudents();
        if (allStudents.length > 0) {
            exportToExcel(allStudents);
        } else {
            console.log("No data to export");
        }
    });
    
  });  
  
  
  async function fetchAllStudents() {
    //show swal loading if fetching data then hide it after fetching data
    Swal.fire({
        title: 'Mengunduh data...',
        text: 'Silakan tunggu.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
    });

    let allStudents = [];
    let currentPage = 1;
    let fetchMore = true;

    while (fetchMore) {
        const url = `${BASE_URL_API}/admin-sekolah/daftar-calon-siswa?page=${currentPage}`;
        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'content-type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const { data, next_page_url, last_page } = await response.json();

            if (data && data.length > 0) {
                allStudents = allStudents.concat(data); 
                currentPage++; 
                Swal.update({
                    title: 'Mengunduh data...',
                    text: `halaman ${currentPage} / ${last_page}`,
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading();
                    },
                    showConfirmButton: false

                });

                fetchMore = !!next_page_url;
            } else {
                fetchMore = false; 
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            fetchMore = false; 
        }
    }

    Swal.close();
    return allStudents;
}

function exportToExcel(data) {
    const headers = [
        { header: 'No', key: 'no', width: 5},
        { header: 'No Pendaftaran', key: 'no_pendaftaran', width: 20 },
        { header: 'Tanggal Pendaftaran', key: 'tanggal_pendaftaran', width: 20 },
        { header: 'User ID', key: 'user_id', width: 15 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Catatan', key: 'catatan', width: 20 },
        { header: 'Jalur Pendaftaran', key: 'jalur_pendaftaran', width: 30 },
        { header: 'Pilihan Jurusan 1', key: 'pilihan_1', width: 25 },
        { header: 'Pilihan Jurusan 2', key: 'pilihan_2', width: 25 },
        { header: 'Pilihan Jurusan 3', key: 'pilihan_3', width: 25 },
        { header: 'Nama Lengkap', key: 'nama_lengkap', width: 20 },
        { header: 'NISN', key: 'nisn', width: 15 },
        { header: 'NIK', key: 'nik', width: 20 },
        { header: 'No KK', key: 'no_kk', width: 20 },
        { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 15 },
        { header: 'Tempat Lahir', key: 'tempat_lahir', width: 20 },
        { header: 'Asal Sekolah', key: 'asal_sekolah', width: 25 },
        { header: 'Rata Rata Matematika', key: 'rata_rata_matematika', width: 25 },
        { header: 'Rata Rata Bahasa Indonesia', key: 'rata_rata_bahasa_indonesia', width: 25 },
        { header: 'Rata Rata Bahasa Inggris', key: 'rata_rata_bahasa_ingggris', width: 25 },
        { header: 'Rata Rata IPA', key: 'rata_rata_ipa', width: 25 },
        { header: 'Rata Rata IPS', key: 'rata_rata_ips', width: 25 },
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
        no: data.indexOf(item) + 1,
        no_pendaftaran: item.no_pendaftaran,
        tanggal_pendaftaran: item.tanggal_pendaftaran,
        user_id: item.user_id,
        email : item.email,
        status: item.status,
        catatan: item.catatan,
        jalur_pendaftaran: item.jalur_pendaftaran,
        pilihan_1: item.pilihan_jurusan_1,
        pilihan_2: item.pilihan_jurusan_2,
        pilihan_3: item.pilihan_jurusan_3,
        nama_lengkap: item.biodata.nama_lengkap,
        nisn: item.biodata.nisn,
        nik: item.biodata.nik,
        no_kk: item.biodata.no_kk,
        jenis_kelamin: item.biodata.jenis_kelamin,
        tempat_lahir: item.biodata.tempat_lahir,
        asal_sekolah: item.biodata.asal_sekolah,
        rata_rata_matematika: item.nilai_rata_rata.matematika,
        rata_rata_bahasa_indonesia: item.nilai_rata_rata.bahasa_indonesia,
        rata_rata_bahasa_ingggris: item.nilai_rata_rata.bahasa_inggris,
        rata_rata_ipa: item.nilai_rata_rata.ipa,
        rata_rata_ips: item.nilai_rata_rata.ips,
    })), {
        header: headers.map(header => header.key),
        skipHeader: false
    });
    // Set column widths
    worksheet['!cols'] = headers.map(header => ({wch: header.width}));

    XLSX.utils.book_append_sheet(workbook, worksheet, "data-calon-siswa");
    XLSX.writeFile(workbook, "data-calon-siswa.xlsx");
}

function fetchInformationFormulir() {
    const url =
      `${BASE_URL_API}/admin-sekolah/jalur-ppdb-aktif`;
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
          replaceContent(data);
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
  
  function replaceContent(userJalur) {
    const PengubahanDataElement = document.getElementById("pengubahan_data");
    const namaJalurElement = document.getElementById("nama_jalur");
    const tanggalMulaiElement = document.getElementById("tanggal_mulai");
    const tanggalSelesaiElement = document.getElementById("tanggal_selesai");
    const kategoriBerkasElement = document.getElementById("kategori_berkas");
    const kategoriNilaiElement = document.getElementById("kategori_nilai");

  
    PengubahanDataElement.textContent = userJalur.ubah_data_diizinkan ? "Diizinkan" : "Tidak Diizinkan";
    namaJalurElement.textContent = userJalur.detil_jalur.nama;
    tanggalMulaiElement.textContent = userJalur.detil_jalur.tanggal_mulai;
    tanggalSelesaiElement.textContent = userJalur.detil_jalur.tanggal_selesai;
    kategoriBerkasElement.textContent = userJalur.detil_jalur.kategori_berkas;
    kategoriNilaiElement.textContent = userJalur.detil_jalur.kategori_nilai;

  }
  
  fetchInformationFormulir();