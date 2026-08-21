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
    const inputFecha = document.getElementById("fecha-reserva");
    const mesas = document.querySelectorAll(".plano-hielera .mesa:not(.vacio)");
    const btnConfirmar = document.getElementById("btn-confirmar-mesas");
    const modal = document.getElementById("modal-formulario");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");
    const formCliente = document.getElementById("form-datos-cliente");
    const txtMesasElegidas = document.getElementById("txt-mesas-elegidas");
    const txtFechaElegida = document.getElementById("txt-fecha-elegida");

    const hoy = new Date().toISOString().split("T")[0];
    inputFecha.value = hoy;
    let fechaSeleccionada = hoy;
    let unsubscribeSnapshot = null;

    function cargarCroquisPorFecha(fecha) {
        // CORREGIDO: Apunta directo a la colección de fechas
        const docRef = doc(db, "reservas_fechas", fecha);

        if (unsubscribeSnapshot) unsubscribeSnapshot();

        unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
            const data = docSnap.exists() ? docSnap.data() : {};
            
            mesas.forEach(mesa => {
                const estado = data[mesa.id]; // "pendiente" o "confirmada"
                
                // Si el cliente no la tiene seleccionada temporalmente en este momento
                if (!mesa.classList.contains("seleccion-temporal")) {
                    mesa.classList.remove("pendiente", "confirmada");
                    if (estado) {
                        mesa.classList.add(estado);
                    }
                }
            });
        });
    }

    cargarCroquisPorFecha(fechaSeleccionada);

    inputFecha.addEventListener("change", (e) => {
        fechaSeleccionada = e.target.value;
        mesas.forEach(m => m.classList.remove("seleccion-temporal"));
        cargarCroquisPorFecha(fechaSeleccionada);
    });

    // Manejar clics en las mesas
    mesas.forEach(mesa => {
        mesa.addEventListener("click", () => {
            // Si ya está confirmada (roja) o pendiente en Firebase, el cliente no la toca
            if (mesa.classList.contains("confirmada") || mesa.classList.contains("pendiente")) {
                alert("Esta mesa ya está reservada o en proceso.");
                return;
            }

            // Alternar selección temporal (amarillo)
            if (mesa.classList.contains("seleccion-temporal")) {
                mesa.classList.remove("seleccion-temporal");
            } else {
                mesa.classList.add("seleccion-temporal");
            }
        });
    });

    // Botón "Confirmar mesas" -> Abre el modal
    btnConfirmar.addEventListener("click", () => {
        const mesasSeleccionadas = Array.from(document.querySelectorAll(".mesa.seleccion-temporal"));
        
        if (mesasSeleccionadas.length === 0) {
            alert("Por favor, selecciona al menos una mesa libre en el plano.");
            return;
        }

        const idsMesas = mesasSeleccionadas.map(m => m.id.toUpperCase()).join(", ");
        txtMesasElegidas.textContent = idsMesas;
        txtFechaElegida.textContent = fechaSeleccionada;

        modal.style.display = "flex";
    });

    btnCerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Enviar formulario y redirigir a WhatsApp
    formCliente.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const cedula = document.getElementById("cedula").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        const mesasSeleccionadas = Array.from(document.querySelectorAll(".mesa.seleccion-temporal"));
        const idsMesas = mesasSeleccionadas.map(m => m.id);

        try {
            const docRef = doc(db, "reservas_fechas", fechaSeleccionada);
            
            const actualizacion = {};
            idsMesas.forEach(idMesa => {
                actualizacion[idMesa] = "pendiente"; // Bloquea en Firebase para este día
            });

            await setDoc(docRef, actualizacion, { merge: true });

            const textoWsp = `NUEVA SOLICITUD DE RESERVA%0A` +
                             `Fecha: ${fechaSeleccionada}%0A` +
                             `Mesa(s): ${idsMesas.join(", ").toUpperCase()}%0A` +
                             `Cliente: ${nombre} ${apellido}%0A` +
                             `Cédula: ${cedula}%0A` +
                             `Teléfono: ${telefono}`;

            const numeroWhatsApp = "584242191088"; 

            modal.style.display = "none";
            mesasSeleccionadas.forEach(m => m.classList.remove("seleccion-temporal"));

            window.open(`https://wa.me/${numeroWhatsApp}?text=${textoWsp}`, "_blank");

        } catch (error) {
            console.error("Error al registrar la reserva:", error);
            alert("Hubo un error al procesar tu reserva. Inténtalo de nuevo.");
        }
    });
});
