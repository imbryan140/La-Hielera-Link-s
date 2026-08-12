document.addEventListener("DOMContentLoaded", () => {
    // Selecciona absolutamente todas las mesas del croquis
    const mesas = document.querySelectorAll(".plano-hielera .mesa:not(.vacio)");

    mesas.forEach(mesa => {
        mesa.addEventListener("click", () => {
            // Ejemplo de lógica de interacción: alternar clase o enviar estado
            // Aquí puedes integrar tu lógica actual de guardado en base de datos o LocalStorage
            
            console.log(`Mesa clickeada: ${mesa.id}`);
            
            // Ejemplo básico de cambio de estado visual local al hacer clic:
            if (mesa.classList.contains("pendiente")) {
                mesa.classList.remove("pendiente");
                mesa.classList.add("confirmada");
            } else if (mesa.classList.contains("confirmada")) {
                mesa.classList.remove("confirmada");
            } else {
                mesa.classList.add("pendiente");
            }
        });
    });
});
