(function () {
  "use strict";

  const doc = document;
  const body = doc.body;
  const navToggle = doc.querySelector(".nav-toggle");
  const navMenu = doc.getElementById("primary-nav");
  const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  let lastActiveElement = null;

  function toggleNav() {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    navMenu.classList.toggle("is-open", !expanded);
  }

  function openModal(panel) {
    if (!panel) return;
    lastActiveElement = doc.activeElement;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    body.style.overflow = "hidden";
    const focusable = panel.querySelector(focusableSelectors);
    if (focusable) focusable.focus();
  }

  function closeModal(panel) {
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    body.style.overflow = "";
    if (lastActiveElement) lastActiveElement.focus();
  }

  navToggle.addEventListener("click", toggleNav);

  navMenu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      navToggle.setAttribute("aria-expanded", "false");
      navMenu.classList.remove("is-open");
    }
  });

  doc.addEventListener("click", function (e) {
    const openTrigger = e.target.closest("[data-open]");
    if (openTrigger) {
      e.preventDefault();
      const modalId = openTrigger.getAttribute("data-open") + "-panel";
      openModal(doc.getElementById(modalId));
      return;
    }

    const closeTrigger = e.target.closest("[data-close]");
    if (closeTrigger) {
      e.preventDefault();
      const modal = closeTrigger.closest(".modal-panel");
      closeModal(modal);
    }
  });

  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const openModalPanel = doc.querySelector(".modal-panel.is-open");
      if (openModalPanel) {
        closeModal(openModalPanel);
      } else if (navMenu.classList.contains("is-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      }
    }
  });

  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
