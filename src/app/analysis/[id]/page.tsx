"use client";

import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "@/src/hooks/useTranslation";
import { AppointmentSection } from "@/src/shared/components/AppointmentSection";
import { ContactInfo } from "@/src/shared/components/ContactInfo";
import { translations } from "@/src/shared/mocks/analysisData";
import AnalysisRecommendations from "@/src/shared/components/AnalysisRecommendations";
import { AnimatedButton } from "@/src/shared/ui/Button/AnimatedButton";

import axios from "axios";
import { API_BASE_URL } from "@/src/config/constants";

import httpClient from "@/src/shared/services/HttpClient";
import { useLanguageStore } from "@/src/store/language";
import { GBContext } from "@/src/context/globalize-breadcrumb";

interface AnalysisItem {
  uuid: string;
  slug: string;
  name: string;
  mini_description: string;
  description: string;
  symptoms_title: string;
  symptoms_list: string[];
  medical_tests_list: Array<{
    name: string;
    value: string;
  }>;
}

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const id = params?.id || "coagulogramma";
  const { t } = useTranslation(translations);
  const [analysis, setAnalysis] = useState<AnalysisItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const { setTitle }: any = useContext(GBContext);

  const { currentLocale } = useLanguageStore();

  // Загрузка данных анализа
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/medical-tests/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Language": currentLocale || "ru", // Используем currentLocale с fallback на 'ru'
            },
          }
        );
        setAnalysis(response.data.data);
        setTitle(response.data.data.name);
        setError(null);
      } catch (err) {
        console.error(`Error fetching analysis with slug ${id}:`, err);
        setError("Не удалось загрузить данные анализа");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, currentLocale]);

  // Определение мобильной версии
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Скролл к форме записи
  const handleAppointment = () => {
    const appointmentSection = document.getElementById("appointment-section");
    if (appointmentSection) {
      appointmentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <main className="overflow-hidden">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light-accent"></div>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="overflow-hidden">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error || "Не удалось загрузить информацию об анализе."}</p>
          </div>
        </div>
      </main>
    );
  }

  // Ограничение списка цен для мобильной версии
  const displayedPrices =
    isMobile && !showAllPrices
      ? analysis.medical_tests_list.slice(0, 5)
      : analysis.medical_tests_list;

  return (
    <main className="overflow-hidden">
      {/* Баннер */}
      <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden mb-8 md:mb-12 relative bg-light-accent">
        <div
          className="absolute -right-[10px] -bottom-[180px] w-[1400px] h-[500px] pointer-events-none z-[1] hidden md:block"
          style={{
            backgroundImage: "url(/images/doctor-pattern.png)",
            backgroundSize: "contain",
            transform: "rotate(-50deg)",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative z-10 p-10 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-[56px] font-medium mb-3 md:mb-6">
            {analysis.name}
          </h1>

          <p className="text-base sm:text-lg max-w-3xl mb-6 md:mb-6">
            {analysis.mini_description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center bg-[#0AD195] px-10 py-4 rounded-2xl">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              <span className="text-base sm:text-lg">
                {analysis.medical_tests_list.length} {t("tests")}
              </span>
            </div>
            <AnimatedButton
              onClick={handleAppointment}
              borderColor="white"
              hoverTextColor="light-accent"
              width="w-full sm:w-auto"
            >
              {t("appointmentButton")}
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Контент */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        <div className="bg-white dark:bg-dark-block rounded-xl p-6 sm:p-8 h-[700px] overflow-y-auto">
          <h2 className="text-[38px] sm:text-[40px] md:text-[56px] font-medium mb-6 text-light-text dark:text-dark-text leading-[1]">
            {analysis.symptoms_title}
          </h2>
          <p className="text-light-text/80 dark:text-dark-text/80 mb-8 w-[70%] text-base">
            {analysis.description}
          </p>

          <h3 className="text-lg sm:text-xl font-medium mb-4 text-light-text dark:text-dark-text">
            Симптомы, при которых следует сдать анализы:
          </h3>

          <ul className="space-y-3">
            {analysis.symptoms_list.map((symptom, index) => (
              <li key={index} className="flex items-start">
                <span className="text-light-accent mr-2 flex-shrink-0">•</span>
                <span className="text-light-text dark:text-dark-text">
                  {symptom}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-dark-block rounded-xl px-4 sm:px-8">
          <div className="pt-6 pb-4 sm:pt-8 sm:pb-6 flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-light-text dark:text-dark-text">
              {t("prices")}
            </h2>
          </div>

          <div className="space-y-0 divide-y divide-gray-200 dark:divide-gray-700">
            {displayedPrices.map((item, index) => (
              <div
                key={index}
                className="py-3 sm:py-4 flex justify-between items-center"
              >
                <span className="text-sm sm:text-base text-light-text dark:text-dark-text pr-4">
                  {item.name}
                </span>
                <span className="font-medium text-sm sm:text-base text-light-text dark:text-dark-text whitespace-nowrap">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {isMobile && analysis.medical_tests_list.length > 5 && (
            <div className="py-4 flex justify-center">
              <button
                onClick={() => setShowAllPrices(!showAllPrices)}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-light-text dark:text-dark-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span>{showAllPrices ? "Свернуть" : "Показать все"}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    showAllPrices ? "rotate-180" : ""
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
            </div>
          )}
        </div>
      </div>

      {/* Рекомендации */}
      <AnalysisRecommendations />

      {/* Секция записи */}
      <div id="appointment-section">
        <AppointmentSection />
      </div>

      {/* Контактная информация */}
      <ContactInfo />
    </main>
  );
}
