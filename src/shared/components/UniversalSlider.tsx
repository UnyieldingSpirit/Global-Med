/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { useThemeStore } from "@/src/store/theme";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface UniversalSliderProps {
  slides: ReactNode[];
  slidesPerView?: number;
  slidesPerMobileView?: number;
  slidesPerView768?: number;
  slidesPerView1024?: number;
  slidesPerView1280?: number;
  slidesPerView1536?: number;
  mobileBreakpoint?: number;
  spaceBetween?: number;
  loop?: boolean;
  speed?: number;
  autoplay?: boolean | { delay: number; disableOnInteraction?: boolean };
  showNavigation?: boolean;
  navigationPrevLabel?: string;
  navigationNextLabel?: string;
  customPrevButton?: ReactNode;
  customNextButton?: ReactNode;
  showPagination?: boolean;
  paginationClassName?: string;
  title?: string | ReactNode;
  description?: string | ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
  slideClassName?: string;
  wrapperClassName?: string;
  onSlideChange?: (index: number) => void;
  breakpoints?: { [key: number]: SwiperOptions };
  onInit?: (swiper: any) => void;
}

export const UniversalSlider: React.FC<UniversalSliderProps> = ({
  slides = [],
  slidesPerView = 2,
  slidesPerMobileView = 1,
  slidesPerView768,
  slidesPerView1024,
  slidesPerView1280,
  slidesPerView1536,
  mobileBreakpoint = 878,
  spaceBetween = 20,
  loop = false,
  speed = 500,
  autoplay = false,
  showNavigation = true,
  navigationPrevLabel = "Предыдущий слайд",
  navigationNextLabel = "Следующий слайд",
  customPrevButton,
  customNextButton,
  showPagination = false,
  paginationClassName = "swiper-pagination-custom",
  title,
  description,
  titleClassName = "text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-4",
  descriptionClassName = "text-light-text dark:text-dark-text text-base md:text-lg mb-6",
  className = "",
  slideClassName = "",
  wrapperClassName = "",
  onSlideChange,
  breakpoints,
  onInit,
}) => {
  const { theme } = useThemeStore();

  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeSlidePerView, setActiveSlidePerView] = useState<number>(
    typeof window !== "undefined" && window.innerWidth < mobileBreakpoint
      ? slidesPerMobileView
      : slidesPerView
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < mobileBreakpoint;
      setIsMobile(mobile);
      setActiveSlidePerView(mobile ? slidesPerMobileView : slidesPerView);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileBreakpoint, slidesPerMobileView, slidesPerView]);

  const handleSlideChange = (swiper: any) => {
    const currentScrollPosition = window.scrollY;

    if (onSlideChange) {
      onSlideChange(swiper.activeIndex);
    }

    setTimeout(() => {
      window.scrollTo({
        top: currentScrollPosition,
        behavior: "auto",
      });
    }, 50);
  };

  const renderHeader = () => {
    if (!title && !description) return null;

    return (
      <div className={`${wrapperClassName} mb-6`}>
        <div
          className={`flex flex-col ${
            isMobile ? "space-y-4" : "md:flex-row justify-between"
          }`}
        >
          {title && (
            <div className={`${isMobile ? "w-full" : "md:w-1/2"} mb-4 md:mb-0`}>
              {typeof title === "string" ? (
                <h2 className={titleClassName}>{title}</h2>
              ) : (
                title
              )}
            </div>
          )}

          {description && (
            <div className={`${isMobile ? "w-full" : "md:w-1/2"}`}>
              {typeof description === "string" ? (
                <p className={descriptionClassName}>{description}</p>
              ) : (
                description
              )}

              {showNavigation && !customPrevButton && !customNextButton && (
                <div className="flex items-center gap-2 mt-4">
                  <button
                    ref={prevButtonRef}
                    className="w-12 h-12 rounded-lg border border-black dark:border-white bg-transparent flex items-center justify-center transition-all swiper-button-prev-custom hover:bg-light-accent hover:border-light-accent group"
                    aria-label={navigationPrevLabel}
                  >
                    <svg
                      className="w-6 h-6 text-black dark:text-white transition-colors group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    ref={nextButtonRef}
                    className="w-12 h-12 rounded-lg border border-black dark:border-white bg-transparent flex items-center justify-center transition-all swiper-button-next-custom hover:bg-light-accent hover:border-light-accent group"
                    aria-label={navigationNextLabel}
                  >
                    <svg
                      className="w-6 h-6 text-black dark:text-white transition-colors group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNavigation = () => {
    if (
      !showNavigation ||
      (description && !customPrevButton && !customNextButton)
    )
      return null;

    return (
      <div className="flex items-center gap-2 mb-6">
        {customPrevButton ? (
          React.cloneElement(customPrevButton as React.ReactElement<any>, {
            ref: prevButtonRef as React.Ref<any>,
            className: `swiper-button-prev-custom ${
              (customPrevButton as React.ReactElement<any>).props.className ||
              ""
            }`,
          })
        ) : (
          <button
            ref={prevButtonRef}
            className="w-12 h-12 rounded-lg border border-black dark:border-white bg-transparent flex items-center justify-center transition-all swiper-button-prev-custom hover:bg-light-accent hover:border-light-accent group"
            aria-label={navigationPrevLabel}
          >
            <svg
              className="w-6 h-6 text-black dark:text-white transition-colors group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {customNextButton ? (
          React.cloneElement(customNextButton as React.ReactElement<any>, {
            ref: nextButtonRef as React.Ref<any>,
            className: `swiper-button-next-custom ${
              (customNextButton as React.ReactElement<any>).props.className ||
              ""
            }`,
          })
        ) : (
          <button
            ref={nextButtonRef}
            className="w-12 h-12 rounded-lg border border-black dark:border-white bg-transparent flex items-center justify-center transition-all swiper-button-next-custom hover:bg-light-accent hover:border-light-accent group"
            aria-label={navigationNextLabel}
          >
            <svg
              className="w-6 h-6 text-black dark:text-white transition-colors group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    );
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  // Формируем объект с брейкпоинтами для Swiper с правильной типизацией
  const customBreakpoints: { [key: number]: SwiperOptions } = {};

  if (slidesPerView768) {
    customBreakpoints[768] = { slidesPerView: slidesPerView768, spaceBetween };
  }

  if (slidesPerView1024) {
    customBreakpoints[1024] = {
      slidesPerView: slidesPerView1024,
      spaceBetween,
    };
  }

  if (slidesPerView1280) {
    customBreakpoints[1280] = {
      slidesPerView: slidesPerView1280,
      spaceBetween,
    };
  }

  if (slidesPerView1536) {
    customBreakpoints[1536] = {
      slidesPerView: slidesPerView1536,
      spaceBetween,
    };
  }

  if (mobileBreakpoint) {
    customBreakpoints[mobileBreakpoint] = { slidesPerView, spaceBetween };
  }

  // Объединяем с переданными брейкпоинтами, если они есть
  const finalBreakpoints = breakpoints
    ? { ...customBreakpoints, ...breakpoints }
    : customBreakpoints;

  return (
    <div className={`w-full ${className} mb-6 sm:mb-8 md:mb-40`}>
      {renderHeader()}
      {renderNavigation()}

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={activeSlidePerView}
          spaceBetween={spaceBetween}
          loop={loop}
          speed={speed}
          autoplay={autoplay}
          breakpoints={finalBreakpoints}
          onSlideChange={handleSlideChange}
          watchSlidesProgress={true}
          preventInteractionOnTransition={true}
          navigation={
            showNavigation
              ? {
                  prevEl: ".swiper-button-prev-custom",
                  nextEl: ".swiper-button-next-custom",
                }
              : false
          }
          pagination={
            showPagination
              ? {
                  clickable: true,
                  el: `.${paginationClassName}`,
                  bulletClass: `${paginationClassName}-bullet`,
                  bulletActiveClass: `${paginationClassName}-bullet-active`,
                }
              : false
          }
          onBeforeInit={(swiper) => {
            if (
              showNavigation &&
              typeof swiper.params.navigation !== "boolean" &&
              swiper.params.navigation
            ) {
              swiper.params.navigation.prevEl = prevButtonRef.current;
              swiper.params.navigation.nextEl = nextButtonRef.current;
            }

            if (onInit) {
              onInit(swiper);
            }
          }}
          className="universal-slider"
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={index}
              className={`universal-slide ${slideClassName}`}
            >
              {slide}
            </SwiperSlide>
          ))}
        </Swiper>

        {showPagination && (
          <div
            className={`${paginationClassName} flex justify-center space-x-2 mt-4`}
          ></div>
        )}
      </div>

      <style jsx global>{`
        .universal-slider {
          width: 100%;
          overflow-x: hidden !important;
          padding-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .swiper-slide {
          height: auto;
          backface-visibility: hidden;
          transform: translateZ(0);
          will-change: transform;
        }

        .swiper-wrapper {
          display: flex;
          align-items: stretch;
          transition-timing-function: ease-out;
        }

        .swiper-container {
          touch-action: pan-y;
        }

        .${paginationClassName}-bullet {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 50%;
          background: #ccc;
          opacity: 0.7;
          margin: 0 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .${paginationClassName}-bullet-active {
          opacity: 1;
          background: var(--light-accent);
          width: 10px;
          height: 10px;
        }

        .swiper-button-prev-custom.swiper-button-disabled,
        .swiper-button-next-custom.swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .swiper-button-prev-custom,
        .swiper-button-next-custom {
          background-color: transparent !important;
          border: 1px solid #000 !important;
          transition: all 0.3s ease;
        }

        .dark .swiper-button-prev-custom,
        .dark .swiper-button-next-custom {
          border-color: #fff !important;
        }

        .swiper-button-prev-custom svg,
        .swiper-button-next-custom svg {
          color: #000 !important;
        }

        .dark .swiper-button-prev-custom svg,
        .dark .swiper-button-next-custom svg {
          color: #fff !important;
        }

        .swiper-button-prev-custom:hover,
        .swiper-button-next-custom:hover {
          background-color: var(--light-accent) !important;
          border-color: var(--light-accent) !important;
        }

        .swiper-button-prev-custom:hover svg,
        .swiper-button-next-custom:hover svg {
          color: white !important;
        }
        @media (max-width: ${mobileBreakpoint}px) {
          .universal-slider {
            overflow-x: hidden !important;
          }
        }
      `}</style>
    </div>
  );
};
