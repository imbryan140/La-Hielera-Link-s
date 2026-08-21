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

            const textoWsp = `🔔 *NUEVA SOLICITUD DE RESERVA*%0A` +
                             `---------------------------%0A` +
                             `📅 Fecha: ${fechaSeleccionada}%0A` +
                             `📍 Mesa(s): ${ids.join(", ")}%0A` +
                             `👤 Cliente: ${nombre} ${apellido}%0A` +
                             `🆔 Cédula: ${cedula}%0A` +
                             `📞 Teléfono: ${telefono}%0A` +
                             `---------------------------%0A` +
                             `*Por favor, confirmar disponibilidad.*`;

            modal.style.display = "none";
            seleccionadas.forEach(m => {
                m.classList.remove("seleccion-temporal");
                m.classList.add("pendiente");
            });

            const urlWsp = `https://wa.me/584242191088?text=${textoWsp}`;

            // Solución anti-bloqueo para iPhone: Creamos dinámicamente un botón flotante o de alerta clara para ir a WhatsApp
            let contenedorWsp = document.getElementById("alerta-whatsapp-ios");
            if (!contenedorWsp) {
                contenedorWsp = document.createElement("div");
                contenedorWsp.id = "alerta-whatsapp-ios";
                contenedorWsp.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 10000;";
                document.body.appendChild(contenedorWsp);
            }

            contenedorWsp.innerHTML = `
                <div style="background: #1e1e1e; color: #fff; padding: 30px; border-radius: 12px; width: 90%; max-width: 380px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); font-family: sans-serif;">
                    <h3 style="color: #22c55e; margin-top: 0; margin-bottom: 15px;">¡Reserva Registrada!</h3>
                    <p style="font-size: 14px; color: #bbb; margin-bottom: 25px;">Tus mesas han quedado pendientes. Pulsa el botón para enviar los datos por WhatsApp:</p>
                    <a href="${urlWsp}" target="_blank" id="btn-ir-wsp" style="display: block; width: 100%; background: #25D366; color: white; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-sizing: border-box; margin-bottom: 10px;">Enviar a WhatsApp 📲</a>
                    <button onclick="document.getElementById('alerta-whatsapp-ios').style.display='none'; location.reload();" style="background: transparent; border: none; color: #888; cursor: pointer; font-size: 13px; margin-top: 10px;">Cerrar y reiniciar</button>
                </div>
            `;
            contenedorWsp.style.display = "flex";

        } catch (error) {
            console.error("Error:", error);
            alert("Error al procesar reserva.");
        }
    });
});
