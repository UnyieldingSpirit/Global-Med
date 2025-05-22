"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import LoginHeader from "@/src/shared/layout/AccountHeader/LoginHeader";

const AccountSidebar = dynamic(
  () => import("../../shared/components/AccountSidebar"),
  {
    ssr: false,
  }
);

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem("authToken");
      if (!token && pathname !== "/account/login") {
        localStorage.clear();
        sessionStorage.clear();
        router.push("/account/login");
      }
    }
  }, [isClient, pathname, router]);

  if (pathname === "/account/login") {
    return <>{children}</>;
  }

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <LoginHeader />
      <div className="flex mt-4">
        {!isMobile && <AccountSidebar />}
        <main className={`flex-1 ${!isMobile ? "ml-6" : "mx-auto w-full"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
