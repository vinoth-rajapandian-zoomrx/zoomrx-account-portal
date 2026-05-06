"use client";

import { Search } from "lucide-react";

export default function Header() {
  return (
    <header className="app-header">
      <div className="text-[18px] font-bold text-accent whitespace-nowrap">
        ZoomRx
        <span className="text-text-dim font-normal text-[14px] ml-2">
          Knowledge Portal
        </span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <button
          onClick={() => {
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true })
            );
          }}
          className="flex items-center gap-2.5 px-3.5 py-1.5 bg-bg border border-border rounded-lg text-text-dim text-[13px] hover:border-text-dim transition-colors cursor-pointer"
        >
          <Search size={14} />
          <span>Search...</span>
          <kbd className="ml-3 px-1.5 py-0.5 bg-surface2 rounded text-[10px] font-semibold">
            Ctrl K
          </kbd>
        </button>
        <span className="text-text-dim text-[12px]">
          {new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </header>
  );
}
