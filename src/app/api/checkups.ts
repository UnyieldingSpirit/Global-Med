// src/app/api/checkups.ts
import axios from "axios";
import { API_BASE_URL } from "@/src/config/constants";
import { useLanguageStore } from "@/src/store/language";

export interface MedicalTest {
  uuid: string;
  name: string;
  mini_description: string;
}

export interface Symptom {
  uuid: string;
  slug: string;
  name: string;
}

export interface CheckupItem {
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
  symptoms: Symptom[];
}

export interface CheckupsResponse {
  data: CheckupItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Получает текущий язык из хранилища или возвращает 'ru' по умолчанию
 */
export const getCurrentLanguage = (): string => {
  try {
    if (typeof window === "undefined") return "ru";

    const state = useLanguageStore.getState();
    return state?.currentLocale || "ru";
  } catch (error) {
    console.warn(
      'Error getting language from store, using default "ru":',
      error
    );
    return "ru";
  }
};

/**
 * Получение списка всех чек-апов
 * @param language Язык ответа (ru | uz)
 */
export const fetchCheckups = async (
  language?: string
): Promise<CheckupsResponse> => {
  const currentLanguage = language || getCurrentLanguage();

  try {
    const response = await axios.get(`${API_BASE_URL}/checkups`, {
      headers: {
        "Content-Type": "application/json",
        "X-Language": currentLanguage,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при загрузке списка чек-апов:", error);
    throw error;
  }
};

/**
 * Получение информации о конкретном чек-апе по slug
 * @param slug Slug чек-апа
 * @param language Язык ответа (ru | uz)
 */
export const fetchCheckupBySlug = async (
  slug: string,
  language?: string
): Promise<CheckupItem> => {
  const currentLanguage = language || getCurrentLanguage();

  try {
    const response = await axios.get(`${API_BASE_URL}/checkups/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Language": currentLanguage,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Ошибка при загрузке информации о чек-апе ${slug}:`, error);
    throw error;
  }
};
