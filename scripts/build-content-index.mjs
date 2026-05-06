// Build-time script: Parse all clients .md files and generate:
// - content/nav.json (navigation tree)
// - content/index.json (search index)
// - content/files/*.json (pre-rendered HTML per file)

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";

const CLIENTS_DIR = path.resolve(process.cwd(), "..", "");
const OUTPUT_DIR = path.resolve(process.cwd(), "src", "content");

// Account display names
const ACCOUNT_NAMES = {
  jnj: "Johnson & Johnson",
  pfizer: "Pfizer",
  merck: "Merck",
  alnylam: "Alnylam",
  alkermes: "Alkermes",
  genmab: "Genmab",
  ucb: "UCB",
  azn: "AstraZeneca",
  "emd-serono": "EMD Serono",
  "novo-nordisk": "Novo Nordisk",
  novartis: "Novartis",
  exelixis: "Exelixis",
  takeda: "Takeda",
};

// Doc type display names
const DOC_NAMES = {
  overview: "Overview",
  contacts: "Contacts",
  financials: "Financials",
  relationships: "Relationships",
  whitespace: "White Space",
  projects: "Projects",
  knowledge_doc: "Knowledge Doc",
  thesis: "Thesis",
  synthesis_latest: "Synthesis",
  briefing_latest: "Latest Briefing",
};

// TA display names
const TA_NAMES = {
  lung: "Lung",
  gu: "GU",
  hematology: "Hematology",
  immunology: "Immunology",
  neuroscience: "Neuroscience",
  neuro: "Neuroscience",
  oncology: "Oncology",
  vaccines: "Vaccines",
  psychiatry: "Psychiatry",
  ahp: "AHP",
  attr: "ATTR",
  ph: "PH",
  epilepsy: "Epilepsy",
  gmg: "gMG",
  hiv: "HIV",
  rsv: "RSV",
  transplant: "Transplant",
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeStringify, { allowDangerousHtml: true });

function getAllMarkdownFiles(dir, base = "") {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip portal, _dashboard, node_modules
      if (
        ["portal", "_dashboard", "node_modules", ".git", ".next"].includes(
          entry.name
        )
      )
        continue;
      files.push(...getAllMarkdownFiles(full, rel));
    } else if (entry.name.endsWith(".md")) {
      files.push({ rel: rel.replace(/\\/g, "/"), full });
    }
  }
  return files;
}

function resolveWikiLinks(html) {
  // Convert [[path|label]] or [[path]] to portal links
  return html.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, linkPath, label) => {
    const display = label || linkPath.split("/").pop();
    // Convert clients-relative path to portal route
    const route = linkPathToRoute(linkPath.trim());
    return `<a href="${route}" class="wiki-link">${display}</a>`;
  });
}

function linkPathToRoute(linkPath) {
  // Remove .md extension if present
  let p = linkPath.replace(/\.md$/, "");
  // Handle hub-level files
  if (p.startsWith("_")) return "/";
  // Handle account/ta paths
  const parts = p.split("/");
  if (parts.length >= 1) {
    return `/accounts/${parts.join("/")}`;
  }
  return `/accounts/${p}`;
}

function fileToRoute(rel) {
  // Convert relative file path to portal route
  // e.g. "jnj/overview.md" -> "/accounts/jnj/overview"
  // e.g. "jnj/ta/lung/knowledge_doc.md" -> "/accounts/jnj/ta/lung/knowledge_doc"
  // e.g. "_hub.md" -> "/"
  const p = rel.replace(/\.md$/, "");
  if (p.startsWith("_")) return "/";
  return `/accounts/${p}`;
}

function extractTitle(frontmatter, rel) {
  // Derive title from frontmatter or file path
  const parts = rel.replace(/\.md$/, "").split("/");
  const fileName = parts[parts.length - 1];

  if (frontmatter.type === "moc") return "Hub";

  // Account-level files
  if (parts.length === 2 && !parts.includes("ta")) {
    const account = ACCOUNT_NAMES[parts[0]] || parts[0];
    const docName = DOC_NAMES[fileName] || fileName;
    return `${account} — ${docName}`;
  }

  // TA files
  if (parts.includes("ta") && parts.length >= 4) {
    const account = ACCOUNT_NAMES[parts[0]] || parts[0];
    const taIdx = parts.indexOf("ta");
    const ta = TA_NAMES[parts[taIdx + 1]] || parts[taIdx + 1];
    const docName = DOC_NAMES[fileName] || fileName.replace(/_/g, " ");
    return `${account} — ${ta} — ${docName}`;
  }

  return fileName.replace(/_/g, " ");
}

