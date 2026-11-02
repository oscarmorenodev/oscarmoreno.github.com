// Cookie banner. Google Analytics only loads after the visitor approves it.
document.addEventListener("DOMContentLoaded", function () {
  var COOKIE = "cookie-notice-option";
  var notice = document.getElementById("cookie-notice");
  var script = document.getElementById("site-script");
  var gaId = script && script.dataset.ga;

  function readCookie(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? match[1] : null;
  }

  function createCookie(name, value, days) {
    var date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/; SameSite=Lax";
  }

  function loadAnalytics() {
    if (!gaId || location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + gaId;
    document.head.appendChild(tag);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
  }

  var choice = readCookie(COOKIE);
  if (choice === "true") {
    loadAnalytics();
  } else if (choice !== "false" && notice) {
    notice.hidden = false;
  }

  if (!notice) return;
  document.getElementById("cookie-notice-accept").addEventListener("click", function () {
    createCookie(COOKIE, "true", 31);
    notice.hidden = true;
    loadAnalytics();
  });
  document.getElementById("cookie-notice-deny").addEventListener("click", function () {
    createCookie(COOKIE, "false", 31);
    notice.hidden = true;
  });
});
