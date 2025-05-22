"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/src/store/theme";
import { useLanguageStore } from "@/src/store/language";
import { useTranslation } from "@/src/hooks/useTranslation";
import { LoginIcon } from "@/src/shared/ui/Icon";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { API_BASE_URL } from "@/src/config/constants";

// Переводы
const translations = {
  ru: {
    title: "Вход в личный кабинет пациента",
    phoneLabel: "Укажите номер телефона",
    sendSmsButton: "Отправить SMS-код",
    privacyText:
      "Нажимая кнопку «Отправить SMS-код», вы подтверждаете своё согласие на",
    privacyLink: "обработку персональных данных",
    smsVerificationText: "Введите 4 цифры из входящего SMS",
    confirmCodeButton: "Подтвердить код",
    changeNumberButton: "Изменить номер",
    personalDataTitle: "Личные данные",
    personalDataDesc:
      "Чтобы получить доступ к услугам клиники, укажите основную информацию",
    firstName: "Имя",
    lastName: "Фамилия",
    gender: "Пол",
    male: "Мужской",
    female: "Женский",
    birthDate: "Дата рождения",
    continueButton: "Продолжить",
    phoneError: "Введите полный номер телефона",
    resendCode: "Повторная отправка через {{countdown}} c",
    resendCodeDefault: "Отправить код повторно",
    invalidCode: "Неверный код подтверждения.",
  },
  uz: {
    title: "Bemor shaxsiy kabinetiga kirish",
    phoneLabel: "Telefon raqamingizni kiriting",
    sendSmsButton: "SMS-kodni yuborish",
    privacyText: "«SMS-kodni yuborish» tugmasini bosish orqali siz",
    privacyLink: "shaxsiy ma'lumotlarni qayta ishlashga rozilik",
    smsVerificationText: "Kelgan SMS-dan 4 ta raqamni kiriting",
    confirmCodeButton: "Kodni tasdiqlash",
    changeNumberButton: "Raqamni o'zgartirish",
    personalDataTitle: "Shaxsiy ma'lumotlar",
    personalDataDesc:
      "Klinika xizmatlaridan foydalanish uchun asosiy ma'lumotlarni kiriting",
    firstName: "Ism",
    lastName: "Familiya",
    gender: "Jins",
    male: "Erkak",
    female: "Ayol",
    birthDate: "Tug'ilgan sana",
    continueButton: "Davom etish",
    phoneError: "To'liq telefon raqamini kiriting",
    resendCode: "Qayta yuborish {{countdown}} soniyadan so‘ng",
    resendCodeDefault: "Kodni qayta yuborish",
    invalidCode: "Noto‘g‘ri tasdiqlash kodi.",
  },
};

// Шаги авторизации
enum LoginStep {
  PHONE_INPUT,
  VERIFICATION_CODE,
  PERSONAL_DATA,
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function PatientLogin() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { currentLocale } = useLanguageStore();
  const { t } = useTranslation(translations);