function extractHeadings(html) {
  const headings = [];
  const regex = /<h([2-3])\s+id="([^"]*)"[^>]*>([^<]*(?:<[^>]+>[^<]*)*)<\/h[2-3]>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    // Strip inner HTML tags for clean text
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    headings.push({ level: parseInt(match[1]), id: match[2], text });
  }
  return headings;
}

async function buildIndex() {
  console.log(`Scanning ${CLIENTS_DIR} for markdown files...`);

  const files = getAllMarkdownFiles(CLIENTS_DIR);
  console.log(`Found ${files.length} markdown files`);

  // Ensure output dirs exist
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, "files"), { recursive: true });

  const searchIndex = [];
  const navTree = {};
  const wikiLinkMap = {};

  for (const { rel, full } of files) {
    const raw = fs.readFileSync(full, "utf-8");
    const { data: frontmatter, content } = matter(raw);

    // Render markdown to HTML
    const vfile = await processor.process(content);
    let html = String(vfile);

    // Resolve wiki-links
    html = resolveWikiLinks(html);

    const route = fileToRoute(rel);
    const title = extractTitle(frontmatter, rel);
    const headings = extractHeadings(html);

    // Build wiki-link map (for resolving [[links]])
    const pathKey = rel.replace(/\.md$/, "");
    wikiLinkMap[pathKey] = route;
    // Also map just the filename
    const fileName = pathKey.split("/").pop();
    if (!wikiLinkMap[fileName]) wikiLinkMap[fileName] = route;

    // Write per-file JSON
    const fileParts = rel.replace(/\.md$/, "").split("/");
    const outDir = path.join(OUTPUT_DIR, "files", ...fileParts.slice(0, -1));
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(
      OUTPUT_DIR,
      "files",
      ...fileParts.slice(0, -1),
      fileParts[fileParts.length - 1] + ".json"
    );

    fs.writeFileSync(
      outFile,
      JSON.stringify({
        title,
        frontmatter,
        html,
        headings,
        route,
        path: rel,
        lastModified: fs.statSync(full).mtime.toISOString(),
      })
    );

    // Add to search index
    searchIndex.push({
      title,
      route,
      path: rel,
      type: frontmatter.type || "unknown",
      account: frontmatter.account || frontmatter.client || "",
      ta: frontmatter.therapeutic_area || frontmatter.ta || "",
      tags: frontmatter.tags || [],
      lastUpdated: frontmatter.last_updated || frontmatter.generated || "",
      excerpt: content.substring(0, 500).replace(/\n/g, " "),
    });

    // Build nav tree
    buildNavEntry(navTree, rel, frontmatter, title);
  }

  // Write search index
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "index.json"),
    JSON.stringify(searchIndex, null, 2)
  );

  // Write nav tree
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "nav.json"),
    JSON.stringify(navTree, null, 2)
  );

  // Write wiki-link map
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "wiki-links.json"),
    JSON.stringify(wikiLinkMap, null, 2)
  );

  console.log(
    `\nBuild complete:
  - ${searchIndex.length} files indexed
  - ${Object.keys(navTree).length} accounts in nav tree
  - Output: ${OUTPUT_DIR}`
  );
}

function buildNavEntry(tree, rel, frontmatter, title) {
  const parts = rel.replace(/\.md$/, "").split("/");

  // Skip hub-level files (handled separately)
  if (parts[0].startsWith("_")) return;

  const accountSlug = parts[0];
  if (!tree[accountSlug]) {
    tree[accountSlug] = {
      name: ACCOUNT_NAMES[accountSlug] || accountSlug,
      slug: accountSlug,
      docs: [],
      tas: {},
    };
  }

  const account = tree[accountSlug];

  if (parts.length === 2 && !parts.includes("ta")) {
    // Account-level doc
    const docSlug = parts[1];
    account.docs.push({
      slug: docSlug,
      name: DOC_NAMES[docSlug] || docSlug,
      route: `/accounts/${accountSlug}/${docSlug}`,
      type: frontmatter.type || "unknown",
    });
  } else if (parts.includes("ta") && parts.length >= 4) {
    // TA doc
    const taIdx = parts.indexOf("ta");
    const taSlug = parts[taIdx + 1];

    if (!account.tas[taSlug]) {
      account.tas[taSlug] = {
        name: TA_NAMES[taSlug] || taSlug,
        slug: taSlug,
        docs: [],
      };
    }

    const docSlug = parts.slice(taIdx + 2).join("/");
    account.tas[taSlug].docs.push({
      slug: docSlug,
      name: DOC_NAMES[docSlug] || docSlug.replace(/_/g, " "),
      route: `/accounts/${accountSlug}/ta/${taSlug}/${docSlug}`,
      type: frontmatter.type || "unknown",
    });
  }
}

buildIndex().catch(console.error);
