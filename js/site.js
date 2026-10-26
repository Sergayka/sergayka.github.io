(function () {
  var rail = document.querySelector("[data-rail]");
  if (!rail) return;

  var note = rail.querySelector("[data-note]");
  var run = rail.querySelector(".path-run");
  var hops = rail.querySelector(".hops");
  var net = rail.querySelector(".net");
  var idle = net && net.querySelector(".idle");
  var live = net && net.querySelector(".live");
  var packet = rail.querySelector(".packet");
  var buttons = Array.prototype.slice.call(rail.querySelectorAll("[data-hop]"));
  if (!note || !run || !hops || !net || !idle || !live || !packet || !buttons.length) return;

  var cursor = 0;
  var pinned = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var lift = [64, 26, 50, 14, 82, 38];
  var svgNs = "http://www.w3.org/2000/svg";
  var jointLayer = document.createElementNS(svgNs, "g");
  var jointSpec = [
    { a: 0, b: 1, t: 0.58, y: 106, r: 4.5 }
  ];
  var extra = [
    [0, 6], [6, 4],
    [1, 5]
  ];
  var jointDots = jointSpec.map(function (spec) {
    var dot = document.createElementNS(svgNs, "circle");
    dot.setAttribute("class", "joint");
    dot.setAttribute("r", String(spec.r));
    jointLayer.appendChild(dot);
    return dot;
  });
  jointLayer.setAttribute("class", "joints");
  net.appendChild(jointLayer);
  buttons.forEach(function (button, n) {
    button.style.setProperty("--lift", lift[n] + "px");
  });

  function nodes() {
    return buttons.map(function (button) {
      var top = parseFloat(getComputedStyle(button, "::before").top);
      return {
        x: hops.offsetLeft + button.offsetLeft + button.offsetWidth / 2,
        y: hops.offsetTop + top + 8
      };
    });
  }

  function seg(a, b) {
    return "M" + a.x + " " + a.y + "L" + b.x + " " + b.y;
  }

  function draw(i) {
    var stations = nodes();
    var points = stations.slice();
    var mesh = [];
    var walked = [];
    var n;
    net.setAttribute("width", hops.offsetWidth);
    net.setAttribute("height", hops.offsetHeight);
    net.style.width = hops.offsetWidth + "px";
    net.style.height = hops.offsetHeight + "px";
    jointSpec.forEach(function (spec, index) {
      var from = stations[spec.a];
      var to = stations[spec.b];
      var point = {
        x: from.x + (to.x - from.x) * spec.t,
        y: hops.offsetTop + spec.y
      };
      points.push(point);
      jointDots[index].setAttribute("cx", point.x);
      jointDots[index].setAttribute("cy", point.y);
    });
    for (n = 1; n < stations.length; n += 1) mesh.push(seg(stations[n - 1], stations[n]));
    extra.forEach(function (edge) { mesh.push(seg(points[edge[0]], points[edge[1]])); });
    for (n = 1; n <= i; n += 1) walked.push(seg(stations[n - 1], stations[n]));
    idle.setAttribute("d", mesh.join(""));
    live.setAttribute("d", walked.join(""));
    packet.style.left = stations[i].x + "px";
    packet.style.top = stations[i].y + "px";
  }

  function place(i) {
    buttons.forEach(function (item, n) {
      item.classList.toggle("is-on", n === i);
      item.classList.toggle("is-done", n < i);
    });
    note.textContent = buttons[i].getAttribute("data-hop");
    draw(i);
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
