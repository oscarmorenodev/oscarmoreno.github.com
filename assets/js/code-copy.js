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
