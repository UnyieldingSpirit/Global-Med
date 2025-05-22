"use client";

import React, { useState, useEffect, useContext } from "react";
import { useThemeStore } from "@/src/store/theme";
import { useTranslation } from "@/src/hooks/useTranslation";
import DoctorBenefits from "@/src/shared/components/DoctorBenefits";
import { AppointmentSection } from "@/src/shared/components/AppointmentSection";
import { ContactInfo } from "@/src/shared/components/ContactInfo";
import { AnimatedButton } from "@/src/shared/ui/Button/AnimatedButton";
import axios from "axios";
import { GBContext } from "@/src/context/globalize-breadcrumb";

// Data type definitions
interface ServicePrice {
  name: string;
  value: string;
}

interface Symptom {
  uuid: string;
  slug: string;
  name: string;
}

interface Symptom {
  uuid: string;
  slug: string;
  name: string;
}

interface ServiceData {
  uuid: string;
  slug: string;
  name: string;
  description: string;
  mini_description: string;
  card_description: string;
  symptoms_list: (string | Symptom)[];
  services_list: ServicePrice[];
  icon: string | null;
  symptoms_title: string;
}

interface ServiceResponse {
  data: ServiceData;
}

export interface ServiceDetailProps {
  params: {
    id: string;
  };
}

// Translations for the services page
const translations = {
  ru: {
    appointmentButton: "Записаться на прием",
    serviceTitle: "Оказываемые услуги",
    symptomsTitle: "Симптомы, при которых следует обратиться к специалисту:",
    backToServices: "Вернуться к услугам",
    showMore: "Показать все",
    showLess: "Свернуть",
    showMoreServices: "Все услуги и цены",
    showLessServices: "Свернуть прайс-лист",
    loading: "Загрузка данных...",
    error:
      "Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.",
  },
  uz: {
    appointmentButton: "Qabulga yozilish",
    serviceTitle: "Ko'rsatiladigan xizmatlar",
    symptomsTitle: "Mutaxassisga murojaat qilish kerak bo'lgan belgilar:",
    backToServices: "Xizmatlarga qaytish",
    showMore: "Ko'proq ko'rsatish",
    showLess: "Yig'ish",
    showMoreServices: "Barcha xizmatlar va narxlar",
    showLessServices: "Narxlar ro'yxatini yig'ish",
    loading: "Ma'lumotlarni yuklash...",
    error:
      "Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.",
  },
};

