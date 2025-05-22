import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/src/config/constants";
import { useLanguageStore } from "@/src/store/language";
import { useTranslation } from "@/src/hooks/useTranslation";
import { checkupDetailTranslations } from "@/src/shared/mocks/checkupHeroData";

interface PartnersGalleryData {
  key: string;
  image: string[];
}

interface HomePageContent {
  partners_gallery?: {
    data: PartnersGalleryData;
    type: string;
  };
}

interface HomePageResponse {
  data: {
    title: string;
    slug: string;
    content: HomePageContent;
  };
}

const fetchHomePageData = async (
  language: string
): Promise<HomePageContent | null> => {
  try {
    const response = await axios.get<HomePageResponse>(
      `${API_BASE_URL}/pages/home`,
      {
        headers: {
          "X-Language": language,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.content;
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return null;
  }
};

const OurPartners = () => {
  const { currentLocale } = useLanguageStore();
  const { t } = useTranslation(checkupDetailTranslations);
  const [partnerImages, setPartnerImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Переводы заголовка
  const getTitle = () => {
    if (currentLocale === "uz") {
      return "Bizning hamkorlar";
    }
    return "Наши партнеры";
  };

  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      const data = await fetchHomePageData(currentLocale || "ru");
      if (data?.partners_gallery?.data?.image) {
        setPartnerImages(data.partners_gallery.data.image);
      }
      setLoading(false);
    };

    loadPartners();
  }, [currentLocale]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-xl text-light-text dark:text-dark-text">
          {currentLocale === "uz"
            ? "Hamkorlarni yuklash..."
            : "Загрузка партнеров..."}
        </div>
      </div>
    );
  }

  if (partnerImages.length === 0) {
    return null;
  }

  // Дублируем изображения для бесшовной анимации
  const duplicatedImages = [...partnerImages, ...partnerImages];

  return (
    <div className="overflow-hidden py-5">
      {/* Заголовок */}
      <h2 className="text-3xl md:text-5xl font-medium text-light-text dark:text-dark-text mb-8">
        {getTitle()}
      </h2>

      {/* Бегущая строка */}
      <div className="relative flex items-center justify-center">
        {/* Контейнер для анимации */}
        {/*<div className="flex animate-scroll">*/}
        {/*  {duplicatedImages.map((image, index) => (*/}
        {/*    <div*/}
        {/*      key={index}*/}
        {/*      className="flex-shrink-0 mx-3"*/}
        {/*      style={{*/}
        {/*        width: "375px",*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      <div*/}
        {/*        className="bg-white dark:bg-dark-block flex items-center justify-center p-6 duration-300"*/}
        {/*        style={{*/}
        {/*          width: "375px",*/}
        {/*          height: "420px",*/}
        {/*          borderRadius: "16px",*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <img*/}
        {/*          src={image}*/}
        {/*          alt={`Partner ${(index % partnerImages.length) + 1}`}*/}
        {/*          className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"*/}
        {/*          loading="lazy"*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}
        <img src="/images/logo-new.jpg" alt=""/>
      </div>

      {/* CSS для анимации */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${partnerImages.length * (375 + 48)}px);
          }
        }

        .animate-scroll {
          animation: scroll ${partnerImages.length * 4}s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @media (max-width: 1536px) {
          .animate-scroll {
            animation: scroll ${partnerImages.length * 5}s linear infinite;
          }
        }

        @media (max-width: 1024px) {
          .animate-scroll {
            animation: scroll ${partnerImages.length * 6}s linear infinite;
          }
        }

        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll ${partnerImages.length * 7}s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default OurPartners;
