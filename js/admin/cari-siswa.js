import { BASE_URL_API } from '../global-variable.js';

document.getElementById('searchBtn').addEventListener('click', function () {
    const keyword = document.getElementById('searchKeyword').value;
    const url = `${BASE_URL_API}/admin-sekolah/detil-calon-siswa/${keyword}`;
    const token = localStorage.getItem("access_token");

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
                    throw new Error("Terjadi kesalahan saat mengambil data. Silakan coba lagi.");
                }
                return response.json();
            })
            .then(data => {
                displayStudentDetails(data);
                document.getElementById('studentDetailsCard').style.display = 'block';
                //scroll to student details card
                document.getElementById('studentDetailsCard').scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire({
                    icon: "warning",
                    title: "Perhatian.",
                    text: "Silahkan Masukkan No Pendaftaran/Email/NISN dengan benar.",
                });
            });
    } else {
        Swal.fire({
            icon: "warning",
            title: "Perhatian.",
            text: "Anda belum login. Silakan login terlebih dahulu.",
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const data = {
        // Paste your JSON data here
    };

    displayStudentDetails(data);
});

function displayStudentDetails(data) {
    const details = document.getElementById('studentDetails');
    details.innerHTML = '';
    if (!data || !data.biodata) {
        details.innerHTML = '<p>Belum ada data yang bisa ditampilkan</p>';
        return;
    }

    let aturUlangKataSandiBtn = '';
    if (data.email) {
        aturUlangKataSandiBtn = ` <button id="aturUlangKataSandiBtn" class="btn btn-danger" data-email="${data.email}">Atur Ulang Kata Sandi</button>`;
    }

    // Biodata Section
    let biodataHTML = `
        <hr />
        <h2>Biodata</h2>
        <table>
            <tr><th>Nama Lengkap</th><td>${data.biodata.nama_lengkap}</td></tr>
            <tr><th>Tempat, Tanggal Lahir</th><td>${data.biodata.tempat_lahir}, ${data.biodata.tanggal_lahir}</td></tr>
            <tr><th>Jenis Kelamin</th><td>${data.biodata.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td></tr>
            <tr><th>NISN</th><td>${data.biodata.nisn ? data.biodata.nisn : '-'}</td></tr>
            <tr><th>NIK</th><td>${data.biodata.nik ? data.biodata.nik : '-'}</td></tr>
            <tr><th>No. KK</th><td>${data.biodata.no_kk ? data.biodata.no_kk : '-'}</td></tr>
            <tr><th>Email</th><td>${data.email ? data.email : '-'} ${aturUlangKataSandiBtn}</td></tr>
            <tr><th>Asal Sekolah</th><td>${data.biodata.asal_sekolah ? data.biodata.asal_sekolah : '-'}</td></tr>
            <tr><th>Agama</th><td>${data.biodata.agama ? data.biodata.agama : '-'}</td></tr>
            <tr><th>Alamat</th><td>${data.biodata.alamat ? data.biodata.alamat : '-'}</td></tr>
            <tr><th>RT/RW</th><td>${data.biodata.rt ? data.biodata.rt : "-"}/${data.biodata.rw ? data.biodata.rw : '-'}</td></tr>
            <tr><th>Desa</th><td>${data.biodata.desa ? data.biodata.desa : '-'}</td></tr>
            <tr><th>Kecamatan</th><td>${data.biodata.kecamatan ? data.biodata.kecamatan : '-'}</td></tr>
            <tr><th>Kode Pos</th><td>${data.biodata.kodepos ? data.biodata.kodepos : '-'}</td></tr>
            <tr><th>Jarak Rumah ke Sekolah</th><td>${data.biodata.jarak_rumah ? data.biodata.jarak_rumah : '-'}</td></tr>
            <tr><th>No. HP</th><td>${data.biodata.no_hp ? data.biodata.no_hp : '-'}</td></tr>
            <tr><th>Anak ke-</th><td>${data.biodata.anak_ke ? data.biodata.anak_ke : '-'}</td></tr>
            <tr><th>Jumlah Saudara</th><td>${data.biodata.jumlah_saudara ? data.biodata.jumlah_saudara : '-'}</td></tr>
            <tr><th>Status Anak</th><td>${data.biodata.status_anak ? data.biodata.status_anak : '-'}</td></tr>
            <tr><th>Kewarganegaraan</th><td>${data.biodata.kewarganegaraan ? data.biodata.kewarganegaraan : '-'}</td></tr>
        </table><br>
    `;
    details.innerHTML = biodataHTML;
    function formatRupiah(number) {
        const formatter = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        });
        return formatter.format(number);
    }
    // Parents Information
    let parentInfoHTML = '<h2>Data Orang Tua</h2>';
    if (data.orangtua && Array.isArray(data.orangtua) && data.orangtua.length > 0) {
        data.orangtua.forEach(parent => {

            parentInfoHTML += `
                <table>
                    <tr><th>Nama</th><td>${parent.nama ? parent.nama + ' (' + (parent.tipe || '-') + ')' : '-'}</td></tr>
                    <tr><th>NIK</th><td>${parent.nik || '-'}</td></tr>
                    <tr><th>Tempat, Tanggal Lahir</th><td>${parent.tempat_lahir && parent.tanggal_lahir ? parent.tempat_lahir + ', ' + parent.tanggal_lahir : '-'}</td></tr>
                    <tr><th>Status Orang Tua</th><td>${parent.status_orang_tua || '-'}</td></tr>
                    <tr><th>Keadaan</th><td>${parent.keadaan || '-'}</td></tr>
                    <tr><th>Pekerjaan</th><td>${parent.pekerjaan || '-'}</td></tr>
                    <tr><th>Pendidikan Terakhir</th><td>${parent.pendidikan_terakhir || '-'}</td></tr>
                    <tr><th>Penghasilan</th><td>${parent.penghasilan || '-'}</td></tr>
                    <tr><th>No. HP</th><td>${parent.no_hp || '-'}</td></tr>
                    <tr><th>Alamat Lengkap</th><td>${parent.alamat_lengkap || '-'}</td></tr>
                </table><br>`;
        });
    } else {
        parentInfoHTML += '<p>Informasi orang tua tidak tersedia.</p>';
    }
    details.innerHTML += parentInfoHTML;
    if (data.jalur_pendaftaran && data.jalur_pendaftaran.length > 0) {
        data.jalur_pendaftaran.forEach((reg, index) => {
            let headerTitle = `Jalur Pendaftaran${data.jalur_pendaftaran.length > 1 ? ' ' + (index + 1) : ''}`;
            let registrationHTML = `<h2>${headerTitle}</h2><table>`;
            registrationHTML += `
                <tr><th>Jalur Pendaftaran</th><td>${reg.jalur_pendaftaran.trim()}</td></tr>
                <tr><th>No Pendaftaran</th><td>${reg.no_pendaftaran}</td></tr>
                <tr><th>Tanggal Pendaftaran</th><td>${reg.tanggal_pendaftaran}</td></tr>
                <tr><th>Status</th><td><div id="status">${reg.status}</div></td></tr>
                <tr><th>Pilihan Jurusan 1</th><td>${reg.pilihan_jurusan_1}</td></tr>
                <tr><th>Pilihan Jurusan 2</th><td>${reg.pilihan_jurusan_2}</td></tr>
                <tr><th>Pilihan Jurusan 3</th><td>${reg.pilihan_jurusan_3}</td></tr>
            `;

            //if status is sudah-diperbaiki, then show form to change status to data-diperbaiki (is mean batalkan perbaikan) with textarea to input reason why it's canceled
            if (reg.status === 'sudah-diperbaiki') {
                registrationHTML += `
                    <tr><th>Catatan</th><td><textarea id="catatan" placeholder="Catatan" class="form-control"></textarea></td></tr>
                    <tr><th></th><td><button id="cancelPerbaikanBtn" type="submit" class="btn btn-warning" data-no-pendaftaran="${reg.no_pendaftaran}">Batalkan Perbaikan</button></td></tr>
                `;
            }

            registrationHTML += '</table> <br>';

            if (reg.nilai && reg.nilai.length > 0) {
                const semesters = [...new Set(reg.nilai.map(item => item.semester))];
                semesters.forEach(semester => {
                    registrationHTML += `<h3>Nilai Semester ${semester}</h3><table>`;
                    reg.nilai.filter(n => n.semester === semester).forEach(n => {
                        const nilaiFormatted = n.nilai === "-" ? "Tidak Ada" : n.nilai;
                        registrationHTML += `<tr><th>${n.kategori_nilai.replace("-", " ").toUpperCase()}</th><td>${nilaiFormatted}</td></tr>`;
                    });
                    registrationHTML += `</table><br>`;
                });
            } else {
                registrationHTML += `<p>Tidak ada nilai </p><br>`;
            }

            if (reg.berkas && reg.berkas.length > 0) {
                registrationHTML += `<h3>Berkas</h3><table>`;
                reg.berkas.forEach(doc => {
                    registrationHTML += `
                            <tr><th>${doc.kategori_berkas.replace(/_/g, ' ').toUpperCase()}</th><td><a href="${doc.tautan}" target="_blank">Unduh Berkas</a></td></tr>
                    `;
                });
                registrationHTML += '</table><br>';
            } else {
                registrationHTML += `<p>Tidak ada berkas </p><br>`;
            }

            details.innerHTML += registrationHTML;
        });
    } else {
        details.innerHTML += '<p>No registration paths available.</p>';
    }

    //list akun_dengan_nisn_yang_sama 
    let akunHTML = '<h2>Akun dengan NISN yang sama</h2>';
    if (data.akun_dengan_nisn_yang_sama && data.akun_dengan_nisn_yang_sama.length > 0) {
        data.akun_dengan_nisn_yang_sama.forEach(akun => {
            akunHTML += `<table>
                <tr><th>Nama Lengkap</th><td>${akun.nama_lengkap}</td></tr>
                <tr><th>Email</th><td>${akun.email}</td></tr>
                <tr><th>Nomor HP</th><td>${akun.nomor_hp}</td></tr>
                <tr><th>Akun Dibuat</th><td>${akun.akun_dibuat}</td></tr>
                </table>
            `;
        });
        details.innerHTML += akunHTML;
    }
}

