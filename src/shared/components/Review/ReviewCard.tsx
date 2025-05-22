"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useThemeStore } from "@/src/store/theme";
import { useTranslation } from "@/src/hooks/useTranslation";
import { HeartCheckIcon, ThoGISIcon, YouTubeIcon } from "../../ui/Icon";
import "./index.css";
interface ReviewCardProps {
  name: string;
  date: string;
  text: string;
  service?: string;
  reviewSource?: string;
  avatar?: string;
  className?: string;
  external_icon?: string;
  external_link?: string;
  service_icon?: string;
}

const translations = {
  ru: {
    service: "Услуга:",
    readMore: "Читать отзыв",
    watchMore: "Смотреть отзыв",
  },
  uz: {
    service: "Xizmat:",
    readMore: "Sharhni o'qish",
    watchMore: "Sharhni ko'rish",
  },
};

export const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  date,
  text,
  service,
  reviewSource = null,
  avatar = "/images/avatar-placeholder.png",
  className = "",
  external_icon,
  external_link,
  service_icon,
}) => {
  const { theme } = useThemeStore();
  const { t } = useTranslation(translations);

  const iconRef = useRef<HTMLSpanElement | null>(null);
  const serviceIconRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (iconRef.current) {
      const svg = iconRef.current.querySelector("svg");
      if (svg) {
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "auto");
      }
    }
  }, [external_icon]);

  // Control service icon color based on theme
  useEffect(() => {
    if (serviceIconRef.current && service_icon) {
      const svg = serviceIconRef.current.querySelector("svg");
      if (svg) {
        // Set default size
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");

        // Add or update fill attribute based on theme
        const fillColor = theme === "light" ? "#173F46" : "#FFFFFF";
        svg.setAttribute("fill", fillColor);

        // Also update any path elements that might have their own fill
        const paths = svg.querySelectorAll("path");
        paths.forEach((path) => {
          path.setAttribute("fill", fillColor);
        });
      }
    }
  }, [theme, service_icon]);

  const getReviewSourceLink = () => {
    if (external_icon && external_link) {
      return (
        <a
          href={external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-[#73B1A4] hover:underline mt-4"
        >
          <span
            ref={iconRef}
            className="inline-block w-[24px] h-[24px]"
            dangerouslySetInnerHTML={{ __html: external_icon || "" }}
          />
          <p>{t("readMore")}</p>
        </a>
      );
    }

    if (reviewSource === "google") {
      return (
        <a
          href="#"
          className="flex items-center text-[#73B1A4] hover:underline mt-4"
        >
          <ThoGISIcon size={24} className="mr-2" />
          <span>{t("readMore")}</span>
        </a>
      );
    } else if (reviewSource === "youtube") {
      return (
        <a
          href="#"
          className="flex items-center text-[#73B1A4] hover:underline mt-4"
        >
          <YouTubeIcon size={24} className="mr-2" />
          <span>{t("watchMore")}</span>
        </a>
      );
    }

    return null;
  };

  return (
    <div
      className={`p-6 rounded-2xl h-[420px] flex flex-col group ${
        theme === "light" ? "bg-white" : "bg-dark-block"
      } ${className}`}
    >
      <div className="flex items-center mb-4">
        <div className="w-[60px] h-[60px] relative rounded-full overflow-hidden mr-3">
          <Image
            src={avatar}
            alt={name}
            width={60}
            height={60}
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl font-medium text-[#173F46] dark:text-dark-text">
            {name}
          </h3>
          <p className="text-base text-gray-500 dark:text-gray-400">{date}</p>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <p className="text-lg text-[#173F46] dark:text-dark-text line-clamp-6">
          {text}
        </p>
      </div>

      <div className="">
        {service && (
          <div className="mb-10">
            <div className="text-[#173F46] dark:text-gray-400 font-medium text-lg">
              {t("service")}
            </div>
            <div className="flex items-center">
              {service_icon ? (
                <div
                  id="review-icon"
                  ref={serviceIconRef}
                  className="w-[24px] h-[24px] mr-[8px] block"
                  dangerouslySetInnerHTML={{ __html: service_icon }}
                />
              ) : (
                <HeartCheckIcon
                  size={24}
                  className="text-light-accent mr-2 group-hover:text-black group-hover:dark:text-white transition-colors duration-200"
                />
              )}
              <span className="text-[#173F46] dark:text-dark-text">
                {service}
              </span>
            </div>
          </div>
        )}

        <div>{getReviewSourceLink()}</div>
      </div>
    </div>
  );
};
