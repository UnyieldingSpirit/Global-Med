'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/src/hooks/useTranslation';
import { AnimatedButton, AnimatedButtonWrapper } from '../../ui/Button/AnimatedButton';
import CertificatesSlider from './CertificateCard';
import AppointmentScheduler from './AppointmentScheduler';
import { ContactInfo } from '../ContactInfo';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Define types for the doctor data
export interface Education {
  years?: string;
  institution: string;
  course?: string;
}

export interface Certificate {
  id: string;
  imageUrl: string;
  title: string;
  expiryDate: string;
}

export interface Doctor {
  id?: string;
  name: string;
  specialization: string;
  photoUrl?: string;
  qualification?: string;
  category?: string;
  languages?: string;
  experience?: string;
  appointmentCost?: string;
  basicEducation?: Education[];
  additionalEducation?: Education[];
  certificates?: Certificate[];
    onAppointmentClick?: () => void;
}

// Type for translations
interface LocaleMessages {
  ru: {
    qualification: string;
    category: string;
    languages: string;
    experience: string;
    appointmentCost: string;
    basicEducation: string;
    additionalEducation: string;
    bookAppointment: string;
    certificates: {
      title: string;
      description: string;
    };
  };
  uz: {
    qualification: string;
    category: string;
    languages: string;
    experience: string;
    appointmentCost: string;
    basicEducation: string;
    additionalEducation: string;
    bookAppointment: string;
    certificates: {
      title: string;
      description: string;
    };
  };
}

// Пример данных сертификатов для тестирования
const certificatesData: Certificate[] = [
  {
    id: '1',
    imageUrl: '/images/certificate-1.png', 
    title: 'Сертификат по гинекологии',
    expiryDate: '19 мая 2027'
  },
  {
    id: '2',
    imageUrl: '/images/certificate-1.png', 
    title: 'Сертификат по гинекологии',
    expiryDate: '19 мая 2027'
  },
  {
    id: '3',
    imageUrl: '/images/certificate-1.png', 
    title: 'Сертификат по гинекологии',
    expiryDate: '19 мая 2027'
  },
  {
    id: '4',
    imageUrl: '/images/certificate-1.png', 
    title: 'Сертификат по гинекологии',
    expiryDate: '19 мая 2027'
  },
  {
    id: '5',
    imageUrl: '/images/certificate-1.png', 
    title: 'Сертификат по гинекологии',
    expiryDate: '19 мая 2027'
  },
  {
    id: '6',
    imageUrl: '/images/certificate-1.png', 
    title: 'Сертификат по гинекологии',
    expiryDate: '19 мая 2027'
  },
];

const translations: LocaleMessages = {
  ru: {
    qualification: 'Квалификация',
    category: 'Категория',
    languages: 'Языки',
    experience: 'Стаж',
    appointmentCost: 'Стоимость приема',
    basicEducation: 'Основное образование',
    additionalEducation: 'Дополнительное образование',
    bookAppointment: 'Записаться на прием',
    certificates: {
      title: 'Сертификаты и лицензии',
      description: 'Подтверждения квалификации врача и право на медицинскую практику'
    }
  },
  uz: {
    qualification: 'Malaka',
    category: 'Toifasi',
    languages: 'Tillar',
    experience: 'Tajriba',
    appointmentCost: 'Qabul narxi',
    basicEducation: 'Asosiy ta\'lim',
    additionalEducation: 'Qo\'shimcha ta\'lim',
    bookAppointment: 'Qabulga yozilish',
    certificates: {
      title: 'Sertifikatlar va litsenziyalar',
      description: 'Shifokor malakasini tasdiqlash va tibbiy amaliyot huquqi'
    }
  }
};

interface DoctorDetailProps {
  doctor: Doctor;
}

