"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/src/hooks/useTranslation";
import Modal from "@/src/shared/components/Modal/Modal";
import { useDoctorsStore } from "@/src/store/doctors";
import axios from "axios";
import { API_BASE_URL } from "@/src/config/constants";
import { useLanguageStore } from "@/src/store/language";

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

interface Specialization {
  uuid: string;
  name: string;
  slug: string;
}

interface SpecialtiesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  specialties: Specialization[];
  onSelect: (specialty: Specialization | null) => void;
  placeholder: string;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const translations = {
  ru: {
    title: "Найдите специалиста",
    searchByName: "Поиск по ФИО",
    searchBySpecialty: "Поиск по специализации",
    inputPlaceholder: "Введите ФИО",
    selectPlaceholder: "Все специализации",
    findButton: "Найти врача",
    modalTitle: "Выберите специализацию",
    loading: "Загрузка...",
    noResults: "Врачи не найдены",
    loadingSpecialties: "Загрузка специализаций...",
  },
  uz: {
    title: "Mutaxassis toping",
    searchByName: "Ism bo'yicha qidirish",
    searchBySpecialty: "Ixtisoslik bo'yicha qidirish",
    inputPlaceholder: "Ismi-sharifni kiriting",
    selectPlaceholder: "Barcha ixtisosliklar",
    findButton: "Shifokorni topish",
    modalTitle: "Ixtisoslikni tanlang",
    loading: "Yuklanmoqda...",
    noResults: "Shifokorlar topilmadi",
    loadingSpecialties: "Ixtisosliklar yuklanmoqda...",
  },
};

