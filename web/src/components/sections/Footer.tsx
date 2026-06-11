"use client";
import { Activity } from "lucide-react";

const links = [
  { href: "#mission", label: "Mission" },
  { href: "#platform", label: "Platform" },
  { href: "#ai", label: "AI" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-10 bg-[#070912]">
      <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#34d399] flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="font-semibold text-zinc-300">Vintract</span>
          <span>&copy; 2026. Made in India.</span>
        </div>
        <nav className="flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-zinc-300 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
