"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Mail, Phone, ExternalLink, ArrowRight, CalendarCheck, Search, Rocket } from "lucide-react";

// Futuristic automated factory — the destination
const BG = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=2400&q=90&auto=format&fit=crop";

const contacts = [
  { icon: Mail,         color: "#a78bfa", label: "Email",    value: "admin@vintract.com",         href: "mailto:admin@vintract.com"           },
  { icon: Phone,        color: "#34d399", label: "Phone",    value: "+91 98661 54639",             href: "tel:+919866154639"                   },
  { icon: ExternalLink, color: "#e879f9", label: "LinkedIn", value: "/company/vintract",           href: "https://linkedin.com/company/vintract" },
];

const STEPS = [
  { icon: CalendarCheck, color: "#a78bfa", step: "01", title: "Book a demo",       body: "45-minute live walkthrough of a real deployment — see the platform running on an actual factory floor." },
  { icon: Search,        color: "#34d399", step: "02", title: "Scoping call",       body: "We map your floor layout, SKU count, and pain points. You get a tailored implementation plan." },
  { icon: Rocket,        color: "#e879f9", step: "03", title: "Go live in 6 weeks", body: "Hardware shipped, Pis provisioned, team trained. Your floor is live and scanning from day one." },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} id="contact" className="scene-wrap py-44">
      <motion.div style={{ y: imgY }} className="parallax-img">
        <Image src={BG} alt="Smart automated factory" fill sizes="100vw"
          className="object-cover object-center" />
      </motion.div>
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(6,8,16,0.85) 0%, rgba(6,8,16,0.62) 50%, rgba(6,8,16,0.92) 100%)" }} />
      <div className="absolute top-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, #060810, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, #060810, transparent)" }} />

      <div className="relative z-10 mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#a78bfa] font-semibold mb-6">
            <span className="w-8 h-px bg-[#a78bfa]" />
            Get in touch
            <span className="w-8 h-px bg-[#a78bfa]" />
          </span>
          <h2 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            Ready to wire up<br />
            <span className="grad-brand">your factory?</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
            Whether you make auto parts, appliances, textiles, or electronics — if it&apos;s
            manufactured, we can digitise it. Reach out and we&apos;ll scope your floor for free.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: what happens next timeline */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-semibold mb-8">
              What happens next
            </div>
            <div className="space-y-6">
              {STEPS.map((s, i) => (
                <motion.div key={s.step}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex gap-5">
                  {/* Step number + connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs"
                      style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` }}>
                      {s.step}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-px flex-1 mt-2" style={{ background: `linear-gradient(to bottom, ${s.color}30, transparent)` }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                      <span className="text-white font-bold text-base">{s.title}</span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{s.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: contact cards + CTA */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4">

            {contacts.map((c, i) => (
              <motion.a key={c.label} href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className="glass rounded-2xl p-5 flex items-center gap-4 border-glow group transition-all duration-300 block">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${c.color}18` }}>
                  <c.icon className="w-5 h-5" style={{ color: c.color }} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-zinc-500 mb-0.5">{c.label}</div>
                  <div className="text-base font-semibold text-white">{c.value}</div>
                </div>
              </motion.a>
            ))}

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.35 }}
              className="pt-4">
              <a href="mailto:admin@vintract.com?subject=Demo%20request"
                className="group w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] px-8 py-4 text-base font-bold text-white shadow-2xl shadow-[#7c3aed]/40 transition-all duration-300 hover:-translate-y-1">
                Request a free demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-center text-xs text-zinc-600 mt-3">No commitment. We scope your floor, you decide.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
