'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BlogAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/blog");
  }, [router]);

  return (
    <div className="relative min-h-screen bg-[var(--door24-background)] text-[var(--door24-foreground)] flex items-center justify-center">
      <p className="text-[var(--door24-muted)]">Redirecting...</p>
    </div>
  );
}
