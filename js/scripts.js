// Variables generales

/* Variables para tema, icono y texto */
const toggleTheme = document.getElementById("toggle-theme");
const toggleIcon = document.getElementById("toggle-icon");
const toggleText = document.getElementById("toggle-text");

/* Variable para los colores */
const toggleColor = document.getElementById("toggle-colors");

// Variable de todos los estilos del CSS (Styles)
const rootStyles = document.documentElement.style;

/* Variables para controlar los idiomas (click en el icono del idioma) */
const flagsElement = document.getElementById("flags");

/* ============================
   Multi-idioma (ES / EN)
   ============================ */

// Variable para cambiar de idioma (carga dinámica de módulos .js dentro de /languages)
const changeLanguage = async (language) => {
    try {
        // Carga dinámica del diccionario, p. ej. ./languages/es.js o ./languages/en.js
        const langModule = await import(`./languages/${language}.js`);
        const texts = langModule.default || langModule.texts || langModule;

        // Aplica los textos a todos los nodos con data-i18n="clave"
        applyTranslations(texts);

        // Recuerda el idioma elegido
        localStorage.setItem("lang", language);
    } catch (err) {
        console.error("Error cargando idioma:", language, err);
    }
};

// Aplica el diccionario recibido a los elementos marcados con data-i18n
const applyTranslations = (texts) => {
    // Recorre todas las claves del diccionario
    Object.keys(texts).forEach((key) => {
        // Soporta múltiples nodos con la misma clave
        const nodes = document.querySelectorAll(`[data-i18n="${key}"]`);
        nodes.forEach((node) => {
            // Si quieres permitir HTML (riesgo XSS si el texto no es de confianza), usar innerHTML
            // Aquí usamos textContent para seguridad y simplicidad.
            node.textContent = texts[key];
        });
    });
};

// Método para cambiar de idioma (clic en banderas)
flagsElement.addEventListener("click", (e) => {
    // Busca el elemento más cercano con data-language (puede ser el <img> o su contenedor)
    const targetFlag = e.target.closest("[data-language]");
    if (!targetFlag) return;

    const lang = targetFlag.dataset.language;
    if (!lang) return;

    changeLanguage(lang);
});

// Idioma por defecto al cargar: el que esté guardado, o el del <html lang="">, o 'es'
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("lang") || document.documentElement.lang || "es";
    changeLanguage(saved);
});


/* ============================
   Tema oscuro / claro
   ============================ */

// Método para cambiar entre el modo noche y el modo día
toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    /* 
      Si estás en modo noche pasas al modo día y viceversa,
      cambia el icono y el texto 
    */
    if (toggleIcon.src.includes("moon.svg")) {
        toggleIcon.src = "assets/icons/sun.svg";
        toggleText.textContent = "Light mode";
    } else {
        toggleIcon.src = "assets/icons/moon.svg";
        toggleText.textContent = "Dark mode";
    }
}); // end


/* ============================
   Color primario (paleta)
   ============================ */

// Método para cambiar los colores de las letras (primary color)
toggleColor.addEventListener("click", (e) => {
    // Solo actúa si se hace click en un elemento con data-color
    const colorItem = e.target.closest("[data-color]");
    if (!colorItem) return;

    rootStyles.setProperty("--primary-color", colorItem.dataset.color);
});

