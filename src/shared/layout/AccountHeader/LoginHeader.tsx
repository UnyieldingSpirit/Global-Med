"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/src/store/theme";
import { useLanguageStore } from "@/src/store/language";
import { useTranslation } from "@/src/hooks/useTranslation";
import {
  LogoutIcon,
  LogoIcon,
  LogoTextIcon,
  UserIcon,
  NotificationIcon,
  CalendarIcon,
  LabIcon,
  PulseIcon,
  LocationIconk2,
  GlobeIcon,
} from "@/src/shared/ui/Icon";

// Translations
const translations = {
  ru: {
    appointment: "Записаться на прием",
    profile: "Профиль",
    logout: "Выйти из личного кабинета",
    notifications: "Уведомления",
    backToMainSite: "Перейти на основной сайт",
    appointmentDetails:
      "С деталями записи можете ознакомиться на странице «Мои записи».",
    menu: "Меню",
    account: "Личный кабинет",
    myAppointments: "Мои записи",
    myTests: "Анализы",
    doctors: "Врачи",
    changeLanguage: "Сменить язык",
  },
  uz: {
    appointment: "Qabulga yozilish",
    profile: "Profil",
    logout: "Shaxsiy kabinetdan chiqish",
    notifications: "Bildirishnomalar",
    backToMainSite: "Asosiy saytga o'tish",
    appointmentDetails:
      'Qabulga yozilish tafsilotlari bilan "Mening yozuvlarim" sahifasida tanishishingiz mumkin.',
    menu: "Menyu",
    account: "Shaxsiy kabinet",
    myAppointments: "Mening yozuvlarim",
    myTests: "Mening tahlillarim",
    doctors: "Shifokorlar",
    changeLanguage: "Tilni o'zgartirish",
  },
};

// Mock notification type
interface Notification {
  id: string;
  date: string;
  time: string;
  message: string;
  isRead: boolean;
}

