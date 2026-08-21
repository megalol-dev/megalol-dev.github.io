/* ============================
   REFERENCIAS GENERALES
============================ */

const body = document.body;
const rootStyles = document.documentElement.style;
const toggleTheme = document.getElementById("toggle-theme");
const toggleIcon = document.getElementById("toggle-icon");
const toggleText = document.getElementById("toggle-text");
const toggleColor = document.getElementById("toggle-colors");
const flagsElement = document.getElementById("flags");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");
const settings = document.querySelector(".settings");
const backToTop = document.getElementById("back-to-top");

window.CURRENT_LANG = localStorage.getItem("lang") || document.documentElement.lang || "es";
window.I18N_TEXTS = {};

/* ============================
   IDIOMA
============================ */

const applyTranslations = (texts) => {
    Object.entries(texts).forEach(([key, value]) => {
        document.querySelectorAll(`[data-i18n="${key}"]`).forEach((node) => {
            node.innerHTML = value;
        });
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
        const key = node.dataset.i18nAriaLabel;
        if (texts[key]) node.setAttribute("aria-label", texts[key]);
    });
};

const updateNavToggleLabel = () => {
    const isOpen = navLinks.classList.contains("is-open");
    const key = isOpen ? "aria_nav_close" : "aria_nav_open";
    navToggle.setAttribute("aria-label", window.I18N_TEXTS[key] || (isOpen ? "Close menu" : "Open menu"));
    navToggle.dataset.i18nAriaLabel = key;
};

const updateThemeControl = () => {
    const isDark = body.classList.contains("dark");
    const textKey = isDark ? "theme_light" : "theme_dark";

    toggleIcon.src = isDark ? "assets/icons/sun.svg" : "assets/icons/moon.svg";
    toggleText.textContent = window.I18N_TEXTS[textKey] ||
        (isDark ? "Light mode" : "Dark mode");
};

const changeLanguage = async (language) => {
    try {
        const langModule = await import(`./languages/${language}.js`);
        const texts = langModule.default || langModule.texts || langModule;

        window.CURRENT_LANG = language;
        window.I18N_TEXTS = texts;
        applyTranslations(texts);
        updateThemeControl();
        updateNavToggleLabel();

        document.documentElement.lang = language;
        localStorage.setItem("lang", language);

        document.querySelectorAll("[data-language]").forEach((flag) => {
            flag.classList.toggle("is-active", flag.dataset.language === language);
        });

    } catch (error) {
        console.error("Error cargando idioma:", language, error);
    }
};

flagsElement.addEventListener("click", (event) => {
    const flag = event.target.closest("[data-language]");
    if (flag?.dataset.language) changeLanguage(flag.dataset.language);
});

/* ============================
   TEMA Y COLOR PRINCIPAL
============================ */

const savedTheme = localStorage.getItem("theme");
if (savedTheme) body.classList.toggle("dark", savedTheme === "dark");

const savedColor = localStorage.getItem("primary-color");
if (savedColor) rootStyles.setProperty("--primary-color", savedColor);

toggleTheme.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
    updateThemeControl();
});

toggleColor.addEventListener("click", (event) => {
    const colorItem = event.target.closest("[data-color]");
    if (!colorItem) return;

    rootStyles.setProperty("--primary-color", colorItem.dataset.color);
    localStorage.setItem("primary-color", colorItem.dataset.color);
});

/* ============================
   NAVEGACION RESPONSIVE
============================ */

const closeMobileMenu = () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.querySelector("i").className = "fas fa-bars";
    updateNavToggleLabel();
};

navToggle.addEventListener("click", () => {
    const willOpen = !navLinks.classList.contains("is-open");
    navLinks.classList.toggle("is-open", willOpen);
    navToggle.setAttribute("aria-expanded", String(willOpen));
    navToggle.querySelector("i").className = willOpen ? "fas fa-times" : "fas fa-bars";
    updateNavToggleLabel();
});

navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMobileMenu();
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-nav") && navLinks.classList.contains("is-open")) {
        closeMobileMenu();
    }

    if (settings.open && !event.target.closest(".settings")) {
        settings.removeAttribute("open");
    }
});

/* Seccion activa en la navegacion */
const navSectionTargets = ["inicio", "destacado", "proyectos", "videojuegos", "tecnologias"];
const navSections = navSectionTargets
    .map((id) => document.getElementById(id))
    .filter(Boolean);

const updateActiveNav = (sectionId) => {
    const targetId = sectionId === "destacado" ? "proyectos" : sectionId;
    document.querySelectorAll(".nav-link[href^='#']").forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${targetId}`);
    });
};

const sectionObserver = new IntersectionObserver((entries) => {
    const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries[0]) updateActiveNav(visibleEntries[0].target.id);
}, {
    rootMargin: "-25% 0px -60% 0px",
    threshold: [0, .15, .35],
});

navSections.forEach((section) => sectionObserver.observe(section));

/* ============================
   ANIMACIONES AL HACER SCROLL
============================ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = document.querySelectorAll(".reveal");

if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: .12, rootMargin: "0px 0px -40px" });

    revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
        revealObserver.observe(element);
    });
}

/* ============================
   UTILIDADES DE PAGINA
============================ */

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 650);
}, { passive: true });

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
});

document.getElementById("current-year").textContent = new Date().getFullYear();

window.addEventListener("DOMContentLoaded", () => {
    updateThemeControl();
    changeLanguage(window.CURRENT_LANG);
});
