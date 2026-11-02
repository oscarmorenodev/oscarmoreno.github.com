// UI strings used by the templates, in English and Spanish.

const strings = {
  en: {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    tableOfContents: "Table of Contents",
    author: "Author",
    anchor: "Anchor",
    copy: "Copy",
    copied: "Copied",
    notFoundTitle: "Page Not Found 😕",
    notFoundError: "Error 404",
    notFoundDescription: "It seems that the page you've requested does not exist.",
    darkAppearance: "Switch to dark appearance",
    lightAppearance: "Switch to light appearance",
    externalLink: "Link to external site",
    noArticles: "There's no articles to list here yet.",
    scrollToTop: "Scroll to top",
    skipToMain: "Skip to main content",
    searchOpen: "Search (/)",
    searchClose: "Close (Esc)",
    searchPlaceholder: "Search",
    noResults: "No results",
    attachments: "Attachments",
    prevPage: "Previous page",
    nextPage: "Next page",
    menu: "Menu",
    bio: "Coding and writing about Software Engineering",
    cookieText: "I would like to use third party code to improve the functionality of this website.",
    cookieMore: "More info",
    cookieDeny: "Deny",
    cookieApprove: "Approve",
    redirecting: "Redirecting…",
  },
  es: {
    months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    tableOfContents: "Tabla de contenido",
    author: "Autor",
    anchor: "Ancla",
    copy: "Copiar",
    copied: "Copiado",
    notFoundTitle: "Página no encontrada 😕",
    notFoundError: "Error 404",
    notFoundDescription: "Parece que la página que solicitaste no existe.",
    darkAppearance: "Cambiar a modo oscuro",
    lightAppearance: "Cambiar a modo claro",
    externalLink: "Link a página externa",
    noArticles: "Aún no hay artículos para listar aquí.",
    scrollToTop: "Ir arriba",
    skipToMain: "Ir al contenido",
    searchOpen: "Buscar (/)",
    searchClose: "Cerrar (Esc)",
    searchPlaceholder: "Buscar",
    noResults: "Sin resultados",
    attachments: "Adjuntos",
    prevPage: "Página anterior",
    nextPage: "Página siguiente",
    menu: "Menú",
    bio: "Escribiendo código y hablando sobre ingeniería de software",
    cookieText: "Me gustaría usar código de terceros para mejorar la funcionalidad de esta web.",
    cookieMore: "Más info",
    cookieDeny: "Rechazar",
    cookieApprove: "Aceptar",
    redirecting: "Redirigiendo…",
  },
};

export function t(lang, key) {
  return strings[lang][key];
}

// Formats as "8 October 2024", with localized month names. Takes an ISO date string so the
// calendar day is the one written in the front matter, whatever the build machine's timezone.
export function formatDate(iso, lang) {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return `${day} ${strings[lang].months[month - 1]} ${year}`;
}
