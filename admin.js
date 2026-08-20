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
    const mesas = document.querySelectorAll(".plano-hielera .mesa:not(.vacio)");
    const docRef = doc(db, "croquis", "la-hielera");

    // Sincronizar estados en tiempo real
    onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            mesas.forEach(mesa => {
                const estado = data[mesa.id];
                mesa.classList.remove("pendiente", "confirmada");
                if (estado) {
                    mesa.classList.add(estado);
                }
            });
        }
    });

    // Lógica del Administrador al hacer clic en las mesas
    mesas.forEach(mesa => {
        mesa.addEventListener("click", async () => {
            let nuevoEstado = "";

            // Ciclo de control del Admin: Libre (blanco) -> Pendiente (amarillo) -> Ocupada/Pagada (rojo) -> Libre
            if (mesa.classList.contains("libre") || (!mesa.classList.contains("pendiente") && !mesa.classList.contains("confirmada"))) {
                nuevoEstado = "pendiente"; // Amarillo
            } else if (mesa.classList.contains("pendiente")) {
                nuevoEstado = "confirmada"; // Rojo (Pagado)
            } else {
                nuevoEstado = ""; // Vuelve a quedar Libre (Blanco)
            }

            // Actualización visual inmediata
            mesa.classList.remove("pendiente", "confirmada");
            if (nuevoEstado) {
                mesa.classList.add(nuevoEstado);
            }

            try {
                // Guardar cambios en Firebase
                await setDoc(docRef, {
                    [mesa.id]: nuevoEstado
                }, { merge: true });
                console.log(`Admin actualizó ${mesa.id} a: ${nuevoEstado || 'libre'}`);
            } catch (error) {
                console.error("Error al actualizar desde el panel admin:", error);
            }
        });
    });
});