// Компонент выпадающего списка с порталом только для десктопной версии
const SpecialtiesDropdown: React.FC<SpecialtiesDropdownProps> = ({
  isOpen,
  onClose,
  specialties,
  onSelect,
  placeholder,
  buttonRef,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
  });

  const updatePosition = (): void => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className="fixed bg-white rounded-xl shadow-xl z-50 animate-dropdown border border-gray-100"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      <div className="py-2">
        <button
          onClick={() => onSelect(null)}
          className="w-full text-left px-4 py-2.5 text-gray-800 hover:bg-light-accent/10 transition-colors font-medium"
        >
          {placeholder}
        </button>

        <div className="border-t my-1 border-gray-100"></div>

        {specialties.map((specialty) => (
          <button
            key={specialty.uuid}
            onClick={() => onSelect(specialty)}
            className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-light-accent/10 hover:text-light-accent transition-colors flex items-center group"
          >
            <span className="w-5 text-light-accent opacity-0 group-hover:opacity-100 transition-opacity">
              •
            </span>
            <span>{specialty.name}</span>
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
};

const DoctorSearchSection: React.FC = () => {
  const { t } = useTranslation(translations);
  const { currentLocale } = useLanguageStore();

  const [nameQuery, setNameQuery] = useState<string>("");
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<Specialization | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loadingSpecialties, setLoadingSpecialties] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  const specialtyButtonRef = useRef<HTMLButtonElement>(null);

  const { setFilters, fetchDoctors, doctors } = useDoctorsStore();

  // Загрузка специализаций
  useEffect(() => {
    const fetchSpecializations = async () => {
      setLoadingSpecialties(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/specializations`, {
          headers: {
            "X-Language": currentLocale === "uz" ? "uz" : "ru",
          },
        });
        console.log("Loaded specializations:", response.data.data);
        setSpecializations(response.data.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      } finally {
        setLoadingSpecialties(false);
      }
    };

    fetchSpecializations();
  }, [currentLocale]);

  // Инициализация и определение устройства
  useEffect(() => {
    setIsMounted(true);
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Первоначальная загрузка докторов
    fetchDoctors();

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [fetchDoctors]);

  // Обработчик выбора специализации
  const handleSelectSpecialty = (specialty: Specialization | null): void => {
    console.log("Selected specialty:", specialty);
    setSelectedSpecialty(specialty);
    setIsSpecialtyOpen(false);
    setIsModalOpen(false);

    // Применяем фильтр по специализации
    if (specialty) {
      console.log(`Filtering by specialty UUID: ${specialty.uuid}`);
      setFilters({ specialization_uuid: specialty.uuid });
    } else {
      console.log("Clearing specialty filter");
      setFilters({});
    }

    // Выполняем поиск
    fetchDoctors().then(() => {
      console.log("Doctors after specialty filter:", doctors);

      // Прокручиваем к результатам
      const resultsSection = document.getElementById("doctors-results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  // Обработчик поиска
  const handleSearch = async (): Promise<void> => {
    setLoadingSearch(true);

    try {
      const filters: Record<string, any> = {};

      if (nameQuery.trim()) {
        filters.full_name = nameQuery.trim();
        console.log(`Filtering by name: ${nameQuery.trim()}`);
      }

      if (selectedSpecialty) {
        filters.specialization_uuid = selectedSpecialty.uuid;
        console.log(`Filtering by specialty UUID: ${selectedSpecialty.uuid}`);
      }

      console.log("Applied filters:", filters);
      setFilters(filters);

      await fetchDoctors();
      console.log("Doctors after search:", doctors);

      const resultsSection = document.getElementById("doctors-results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoadingSearch(false);
    }
  };

  const displaySpecialty = selectedSpecialty
    ? selectedSpecialty.name
    : t("selectPlaceholder");

  const handleSpecialtyButtonClick = (): void => {
    if (isMobile) {
      setIsModalOpen(true);
    } else {
      setIsSpecialtyOpen(!isSpecialtyOpen);
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden mb-6">
        <div
          className="absolute inset-0 bg-gray-500"
          style={{
            backgroundImage: "url(/images/doctors-team.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      <div className="relative w-full rounded-2xl overflow-hidden bg-light-accent text-white">
        <div
          className="absolute -right-[300px] -bottom-[60px] w-[1400px] h-[500px] pointer-events-none z-[1] hidden md:block"
          style={{
            backgroundImage: "url(/images/doctor-pattern.png)",
            backgroundSize: "contain",
            transform: "rotate(-2deg)",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <div className="relative z-10 p-4 md:p-6 lg:p-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-8 md:mb-10">
            {t("title")}
          </h2>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8">
            <div className="w-full md:w-2/5">
              <p className="text-sm md:text-base mb-2">{t("searchByName")}</p>
              <div className="relative">
                <input
                  type="text"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  placeholder={t("inputPlaceholder")}
                  className="w-full bg-white/20 rounded-2xl p-4 pr-10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-white/60"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/5">
              <p className="text-sm md:text-base mb-2">
                {t("searchBySpecialty")}
              </p>
              <div className="relative">
                <button
                  ref={specialtyButtonRef}
                  onClick={handleSpecialtyButtonClick}
                  className="w-full bg-white/20 rounded-2xl p-4 pr-10 text-left text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                  disabled={loadingSpecialties}
                >
                  {loadingSpecialties
                    ? t("loadingSpecialties")
                    : displaySpecialty}
                </button>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {loadingSpecialties ? (
                    <svg
                      className="w-5 h-5 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className={`w-5 h-5 text-white transition-transform duration-300 ${
                        isSpecialtyOpen ? "rotate-180" : ""
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/5 flex items-end">
              <button
                onClick={handleSearch}
                disabled={loadingSearch}
                className="w-full mt-auto rounded-2xl bg-white text-light-accent p-4 font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100"
              >
                {loadingSearch ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("loading")}
                  </span>
                ) : (
                  t("findButton")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="doctors-results"></div>

      {isMounted && !isMobile && (
        <SpecialtiesDropdown
          isOpen={isSpecialtyOpen}
          onClose={() => setIsSpecialtyOpen(false)}
          specialties={specializations}
          onSelect={handleSelectSpecialty}
          placeholder={t("selectPlaceholder")}
          buttonRef={specialtyButtonRef}
        />
      )}

      {isMounted && isMobile && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={t("modalTitle")}
          position="bottom"
          size="full"
          theme="brand"
          showCloseButton={true}
          showCloseIcon={true}
          contentClassName="bg-white dark:bg-dark-block"
        >
          <div className="py-2">
            <button
              onClick={() => handleSelectSpecialty(null)}
              className="w-full text-left px-4 py-3 text-light-text dark:text-dark-text hover:bg-light-accent/10 dark:hover:bg-light-accent/10 rounded-lg transition-colors font-medium"
            >
              {t("selectPlaceholder")}
            </button>

            <div className="border-t my-1 border-gray-100 dark:border-gray-700"></div>

            {loadingSpecialties ? (
              <div className="text-center py-4">{t("loadingSpecialties")}</div>
            ) : (
              specializations.map((specialty) => (
                <button
                  key={specialty.uuid}
                  onClick={() => handleSelectSpecialty(specialty)}
                  className="w-full text-left px-4 py-3 text-light-text dark:text-dark-text hover:bg-light-accent/10 hover:text-light-accent dark:hover:text-light-accent rounded-lg transition-colors flex items-center group"
                >
                  <span className="w-5 text-light-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    •
                  </span>
                  <span>{specialty.name}</span>
                </button>
              ))
            )}
          </div>
        </Modal>
      )}

      <style jsx global>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 8px 10px -6px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

export default DoctorSearchSection;
