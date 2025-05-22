/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { UniversalSlider } from "../components/UniversalSlider";
import { UniversalCard } from "../components/UniversalCard";
import { useThemeStore } from "@/src/store/theme";
import { useTranslation } from "@/src/hooks/useTranslation";
import { PregnancyIcon, ButterflyLogoSmallIcon } from "../ui/Icon";
import { useCheckups } from "@/src/hooks/useCheckups";
import { CheckupItem } from "@/src/app/api/checkups";

// Локализация
const translations = {
  ru: {
    title: "Пройдите чек-ап за один визит",
    description:
      "Быстрое обследование для выявления скрытых заболеваний и контроля за состоянием здоровья",
    prevSlide: "Предыдущий слайд",
    nextSlide: "Следующий слайд",
    loading: "Загрузка чек-апов...",
    error: "Не удалось загрузить данные чек-апов",
    detailsButton: "Подробнее",
    checks: "исследований",
    time: "часа",
  },
  uz: {
    title: "Bir tashrif davomida tekshiruvdan o'ting",
    description:
      "Yashirin kasalliklarni aniqlash va sog'lig'ingizni nazorat qilish uchun tezkor tekshiruv",
    prevSlide: "Oldingi slayd",
    nextSlide: "Keyingi slayd",
    loading: "Tekshiruvlar yuklanmoqda...",
    error: "Tekshiruvlar ma'lumotlarini yuklab bo'lmadi",
    detailsButton: "Batafsil",
    checks: "tekshiruv",
    time: "soat",
  },
};

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

export interface CheckupSliderProps {
  title?: string;
  description?: string;
  className?: string;
}

export const CheckupSlider: React.FC<CheckupSliderProps> = ({
  title,
  description,
  className,
}) => {
  const { theme } = useThemeStore();
  const { t } = useTranslation(translations);

  // Используем существующий хук для получения чек-апов
  const { checkups, loading, error } = useCheckups();

  // Получаем локализованные данные
  const sliderTitle = title || t("title") || "";
  const sliderDescription = description || t("description") || "";

  // Разделение текстов на строки
  const titleLines = splitTextIntoLines(sliderTitle, 2);
  const descriptionLines = splitTextIntoLines(sliderDescription, 3);

  // Готовим заголовок с разбивкой на строки
  const formattedTitle = (
    <h2 className="text-3xl md:text-[40px] font-bold text-light-text dark:text-dark-text">
      {titleLines.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </h2>
  );

  // Готовим описание с разбивкой на строки
  const formattedDescription = (
    <div className="flex flex-col">
      <div className="mb-4 w-full">
        <p className="text-light-text dark:text-dark-text text-base md:text-lg">
          {descriptionLines.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );

  // Если данные загружаются
  if (loading) {
    return (
      <div className="flex justify-center items-center h-80 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light-accent"></div>
        <span className="ml-3 text-light-text dark:text-dark-text">
          {t("loading")}
        </span>
      </div>
    );
  }

  // Если произошла ошибка
  if (error) {
    return (
      <div className="text-center p-10 text-red-500 w-full">
        <p>{t("error")}</p>
      </div>
    );
  }

  const formatDuration = (duration: string | number | undefined): string => {
    // Если duration не передан или не является числом, возвращаем значение по умолчанию
    if (duration === undefined || duration === null) {
      return `2 ${t("time")}`;
    }

    // Преобразуем входное значение в число минут
    const minutes =
      typeof duration === "string" ? parseInt(duration, 10) : duration;

    // Если не удалось преобразовать в число, возвращаем значение по умолчанию
    if (isNaN(minutes)) {
      return `2 ${t("time")}`;
    }

    // Преобразуем минуты в часы и минуты
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // Формируем строку времени
    if (hours === 0) {
      return `${remainingMinutes} мин`;
    } else if (remainingMinutes === 0) {
      return `${hours} ${t("time")}`;
    } else {
      // Округляем минуты до десятых долей часа
      const formattedHours = hours + Math.round(remainingMinutes / 6) / 10;
      return `${formattedHours} ${t("time")}`;
    }
  };
  // Создаем слайды с карточками из данных API
  const slides = checkups.map((checkup: CheckupItem) => {
    // Определяем иконку в зависимости от слага чек-апа
    const icon =
      checkup.slug.includes("pregnan") || checkup.slug.includes("mama") ? (
        <PregnancyIcon
          size={190}
          color={theme === "light" ? "#094A54" : "#ffffff"}
        />
      ) : (
        <ButterflyLogoSmallIcon
          size={190}
          color={theme === "light" ? "#094A54" : "#ffffff"}
        />
      );

    // Получаем количество исследований на основе списка тестов
    const investigationsCount = checkup.medical_tests?.length || 0;

    // Правильно форматируем время прохождения чек-апа
    const timeRequired = formatDuration(checkup.duration);

    // Создаем карточку
    return (
      <UniversalCard
        key={checkup.uuid}
        title={checkup.title}
        description={checkup.card_description || checkup.mini_description}
        investigationsCount={investigationsCount}
        timeRequired={timeRequired}
        buttonText={t("detailsButton")}
        link={`/checkups/${checkup.slug}`}
        icon={checkup.icon}
        variant="family"
        className="min-h-[430px] hover:shadow-lg transition-all duration-300 relative"
        bordered={true}
        borderRadius="2xl"
        padding="0"
        hoverColor={
          theme === "light"
            ? "bg-light-accent hover:bg-light-accent"
            : "bg-dark-accent hover:bg-dark-accent"
        }
        styles={{
          container: { padding: "40px", position: "relative" },
          title: {
            fontFamily: "Graphik LCG, sans-serif",
            fontWeight: 500,
            fontSize: "40px",
          },
          description: {
            fontFamily: "Graphik LCG, sans-serif",
            fontWeight: 400,
            fontSize: "18px",
          },
        }}
      />
    );
  });

  // Проверка, есть ли слайды для отображения
  if (slides.length === 0) {
    return (
      <div className="text-center p-10 text-light-text dark:text-dark-text w-full">
        <p>Нет доступных чек-апов</p>
      </div>
    );
  }

  return (
    <UniversalSlider
      slides={slides}
      title={formattedTitle}
      description={formattedDescription}
      slidesPerView={1}
      slidesPerMobileView={1}
      slidesPerView768={1}
      slidesPerView1024={2}
      spaceBetween={20}
      showNavigation={true}
      navigationPrevLabel={t("prevSlide")}
      navigationNextLabel={t("nextSlide")}
      showPagination={false}
      loop={true}
      className={className}
      titleClassName="text-3xl md:text-[40px] mt-20 font-bold text-light-text dark:text-dark-text"
      descriptionClassName="text-light-text dark:text-dark-text text-base md:text-lg"
      wrapperClassName="mt-20"
    />
  );
};
