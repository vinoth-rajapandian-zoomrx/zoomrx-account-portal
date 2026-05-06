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

export async function generateStaticParams() {
  const navTree = getNavTree();
  const params: Array<{ account: string; slug: string }> = [];
  Object.entries(navTree).forEach(([account, data]) => {
    data.docs.forEach((doc) => {
      params.push({ account, slug: doc.slug });
    });
  });
  return params;
}

export default async function AccountDocPage({
  params,
}: {
  params: Promise<{ account: string; slug: string }>;
}) {
  const { account, slug } = await params;
  const content = await getContentFile(account, slug);

  if (!content) notFound();

  const accountName = ACCOUNT_NAMES[account] || account;

  return (
    <div className="flex">
      <div className="flex-1 max-w-4xl">
        <BreadcrumbNav
          crumbs={[
            { label: "Accounts", href: "/" },
            { label: accountName, href: `/accounts/${account}/overview` },
            { label: content.title.split(" — ").pop() || slug },
          ]}
        />
        <h1 className="text-2xl font-bold mb-6">{content.title}</h1>
        <DocRenderer content={content} />
      </div>
      <TableOfContents headings={content.headings} />
    </div>
  );
}
