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

// Site search: loads the language's index.json on first use and ranks pages by simple substring matches.
document.addEventListener("DOMContentLoaded", function () {
  var wrapper = document.getElementById("search-wrapper");
  var input = document.getElementById("search-query");
  var results = document.getElementById("search-results");
  if (!wrapper || !input || !results) return;

  var index = null;
  var visible = false;

  function load() {
    if (index) return Promise.resolve(index);
    return fetch(wrapper.dataset.index)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        index = data.map(function (item) {
          return {
            item: item,
            title: normalize(item.title),
            summary: normalize(item.summary),
            content: normalize(item.content),
          };
        });
        return index;
      });
  }

  // Lowercase and strip accents so "codigo" matches "código".
  function normalize(text) {
    return (text || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function score(entry, terms) {
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      var s = 0;
      if (entry.title.indexOf(term) !== -1) s += 10;
      if (entry.summary.indexOf(term) !== -1) s += 4;
      if (entry.content.indexOf(term) !== -1) s += 1;
      if (s === 0) return 0; // every term must match somewhere
      total += s;
    }
    return total;
  }

  function search(query) {
    var terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) {
      results.innerHTML = "";
      return;
    }
    load().then(function (entries) {
      var matches = entries
        .map(function (entry) {
          return { entry: entry, score: score(entry, terms) };
        })
        .filter(function (m) {
          return m.score > 0;
        })
        .sort(function (a, b) {
          return b.score - a.score;
        })
        .slice(0, 10);
      if (!matches.length) {
        results.innerHTML = '<li class="no-results">' + escapeHtml(results.dataset.empty) + "</li>";
        return;
      }
      results.innerHTML = matches
        .map(function (m) {
          var item = m.entry.item;
          return (
            '<li><a href="' +
            escapeHtml(item.permalink) +
            '"><div class="result-title">' +
            escapeHtml(item.title) +
            "</div>" +
            (item.section ? '<div class="result-section">' + escapeHtml(item.section) + "</div>" : "") +
            (item.summary ? '<div class="result-summary">' + escapeHtml(item.summary) + "</div>" : "") +
            '</a><span class="result-arrow">→</span></li>'
          );
        })
        .join("");
    });
  }

  function open() {
    if (visible) return;
    visible = true;
    wrapper.hidden = false;
    document.body.style.overflow = "hidden";
    input.focus();
    load();
  }

  function close() {
    if (!visible) return;
    visible = false;
    wrapper.hidden = true;
    document.body.style.overflow = "";
    input.blur();
  }

  document.querySelectorAll(".search-button").forEach(function (button) {
    button.addEventListener("click", open);
  });
  document.getElementById("close-search-button").addEventListener("click", close);
  wrapper.addEventListener("click", function (event) {
    if (event.target === wrapper) close();
  });
  input.addEventListener("input", function () {
    search(input.value);
  });
  wrapper.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    var first = results.querySelector("a");
    if (first) first.click();
  });

  document.addEventListener("keydown", function (event) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (event.key === "/" && !visible && !typing) {
      event.preventDefault();
      open();
    } else if (event.key === "Escape") {
      close();
    } else if (visible && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      var links = Array.prototype.slice.call(results.querySelectorAll("a"));
      if (!links.length) return;
      event.preventDefault();
      var i = links.indexOf(document.activeElement);
      var next = event.key === "ArrowDown" ? Math.min(i + 1, links.length - 1) : i - 1;
      (next < 0 ? input : links[next]).focus();
    }
  });
});

// "Copy" buttons on code blocks.
document.addEventListener("DOMContentLoaded", function () {
  var script = document.getElementById("site-script");
  var copyText = (script && script.dataset.copy) || "Copy";
  var copiedText = (script && script.dataset.copied) || "Copied";

  document.querySelectorAll(".highlight").forEach(function (block) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = copyText;
    button.addEventListener("click", function () {
      var code = block.querySelector("pre code").innerText;
      navigator.clipboard.writeText(code).then(function () {
        button.textContent = copiedText;
        setTimeout(function () {
          button.textContent = copyText;
        }, 2000);
      });
    });
    block.insertBefore(button, block.firstChild);
  });
});

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
