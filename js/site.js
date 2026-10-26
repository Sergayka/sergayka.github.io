(function () {
  var rail = document.querySelector("[data-rail]");
  if (!rail) return;

  var note = rail.querySelector("[data-note]");
  var track = rail.querySelector(".track");
  var buttons = Array.prototype.slice.call(rail.querySelectorAll("[data-hop]"));
  if (!note || !track || !buttons.length) return;

  var cursor = 0;
  var pinned = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function place(i) {
    var button = buttons[i];
    var trackBox = track.getBoundingClientRect();
    var box = button.getBoundingClientRect();
    var x = box.left + box.width / 2 - trackBox.left;
    track.style.setProperty("--x", x + "px");
    buttons.forEach(function (item, n) {
      item.classList.toggle("is-on", n === i);
      item.classList.toggle("is-done", n < i);
    });
    note.textContent = button.getAttribute("data-hop");
  }

  function currentIndex() {
    for (var n = 0; n < buttons.length; n += 1) {
      if (buttons[n].classList.contains("is-on")) return n;
    }
    return 0;
  }

  function tick() {
    if (pinned) return;
    place(cursor);
    cursor = (cursor + 1) % buttons.length;
  }

  function pin(i) {
    pinned = true;
    cursor = i;
    place(i);
    buttons.forEach(function (item, n) {
      item.setAttribute("aria-pressed", n === i ? "true" : "false");
    });
  }

  function release() {
    buttons.forEach(function (item) {
      item.setAttribute("aria-pressed", "false");
    });
    cursor = (currentIndex() + 1) % buttons.length;
    pinned = false;
  }

  buttons.forEach(function (button, i) {
    button.addEventListener("mouseenter", function () { pin(i); });
    button.addEventListener("focus", function () { pin(i); });
    button.addEventListener("click", function () { pin(i); });
  });

  rail.addEventListener("mouseleave", function () {
    if (!rail.contains(document.activeElement)) release();
  });

  rail.addEventListener("focusout", function (event) {
    if (!rail.contains(event.relatedTarget)) release();
  });

  place(0);
  cursor = 1;
  if (!reduce) window.setInterval(tick, 1500);
  window.addEventListener("resize", function () { place(currentIndex()); });
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
