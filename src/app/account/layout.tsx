'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import AccountSidebar from "../../shared/components/AccountSidebar";
import LoginHeader from "@/src/shared/layout/AccountHeader/LoginHeader";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  if (pathname === '/account/login') {
    return <>{children}</>;
  }
  
  return (
    <div>
      <LoginHeader />
      <div className="flex mt-4">
        {!isMobile && <AccountSidebar />}
        <main className={`flex-1 ${!isMobile ? 'ml-6' : 'mx-auto w-full'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}