  // Основные состояния
  const [loginStep, setLoginStep] = useState<LoginStep>(LoginStep.PHONE_INPUT);
  const [phoneNumber, setPhoneNumber] = useState<string>("+998");
  const [verificationCode, setVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
  });
  const [birthDate, setBirthDate] = useState<Value>(null);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);

  // Состояния загрузки и ошибок
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResendAvailable, setIsResendAvailable] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Ссылки на элементы
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const genderDropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие выпадающего списка при клике вне него
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGenderDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Обратный отсчет для повторной отправки SMS
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsResendAvailable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  // Форматирование телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("+998")) {
      value = "+998";
    }

    const cleaned = value.replace(/[^\d+]/g, "");

    let formatted = cleaned;
    if (cleaned.length > 4) {
      const remainingDigits = cleaned.substring(4);
      formatted = `+998 (${remainingDigits.substring(0, 2)}`;

      if (remainingDigits.length > 2) {
        formatted += `) ${remainingDigits.substring(2, 5)}`;
      }

      if (remainingDigits.length > 5) {
        formatted += `-${remainingDigits.substring(5, 7)}`;
      }

      if (remainingDigits.length > 7) {
        formatted += `-${remainingDigits.substring(7, 9)}`;
      }
    }

    setPhoneNumber(formatted);
    setError(null);
  };

  // Получение чистого номера телефона (только цифры)
  const getCleanPhoneNumber = () => {
    return phoneNumber.replace(/[^\d]/g, "");
  };

  // Обработка проверочного кода
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.substring(value.length - 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError(null);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Обработка персональных данных
  const handlePersonalDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData({
      ...personalData,
      [name]: value,
    });
    setError(null);
  };

  const handleGenderSelect = (gender: string) => {
    setPersonalData({
      ...personalData,
      gender,
    });
    setIsGenderDropdownOpen(false);
  };

  // Отправка SMS (интеграция с API)
  const handleSendSMS = async () => {
    if (phoneNumber.length < 19) {
      setError(t("phoneError"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanPhone = getCleanPhoneNumber();

      await axios.post(
        `${API_BASE_URL}/auth/otp/send`,
        { phone: cleanPhone },
        {
          headers: {
            "X-Language": currentLocale,
            "Content-Type": "application/json",
          },
        }
      );

      setLoginStep(LoginStep.VERIFICATION_CODE);
      setCountdown(60); // 60 секунд до повторной отправки
      setIsResendAvailable(false);
    } catch (err) {
      console.error("Error sending SMS:", err);
      setError("Ошибка при отправке SMS. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  // Повторная отправка SMS
  const handleResendSMS = async () => {
    if (!isResendAvailable) return;

    setIsLoading(true);
    setError(null);

    try {
      const cleanPhone = getCleanPhoneNumber();

      await axios.post(
        `${API_BASE_URL}/auth/otp/send`,
        { phone: cleanPhone },
        {
          headers: {
            "X-Language": currentLocale,
            "Content-Type": "application/json",
          },
        }
      );

      setCountdown(60);
      setIsResendAvailable(false);
    } catch (err) {
      console.error("Error resending SMS:", err);
      setError(
        "Ошибка при повторной отправке SMS. Пожалуйста, попробуйте позже."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Проверка кода
  const handleVerifyCode = async () => {
    if (!isCodeComplete) return;

    setIsLoading(true);
    setError(null);

    try {
      const cleanPhone = getCleanPhoneNumber();
      const code = verificationCode.join("");

      const response = await axios.post(
        `${API_BASE_URL}/auth/otp/verify`,
        {
          phone: cleanPhone,
          code: code,
        },
        {
          headers: {
            "X-Language": currentLocale,
            "Content-Type": "application/json",
          },
        }
      );

      // Сохраняем токен аутентификации
      const { access_token, token_type } = response.data;
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("tokenType", token_type);

      // Проверяем, есть ли у пользователя профиль
      const userInfoResponse = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `${token_type} ${access_token}`,
          "X-Language": currentLocale,
        },
      });

      const userInfo = userInfoResponse.data;

      // Проверяем, заполнены ли основные поля профиля
      const isProfileComplete =
        userInfo.first_name &&
        userInfo.first_name.trim() !== "" &&
        userInfo.last_name &&
        userInfo.last_name.trim() !== "" &&
        userInfo.gender &&
        userInfo.gender.trim() !== "";

      if (isProfileComplete) {
        // Если профиль заполнен, перенаправляем на страницу профиля
        router.push("/account/profile");
      } else {
        // Иначе показываем форму заполнения личных данных
        setLoginStep(LoginStep.PERSONAL_DATA);

        // Если какие-то данные уже есть, заполняем их
        if (
          userInfo.first_name ||
          userInfo.last_name ||
          userInfo.gender ||
          userInfo.birthday
        ) {
          setPersonalData({
            firstName: userInfo.first_name || "",
            lastName: userInfo.last_name || "",
            gender: userInfo.gender || "",
          });

          if (userInfo.birthday) {
            setBirthDate(new Date(userInfo.birthday));
          }
        }
      }
    } catch (err) {
      console.error("Error verifying code:", err);
      setError(t("invalidCode"));
    } finally {
      setIsLoading(false);
    }
  };

  // Отправка личных данных
  const handleSubmitPersonalData = async () => {
    if (!isPersonalDataValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const tokenType = localStorage.getItem("tokenType");

      if (!token || !tokenType) {
        throw new Error("Не удалось получить токен аутентификации");
      }

      const formattedData = {
        first_name: personalData.firstName,
        last_name: personalData.lastName,
        gender: personalData.gender,
        birthday:
          birthDate instanceof Date
            ? birthDate.toISOString().split("T")[0]
            : null,
      };

      await axios.put(`${API_BASE_URL}/user`, formattedData, {
        headers: {
          Authorization: `${tokenType} ${token}`,
          "X-Language": currentLocale,
          "Content-Type": "application/json",
        },
      });

      router.push("/account/appointments");
    } catch (err) {
      console.error("Error submitting personal data:", err);
      setError("Ошибка при сохранении данных. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  // Изменение номера телефона
  const handleChangeNumber = () => {
    setLoginStep(LoginStep.PHONE_INPUT);
    setVerificationCode(["", "", "", ""]);
    setError(null);
  };

  // Проверки данных
  const isCodeComplete = verificationCode.every((digit) => digit !== "");
  const isPersonalDataValid =
    personalData.firstName &&
    personalData.lastName &&
    personalData.gender &&
    birthDate !== null;

  // Отображение гендера
  const displayGender = personalData.gender
    ? personalData.gender === "male"
      ? t("male")
      : t("female")
    : t("gender");

  // Функция для стилизации календаря по теме
  const getDatePickerClassName = () => {
    const baseClass = "react-date-picker";
    return theme === "dark" ? `${baseClass} dark-theme` : baseClass;
  };

  return (
    <div className="flex justify-center mt-20 min-h-screen px-4 sm:px-6 py-10">
      <div className="w-full max-w-md sm:max-w-xl">
        {/* Шаг ввода телефона */}
        {loginStep === LoginStep.PHONE_INPUT && (
          <div>
            <div className="flex justify-center mb-4 sm:mb-6">
              <LoginIcon
                color="#00C78B"
                size={48}
                className="sm:w-[60px] sm:h-[60px]"
              />
            </div>

            <h1 className="text-[20px] sm:text-[24px] font-medium text-center text-light-text dark:text-dark-text mb-4 sm:mb-5">
              {t("title")}
            </h1>

            <div className="mb-6 sm:mb-8">
              <p className="text-[14px] text-light-text dark:text-dark-text mb-2 sm:mb-3">
                {t("phoneLabel")}
              </p>
              <input
                type="tel"
                inputMode="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+998 (__) ___-__-__"
                className="w-full p-4 sm:p-5 bg-white dark:bg-dark-block border border-[#E5E7EB] dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-light-accent text-light-text dark:text-dark-text text-base sm:text-lg"
              />
              {phoneNumber.length > 4 && phoneNumber.length < 19 && (
                <p className="text-red-500 text-xs mt-1">{t("phoneError")}</p>
              )}
            </div>

            <button
              onClick={handleSendSMS}
              disabled={phoneNumber.length < 19 || isLoading}
              className="w-full py-4 sm:py-5 rounded-2xl bg-light-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed text-[16px] sm:text-[18px] flex items-center justify-center"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
              ) : null}
              {t("sendSmsButton")}
            </button>

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}

            <p className="text-xs text-light-text/70 dark:text-dark-text/70 mt-3 sm:mt-4 text-center">
              {t("privacyText")}
              <br />
              <Link href="/privacy" className="text-light-accent">
                {t("privacyLink")}
              </Link>
            </p>
          </div>
        )}

        {/* Шаг ввода проверочного кода */}
        {loginStep === LoginStep.VERIFICATION_CODE && (
          <div>
            <div className="flex justify-center mb-4 sm:mb-6">
              <LoginIcon
                color="#00C78B"
                size={48}
                className="sm:w-[60px] sm:h-[60px]"
              />
            </div>

            <h1 className="text-[20px] sm:text-[24px] font-medium text-center text-light-text dark:text-dark-text mb-4 sm:mb-5">
              {t("title")}
            </h1>

            <p className="text-[14px] text-light-text dark:text-dark-text text-center mb-2">
              {t("smsVerificationText")}
            </p>

            <p className="text-[14px] font-medium text-light-text dark:text-dark-text text-center mb-4 sm:mb-6">
              {phoneNumber}
            </p>

            <div className="flex justify-between gap-2 sm:gap-3 mb-6 sm:mb-8">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  value={verificationCode[index]}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="w-16 h-16 sm:w-24 sm:h-24 text-center text-2xl sm:text-3xl bg-white dark:bg-dark-block border border-[#E5E7EB] dark:border-gray-700 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-light-accent text-light-text dark:text-dark-text"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={!isCodeComplete || isLoading}
              className="w-full py-4 sm:py-5 rounded-2xl bg-light-accent text-white font-medium mb-4 sm:mb-5 disabled:opacity-50 disabled:cursor-not-allowed text-[16px] sm:text-[18px] flex items-center justify-center"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
              ) : null}
              {t("confirmCodeButton")}
            </button>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <button
                onClick={handleChangeNumber}
                className="text-center text-light-accent text-[16px] sm:text-[18px]"
              >
                {t("changeNumberButton")}
              </button>

              <button
                onClick={handleResendSMS}
                disabled={!isResendAvailable || isLoading}
                className="text-center text-light-accent text-[16px] sm:text-[18px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p>
                  {countdown > 0
                    ? t("resendCode", { countdown }) // Use `t` to get the countdown message
                    : t("resendCodeDefault")}{" "}
                  {/* Default message when countdown ends */}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Шаг ввода личных данных */}
        {loginStep === LoginStep.PERSONAL_DATA && (
          <div>
            <h1 className="text-[20px] sm:text-[24px] font-medium text-center text-light-text dark:text-dark-text mb-2 sm:mb-3">
              {t("personalDataTitle")}
            </h1>

            <p className="text-[14px] text-light-text/70 dark:text-dark-text/70 text-center mb-6 sm:mb-8">
              {t("personalDataDesc")}
            </p>

            <div className="space-y-4 sm:space-y-5 mb-6 sm:mb-8">
              <input
                type="text"
                name="firstName"
                value={personalData.firstName}
                onChange={handlePersonalDataChange}
                placeholder={t("firstName")}
                className="w-full p-4 sm:p-5 bg-white dark:bg-dark-block border border-[#E5E7EB] dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-light-accent text-light-text dark:text-dark-text text-base sm:text-lg"
              />

              <input
                type="text"
                name="lastName"
                value={personalData.lastName}
                onChange={handlePersonalDataChange}
                placeholder={t("lastName")}
                className="w-full p-4 sm:p-5 bg-white dark:bg-dark-block border border-[#E5E7EB] dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-light-accent text-light-text dark:text-dark-text text-base sm:text-lg"
              />

              {/* Выпадающий список для выбора пола */}
              <div className="relative" ref={genderDropdownRef}>
                <div
                  className="w-full p-4 sm:p-5 bg-white dark:bg-dark-block border border-[#E5E7EB] dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-light-accent text-light-text dark:text-dark-text text-base sm:text-lg flex justify-between items-center cursor-pointer"
                  onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                >
                  <span
                    className={
                      personalData.gender
                        ? "text-light-text dark:text-dark-text"
                        : "text-light-text/60 dark:text-dark-text/60"
                    }
                  >
                    {displayGender}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-transform ${
                      isGenderDropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {isGenderDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-block border border-[#E5E7EB] dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden">
                    <div
                      className="p-4 sm:p-5 hover:bg-light-accent/10 cursor-pointer text-light-text dark:text-dark-text"
                      onClick={() => handleGenderSelect("male")}
                    >
                      {t("male")}
                    </div>
                    <div
                      className="p-4 sm:p-5 hover:bg-light-accent/10 cursor-pointer text-light-text dark:text-dark-text"
                      onClick={() => handleGenderSelect("female")}
                    >
                      {t("female")}
                    </div>
                  </div>
                )}
              </div>

              {/* Компонент DatePicker для выбора даты */}
              <div className="datepicker-container">
                <DatePicker
                  onChange={setBirthDate}
                  value={birthDate}
                  className={getDatePickerClassName()}
                  clearIcon={null}
                  format="dd.MM.yyyy"
                  dayPlaceholder="дд"
                  monthPlaceholder="мм"
                  yearPlaceholder="гггг"
                  maxDate={new Date()}
                  calendarClassName={`${
                    theme === "dark" ? "dark-calendar" : ""
                  }`}
                  formatDay={(locale, date) =>
                    date.getDate().toString().padStart(2, "0")
                  }
                />
              </div>
            </div>

            <button
              onClick={handleSubmitPersonalData}
              disabled={!isPersonalDataValid || isLoading}
              className="w-full py-4 sm:py-5 rounded-2xl bg-light-accent text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed text-[16px] sm:text-[18px] flex items-center justify-center"
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
              ) : null}
              {t("continueButton")}
            </button>

            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Стили для DatePicker */}
      <style jsx global>{`
        .react-date-picker {
          width: 100%;
        }
        .react-date-picker__wrapper {
          padding: 1rem 1.25rem;
          background-color: ${theme === "dark" ? "var(--dark-block)" : "white"};
          border: 1px solid ${theme === "dark" ? "#4B5563" : "#E5E7EB"};
          border-radius: 1rem;
          color: ${theme === "dark" ? "white" : "var(--light-text)"};
        }
        .react-date-picker__inputGroup__input {
          color: ${theme === "dark" ? "white" : "var(--light-text)"};
          background: transparent;
        }
        .react-date-picker__inputGroup__input::placeholder {
          color: ${theme === "dark"
            ? "rgba(255,255,255,0.6)"
            : "rgba(9,74,84,0.6)"};
        }
        .react-date-picker__button {
          color: ${theme === "dark" ? "white" : "var(--light-text)"};
        }
        .react-date-picker__button:enabled:hover
          .react-date-picker__button__icon,
        .react-date-picker__button:enabled:focus
          .react-date-picker__button__icon {
          stroke: ${theme === "dark" ? "white" : "var(--light-text)"};
        }
        .react-date-picker__button svg {
          stroke: ${theme === "dark" ? "white" : "var(--light-text)"};
        }

        /* Календарь */
        .react-calendar {
          background-color: ${theme === "dark" ? "var(--dark-block)" : "white"};
          border: 1px solid ${theme === "dark" ? "#4B5563" : "#E5E7EB"};
          border-radius: 1rem;
          color: ${theme === "dark" ? "white" : "var(--light-text)"};
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .react-calendar__tile {
          color: ${theme === "dark" ? "white" : "var(--light-text)"};
        }
        .react-calendar__navigation button {
          color: ${theme === "dark" ? "white" : "var(--light-text)"};
        }
        .react-calendar__tile--active {
          background: var(--light-accent);
          color: white;
        }
        .react-calendar__tile--active:enabled:hover,
        .react-calendar__tile--active:enabled:focus {
          background: var(--light-accent);
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: ${theme === "dark"
            ? "rgba(255,255,255,0.1)"
            : "rgba(9,74,84,0.1)"};
        }
        .react-calendar__month-view__days__day--weekend {
          color: ${theme === "dark" ? "#FF9999" : "#D00000"};
        }
        .react-calendar__month-view__days__day--neighboringMonth {
          color: ${theme === "dark"
            ? "rgba(255,255,255,0.3)"
            : "rgba(9,74,84,0.3)"};
        }

        /* Мобильная адаптация календаря */
        @media (max-width: 768px) {
          .react-date-picker__wrapper {
            padding: 0.75rem 1rem;
          }
          .react-calendar {
            width: 280px !important;
            font-size: 0.875rem;
          }
          .react-calendar__tile {
            padding: 0.5rem;
            height: 2.5rem;
          }
          .react-calendar__navigation button {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
