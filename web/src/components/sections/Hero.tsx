"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronDown, Wifi, Package, AlertTriangle, CheckCircle2 } from "lucide-react";

// Hero background - Industrial tower at night
const BG = "https://images.unsplash.com/photo-1588011930968-eadac80e6a5a?w=2400&q=90&auto=format&fit=crop";

const SCAN_EVENTS = [
  { icon: Package,       color: "#34d399", station: "Station 2", event: "SKU-4821 scanned",        qty: "+1 unit"  },
  { icon: CheckCircle2,  color: "#a78bfa", station: "QC Gate",   event: "Batch B-0042 passed",     qty: "48 units" },
  { icon: Wifi,          color: "#34d399", station: "Station 5", event: "Pi heartbeat OK",          qty: "12ms"    },
  { icon: Package,       color: "#34d399", station: "Inbound",   event: "PO-2291 received",         qty: "200 pcs" },
  { icon: AlertTriangle, color: "#f59e0b", station: "Station 3", event: "Low stock: RM-Gasket-7B",  qty: "4 left"  },
  { icon: CheckCircle2,  color: "#a78bfa", station: "Assembly",  event: "Unit #1847 complete",      qty: "1 unit"  },
  { icon: Package,       color: "#34d399", station: "Station 1", event: "SKU-3310 scanned",         qty: "+3 units"},
  { icon: Wifi,          color: "#34d399", station: "Station 4", event: "Pi heartbeat OK",          qty: "9ms"     },
];

function LiveFeed() {
  const [events, setEvents] = useState(SCAN_EVENTS.slice(0, 3));
  const [idx, setIdx] = useState(3);
  useEffect(() => {
    const t = setInterval(() => {
      setEvents((prev) => {
        const next = SCAN_EVENTS[idx % SCAN_EVENTS.length];
        return [next, ...prev.slice(0, 2)];
      });
      setIdx((i) => i + 1);
    }, 2200);
    return () => clearInterval(t);
  }, [idx]);

  return (
    <div className="glass rounded-2xl border-glow overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">Live floor events</span>
        </div>
        <span className="text-[10px] text-zinc-600 font-mono">vintract demo</span>
      </div>
      <div className="divide-y divide-white/4" style={{ minHeight: "156px" }}>
        <AnimatePresence initial={false} mode="popLayout">
          {events.map((e, i) => (
            <motion.div key={`${e.event}-${i}`}
              layout={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-4 py-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${e.color}18` }}>
                <e.icon className="w-3.5 h-3.5" style={{ color: e.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-zinc-200 truncate">{e.event}</div>
                <div className="text-[10px] text-zinc-500">{e.station}</div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 flex-shrink-0">{e.qty}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const elRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const attach = (el: HTMLSpanElement | null) => {
    (elRef as React.MutableRefObject<HTMLSpanElement | null>).current = el;
    if (!el || started.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      started.current = true;
      const dur = 1800; const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    obs.observe(el);
  };
  return <span ref={attach}>0{suffix}</span>;
}

const stats = [
  { value: 100, suffix: "%",    label: "Real-time data"  },
  { value: 24,  suffix: "×7",   label: "Visibility"      },
  { value: 1,   suffix: "",     label: "Pi / station"    },
  { value: 0,   suffix: " AI",  label: "Apps without AI" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentOpa = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} id="top" className="scene-wrap min-h-[100svh] flex items-center">

      {/* ── Background image ── */}
      <div className="absolute inset-0" style={{ background: "#060810" }}>
        <Image src={BG} alt="Industrial manufacturing" fill priority sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg=="
          className="object-cover object-center" />
      </div>

      {/* Overlay for text readability */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(6,8,16,0.45) 0%, rgba(6,8,16,0.60) 50%, rgba(6,8,16,0.92) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, #060810)" }} />

      {/* ── Content: centred headline, live feed below ── */}
      <motion.div style={{ opacity: contentOpa }}
        className="relative z-10 w-full mx-auto max-w-7xl px-6 pt-28 pb-20">

        {/* Centred headline block */}
        <div className="text-center max-w-4xl mx-auto mb-16">

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-black/40 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-zinc-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
            Industry 4.0 SaaS — built for manufacturers worldwide
            <span className="w-px h-3 bg-white/20" />
            <span className="text-[#a78bfa]">Live in production</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] text-white mb-6">
            The factory floor,<br />
            finally <span className="grad-brand">intelligent</span>.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed max-w-2xl mx-auto">
            Live material tracking, BOM-driven production planning, HR &amp; ERP, and factory
            automation — with <span className="text-white font-semibold">AI built into every module</span>.
            One platform that turns any shop floor into a real-time, intelligent system.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.52 }}
            className="flex flex-wrap items-center justify-center gap-4">
            <a href="#contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] px-7 py-3.5 text-sm font-bold text-white shadow-2xl shadow-[#7c3aed]/40 transition-all duration-300 hover:-translate-y-0.5">
              See a live demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#platform"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 hover:border-white/40 bg-black/30 hover:bg-black/50 backdrop-blur-md px-7 py-3.5 text-sm font-semibold text-zinc-100 transition-all duration-200">
              What we build
            </a>
          </motion.div>
        </div>

        {/* Stats + live feed row */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto items-start">

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 border-glow text-center">
                <div className="text-2xl md:text-3xl font-black text-white mb-1">
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[11px] uppercase tracking-widest text-zinc-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Live feed */}
          <LiveFeed />
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-zinc-500 text-[10px] uppercase tracking-widest z-10">
        Scroll <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
