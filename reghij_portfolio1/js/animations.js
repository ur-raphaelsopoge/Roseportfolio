(function () {
  "use strict";

  const doc = document;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = doc.querySelector(".site-header");
  const progress = doc.querySelector(".scroll-progress");
  const hero = doc.querySelector(".hero");
  const heroCopy = doc.querySelector(".hero-copy");
  const links = Array.from(doc.querySelectorAll(".nav-link"));
  const revealItems = Array.from(doc.querySelectorAll("[data-reveal]"));
  const canObserve = "IntersectionObserver" in window;

  let ticking = false;

  function release(element) {
    const delay = parseInt(getComputedStyle(element).getPropertyValue("--d"), 10) || 0;
    window.setTimeout(function () {
      element.removeAttribute("data-reveal");
    }, delay + 1300);
  }

  function setupReveal() {
    if (reduceMotion || !canObserve) {
      revealItems.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            release(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    revealItems.forEach(function (element) {
      observer.observe(element);
    });
  }

  function setupActiveLink() {
    if (!canObserve) {
      return;
    }
    const map = new Map();
    links.forEach(function (link) {
      map.set(link.getAttribute("href").slice(1), link);
    });
    const targets = Array.from(map.keys())
      .concat("home")
      .map(function (id) {
        return doc.getElementById(id);
      })
      .filter(Boolean);
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          links.forEach(function (link) {
            link.removeAttribute("aria-current");
          });
          const match = map.get(entry.target.id);
          if (match) {
            match.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    targets.forEach(function (section) {
      observer.observe(section);
    });
  }

  function update() {
    const y = window.scrollY;
    const max = doc.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle("is-scrolled", y > 12);
    }
    if (progress) {
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }

    if (hero && heroCopy && !reduceMotion) {
      const amount = Math.min(Math.max(y / (hero.offsetHeight * 0.75), 0), 1);
      heroCopy.style.filter = amount > 0.01 ? "blur(" + (amount * 8).toFixed(2) + "px)" : "";
      heroCopy.style.opacity = (1 - amount * 0.7).toFixed(3);
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  setupReveal();
  setupActiveLink();
  update();
})();
