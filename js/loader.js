(function () {
  var loader = document.getElementById("loader");
  if (!loader) return;

  var bar = loader.querySelector(".loader__bar");
  var count = loader.querySelector(".loader__count");
  var duration = 1900;
  var start = performance.now();

  function finish() {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    loader.classList.add("is-done");
    setTimeout(function () { loader.remove(); }, 1200);
  }

  function tick(now) {
    var progress = Math.min(1, (now - start) / duration);
    var eased = 1 - Math.pow(1 - progress, 2);
    bar.style.transform = "scaleX(" + eased + ")";
    count.textContent = String(Math.round(eased * 100)).padStart(3, "0");
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      finish();
    }
  }

  requestAnimationFrame(tick);
})();
