"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

type Heading = {
  level: number;
  id: string;
  text: string;
};

type Props = {
  headings: Heading[];
};

export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <aside style={{ position: 'fixed', right: 0, top: 56, width: 224, height: 'calc(100vh - 56px)', borderLeft: '1px solid #2d3348', padding: 16, overflowY: 'auto', display: 'none' }} className="xl:!block">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-3">
        <List size={14} />
        On this page
      </div>
      <nav className="space-y-1">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`block text-[12px] leading-5 transition-colors ${
              h.level === 3 ? "pl-3" : ""
            } ${
              activeId === h.id
                ? "text-accent font-medium"
                : "text-text-dim hover:text-text"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
