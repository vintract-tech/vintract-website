/* Vintract marketing — scroll-driven animations using GSAP + ScrollTrigger.
 *
 * Design intent: nothing flashy that distracts from copy. Sections fade up,
 * the background grid drifts in parallax, a soft scan line follows the
 * scroll position, and counters tick to their target values when they
 * enter the viewport. Reduced-motion users get no animation.
 */
(function () {
  "use strict";

  // Fallback: if GSAP/ScrollTrigger didn't load (slow mobile network,
  // content blocker, CDN hiccup), the .reveal blocks would stay at
  // opacity:0 and the whole page would look blank. Force everything
  // visible and bail — static page, no animation, but fully usable.
  if (!window.gsap || !window.ScrollTrigger) {
    document.querySelectorAll(".reveal, .hero-eyebrow, .hero-title, .hero-sub, .hero-cta, .hero-stats")
      .forEach((el) => { el.style.opacity = "1"; el.style.transform = "none"; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (window.MotionPathPlugin) gsap.registerPlugin(MotionPathPlugin);

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

  // (Removed: nav-background-on-scroll. Nav is now a static flat bar.)

  // -------- Platform connector: SVG line drawn between cards on scroll --------
  const connectorSvg = document.querySelector(".platform-connector");
  const connectorPath = document.querySelector(".platform-connector__path");
  const connectorDot = document.querySelector(".platform-connector__dot");
  const cards = document.querySelectorAll("#platform .card");

  if (connectorSvg && connectorPath && cards.length >= 3 && !reducedMotion) {
    function updateConnectorPath() {
      const wrapper = connectorSvg.parentElement;
      const wrapperRect = wrapper.getBoundingClientRect();

      const points = Array.from(cards).map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          x: rect.left - wrapperRect.left + rect.width / 2,
          y: rect.top - wrapperRect.top + 30,
        };
      });

      // Smooth curve through card tops
      const midX1 = (points[0].x + points[1].x) / 2;
      const midX2 = (points[1].x + points[2].x) / 2;
      const d = `M ${points[0].x} ${points[0].y} Q ${midX1} ${points[0].y - 40} ${points[1].x} ${points[1].y} Q ${midX2} ${points[1].y - 40} ${points[2].x} ${points[2].y}`;

      connectorPath.setAttribute("d", d);
      connectorSvg.setAttribute("viewBox", `0 0 ${wrapperRect.width} ${wrapperRect.height}`);

      return connectorPath.getTotalLength();
    }

    // Initial path setup
    let pathLength = updateConnectorPath();
    connectorPath.style.strokeDasharray = pathLength;
    connectorPath.style.strokeDashoffset = pathLength;

    // Animate the line drawing on scroll
    gsap.to(connectorPath, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".platform-cards-wrapper",
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.5,
      },
    });

    // Animate the dot traveling along the path
    gsap.set(connectorDot, { opacity: 1 });
    gsap.to(connectorDot, {
      motionPath: {
        path: connectorPath,
        align: connectorPath,
        alignOrigin: [0.5, 0.5],
      },
      ease: "none",
      scrollTrigger: {
        trigger: ".platform-cards-wrapper",
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.5,
      },
    });

    // Recalculate on resize
    window.addEventListener("resize", () => {
      pathLength = updateConnectorPath();
      connectorPath.style.strokeDasharray = pathLength;
    });
  }

  // -------- AI Terminal: typewriter effect --------
  const aiPromptEl = document.getElementById("ai-prompt");
  const aiResponseEl = document.getElementById("ai-response");
  const aiAnswerEl = document.getElementById("ai-answer");
  const aiTerminal = document.getElementById("ai-terminal");

  if (aiPromptEl && aiResponseEl && aiAnswerEl && aiTerminal) {
    const question = "What is causing the bottleneck on Station 3?";
    const answer = "Station 3 press-fit cycle time spiked 18% at 02:14. Root cause: hydraulic pressure drop on actuator B. Recommending maintenance window before next shift.";
    let hasPlayed = false;

    function typeText(el, text, speed, callback) {
      let i = 0;
      function tick() {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, speed);
        } else if (callback) {
          callback();
        }
      }
      tick();
    }

    function playTerminal() {
      if (hasPlayed) return;
      hasPlayed = true;

      typeText(aiPromptEl, question, 40, () => {
        // Hide cursor, show response
        const cursor = aiTerminal.querySelector(".ai-terminal__cursor");
        if (cursor) cursor.style.display = "none";

        setTimeout(() => {
          aiResponseEl.classList.remove("hidden");
          typeText(aiAnswerEl, answer, 25);
        }, 400);
      });
    }

    if (reducedMotion) {
      aiPromptEl.textContent = question;
      const cursor = aiTerminal.querySelector(".ai-terminal__cursor");
      if (cursor) cursor.style.display = "none";
      aiResponseEl.classList.remove("hidden");
      aiAnswerEl.textContent = answer;
    } else {
      ScrollTrigger.create({
        trigger: aiTerminal,
        start: "top 80%",
        once: true,
        onEnter: playTerminal,
      });
    }
  }
})();
