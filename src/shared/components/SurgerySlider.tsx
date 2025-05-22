/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { UniversalSlider } from "../components/UniversalSlider";
import { useThemeStore } from "@/src/store/theme";
import { useTranslation } from "@/src/hooks/useTranslation";
import { UniversalCard } from "../components/UniversalCard";
import Image from "next/image";
import { surgeryData } from "../mocks/surgeryData";
import { applyColorToIcon, getIconColorByTheme } from "../utils/iconUtils";

// Компонент карточки с фото
const ServiceCardWithImage: React.FC<{
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  iconType: string;
  features: string[];
  buttonText: string;
  iconPath: React.ReactNode;
}> = ({ id, title, description, imageSrc, iconPath, features, buttonText }) => {
  const { theme } = useThemeStore();

  return (
    <div className="flex flex-col md:flex-row gap-0 md:gap-5 w-full rounded-2xl md:h-[420px]">
      {/* Image - full width on mobile, 50% on desktop */}
      <div className="w-full md:w-[50%] relative h-[200px] md:h-full rounded-t-2xl md:rounded-2xl overflow-hidden">
        asdsadas
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Card - full width on mobile, 50% on desktop */}
      <div className="w-full md:w-[50%] -mt-4 md:mt-0 md:h-full">
        <UniversalCard
          variant="surgery"
          title={title}
          description={description}
          icon={applyColorToIcon(iconPath, getIconColorByTheme(theme))}
          features={features}
          link={`/services/${id}`}
          buttonText={buttonText}
          showButton={true}
          buttonStyle="filled"
          hoverBgColor="light-accent"
          titleSize="text-xl sm:text-2xl md:text-3xl lg:text-4xl"
          descriptionSize="text-sm sm:text-base md:text-lg"
          className="h-full border-none shadow-none rounded-b-2xl md:rounded-2xl pt-8 md:pt-6"
          styles={{
            container: { padding: "20px sm:p-6 md:p-8", position: "relative" },
            title: {
              fontFamily: "Graphik LCG, sans-serif",
              fontWeight: 500,
              lineHeight: "1.2",
              marginBottom: "0.5rem sm:mb-2 md:mb-3",
            },
            description: {
              fontFamily: "Graphik LCG, sans-serif",
              fontWeight: 400,
              lineHeight: "1.4",
              marginBottom: "1rem sm:mb-2 md:mb-3",
            },
            button: {
              padding: "0.5rem 1rem sm:py-2 sm:px-4 md:py-2.5 md:px-5",
              borderRadius: "0.5rem sm:rounded-lg md:rounded-xl",
              fontSize: "0.75rem sm:text-sm md:text-base",
            },
          }}
        />
      </div>
    </div>
  );
};

export interface SurgerySliderProps {
  title?: string;
  description?: string;
  className?: string;
}

export const SurgerySlider: React.FC<SurgerySliderProps> = ({
  title,
  description,
  className,
}) => {
  const { t } = useTranslation(surgeryData);

  // Получаем локализованные данные
  const sliderTitle = title || t("title") || "";
  const sliderDescription = description || t("description") || "";
  const services = t("services", { returnObjects: true }) as any[];
  const detailsButtonText = t("detailsButton");

  // Разделение текста на строки
  const splitTextIntoLines = (text: string, lineCount: number) => {
    if (!text) return [];

    const words = text.split(" ");
    const wordsPerLine = Math.ceil(words.length / lineCount);

    const lines = [];
    for (let i = 0; i < lineCount; i++) {
      const startIndex = i * wordsPerLine;
      const endIndex = Math.min(startIndex + wordsPerLine, words.length);
      if (startIndex < words.length) {
        lines.push(words.slice(startIndex, endIndex).join(" "));
      }
    }

    return lines;
  };

  // Разделение текстов на строки
  const titleLines = splitTextIntoLines(sliderTitle, 2);
  const descriptionLines = splitTextIntoLines(sliderDescription, 3);

  // Создаем слайды с карточками
  const slides = services.map((service) => (
    <ServiceCardWithImage
      key={service.id}
      id={service.id}
      title={service.title}
      description={service.description}
      imageSrc={service.imageSrc}
      iconPath={service.iconPath}
      iconType={service.iconType}
      features={service.features}
      buttonText={detailsButtonText}
    />
  ));

  // Создаем компоненты заголовка и описания
  const titleComponent = (
    <h2 className="text-3xl md:text-[40px] font-bold text-[#173F46] dark:text-white">
      {titleLines.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </h2>
  );

  const descriptionComponent = (
    <p className="text-base md:text-lg text-[#173F46] dark:text-white">
      {descriptionLines.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </p>
  );

  // Использование универсального слайдера
  return (
    <>
      <UniversalSlider
        slides={slides}
        title={titleComponent}
        description={descriptionComponent}
        slidesPerView={1}
        slidesPerMobileView={1}
        mobileBreakpoint={992}
        spaceBetween={24}
        showNavigation={true}
        navigationPrevLabel={t("prevSlide")}
        navigationNextLabel={t("nextSlide")}
        showPagination={false}
        speed={400} // Уменьшите скорость для более предсказуемого перехода
        loop={true}
        className={`${className} surgery-slider mt-20`}
        slideClassName="h-full"
      />
    </>
  );
};
