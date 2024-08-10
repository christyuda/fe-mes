
document.getElementById('foto').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const maxSize = 1024 * 1024; 

    if (file && file.size > maxSize) {
        alert('Ukuran gambar terlalu besar. Maksimal ukuran file adalah 1 MB.');
        event.target.value = null;
        return;
    }

    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('preview_file');
        preview.src = reader.result;
    };
    reader.readAsDataURL(file);
});