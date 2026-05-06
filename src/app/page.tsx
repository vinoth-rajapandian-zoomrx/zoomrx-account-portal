import Link from "next/link";
import {
  Building2,
  FlaskConical,
  ArrowRight,
  Target,
  BookOpen,
  Layers,
} from "lucide-react";
import { getNavTree, getSortedAccounts } from "@/lib/content";

const TIER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  jnj: { bg: "bg-red/15", text: "text-red", label: "Tier 1" },
  merck: { bg: "bg-red/15", text: "text-red", label: "Tier 1" },
  pfizer: { bg: "bg-red/15", text: "text-red", label: "Tier 1" },
  alnylam: { bg: "bg-red/15", text: "text-red", label: "Tier 1" },
  alkermes: { bg: "bg-red/15", text: "text-red", label: "Tier 1" },
  genmab: { bg: "bg-yellow/15", text: "text-yellow", label: "Tier 2" },
  ucb: { bg: "bg-yellow/15", text: "text-yellow", label: "Tier 2" },
  azn: { bg: "bg-yellow/15", text: "text-yellow", label: "Tier 2" },
  "emd-serono": { bg: "bg-text-dim/15", text: "text-text-dim", label: "Tier 3" },
  "novo-nordisk": { bg: "bg-text-dim/15", text: "text-text-dim", label: "Tier 3" },
};

