/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useThemeStore } from "@/src/store/theme";
import Image from "next/image";
import { applyColorToIcon, getIconColorByTheme } from "../utils/iconUtils";
import { EnhancedLink } from "./EnhancedLink";

export interface UniversalCardProps {
  title: string;
  description?: string | string[] | React.ReactNode;
  subtitle?: string;
  additionalInfo?: string;
  variant?:
    | "default"
    | "checkup"
    | "specialist"
    | "analysis"
    | "service"
    | "custom"
    | "family"
    | "analysis-card"
    | "surgery";
  features?: Array<string | Feature>;
  imageSrc?: string;
  iconPosition?: "center" | "top" | "bottom" | "left" | "right";
  iconAlignment?: "left" | "right";
  listStyle?: "none" | "disc" | "decimal";
  descriptionBeforeIcon?: boolean;
  link?: string;
  buttonText?: string;
  onClick?: () => void;
  showButton?: boolean;
  buttonStyle?: "outline" | "filled";
  className?: string;
  bordered?: boolean;
  borderColor?: string;
  borderRadius?: string;
  iconColorLight?: string;
  iconColorDark?: string;
  hoverColor?: string;
  bgColorLight?: string;
  bgColorDark?: string;
  titleSize?: string;
  descriptionSize?: string;
  padding?: string;
  onHover?: () => void;
  badge?: string | ReactNode;
  animation?: string;
  timeRequired?: string;
  investigationsCount?: number;
  styles?: {
    container?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
    icon?: React.CSSProperties;
    button?: React.CSSProperties;
  };
  hoverBgColor?: string;
  buttonTextSize?: string;
  buttonPadding?: string;
  icon?: React.ReactNode | string;
  iconColor?: string;
  minHeight?: string;
  heightMobile?: string;
}

