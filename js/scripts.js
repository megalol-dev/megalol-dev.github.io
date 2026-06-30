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
   Estado global de idioma
   ============================ */

window.CURRENT_LANG = localStorage.getItem("lang") || document.documentElement.lang || "es";
window.I18N_TEXTS = {};

/* ============================
   Multi-idioma (ES / EN)
   ============================ */

const changeLanguage = async (language) => {
    try {
        const langModule = await import(`./languages/${language}.js`);
        const texts = langModule.default || langModule.texts || langModule;

        window.CURRENT_LANG = language;
        window.I18N_TEXTS = texts;

        applyTranslations(texts);
        localStorage.setItem("lang", language);
        document.documentElement.lang = language;
    } catch (err) {
        console.error("Error cargando idioma:", language, err);
    }
};

// Aplica el diccionario recibido a los elementos marcados con data-i18n
const applyTranslations = (texts) => {
    Object.keys(texts).forEach((key) => {
        const nodes = document.querySelectorAll(`[data-i18n="${key}"]`);
        nodes.forEach((node) => {
            node.innerHTML = texts[key];
        });
    });
};

// Método para cambiar de idioma (clic en banderas)
flagsElement.addEventListener("click", (e) => {
    const targetFlag = e.target.closest("[data-language]");
    if (!targetFlag) return;

    const lang = targetFlag.dataset.language;
    if (!lang) return;

    changeLanguage(lang);
});

// Idioma por defecto al cargar
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("lang") || document.documentElement.lang || "es";
    changeLanguage(saved);
});

/* ============================
   Tema oscuro / claro
   ============================ */

toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (toggleIcon.src.includes("moon.svg")) {
        toggleIcon.src = "assets/icons/sun.svg";
        toggleText.textContent =
            window.I18N_TEXTS?.theme_light || "Light mode";
    } else {
        toggleIcon.src = "assets/icons/moon.svg";
        toggleText.textContent =
            window.I18N_TEXTS?.theme_dark || "Dark mode";
    }
});

/* ============================
   Color primario (paleta)
   ============================ */

toggleColor.addEventListener("click", (e) => {
    const colorItem = e.target.closest("[data-color]");
    if (!colorItem) return;

    rootStyles.setProperty("--primary-color", colorItem.dataset.color);
});

/* ============================
   Proyecto privado
   ============================ */

function showPrivateProjectMessage() {
    const modal = document.getElementById("private-modal");
    modal.classList.remove("hidden");
}

function closePrivateModal() {
    const modal = document.getElementById("private-modal");
    modal.classList.add("hidden");
}
