/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useThemeStore } from "@/src/store/theme";
import { useTranslation } from "@/src/hooks/useTranslation";
import { UniversalCard } from "../components/UniversalCard";
import { applyColorToIcon, getIconColorByTheme } from "../utils/iconUtils";
import {
  CalculatorIcon,
  HealthPlusIcon,
  HeartDoubleIcon,
  StethoscopeIconk2,
} from "../ui/Icon";
import MobileDeviceIcon from "../ui/Icon/MobileDeviceIcon";

// Переводы для компонента
const translations = {
  ru: {
    title: "Клиника, где заботятся о вашем здоровье",
    description:
      "Мы объединяем передовые медицинские технологии, комфортные условия и команду опытных специалистов, чтобы обеспечивать качественное лечение каждому пациенту",
    readMore: "Подробнее О клинике",
    benefits: [
      {
        id: "inpatient",
        title: "Стационарное лечение",
        subtitle: "",
        description:
          "Комфортные палаты, круглосуточный уход и индивидуальный подход к каждому пациенту",
        iconPath: <MobileDeviceIcon />,
      },
      {
        id: "venography",
        title: "Рентген вен",
        subtitle: "",
        description:
          "Одна из первых клиник, где доступна передовая диагностика сосудов с высокой точностью",
        iconPath: <StethoscopeIconk2 />,
      },
      {
        id: "spring-water",
        title: "Родниковая и редчайшая вода",
        subtitle: "",
        description:
          "Используем чистую природную воду с уникальным составом для оздоровительных программ",
        iconPath: <HeartDoubleIcon />,
      },
      {
        id: "high-level",
        title: "Высокий уровень медицины",
        subtitle: "",
        description:
          "Современное оборудование, экспертная команда и качественное обслуживание для вашего здоровья",
        iconPath: <HealthPlusIcon />,
      },
    ],
  },
  uz: {
    title: "Sog'lig'ingiz haqida g'amxo'rlik qiladigan klinika",
    description:
      "Biz ilg'or tibbiy texnologiyalar, qulay sharoitlar va tajribali mutaxassislar jamoasini birlashtirgan holda har bir bemorga sifatli davolashni ta'minlaymiz",
    readMore: "Klinika haqida batafsil",
    benefits: [
      {
        id: "inpatient",
        title: "Statsionar davolash",
        subtitle: "",
        description:
          "Qulay palatalar, sutkalik parvarish va har bir bemorga individual yondashuv",
        iconPath: <MobileDeviceIcon />,
      },
      {
        id: "venography",
        title: "Venalar rentgeni",
        subtitle: "",
        description:
          "Yuqori aniqlikdagi qon tomirlarni ilg'or diagnostikasi mavjud bo'lgan birinchi klinikalardan biri",
        iconPath: <StethoscopeIconk2 />,
      },
      {
        id: "spring-water",
        title: "Buloq va noyob suv",
        subtitle: "",
        description:
          "Sog'lomlashtirish dasturlari uchun noyob tarkibga ega toza tabiiy suvdan foydalanamiz",
        iconPath: <HeartDoubleIcon />,
      },
      {
        id: "high-level",
        title: "Yuqori darajadagi tibbiyot",
        subtitle: "",
        description:
          "Sog'lig'ingiz uchun zamonaviy uskunalar, ekspert jamoa va sifatli xizmat",
        iconPath: <HealthPlusIcon />,
      },
    ],
  },
};

export interface BenefitsGridProps {
  title?: string;
  description?: string;
  readMoreText?: string;
  readMoreLink?: string;
  benefits?: any[];
  className?: string;
}

export const BenefitsGrid: React.FC<BenefitsGridProps> = ({
  title,
  description,
  readMoreText,
  readMoreLink = "/clinic",
  benefits,
}) => {
  const { theme } = useThemeStore();
  const { t } = useTranslation(translations);

  // Получаем локализованные данные
  const gridTitle = title || t("title") || "";
  const gridDescription = description || t("description") || "";
  const gridReadMoreText = readMoreText || t("readMore");
  const gridBenefits =
    benefits || (t("benefits", { returnObjects: true }) as any[]);
  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8 md:mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="col-span-1 relative rounded-2xl overflow-hidden h-auto md:h-[500px] lg:h-[800px] p-8 md:p-10 bg-white dark:bg-dark-block text-[#173F46] dark:text-white min-h-[400px] md:min-h-[500px] lg:min-h-[728px] flex flex-col">
            <div className="relative z-10 max-w-3xl">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-[56px] font-medium tracking-[0.01em] leading-[1.15] md:leading-[1.2] lg:leading-[1.25]">
                  {gridTitle}
                </h2>
              </div>
              <p className="text-base lg:text-[18px] mt-10 mb-12 tracking-normal leading-[160%] space-y-2">
                {gridDescription.split(". ").map((sentence, index) => (
                  <span key={index} className="block">
                    {sentence}
                    {index < gridDescription.split(". ").length - 1 ? "." : ""}
                  </span>
                ))}
              </p>
            </div>

            <a
              href={readMoreLink}
              className="relative z-10 h-[58px] inline-flex items-center justify-center border border-[#173F46] dark:border-white text-[#173F46] dark:text-white hover:bg-light-accent hover:text-white hover:border-light-accent rounded-2xl px-6 py-3 transition-colors mt-auto self-start"
            >
              <span className="tracking-wide">{gridReadMoreText}</span>
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </a>
          </div>

          {/* Карточки преимуществ - правая колонка */}
          <div className="col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.isArray(gridBenefits) &&
              gridBenefits.map((benefit) => {
                return (
                  <div key={benefit.id} className="h-full">
                    <UniversalCard
                      variant="analysis"
                      title={benefit.title}
                      subtitle={benefit.subtitle || ""}
                      description={benefit.description}
                      icon={applyColorToIcon(
                        benefit.iconPath,
                        getIconColorByTheme(theme)
                      )}
                      showButton={false}
                      hoverColor="bg-light-accent"
                      iconPosition="center"
                      minHeight="h-[360px]"
                      heightMobile="h-[200px]"
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsGrid;
