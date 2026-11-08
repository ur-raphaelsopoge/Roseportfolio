(function () {
  "use strict";

  const doc = document;
  const body = doc.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = doc.getElementById("primary-nav");
  const toggle = doc.querySelector(".nav-toggle");
  const layers = {
    contact: doc.getElementById("contact-panel"),
    resume: doc.getElementById("resume-modal")
  };
  const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let activeLayer = null;
  let lastFocus = null;

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  function openLayer(layer) {
    if (!layer) {
      return;
    }
    lastFocus = doc.activeElement;
    activeLayer = layer;
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
    body.classList.add("no-scroll");
    const target = layer.querySelector("[data-autofocus]");
    if (target) {
      target.focus({ preventScroll: true });
    }
  }

  function closeLayer() {
    if (!activeLayer) {
      return;
    }
    activeLayer.classList.remove("is-open");
    activeLayer.setAttribute("aria-hidden", "true");
    body.classList.remove("no-scroll");
    activeLayer = null;
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus({ preventScroll: true });
    }
  }

  function trapFocus(event) {
    const items = Array.from(activeLayer.querySelectorAll(focusableSelector));
    if (!items.length) {
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function typeHeadline() {
    const typed = doc.getElementById("typed");
    if (!typed) {
      return;
    }
    const text = typed.dataset.text || typed.textContent;
    if (reduceMotion) {
      typed.textContent = text;
      return;
    }
    typed.textContent = "";
    let index = 0;
    function step() {
      index += 1;
      typed.textContent = text.slice(0, index);
      if (index < text.length) {
        window.setTimeout(step, 50 + Math.random() * 45);
      }
    }
    window.setTimeout(step, 700);
  }

  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      setNav(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) {
      setNav(false);
    }
  });

  doc.addEventListener("click", function (event) {
    const opener = event.target.closest("[data-open]");
    if (opener) {
      event.preventDefault();
      setNav(false);
      openLayer(layers[opener.dataset.open]);
      return;
    }
    if (event.target.closest("[data-close]")) {
      closeLayer();
    }
  });

  doc.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (activeLayer) {
        closeLayer();
      } else {
        setNav(false);
      }
      return;
    }
    if (event.key === "Tab" && activeLayer) {
      trapFocus(event);
    }
  });

  doc.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = new Date().getFullYear();
  });

  typeHeadline();
})();
