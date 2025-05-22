/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useThemeStore } from "../../../store/theme";
import { useLanguageStore } from "../../../store/language";
import { useTranslation } from "../../../hooks/useTranslation";
import { translations } from "./translations";
import { CONTACT_INFO } from "../../constants/contact";

// Импорт компонентов иконок
import {
  ArrowDownIcon,
  Clock24Icon,
  LogoIcon,
  UserIcon,
  PhoneIcon,
  WhatsappIcon,
  LogoTextIcon,
} from "../../ui/Icon";

interface Route {
  path: string;
  translationKey: keyof typeof translations.ru.routes;
  hasSubmenu?: boolean;
}

interface HeaderProps {
  routes: Route[];
}

export const TopBar: React.FC<HeaderProps> = ({ routes }) => {
  const { theme } = useThemeStore();
  const { currentLocale, setLocale } = useLanguageStore();
  const { t } = useTranslation(translations);
  const pathname = usePathname();
  const router = useRouter();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [isMouseInSubmenu, setIsMouseInSubmenu] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const contactMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Доступные языки
  const languages = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
  ];

  // Отслеживаем размер экрана и устанавливаем компактный режим при необходимости
  useEffect(() => {
    const checkWindowSize = () => {
      // Используем 991px как точку разделения
      setIsCompactMode(window.innerWidth < 1550 && window.innerWidth >= 991);
    };

    checkWindowSize();
    window.addEventListener("resize", checkWindowSize);

    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  // Блокировка скролла при открытом мобильном меню или других меню
  useEffect(() => {
    const shouldLockScroll = isMobileMenuOpen || isContactMenuOpen;

    if (shouldLockScroll) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;

      // Блокируем скролл
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Восстанавливаем скролл
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // Прокручиваем страницу до прежней позиции
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY.replace("px", "")) * -1);
      }
    }

    return () => {
      // Восстанавливаем при размонтировании
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isContactMenuOpen]);

  // Обработка клика вне выпадающих меню
  // Измените обработчик клика вне выпадающих меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Принудительно закрываем все меню при клике в любое место
      if (!langMenuRef.current?.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (!contactMenuRef.current?.contains(event.target as Node)) {
        setIsContactMenuOpen(false);
      }
      if (!moreMenuRef.current?.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    // Использовать capture: true для перехвата событий до того, как они будут остановлены
    document.addEventListener("mousedown", handleClickOutside, {
      capture: true,
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, {
        capture: true,
      });
    };
  }, []);

  const handleContactClick = () => {
    // Закрываем контактное меню
    setIsContactMenuOpen(false);

    // Находим элемент ContactInfo на странице
    const contactInfoSection = document.getElementById("contact-info-section");

    // Если элемент найден, скроллим к нему
    if (contactInfoSection) {
      contactInfoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const closeMenus = () => {
      // if (isLangMenuOpen) setIsLangMenuOpen(false);
      if (isContactMenuOpen) setIsContactMenuOpen(false);
      if (isMoreMenuOpen) setIsMoreMenuOpen(false);
    };

    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, [isLangMenuOpen, isContactMenuOpen]);
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }
    };
  }, []);

  // Переключение языка
  const handleLanguageChange = (locale: "ru" | "uz") => {
    setLocale(locale);
    setIsLangMenuOpen(false);
  };

  // Переключение мобильного меню
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Переключение меню "Ещё"
  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  // Обработка ховера для роутов
  const handleRouteHover = (routePath: string) => {
    // Очищаем предыдущий таймер если он есть
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }

    // Только для "О клинике"
    if (routes.find((r) => r.path === routePath)?.hasSubmenu) {
      setHoveredRoute(routePath);
    }
  };

  const handleAuthClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Проверяем, есть ли токен авторизации
    const token = localStorage.getItem("authToken");

    // Если токен есть, перенаправляем на профиль, иначе на страницу логина
    if (token) {
      router.push("/account/profile");
    } else {
      router.push("/account/login");
    }
  };

  // Обработка ухода с роута
  const handleRouteLeave = () => {
    // Не закрываем сразу, а устанавливаем таймер
    if (!isMouseInSubmenu && hoveredRoute) {
      submenuTimeoutRef.current = setTimeout(() => {
        if (!isMouseInSubmenu) {
          setHoveredRoute(null);
        }
      }, 1000); // 1 секунда задержки
    }
  };

  // Обработка входа мыши в подменю
  const handleSubmenuEnter = () => {
    setIsMouseInSubmenu(true);
    // Если есть активный таймер, очищаем его
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
      submenuTimeoutRef.current = null;
    }
  };

  // Обработка выхода мыши из подменю
  const handleSubmenuLeave = () => {
    setIsMouseInSubmenu(false);
    setHoveredRoute(null);
  };

  // В компактном режиме показываем только первые несколько роутов, остальные в "Ещё"
  const visibleRoutes = isCompactMode ? routes.slice(0, 3) : routes;
  const hiddenRoutes = isCompactMode ? routes.slice(3) : [];
  const headerRef = useRef<HTMLDivElement>(null);
  return (
    <header
      id="page-header"
      ref={headerRef}
      className={`px-8 py-4 rounded-2xl ${
        theme === "light" ? "bg-light-block" : "bg-dark-block"
      } shadow-sm transition-colors duration-300 w-full`}
    >
      <div>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Лого */}
          <div className="flex-shrink-0 flex items-center">
            <Link href={"/"} className="mr-2 flex items-center gap-3">
              <LogoIcon size={40} />
              <LogoTextIcon
                size={90}
                color={theme === "light" ? "#094A54" : "white"}
              />
            </Link>
          </div>

          {/* Навигация для десктопа - на широком экране больше компактность */}
          <nav className="hidden tablet:flex xl:flex space-x-2 xl:space-x-6">
            {visibleRoutes.map((route) => (
              <div
                key={route.path}
                className="relative"
                onMouseEnter={() => handleRouteHover(route.path)}
                onMouseLeave={handleRouteLeave}
              >
                <Link
                  href={route.path}
                  className={`
                  p-3 xl:p-4 font-regular text-lg xl:text-xl transition-colors duration-300 flex items-center rounded-2xl border-2 border-transparent
                  ${
                    pathname === route.path
                      ? `${
                          theme === "light" ? "bg-light-bg" : "bg-dark-bg"
                        } border-light-accent`
                      : "hover:border-light-accent/30 hover:text-light-accent"
                  }
                `}
                >
                  {t(`routes.${route.translationKey}`)}
                  {route.hasSubmenu && (
                    <ArrowDownIcon
                      className="ml-1"
                      color={theme === "light" ? "#094A54" : "white"}
                    />
                  )}
                </Link>

                {/* Выпадающее подменю только для "О клинике" */}
                {route.hasSubmenu && hoveredRoute === route.path && (
                  <div
                    className={`absolute left-0 mt-8 w-60 rounded-2xl shadow-lg z-10 ${
                      theme === "light" ? "bg-light-block" : "bg-dark-block"
                    }`}
                    ref={submenuRef}
                    onMouseEnter={handleSubmenuEnter}
                    onMouseLeave={handleSubmenuLeave}
                  >
                    <Link
                      href={`${route.path}`}
                      className={`block px-4 py-3 ${
                        theme === "light" ? "text-light-text" : "text-dark-text"
                      }`}
                    >
                      {t("header.menuItems.aboutClinic")}
                    </Link>
                    <Link
                      href={`${route.path}/doctors`}
                      className={`block px-4 py-3 ${
                        theme === "light" ? "text-light-text" : "text-dark-text"
                      }`}
                    >
                      {t("header.menuItems.ourDoctors")}
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Кнопка "Ещё" для компактного режима */}
            {isCompactMode && hiddenRoutes.length > 0 && (
              <div ref={moreMenuRef} className="relative">
                <button
                  onClick={toggleMoreMenu}
                  className={`
                  p-3 xl:p-4 font-regular text-lg xl:text-xl transition-colors duration-300 flex items-center rounded-2xl border-2 border-transparent
                  ${
                    isMoreMenuOpen
                      ? `${
                          theme === "light" ? "bg-light-bg" : "bg-dark-bg"
                        } border-light-accent`
                      : "hover:border-light-accent/30"
                  }
                `}
                >
                  {t("header.menuItems.more")}
                  <ArrowDownIcon
                    className={`ml-1 transition-transform duration-300 ${
                      isMoreMenuOpen ? "transform rotate-180" : ""
                    }`}
                    color={theme === "light" ? "#094A54" : "white"}
                  />
                </button>
                {/* Выпадающее меню "Ещё" */}
                {isMoreMenuOpen && (
                  <div
                    className={`absolute right-0 mt-8 w-60 rounded-2xl shadow-lg z-10 ${
                      theme === "light" ? "bg-light-block" : "bg-dark-block"
                    }`}
                  >
                    {hiddenRoutes.map((route) => (
                      <div key={route.path}>
                        {route.hasSubmenu ? (
                          <div>
                            <button
                              className={`
                              w-full text-left px-4 py-3 flex justify-between items-center
                              ${
                                theme === "light"
                                  ? "text-light-text"
                                  : "text-dark-text"
                              }
                              ${
                                pathname.startsWith(route.path)
                                  ? "bg-light-accent/10"
                                  : ""
                              }
                            `}
                              onClick={() => {
                                if (route.path === hoveredRoute) {
                                  setHoveredRoute(null);
                                } else {
                                  setHoveredRoute(route.path);
                                }
                              }}
                            >
                              {t(`routes.${route.translationKey}`)}
                              <ArrowDownIcon
                                className={`transition-transform duration-300 ${
                                  hoveredRoute === route.path
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                                color={theme === "light" ? "#094A54" : "white"}
                              />
                            </button>

                            {/* Подменю для "О клинике" внутри "Ещё" */}
                            {hoveredRoute === route.path && (
                              <div>
                                <Link
                                  href={`${route.path}`}
                                  className={`block px-8 py-3 ${
                                    theme === "light"
                                      ? "text-light-text"
                                      : "text-dark-text"
                                  } ${
                                    pathname === `${route.path}`
                                      ? "bg-light-accent/10"
                                      : ""
                                  }`}
                                  onClick={() => setIsMoreMenuOpen(false)}
                                >
                                  {t("header.menuItems.ourServices")}
                                </Link>
                                <Link
                                  href={`${route.path}/doctors`}
                                  className={`block px-8 py-3 ${
                                    theme === "light"
                                      ? "text-light-text"
                                      : "text-dark-text"
                                  } ${
                                    pathname === `${route.path}/doctors`
                                      ? "bg-light-accent/10"
                                      : ""
                                  }`}
                                  onClick={() => setIsMoreMenuOpen(false)}
                                >
                                  {t("header.menuItems.ourDoctors")}
                                </Link>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            href={route.path}
                            className={`block px-4 py-3 ${
                              theme === "light"
                                ? "text-light-text"
                                : "text-dark-text"
                            } ${
                              pathname === route.path
                                ? "bg-light-accent/10"
                                : ""
                            }`}
                            onClick={() => setIsMoreMenuOpen(false)}
                          >
                            {t(`routes.${route.translationKey}`)}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Навигация для среднего экрана - сжатая версия */}

          {/* Правая часть шапки для десктопа */}
          <div className="hidden tablet:flex items-center">
            {/* Кнопка связаться с нами */}
            <div className="relative" ref={contactMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (document.getElementById("contact-info-section")) {
                    handleContactClick();
                  } else {
                    setIsContactMenuOpen(!isContactMenuOpen);
                  }
                }}
                className={`
      flex items-center justify-center gap-2 xl:gap-4 mr-2 xl:mr-6 
      bg-light-accent hover:bg-light-accent/90
      text-white h-[60px] lg:w-[200px] xl:w-[250px] px-4 py-2 rounded-2xl
      transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md
    `}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full">
                  <Clock24Icon size={30} />
                </span>
                <span className="hidden lg:inline-block text-base xl:text-lg">
                  {t("header.contactUs")}
                </span>
              </button>

              {/* Выпадающее меню для связи */}
              {isContactMenuOpen && (
                <div
                  className={`
      absolute right-6 mt-7 w-[250px] rounded-2xl shadow-lg z-10 
      ${theme === "light" ? "bg-light-block" : "bg-dark-block"}
      animate-fadeIn
    `}
                >
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/[\s()-]/g, "")}`}
                    className={`
          flex items-center px-4 py-3 
          ${
            theme === "light"
              ? "text-light-text hover:bg-light-bg"
              : "text-dark-text hover:bg-dark-bg"
          } 
          transition-colors duration-200 rounded-t-2xl
        `}
                  >
                    <div className="w-8 h-8 mr-4 rounded-full flex items-center justify-center bg-light-accent text-white">
                      <PhoneIcon size={16} />
                    </div>
                    {CONTACT_INFO.phone}
                  </a>
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(
                      /[\s()-]/g,
                      ""
                    )}`}
                    className={`
          flex items-center px-4 py-3 
          ${
            theme === "light"
              ? "text-light-text hover:bg-light-bg"
              : "text-dark-text hover:bg-dark-bg"
          } 
          transition-colors duration-200 rounded-b-2xl
        `}
                  >
                    <div className="w-8 h-8 mr-4 rounded-full flex items-center justify-center bg-light-accent text-white">
                      <WhatsappIcon size={16} />
                    </div>
                    {CONTACT_INFO.whatsapp}
                  </a>
                </div>
              )}
            </div>

            {/* Выбор языка */}
            <div
              ref={langMenuRef}
              className="relative"
              onClick={handleMenuClick}
            >
              <button
                className={`
      flex items-center gap-2 mr-4 justify-center h-[60px] w-[75px] rounded-2xl
      ${
        theme === "light"
          ? "border border-light-accent hover:bg-light-accent/10 text-light-text"
          : "border border-dark-accent hover:bg-dark-accent/10 text-dark-text"
      } 
      transition-all duration-300 transform hover:scale-[1.02]
    `}
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              >
                <span>{currentLocale.toUpperCase()}</span>
                <ArrowDownIcon
                  className={`ml-1 transition-transform duration-300 ${
                    isLangMenuOpen ? "transform rotate-180" : ""
                  }`}
                  color={theme === "light" ? "#094A54" : "white"}
                />
              </button>

              {/* Выпадающее меню языков */}
              {isLangMenuOpen && (
                <div
                  className={`
      absolute right-2 mt-7 w-[84px] rounded-2xl shadow-lg z-10
      ${theme === "light" ? "bg-light-block" : "bg-dark-block"}
      animate-fadeIn
    `}
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`
            flex items-center w-full px-4 py-3 text-left
            ${
              theme === "light"
                ? "text-light-text hover:bg-light-bg"
                : "text-dark-text hover:bg-dark-bg"
            } 
            ${currentLocale === lang.code ? "font-medium" : "font-normal"}
            ${lang.code === languages[0].code ? "rounded-t-2xl" : ""}
            ${
              lang.code === languages[languages.length - 1].code
                ? "rounded-b-2xl"
                : ""
            }
            transition-colors duration-200
          `}
                      onClick={() =>
                        handleLanguageChange(lang.code as "ru" | "uz")
                      }
                    >
                      <div className="h-6 mr-2 flex items-center">
                        {lang.code === "uz" && (
                          <span className="text-sm">
                            <img
                              src="/icon/icon-uzbekistan.svg"
                              className="w-[20px] h-[14px]"
                              alt="uz"
                            />
                          </span>
                        )}
                        {lang.code === "ru" && (
                          <span className="text-sm">
                            <img
                              src="/icon/icon-russia.svg"
                              className="w-[20px] h-[14px]"
                              alt="ru"
                            />
                          </span>
                        )}
                      </div>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="#"
              onClick={handleAuthClick}
              className={`
      h-[60px] w-[60px] rounded-2xl 
      bg-light-accent hover:bg-light-accent/90
      text-white flex items-center justify-center
      transition-all duration-300 transform hover:scale-[1.05] hover:shadow-md
    `}
            >
              <UserIcon size={30} color={"#ffffff"} />
            </Link>
          </div>

          {/* Мобильное меню иконка */}
          <div className="tablet:hidden flex items-center space-x-4">
            {/* Бургер меню */}
            <button
              className={`${
                theme === "light" ? "text-light-text" : "text-dark-text"
              }`}
              onClick={toggleMobileMenu}
            >
              <svg
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={"M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню - фиксированная позиция, чтобы не двигать контент */}
      <div
        className={`fixed inset-0 z-50 tablet:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Анимированный фон */}
        <div
          className={`absolute inset-0 backdrop-blur-lg transition-all duration-300 ${
            isMobileMenuOpen ? "bg-black/50" : "bg-black/0"
          }`}
          onClick={toggleMobileMenu}
        />

        {/* Контент меню с анимацией */}
        <div
          className={`absolute inset-0 flex flex-col ${
            theme === "light" ? "bg-light-block" : "bg-dark-block"
          } transform transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Шапка меню с логотипом и крестиком */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <Link
              href={"/"}
              className="flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogoIcon size={32} />
              <LogoTextIcon
                size={75}
                color={theme === "light" ? "#094A54" : "white"}
              />
            </Link>

            <button
              className={`${
                theme === "light" ? "text-light-text" : "text-dark-text"
              } p-1 rounded-full transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-0" : "rotate-180"
              }`}
              onClick={toggleMobileMenu}
            >
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Основное содержимое с прокруткой */}
          <div className="flex-1 overflow-y-auto">
            {/* Навигация */}
            <div className="p-6">
              <div className="space-y-3">
                {routes.map((route, index) => (
                  <div
                    key={route.path}
                    className={`mb-2 transform transition-all duration-500 ${
                      isMobileMenuOpen ? "animate-slideIn" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {route.hasSubmenu ? (
                      <div>
                        <button
                          className={`
                          relative flex justify-between items-center w-full p-5 text-lg font-medium rounded-2xl overflow-hidden
                          ${
                            pathname.startsWith(route.path)
                              ? "before:absolute before:inset-0 before:bg-light-accent/10 before:rounded-2xl"
                              : `${theme === "light" ? "" : ""}`
                          }
                          ${
                            theme === "light"
                              ? "text-light-text"
                              : "text-dark-text"
                          }
                        `}
                          onClick={() => {
                            if (route.path === hoveredRoute) {
                              setHoveredRoute(null);
                            } else {
                              setHoveredRoute(route.path);
                            }
                          }}
                        >
                          <span className="relative z-10">
                            {t(`routes.${route.translationKey}`)}
                          </span>
                          <ArrowDownIcon
                            className={`relative z-10 transition-transform duration-300 ${
                              hoveredRoute === route.path
                                ? "transform rotate-180"
                                : ""
                            }`}
                            color={theme === "light" ? "#094A54" : "white"}
                          />
                          {pathname.startsWith(route.path) && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-light-accent"></span>
                          )}
                        </button>

                        {/* Анимированное подменю */}
                        <div
                          className={`overflow-hidden transition-all duration-500 ease-in-out pl-4
                          ${
                            hoveredRoute === route.path
                              ? "max-h-40 opacity-100 mt-2"
                              : "max-h-0 opacity-0"
                          }
                        `}
                        >
                          <Link
                            href={`${route.path}`}
                            className={`
                            relative block p-5 mb-2 rounded-2xl overflow-hidden
                            ${
                              pathname === `${route.path}`
                                ? "before:absolute before:inset-0 before:bg-light-accent/10 before:rounded-2xl"
                                : ""
                            }
                            ${
                              theme === "light"
                                ? "text-light-text"
                                : "text-dark-text"
                            }
                          `}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="relative z-10">
                              {t("header.menuItems.aboutClinic") || "О нас"}
                            </span>
                            {pathname === `${route.path}` && (
                              <span className="absolute left-0 top-0 h-full w-1 bg-light-accent"></span>
                            )}
                          </Link>
                          <Link
                            href={`${route.path}/doctors`}
                            className={`
                            relative block p-5 rounded-2xl overflow-hidden
                            ${
                              pathname === `${route.path}/doctors`
                                ? "before:absolute before:inset-0 before:bg-light-accent/10 before:rounded-2xl"
                                : ""
                            }
                            ${
                              theme === "light"
                                ? "text-light-text"
                                : "text-dark-text"
                            }
                          `}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="relative z-10">
                              {t("header.menuItems.ourDoctors") || "Врачи"}
                            </span>
                            {pathname === `${route.path}/doctors` && (
                              <span className="absolute left-0 top-0 h-full w-1 bg-light-accent"></span>
                            )}
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={route.path}
                        className={`
                        relative flex justify-between items-center w-full p-5 text-lg font-medium rounded-2xl overflow-hidden
                        ${
                          pathname === route.path
                            ? "before:absolute before:inset-0 before:bg-light-accent/10 before:rounded-2xl"
                            : ""
                        }
                        ${
                          theme === "light"
                            ? "text-light-text"
                            : "text-dark-text"
                        }
                      `}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="relative z-10">
                          {t(`routes.${route.translationKey}`)}
                        </span>
                        {pathname === route.path && (
                          <span className="absolute left-0 top-0 h-full w-1 bg-light-accent"></span>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Контакты и настройки */}
            <div className="mx-6 mb-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              {/* Языки */}
              <div
                className={`mb-8 ${isMobileMenuOpen ? "animate-slideIn" : ""}`}
                style={{ animationDelay: "600ms" }}
              >
                <h3
                  className={`${
                    theme === "light" ? "text-light-text" : "text-dark-text"
                  } text-sm uppercase font-medium mb-4`}
                >
                  {t("header.language") || "Язык"}
                </h3>
                <div className="flex gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`relative overflow-hidden flex items-center justify-center gap-3 p-4 rounded-2xl transition-all duration-300
                      ${
                        currentLocale === lang.code
                          ? "bg-light-accent text-white shadow-lg shadow-light-accent/20"
                          : `${
                              theme === "light"
                                ? "bg-light-bg text-light-text"
                                : "bg-dark-bg text-dark-text"
                            }`
                      }`}
                      onClick={() =>
                        handleLanguageChange(lang.code as "ru" | "uz")
                      }
                    >
                      <div className="flex items-center justify-center">
                        {lang.code === "uz" && (
                          <img
                            src="/icon/icon-uzbekistan.svg"
                            className="w-[24px] h-[16px]"
                            alt="uz"
                          />
                        )}
                        {lang.code === "ru" && (
                          <img
                            src="/icon/icon-russia.svg"
                            className="w-[24px] h-[16px]"
                            alt="ru"
                          />
                        )}
                      </div>
                      <span className="text-lg">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={`mb-8 ${isMobileMenuOpen ? "animate-slideIn" : ""}`}
                style={{ animationDelay: "500ms" }}
              >
                <h3
                  className={`${
                    theme === "light" ? "text-light-text" : "text-dark-text"
                  } text-sm uppercase font-medium mb-4`}
                >
                  Личный кабинет
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/account/login"
                    className={`flex items-center p-4 rounded-2xl bg-light-accent/5 transform transition-all duration-300 hover:scale-[1.02]
        ${theme === "light" ? "text-light-text" : "text-dark-text"}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-12 h-12 mr-4 rounded-full flex items-center justify-center bg-light-accent text-white shadow-lg shadow-light-accent/20">
                      <UserIcon size={18} color={"#ffffff"} />
                    </div>
                    <span className="text-lg">Вход в кабинет</span>
                  </Link>
                </div>
              </div>
              {/* Контакты */}
              <div
                className={`${isMobileMenuOpen ? "animate-slideIn" : ""}`}
                style={{ animationDelay: "700ms" }}
              >
                <h3
                  className={`${
                    theme === "light" ? "text-light-text" : "text-dark-text"
                  } text-sm uppercase font-medium mb-4`}
                >
                  {t("header.contactUs")}
                </h3>
                <div className="space-y-3">
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/[\s()-]/g, "")}`}
                    className={`flex items-center p-4 rounded-2xl bg-light-accent/5 transform transition-all duration-300 hover:scale-[1.02]
                    ${
                      theme === "light" ? "text-light-text" : "text-dark-text"
                    }`}
                  >
                    <div className="w-12 h-12 mr-4 rounded-full flex items-center justify-center bg-light-accent text-white shadow-lg shadow-light-accent/20">
                      <PhoneIcon size={18} />
                    </div>
                    <span className="text-lg">{CONTACT_INFO.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(
                      /[\s()-]/g,
                      ""
                    )}`}
                    className={`flex items-center p-4 rounded-2xl bg-light-accent/5 transform transition-all duration-300 hover:scale-[1.02]
                   ${theme === "light" ? "text-light-text" : "text-dark-text"}`}
                  >
                    <div className="w-12 h-12 mr-4 rounded-full flex items-center justify-center bg-light-accent text-white shadow-lg shadow-light-accent/20">
                      <WhatsappIcon size={18} />
                    </div>
                    <span className="text-lg">{CONTACT_INFO.whatsapp}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Языковое меню для мобильных устройств - фиксированная позиция */}
      {isLangMenuOpen && (
        <div className="tablet:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsLangMenuOpen(false)}
          ></div>
          <div className="fixed top-16 right-4 w-48 rounded-2xl shadow-lg z-50">
            <div
              className={`py-1 rounded-2xl overflow-hidden ${
                theme === "light" ? "bg-light-block" : "bg-dark-block"
              }`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`flex items-center w-full px-4 py-3 text-left text-sm
                 ${theme === "light" ? "text-light-text" : "text-dark-text"} ${
                    currentLocale === lang.code ? "bg-light-accent/10" : ""
                  }`}
                  onClick={() => handleLanguageChange(lang.code as "ru" | "uz")}
                >
                  <div className="w-8 h-6 mr-2 flex items-center">
                    {lang.code === "uz" && (
                      <img
                        src="/icon/icon-uzbekistan.svg"
                        className="w-[20px] h-[14px]"
                        alt="uz"
                      />
                    )}
                    {lang.code === "ru" && (
                      <img
                        src="/icon/icon-russia.svg"
                        className="w-[20px] h-[14px]"
                        alt="ru"
                      />
                    )}
                  </div>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Выпадающее меню для связи на мобильном - фиксированная позиция */}
      {isContactMenuOpen && (
        <div className="tablet:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setIsContactMenuOpen(false)}
          ></div>
          <div className="fixed top-16 right-4 w-56 rounded-2xl shadow-lg z-50">
            <div
              className={`py-1 rounded-2xl overflow-hidden ${
                theme === "light" ? "bg-light-block" : "bg-dark-block"
              }`}
            >
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/[\s()-]/g, "")}`}
                className={`flex items-center px-4 py-3 text-sm ${
                  theme === "light" ? "text-light-text" : "text-dark-text"
                }`}
              >
                <div className="w-8 h-8 mr-4 rounded-full flex items-center justify-center bg-light-accent text-white">
                  <PhoneIcon size={16} />
                </div>
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp.replace(
                  /[\s()-]/g,
                  ""
                )}`}
                className={`flex items-center px-4 py-3 text-sm ${
                  theme === "light" ? "text-light-text" : "text-dark-text"
                }`}
              >
                <div className="w-8 h-8 mr-4 rounded-full flex items-center justify-center bg-light-accent text-white">
                  <WhatsappIcon size={16} />
                </div>
                {CONTACT_INFO.whatsapp}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