document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'cancelPerbaikanBtn') {
        Swal.fire({
            title: 'Batalkan Perbaikan',
            text: 'Apakah Anda yakin ingin membatalkan perbaikan data siswa ini?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Batalkan Perbaikan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            } else {
                const noPendaftaran = e.target.getAttribute('data-no-pendaftaran');
                const catatan = document.getElementById('catatan').value;
                const url = `${BASE_URL_API}/admin-sekolah/batalkan-perbaikan/${noPendaftaran}`;
                const token = localStorage.getItem("access_token");

                if (catatan.trim() === '') {
                    Swal.fire({
                        icon: "warning",
                        title: "Perhatian.",
                        text: "Catatan tidak boleh kosong. Silakan isi catatan terlebih dahulu.",
                    });
                    return;
                }

                if (token !== null) {
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            catatan: catatan
                        })
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Terjadi kesalahan saat membatalkan perbaikan. Silakan coba lagi.");
                            }
                            return response.json();
                        })
                        .then(data => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Perbaikan dibatalkan',
                                text: 'Perbaikan data siswa berhasil dibatalkan.'
                            });
                            //cancelPerbaikanBtn is disabled after success cancel
                            document.getElementById('cancelPerbaikanBtn').disabled = true;
                            //status is changed to data-diperbaiki
                            document.getElementById('status').innerHTML = 'data-diperbaiki';
                            //catatan is disabled after success cancel
                            document.getElementById('catatan').disabled = true;
                        })
                        .catch(error => {
                            console.error("Error:", error);
                            Swal.fire({
                                icon: "warning",
                                title: "Perhatian.",
                                text: "Terjadi kesalahan saat membatalkan perbaikan. Silakan coba lagi.",
                            });
                        });
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Perhatian.",
                        text: "Anda belum login. Silakan login terlebih dahulu.",
                    });
                }
            }
        });
    }
});