export interface Feature {
  text: string;
  icon: "doc" | "time" | string;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({
  title,
  description,
  subtitle,
  hoverBgColor,
  buttonTextSize,
  buttonPadding,
  icon,
  additionalInfo,
  variant = "default",
  iconPosition = "center",
  iconAlignment = "right",
  listStyle = "disc",
  descriptionBeforeIcon = false,
  link,
  buttonText = "Подробнее",
  onClick,
  showButton = true,
  buttonStyle = "filled",
  className = "",
  bordered = false,
  borderColor,
  borderRadius = "xl",
  iconColor,
  hoverColor,
  bgColorLight,
  bgColorDark,
  titleSize,
  descriptionSize,
  padding = "6",
  onHover,
  badge,
  animation,
  timeRequired,
  investigationsCount,
  styles = {},
  imageSrc,
  features,
  minHeight,
  heightMobile,
}) => {
  const { theme } = useThemeStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const finalIconColor = getIconColorByTheme(theme, iconColor);

  // Функция для изменения fill в SVG
  const modifySvgFill = (svgString: string) => {
    return svgString.replace(/fill="[^"]*"/g, 'fill="currentColor"');
  };

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Обработчик события наведения - теперь работает на всех устройствах
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHover) onHover();
  };

  // Обработчик события ухода мыши - теперь работает на всех устройствах
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Обработчики сенсорных событий для мобильных устройств
  const handleTouchStart = () => {
    setIsHovered(true);
    if (onHover) onHover();
  };

  const handleTouchEnd = () => {
    // Не сбрасываем isHovered на мобильных устройствах для сохранения эффекта
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  // Стилизованные классы
  const getBorderClass = () => {
    if (!bordered) return "";
    const defaultBorder =
      theme === "light" ? "border-gray-200" : "border-gray-700";
    return `border ${borderColor || defaultBorder}`;
  };

  const getBackgroundClass = () => {
    if (isHovered) return hoverColor || "bg-light-accent";
    if (theme === "light") return bgColorLight || "bg-white";
    return bgColorDark || "bg-dark-block";
  };

  const getBorderRadiusClass = () => {
    switch (borderRadius) {
      case "none":
        return "";
      case "sm":
        return "rounded-sm";
      case "md":
        return "rounded-md";
      case "lg":
        return "rounded-lg";
      case "xl":
        return "rounded-xl";
      case "2xl":
        return "rounded-2xl";
      case "full":
        return "rounded-full";
      default:
        return `rounded-${borderRadius}`;
    }
  };

  const getPaddingClass = () => {
    return isMobile ? `p-4 sm:p-${padding}` : `p-${padding}`;
  };

  const getAnimationClass = () => {
    if (!animation) return "";

    switch (animation) {
      case "fadeIn":
        return "animate-fadeIn";
      case "slideIn":
        return "animate-slideIn";
      case "pulse":
        return "animate-pulse";
      case "bounce":
        return "animate-bounce";
      default:
        return animation.startsWith("animate-")
          ? animation
          : `animate-${animation}`;
    }
  };

  const cardClasses = `
    universal-card relative ${getBorderRadiusClass()} ${getPaddingClass()} transition-all duration-300 overflow-hidden 
    ${isMobile ? `${heightMobile}]` : `${minHeight}`} h-full
    ${getBackgroundClass()}
    ${getBorderClass()}
    ${link || onClick ? "cursor-pointer hover:shadow-md" : ""}
    ${getAnimationClass()}
    ${className}
  `;

  const getTextColor = () => {
    if (isHovered) return "text-white";
    if (theme === "light") return "text-[#173F46]";
    return "text-white";
  };

  const titleColor = getTextColor();
  const descriptionColor = getTextColor();

  // Уменьшение размера текста для мобильных устройств
  const titleSizeClass = isMobile
    ? "text-lg sm:text-xl md:text-2xl leading-tight"
    : titleSize ||
      "text-xl sm:text-2xl md:text-3xl leading-tight sm:leading-normal";

  const descriptionSizeClass = isMobile
    ? "text-sm sm:text-base md:text-lg leading-tight"
    : descriptionSize ||
      "text-base sm:text-lg md:text-xl leading-tight sm:leading-normal";

  // Класс для стиля списка
  const getListStyleClass = () => {
    switch (listStyle) {
      case "disc":
        return "list-disc marker-accent";
      case "decimal":
        return "list-decimal marker-accent";
      default:
        return "list-none";
    }
  };

  // Класс для позиционирования иконки
  const getIconPositionClass = () => {
    // Базовое позиционирование
    let positionClass = "flex justify-center";

    // Выравнивание по горизонтали
    if (iconPosition === "left") positionClass = "flex justify-start";
    else if (iconPosition === "right") positionClass = "flex justify-end";

    // Отступы для разных вариантов
    if (variant === "analysis") {
      return `${positionClass} mt-4 sm:mt-6 md:mt-[50px] mb-4 sm:mb-6 md:mb-[50px]`;
    } else if (variant === "service") {
      return `${positionClass} mt-2 sm:mt-3 md:mt-4 mb-4 sm:mb-6 md:mb-[50px] w-[90px] max-w-[90px] h-auto`;
    } else {
      return `${positionClass} my-3 sm:my-4 md:my-6`;
    }
  };

  // Функция для отображения исследований и времени в колонку
  const renderInvestigationsAndTime = () => {
    if (
      variant === "family" &&
      (investigationsCount !== undefined || timeRequired)
    ) {
      return (
        <div className="card-stats">
          {investigationsCount !== undefined && (
            <div className="flex items-center">
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 ${
                  isHovered
                    ? "text-white"
                    : theme === "light"
                    ? "text-light-text"
                    : "text-dark-text"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span
                className={`text-sm sm:text-base ${
                  isHovered ? "text-white" : ""
                }`}
              >
                {investigationsCount} исследований
              </span>
            </div>
          )}

          {timeRequired && (
            <div className="flex items-center">
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 ${
                  isHovered
                    ? "text-white"
                    : theme === "light"
                    ? "text-light-text"
                    : "text-dark-text"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span
                className={`text-sm sm:text-base ${
                  isHovered ? "text-white" : ""
                }`}
              >
                {timeRequired}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Блок с описанием
  const DescriptionBlock = () =>
    description && (
      <div
        className={`mb-3 sm:mb-4 md:mb-6 ${descriptionColor}`}
        style={styles.description}
      >
        {Array.isArray(description) ? (
          <ul className={`${getListStyleClass()} pl-5 ${descriptionSizeClass}`}>
            {description.map((item, idx) => (
              <li key={idx} className="mb-1">
                {item}
              </li>
            ))}
          </ul>
        ) : typeof description === "string" ? (
          <p className={`${descriptionSizeClass} font-normal`}>{description}</p>
        ) : (
          <>{description}</>
        )}
      </div>
    );

  // Блок с дополнительной информацией
  const AdditionalInfoBlock = () =>
    additionalInfo && (
      <p
        className={`
        ${descriptionSizeClass} 
        ${
          isHovered
            ? "text-white"
            : theme === "dark"
            ? "text-[#FFFFFF80]"
            : "text-[#094A5480]"
        } 
        mb-3 sm:mb-4 md:mb-5
        transition-colors duration-300
      `}
      >
        {additionalInfo}
      </p>
    );

  const renderFeatures = (
    features: Array<string | Feature> | undefined,
    isHovered: boolean,
    theme: string
  ) => {
    if (!features || features.length === 0) return null;

    return (
      <ul className="space-y-2 mb-1 lg:mb-6">
        {features.map((feature, index) => {
          // Check if feature is an object with icon
          const isFeatureObject =
            typeof feature === "object" && feature !== null;
          // Get feature text safely
          const featureText = isFeatureObject
            ? (feature as Feature).text
            : (feature as string);

          return (
            <li key={index} className="flex items-start">
              {isFeatureObject && (feature as Feature).icon ? (
                <>
                  {(feature as Feature).icon === "doc" ? (
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 ${
                        isHovered
                          ? "text-white"
                          : theme === "light"
                          ? "text-light-text"
                          : "text-dark-text"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  ) : (feature as Feature).icon === "time" ? (
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 ${
                        isHovered
                          ? "text-white"
                          : theme === "light"
                          ? "text-light-text"
                          : "text-dark-text"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`${
                        isHovered ? "text-white" : "text-light-accent"
                      } mr-2`}
                    >
                      •
                    </span>
                  )}
                </>
              ) : (
                <span
                  className={`${
                    isHovered ? "text-white" : "text-light-accent"
                  } mr-2`}
                >
                  •
                </span>
              )}
              <span
                className={`${
                  isHovered
                    ? "text-white"
                    : "text-light-text dark:text-dark-text"
                } sm:text-[6px] md:text-[10px] lg:text-[15px]`}
              >
                {featureText}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  // Блок с иконкой
  const IconBlock = () => {
    if (!icon) return null;

    const iconClasses =
      variant === "family" ? "universal-card-icon" : getIconPositionClass();

    // Get icon color based on theme and hover state
    const getIconColor = () => {
      if (theme === "dark") return "white";
      return isHovered ? "white" : "#173F46";
    };

    if (typeof icon === "string") {
      // Иконка - это строка SVG
      const modifiedSvg = modifySvgFill(icon);
      return (
        <div className={iconClasses} style={{ color: getIconColor() }}>
          <div
            className={
              "w-[50px] h-[50px] sm:w-[110px] sm:h-[110px] md:w-[190px] md:h-[190px] flex items-center"
            }
            dangerouslySetInnerHTML={{ __html: modifiedSvg }}
          />
        </div>
      );
    } else {
      // Иконка - это React-компонент
      return (
        <div className={iconClasses} style={styles.icon}>
          {typeof icon === "string" ? (
            <div
              dangerouslySetInnerHTML={{ __html: modifySvgFill(icon) }}
              className={`w-[50px] h-[50px] sm:w-[110px] sm:h-[110px] md:w-[190px] md:h-[190px] transition-transform duration-300 ${
                isHovered ? "scale-110" : ""
              }`}
              style={{ color: getIconColor() }}
            />
          ) : React.isValidElement(icon) ? (
            React.cloneElement(icon as React.ReactElement, {
              size: isMobile ? 50 : window.innerWidth < 1024 ? 110 : 190,
              className: `${
                (icon as React.ReactElement).props.className || ""
              } transition-transform duration-300 ${
                isHovered ? "scale-110" : ""
              }`,
              color: getIconColor(),
            })
          ) : (
            icon
          )}
        </div>
      );
    }
  };

  // Блок с подзаголовком
  const SubtitleBlock = () =>
    subtitle && (
      <h4 className={`font-medium ${descriptionSizeClass} mb-2 ${titleColor}`}>
        {subtitle}
      </h4>
    );

  // Рендер для варианта 'family'
  if (variant === "family") {
    return (
      <div
        className={`${cardClasses}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={styles.container}
      >
        <div className="universal-card-dot"></div>

        <div className="flex flex-col h-full">
          <div className="flex flex-col">
            <h3
              className={`${titleSizeClass} font-medium text-light-text dark:text-dark-text mb-3 sm:mb-4 ${
                isHovered ? "text-white" : ""
              }`}
              style={styles.title}
            >
              {title}
            </h3>

            {description && (
              <p
                className={`text-light-text dark:text-dark-text ${
                  isHovered ? "text-white" : ""
                } opacity-80 text-sm sm:text-base mb-5 sm:mb-6 md:mb-8`}
                style={styles.description}
              >
                {typeof description === "string" ? description : ""}
              </p>
            )}

            {renderInvestigationsAndTime()}
          </div>

          <div className="flex mt-auto">
            {iconAlignment === "right" && (
              <div className="flex-grow">
                {showButton && (
                  <Link href={link || "#"} className="inline-block">
                    <button
                      className={`mt-4 sm:mt-6 px-4 sm:px-6 rounded-2xl font-medium transition-colors 
                        w-full sm:w-[280px] md:w-[330px] h-[45px] sm:h-[50px] md:h-[60px] text-sm sm:text-base
                        ${
                          isHovered
                            ? "bg-white text-light-accent"
                            : "bg-transparent border border-light-text dark:border-dark-text text-light-text dark:text-dark-text"
                        }`}
                      style={styles.button}
                    >
                      {buttonText}
                    </button>
                  </Link>
                )}
              </div>
            )}

            {IconBlock()}

            {iconAlignment === "left" && (
              <div className="flex-grow flex justify-end">
                {showButton && (
                  <Link href={link || "#"} className="inline-block">
                    <button
                      className={`mt-4 sm:mt-6 px-4 sm:px-6 rounded-2xl font-medium transition-colors 
                        w-full sm:w-[280px] md:w-[330px] h-[45px] sm:h-[50px] md:h-[60px] text-sm sm:text-base
                        ${
                          isHovered
                            ? "bg-white text-light-accent"
                            : "bg-transparent border border-light-text dark:border-dark-text text-light-text dark:text-dark-text"
                        }`}
                      style={styles.button}
                    >
                      {buttonText}
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else if (variant === "analysis-card") {
    return (
      <div
        className={`${cardClasses} flex flex-col`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={styles.container}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Заголовок вверху */}
          <h3 className={`${titleSizeClass} font-medium ${titleColor}`}>
            {title}
          </h3>

          <div className="flex items-center justify-center mb-10 mt-10 flex-grow">
            {typeof icon === "string" ? (
              <div
                dangerouslySetInnerHTML={{ __html: modifySvgFill(icon) }}
                className={`w-[60px] h-[60px] md:w-[90px] md:h-[90px] transition-transform duration-300 ${
                  isHovered ? "scale-110" : ""
                }`}
                style={{ color: isHovered ? "white" : finalIconColor }}
              />
            ) : React.isValidElement(icon) ? (
              React.cloneElement(icon as React.ReactElement, {
                size: isMobile ? 60 : 90,
                className: `${
                  (icon as React.ReactElement).props.className || ""
                } transition-transform duration-300 ${
                  isHovered ? "scale-110" : ""
                }`,
                color: isHovered ? "white" : undefined,
              })
            ) : (
              icon
            )}
          </div>

          {/* Кнопка внизу */}
          <Link href={link || "#"} className="w-full block mt-4">
            <button
              className={`w-full ${
                buttonPadding || "py-3"
              } px-4 rounded-2xl font-medium transition-colors ${
                buttonTextSize || "text-base"
              }
                ${
                  isHovered
                    ? `bg-white text-light-accent ${
                        hoverBgColor === "white"
                          ? "border border-light-accent"
                          : ""
                      }`
                    : "bg-transparent border border-light-text dark:border-dark-text text-light-text dark:text-dark-text"
                }`}
              style={styles.button}
            >
              {buttonText || "Подробнее"}
            </button>
          </Link>
        </div>
      </div>
    );
  } else if (variant === "surgery") {
    return (
      <div
        className={`${cardClasses} flex flex-col w-full`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={styles.container}
      >
        {/* Dot in top right corner */}
        <div
          className={`absolute top-2 right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
            isHovered
              ? "bg-white"
              : theme === "light"
              ? "bg-[#F7F7F7]"
              : "bg-[#11363C]"
          }`}
        ></div>

        <div className="flex flex-col h-[280px] sm:h-[300px] md:h-[320px] relative">
          {/* Heading */}
          <h3
            className={`text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 font-medium max-w-[85%] leading-[1.2] ${
              isHovered ? "text-white" : "text-light-text dark:text-dark-text"
            }`}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p
              className={`text-xs sm:text-sm md:text-base max-w-[90%] mb-3 sm:mb-4 ${
                isHovered ? "text-white" : "text-light-text dark:text-dark-text"
              } opacity-80`}
            >
              {typeof description === "string" ? description : ""}
            </p>
          )}

          {/* Features list */}
          <div className="mb-4 sm:mb-5">
            {renderFeatures(features, isHovered, theme)}
          </div>

          {/* Icon - hidden on mobile */}
          <div
            className="md:block absolute w-full h-[10px] bottom-[100px] sm:bottom-[110px] md:bottom-[120px] right-0"
            style={{ color: isHovered ? "white" : finalIconColor }}
          >
            {typeof icon === "string" ? (
              <div
                style={{ color: isHovered ? "white" : finalIconColor }}
                dangerouslySetInnerHTML={{ __html: modifySvgFill(icon) }}
                className={`absolute w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] flex items-center justify-center right-0 top-[-15px] sm:top-[-20px] md:top-[-25px] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.9] ${
                  isHovered ? "scale-110" : ""
                }`}
              />
            ) : (
              <div className="absolute top-[-20px] right-0 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px]">
                {React.isValidElement(icon)
                  ? React.cloneElement(icon as React.ReactElement, {
                      size: isMobile ? 100 : 140,
                      className: `${
                        (icon as React.ReactElement).props.className || ""
                      } transition-transform duration-300 ${
                        isHovered ? "scale-110" : ""
                      }`,
                      color: isHovered ? "white" : undefined,
                    })
                  : icon}
              </div>
            )}
          </div>

          {/* Button */}
          {showButton && (
            <Link href={link || "#"} className="block mt-auto z-[9999]">
              <button
                className={`w-[75%] sm:w-[70%] md:w-[65%] h-[36px] sm:h-[40px] md:h-[45px] rounded-[10px] sm:rounded-[12px] md:rounded-[14px] py-2 sm:py-2.5 px-3 sm:px-4 font-medium transition-colors text-xs sm:text-sm md:text-base
                  ${
                    isHovered
                      ? "bg-white text-light-accent border border-light-accent"
                      : "bg-transparent border border-light-text dark:border-dark-text text-light-text dark:text-dark-text"
                  }`}
                style={styles.button}
              >
                {buttonText || "Подробнее"}
              </button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  const CardContent = () => (
    <div className="flex flex-col h-full ">
      {/* Круглый элемент в правом верхнем углу */}
      <div
        className={`absolute top-3 sm:top-4 right-3 sm:right-4 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full transition-colors duration-300 ${
          isHovered
            ? "bg-white"
            : theme === "light"
            ? "bg-[#F7F7F7]"
            : "bg-[#11363C]"
        }`}
      ></div>

      {/* Бейдж если есть */}
      {badge && (
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
          {typeof badge === "string" ? (
            <span className="px-2 py-1 text-xs font-medium rounded-md bg-light-accent text-white">
              {badge}
            </span>
          ) : (
            badge
          )}
        </div>
      )}

      {/* Заголовок */}
      <div className="flex flex-col flex-grow leading-normal">
        <h3
          className={`${titleSizeClass} w-[70%] h-[60px] font-medium mb-2 ${titleColor} leading-tight`}
          style={styles.title}
        >
          {title}
        </h3>

        {/* Специфичная структура для каждого варианта */}
        {variant === "analysis" ? (
          // Для анализов: заголовок → иконка → подзаголовок → описание
          <div className="flex flex-col justify-between h-full">
            <IconBlock />
            <SubtitleBlock />
            <DescriptionBlock />
          </div>
        ) : variant === "service" ? (
          // Для услуг: заголовок → описание → доп.инфо (количество услуг) → иконка
          <>
            <DescriptionBlock />
            <AdditionalInfoBlock />
            {/* Кнопка будет добавлена внизу карточки */}
          </>
        ) : descriptionBeforeIcon ? (
          // Стандартный режим с описанием перед иконкой
          <>
            <DescriptionBlock />
            <AdditionalInfoBlock />
            <SubtitleBlock />
          </>
        ) : (
          // Стандартный режим с иконкой перед описанием
          <>
            <AdditionalInfoBlock />
            <IconBlock />
            <SubtitleBlock />
          </>
        )}
      </div>

      <div className={"flex items-center flex-col"}>
        {variant === "analysis" ? (
          // Для анализов: заголовок → иконка → подзаголовок → описание
          <div className="flex flex-col justify-between h-full">
            <AdditionalInfoBlock />
          </div>
        ) : variant === "service" ? (
          // Для услуг: заголовок → описание → доп.инфо (количество услуг) → иконка
          <>
            <IconBlock />
            {/* Кнопка будет добавлена внизу карточки */}
          </>
        ) : descriptionBeforeIcon ? (
          // Стандартный режим с описанием перед иконкой
          <>
            <IconBlock />
          </>
        ) : (
          // Стандартный режим с иконкой перед описанием
          <>
            <DescriptionBlock />
          </>
        )}

        {/* Кнопка внизу карточки */}
        {(variant === "service" || (showButton && buttonText)) && (
          <button
            className={`mt-auto px-4 sm:px-6 rounded-2xl font-medium transition-colors
            w-full h-[45px] sm:h-[50px] md:h-[60px] text-sm sm:text-base
            ${
              isHovered
                ? "bg-white text-light-accent"
                : "bg-transparent border border-light-text dark:border-dark-text text-light-text dark:text-dark-text"
            }`}
            style={styles.button}
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* CSS для маркеров списка */}
      <style jsx global>{`
        .marker-accent li::marker {
          color: #00c78b;
          transition: color 0.3s ease;
        }

        ${isHovered
          ? `
        .marker-accent li::marker {
          color: #ffffff;
        }
        `
          : ""}
        @keyframes
          fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .universal-card-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: ${theme === "light" ? "#F7F7F7" : "#11363C"};
          transition: background-color 0.3s ease;
        }

        @media (min-width: 640px) {
          .universal-card-dot {
            top: 15px;
            right: 15px;
            width: 18px;
            height: 18px;
          }
        }

        @media (min-width: 768px) {
          .universal-card-dot {
            top: 20px;
            right: 20px;
            width: 20px;
            height: 20px;
          }
        }

        .universal-card:hover .universal-card-dot {
          background-color: #ffffff;
        }

        .universal-card-icon {
          position: absolute;
          bottom: 20px;
          right: 20px;
          transform: scale(0.7);
        }

        @media (min-width: 640px) {
          .universal-card-icon {
            bottom: 30px;
            right: 30px;
            transform: scale(0.85);
          }
        }

        @media (min-width: 768px) {
          .universal-card-icon {
            bottom: 40px;
            right: 40px;
            transform: scale(1);
          }
        }

        .card-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 24px;
          margin-bottom: 16px;
        }

        @media (min-width: 640px) {
          .card-stats {
            gap: 10px;
            margin-top: 28px;
            margin-bottom: 20px;
          }
        }

        @media (min-width: 768px) {
          .card-stats {
            gap: 12px;
            margin-top: 32px;
            margin-bottom: 24px;
          }
        }
      `}</style>
    </div>
  );

  // Обертка в Link если есть ссылка
  if (link) {
    return (
      <EnhancedLink
        href={link}
        className={`h-full ${
          isMobile ? "min-h-[300px]" : "min-h-[340px] md:min-h-[340px]"
        } w-full`}
        scroll={true}
        onClick={onClick}
      >
        <div
          className={cardClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={styles.container}
        >
          <CardContent />
        </div>
      </EnhancedLink>
    );
  }

  // Обычная карточка
  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={styles.container}
    >
      <CardContent />
    </div>
  );
};
