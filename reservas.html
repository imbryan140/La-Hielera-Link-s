import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
    const mesas = document.querySelectorAll(".mesa");
    const btnConfirmar = document.getElementById("btn-confirmar-mesas");
    const modal = document.getElementById("modal-formulario");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");
    const formCliente = document.getElementById("form-datos-cliente");
    const txtMesasElegidas = document.getElementById("txt-mesas-elegidas");
    const txtFechaElegida = document.getElementById("txt-fecha-elegida");

    const hoy = new Date().toISOString().split("T")[0];
    inputFecha.value = hoy;
    let fechaSeleccionada = hoy;

    async function cargarCroquisPorFecha(fecha) {
        const docRef = doc(db, "reservas_fechas", fecha);
        mesas.forEach(m => m.classList.remove("pendiente", "confirmada"));

        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                mesas.forEach(mesa => {
                    const estado = data[mesa.id];
                    if (estado) {
                        mesa.classList.add(estado);
                    }
                });
            }
        } catch (error) {
            console.error("Error al cargar croquis:", error);
        }
    }

    cargarCroquisPorFecha(fechaSeleccionada);

    inputFecha.addEventListener("change", (e) => {
        fechaSeleccionada = e.target.value;
        mesas.forEach(m => m.classList.remove("seleccion-temporal", "pendiente", "confirmada"));
        cargarCroquisPorFecha(fechaSeleccionada);
    });

    mesas.forEach(mesa => {
        mesa.addEventListener("click", () => {
            if (mesa.classList.contains("confirmada") || mesa.classList.contains("pendiente")) {
                alert("Esta mesa ya está reservada o en proceso.");
                return;
            }
            mesa.classList.toggle("seleccion-temporal");
        });
    });

    btnConfirmar.addEventListener("click", () => {
        const seleccionadas = Array.from(document.querySelectorAll(".mesa.seleccion-temporal"));
        
        if (seleccionadas.length === 0) {
            alert("Por favor, selecciona al menos una mesa.");
            return;
        }

        // Extraemos solo el ID de cada mesa seleccionada
        const ids = seleccionadas.map(m => m.id);
        txtMesasElegidas.textContent = ids.join(", ");
        txtFechaElegida.textContent = fechaSeleccionada;

        modal.style.display = "flex";
    });

    btnCerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    formCliente.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const cedula = document.getElementById("cedula").value.trim();
        const telefono = document.getElementById("telefono").value.trim();

        const seleccionadas = Array.from(document.querySelectorAll(".mesa.seleccion-temporal"));
        const ids = seleccionadas.map(m => m.id);

        try {
            const docRef = doc(db, "reservas_fechas", fechaSeleccionada);
            const actualizacion = {};
            const datosCliente = { nombre, apellido, cedula, telefono, mesasReservadas: ids.join(", ") };

            ids.forEach(id => {
                actualizacion[id] = "pendiente";
                actualizacion[`cliente_${id}`] = datosCliente;
            });

            await setDoc(docRef, actualizacion, { merge: true });

            const textoWsp = `NUEVA SOLICITUD DE RESERVA%0A` +
                             `Fecha: ${fechaSeleccionada}%0A` +
                             `Mesa(s): ${ids.join(", ")}%0A` +
                             `Cliente: ${nombre} ${apellido}%0A` +
                             `Cédula: ${cedula}%0A` +
                             `Teléfono: ${telefono}`;

            modal.style.display = "none";
            seleccionadas.forEach(m => {
                m.classList.remove("seleccion-temporal");
                m.classList.add("pendiente");
            });

            window.open(`https://wa.me/584242191088?text=${textoWsp}`, "_blank");
        } catch (error) {
            console.error("Error:", error);
            alert("Error al procesar reserva.");
        }
    });
});
