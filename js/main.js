(function () {
  "use strict";

  var root = document.documentElement;
  var body = document.body;

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");

  function setMenu(open) {
    body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;
    body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && menu) {
    setMenu(false);
    toggle.addEventListener("click", function () {
      setMenu(!body.classList.contains("nav-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("nav-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 768px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  var MODES = ["system", "light", "dark"];
  var ICONS = { system: "ph-circle-half", light: "ph-sun-dim", dark: "ph-moon" };

  function readMode() {
    try { return localStorage.getItem("theme") || "system"; } catch (e) { return "system"; }
  }
  function applyMode(mode) {
    if (mode === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
    try {
      if (mode === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", mode);
    } catch (e) {}
    var dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      if (mode === "system") meta.content = meta.media.indexOf("dark") > -1 ? "#101215" : "#e7e9ec";
      else meta.content = dark ? "#101215" : "#e7e9ec";
    });
    document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
      var icon = btn.querySelector(".ph");
      var label = btn.querySelector(".theme-label");
      if (icon) icon.className = "ph " + ICONS[mode];
      if (label) label.textContent = mode;
      btn.setAttribute("aria-label", "Theme: " + mode + ". Switch theme");
    });
  }

  applyMode(readMode());
  document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = MODES[(MODES.indexOf(readMode()) + 1) % MODES.length];
      applyMode(next);
    });
  });

  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  }

  var heroName = document.querySelector(".hero-name");
  var heroArt = document.querySelector(".hero-art");
  var heroImg = heroArt && heroArt.querySelector("img");
  if (heroName && heroImg) {
    heroName.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = heroImg.getBoundingClientRect();
      heroArt.style.setProperty("--reveal-x", (e.clientX - r.left) + "px");
      heroArt.style.setProperty("--reveal-y", (e.clientY - r.top) + "px");
      heroArt.classList.add("is-revealing");
    });
    heroName.addEventListener("pointerleave", function () {
      heroArt.classList.remove("is-revealing");
    });
  }
})();
