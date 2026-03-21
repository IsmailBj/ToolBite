"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function LocalizedLink({ href, children, ...props }: any) {
  const params = useParams();
  const locale = params?.locale || "en";

  const finalHref =
    href.startsWith("/") && !href.startsWith(`/${locale}`)
      ? `/${locale}${href}`
      : href;

  return (
    <Link href={finalHref} {...props}>
      {children}
    </Link>
  );
}