export default function AccountHeader() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { currentLocale, setLocale } = useLanguageStore();
  const { t } = useTranslation(translations);

  // State for mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for dropdowns
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Refs for dropdowns
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Languages available
  const languages = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
  ];

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      date: "19 мая, 2025",
      time: "20:31",
      message:
        "Ваша запись на прием к врачу Мирбабаева Саодат Аманбаевна была подтверждена.",
      isRead: false,
    },
    {
      id: "2",
      date: "19 мая, 2025",
      time: "20:31",
      message:
        "Ваша запись на прием к врачу Ибрагимов Рустам Искандарович была подтверждена.",
      isRead: false,
    },
    {
      id: "3",
      date: "19 мая, 2025",
      time: "20:31",
      message:
        "Ваша запись на прием к врачу Алиева Нигора Рахимовна была подтверждена.",
      isRead: true,
    },
    {
      id: "4",
      date: "18 мая, 2025",
      time: "15:45",
      message:
        "Результаты ваших анализов готовы. Вы можете ознакомиться с ними в личном кабинете.",
      isRead: true,
    },
    {
      id: "5",
      date: "17 мая, 2025",
      time: "09:20",
      message:
        "Напоминаем о записи на прием завтра в 10:00 к врачу Рахманов Анвар Тахирович.",
      isRead: true,
    },
  ]);

  // State for showing limited notifications
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const notificationsToShow = showAllNotifications
    ? notifications
    : notifications.slice(0, 1);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Lock scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  // Check for unread notifications
  useEffect(() => {
    const hasUnread = notifications.some(
      (notification) => !notification.isRead
    );
    setHasUnreadNotifications(hasUnread);
  }, [notifications]);

  // Handle logout

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    return (window.location.pathname = "/account/login");
  };

  // Toggle notification dropdown
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false);
    setIsLangMenuOpen(false);
  };

  // Toggle profile dropdown
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false);
    setIsLangMenuOpen(false);
  };

  // Toggle language dropdown
  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  };

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle marking all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  // Change language
  const handleLanguageChange = (locale: "ru" | "uz") => {
    setLocale(locale);
    setIsLangMenuOpen(false);
  };

  // Close all menus
  const closeMenus = () => {
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
    setIsSidebarOpen(false);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="w-full">
      <div
        className={`max-w-[1590px] rounded-2xl ${
          theme === "light" ? "bg-light-block" : "bg-dark-block"
        } px-8 py-6 flex justify-between items-center`}
      >
        {/* Logo section */}
        <Link
          href="/account"
          className="flex items-center gap-1 sm:gap-2 h-[56px]"
        >
          <LogoIcon size={40} />
          <LogoTextIcon
            size={90}
            color={theme === "light" ? "#094A54" : "white"}
          />
        </Link>

        {/* Desktop right section with buttons */}
        <div className="hidden md:flex items-center gap-2 sm:gap-4">
          {/* Appointment button */}
          <Link
            href="/account/appointment"
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-light-accent text-white rounded-xl sm:rounded-2xl hover:bg-light-accent/90 transition-colors"
          >
            <span className="text-[14px] sm:text-[16px] whitespace-nowrap">
              {t("appointment")}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              className="sm:w-[20px] sm:h-[20px]"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
          </Link>

          {/* Notifications dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              className={`relative p-2 sm:p-3 rounded-full transition-colors ${
                isNotificationsOpen
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={toggleNotifications}
              aria-label={t("notifications")}
            >
              <NotificationIcon
                size={30}
                color={theme === "light" ? "#094A54" : "white"}
              />
            </button>

            {isNotificationsOpen && (
              <div
                className={`absolute right-0 mt-2 w-[320px] sm:w-[400px] rounded-2xl shadow-lg ${
                  theme === "light" ? "bg-white" : "bg-dark-block"
                } border border-gray-200 dark:border-gray-700 overflow-hidden z-50`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-light-text dark:text-dark-text">
                    {t("notifications")}
                  </h3>
                  {hasUnreadNotifications && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-light-accent hover:underline"
                    >
                      Прочитать все
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {(showAllNotifications
                        ? notifications
                        : notificationsToShow
                      ).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 ${
                            notification.isRead ? "" : "bg-light-accent/5"
                          }`}
                        >
                          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                            <span>{notification.date}</span>
                            <span>{notification.time}</span>
                          </div>
                          <p className="text-light-text dark:text-dark-text">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t("appointmentDetails")}
                          </p>
                        </div>
                      ))}

                      {!showAllNotifications && notifications.length > 1 && (
                        <div className="p-4 text-center">
                          <button
                            onClick={() => setShowAllNotifications(true)}
                            className="text-light-accent hover:underline text-sm font-medium"
                          >
                            Показать все ({notifications.length})
                          </button>
                        </div>
                      )}

                      {showAllNotifications && notifications.length > 3 && (
                        <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => {
                              console.log("Load more notifications");
                            }}
                            className="text-light-accent hover:underline text-sm font-medium"
                          >
                            Показать еще
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Нет уведомлений
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button className="flex items-center" onClick={toggleProfile}>
              <div className="relative overflow-hidden w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full">
                <Image
                  src="/images/user-avatar.png"
                  alt="User Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className={`ml-3 transition-transform ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
                stroke={theme === "light" ? "#094A54" : "white"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9L12 15L18 9" />
              </svg>
            </button>

            {isProfileOpen && (
              <div
                className={`absolute right-0 mt-2 w-[250px] sm:w-[300px] rounded-2xl shadow-lg ${
                  theme === "light" ? "bg-white" : "bg-dark-block"
                } border border-gray-200 dark:border-gray-700 overflow-hidden z-50`}
              >
                <Link
                  href="/account/profile"
                  className="block px-4 py-3 text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {t("profile")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogoutIcon size={20} className="mr-2" color="#EF4444" />
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center rounded-xl"
          onClick={toggleSidebar}
          aria-label={t("menu")}
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

      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Mobile sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-white dark:bg-dark-block z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-medium text-light-text dark:text-dark-text">
              {t("account")}
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="relative w-6 h-6">
                <span className="absolute h-0.5 w-6 bg-current rounded transform rotate-45 top-3"></span>
                <span className="absolute h-0.5 w-6 bg-current rounded transform -rotate-45 top-3"></span>
              </div>
            </button>
          </div>

          {/* User profile */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <div className="relative overflow-hidden w-14 h-14 rounded-full mr-4">
              <Image
                src="/images/user-avatar.png"
                alt="User Avatar"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-light-text dark:text-dark-text">
                Иван Иванов
              </h3>
              <Link
                href="/account/profile"
                className="text-sm text-light-accent"
                onClick={closeMenus}
              >
                {t("profile")}
              </Link>
            </div>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Appointment button */}
            <Link
              href="/account/appointment"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-light-accent text-white rounded-xl hover:bg-light-accent/90 transition-colors"
              onClick={closeMenus}
            >
              <span>{t("appointment")}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </Link>

            {/* Main navigation links */}
            <div className="space-y-2">
              {/* My Appointments */}
              <Link
                href="/account/appointments"
                className="flex items-center px-4 py-3 rounded-xl text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={closeMenus}
              >
                <CalendarIcon
                  size={24}
                  className="mr-3"
                  color={theme === "light" ? "#094A54" : "white"}
                />
                {t("myAppointments")}
              </Link>

              {/* My Tests */}
              <Link
                href="/account/analyses"
                className="flex items-center px-4 py-3 rounded-xl text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={closeMenus}
              >
                <LabIcon
                  size={24}
                  className="mr-3"
                  color={theme === "light" ? "#094A54" : "white"}
                />
                {t("myTests")}
              </Link>

              {/* Profile */}
              <Link
                href="/account/profile"
                className="flex items-center px-4 py-3 rounded-xl text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={closeMenus}
              >
                <UserIcon
                  size={24}
                  className="mr-3"
                  color={theme === "light" ? "#094A54" : "white"}
                />
                {t("profile")}
              </Link>

              {/* Doctors */}
              <Link
                href="/account/doctors"
                className="flex items-center px-4 py-3 rounded-xl text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={closeMenus}
              >
                <PulseIcon
                  size={24}
                  className="mr-3"
                  color={theme === "light" ? "#094A54" : "white"}
                />
                {t("doctors")}
              </Link>
            </div>

            {/* Notifications section */}
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-light-text dark:text-dark-text">
                  {t("notifications")}
                </h3>
                {hasUnreadNotifications && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-light-accent"
                  >
                    Прочитать все
                  </button>
                )}
              </div>

              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <>
                    {(showAllNotifications
                      ? notifications
                      : notificationsToShow
                    ).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl ${
                          notification.isRead
                            ? "bg-gray-100 dark:bg-gray-800"
                            : "bg-light-accent/5 border-l-4 border-light-accent"
                        }`}
                      >
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                          <span>{notification.date}</span>
                          <span>{notification.time}</span>
                        </div>
                        <p className="text-light-text dark:text-dark-text text-sm">
                          {notification.message}
                        </p>
                      </div>
                    ))}

                    {!showAllNotifications && notifications.length > 1 && (
                      <button
                        onClick={() => setShowAllNotifications(true)}
                        className="w-full p-3 text-light-accent border border-light-accent/30 hover:bg-light-accent/5 rounded-xl text-sm font-medium transition-colors"
                      >
                        Показать все ({notifications.length})
                      </button>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Нет уведомлений
                  </div>
                )}
              </div>
            </div>

            {/* Bottom links */}
            <div className="space-y-2">
              {/* Back to Main Site */}
              <Link
                href="/"
                className="flex items-center px-4 py-3 rounded-xl text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={closeMenus}
              >
                <LocationIconk2
                  size={24}
                  className="mr-3"
                  color={theme === "light" ? "#094A54" : "white"}
                />
                {t("backToMainSite")}
              </Link>

              {/* Change Language */}
              <div className="px-4 py-3 rounded-xl text-light-text dark:text-dark-text">
                <div className="flex items-center mb-2">
                  <GlobeIcon
                    size={24}
                    className="mr-3"
                    color={theme === "light" ? "#094A54" : "white"}
                  />
                  {t("changeLanguage")}
                </div>
                <div className="flex gap-2 ml-9">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                        currentLocale === lang.code
                          ? "bg-light-accent text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-light-text dark:text-dark-text"
                      }`}
                      onClick={() =>
                        handleLanguageChange(lang.code as "ru" | "uz")
                      }
                    >
                      {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 rounded-xl text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <LogoutIcon size={24} className="mr-3" color="#EF4444" />
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
