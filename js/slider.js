(function () {
  var track = document.querySelector("[data-slider]");
  if (!track) return;

  var prev = document.querySelector("[data-prev]");
  var next = document.querySelector("[data-next]");
  var bar = document.querySelector("[data-progress]");
  var dragging = false;
  var startX = 0;
  var startScroll = 0;

  function step() {
    var slide = track.querySelector(".slide");
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slide.offsetWidth + gap;
  }

  function update() {
    var max = track.scrollWidth - track.clientWidth;
    var progress = max > 0 ? track.scrollLeft / max : 0;
    bar.style.transform = "scaleX(" + (0.15 + 0.85 * progress) + ")";
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  }

  function stop() {
    dragging = false;
    track.classList.remove("is-dragging");
  }

  track.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "touch") return;
    dragging = true;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    track.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
  });

  track.addEventListener("pointermove", function (event) {
    if (!dragging) return;
    track.scrollLeft = startScroll - (event.clientX - startX);
  });

  track.addEventListener("pointerup", stop);
  track.addEventListener("pointercancel", stop);
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  track.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") track.scrollBy({ left: step() });
    if (event.key === "ArrowLeft") track.scrollBy({ left: -step() });
  });

  prev.addEventListener("click", function () { track.scrollBy({ left: -step() }); });
  next.addEventListener("click", function () { track.scrollBy({ left: step() }); });

  update();
})();
