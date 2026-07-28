"use client";

import { useEffect, useRef, useState } from "react";

const frases = [
  {
    text: "E se a tecnologia deixasse de ser o centro de tudo?",
    color: "#1F2937",
    size: "clamp(1.5rem, 3vw, 2.25rem)",
    weight: "500",
  },
  {
    text: "E passasse a ser apenas o que sempre deveria ter sido: uma extensão da inteligência humana.",
    color: "#6B7280",
    size: "clamp(1.25rem, 2.5vw, 1.875rem)",
    weight: "400",
  },
  {
    text: "É exatamente isso que construímos.",
    color: "#3F7BD9",
    size: "clamp(1.5rem, 3vw, 2.25rem)",
    weight: "600",
  },
];

function FraseReveal({ text, color, size, weight, delay }: {
  text: string; color: string; size: string; weight: string; delay: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className="leading-snug tracking-tight max-w-[32ch] mx-auto text-center"
      style={{
        fontSize: size,
        fontWeight: weight,
        color,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 900ms cubic-bezier(0.215,0.61,0.355,1) ${delay}ms, transform 900ms cubic-bezier(0.215,0.61,0.355,1) ${delay}ms`,
      }}
    >
      {text}
    </p>
  );
}

export default function PausaFilosofica() {
  return (
    <section className="bg-white py-24 lg:py-36">
      <div className="max-w-[88rem] mx-auto px-5 sm:px-8 flex flex-col items-center gap-12">
        {frases.map((f, i) => (
          <FraseReveal key={i} {...f} delay={i * 150} />
        ))}
      </div>
    </section>
  );
}
