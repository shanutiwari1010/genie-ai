"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hasHydrated) return;

    const isOnAuthPage = pathname.startsWith("/auth");

    if (!isAuthenticated && !isOnAuthPage) {
      router.replace("/auth");
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated) return null;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
