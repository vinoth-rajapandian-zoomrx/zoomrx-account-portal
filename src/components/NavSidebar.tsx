"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  FlaskConical,
  ChevronRight,
  LayoutDashboard,
  Target,
  Users,
  DollarSign,
  Handshake,
  Grid3X3,
  BookOpen,
  Lightbulb,
  BarChart3,
  Newspaper,
} from "lucide-react";
import { getNavTree, getSortedAccounts, getSortedDocs } from "@/lib/content";
import type { NavAccount } from "@/lib/content";

const DOC_ICONS: Record<string, React.ReactNode> = {
  overview: <LayoutDashboard size={15} />,
  contacts: <Users size={15} />,
  financials: <DollarSign size={15} />,
  relationships: <Handshake size={15} />,
  whitespace: <Grid3X3 size={15} />,
  projects: <Target size={15} />,
};

const TA_DOC_ICONS: Record<string, React.ReactNode> = {
  knowledge_doc: <BookOpen size={14} />,
  thesis: <Lightbulb size={14} />,
  synthesis_latest: <BarChart3 size={14} />,
  briefing_latest: <Newspaper size={14} />,
};

function AccountNode({ account }: { account: NavAccount }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(
    pathname.startsWith(`/accounts/${account.slug}`)
  );
  const [taExpanded, setTaExpanded] = useState<Record<string, boolean>>({});
  const isActive = pathname.startsWith(`/accounts/${account.slug}`);
  const sortedDocs = getSortedDocs(account.docs);
  const taList = Object.values(account.tas);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-2 w-full px-5 py-2 text-sm transition-all border-l-[3px] ${
          isActive
            ? "bg-accent-glow text-accent border-l-accent font-semibold"
            : "text-text-dim border-l-transparent hover:bg-accent-glow hover:text-text"
        }`}
      >
        <ChevronRight
          size={14}
          className={`transition-transform shrink-0 ${expanded ? "rotate-90" : ""}`}
        />
        <Building2 size={15} className="shrink-0" />
        <span className="truncate">{account.name}</span>
      </button>

      {expanded && (
        <div className="ml-3">
          {/* Account-level docs */}
          {sortedDocs.map((doc) => (
            <Link
              key={doc.slug}
              href={doc.route}
              className={`flex items-center gap-2 px-5 py-1.5 text-[13px] transition-all border-l-[3px] ${
                pathname === doc.route
                  ? "bg-accent-glow text-accent border-l-accent font-semibold"
                  : "text-text-dim border-l-transparent hover:bg-accent-glow hover:text-text"
              }`}
            >
              {DOC_ICONS[doc.slug] || <FileText size={15} />}
              <span>{doc.name}</span>
            </Link>
          ))}

          {/* TA sections */}
          {taList.length > 0 && (
            <div className="mt-1">
              <div className="px-5 py-1.5 text-[11px] font-semibold text-text-dim uppercase tracking-wider">
                Therapeutic Areas
              </div>
              {taList.map((ta) => {
                const taOpen = taExpanded[ta.slug] ??
                  pathname.includes(`/ta/${ta.slug}`);
                return (
                  <div key={ta.slug}>
                    <button
                      onClick={() =>
                        setTaExpanded((prev) => ({
                          ...prev,
                          [ta.slug]: !taOpen,
                        }))
                      }
                      className={`flex items-center gap-2 w-full px-5 py-1.5 text-[13px] transition-all border-l-[3px] ${
                        pathname.includes(`/ta/${ta.slug}`)
                          ? "text-accent border-l-accent"
                          : "text-text-dim border-l-transparent hover:text-text"
                      }`}
                    >
                      <ChevronRight
                        size={12}
                        className={`transition-transform shrink-0 ${taOpen ? "rotate-90" : ""}`}
                      />
                      <FlaskConical size={14} className="shrink-0" />
                      <span>{ta.name}</span>
                    </button>
                    {taOpen && (
                      <div className="ml-5">
                        {ta.docs
                          .filter((d) => !d.slug.startsWith("briefing_Q"))
                          .map((doc) => (
                            <Link
                              key={doc.slug}
                              href={doc.route}
                              className={`flex items-center gap-2 px-5 py-1 text-[12px] transition-all border-l-[3px] ${
                                pathname === doc.route
                                  ? "bg-accent-glow text-accent border-l-accent font-semibold"
                                  : "text-text-dim border-l-transparent hover:text-text"
                              }`}
                            >
                              {TA_DOC_ICONS[doc.slug] || <FileText size={13} />}
                              <span>{doc.name}</span>
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function NavSidebar() {
  const pathname = usePathname();
  const navTree = getNavTree();
  const accounts = getSortedAccounts(navTree);

  return (
    <aside className="app-sidebar">
      {/* Hub links */}
      <div className="py-2">
        <div className="px-5 py-2 text-[11px] font-semibold text-text-dim uppercase tracking-wider">
          Hub
        </div>
        <Link
          href="/"
          className={`flex items-center gap-2 px-5 py-2 text-sm transition-all border-l-[3px] ${
            pathname === "/"
              ? "bg-accent-glow text-accent border-l-accent font-semibold"
              : "text-text-dim border-l-transparent hover:bg-accent-glow hover:text-text"
          }`}
        >
          <LayoutDashboard size={16} />
          <span>Portfolio</span>
        </Link>
        <Link
          href="/ta-hub"
          className={`flex items-center gap-2 px-5 py-2 text-sm transition-all border-l-[3px] ${
            pathname === "/ta-hub"
              ? "bg-accent-glow text-accent border-l-accent font-semibold"
              : "text-text-dim border-l-transparent hover:bg-accent-glow hover:text-text"
          }`}
        >
          <FlaskConical size={16} />
          <span>TA Knowledge</span>
        </Link>
      </div>

      {/* Accounts */}
      <div className="py-2 border-t border-border">
        <div className="px-5 py-2 text-[11px] font-semibold text-text-dim uppercase tracking-wider">
          Accounts
        </div>
        {accounts.map((account) => (
          <AccountNode key={account.slug} account={account} />
        ))}
      </div>
    </aside>
  );
}
