import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Credenciales de tu proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCZ196SwJndBenHpiIEQXEj4a1ifi2rp8U",
    authDomain: "la-hielera---page.firebaseapp.com",
    projectId: "la-hielera---page",
    storageBucket: "la-hielera---page.firebasestorage.app",
    messagingSenderId: "119922260303",
    appId: "1:119922260303:web:7942468008c2b85c9aad3a",
    measurementId: "G-MEGS9VRG5R"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    // Selecciona absolutamente todas las mesas del croquis
    const mesas = document.querySelectorAll(".plano-hielera .mesa:not(.vacio)");
    const docRef = doc(db, "croquis", "la-hielera");

    // 1. Sincronizar en tiempo real los cambios desde la base de datos
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

    // 2. Manejar clics, ciclo visual y guardado en Firebase
    mesas.forEach(mesa => {
        mesa.addEventListener("click", async () => {
            console.log(`Mesa clickeada: ${mesa.id}`);
            
            let nuevoEstado = "";

            // Ciclo de estados: pendiente -> confirmada -> libre
            if (mesa.classList.contains("pendiente")) {
                nuevoEstado = "confirmada";
            } else if (mesa.classList.contains("confirmada")) {
                nuevoEstado = ""; // Libre
            } else {
                nuevoEstado = "pendiente";
            }

            // Cambio visual inmediato en pantalla
            mesa.classList.remove("pendiente", "confirmada");
            if (nuevoEstado) {
                mesa.classList.add(nuevoEstado);
            }

            try {
                // Guardar el estado actualizado en Firebase
                await setDoc(docRef, {
                    [mesa.id]: nuevoEstado
                }, { merge: true });
            } catch (error) {
                console.error("Error al guardar en Firebase:", error);
            }
        });
    });
});
