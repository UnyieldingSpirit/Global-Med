"use client";

import Link from "next/link";
import { useThemeStore } from "@/src/store/theme";
import { useLanguageStore } from "@/src/store/language";
import { useTranslation } from "@/src/hooks/useTranslation";
import {
  LocationIconk2,
  LogoIcon,
  LogoTextIcon,
  WebsiteIcon,
} from "@/src/shared/ui/Icon";

const translations = {
  ru: {
    backToMainSite: "Перейти на основной сайт",
  },
  uz: {
    backToMainSite: "Asosiy saytga o'tish",
  },
};

export default function AccountHeader() {
  const { theme } = useThemeStore();
  const { t } = useTranslation(translations);

  return (
    <header className="w-full">
      <div
        className={`max-w-[1560px] rounded-2xl ${
          theme === "light" ? "bg-light-block" : "bg-dark-block"
        } px-8 py-6 flex justify-between items-center`}
      >
        <Link href="/account" className="flex items-center gap-1 sm:gap-2">
          <LogoIcon size={40} />
          <LogoTextIcon
            size={90}
            color={theme === "light" ? "#094A54" : "white"}
          />
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-4 bg-[#00C78B] text-white rounded-xl sm:rounded-2xl hover:bg-[#00C78B]/90 transition-colors"
        >
          <LocationIconk2
            size={20}
            className="sm:w-[24px] sm:h-[24px]"
            color="white"
          />
          <span className="text-[14px] sm:text-[18px] whitespace-nowrap">
            {t("backToMainSite")}
          </span>
        </Link>
      </div>
    </header>
  );
}
