/* Vintract marketing site: scroll-driven animations using GSAP + ScrollTrigger.
 *
 * Design intent: nothing flashy that distracts from copy. Sections fade up,
 * the background grid drifts in parallax, a soft scan line follows the
 * scroll position, and counters tick to their target values when they
 * enter the viewport. Reduced-motion users get no animation.
 */
(function () {
  "use strict";

  // Every fresh load starts at the top: no browser scroll restoration,
  // and a leftover #anchor in the URL is cleared instead of jumping the
  // page mid-section. In-page anchor clicks still work normally.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  window.scrollTo(0, 0);

  // -------- Hero verb rotation: digitise -> modernise -> ... --------
  // Content feature, not decoration: it must rotate on every machine.
  // With GSAP and motion allowed, the swap slides through the overflow
  // mask the entrance animation creates; otherwise it's an instant text
  // swap (reduced-motion users, or GSAP blocked/missing).
  (function initVerbRotation() {
    const rotator = document.getElementById("hero-rotator");
    if (!rotator) return;
    const verbs = ["digitise", "modernise", "automate", "connect", "transform"];
    let vi = 0;

    function canSlide() {
      return !!window.gsap &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        rotator.parentElement.classList.contains("word-mask");
    }

    setInterval(() => {
      vi = (vi + 1) % verbs.length;
      const next = verbs[vi];
      if (!canSlide()) {
        rotator.textContent = next;
        return;
      }
      const mask = rotator.parentElement;
      const probe = rotator.cloneNode();
      probe.textContent = next;
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      mask.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      const tl = gsap.timeline();
      tl.to(rotator, { yPercent: -115, duration: 0.35, ease: "power2.in" })
        .to(mask, { width: w, duration: 0.35, ease: "power2.inOut" }, "<")
        .add(() => {
          rotator.textContent = next;
          gsap.set(rotator, { yPercent: 115 });
        })
        .to(rotator, { yPercent: 0, duration: 0.45, ease: "power2.out" });
    }, 2400);
  })();

  // Fallback: if GSAP/ScrollTrigger didn't load (slow mobile network,
  // content blocker, CDN hiccup), the .reveal blocks would stay at
  // opacity:0 and the whole page would look blank. Force everything
  // visible and bail: static page, no animation, but fully usable.
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

    // Aurora rides the scroll: drifts upward and slowly shifts hue from
    // violet toward teal over the length of the page. The CSS keyframe
    // drift keeps running underneath for idle motion.
    gsap.to(".bg-grid", {
      "--bg-shift": -120,
      "--bg-hue": 40,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 },
    });

    // Reading progress bar above the header.
    const progress = document.getElementById("scroll-progress");
    if (progress) {
      gsap.to(progress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
      });
    }

    // Hero eases up and fades as the visitor scrolls past it. Cheap
    // depth cue that makes the page feel layered.
    const heroInner = document.querySelector("#top > div");
    if (heroInner) {
      gsap.to(heroInner, {
        yPercent: -12,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }

    // Value trend line: draws from bottom-left to top-right across the
    // whole page scroll, the red tip riding its end. The visual "number
    // going up" that the product promises.
    const trendLine = document.getElementById("bg-trend-line");
    const trendTip = document.getElementById("bg-trend-tip");
    if (trendLine && trendTip && window.MotionPathPlugin) {
      const len = trendLine.getTotalLength();
      trendLine.style.strokeDasharray = len;
      trendLine.style.strokeDashoffset = len;
      gsap.to(trendLine, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.4 },
      });
      gsap.to(trendTip, {
        motionPath: { path: trendLine, align: trendLine, alignOrigin: [0.5, 0.5], autoRotate: true },
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.4 },
      });
    }

    // Scan line tracks scroll position. Feels like a sensor sweeping
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
  // The title additionally splits into words that rise out of an overflow
  // mask, one after another. Split runs only when animating; screen readers
  // and reduced-motion users get the untouched text.
  function splitTitleWords(title) {
    const words = [];
    title.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const mask = document.createElement("span");
          mask.className = "word-mask";
          const word = document.createElement("span");
          word.className = "word";
          word.textContent = part;
          mask.appendChild(word);
          frag.appendChild(mask);
          words.push(word);
        });
        title.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "BR") {
        const mask = document.createElement("span");
        mask.className = "word-mask";
        title.replaceChild(mask, node);
        mask.appendChild(node);
        node.classList.add("word");
        words.push(node);
      }
    });
    return words;
  }

  const heroParts = [
    ".hero-eyebrow",
    ".hero-sub",
    ".hero-cta",
    ".hero-stats",
  ];
  if (!reducedMotion) {
    const title = document.querySelector(".hero-title");
    const words = title ? splitTitleWords(title) : [];
    gsap.set(heroParts, { opacity: 0, y: 24 });
    if (words.length) {
      gsap.set(words, { yPercent: 110 });
      gsap.to(words, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.15,
      });
    }
    gsap.to(heroParts, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      delay: 0.45,
    });
  } else {
    gsap.set(heroParts.concat([".hero-title"]), { opacity: 1, y: 0 });
  }


  // -------- Hero title gradient shimmer (always on, very subtle) --------
  // Implemented via CSS animation if we add one. Left out for now to keep
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
          start: "top 94%",
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

  // -------- 3D tilt on cards, desktop pointers only --------
  // GSAP owns every transform on the cards (entrance + tilt), so the two
  // never fight over the inline style.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reducedMotion) {
    document.querySelectorAll(".card").forEach((card) => {
      const rx = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power2.out" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power2.out" });
      gsap.set(card, { transformPerspective: 900 });
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rx(py * -6);
        ry(px * 6);
      });
      card.addEventListener("pointerleave", () => { rx(0); ry(0); });
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