// Основной компонент деталей врача, включающий секцию сертификатов
export default function DoctorDetail({ doctor }: DoctorDetailProps): React.ReactElement {
  const { t } = useTranslation<LocaleMessages>(translations);
  const router = useRouter();
  
  // Функция для перехода на страницу записи
  const handleAppointment = (): void => {
    router.push('/appointment');
  };
  
  return (
    <div>
      {/* Верхний блок с основной информацией */}
      <div className="bg-white dark:bg-dark-block rounded-[24px] overflow-hidden mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Фото врача с скругленными углами */}
          <div className="w-full md:w-1/4 h-[430px] relative flex-shrink-0 p-4">
            <div className="w-full h-full relative overflow-hidden rounded-[16px]">
              <Image 
                src={doctor.photoUrl || "/images/doctor-placeholder.jpg"} 
                alt={doctor.name}
                fill
                className="object-cover object-center" 
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
          
          {/* Информация о враче */}
          <div className="p-8 md:pl-12 flex-1">
            <h1 className="text-[44px] font-semibold text-[#23464e] dark:text-white mb-2">
              {doctor.name}
            </h1>
            <p className="text-lg text-[#23464e]/80 dark:text-white/80 mb-8">
              {doctor.specialization}
            </p>
            
            <div className="space-y-5">
              {doctor.qualification && (
                <div>
                  <span className="text-[#23464e]/90 dark:text-white/90 font-semibold">
                    {t('qualification')}:
                  </span>{' '}
                  <span className="text-[#23464e] dark:text-white">
                    {doctor.qualification}
                  </span>
                </div>
              )}
              
              {doctor.category && (
                <div>
                  <span className="text-[#23464e]/90 dark:text-white/90 font-semibold">
                    {t('category')}:
                  </span>{' '}
                  <span className="text-[#23464e] dark:text-white">
                    {doctor.category}
                  </span>
                </div>
              )}
              
              {doctor.languages && (
                <div>
                  <span className="text-[#23464e]/90 dark:text-white/90 font-semibold">
                    {t('languages')}:
                  </span>{' '}
                  <span className="text-[#23464e] dark:text-white">
                    {doctor.languages}
                  </span>
                </div>
              )}
              
              {doctor.experience && (
                <div>
                  <span className="text-[#23464e]/90 dark:text-white/90 font-semibold">
                    {t('experience')}:
                  </span>{' '}
                  <span className="text-[#23464e] dark:text-white">
                    {doctor.experience}
                  </span>
                </div>
              )}
              
              {doctor.appointmentCost && (
                <div>
                  <span className="text-[#23464e]/90 dark:text-white/90 font-semibold">
                    {t('appointmentCost')}:
                  </span>{' '}
                  <span className="text-[#23464e] dark:text-white">
                    {doctor.appointmentCost}
                  </span>
                </div>
              )}
            </div>
            
              <button 
               onClick={doctor.onAppointmentClick}
                className="px-8 py-4 mt-[20px] rounded-[12px] bg-transparent text-[#23464e] dark:text-white border-2 border-[#23464e] dark:border-white hover:bg-[#00c78b] hover:text-white hover:border-[#00c78b] transition-all duration-300 font-medium w-full md:w-auto"
              >
                {t('bookAppointment')}
              </button>
          </div>
        </div>
      </div>
      
   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
  <div className="bg-white dark:bg-dark-block rounded-[24px] p-12 shadow-sm flex flex-col h-full">
    <h2 className="text-[24px] font-medium text-[#23464e] dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      {t('basicEducation')}
    </h2>
    
    {/* flex-grow-1 позволяет содержимому занимать всё доступное пространство */}
    <div className="space-y-6 flex-grow">
      {doctor.basicEducation && doctor.basicEducation.map((edu, index) => (
        <div key={index} className="pb-4 last:pb-0">
          <div className="font-medium text-[18px] text-[#23464e] dark:text-white mb-1">
            {edu.course}
          </div>
          <div className="text-[#23464e] text-[18px] dark:text-white opacity-80">
            {edu.institution}
          </div>
        </div>
      ))}
    </div>
  </div>
  
  {/* Дополнительное образование */}
  <div className="bg-white dark:bg-dark-block rounded-[24px] p-12 shadow-sm flex flex-col h-full">
    <h2 className="text-[24px] font-medium text-[#23464e] dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
      {t('additionalEducation')}
    </h2>
    
    <div className="space-y-6 flex-grow">
      {doctor.additionalEducation && doctor.additionalEducation.map((edu, index) => (
        <div key={index} className="pb-4 last:pb-0">
          <div className="font-medium text-[18px] text-[#23464e] dark:text-white mb-1">
            {edu.course}
          </div>
          <div className="text-[#23464e] text-[18px] dark:text-white opacity-80">
            {edu.institution}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
      
      {/* Секция сертификатов - используем реальные данные врача или тестовые */}
      <CertificatesSlider 
        certificates={doctor.certificates || certificatesData}
        title={t('certificates.title')}
        description={t('certificates.description')}
      />

      <AppointmentScheduler />
      <ContactInfo />
    </div>
  );
}