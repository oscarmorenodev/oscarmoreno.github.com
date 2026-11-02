// Mobile menu toggle and the scroll-to-top button.
document.addEventListener("DOMContentLoaded", function () {
  var button = document.querySelector(".menu-button");
  var menu = document.getElementById("main-menu");
  if (button && menu) {
    var setOpen = function (open) {
      menu.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    };
    button.addEventListener("click", function () {
      setOpen(!menu.classList.contains("open"));
    });
    menu.querySelector(".menu-close button").addEventListener("click", function () {
      setOpen(false);
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
  }

  var toTop = document.getElementById("to-top");
  if (toTop) {
    var update = function () {
      toTop.hidden = window.scrollY < window.innerHeight / 2;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
  }
});
