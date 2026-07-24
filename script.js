// FUNCIÓN PARA COPIAR WIFI
function copyWifi() {
    const wifiPass = "LaHielera"; 
    
    navigator.clipboard.writeText(wifiPass).then(() => {
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

    if (subMenu.style.display === 'none' || subMenu.style.display === '') {
        subMenu.style.display = 'block';
        btnMain.innerText = "INSTAGRAM ▲"; 
    } else {
        subMenu.style.display = 'none';
        btnMain.innerText = "INSTAGRAM ▼"; 
    }
}

// FUNCIÓN PARA DESPLEGAR WHATSAPP
function toggleWhatsapp() {
    var subMenu = document.getElementById("sub-links-wa");
    var btn = document.getElementById("btn-wa-main");
    
    if (subMenu.style.display === "none" || subMenu.style.display === "") {
        subMenu.style.display = "block"; 
        btn.innerHTML = "RESERVACIONES ▲";
    } else {
        subMenu.style.display = "none";
        btn.innerHTML = "RESERVACIONES ▼";
    }
}

// LÓGICA AUTOMÁTICA DEL CARRUSEL DE BANNERS
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    let currentIndex = 0;
    const intervalTime = 3000; 

    function nextSlide() {
        if (slides.length === 0) return;
        
        slides[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add("active");
    }

    if (slides.length > 0) {
        setInterval(nextSlide, intervalTime);
    }
});
