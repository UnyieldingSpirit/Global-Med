"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useThemeStore } from "@/src/store/theme";
import { useLanguageStore } from "@/src/store/language";
import { useTranslation } from "@/src/hooks/useTranslation";
import {
  CalendarIcon,
  GlobeIcon,
  LabIcon,
  LocationIconk2,
  LogoutIcon,
  PulseIcon,
  UserIcon,
} from "../ui/Icon";
import Modal from "./Modal/Modal";

const translations = {
  ru: {
    myAppointments: "Мои записи",
    analyses: "Анализы",
    profile: "Профиль",
    doctors: "Врачи",
    backToMainSite: "Перейти на основной сайт",
    changeLanguage: "Сменить язык",
    logout: "Выйти из личного кабинета",
    personalAccount: "Личный кабинет",
    logoutConfirmation: "Подтверждение выхода",
    logoutConfirmationMessage:
      "Вы действительно хотите выйти из личного кабинета?",
    cancel: "Отмена",
    exit: "Выйти",
  },
  uz: {
    myAppointments: "Mening yozuvlarim",
    analyses: "Tahlillar",
    profile: "Profil",
    doctors: "Shifokorlar",
    backToMainSite: "Asosiy saytga o'tish",
    changeLanguage: "Tilni o'zgartirish",
    logout: "Shaxsiy kabinetdan chiqish",
    personalAccount: "Shaxsiy kabinet",
    logoutConfirmation: "Chiqishni tasdiqlash",
    logoutConfirmationMessage:
      "Siz rostdan ham shaxsiy kabinetdan chiqmoqchimisiz?",
    cancel: "Bekor qilish",
    exit: "Chiqish",
  },
};

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useThemeStore();
  const { currentLocale, setLocale } = useLanguageStore();
  const { t } = useTranslation(translations);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const navItems = [
    {
      path: "/account/appointments",
      label: "myAppointments",
      icon: "calendar",
    },
    { path: "/account/analyses", label: "analyses", icon: "lab" },
    { path: "/account/profile", label: "profile", icon: "user" },
    { path: "/account/doctors", label: "doctors", icon: "heartPulse" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderIcon = (iconName: string, isActive: boolean) => {
    const iconColor = isActive
      ? "#00c78b"
      : theme === "light"
      ? "#094A54"
      : "#ffffff";

    const icons = {
      calendar: <CalendarIcon size={20} color={iconColor} />,
      lab: <LabIcon size={20} color={iconColor} />,
      user: <UserIcon size={20} color={iconColor} />,
      heartPulse: <PulseIcon size={20} color={iconColor} />,
      web: <LocationIconk2 size={20} color={iconColor} />,
      globe: <GlobeIcon size={20} color={iconColor} />,
      logout: (
        <LogoutIcon
          size={20}
          color={iconColor === "#ffffff" ? "#FF3B30" : "#FF3B30"}
        />
      ),
    };

    return icons[iconName as keyof typeof icons] || null;
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    return (window.location.pathname = "/account/login");
  };

  const renderSidebarContent = () => (
    <>
      <nav className="space-y-2 ">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
               flex items-center 
               py-3 px-4 
               
               rounded-xl 
               transition-colors 
               hover:bg-gray-100 dark:hover:bg-gray-800
               ${isActive ? "bg-light-accent/10" : ""}
             `}
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                {renderIcon(item.icon, isActive)}
              </div>
              <span
                className={`
                 ml-4 
                 text-lg 
                 ${isActive ? "text-light-accent font-medium" : ""}
               `}
              >
                {t(item.label)}
              </span>
            </Link>
          );
        })}
      </nav>

      <hr className="border-gray-200 dark:border-gray-700 my-6" />

      <div className="space-y-2">
        <Link
          href="/"
          className="
           flex items-center 
           py-3 px-4 
           rounded-xl 
           transition-colors 
           hover:bg-gray-100 dark:hover:bg-gray-800
         "
        >
          <div className="w-8 h-8 flex items-center justify-center">
            {renderIcon("web", false)}
          </div>
          <span className="ml-4 text-lg">{t("backToMainSite")}</span>
        </Link>

        <div ref={languageRef} className="relative">
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="
             flex items-center w-full 
             py-3 px-4 
             rounded-xl 
             transition-colors 
             hover:bg-gray-100 dark:hover:bg-gray-800
           "
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {renderIcon("globe", false)}
            </div>
            <span className="ml-4 text-lg">{t("changeLanguage")}</span>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`ml-auto transition-transform ${
                isLanguageOpen ? "rotate-180" : ""
              }`}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9L12 15L18 9" />
            </svg>
          </button>

          {isLanguageOpen && (
            <div
              className={`
               absolute left-0 right-0 mt-1 
               rounded-xl shadow-lg 
               ${theme === "light" ? "bg-white" : "bg-dark-block"} 
               border border-gray-200 dark:border-gray-700 
               overflow-hidden z-10
             `}
            >
              <button
                onClick={() => {
                  setLocale("ru");
                  setIsLanguageOpen(false);
                }}
                className={`
                 flex items-center w-full 
                 px-4 py-3 
                 transition-colors 
                 hover:bg-gray-100 dark:hover:bg-gray-800
               `}
              >
                <span className="w-6 h-4 mr-3 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                  <img
                    src="/icon/icon-russia.svg"
                    className="w-full h-full object-cover"
                    alt="Русский"
                  />
                </span>
                Русский
              </button>
              <button
                onClick={() => {
                  setLocale("uz");
                  setIsLanguageOpen(false);
                }}
                className={`
                 flex items-center w-full 
                 px-4 py-3 
                 transition-colors 
                 hover:bg-gray-100 dark:hover:bg-gray-800
               `}
              >
                <span className="w-6 h-4 mr-3 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                  <img
                    src="/icon/icon-uzbekistan.svg"
                    className="w-full h-full object-cover"
                    alt="O'zbek"
                  />
                </span>
                O'zbek
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="
           flex items-center w-full 
           py-3 px-4 
           rounded-xl 
           transition-colors 
           hover:bg-gray-100 dark:hover:bg-gray-800 
           text-red-500
         "
        >
          <div className="w-8 h-8 flex items-center justify-center">
            {renderIcon("logout", false)}
          </div>
          <span className="ml-4 text-lg">{t("logout")}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Кнопка для планшетного меню */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="hidden max-md:block md:max-lg:block h-[140px] bg-light-accent p-2 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Выдвижное планшетное меню */}
      <div
        ref={sidebarRef}
        className={`
         fixed top-0 left-0 w-[80%] max-w-[375px] h-full 
         bg-white dark:bg-dark-block 
         transform transition-transform duration-300 ease-in-out 
         z-50 md:max-lg:block hidden
         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
       `}
      >
        <div className="p-6">{renderSidebarContent()}</div>
      </div>

      {/* Десктопное меню */}
      <aside
        className={`
         hidden lg:block 
         w-[375px]
         bg-white dark:bg-dark-block 
         rounded-2xl shadow-sm 
         p-6 
         h-fit 
         ${theme === "light" ? "text-light-text" : "text-dark-text"}
       `}
      >
        {renderSidebarContent()}
      </aside>

      {/* Модальное окно подтверждения выхода */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title={t("logoutConfirmation")}
        position="center"
        size="sm"
        theme="danger"
        showCloseButton={false}
      >
        <p className="mb-6">{t("logoutConfirmationMessage")}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => {
              setIsLogoutModalOpen(false);
              handleLogout();
            }}
            className="px-4 py-2 rounded-xl bg-red-500 text-white"
          >
            {t("exit")}
          </button>
        </div>
      </Modal>
    </>
  );
}
