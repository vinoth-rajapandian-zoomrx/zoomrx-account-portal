"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type Crumb = {
  label: string;
  href?: string;
};

type Props = {
  crumbs: Crumb[];
};

export default function BreadcrumbNav({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-text-dim mb-6">
      <Link
        href="/"
        className="hover:text-accent transition-colors flex items-center"
      >
        <Home size={14} />
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-border" />
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="hover:text-accent transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-text font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
