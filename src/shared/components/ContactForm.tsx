// src/shared/components/ContactForm.tsx

'use client';

import React, { useState, useRef } from 'react';
import { useThemeStore } from '@/src/store/theme';
import Image from 'next/image';
import Modal from '@/src/shared/components/Modal/Modal';
import { FormService } from '../services/FormService';
import { useTranslation } from '@/src/hooks/useTranslation';  // `useTranslation` hook'ini chaqirish

interface FormData {
  name: string;
  phone: string;
  company: string;
  consent: boolean;
}

interface FormErrors {
  name: boolean;
  phone: boolean;
  company: boolean;
  consent: boolean;
}
// src/locales/translations.ts

export const localization = {
  ru: {
    contactForm: {
      title: 'Свяжитесь с нами сегодня',
      subtitle: 'И мы поможем подобрать индивидуальное решение для вашего корпоративного здоровья',
      name: 'Имя',
      phone: 'Телефон',
      company: 'Название компании',
      consent: 'Соглашаюсь с политикой в отношении обработки персональных данных',
      submitButton: 'Отправить',
      submittingButton: 'Отправка...',
      cancelButton: 'Отменить',
      confirmButton: 'Подтвердить',
      successMessage: 'Ваша заявка принята!',
      successSubtitle: 'Специалисты нашей клиники свяжутся с вами в ближайшее время',
      confirmationTitle: 'Подтверждение заявки',
      confirmationMessage: 'Подтвердите отправку заявки. Наши специалисты свяжутся с вами в ближайшее время.',
      nameError: 'Пожалуйста, введите ваше имя.',
      phoneError: 'Пожалуйста, введите действительный номер телефона.',
    }
  },
  uz: {
    contactForm: {
      title: 'Bugun biz bilan bog‘laning',
      subtitle: 'Va biz sizning korporativ sog‘liqni saqlash uchun individual yechimni tanlashga yordam beramiz',
      name: 'Ism',
      phone: 'Telefon',
      company: 'Kompaniya nomi',
      consent: 'Shaxsiy ma\'lumotlarni qayta ishlash siyosatiga roziman',
      submitButton: 'Yuborish',
      submittingButton: 'Yuborilyapti...',
      cancelButton: 'Bekor qilish',
      confirmButton: 'Tasdiqlash',
      successMessage: 'Arizangiz qabul qilindi!',
      successSubtitle: 'Klinikamiz mutaxassislari siz bilan tez orada bog‘lanadi',
      confirmationTitle: 'Ariza tasdiqlash',
      confirmationMessage: 'Arizani yuborishni tasdiqlang. Bizning mutaxassislarimiz tez orada siz bilan bog‘lanadi.',
      nameError: 'Iltimos, ismingizni kiriting.',
      phoneError: 'Iltimos, to‘g‘ri telefon raqamini kiriting.',
    }
  }
};


