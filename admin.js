import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZ196SwJndBenHpiIEQXEj4a1ifi2rp8U",
    authDomain: "la-hielera---page.firebaseapp.com",
    projectId: "la-hielera---page",
    storageBucket: "la-hielera---page.firebasestorage.app",
    messagingSenderId: "119922260303",
    appId: "1:119922260303:web:7942468008c2b85c9aad3a",
    measurementId: "G-MEGS9VRG5R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");
    const inputPass = document.getElementById("password-admin");
    const loginOverlay = document.getElementById("login-overlay");
    const adminContent = document.getElementById("admin-content");
    const errorLogin = document.getElementById("error-login");

    const inputFechaAdmin = document.getElementById("fecha-admin");
    const mesas = document.querySelectorAll(".plano-hielera .mesa:not(.vacio)");

    // CONTRASEÑA DEL ADMIN (Puedes cambiarla aquí cuando quieras)
    const CLAVE_SECRETA = "hielera2026";

    // Manejar el evento de inicio de sesión
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        if (inputPass.value === CLAVE_SECRETA) {
            loginOverlay.style.display = "none";
            adminContent.style.display = "block";
            inicializarPanelAdmin();
        } else {
            errorLogin.style.display = "block";
            inputPass.value = "";
        }
    });

    function inicializarPanelAdmin() {
        const hoy = new Date().toISOString().split("T")[0];
        inputFechaAdmin.value = hoy;
        let fechaSeleccionada = hoy;
        let unsubscribeSnapshot = null;

        function cargarCroquisAdmin(fecha) {
            const docRef = doc(db, "reservas_fechas", fecha);

            if (unsubscribeSnapshot) unsubscribeSnapshot();

            unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
                const data = docSnap.exists() ? docSnap.data() : {};
                
                mesas.forEach(mesa => {
                    const estado = data[mesa.id];
                    mesa.classList.remove("pendiente", "confirmada");
                    if (estado) {
                        mesa.classList.add(estado);
                    }
                });
            });
        }

        cargarCroquisAdmin(fechaSeleccionada);

        inputFechaAdmin.addEventListener("change", (e) => {
            fechaSeleccionada = e.target.value;
            cargarCroquisAdmin(fechaSeleccionada);
        });

        // Lógica del Administrador al hacer clic en las mesas para cambiar estados
        mesas.forEach(mesa => {
            mesa.addEventListener("click", async () => {
                const docRef = doc(db, "reservas_fechas", fechaSeleccionada);
                let nuevoEstado = "";

                // Ciclo: Libre -> pendiente (amarillo) -> confirmada (rojo) -> Libre
                if (!mesa.classList.contains("pendiente") && !mesa.classList.contains("confirmada")) {
                    nuevoEstado = "pendiente";
                } else if (mesa.classList.contains("pendiente")) {
                    nuevoEstado = "confirmada"; // Pago confirmado (Rojo)
                } else {
                    nuevoEstado = ""; // Libera la mesa por completo
                }

                // Cambio visual inmediato
                mesa.classList.remove("pendiente", "confirmada");
                if (nuevoEstado) {
                    mesa.classList.add(nuevoEstado);
                }

                try {
                    await setDoc(docRef, {
                        [mesa.id]: nuevoEstado
                    }, { merge: true });
                } catch (error) {
                    console.error("Error al actualizar desde el admin:", error);
                }
            });
        });
    }
});