export default function ServiceDetail({ params }: ServiceDetailProps) {
  const { theme } = useThemeStore();
  const { t } = useTranslation(translations);
  const { id } = params;

  // States for toggling long lists
  const [expandedSymptoms, setExpandedSymptoms] = useState(false);
  const [expandedServices, setExpandedServices] = useState(false);

  // State for service data
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // State for detecting mobile devices
  const [isMobile, setIsMobile] = useState(false);
  const { currentLocale } = useTranslation(translations);
  const { setTitle }: any = useContext(GBContext);
  // Загрузка данных услуги
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ServiceResponse>(
          `https://globalmed.kelyanmedia.com/api/services/${id}`,
          {
            headers: {
              "X-Language": currentLocale === "uz" ? "uz" : "ru",
            },
          }
        );
        setServiceData(response.data.data);
        setTitle(response.data.data.name);
        setError(null);
      } catch (err) {
        console.error(`Ошибка при загрузке данных услуги ${id}:`, err);
        setError(
          err instanceof Error ? err : new Error("Ошибка при загрузке данных")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [id, currentLocale]);

  // Detect screen size on load and resize
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

  // Function to scroll to appointment form
  const handleAppointment = () => {
    // Скроллинг к форме записи
    const appointmentSection = document.getElementById("appointment-section");
    if (appointmentSection) {
      appointmentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Number of visible symptoms and services on mobile
  const visibleSymptomsCount = 4;
  const visibleServicesCount = 5;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-light-text dark:text-dark-text">
          {t("loading")}
        </p>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-red-500">{t("error")}</p>
      </div>
    );
  }

  // Отображаемые симптомы в зависимости от состояния
  const displayedSymptoms =
    isMobile && !expandedSymptoms
      ? serviceData?.symptoms_list?.slice(0, visibleSymptomsCount)
      : serviceData?.symptoms_list;

  // Отображаемые услуги в зависимости от состояния
  const displayedServices =
    isMobile && !expandedServices
      ? serviceData?.services_list?.slice(0, visibleServicesCount)
      : serviceData?.services_list;

  return (
    <main>
      {/* Верхний баннер - улучшенная адаптивность */}
      <div
        className={`w-full rounded-2xl overflow-hidden mb-8 md:mb-16 relative bg-light-accent`}
      >
        {/* Фоновый паттерн */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: "url(/images/eye-pattern.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Фон с доктором (паттерн) - скрыт на мобильных */}
        <div
          className="absolute right-[10px] -bottom-[180px] w-[1400px] h-[500px] pointer-events-none z-[1] hidden md:block"
          style={{
            backgroundImage: "url(/images/doctor-pattern.png)",
            backgroundSize: "contain",
            transform: "rotate(-45deg)",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Контентная часть баннера - улучшенные отступы для мобильных */}
        <div className="relative z-10 p-6 sm:p-8 md:p-12 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium mb-4 md:mb-6">
            {serviceData?.name}
          </h1>
          <p className="text-base sm:text-lg max-w-2xl">
            {serviceData?.description}
          </p>

          {/* Анимированная кнопка с компонентом AnimatedButton */}
          <div className="mt-6 md:mt-8">
            <AnimatedButton
              onClick={handleAppointment}
              borderColor="white"
              hoverTextColor="light-accent"
              pulsation={true}
            >
              {t("appointmentButton")}
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Блок "Оказываемые услуги" - вертикальная стековая компоновка на мобильных */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-16">
        {/* Левый блок - информация и симптомы */}
        <div
          className={`rounded-2xl p-6 sm:p-8 ${
            theme === "light" ? "bg-white" : "bg-dark-block"
          } relative overflow-hidden h-auto md:h-[700px]`}
        >
          {/* Фоновый паттерн для левого блока */}
          <div
            className="absolute -right-[150px] -bottom-[150px] w-[300px] h-[300px] pointer-events-none z-0 opacity-5"
            style={{
              backgroundImage: "url(/images/eye-pattern.png)",
              backgroundSize: "contain",
              backgroundPosition: "right bottom",
              backgroundRepeat: "no-repeat",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-[40px] lg:text-[56px] font-medium mb-4 md:mb-6 text-light-text dark:text-dark-text">
              {t("serviceTitle")}
            </h2>
            <p className="text-sm sm:text-base text-light-text/80 dark:text-dark-text/80 mb-6 md:mb-8">
              {serviceData?.mini_description}
            </p>
            <h3 className="text-lg sm:text-xl font-medium mb-3 md:mb-4 text-light-text dark:text-dark-text">
              {serviceData?.symptoms_title || t("symptomsTitle")}
            </h3>

            {/* Список симптомов с возможностью скрытия */}
            <ul className="list-none space-y-2 sm:space-y-3 text-sm sm:text-base">
              {displayedSymptoms?.map((symptom, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-light-accent mr-2 flex-shrink-0">
                    •
                  </span>
                  <span className="text-light-text dark:text-dark-text">
                    {typeof symptom === "object" ? symptom.name : symptom}
                  </span>
                </li>
              ))}
            </ul>

            {/* Кнопка показать больше/меньше для симптомов */}
            {isMobile &&
              serviceData?.symptoms_list.length > visibleSymptomsCount && (
                <button
                  onClick={() => setExpandedSymptoms(!expandedSymptoms)}
                  className="mt-4 text-light-accent hover:text-light-accent/80 transition-colors text-sm flex items-center"
                >
                  <span>
                    {expandedSymptoms ? t("showLess") : t("showMore")}
                  </span>
                  <svg
                    className={`ml-1 w-4 h-4 transform transition-transform ${
                      expandedSymptoms ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
          </div>
        </div>

        {/* Правый блок - цены на услуги */}
        <div
          className={`rounded-2xl px-4 sm:px-8 py-4 ${
            theme === "light" ? "bg-white" : "bg-dark-block"
          } relative overflow-hidden h-full`}
        >
          {/* Фоновый паттерн для правого блока */}
          <div
            className="absolute -right-[50px] -top-[50px] w-[200px] h-[200px] pointer-events-none z-0 opacity-5"
            style={{
              backgroundImage: "url(/images/price-pattern.png)",
              backgroundSize: "contain",
              backgroundPosition: "right top",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Прайс-лист - адаптивные размеры и отступы */}
          <div className="relative z-10 overflow-x-auto">
            <div className="min-w-[280px]">
              {displayedServices.map((service, index) => (
                <div
                  key={index}
                  className={`py-3 sm:py-4 flex justify-between items-center ${
                    (isMobile &&
                      !expandedServices &&
                      index === displayedServices.length - 1) ||
                    (!isMobile &&
                      index === serviceData?.services_list.length - 1)
                      ? ""
                      : "border-b border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className="text-sm sm:text-base text-light-text dark:text-dark-text pr-4">
                    {service.name}
                  </span>
                  <span className="font-medium text-sm sm:text-base text-light-text dark:text-dark-text whitespace-nowrap">
                    {service.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Кнопка показать больше/меньше для услуг */}
            {isMobile &&
              serviceData?.services_list.length > visibleServicesCount && (
                <button
                  onClick={() => setExpandedServices(!expandedServices)}
                  className="mt-4 text-light-accent hover:text-light-accent/80 transition-colors text-sm flex items-center"
                >
                  <span>
                    {expandedServices
                      ? t("showLessServices")
                      : t("showMoreServices")}
                  </span>
                  <svg
                    className={`ml-1 w-4 h-4 transform transition-transform ${
                      expandedServices ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Additional components */}
      <DoctorBenefits />
      <div id="appointment-section">
        <AppointmentSection />
      </div>
      <ContactInfo />
    </main>
  );
}
