"use client";

import React from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { HeartHandIcon } from "../ui/Icon";

interface VideoBannerProps {
  videoSrc?: string;
  className?: string;
}

const translations = {
  ru: {
    title: "Делаем медицинскую помощь удобной, доступной и комфортной для вас",
  },
  uz: {
    title: "Tibbiy yordamni qulay, hamyonbop va qulay qilamiz",
  },
};

export const VideoBanner: React.FC<VideoBannerProps> = ({
  videoSrc = "/video/video.mp4",
  className = "",
}) => {
  const { t } = useTranslation(translations);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl mb-6 sm:mb-8 md:mb-40 ${className}`}
    >
      {/* Видео - адаптивная высота */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
          muted
          playsInline
          autoPlay
          loop
        />

        {/* Затемнение для видео */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>
      </div>

      {/* Центральный блок с текстом - адаптивный размер */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="w-[280px] h-auto sm:w-[320px] md:w-[375px] lg:h-[375px] bg-light-text dark:bg-dark-block rounded-2xl flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="text-center text-white">
            <div className="text-lg sm:text-xl md:text-2xl font-medium mb-4 sm:mb-6 md:mb-12">
              {t("title")}
            </div>
            <div className="flex justify-center mt-4 md:mt-6">
              <HeartHandIcon
                size={40}
                color="white"
                className="sm:w-[60px] sm:h-[60px] md:w-[80px] md:h-[80px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
