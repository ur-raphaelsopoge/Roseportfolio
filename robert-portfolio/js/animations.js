(function () {
  "use strict";

  const doc = document;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = doc.querySelector(".site-header");
  const progressBar = doc.querySelector(".scroll-progress");
  const revealItems = Array.from(doc.querySelectorAll("[data-reveal]"));

  let ticking = false;

  function handleScroll() {
    const scrollY = window.scrollY;
    const maxScroll = doc.documentElement.scrollHeight - window.innerHeight;

    if (progressBar && maxScroll > 0) {
      const progress = Math.min(scrollY / maxScroll, 1);
      progressBar.style.transform = `scaleX(${progress})`;
    }

    if (header) {
      header.classList.toggle("is-scrolled", scrollY > 20);
    }

    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }

  function setupObserver() {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(el => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, observerInstance) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealItems.forEach(el => observer.observe(el));
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);

  setupObserver();
  handleScroll();
})();
