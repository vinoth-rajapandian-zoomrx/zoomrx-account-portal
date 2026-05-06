"use client";

import type { ContentFile } from "@/lib/content";
import { Calendar, Clock } from "lucide-react";

type Props = {
  content: ContentFile;
};

const TYPE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  "account-overview": { bg: "bg-blue/15", text: "text-blue", label: "Overview" },
  "account-contacts": { bg: "bg-purple/15", text: "text-purple", label: "Contacts" },
  "account-financials": { bg: "bg-green/15", text: "text-green", label: "Financials" },
  "account-relationships": { bg: "bg-orange/15", text: "text-orange", label: "Relationships" },
  "account-whitespace": { bg: "bg-red/15", text: "text-red", label: "White Space" },
  "account-projects": { bg: "bg-yellow/15", text: "text-yellow", label: "Projects" },
  "ta-knowledge": { bg: "bg-accent/15", text: "text-accent", label: "Knowledge Doc" },
  "ta-briefing": { bg: "bg-green/15", text: "text-green", label: "Briefing" },
  "ta-synthesis": { bg: "bg-purple/15", text: "text-purple", label: "Synthesis" },
  thesis: { bg: "bg-orange/15", text: "text-orange", label: "Thesis" },
};

export default function DocRenderer({ content }: Props) {
  const { frontmatter } = content;
  const type = (frontmatter.type as string) || "unknown";
  const style = TYPE_STYLES[type] || { bg: "bg-surface2", text: "text-text-dim", label: type };
  const lastUpdated =
    (frontmatter.last_updated as string) ||
    (frontmatter.generated as string) ||
    "";

  return (
    <article>
      {/* Meta bar */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${style.bg} ${style.text}`}
        >
          {style.label}
        </span>
        {lastUpdated && (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-text-dim">
            <Calendar size={12} />
            {lastUpdated}
          </span>
        )}
        {(frontmatter.therapeutic_area as string || frontmatter.ta as string) && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-surface2 rounded text-[11px] text-text-dim">
            {(frontmatter.therapeutic_area as string) || (frontmatter.ta as string)}
          </span>
        )}
        {(frontmatter.quarter as string) && (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-text-dim">
            <Clock size={12} />
            {frontmatter.quarter as string}
          </span>
        )}
      </div>

      {/* Rendered markdown */}
      <div
        className="doc-content"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    </article>
  );
}
