(function () {
  var rail = document.querySelector("[data-rail]");
  if (!rail) return;

  var note = rail.querySelector("[data-note]");
  var buttons = rail.querySelectorAll("[data-hop]");
  if (!note || !buttons.length) return;

  var fallback = note.getAttribute("data-default") || note.textContent;

  function show(button) {
    note.textContent = button.getAttribute("data-hop");
    buttons.forEach(function (item) {
      item.setAttribute("aria-pressed", item === button ? "true" : "false");
    });
  }

  function reset() {
    note.textContent = fallback;
    buttons.forEach(function (item) {
      item.setAttribute("aria-pressed", "false");
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener("mouseenter", function () {
      show(button);
    });
    button.addEventListener("focus", function () {
      show(button);
    });
    button.addEventListener("click", function () {
      show(button);
    });
  });

  rail.addEventListener("mouseleave", function () {
    if (!rail.contains(document.activeElement)) reset();
  });

  rail.addEventListener("focusout", function (event) {
    if (!rail.contains(event.relatedTarget)) reset();
  });
})();

(function () {
  function openFold(id) {
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var details = el.querySelector("details");
    if (details) details.open = true;
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href^='#']");
    if (!link) return;
    openFold(link.getAttribute("href").slice(1));
  });

  window.addEventListener("hashchange", function () {
    openFold(location.hash.slice(1));
  });

  openFold(location.hash.slice(1));
})();
