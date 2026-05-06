import { notFound } from "next/navigation";
import { getContentFile, getNavTree } from "@/lib/content";
import DocRenderer from "@/components/DocRenderer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import TableOfContents from "@/components/TableOfContents";

const ACCOUNT_NAMES: Record<string, string> = {
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

const TA_NAMES: Record<string, string> = {
  lung: "Lung",
  gu: "GU",
  hematology: "Hematology",
  immunology: "Immunology",
  neuroscience: "Neuroscience",
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

const DOC_NAMES: Record<string, string> = {
  knowledge_doc: "Knowledge Doc",
  thesis: "Thesis",
  synthesis_latest: "Synthesis",
  briefing_latest: "Latest Briefing",
};

export async function generateStaticParams() {
  const navTree = getNavTree();
  const params: Array<{ account: string; ta: string; doc: string }> = [];
  Object.entries(navTree).forEach(([account, data]) => {
    Object.entries(data.tas).forEach(([ta, taData]) => {
      taData.docs.forEach((doc) => {
        params.push({ account, ta, doc: doc.slug });
      });
    });
  });
  return params;
}

export default async function TADocPage({
  params,
}: {
  params: Promise<{ account: string; ta: string; doc: string }>;
}) {
  const { account, ta, doc } = await params;
  const content = await getContentFile(account, "ta", ta, doc);

  if (!content) notFound();

  const accountName = ACCOUNT_NAMES[account] || account;
  const taName = TA_NAMES[ta] || ta;
  const docName = DOC_NAMES[doc] || doc.replace(/_/g, " ");

  return (
    <div className="flex">
      <div className="flex-1 max-w-4xl">
        <BreadcrumbNav
          crumbs={[
            { label: "Accounts", href: "/" },
            { label: accountName, href: `/accounts/${account}/overview` },
            {
              label: taName,
              href: `/accounts/${account}/ta/${ta}`,
            },
            { label: docName },
          ]}
        />
        <h1 className="text-2xl font-bold mb-6">
          {accountName} — {taName} — {docName}
        </h1>
        <DocRenderer content={content} />
      </div>
      <TableOfContents headings={content.headings} />
    </div>
  );
}
