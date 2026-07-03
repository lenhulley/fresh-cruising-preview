/* ============================================================
   Fresh Cruising — interactivity
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  if (header && toggle) {
    toggle.addEventListener("click", () => header.classList.toggle("open"));
  }

  /* ---------- Nav mega-menus ---------- */
  const megaItems = document.querySelectorAll(".nav__links .has-mega");
  const isTouch = window.matchMedia("(hover: none)").matches;

  megaItems.forEach((item) => {
    const link = item.querySelector("a");
    link.addEventListener("click", (e) => {
      // On desktop the menu opens on hover, so let the link behave normally
      // unless it's the touch / collapsed-nav case where we toggle instead.
      if (isTouch || window.innerWidth <= 900) {
        e.preventDefault();
        const wasOpen = item.classList.contains("open");
        megaItems.forEach((i) => i.classList.remove("open"));
        if (!wasOpen) item.classList.add("open");
        link.setAttribute("aria-expanded", String(!wasOpen));
      }
    });
  });

  // Close open mega-menu when clicking elsewhere
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-mega")) {
      megaItems.forEach((i) => {
        i.classList.remove("open");
        const a = i.querySelector("a");
        if (a) a.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ---------- Features carousel ---------- */
  const track = document.getElementById("featureTrack");
  const dotsWrap = document.getElementById("featureDots");
  if (track) {
    const slides = Array.from(track.children);
    let index = 0;
    let timer = null;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.className = "on";
      dot.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function render() {
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = `translateX(-${index * step}px)`;
      dots.forEach((d, i) => d.classList.toggle("on", i === index));
    }
    function go(i, userAction) {
      index = (i + slides.length) % slides.length;
      render();
      if (userAction) restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(() => go(index + 1, false), 5000);
    }

    document.querySelectorAll("#featureCarousel .feature-nav").forEach((btn) => {
      btn.addEventListener("click", () => go(index + Number(btn.dataset.dir), true));
    });

    render();
    restart();
    // Pause on hover
    const carousel = document.getElementById("featureCarousel");
    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", restart);
  }

  /* ---------- Offers slider ---------- */
  const scroll = document.getElementById("offerScroll");
  if (scroll) {
    document.querySelectorAll(".offer-carousel .offer-nav").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = scroll.querySelector(".offer");
        const step = card ? card.getBoundingClientRect().width + 24 : 340;
        scroll.scrollBy({ left: step * Number(btn.dataset.dir), behavior: "smooth" });
      });
    });
  }

  /* ---------- Offers tabs ---------- */
  const tabs = document.getElementById("offerTabs");
  if (tabs) {
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      tabs.querySelectorAll("button").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
      // PoC: reset scroll to the start so the "new" tab reads as fresh content
      if (scroll) scroll.scrollTo({ left: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer pill accordions ---------- */
  const footPills = document.getElementById("footPills");
  if (footPills) {
    footPills.querySelectorAll(".pill__head").forEach((headBtn) => {
      headBtn.addEventListener("click", () => {
        const pill = headBtn.closest(".pill");
        const open = pill.classList.toggle("open");
        headBtn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  /* ---------- Simple checkbox toggles ---------- */
  document.querySelectorAll(".search__chk, .comp-consent .box").forEach((box) => {
    const target = box.closest("span") || box;
    (box.matches(".box") ? box : box.parentElement).addEventListener("click", (e) => {
      e.preventDefault();
      box.classList.toggle("checked");
    });
  });
})();
