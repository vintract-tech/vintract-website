"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Activity } from "lucide-react";

const links = [
  { href: "#platform", label: "Platform" },
  { href: "#ai", label: "AI" },
  { href: "#mission", label: "Mission" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#070912]/90 backdrop-blur-xl border-b border-white/8 shadow-2xl shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#34d399] flex items-center justify-center shadow-lg shadow-[#7c3aed]/40 group-hover:shadow-[#7c3aed]/60 transition-shadow">
            <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-bold text-lg tracking-tight text-white">vintract</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative hover:text-white transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-[#8b5cf6] after:to-[#34d399] hover:after:w-full after:transition-all after:duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#contact"
            className="relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#7c3aed]/30 transition-all duration-200 hover:shadow-[#7c3aed]/50 hover:-translate-y-0.5"
          >
            Book a demo
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0b0f1a]/95 backdrop-blur-xl border-b border-white/8"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-zinc-300 hover:text-white transition-colors py-1"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] px-4 py-2.5 text-sm font-semibold text-white"
              >
                Book a demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
