/* Vintract marketing — scroll-driven animations using GSAP + ScrollTrigger.
 *
 * Design intent: nothing flashy that distracts from copy. Sections fade up,
 * the background grid drifts in parallax, a soft scan line follows the
 * scroll position, and counters tick to their target values when they
 * enter the viewport. Reduced-motion users get no animation.
 */
(function () {
  "use strict";

  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -------- Background grid: subtle parallax drift --------
  if (!reducedMotion) {
    gsap.to(".bg-grid__layer--lines", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.5 },
    });
    gsap.to(".bg-grid__layer--dots", {
      yPercent: -25,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.5 },
    });

    // Scan line tracks scroll position — feels like a sensor sweeping
    // down the document as the visitor reads.
    const scan = document.getElementById("bg-scan");
    if (scan) {
      gsap.to(scan, {
        y: () => window.innerHeight + 200,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
    }
  }

  // -------- Hero entrance: stagger eyebrow / title / sub / CTA / stats --------
  const heroParts = [
    ".hero-eyebrow",
    ".hero-title",
    ".hero-sub",
    ".hero-cta",
    ".hero-stats",
  ];
  if (!reducedMotion) {
    gsap.set(heroParts, { opacity: 0, y: 24 });
    gsap.to(heroParts, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.15,
    });
  } else {
    gsap.set(heroParts, { opacity: 1, y: 0 });
  }

  // -------- Hero title gradient shimmer (always on, very subtle) --------
  // Implemented via CSS animation if we add one — left out for now to keep
  // motion budget low. The gradient text already reads well static.

  // -------- Reveal-on-scroll for any .reveal block --------
  document.querySelectorAll(".reveal").forEach((el) => {
    if (reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // -------- Card stagger inside each platform section --------
  document.querySelectorAll("#platform .card").forEach((card, i) => {
    if (reducedMotion) return;
    gsap.fromTo(
      card,
      { opacity: 0, y: 60, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.85,
        ease: "power3.out",
        delay: i * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // -------- AI tile cascade --------
  document.querySelectorAll(".ai-tile").forEach((tile, i) => {
    if (reducedMotion) return;
    gsap.fromTo(
      tile,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: tile,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });

  // -------- Counters: tick to target when they enter the viewport --------
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-counter") || "0");
    const suffix = el.getAttribute("data-counter-suffix") || "";
    if (reducedMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        const n = obj.v >= 10 ? Math.round(obj.v) : Math.round(obj.v * 10) / 10;
        el.textContent = `${n}${suffix}`;
      },
    });
  });

  // -------- Nav background opacity grows as we scroll past hero --------
  const nav = document.querySelector("header");
  if (nav && !reducedMotion) {
    ScrollTrigger.create({
      start: "top -50",
      end: 99999,
      onUpdate: (self) => {
        nav.style.backgroundColor =
          self.direction === 1 || self.scroll() > 50
            ? "rgba(7, 9, 18, 0.78)"
            : "rgba(7, 9, 18, 0.4)";
      },
    });
  }
})();
