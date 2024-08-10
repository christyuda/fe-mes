    // // Fungsi untuk mengubah route URL tanpa menampilkan ekstensi .html
    // function changeRouteWithoutHtml(route) {
    //     const baseUrl = window.location.href.split('/').slice(0, -1).join('/');
    //     const newUrl = `${baseUrl}/${route}`;
    //     window.history.pushState(null, null, newUrl);
    // }

    // // Fungsi untuk mengubah route URL dengan menangkap semua perubahan URL
    // function captureRouteChanges() {
    //     const currentUrl = window.location.href;
    //     const route = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
    //     const routeWithoutHtml = route.replace('.html', '');
    //     console.log('Route saat ini:', routeWithoutHtml);

    //     // Di sini Anda dapat menambahkan logika untuk menangani setiap rute
    //     // Misalnya, menampilkan halaman yang sesuai berdasarkan rute

    //     // Contoh penggunaan untuk mengubah rute tanpa menampilkan ekstensi .html
    //     changeRouteWithoutHtml(routeWithoutHtml);
    // }

    // // Panggil fungsi untuk menangkap perubahan rute URL saat pertama kali dimuat
    // captureRouteChanges();
