"use client";

import React, { useState, useEffect, ReactNode, useContext } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { checkupDetailTranslations } from "@/src/shared/mocks/checkupHeroData";
import { ContactInfo } from "@/src/shared/components/ContactInfo";
import { AppointmentSection } from "@/src/shared/components/AppointmentSection";
import { BenefitsCheckUps } from "@/src/shared/components/BenefitScheckUps";
import {
  AnimatedButton,
  AnimatedButtonWrapper,
} from "@/src/shared/ui/Button/AnimatedButton";
import axios from "axios";
import { useLanguageStore } from "@/src/store/language";
import { GBContext } from "@/src/context/globalize-breadcrumb";

interface MedicalTest {
  value: ReactNode;
  uuid: string;
  name: string;
  mini_description: string;
}

interface CheckupItem {
  uuid: string;
  slug: string;
  title: string;
  description: string;
  mini_description: string;
  card_description: string;
  duration: string;
  price: number;
  icon: string;
  medical_tests: MedicalTest[];
}

interface FAQItem {
  title: string;
  content: string;
}

interface OpenItemsState {
  [key: number | string]: boolean;
}

const CheckupDetail = ({ params }: { params: { id: string } }) => {
  const { t } = useTranslation(checkupDetailTranslations);

  // Состояние для аккордеона FAQ
  const [openItems, setOpenItems] = useState<OpenItemsState>({});

  // Состояние для API данных
  const [checkup, setCheckup] = useState<CheckupItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Состояние определения мобильного устройства
  const [isMobile, setIsMobile] = useState(false);

  const { currentLocale } = useLanguageStore();
  const { title, setTitle }: any = useContext(GBContext);
  // Загрузка данных из API
  useEffect(() => {
    const fetchCheckupDetail = async () => {
      try {
        setLoading(true);
        console.log("Запрашиваем данные для id:", params.id);

        const response = await axios.get(
          `https://globalmed.kelyanmedia.com/api/checkups/${params.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Language": currentLocale || "ru", // Используем currentLocale с fallback на 'ru'
            },
          }
        );
        console.log("Получен ответ:", response.data);

        // API возвращает объект с полем data, содержащим данные о чек-апе
        if (response.data && response.data.data) {
          setCheckup(response.data.data);
          setTitle(response.data.data.title);
          setError(null);
        } else {
          throw new Error("Неверный формат данных в ответе API");
        }
      } catch (err) {
        console.error("Ошибка при загрузке данных о чек-апе:", err);
        setError(
          err instanceof Error ? err : new Error("Ошибка при загрузке данных")
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCheckupDetail();
    }
  }, [params.id, currentLocale]);

  // Определяем размер экрана при загрузке и изменении размера окна
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

  // Функция для открытия формы записи
  const handleAppointment = () => {
    console.log("Открытие формы записи");

    // Прокрутка к форме записи
    const appointmentSection = document.querySelector("#appointment-section");
    if (appointmentSection) {
      appointmentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Функция для управления аккордеоном
  const toggleItem = (index: number | string): void => {
    setOpenItems((prev: OpenItemsState) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Форматирование цены с пробелами
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Показываем состояние загрузки
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-light-text dark:text-dark-text">
          Загрузка информации...
        </div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 p-4">
        <div className="text-xl text-red-500 mb-4">
          Произошла ошибка при загрузке данных
        </div>
        <div className="text-sm">Сообщение: {error.message}</div>
      </div>
    );
  }

  // Проверяем наличие данных
  if (!checkup) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-light-text dark:text-dark-text">
          Чек-ап не найден
        </div>
      </div>
    );
  }

  return (
    <main className="overflow-hidden">
      {/* Верхний баннер */}
      <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 md:mb-16 relative bg-light-accent">
        <div
          className="absolute -right-[70px] -bottom-[180px] w-[1400px] h-[500px] pointer-events-none z-[1] hidden md:block"
          style={{
            backgroundImage: "url(/images/doctor-pattern.png)",
            backgroundSize: "contain",
            transform: "rotate(-60deg)",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Контентная часть баннера - с расположением и стилями максимально похожими на макет */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12 text-white flex flex-col md:min-h-[490px]">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-3 md:mb-4 lg:mb-6">
              {checkup.title}
            </h1>

            {/* Описание с ограниченной шириной, чтобы соответствовать макету */}
            <p className="text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed">
              {checkup.description}
            </p>

            {/* Блоки с информацией о времени и цене */}
            <div className="flex flex-col sm:flex-row gap-3 mt-5 sm:mt-6 md:mt-8">
              <div className="bg-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-base sm:text-lg md:text-xl font-medium">
                  {checkup.duration}
                </span>
              </div>

              <div className="bg-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-base sm:text-lg md:text-xl font-medium">
                  {formatPrice(checkup.price)}{" "}
                </span>
              </div>
            </div>

            {/* Блоки с информацией о типах исследований */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 md:mt-10 overflow-x-auto sm:overflow-visible">
              <div className="bg-white/20 min-w-[180px] w-full sm:w-[180px] rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-bold mb-1">
                  {checkup.medical_tests.length}
                </span>
                <span className="text-xs sm:text-sm">{t("labTests")}</span>
              </div>

              <div className="bg-white/20 min-w-[180px] w-full sm:w-[180px] rounded-lg sm:rounded-xl p-3 sm:p-4 flex flex-col justify-center">
                <span className="text-2xl sm:text-3xl font-bold mb-1">1</span>
                <span className="text-xs sm:text-sm">
                  {t("doctorConsultation")}
                </span>
              </div>
            </div>
          </div>

          {/* Кнопка записи - в верхнем правом углу на мобильных, в правом нижнем на десктопе */}
          <AnimatedButtonWrapper className="mt-6 md:mt-0">
            <AnimatedButton
              onClick={handleAppointment}
              borderColor="white"
              hoverTextColor="light-accent"
              width="w-full sm:w-auto"
            >
              {t("bookButton")}
            </AnimatedButton>
          </AnimatedButtonWrapper>
        </div>
      </div>

      {/* Секция программы диагностики и FAQ */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
        {/* Левый блок - описание программы */}
        <div className="w-full md:w-1/2 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-dark-block relative overflow-hidden md:self-start md:h-[500px] lg:h-[600px] xl:h-[700px]">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[56px] font-medium mb-3 sm:mb-4 text-[#173F46] dark:text-white leading-tight md:leading-[1.1] lg:leading-[1]">
            {t("programTitle")}
          </h2>

          {/* DNA background pattern */}
          <div
            className="absolute -right-[150px] w-[1400px] h-[500px] pointer-events-none z-[1] hidden md:block"
            style={{
              backgroundImage: "url(/images/doctor-pattern.png)",
              backgroundSize: "contain",
              transform: "rotate(15deg)",
              backgroundPosition: "right bottom",
              backgroundRepeat: "no-repeat",
            }}
          ></div>

          <div className="relative z-10">
            {/* <p className="text-sm sm:text-base text-[#173F46] dark:text-white leading-relaxed mb-6">{checkup.mini_description}</p> */}

            <p className="text-sm sm:text-base text-[#173F46] dark:text-white leading-relaxed">
              {checkup.card_description}
            </p>
          </div>
        </div>

        {/* Правый блок - FAQ секция с медицинскими тестами */}
        <div className="w-full md:w-1/2 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-dark-block transition-colors duration-200">
          {checkup.medical_tests.map((test) => (
            <div
              key={test.uuid}
              className="py-4 border-b border-teal-800/50 dark:border-gray-700/50 flex justify-between items-center hover:bg-teal-800/20 dark:hover:bg-gray-700/20 transition-colors duration-200"
            >
              <span className="lg:w-[70%] text-gray-700 md:text-lg dark:text-gray-100">
                {test.name}
              </span>
              <span
                style={{
                  textAlign: "right",
                }}
                className=" md:text-lg font-medium text-gray-700 dark:text-gray-200"
              >
                {test.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BenefitsCheckUps />

      {/* Секция записи на приём */}
      <div id="appointment-section">
        <AppointmentSection />
      </div>

      {/* Контактная информация */}
      <ContactInfo />
    </main>
  );
};

export default CheckupDetail;
