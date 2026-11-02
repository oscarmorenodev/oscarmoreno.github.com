// Site-wide configuration: base URL, author, menu, and the one supported navigation language.
//
// The site is English-only in its navigation and chrome. Spanish content under content/es still
// exists and still gets URLs (see build.js): pages that have an English translation redirect to it,
// and Spanish-only content (the podcast, one untranslated post) is still rendered and reachable —
// just without a language switcher or its own menu, using this English shell.

export const site = {
  baseURL: "https://oscarmoreno.com",
  googleAnalytics: "G-R502FEV9RG",
  pageSize: 10,
  defaultAppearance: "light",
  autoSwitchAppearance: true,
  author: {
    name: "Oscar Moreno",
    image: "/img/memoji-2-no-bg.png",
    links: [
      { icon: "x-twitter", label: "X-Twitter", url: "https://twitter.com/oscarmorenodev" },
      { icon: "linkedin", label: "Linkedin", url: "https://linkedin.com/in/oscarmorenodev" },
    ],
  },
};

export const languages = {
  en: {
    code: "en",
    name: "English",
    prefix: "",
    title: "Oscar Moreno | Software Engineer",
    description: "Software Engineer",
    copyright: "© 2024 Oscar Moreno",
    headline: "Coding and writing about Software Engineering",
    privacyPage: "/privacy/",
    menu: [
      { name: "Blog", url: "/blog/" },
      { name: "About", url: "/about/" },
      { name: "Contact", url: "/contact/" },
      { name: "Apps", url: "/apps/" },
    ],
  },
};

export const defaultLanguage = "en";
