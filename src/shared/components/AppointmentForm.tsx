/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';
import { ArrowDownIcon } from '../ui/Icon';
import { useFormValidation } from '../../hooks/useFormValidation';
import { ValidationRules } from '../utils/formValidation';

interface AppointmentFormProps {
  onSuccess?: (formData: any) => void;
  onCancel?: () => void;
  translationNamespace?: any;
  keepFormAfterSubmit?: boolean;
}

export const AppointmentForm = forwardRef<any, AppointmentFormProps>(({
  onSuccess,
  translationNamespace,
}, ref) => {
  const { t } = useTranslation(translationNamespace);
  const [isPurposeOpen, setIsPurposeOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  
  const [consentChecked, setConsentChecked] = useState(false);
  
  // Правила валидации
  const validationRules: ValidationRules = {
    name: { required: true },
    phone: { 
      required: true,
      customValidator: (value) => {
        const phoneDigits = String(value).replace(/\D/g, '');
        return phoneDigits.length >= 12;
      }
    },
    purpose: { required: true },
    consent: { 
      required: true,
      customValidator: (value) => Boolean(value) === true
    }
  };
  
  // Используем хук валидации формы
  const {
    formData,
    formErrors,
    isSubmitting,
    handleInputChange,
    handlePhoneChange,
    handleSelectValue,
    submitForm,
    setFormData,
    setFormErrors
  } = useFormValidation(
    { name: '', phone: '', purpose: '', consent: false },
    validationRules
  );

  // Экспортируем метод сброса формы через ref
  useImperativeHandle(ref, () => ({
    resetFormData: () => {
      // Сбрасываем локальное состояние чекбокса
      setConsentChecked(false);
      // Сбрасываем основную форму
      setFormData({ name: '', phone: '', purpose: '', consent: false });
      setFormErrors({ name: false, phone: false, purpose: false, consent: false });
    }
  }));
  
  // Получаем перевод выбранной цели обращения
  const getSelectedPurposeText = (purposeKey: string) => {
    if (!purposeKey) return '';
    try {
      const options: Record<string, string> = t('modal.purposeOptions', { returnObjects: true });
      return options[purposeKey] || purposeKey;
    } catch (error) {
      return purposeKey;
    }
  };
  
  // Обработка чекбокса с локальным состоянием
  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Предотвращаем дефолтное поведение
    const isChecked = e.target.checked;
    setConsentChecked(isChecked);
    // Обновляем значение в formData напрямую
    setFormData(prev => ({ ...prev, consent: isChecked }));
    // Сбрасываем ошибку
    setFormErrors(prev => ({ ...prev, consent: false }));
  };
  
  // Обработка отправки формы
  const handleSubmit = () => {
    // Убираем фокус с текущего элемента перед отправкой
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    // Проверяем валидность формы
    const isValid = submitForm(
      // Функция успешной отправки
      () => {
        // Передаем данные формы обратно для подтверждения
        if (onSuccess) onSuccess({...formData});
      },
      // Функция при ошибке
      (error) => {
        console.error('Form submission error:', error);
      },
    );
    
    // Если валидация не прошла, не делаем ничего
    if (!isValid) {
      console.log('Validation failed');
    }
  };
  
  // Обработка выбора из выпадающего списка
  const handlePurposeSelect = (value: string) => {
    handleSelectValue('purpose', value);
    setIsPurposeOpen(false);
  };
  
  // Обработчик снятия фокуса
  const handleBlur = () => {
    // Гарантируем что после потери фокуса страница не будет прокручиваться
    setTimeout(() => {
      window.scrollTo(window.scrollX, window.scrollY);
    }, 0);
  };

  return (
    <div className="space-y-4 flex flex-col flex-grow">
      <div className="flex-1 mb-8">
        {/* Поле имени */}
        <div className="mb-5">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name as string}
            onChange={handleInputChange}
            placeholder={t('modal.namePlaceholder')}
            className={`w-full p-4 md:p-5 text-base md:text-lg bg-gray-50 dark:bg-gray-800 rounded-xl border ${
              formErrors.name 
                ? 'border-red-500' 
                : 'border-gray-200 dark:border-gray-700'
            } outline-none`}
            required
            disabled={isSubmitting}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;
                phoneInput?.focus();
              }
            }}
          />
          {formErrors.name && (
            <p className="mt-2 text-sm text-red-500">
              {t('modal.nameError')}
            </p>
          )}
        </div>
        
        {/* Поле телефона */}
        <div className="mb-5">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone as string}
            onChange={handlePhoneChange}
            placeholder={t('modal.phonePlaceholder')}
            className={`w-full p-4 md:p-5 text-base md:text-lg bg-gray-50 dark:bg-gray-800 rounded-xl border ${
              formErrors.phone 
                ? 'border-red-500' 
                : 'border-gray-200 dark:border-gray-700'
            } outline-none`}
            required
            disabled={isSubmitting}
            onBlur={handleBlur}
          />
          {formErrors.phone && (
            <p className="mt-2 text-sm text-red-500">
              {t('modal.phoneError')}
            </p>
          )}
        </div>
        
        {/* Кастомный выпадающий список с целью обращения */}
        <div className="mb-5">
          <div ref={selectRef} className="relative">
            <div
              className={`w-full p-4 md:p-5 text-base md:text-lg bg-gray-50 dark:bg-gray-800 rounded-xl border ${
                formErrors.purpose 
                  ? 'border-red-500' 
                  : 'border-gray-200 dark:border-gray-700'
              } cursor-pointer flex justify-between items-center`}
              onClick={() => !isSubmitting && setIsPurposeOpen(!isPurposeOpen)}
              tabIndex={0}
              onBlur={(e) => {
                // Закрываем список только если клик был не по дочернему элементу
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setTimeout(() => setIsPurposeOpen(false), 100);
                }
                handleBlur();
              }}
            >
              <span className={formData.purpose ? 'text-light-text dark:text-dark-text' : 'text-gray-400'}>
                {formData.purpose 
                  ? getSelectedPurposeText(formData.purpose as string)
                  : t('modal.purposePlaceholder')}
              </span>
              <ArrowDownIcon 
                size={16} 
                className={`transition-transform duration-300 ${isPurposeOpen ? "transform rotate-180" : ""}`} 
              />
            </div>
            
            {/* Выпадающий список */}
            {isPurposeOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 py-1 max-h-[200px] overflow-auto">
                {Object.entries(t('modal.purposeOptions', { returnObjects: true })).map(([key, value]) => (
                  <div
                    key={key}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-light-text dark:text-dark-text text-base md:text-lg transition-colors"
                    onClick={() => handlePurposeSelect(key)}
                    tabIndex={0}
                    onBlur={handleBlur}
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>
          {formErrors.purpose && (
            <p className="mt-2 text-sm text-red-500">
              {t('modal.purposeError')}
            </p>
          )}
        </div>
        
        {/* Согласие на обработку данных - с локальным состоянием */}
        <div className="flex items-center mt-4">
          <input 
            type="checkbox" 
            id="appointment-consent" // Уникальный ID для этой формы
            name="consent" 
            className={`mt-0 w-5 h-5 md:w-6 md:h-6 ${
              formErrors.consent 
                ? 'border-red-500 text-red-500' 
                : 'text-light-accent border-gray-300'
            } bg-gray-100 rounded outline-none`}
            checked={consentChecked}
            onChange={handleConsentChange}
            disabled={isSubmitting}
            onBlur={handleBlur}
          />
          <label htmlFor="appointment-consent" className="ml-3 text-base md:text-lg text-gray-500 dark:text-gray-400">
          {t('modal.consentText')}
          </label>
        </div>
        {formErrors.consent && (
          <p className="mt-2 text-sm text-red-500">
            {t('modal.consentError')}
          </p>
        )}
      </div>
      
      {/* Кнопка отправки */}
      <button
        onClick={handleSubmit}
        className="w-full p-4 md:p-5 bg-light-accent text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors flex justify-center items-center text-base md:text-xl mt-2 outline-none"
        disabled={isSubmitting}
        onBlur={handleBlur}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 md:h-6 md:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('modal.submitting')}
          </>
        ) : (
          t('modal.submitButton')
        )}
      </button>
    </div>
  );
});

// Имя для отладки
AppointmentForm.displayName = 'AppointmentForm';