export default function ContactForm(): JSX.Element {
  const { theme } = useThemeStore();
  const { t } = useTranslation(localization);  // `useTranslation` hook'ini chaqirish
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    company: '',
    consent: false
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: false,
    phone: false,
    company: false,
    consent: false
  });

  const validateForm = (): boolean => {
    const errors: FormErrors = {
      name: formData.name.trim() === '',
      phone: !formData.phone || formData.phone.replace(/\D/g, '').length < 9,
      company: false, 
      consent: !formData.consent
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let input = e.target.value.replace(/\D/g, '');
    
    if (input.length > 0) {
      if (input.startsWith('998')) {
        input = input.slice(3);
      }
      
      input = input.slice(0, 9);
      
      let formattedPhone = '';
      if (input.length > 0) {
        formattedPhone = input.slice(0, 2);
        if (input.length > 2) {
          formattedPhone += ' ' + input.slice(2, 5);
          if (input.length > 5) {
            formattedPhone += ' ' + input.slice(5, 7);
            if (input.length > 7) {
              formattedPhone += ' ' + input.slice(7, 9);
            }
          }
        }
      }
      
      setFormData(prev => ({ ...prev, phone: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, phone: '' }));
    }
    
    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: false }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData(prev => ({ ...prev, consent: e.target.checked }));
    
    if (formErrors.consent) {
      setFormErrors(prev => ({ ...prev, consent: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsConfirmationModalOpen(true);
    }
  };

  const closeConfirmationModal = (): void => {
    setIsConfirmationModalOpen(false);
  };
  
  const closeSuccessModal = (): void => {
    setIsSuccessModalOpen(false);
  };
  
  const confirmSubmission = async (): Promise<void> => {
    setIsSubmitting(true);
    setIsConfirmationModalOpen(false);
    
    try {
      const submissionData = {
        name: formData.name,
        phone: formData.phone,
        company_name: formData.company,
        form_type: 'contact_form'
      };
      
      await FormService.submitForm(submissionData);
      
      setIsSuccessModalOpen(true);
      
      setFormData({
        name: '',
        phone: '',
        company: '',
        consent: false
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div id="contact-info-section" className={`w-full flex flex-col md:flex-row gap-5 mt-20 overflow-hidden`}>
        <div className={`p-6 md:p-8 rounded-2xl ${theme === 'dark' ? 'bg-dark-block' : 'bg-light-block'} md:w-1/4`}>
          <div>
            <h2 className="text-light-text dark:text-dark-text mb-4">{t('contactForm.title')}</h2>
            <p className="text-light-text/80 dark:text-dark-text/80">{t('contactForm.subtitle')}</p>
          </div>
        </div>
        
        <div className={`p-6 md:p-8 rounded-2xl ${theme === 'dark' ? 'bg-dark-block' : 'bg-white'} md:w-1/2`}>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder={t('contactForm.name')}
                onChange={handleInputChange}
                className={`w-full p-5 text-lg rounded-xl bg-light-bg dark:bg-dark-bg border ${
                  formErrors.name 
                    ? 'border-red-500' 
                    : 'border-gray-200 dark:border-gray-700'
                } text-light-text dark:text-dark-text focus:outline-none focus:border-light-accent`}
                disabled={isSubmitting}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{t('contactForm.nameError')}</p>
              )}
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500 text-lg">
                  +998
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="(__) ___ __ __"
                  className={`w-full p-5 pl-16 text-lg rounded-xl bg-light-bg dark:bg-dark-bg border ${
                    formErrors.phone 
                      ? 'border-red-500' 
                      : 'border-gray-200 dark:border-gray-700'
                  } text-light-text dark:text-dark-text focus:outline-none focus:border-light-accent`}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-500">{t('contactForm.phoneError')}</p>
              )}
            </div>
            
            <div className="mb-8">
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder={t('contactForm.company')}
                className="w-full p-5 text-lg rounded-xl bg-light-bg dark:bg-dark-bg border border-gray-200 dark:border-gray-700 text-light-text dark:text-dark-text focus:outline-none focus:border-light-accent"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex items-start mb-10">
              <div className="flex items-center h-6">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleCheckboxChange}
                  className={`w-5 h-5 border ${
                    formErrors.consent 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  } rounded-sm bg-light-bg dark:bg-dark-bg focus:ring-light-accent`}
                  disabled={isSubmitting}
                />
              </div>
              <label 
                htmlFor="consent" 
                className={`ml-3 text-base font-medium ${
                  formErrors.consent 
                    ? 'text-red-500' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {t('contactForm.consent')}
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full py-5 px-6 text-lg bg-light-accent text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('contactForm.submittingButton')}
                </>
              ) : (
                t('contactForm.submitButton')
              )}
            </button>
          </form>
        </div>
        
        <div className="hidden md:block md:w-1/4 relative">
          <Image
            src="/images/health.jpg"
            alt="Медицинская страховка"
            className="object-cover h-full w-full rounded-2xl"
            fill
          />
        </div>
      </div>

      {/* Modal and other components */}
      <Modal isOpen={isConfirmationModalOpen} onClose={closeConfirmationModal}>
        <h3 className="text-xl font-semibold">{t('contactForm.confirmationTitle')}</h3>
        <p>{t('contactForm.confirmationMessage')}</p>
        <div className="flex justify-between">
          <button onClick={closeConfirmationModal} className="btn btn-secondary">{t('contactForm.cancelButton')}</button>
          <button onClick={confirmSubmission} className="btn btn-primary">{t('contactForm.confirmButton')}</button>
        </div>
      </Modal>
      
      <Modal isOpen={isSuccessModalOpen} onClose={closeSuccessModal}>
        <h3 className="text-xl font-semibold">{t('contactForm.successMessage')}</h3>
        <p>{t('contactForm.successSubtitle')}</p>
        <button onClick={closeSuccessModal} className="btn btn-primary">{t('contactForm.confirmButton')}</button>
      </Modal>
    </>
  );
}