document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'aturUlangKataSandiBtn') {
        Swal.fire({
            title: 'Atur Ulang Kata Sandi',
            text: 'Apakah Anda yakin ingin mengatur ulang kata sandi akun ini? Kata sandi baru akan ditampilkan setelah Anda menekan tombol "Ya, Atur Ulang Kata Sandi".',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Atur Ulang Kata Sandi',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (!result.isConfirmed) {
                return;
            } else {
                const email = e.target.getAttribute('data-email');
                const url = `${BASE_URL_API}/admin-sekolah/atur-ulang-kata-sandi/${email}`;
                const token = localStorage.getItem("access_token");

                if (token !== null) {
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        }
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Terjadi kesalahan saat mengatur ulang kata sandi. Silakan coba lagi.");
                            }
                            return response.json();
                        })
                        .then(data => {
                            let kata_sandi_baru = data.kata_sandi_baru ? data.kata_sandi_baru : '--';

                            Swal.fire({
                                icon: 'success',
                                title: 'Kata Sandi akun berhasil diatur ulang',
                                text: 'Kata Sandi baru: ' + kata_sandi_baru + '. Silakan berikan kepada siswa sebelum kotak dialog ini ditutup.',
                            });
                        })
                        .catch(error => {
                            console.error("Error:", error);
                            Swal.fire({
                                icon: "warning",
                                title: "Perhatian.",
                                text: "Terjadi kesalahan saat mengatur ulang kata sandi. Silakan coba lagi.",
                            });
                        });
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Perhatian.",
                        text: "Anda belum login. Silakan login terlebih dahulu.",
                    });
                }
            }
        });
    }
});