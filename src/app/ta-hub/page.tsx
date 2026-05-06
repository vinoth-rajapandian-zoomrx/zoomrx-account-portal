import { getContentFile } from "@/lib/content";
import DocRenderer from "@/components/DocRenderer";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import TableOfContents from "@/components/TableOfContents";

export default async function TAHubPage() {
  const content = await getContentFile("_ta_hub");

  if (!content) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">TA Knowledge Hub</h1>
        <p className="text-text-dim">Content not found.</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1 max-w-4xl">
        <BreadcrumbNav crumbs={[{ label: "TA Knowledge Hub" }]} />
        <h1 className="text-2xl font-bold mb-6">TA Knowledge Hub</h1>
        <DocRenderer content={content} />
      </div>
      <TableOfContents headings={content.headings} />
    </div>
  );
}
