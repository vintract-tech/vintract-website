"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { X, Check } from "lucide-react";

const BG = "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=2400&q=90&auto=format&fit=crop";

const OLD = [
  "Hand-written stock registers",
  "WhatsApp threads for production updates",
  "End-of-day batch data entry",
  "No traceability — part goes missing, nobody knows",
  "Supervisor guesses what to order",
  "Quality defects found after shipping",
];

const NEW = [
  "Every scan hits the ledger in < 200ms",
  "Single dashboard — floor, office, management",
  "Real-time stock per SKU, per station",
  "Full part-to-product traceability chain",
  "AI-suggested purchase orders before stockout",
  "Anomaly detection flags defects at the station",
];

const DELTAS = [
  { label: "Data lag",        before: "24 hrs",  after: "< 1 sec",  color: "#34d399" },
  { label: "Stock accuracy",  before: "~60%",    after: "99.4%",    color: "#a78bfa" },
  { label: "Traceability",    before: "None",    after: "100%",     color: "#34d399" },
];

export default function Mission() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} id="mission" className="scene-wrap py-44">
      <motion.div style={{ y: imgY, position: "absolute", inset: "-20%", background: "#060810" }} className="parallax-img">
        <Image src={BG} alt="Worker with clipboard" fill sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg=="
          className="object-cover object-center" />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(6,8,16,0.82) 0%, rgba(6,8,16,0.62) 50%, rgba(6,8,16,0.85) 100%)" }} />
      <div className="absolute top-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to bottom, #060810, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to top, #060810, transparent)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-400 font-semibold">
            <span className="w-10 h-px bg-zinc-600" />The problem we solve<span className="w-10 h-px bg-zinc-600" />
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-6 leading-tight">
            Manufacturing runs on<br />
            <span className="text-red-400">chaos</span>. We replace it with <span className="grad-brand">clarity</span>.
          </h2>
        </motion.div>

        {/* Old vs New comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Old world */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-8 border border-red-500/15 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #ef4444, transparent)" }} />
            <div className="text-xs uppercase tracking-[0.3em] text-red-400 font-semibold mb-6">Before Vintract</div>
            <ul className="space-y-3">
              {OLD.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-400">
                  <X className="w-4 h-4 text-red-500/70 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* New world */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-8 border-glow relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #34d399, transparent)" }} />
            <div className="text-xs uppercase tracking-[0.3em] text-[#34d399] font-semibold mb-6">With Vintract</div>
            <ul className="space-y-3">
              {NEW.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-zinc-200">
                  <Check className="w-4 h-4 text-[#34d399] flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Delta metrics */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-3 gap-4">
          {DELTAS.map((d) => (
            <div key={d.label} className="glass rounded-2xl p-5 border-glow text-center">
              <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">{d.label}</div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm text-red-400 line-through font-mono">{d.before}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-lg font-black font-mono" style={{ color: d.color }}>{d.after}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
