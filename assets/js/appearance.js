// Inlined in <head> so the right theme applies before first paint.
(function () {
  var root = document.documentElement;
  var stored = null;
  try {
    stored = localStorage.getItem("appearance");
  } catch (e) {}
  var media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");

  function apply(dark) {
    root.classList.toggle("dark", dark);
    var meta = document.querySelector("meta[name=theme-color]");
    if (meta) meta.setAttribute("content", dark ? "#1e293b" : "#ffffff");
  }

  var dark =
    stored === "dark" ||
    (stored === null && root.dataset.defaultAppearance === "dark") ||
    (stored !== "light" && root.dataset.autoAppearance === "true" && media && media.matches);
  apply(dark);

  if (media && root.dataset.autoAppearance === "true") {
    media.addEventListener("change", function (event) {
      apply(event.matches);
    });
  }

  window.addEventListener("DOMContentLoaded", function () {
    apply(root.classList.contains("dark"));
    document.querySelectorAll(".appearance-switcher").forEach(function (button) {
      button.addEventListener("click", function () {
        apply(!root.classList.contains("dark"));
        try {
          localStorage.setItem("appearance", root.classList.contains("dark") ? "dark" : "light");
        } catch (e) {}
      });
      // Right-click resets to the system setting.
      button.addEventListener("contextmenu", function (event) {
        event.preventDefault();
        try {
          localStorage.removeItem("appearance");
        } catch (e) {}
      });
    });
  });
})();
