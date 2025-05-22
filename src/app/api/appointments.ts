// Добавим в src/app/api/appointments.ts

import axios from "axios";
import { API_BASE_URL } from "@/src/config/constants";
import { useLanguageStore } from "@/src/store/language";

export interface AppointmentRequest {
  bookable_type: string;
  uuid: string;
  start_at: string;
}

export interface AppointmentResponse {
  number: string;
  bookable_type: string;
  bookable_id: string;
  start_at: string;
  end_at: string;
  uuid: string;
  updated_at: string;
  created_at: string;
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
 * Создание новой записи на приём
 * @param appointmentData Данные для создания записи
 * @param language Язык ответа (ru | uz)
 */
export const createAppointment = async (
  appointmentData: AppointmentRequest,
  language?: string
): Promise<AppointmentResponse> => {
  const token = localStorage.getItem("authToken");
  const tokenType = localStorage.getItem("tokenType");

  if (!token || !tokenType) {
    throw new Error("Unauthorized");
  }

  const currentLanguage = language || getCurrentLanguage();

  try {
    const response = await axios.post(
      `${API_BASE_URL}/appointments`,
      appointmentData,
      {
        headers: {
          Authorization: `${tokenType} ${token}`,
          "Content-Type": "application/json",
          "X-Language": currentLanguage,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error creating appointment:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: `${API_BASE_URL}/appointments`,
      });
    } else {
      console.error("Error creating appointment:", error);
    }
    throw error;
  }
};
