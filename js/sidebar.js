const quickLinks = [
    { label: 'Beranda', key : 'beranda', link: 'dashboard-siswa.html', slug: 'dashboard'},
    { label: 'Biodata diri', key: 'biodata', link: 'biodata.html', slug: 'biodata' },
    { label: 'Data Ayah', key: 'data-ayah', link: 'orang-tua.html?slug=data-ayah', slug: 'data-ayah' },
    { label: 'Data Ibu', key: 'data-ibu', link: 'orang-tua.html?slug=data-ibu', slug: 'data-ibu'},
    { label: 'Data Wali', key: 'data-wali', link: 'orang-tua.html?slug=data-wali', slug: 'data-wali' },
    { label: 'Data Nilai', key: 'nilai', link: 'nilai.html', slug: 'nilai' },
    { label: 'Data Berkas', key: 'berkas', link: 'berkas.html', slug: 'berkas' },
];

const sidebarMenu = document.getElementById('sidebarMenu');
const dashboardSubMenu = document.getElementById('dashboardSubMenu');
const ubahDiizinkan = localStorage.getItem('ubah_diizinkan_data') === 'true';


// Generate dashboard submenu when page loads
quickLinks.forEach(link => {
    const subMenuItem = document.createElement('li');
    subMenuItem.className = 'menu-item';

    const subMenuLink = document.createElement('a');
    subMenuLink.className = 'menu-link';
    subMenuLink.href = link.link;
    subMenuLink.textContent = link.label;
    if (ubahDiizinkan || link.key === 'beranda') {
        subMenuLink.href = link.link;
    } else {
        subMenuLink.addEventListener('click', function(e) {
            e.preventDefault();
            Swal.fire({
                icon: "warning",
                title: "Perhatian!",
                text: "Anda tidak memiliki izin untuk mengubah data.",
            });
                });
    }

    subMenuItem.appendChild(subMenuLink);
    dashboardSubMenu.appendChild(subMenuItem);

    // add active class to current page link in sidebar menu when page loads 
    if (window.location.href.includes(link.slug)) {
        subMenuItem.classList.add('active');
    }
  
});

