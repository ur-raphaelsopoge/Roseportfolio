(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var dot = document.querySelector(".cursor");
  var ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  var targetX = 0;
  var targetY = 0;
  var ringX = 0;
  var ringY = 0;
  var hoverSelector = "a, button, [data-slider], .row";

  document.addEventListener("mousemove", function (event) {
    document.body.classList.add("has-cursor");
    targetX = event.clientX;
    targetY = event.clientY;
    dot.style.transform = "translate3d(" + targetX + "px," + targetY + "px,0)";
  });

  document.addEventListener("mouseover", function (event) {
    ring.classList.toggle("is-hover", Boolean(event.target.closest(hoverSelector)));
  });

  document.addEventListener("mouseleave", function () {
    ring.style.opacity = 0;
    dot.style.opacity = 0;
  });

  document.addEventListener("mouseenter", function () {
    ring.style.opacity = "";
    dot.style.opacity = "";
  });

  function follow() {
    ringX += (targetX - ringX) * 0.16;
    ringY += (targetY - ringY) * 0.16;
    ring.style.transform = "translate3d(" + ringX + "px," + ringY + "px,0)";
    requestAnimationFrame(follow);
  }

  follow();
})();
