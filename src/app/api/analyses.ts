// src/app/api/analyses.ts
import axios from "axios";
import {
  AnalysisItem,
  AnalysisResponse,
  AnalysisDetailResponse,
} from "@/src/types/analysis";
import { API_BASE_URL } from "@/src/config/constants";
import { useLanguageStore } from "@/src/store/language";

const API_URL = `${API_BASE_URL}/medical-tests`;

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
 * Получение списка всех анализов
 * @param language Язык ответа (ru | uz)
 */
export const fetchAnalyses = async (
  language?: string
): Promise<AnalysisResponse> => {
  const currentLanguage = language || getCurrentLanguage();

  try {
    const response = await axios.get<AnalysisResponse>(API_URL, {
      headers: {
        "Content-Type": "application/json",
        "X-Language": currentLanguage,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analyses:", error);
    throw new Error("Failed to fetch analyses data");
  }
};

/**
 * Получение информации о конкретном анализе по slug
 * @param slug Slug анализа
 * @param language Язык ответа (ru | uz)
 */
export const fetchAnalysisBySlug = async (
  slug: string,
  language?: string
): Promise<AnalysisItem> => {
  const currentLanguage = language || getCurrentLanguage();

  try {
    const response = await axios.get<AnalysisDetailResponse>(
      `${API_URL}/${slug}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Language": currentLanguage,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching analysis with slug ${slug}:`, error);
    throw new Error(`Failed to fetch analysis data for ${slug}`);
  }
};
