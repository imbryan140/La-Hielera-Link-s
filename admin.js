import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

    // Elementos del Modal Admin
    const modalAdminInfo = document.getElementById("modal-admin-info");
    const adminModalTitulo = document.getElementById("admin-modal-titulo");
    const adminModalContenido = document.getElementById("admin-modal-contenido");
    const btnAdminConfirmar = document.getElementById("btn-admin-confirmar");
    const btnAdminLiberar = document.getElementById("btn-admin-liberar");
    const btnAdminCerrar = document.getElementById("btn-admin-cerrar");

    let mesaActivaId = null;
    let fechaSeleccionada = "";

    // CONTRASEÑA DEL ADMIN
    const CLAVE_SECRETA = "hielera2026";

    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            if (inputPass.value === CLAVE_SECRETA) {
                if (loginOverlay) loginOverlay.style.display = "none";
                if (adminContent) adminContent.style.display = "block";
                inicializarPanelAdmin();
            } else {
                if (errorLogin) errorLogin.style.display = "block";
                inputPass.value = "";
            }
        });
    }

    function inicializarPanelAdmin() {
        const hoy = new Date().toISOString().split("T")[0];
        if (inputFechaAdmin) inputFechaAdmin.value = hoy;
        fechaSeleccionada = hoy;
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

        if (inputFechaAdmin) {
            inputFechaAdmin.addEventListener("change", (e) => {
                fechaSeleccionada = e.target.value;
                cargarCroquisAdmin(fechaSeleccionada);
            });
        }

        // Clic en mesa abre el modal con la información guardada
        mesas.forEach(mesa => {
            mesa.addEventListener("click", async () => {
                mesaActivaId = mesa.id;
                const numeroMesaActual = mesa.textContent.trim();
                
                if (adminModalTitulo) adminModalTitulo.textContent = `Mesa ${numeroMesaActual}`;
                
                if (!mesa.classList.contains("pendiente") && !mesa.classList.contains("confirmada")) {
                    if (adminModalContenido) adminModalContenido.innerHTML = `<p style="color: #9ca3af;">Esta mesa se encuentra <strong>Libre</strong>.</p>`;
                    if (btnAdminConfirmar) btnAdminConfirmar.style.display = "none";
                    if (btnAdminLiberar) btnAdminLiberar.style.display = "none";
                } else {
                    if (adminModalContenido) adminModalContenido.innerHTML = `<p>Cargando información del cliente...</p>`;
                    if (btnAdminConfirmar) btnAdminConfirmar.style.display = "block";
                    if (btnAdminLiberar) btnAdminLiberar.style.display = "block";

                    try {
                        const docRef = doc(db, "reservas_fechas", fechaSeleccionada);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            const cliente = data[`cliente_${mesaActivaId}`] || data.cliente || null;

                            if (cliente) {
                                // Si seleccionó varias mesas, mostramos el grupo completo en el título
                                if (cliente.mesasReservadas && adminModalTitulo) {
                                    adminModalTitulo.textContent = `Mesas Reservadas: ${cliente.mesasReservadas}`;
                                }

                                if (adminModalContenido) {
                                    adminModalContenido.innerHTML = `
                                        <p><strong>Cliente:</strong> ${cliente.nombre || ''} ${cliente.apellido || ''}</p>
                                        <p><strong>Cédula:</strong> ${cliente.cedula || 'No especificada'}</p>
                                        <p><strong>Teléfono:</strong> ${cliente.telefono || 'No especificado'}</p>
                                        <p><strong>Estado actual:</strong> <span style="text-transform: uppercase; color: ${mesa.classList.contains('confirmada') ? '#10b981' : '#f59e0b'};">${mesa.classList.contains('confirmada') ? 'Confirmada / Ocupada' : 'Pendiente'}</span></p>
                                    `;
                                }
                            } else {
                                if (adminModalContenido) adminModalContenido.innerHTML = `<p style="color: #f59e0b;">Mesa reservada externamente o sin datos de cliente detallados.</p>`;
                            }
                        }
                    } catch (error) {
                        console.error("Error al cargar datos del cliente:", error);
                        if (adminModalContenido) adminModalContenido.innerHTML = `<p style="color: #ef4444;">Error al obtener la información.</p>`;
                    }
                }

                if (modalAdminInfo) modalAdminInfo.style.display = "flex";
            });
        });

        // Botón Confirmar desde el modal
        if (btnAdminConfirmar) {
            btnAdminConfirmar.addEventListener("click", async () => {
                if (!mesaActivaId) return;
                try {
                    const docRef = doc(db, "reservas_fechas", fechaSeleccionada);
                    await setDoc(docRef, { [mesaActivaId]: "confirmada" }, { merge: true });
                    if (modalAdminInfo) modalAdminInfo.style.display = "none";
                } catch (error) {
                    console.error("Error al confirmar mesa:", error);
                }
            });
        }

        // Botón Liberar desde el modal
        if (btnAdminLiberar) {
            btnAdminLiberar.addEventListener("click", async () => {
                if (!mesaActivaId) return;
                try {
                    const docRef = doc(db, "reservas_fechas", fechaSeleccionada);
                    await setDoc(docRef, { 
                        [mesaActivaId]: "",
                        [`cliente_${mesaActivaId}`]: null
                    }, { merge: true });
                    if (modalAdminInfo) modalAdminInfo.style.display = "none";
                } catch (error) {
                    console.error("Error al liberar mesa:", error);
                }
            });
        }

        // Cerrar modal
        if (btnAdminCerrar) {
            btnAdminCerrar.addEventListener("click", () => {
                if (modalAdminInfo) modalAdminInfo.style.display = "none";
            });
        }
    }
});
