import axios from "axios";
import { useLanguageStore } from "@/src/store/language";

const API_URL = "https://globalmed.kelyanmedia.com/api";

export interface Doctor {
  uuid: string;
  full_name: string;
  image_url: string;
  specialization: string;
  specialization_uuid: string;
  experience_years: string;
  qualification: string;
  category: any;
  languages: any;
  price_from: string;
  education: any;
  certificates: any;
  slug: string;
}

export interface DoctorsResponse {
  data: Doctor[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface DoctorFilters {
  full_name?: string;
  specialization_uuid?: string;
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
 * Получает список докторов с поддержкой пагинации и фильтрации
 * @param filters Объект с фильтрами для поиска
 * @param page Номер страницы результатов
 * @param language Язык ответа (ru | uz)
 */
export const getDoctors = async (
  filters?: DoctorFilters,
  page: number = 1,
  language?: string
): Promise<DoctorsResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());

  if (filters?.full_name) {
    params.append("filter[full_name]", filters.full_name);
  }

  if (filters?.specialization_uuid) {
    params.append("filter[specialization_uuid]", filters.specialization_uuid);
  }

  // Используем переданный язык или получаем из хранилища
  const currentLanguage = language || getCurrentLanguage();

  try {
    const response = await axios.get(`${API_URL}/doctors`, {
      params,
      headers: {
        "Content-Type": "application/json",
        "X-Language": currentLanguage,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", {
      url: `${API_URL}/doctors`,
      params: Object.fromEntries(params),
      error,
    });
    throw error;
  }
};

/**
 * Получает информацию о конкретном докторе по UUID
 * @param uuid UUID доктора
 * @param language Язык ответа (ru | uz)
 */
export const getDoctorById = async (
  uuid: string,
  language?: string
): Promise<Doctor> => {
  // Используем переданный язык или получаем из хранилища
  const currentLanguage = language || getCurrentLanguage();

  try {
    const response = await axios.get(`${API_URL}/doctors/${uuid}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Language": currentLanguage,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error("API Error:", {
      url: `${API_URL}/doctors/${uuid}`,
      error,
    });
    throw error;
  }
};
