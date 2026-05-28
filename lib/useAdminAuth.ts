"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login");
    }
  }, [router]);
}
