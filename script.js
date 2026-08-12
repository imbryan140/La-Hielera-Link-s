// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ==========================================
// 2. CONFIGURACIÓN DE FIREBASE (Reemplaza con tus datos reales)
// ==========================================
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==========================================
// 3. FUNCIONES DE INTERFAZ (Atadas a window por ser módulo)
// ==========================================
window.copyWifi = function() {
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
};

window.toggleInstagram = function() {
    const subMenu = document.getElementById('sub-links-ig');
    const btnMain = document.getElementById('btn-ig-main');
    if (subMenu.style.display === 'none' || subMenu.style.display === '') {
        subMenu.style.display = 'block';
        btnMain.innerText = "INSTAGRAM ▲"; 
    } else {
        subMenu.style.display = 'none';
        btnMain.innerText = "INSTAGRAM ▼"; 
    }
};

// ==========================================
// 4. LÓGICA DE FIREBASE (RESERVAS) Y CARRUSEL
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // A. Lógica del Carrusel
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

    // B. Lógica de Firebase para escuchar mesas en tiempo real
    const LIMITE_TIEMPO_MS = 40 * 60 * 1000; 
    onSnapshot(collection(db, "reservas"), (snapshot) => {
        const tiempoActual = Date.now();
        snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            const mesaId = change.doc.id;
            const elementoMesa = document.getElementById(mesaId);

            if (elementoMesa) {
                elementoMesa.classList.remove("pendiente", "confirmada");
                if (change.type === "removed") return;
                
                if (data.estado === "pendiente") {
                    const tiempoCreacion = data.creadoEn ? data.creadoEn.toMillis() : tiempoActual;
                    if ((tiempoActual - tiempoCreacion) <= LIMITE_TIEMPO_MS) {
                        elementoMesa.classList.add("pendiente");
                    }
                } else if (data.estado === "confirmada") {
                    elementoMesa.classList.add("confirmada");
                }
            }
        });
    });
});
