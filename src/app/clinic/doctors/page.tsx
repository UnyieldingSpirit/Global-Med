"use client";

import React, { useState, useEffect } from "react";
import DoctorCard from "@/src/shared/components/Doctor/DoctorCard";
import DoctorSearchSection from "@/src/shared/components/Doctor/DoctorSearchSection";
import { useTranslation } from "@/src/hooks/useTranslation";
import { ContactInfo } from "@/src/shared/components/ContactInfo";
import { useDoctorsStore } from "@/src/store/doctors";

const translations = {
  ru: {
    ourSpecialists: "Наши специалисты",
    showMore: "Показать еще",
    loading: "Загрузка...",
    error: "Произошла ошибка при загрузке данных",
    tryAgain: "Попробовать снова",
    noResults: "Врачи не найдены",
  },
  uz: {
    ourSpecialists: "Bizning mutaxassislar",
    showMore: "Ko'proq ko'rsatish",
    loading: "Yuklanmoqda...",
    error: "Ma'lumotlarni yuklashda xatolik yuz berdi",
    tryAgain: "Qayta urinib ko'ring",
    noResults: "Shifokorlar topilmadi",
  },
};

export default function Doctors() {
  const { t } = useTranslation(translations);
  const { doctors, loading, error, fetchDoctors, filters } = useDoctorsStore();

  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    setVisibleCount(8);
    fetchDoctors();
  }, [JSON.stringify(filters)]);

  const visibleDoctors = doctors.slice(0, visibleCount);
  const showMoreButton = visibleCount < doctors.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const formatExperience = (experience: string): string => {
    if (experience.includes("лет") || experience.includes("год")) {
      return experience;
    }
    const years = parseInt(experience.replace(/\D/g, ""));
    if (years === 1) return `${years} год`;
    if (years > 1 && years < 5) return `${years} года`;
    return `${years} лет`;
  };

  return (
    <main>
      <DoctorSearchSection />
      <div className="py-8">
        <h2 className="text-2xl md:text-3xl font-medium mb-8 text-light-text dark:text-dark-text">
          {t("ourSpecialists")}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light-accent"></div>
            <span className="ml-3 text-light-text dark:text-dark-text">
              {t("loading")}
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mb-4">
              <p>{error}</p>
            </div>
            <button
              onClick={() => fetchDoctors()}
              className="px-4 py-2 bg-light-accent text-white rounded-lg"
            >
              {t("tryAgain")}
            </button>
          </div>
        ) : doctors.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="text-light-text/70 dark:text-dark-text/70 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-light-accent/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xl">{t("noResults")}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.uuid}
                  id={doctor.uuid}
                  slug={doctor.slug}
                  name={doctor.full_name}
                  specialization={doctor.specialization}
                  experience={formatExperience(doctor.experience_years)}
                  photoUrl={doctor.image_url}
                />
              ))}
            </div>

            {showMoreButton && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleShowMore}
                  className="flex items-center justify-center w-full md:w-auto mx-auto px-8 py-4 border border-light-text dark:border-white text-light-text dark:text-white rounded-2xl hover:bg-light-text/5 dark:hover:bg-white/10 transition-colors"
                >
                  {t("showMore")}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ContactInfo />
    </main>
  );
}
