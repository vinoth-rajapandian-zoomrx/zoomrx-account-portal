"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, X } from "lucide-react";
import Fuse, { type FuseResult } from "fuse.js";
import { getSearchIndex } from "@/lib/content";
import type { SearchEntry } from "@/lib/content";

const TYPE_COLORS: Record<string, string> = {
  "account-overview": "text-blue",
  "account-whitespace": "text-red",
  "ta-knowledge": "text-accent",
  "ta-briefing": "text-green",
  "ta-synthesis": "text-purple",
  thesis: "text-orange",
};

let fuseInstance: Fuse<SearchEntry> | null = null;

function getFuse() {
  if (!fuseInstance) {
    const index = getSearchIndex();
    fuseInstance = new Fuse(index, {
      keys: [
        { name: "title", weight: 3 },
        { name: "account", weight: 2 },
        { name: "ta", weight: 2 },
        { name: "tags", weight: 1.5 },
        { name: "excerpt", weight: 1 },
      ],
      threshold: 0.35,
      includeScore: true,
    });
  }
  return fuseInstance;
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FuseResult<SearchEntry>[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cmd+K to open
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery("");
      setResults([]);
      setSelected(0);
    }
  }, [open]);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    setSelected(0);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    const fuse = getFuse();
    setResults(fuse.search(value, { limit: 12 }));
  }, []);

  function navigate(route: string) {
    setOpen(false);
    router.push(route);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && results[selected]) {
      navigate(results[selected].item.route);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={18} className="text-text-dim shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search accounts, TAs, documents..."
            className="flex-1 bg-transparent text-text text-sm outline-none placeholder:text-text-dim"
          />
          <button onClick={() => setOpen(false)} className="text-text-dim hover:text-text">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto py-2">
            {results.map((r, i) => (
              <button
                key={r.item.route}
                onClick={() => navigate(r.item.route)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                  i === selected ? "bg-accent-glow" : "hover:bg-surface2"
                }`}
              >
                <FileText
                  size={16}
                  className={`shrink-0 ${TYPE_COLORS[r.item.type] || "text-text-dim"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-text truncate">
                    {r.item.title}
                  </div>
                  <div className="text-[11px] text-text-dim truncate">
                    {r.item.path}
                  </div>
                </div>
                <span className="text-[10px] text-text-dim uppercase shrink-0">
                  {r.item.type.replace("account-", "").replace("ta-", "")}
                </span>
              </button>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="px-4 py-8 text-center text-text-dim text-sm">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[11px] text-text-dim">
          <span>
            <kbd className="px-1.5 py-0.5 bg-surface2 rounded text-[10px]">
              ↑↓
            </kbd>{" "}
            Navigate
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-surface2 rounded text-[10px]">
              ↵
            </kbd>{" "}
            Open
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-surface2 rounded text-[10px]">
              Esc
            </kbd>{" "}
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
