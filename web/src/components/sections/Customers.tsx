"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// Story beat 5: THE RESULT — any Indian factory, any product, same platform
const BG = "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=2400&q=90&auto=format&fit=crop";

// Industries Vintract is built for — not just cookers
const INDUSTRIES = [
  { label: "Consumer appliances",  color: "#a78bfa" },
  { label: "Auto components",      color: "#34d399" },
  { label: "Pharma & FMCG",        color: "#e879f9" },
  { label: "Textiles & garments",  color: "#a78bfa" },
  { label: "Electronics assembly", color: "#34d399" },
  { label: "Food processing",      color: "#e879f9" },
];

// Deployment stats from Motley Hosur — real numbers
const DEPLOY_STATS = [
  { value: "8",    label: "Stations live" },
  { value: "600+", label: "SKUs tracked" },
  { value: "2,400+", label: "Scans / day" },
  { value: "< 1s", label: "Data latency" },
];

export default function Customers() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="scene-wrap py-40">
      <motion.div style={{ y: imgY }} className="parallax-img">
        <Image src={BG} alt="Modern organised factory floor" fill sizes="100vw"
          className="object-cover object-center" />
      </motion.div>
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(6,8,16,0.82) 0%, rgba(6,8,16,0.62) 50%, rgba(6,8,16,0.85) 100%)" }} />
      <div className="absolute top-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, #060810, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, #060810, transparent)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-400 font-semibold">
            <span className="w-10 h-px bg-zinc-600" />
            Built for Indian manufacturing — any product, any floor
            <span className="w-10 h-px bg-zinc-600" />
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-6 leading-tight">
            If it&apos;s made in India,<br />
            <span className="grad-brand">Vintract can run it.</span>
          </h2>
          <p className="text-zinc-400 text-lg mt-4 max-w-xl mx-auto">
            The platform is industry-agnostic. The same barcode scanning, BOM planning, and AI
            layer that runs a cooker factory runs an auto-parts line or a pharma packaging unit.
          </p>
        </motion.div>

        {/* Industry tags */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-20">
          {INDUSTRIES.map((ind) => (
            <span key={ind.label}
              className="glass rounded-full px-4 py-2 text-sm font-medium border border-white/8"
              style={{ color: ind.color }}>
              {ind.label}
            </span>
          ))}
        </motion.div>

        {/* First customer: Motley Cookers — with real deployment stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          className="glass rounded-3xl border-glow overflow-hidden max-w-3xl mx-auto">

          <div className="p-8 md:p-10">
            <div className="flex items-start justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#34d399] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-xl">M</span>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white">Motley Cookers</div>
                  <div className="text-sm text-zinc-400">Consumer appliances · Hosur, Tamil Nadu</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
                <span className="text-xs text-[#34d399] font-semibold">Live in production</span>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-zinc-300 text-lg leading-relaxed italic border-l-2 border-[#a78bfa]/40 pl-5 mb-8">
              &ldquo;We went from end-of-day register entries to real-time stock visibility across
              all 8 stations. The team now knows exactly what&apos;s on the floor before the shift
              starts.&rdquo;
            </blockquote>

            {/* Deployment stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {DEPLOY_STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-10 py-4 bg-white/2 border-t border-white/5 text-xs text-zinc-600">
            First deployment · More customer announcements coming Q3 2025
          </div>
        </motion.div>

      </div>
    </section>
  );
}
