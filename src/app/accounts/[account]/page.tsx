import { getNavTree } from "@/lib/content";
import AccountRedirect from "@/components/AccountRedirect";

export async function generateStaticParams() {
  const navTree = getNavTree();
  return Object.keys(navTree).map((account) => ({ account }));
}

export default function AccountPage() {
  return <AccountRedirect />;
}
