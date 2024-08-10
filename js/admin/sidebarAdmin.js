const quickLinks = [
  {
    label: "Beranda",
    key: "beranda",
    link: "dashboard-admin.html",
    slug: "dashboard",
  },
  {
    label: "Jalur pendaftaran ",
    key: "jalur-pendaftaran.html",
    link: "jalur-pendaftaran.html",
    slug: "jalur-pendaftaran",
  },
  // { label: 'Data Ayah', key: 'data-ayah', link: 'orang-tua.html?slug=data-ayah', slug: 'data-ayah' },
  // { label: 'Data Ibu', key: 'data-ibu', link: 'orang-tua.html?slug=data-ibu', slug: 'data-ibu'},
  // { label: 'Data Wali', key: 'data-wali', link: 'orang-tua.html?slug=data-wali', slug: 'data-wali' },
  // { label: 'Data Nilai', key: 'nilai', link: 'nilai.html', slug: 'nilai' },
  // { label: 'Data Berkas', key: 'berkas', link: 'berkas.html', slug: 'berkas' },
];

const sidebarMenu = document.getElementById("sidebarMenu");
const dashboardSubMenu = document.getElementById("dashboardSubMenu");

// Generate dashboard submenu when page loads
quickLinks.forEach((link) => {
  const subMenuItem = document.createElement("li");
  subMenuItem.className = "menu-item";

  const subMenuLink = document.createElement("a");
  subMenuLink.className = "menu-link";
  subMenuLink.href = link.link;
  subMenuLink.textContent = link.label;
  subMenuItem.appendChild(subMenuLink);
  dashboardSubMenu.appendChild(subMenuItem);

  // add active class to current page link in sidebar menu when page loads
  if (window.location.href.includes(link.slug)) {
    subMenuItem.classList.add("active");
  }
});
