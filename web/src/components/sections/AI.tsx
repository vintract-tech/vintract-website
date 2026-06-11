"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { TrendingUp, Star, MessageSquare, Eye, FileText, Settings } from "lucide-react";

// Story beat 4: THE INTELLIGENCE — dark server room, glowing screens, AI at work
const BG = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=2400&q=90&auto=format&fit=crop";

const tiles = [
  { icon: TrendingUp, label: "Predictive shortages",       color: "#a78bfa" },
  { icon: Star,       label: "Quality anomaly detection",  color: "#34d399" },
  { icon: MessageSquare, label: "Conversational dashboards", color: "#a78bfa" },
  { icon: Eye,        label: "Vision-based inspection",    color: "#34d399" },
  { icon: FileText,   label: "Document AI (GST, POs)",     color: "#a78bfa" },
  { icon: Settings,   label: "Predictive maintenance",     color: "#34d399" },
];

const QUESTION = "Why did output drop 12% on Line B this week?";
const ANSWER   = "Line B cycle time increased 14% from Tuesday. Root cause: raw material variance in Batch RM-0441 causing rework at Station 4. Recommend vendor quality review and buffer stock increase.";

function Terminal() {
  const [prompt, setPrompt]     = useState("");
  const [answer, setAnswer]     = useState("");
  const [showAns, setShowAns]   = useState(false);
  const [hideCursor, setHide]   = useState(false);
  const played = useRef(false);
  const ref    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || played.current) return;
      played.current = true;
      let i = 0;
      const typeQ = () => {
        if (i <= QUESTION.length) { setPrompt(QUESTION.slice(0, i++)); setTimeout(typeQ, 36); }
        else {
          setHide(true);
          setTimeout(() => {
            setShowAns(true);
            let j = 0;
            const typeA = () => { if (j <= ANSWER.length) { setAnswer(ANSWER.slice(0, j++)); setTimeout(typeA, 20); } };
            typeA();
          }, 450);
        }
      };
      typeQ();
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="glass rounded-2xl overflow-hidden border-glow mt-5">
      <div className="flex items-center gap-2 px-4 py-3 bg-white/3 border-b border-white/6">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-[11px] text-zinc-500 font-mono">vintract-ai — night shift</span>
      </div>
      <div className="p-5 font-mono text-sm min-h-[110px]">
        <div>
          <span className="text-[#34d399]">supervisor $&nbsp;</span>
          <span className="text-zinc-200">{prompt}</span>
          {!hideCursor && <span className="text-[#34d399] cursor-blink">▌</span>}
        </div>
        {showAns && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 text-zinc-400 leading-relaxed">
            <span className="text-[#a78bfa]">vintract-ai ›&nbsp;</span>
            {answer}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function AI() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} id="ai" className="scene-wrap py-44">
      {/* Story image: server room / data centre — the AI brain */}
      <motion.div style={{ y: imgY }} className="parallax-img">
        <Image src={BG} alt="Server room with glowing data" fill sizes="100vw"
          className="object-cover object-center" />
      </motion.div>

      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(6,8,16,0.80) 0%, rgba(6,8,16,0.55) 50%, rgba(6,8,16,0.85) 100%)" }} />
      <div className="absolute top-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to bottom, #060810, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, #060810, transparent)" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-12 gap-16 items-center">

          {/* Left copy */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#34d399] font-semibold mb-5">
              <span className="w-8 h-px bg-[#34d399]" />
              What&apos;s coming
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-white mb-6">
              Every new app we ship is{" "}
              <span className="grad-accent">AI-native</span>.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              We don&apos;t bolt models on. Each module ships with intelligence in the loop —
              predictive shortages from your scan stream, anomaly detection on quality data,
              a chat surface over your operational data so the night-shift supervisor can{" "}
              <em className="text-zinc-300">ask</em> the system what&apos;s wrong.
            </p>
          </motion.div>

          {/* Right: tiles + terminal */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7">
            <div className="grid grid-cols-2 gap-3">
              {tiles.map((tile, i) => (
                <motion.div key={tile.label}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  className="glass rounded-2xl p-4 flex items-center gap-3 cursor-default transition-colors duration-300">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${tile.color}18` }}>
                    <tile.icon className="w-4 h-4" style={{ color: tile.color }} />
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">{tile.label}</span>
                </motion.div>
              ))}
            </div>
            <Terminal />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
