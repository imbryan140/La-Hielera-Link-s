function copyWifi() {
    // CAMBIA ESTO: Pon la clave real de tu WiFi entre las comillas
    const wifiPass = "LaHielera"; 
    
    // Usamos la API del portapapeles moderna
    navigator.clipboard.writeText(wifiPass).then(() => {
        // Buscamos el botón por su clase (el cuarto botón de la lista)
        const btn = document.querySelector('.links-container button') || document.getElementById('wifi-btn');
        
        if (btn) {
            const originalText = btn.innerText;
            
            // Cambio visual de éxito
            btn.innerText = "¡CLAVE COPIADA!";
            btn.style.background = "#ffffff"; // Blanco momentáneo para resaltar
            btn.style.color = "#000000";

            // Regresa a la normalidad después de 2 segundos
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = ""; // Vuelve al degradado del CSS
                btn.style.color = "";
            }, 2000);
        }
    }).catch(err => {
        console.error('Error al copiar: ', err);
        alert("No se pudo copiar automáticamente. La clave es: " + wifiPass);
    });
}
