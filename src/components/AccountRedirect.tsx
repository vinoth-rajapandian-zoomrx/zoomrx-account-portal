"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AccountRedirect() {
  const router = useRouter();
  const { account } = useParams<{ account: string }>();

  useEffect(() => {
    router.replace(`/accounts/${account}/overview`);
  }, [account, router]);

  return null;
}
