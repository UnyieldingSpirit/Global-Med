"use client";

import React, { Suspense, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Route } from "@/src/shared/config/routes";
import { GBContext } from "@/src/context/globalize-breadcrumb";

interface BreadcrumbsProps {
  className?: string;
  separator?: React.ReactNode;
  hideHome?: boolean;
  hideCurrent?: boolean;
  locale: "uz" | "ru";
  routes: Route[];
}

const translations = {
  uz: {
    home: "Bosh sahifa",
    labels: {
      services: "Xizmatlar",
      checkups: "Tekshiruvlar",
      analysis: "Tahlillar",
      partners: "Hamkorlar",
      clinic: "Klinika haqida",
      contacts: "Bogʻlanish",
      doctors: "Shifokorlar",
      dietolog: "Diyetolog",
      checkup: "Tekshiruv",
      service: "Xizmat",
      doctor: "Shifokor",
      partner: "Hamkor",
      contact: "Bogʻlanish",
      analysis_detail: "Tahlil",
    },
  },
  ru: {
    home: "Главная",
    labels: {
      services: "Услуги",
      checkups: "Чекапы",
      analysis: "Анализы",
      partners: "Партнёры",
      clinic: "О клинике",
      contacts: "Контакты",
      doctors: "Врачи",
      dietolog: "Диетолог",
      checkup: "Чекап",
      service: "Услуга",
      doctor: "Врач",
      partner: "Партнёр",
      contact: "Контакты",
      analysis_detail: "Анализ",
    },
  },
};

function BreadcrumbsContent({
  className = "",
  separator = <ChevronRightIcon className="h-4 w-4 text-gray-400" />,
  hideHome = false,
  hideCurrent = false,
  locale,
  routes,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const { title }: any = useContext(GBContext);
  if (!pathname || !(locale in translations)) return null;

  const supportedLocales = ["uz", "ru"];
  const localePrefix = `/${locale}`;
  const cleanedPath = pathname.startsWith(localePrefix)
    ? pathname.slice(localePrefix.length)
    : pathname;

  const segments = cleanedPath
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      const pathWithoutLocale = "/" + array.slice(0, index + 1).join("/");
      const fullPath = `${localePrefix}${pathWithoutLocale}`;

      // 🔽 Avval asosiy route dan izlaymiz
      let route = routes.find((r) => r.path === pathWithoutLocale);

      // 🔽 Agar topilmasa, submenuItems dan izlaymiz
      if (!route) {
        for (const r of routes) {
          if (r.hasSubmenu && Array.isArray((r as any).submenuItems)) {
            const submenuMatch = (r as any).submenuItems.find(
              (sub: any) => sub.path === pathWithoutLocale
            );
            if (submenuMatch) {
              route = submenuMatch;
              break;
            }
          }
        }
      }

      const key = route?.translationKey;
      const labelMap = translations[locale]?.labels ?? {};

      // Check if this is the last segment of a checkup details page
      const isLastSegmentOfCheckup =
        index === array.length - 1 &&
        pathWithoutLocale.includes("/checkups/") &&
        pathWithoutLocale !== "/checkups";

      const name =
        isLastSegmentOfCheckup && title
          ? title
          : key && key in labelMap
          ? labelMap[key]
          : decodeURIComponent(segment)
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase());

      return { path: fullPath, name };
    });

  if (!hideHome) {
    const homeName = translations[locale]?.home ?? "Home";
    segments.unshift({ path: localePrefix, name: homeName });
  }
  if (segments.length === 1 && segments[0].path === localePrefix) {
    return null;
  }
  if (hideCurrent && segments.length > 0) {
    segments.pop();
  }

  return (
    <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
      <ol className="flex flex-wrap items-center mt-10 mb-10 space-x-2 text-gray-500 dark:text-gray-400">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <React.Fragment key={segment.path}>
              <li className="flex items-center">
                {isLast ? (
                  (pathname.includes("/checkups/") &&
                    pathname !== "/checkups") ||
                  (pathname.includes("/analysis/") &&
                    pathname !== "/analysis") ||
                  (pathname.includes("/services/") &&
                    pathname !== "/services") ||
                  (pathname.includes("/doctors/") &&
                    pathname !== "/doctors") ? (
                    <span className="text-gray-900 dark:text-white">
                      {title?.name || title || segment.name}
                    </span>
                  ) : (
                    <span className="text-gray-900 dark:text-white">
                      {segment.name}
                    </span>
                  )
                ) : (
                  <Link
                    href={segment.path.replace(`/${locale}`, "") || "/"}
                    className="hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {segment.name}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li className="flex items-center" aria-hidden="true">
                  {separator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <Suspense fallback={<div className="py-4">Загрузка...</div>}>
      <BreadcrumbsContent {...props} />
    </Suspense>
  );
}
