/* Petra Wallner — main.js
   Menu, scroll-reveal, click-to-load přehrávače (Spotify/YouTube),
   lightbox galerie, formuláře přes e-mail (mailto). Bez závislostí. */

(function () {
  "use strict";

  /* ---------- mobilní menu ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      document.body.classList.toggle("nav-locked", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-locked");
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- click-to-load embeds (GDPR friendly) ----------
     <div class="embed embed--spotify" data-embed="https://open.spotify.com/embed/..." data-height="352"> */
  document.querySelectorAll(".embed[data-embed]").forEach(function (box) {
    var btn = box.querySelector(".embed__cover");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = box.getAttribute("data-embed");
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      iframe.loading = "lazy";
      iframe.title = btn.getAttribute("aria-label") || "Přehrávač";
      box.innerHTML = "";
      box.appendChild(iframe);
    });
  });

  /* ---------- lightbox galerie ---------- */
  var galleryLinks = Array.prototype.slice.call(document.querySelectorAll(".gallery-grid a"));
  var lightbox = document.querySelector(".lightbox");
  if (lightbox && galleryLinks.length) {
    var lbImg = lightbox.querySelector("img");
    var current = 0;
    function show(i) {
      current = (i + galleryLinks.length) % galleryLinks.length;
      lbImg.src = galleryLinks[current].getAttribute("href");
      lightbox.classList.add("is-open");
    }
    galleryLinks.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); show(i); });
    });
    lightbox.querySelector(".lightbox__close").addEventListener("click", function () {
      lightbox.classList.remove("is-open");
    });
    lightbox.querySelector(".lightbox__nav--prev").addEventListener("click", function () { show(current - 1); });
    lightbox.querySelector(".lightbox__nav--next").addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.classList.remove("is-open");
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") lightbox.classList.remove("is-open");
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------- formuláře přes e-mail ----------
     <form data-mailto="petra.w.musik@gmail.com" data-subject="..."> */
  document.querySelectorAll("form[data-mailto]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var lines = [];
      form.querySelectorAll("input, textarea, select").forEach(function (field) {
        if (!field.name || !field.value) return;
        lines.push(field.name + ": " + field.value);
      });
      var href =
        "mailto:" + form.getAttribute("data-mailto") +
        "?subject=" + encodeURIComponent(form.getAttribute("data-subject") || "") +
        "&body=" + encodeURIComponent(lines.join("\n"));
      window.location.href = href;
      var success = form.querySelector(".form-success");
      if (success) success.classList.add("is-visible");
    });
  });

  /* ---------- parallax pozadí ----------
     <section class="pxs"><img class="pxs__img" ...> — posun podle scrollu */
  var pxImgs = Array.prototype.slice.call(document.querySelectorAll(".pxs__img"));
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (pxImgs.length && !reducedMotion) {
    var ticking = false;
    var updateParallax = function () {
      ticking = false;
      var vh = window.innerHeight;
      pxImgs.forEach(function (img) {
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var progress = (r.top + r.height / 2 - vh / 2) / (vh + r.height);
        img.style.transform = "translateY(" + (progress * r.height * -0.22).toFixed(1) + "px)";
      });
    };
    var onScroll = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateParallax();
  }

  /* ---------- curtain reveal ----------
     připne sekce, které se vejdou do viewportu; další obsah se přes ně nasouvá.
     Jakmile je sekce plně překrytá následující sekcí, odepne se, aby
     nevykukovala pod kratšími sekcemi dál na stránce. */
  var stackables = Array.prototype.slice.call(
    document.querySelectorAll(".hero, .page-hero, main > .section")
  );
  var updatePins = function () {
    var vh = window.innerHeight;
    stackables.forEach(function (s) {
      var fits = s.offsetHeight <= vh + 1;
      var next = s.nextElementSibling;
      var covered = next ? next.getBoundingClientRect().top <= 0 : false;
      s.classList.toggle("is-pinned", fits && !covered);
    });
  };
  var applyStack = function () {
    var vh = window.innerHeight;
    stackables.forEach(function (s) {
      if (s.classList.contains("section")) {
        s.classList.remove("is-stack");
        s.classList.toggle("is-stack", s.offsetHeight <= vh);
      }
    });
    updatePins();
  };
  if (stackables.length) {
    var pinTicking = false;
    var onPinScroll = function () {
      if (!pinTicking) {
        pinTicking = true;
        window.requestAnimationFrame(function () {
          pinTicking = false;
          updatePins();
        });
      }
    };
    applyStack();
    window.addEventListener("load", applyStack);
    window.addEventListener("resize", applyStack, { passive: true });
    window.addEventListener("scroll", onPinScroll, { passive: true });
  }

  /* ---------- tlačítko nahoru ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
