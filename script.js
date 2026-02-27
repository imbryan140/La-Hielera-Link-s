function copyWifi() {
    const password = LaHielera;
    navigator.clipboard.writeText(password);
    
        const btn = document.querySelector('.btn-wifi');
    const originalText = btn.innerText;
    btn.innerText = "¡CLAVE COPIADA!";
    btn.style.backgroundColor = "#FF9900";
    btn.style.color = "black";

    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "transparent";
        btn.style.color = "white";
    }, 2000);
}