export default function HomePage() {
  const navTree = getNavTree();
  const accounts = getSortedAccounts(navTree);
  const totalTAs = Object.values(navTree).reduce(
    (sum, a) => sum + Object.keys(a.tas).length,
    0
  );
  const totalDocs = Object.values(navTree).reduce(
    (sum, a) =>
      sum +
      a.docs.length +
      Object.values(a.tas).reduce((s, ta) => s + ta.docs.length, 0),
    0
  );

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold mb-3">Account Intelligence Hub</h1>
        <div className="bg-surface border-l-4 border-l-accent py-4 px-5 rounded-r-lg text-[14px] leading-[1.7] text-text-dim">
          Single source of truth for account knowledge and TA market intelligence
          across the ZoomRx consulting portfolio.
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface2 rounded-xl p-5 text-center">
          <div className="text-[32px] font-bold text-accent">{accounts.length}</div>
          <div className="text-[12px] text-text-dim uppercase tracking-wide mt-1">
            Accounts
          </div>
        </div>
        <div className="bg-surface2 rounded-xl p-5 text-center">
          <div className="text-[32px] font-bold text-accent">{totalTAs}</div>
          <div className="text-[12px] text-text-dim uppercase tracking-wide mt-1">
            Therapeutic Areas
          </div>
        </div>
        <div className="bg-surface2 rounded-xl p-5 text-center">
          <div className="text-[32px] font-bold text-accent">{totalDocs}</div>
          <div className="text-[12px] text-text-dim uppercase tracking-wide mt-1">
            Documents
          </div>
        </div>
        <div className="bg-surface2 rounded-xl p-5 text-center">
          <div className="text-[32px] font-bold text-green">5</div>
          <div className="text-[12px] text-text-dim uppercase tracking-wide mt-1">
            Full-Service Accounts
          </div>
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Link
          href="/ta-hub"
          className="flex items-center gap-4 p-5 bg-surface border border-border rounded-xl hover:border-accent transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
            <FlaskConical size={20} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold group-hover:text-accent transition-colors">
              TA Knowledge Hub
            </div>
            <div className="text-[12px] text-text-dim">
              Cross-account TA market intelligence
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-text-dim group-hover:text-accent transition-colors shrink-0"
          />
        </Link>
        <Link
          href="/accounts/jnj/overview"
          className="flex items-center gap-4 p-5 bg-surface border border-border rounded-xl hover:border-accent transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-red/15 flex items-center justify-center shrink-0">
            <Target size={20} className="text-red" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold group-hover:text-accent transition-colors">
              J&J — #1 Priority
            </div>
            <div className="text-[12px] text-text-dim">
              MSL / MEE workstream
            </div>
          </div>
          <ArrowRight
            size={16}
            className="text-text-dim group-hover:text-accent transition-colors shrink-0"
          />
        </Link>
      </div>

      {/* Account Table */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-[20px] font-semibold mb-4 pb-3 border-b border-border">
          Accounts
        </h2>
        <table className="w-full text-[13px]">
          <thead>
            <tr>
              <th className="text-left text-[12px] text-text-dim font-semibold uppercase tracking-wide py-3 px-4 bg-surface2 first:rounded-tl-lg last:rounded-tr-lg border-b-2 border-border">
                Account
              </th>
              <th className="text-left text-[12px] text-text-dim font-semibold uppercase tracking-wide py-3 px-4 bg-surface2 border-b-2 border-border">
                Tier
              </th>
              <th className="text-left text-[12px] text-text-dim font-semibold uppercase tracking-wide py-3 px-4 bg-surface2 border-b-2 border-border">
                Therapeutic Areas
              </th>
              <th className="text-center text-[12px] text-text-dim font-semibold uppercase tracking-wide py-3 px-4 bg-surface2 border-b-2 border-border">
                Docs
              </th>
              <th className="text-center text-[12px] text-text-dim font-semibold uppercase tracking-wide py-3 px-4 bg-surface2 border-b-2 border-border">
                TA Files
              </th>
              <th className="text-left text-[12px] text-text-dim font-semibold uppercase tracking-wide py-3 px-4 bg-surface2 last:rounded-tr-lg border-b-2 border-border">
                Quick Links
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => {
              const tier = TIER_COLORS[account.slug] || {
                bg: "bg-text-dim/15",
                text: "text-text-dim",
                label: "—",
              };
              const taList = Object.values(account.tas);
              const taFileCount = taList.reduce(
                (s, ta) => s + ta.docs.length,
                0
              );
              return (
                <tr
                  key={account.slug}
                  className="group hover:bg-accent-glow/50 transition-colors"
                >
                  <td className="py-3 px-4 border-b border-border">
                    <Link
                      href={`/accounts/${account.slug}/overview`}
                      className="flex items-center gap-2 font-medium text-text hover:text-accent transition-colors"
                    >
                      <Building2 size={15} className="text-accent shrink-0" />
                      {account.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 border-b border-border">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${tier.bg} ${tier.text}`}
                    >
                      {tier.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-border">
                    <div className="flex flex-wrap gap-1.5">
                      {taList.length > 0 ? (
                        taList.map((ta) => (
                          <Link
                            key={ta.slug}
                            href={`/accounts/${account.slug}/ta/${ta.slug}`}
                            className="px-2 py-0.5 bg-surface2 hover:bg-accent/15 rounded text-[11px] text-text-dim hover:text-accent transition-colors"
                          >
                            {ta.name}
                          </Link>
                        ))
                      ) : (
                        <span className="text-text-dim text-[11px] opacity-40">
                          —
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-border text-center text-text-dim">
                    {account.docs.length}
                  </td>
                  <td className="py-3 px-4 border-b border-border text-center text-text-dim">
                    {taFileCount || "—"}
                  </td>
                  <td className="py-3 px-4 border-b border-border">
                    <div className="flex gap-2">
                      {account.docs.some((d) => d.slug === "overview") && (
                        <Link
                          href={`/accounts/${account.slug}/overview`}
                          className="flex items-center gap-1 text-[11px] text-text-dim hover:text-accent transition-colors"
                        >
                          <Layers size={12} />
                          Overview
                        </Link>
                      )}
                      {account.docs.some((d) => d.slug === "whitespace") && (
                        <Link
                          href={`/accounts/${account.slug}/whitespace`}
                          className="flex items-center gap-1 text-[11px] text-text-dim hover:text-accent transition-colors"
                        >
                          <BookOpen size={12} />
                          Whitespace
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
