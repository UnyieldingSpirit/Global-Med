"use client";

import React, { useEffect, useState } from "react";
import { UniversalSlider } from "../UniversalSlider";
import { useTranslation } from "@/src/hooks/useTranslation";
import { ReviewCard } from "./ReviewCard";

// Tarjima matnlari
const translations = {
  ru: {
    title: "Нам доверяют здоровье",
    description:
      "Тысячи пациентов уже получили квалифицированную помощь в нашей клинике",
    prevSlide: "Предыдущий отзыв",
    nextSlide: "Следующий отзыв",
  },
  uz: {
    title: "Bizga sogligingizni ishoning",
    description:
      "Minglab bemorlar allaqachon klinikamizda malakali yordam olishgan",
    prevSlide: "Oldingi sharh",
    nextSlide: "Keyingi sharh",
  },
};

// API'dan keladigan sharhlar formati
interface Review {
  id: number;
  user_name: string;
  review_text: string;
  service_text: string;
  review_date: string;
  user_image: string;
  reviewSource?: string;
  external_icon?: string;
  external_link?: string;
  review_source?: string;
  service_icon?: string;
}

export interface ReviewsSliderProps {
  title?: string;
  description?: string;
  className?: string;
}
export const ReviewsSlider: React.FC<ReviewsSliderProps> = ({
  title,
  description,
  className = "",
}) => {
  const { t, currentLocale } = useTranslation(translations);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "https://globalmed.kelyanmedia.com/api/reviews",
          {
            headers: {
              "X-Language": currentLocale,
            },
          }
        );
        const json = await response.json();
        setReviews(json.data || []);
      } catch (error) {
        console.error("Ошибка при загрузке отзывов:", error);
      }
    };

    fetchReviews();
  }, [currentLocale]);

  // Title va description fallback bilan
  const sliderTitle = title || t("title") || "";
  const sliderDescription = description || t("description") || "";

  // Har bir review uchun ReviewCard
  const slides = reviews.map((review, index) => (
    <ReviewCard
      key={index}
      name={review.user_name}
      date={new Date(review.review_date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
      text={review.review_text}
      service={review.service_text || "—"}
      reviewSource={review.review_source}
      avatar={review.user_image}
      external_icon={review.external_icon}
      external_link={review.external_link}
      service_icon={review.service_icon}
    />
  ));

  return (
    <UniversalSlider
      slides={slides}
      title={
        <h2 className="text-3xl md:text-5xl font-medium text-light-text dark:text-dark-text mb-4">
          {sliderTitle}
        </h2>
      }
      description={
        <p className="text-base md:text-lg text-light-text dark:text-dark-text mb-6">
          {sliderDescription}
        </p>
      }
      slidesPerView={1}
      slidesPerMobileView={1}
      slidesPerView768={2}
      slidesPerView1024={4}
      spaceBetween={20}
      showNavigation={true}
      navigationPrevLabel={t("prevSlide")}
      navigationNextLabel={t("nextSlide")}
      showPagination={false}
      className={`${className} mt-20`}
      titleClassName="text-3xl md:text-5xl font-medium text-light-text dark:text-dark-text mb-4"
      descriptionClassName="text-base md:text-lg text-light-text dark:text-dark-text mb-6"
      loop={true}
    />
  );
};
