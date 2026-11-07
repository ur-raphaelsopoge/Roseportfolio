(function () {
  var body = document.body;

  var yearTarget = document.querySelector("[data-year]");
  if (yearTarget) yearTarget.textContent = new Date().getFullYear();

  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelectorAll(".nav a");

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  }

  toggle.addEventListener("click", function () {
    setMenu(!body.classList.contains("menu-open"));
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () { setMenu(false); });
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });

  document.querySelectorAll("[data-reveal]").forEach(function (element, index) {
    element.style.transitionDelay = (index % 4) * 80 + "ms";
    revealObserver.observe(element);
  });

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (link) {
        link.setAttribute("aria-current", String(link.getAttribute("href") === "#" + entry.target.id));
      });
    });
  }, { threshold: 0.45 });

  document.querySelectorAll("main section[id]").forEach(function (section) {
    sectionObserver.observe(section);
  });

  var preview = document.querySelector(".preview");
  var previewImage = preview.querySelector("img");
  var activitiesList = document.querySelector(".rows");
  var previewX = 0;
  var previewY = 0;
  var currentX = 0;
  var currentY = 0;

  function movePreview() {
    currentX += (previewX - currentX) * 0.14;
    currentY += (previewY - currentY) * 0.14;
    preview.style.transform = "translate3d(" + currentX + "px," + currentY + "px,0)";
    requestAnimationFrame(movePreview);
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    activitiesList.addEventListener("mousemove", function (event) {
      previewX = event.clientX + 24;
      previewY = event.clientY - preview.offsetHeight / 2;
    });

    activitiesList.querySelectorAll(".row").forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        previewImage.src = row.dataset.preview;
        preview.classList.add("is-active");
      });
      row.addEventListener("mouseleave", function () {
        preview.classList.remove("is-active");
      });
    });

    movePreview();
  }
})();
