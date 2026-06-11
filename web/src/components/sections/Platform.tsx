"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { BarChart2, Grid, Users } from "lucide-react";

// Story beat 3: THE SOLUTION — hardware on the floor, barcodes being scanned
const BG = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=2400&q=90&auto=format&fit=crop";

const cards = [
  {
    icon: BarChart2,
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.12)",
    title: "Live material tracking",
    body: "Per-station Raspberry Pis scan barcodes on the floor. Stock, traceability, and quality events flow into the same ledger — no batch uploads, no end-of-day sync.",
    bullets: ["Barcode + QR + IoT scans", "Real-time stock per SKU", "Full end-to-end part traceability"],
  },
  {
    icon: Grid,
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    title: "Production & planning",
    body: "Bills-of-materials, vendor lead times, scrap factors. The platform tells you whether you can fulfil an order next Friday before you commit to it.",
    bullets: ["BOM-driven MRP", "Feasibility & shortage analysis", "Auto-suggested purchase orders"],
  },
  {
    icon: Users,
    color: "#e879f9",
    bg: "rgba(232,121,249,0.12)",
    title: "HR, ERP & automation",
    body: "Attendance, payroll, vendor profiles, low-stock alerts over email, Pi fleet OTA. The back office and the floor finally use the same system.",
    bullets: ["Roles, audit log, alerts", "Vendor + quality scorecards", "Pi fleet via Ansible"],
  },
];

export default function Platform() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} id="platform" className="scene-wrap py-44">
      {/* Story image: circuit board / hardware — the tech being deployed */}
      <motion.div style={{ y: imgY }} className="parallax-img">
        <Image src={BG} alt="Circuit board and hardware" fill sizes="100vw"
          className="object-cover object-center" />
      </motion.div>

      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(6,8,16,0.82) 0%, rgba(6,8,16,0.60) 50%, rgba(6,8,16,0.85) 100%)" }} />
      <div className="absolute top-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, #060810, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, #060810, transparent)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-20">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#a78bfa] font-semibold mb-5">
            <span className="w-8 h-px bg-[#a78bfa]" />
            Platform
          </span>
          <h2 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            One platform.<br />
            <span className="grad-brand">The entire shop floor.</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Live material movement. BOM-driven planning. HR &amp; ERP. Floor automation.
            All wired to the same operational backbone so the data finally reconciles.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.article key={card.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass rounded-3xl p-8 border-glow relative overflow-hidden group cursor-default">

              {/* Hover top bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
              {/* Hover bg glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl"
                style={{ background: `radial-gradient(ellipse at top left, ${card.bg}, transparent 70%)` }} />

              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/8"
                style={{ background: card.bg }}>
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>

              <h3 className="relative text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="relative text-zinc-400 text-sm leading-relaxed mb-6">{card.body}</p>

              <ul className="relative space-y-2.5">
                {card.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: card.color }} />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
