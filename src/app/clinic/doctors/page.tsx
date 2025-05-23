'use client';

import React, { useState, useEffect } from 'react';
import DoctorCard from "@/src/shared/components/Doctor/DoctorCard";
import DoctorSearchSection from "@/src/shared/components/Doctor/DoctorSearchSection";
import { useTranslation } from '@/src/hooks/useTranslation';
import { ContactInfo } from '@/src/shared/components/ContactInfo';
import { useDoctorsStore } from '@/src/store/doctors';

// Локализация
const translations = {
  ru: {
    ourSpecialists: 'Наши специалисты',
    showMore: 'Показать еще',
    loading: 'Загрузка...',
    error: 'Произошла ошибка при загрузке данных',
    tryAgain: 'Попробовать снова',
    noResults: 'Врачи не найдены'
  },
  uz: {
    ourSpecialists: 'Bizning mutaxassislar',
    showMore: 'Ko\'proq ko\'rsatish',
    loading: 'Yuklanmoqda...',
    error: 'Ma\'lumotlarni yuklashda xatolik yuz berdi',
    tryAgain: 'Qayta urinib ko\'ring',
    noResults: 'Shifokorlar topilmadi'
  }
};

export default function Doctors() {
  const { t } = useTranslation(translations);
  const { 
    doctors, 
    loading, 
    error, 
    fetchDoctors, 
    setPage, 
    currentPage, 
    totalPages, 
    filters,
  } = useDoctorsStore();
  
  const [isRotating, setIsRotating] = useState(false);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  
  // Сбрасываем отображение при изменении фильтров
  useEffect(() => {
    console.log('Current filters:', filters);
    
    // Сбрасываем состояние при изменении фильтров
    setAllDoctors([]);
    setVisibleCount(8);
    
    // Загружаем первую страницу
    fetchDoctors().then(() => {
      console.log('Fetched doctors:', doctors);
    });
  }, [JSON.stringify(filters)]);
  
  // Обновляем локальный массив при получении новых данных
  useEffect(() => {
    if (doctors.length > 0) {
      // Если это первая страница или сброс фильтров - заменяем данные
      if (currentPage === 1) {
        setAllDoctors(doctors);
      } 
      // Иначе добавляем новые данные к существующим
      else {
        setAllDoctors(prev => {
          // Создаем Map для быстрого поиска дубликатов по id
          const existingIds = new Map(prev.map(doc => [doc.uuid, true]));
          // Добавляем только те записи, которых еще нет
          const newDoctors = doctors.filter(doc => !existingIds.has(doc.uuid));
          return [...prev, ...newDoctors];
        });
      }
    }
  }, [doctors, currentPage]);

  // Обработчик "Показать еще"
  const handleShowMore = async () => {
    setIsRotating(true);
    
    // Если показаны все доктора на текущей странице, но есть еще страницы
    if (visibleCount >= allDoctors.length && currentPage < totalPages) {
      // Загружаем следующую страницу
      setPage(currentPage + 1);
      
      try {
        await fetchDoctors();
        // Количество видимых увеличиваем на стандартное число (8)
        setVisibleCount(prev => prev + 8);
      } catch (error) {
        console.error('Error loading more doctors:', error);
      }
    } 
    // Если просто нужно показать больше докторов с текущей страницы
    else {
      setVisibleCount(prev => Math.min(prev + 8, allDoctors.length));
    }
    
    // В любом случае отключаем анимацию через небольшую задержку
    setTimeout(() => {
      setIsRotating(false);
    }, 500);
  };
  
  // Функция для форматирования опыта, чтобы сохранить тот же формат
  const formatExperience = (experience: string): string => {
    // Если строка уже содержит "лет" или "год", возвращаем как есть
    if (experience.includes('лет') || experience.includes('год')) {
      return experience;
    }
    
    // Иначе добавляем слово "лет" или "год" в зависимости от числа
    const years = parseInt(experience.replace(/\D/g, ''));
    if (years === 1) return `${years} год`;
    if (years > 1 && years < 5) return `${years} года`;
    return `${years} лет`;
  };
  
  // Только видимые доктора из общего списка
  const visibleDoctors = allDoctors.slice(0, visibleCount);
  
  // Определяем, нужно ли показывать кнопку "Показать еще"
  const showMoreButton = visibleCount < allDoctors.length || currentPage < totalPages;
  
  return (
    <main>
      <DoctorSearchSection />
      
      <div className="py-8">
        <h2 className="text-2xl md:text-3xl font-medium mb-8 text-light-text dark:text-dark-text">
          {t('ourSpecialists')}
        </h2>
        
        {loading && allDoctors.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light-accent"></div>
            <span className="ml-3 text-light-text dark:text-dark-text">{t('loading')}</span>
          </div>
        ) : error && allDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mb-4">
              <p>{t('error')}</p>
            </div>
            <button 
              onClick={() => fetchDoctors()}
              className="px-4 py-2 bg-light-accent text-white rounded-lg"
            >
              {t('tryAgain')}
            </button>
          </div>
        ) : allDoctors.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="text-light-text/70 dark:text-dark-text/70 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-light-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl">{t('noResults')}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleDoctors.map(doctor => (
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
                  disabled={loading}
                  className="flex items-center justify-center w-full md:w-auto mx-auto px-8 py-4 border border-light-text dark:border-white text-light-text dark:text-white rounded-2xl hover:bg-light-text/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg 
                    className={`w-5 h-5 mr-2 ${isRotating || loading ? 'animate-spin' : ''}`} 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.51 8.99959C4.01717 7.56637 4.87913 6.28499 6.01547 5.27501C7.1518 4.26502 8.52547 3.55935 10.0083 3.22385C11.4911 2.88834 13.0348 2.93393 14.4952 3.35636C15.9556 3.77879 17.2853 4.5643 18.36 5.63959L23 9.99959M1 13.9996L5.64 18.3596C6.71475 19.4349 8.04437 20.2204 9.50481 20.6428C10.9652 21.0652 12.5089 21.1108 13.9917 20.7753C15.4745 20.4398 16.8482 19.7342 17.9845 18.7242C19.1209 17.7142 19.9828 16.4328 20.49 14.9996" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {loading ? t('loading') : t('showMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <ContactInfo />
      
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </main>
  );
}