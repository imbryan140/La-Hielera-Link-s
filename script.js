// FUNCIÓN PARA COPIAR WIFI
function copyWifi() {
    const wifiPass = "LaHielera"; 
    
    navigator.clipboard.writeText(wifiPass).then(() => {
        // Buscamos el botón específicamente por su clase corregida
        const btn = document.querySelector('.btn-wifi');
        
        if (btn) {
            const originalText = btn.innerText;
            
            btn.innerText = "¡CLAVE COPIADA!";
            btn.style.background = "#ffffff"; 
            btn.style.color = "#000000";

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = ""; 
                btn.style.color = "";
            }, 2000);
        }
    }).catch(err => {
        console.error('Error al copiar: ', err);
        alert("No se pudo copiar automáticamente. La clave es: " + wifiPass);
    });
}

// FUNCIÓN PARA DESPLEGAR INSTAGRAM
function toggleInstagram() {
    const subMenu = document.getElementById('sub-links-ig');
    const btnMain = document.getElementById('btn-ig-main');

    // Verificamos si está oculto
    if (subMenu.style.display === 'none' || subMenu.style.display === '') {
        subMenu.style.display = 'block';
        btnMain.innerText = "INSTAGRAM ▲"; // Cambiamos la flecha hacia arriba
    } else {
        subMenu.style.display = 'none';
        btnMain.innerText = "INSTAGRAM ▼"; // Cambiamos la flecha hacia abajo
    }
}
