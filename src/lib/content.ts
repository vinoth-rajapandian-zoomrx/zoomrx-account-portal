import navData from "@/content/nav.json";
import searchData from "@/content/index.json";

export type NavDoc = {
  slug: string;
  name: string;
  route: string;
  type: string;
};

export type NavTA = {
  name: string;
  slug: string;
  docs: NavDoc[];
};

export type NavAccount = {
  name: string;
  slug: string;
  docs: NavDoc[];
  tas: Record<string, NavTA>;
};

export type NavTree = Record<string, NavAccount>;

export type SearchEntry = {
  title: string;
  route: string;
  path: string;
  type: string;
  account: string;
  ta: string;
  tags: string[];
  lastUpdated: string;
  excerpt: string;
};

export type ContentFile = {
  title: string;
  frontmatter: Record<string, unknown>;
  html: string;
  headings: { level: number; id: string; text: string }[];
  route: string;
  path: string;
  lastModified: string;
};

export function getNavTree(): NavTree {
  return navData as NavTree;
}

export function getSearchIndex(): SearchEntry[] {
  return searchData as SearchEntry[];
}

export async function getContentFile(
  ...pathParts: string[]
): Promise<ContentFile | null> {
  try {
    const mod = await import(
      `@/content/files/${pathParts.join("/")}.json`
    );
    return mod.default as ContentFile;
  } catch {
    return null;
  }
}

// Account ordering: tier 1 first
const ACCOUNT_ORDER = [
  "jnj",
  "merck",
  "pfizer",
  "alnylam",
  "alkermes",
  "genmab",
  "ucb",
  "azn",
  "emd-serono",
  "novo-nordisk",
  "novartis",
  "exelixis",
  "takeda",
];

export function getSortedAccounts(tree: NavTree): NavAccount[] {
  return ACCOUNT_ORDER.filter((slug) => tree[slug]).map((slug) => tree[slug]);
}

// Doc ordering within an account
const DOC_ORDER = [
  "overview",
  "relationships",
  "financials",
  "contacts",
  "whitespace",
  "projects",
];

export function getSortedDocs(docs: NavDoc[]): NavDoc[] {
  return [...docs].sort((a, b) => {
    const ai = DOC_ORDER.indexOf(a.slug);
    const bi = DOC_ORDER.indexOf(b.slug);
    if (ai === -1 && bi === -1) return a.slug.localeCompare(b.slug);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}
