'use client';

import { usePathname } from 'next/navigation';
import { TopBar } from '../TopBar/TopBar';
import { Footer } from '../Footer/Footer';
import Breadcrumbs from '../../components/Breadcrumbs';
import { ThemeToggle } from '../../components/ThemeToggle';
import { Route } from '../../config/routes';
import { useLanguageStore } from '@/src/store/language';

interface ClientLayoutProps {
  children: React.ReactNode;
  routes: Route[];
}

export default function ClientLayout({ children, routes }: ClientLayoutProps) {
  const pathname = usePathname();
  const { currentLocale } = useLanguageStore();

  const hideHeaderFooter = pathname?.startsWith('/account');

  return (
    <div className="mx-auto max-w-8xl p-4">
      {!hideHeaderFooter && (
        <header id="page-header">
          <TopBar routes={routes} />
        </header>
      )}

      {!hideHeaderFooter && (
        <Breadcrumbs locale={currentLocale} routes={routes} />
      )}

      <main className="min-h-screen">{children}</main>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
