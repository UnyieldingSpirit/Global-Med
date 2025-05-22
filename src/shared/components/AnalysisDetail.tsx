/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/src/hooks/useTranslation';

interface AnalysisDetailProps {
  params: {
    id: string;
  };
}

const analysisDetails = {
  coagulogram: {
    title: 'Коагулограмма',
    description: 'Коагулограмма — это набор анализов, позволяющих оценить свертывающую способность крови и выявить возможные нарушения. Проведение коагулограммы важно для предотвращения тромбообразования, оценки состояния при заболеваниях печени, а также для подготовки к операциям.',
    testsCount: 18,
    buttonText: 'Записаться на сдачу анализов'
  },
};

const translations = {
  ru: {
    appointmentButton: 'Записаться на сдачу анализов',
    tests: 'анализов',
    prepareTitle: 'Как подготовиться к сдаче анализа',
    prepareDesc: 'Для получения точных результатов важно правильно подготовиться к сдаче анализа',
    preparationSteps: [
      'Сдавать кровь рекомендуется утром, натощак (после 8-12 часов голодания)',
      'За 1-2 дня до сдачи крови исключите жирную пищу и алкоголь',
      'За 1 час до анализа воздержитесь от курения и физических нагрузок',
      'Избегайте эмоционального стресса за 24 часа до анализа',
      'Сообщите врачу о принимаемых лекарствах, так как некоторые препараты могут влиять на результаты'
    ],
    indicatorsTitle: 'Основные показатели',
    indicators: [
      {
        name: 'МНО (INR)',
        description: 'Международное нормализованное отношение, оценивает внешний путь свертывания крови',
        norm: '0.85 - 1.25'
      },
      {
        name: 'Протромбиновое время (PT)',
        description: 'Оценивает время, необходимое для образования сгустка',
        norm: '11 - 16 сек'
      },
      {
        name: 'АЧТВ (APTT)',
        description: 'Активированное частичное тромбопластиновое время, характеризует внутренний путь свертывания',
        norm: '26 - 36 сек'
      },
      {
        name: 'Тромбиновое время (TT)',
        description: 'Показывает время превращения фибриногена в фибрин',
        norm: '15 - 22 сек'
      },
      {
        name: 'Фибриноген',
        description: 'Белок, участвующий в последнем этапе свертывания крови',
        norm: '1.8 - 4.0 г/л'
      },
      {
        name: 'D-димер',
        description: 'Продукт распада фибрина, маркер тромбозов',
        norm: '< 0.5 мкг/мл'
      }
    ],
    backButton: 'Назад к анализам'
  },
  uz: {
    appointmentButton: 'Tahlil topshirishga yozilish',
    tests: 'tahlil',
    prepareTitle: 'Tahlil topshirishga qanday tayyorlanish kerak',
    prepareDesc: 'Aniq natijalar olish uchun tahlil topshirishga to\'g\'ri tayyorlanish muhim',
    preparationSteps: [
      'Qon topshirish uchun ertalab, och qoringa tavsiya etiladi (8-12 soat ochlik)',
      'Qon topshirishdan 1-2 kun oldin yog\'li ovqat va spirtli ichimliklardan saqlanish lozim',
      'Tahlildan 1 soat oldin chekishdan va jismoniy mashqlardan saqlanish kerak',
      'Tahlildan 24 soat oldin hissiy stressdan qoching',
      'Qabul qilinayotgan dorilar haqida shifokorga xabar bering, chunki ayrim dorilar natijaga ta\'sir qilishi mumkin'
    ],
    indicatorsTitle: 'Asosiy ko\'rsatkichlar',
    indicators: [
      {
        name: 'XNK (INR)',
        description: 'Xalqaro normallashtirilgan koeffitsient, qon ivishining tashqi yo\'lini baholaydi',
        norm: '0.85 - 1.25'
      },
      {
        name: 'Protrombin vaqti (PT)',
        description: 'Qon laxtasining hosil bo\'lishi uchun zarur bo\'lgan vaqtni baholaydi',
        norm: '11 - 16 sek'
      },
      {
        name: 'FQTV (APTT)',
        description: 'Faollashtirilgan qisman tromboplastin vaqti, qon ivishining ichki yo\'lini baholaydi',
        norm: '26 - 36 sek'
      },
      {
        name: 'Trombin vaqti (TT)',
        description: 'Fibrinogenning fibringa aylanish vaqtini ko\'rsatadi',
        norm: '15 - 22 sek'
      },
      {
        name: 'Fibrinogen',
        description: 'Qon ivishining oxirgi bosqichida ishtirok etuvchi oqsil',
        norm: '1.8 - 4.0 g/l'
      },
      {
        name: 'D-dimer',
        description: 'Fibrin parchalanish mahsuloti, tromboz markeri',
        norm: '< 0.5 mkg/ml'
      }
    ],
    backButton: 'Tahlillarga qaytish'
  }
};

const AnalysisDetail: React.FC<AnalysisDetailProps> = ({ params }) => {
  const { t } = useTranslation(translations);
  const { id } = params;
  
  const [, setIsMobile] = useState(false);
  
  const [pulsePower, setPulsePower] = useState(1);
  
  useEffect(() => {
    let power = 1;
    let increasing = true;
    
    const interval = setInterval(() => {
      if (power >= 1.8) increasing = false;
      if (power <= 1) increasing = true;
      
      power = increasing ? power + 0.05 : power - 0.05;
      setPulsePower(power);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Получаем данные по ID анализа или используем первый по умолчанию
  const analysisData = (analysisDetails as any)[id] || analysisDetails.coagulogram;
  
  // Функция для перехода к форме записи
  const handleAppointment = () => {
    const appointmentSection = document.getElementById('appointment-section');
    if (appointmentSection) {
      appointmentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="overflow-hidden">
      {/* Верхний баннер как на фото */}
      <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden mb-8 md:mb-12 relative bg-light-accent">
        {/* Фоновый паттерн */}
        <div 
          className="absolute -right-[10px] -bottom-[180px] w-[1400px] h-[500px] pointer-events-none z-[1] hidden md:block" 
          style={{
            backgroundImage: 'url(/images/doctor-pattern.png)',
            backgroundSize: 'contain',
            transform: 'rotate(-50deg)',
            backgroundPosition: 'right bottom',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Контентная часть баннера */}
        <div className="relative z-10 p-6 sm:p-8 md:p-10 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-[56px] font-medium mb-3 md:mb-6">
            {analysisData.title}
          </h1>
          
          <p className="text-base sm:text-lg max-w-3xl mb-6 md:mb-6">
            {analysisData.description}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Блок с количеством анализов */}
            <div className="flex items-center bg-[#0AD195] px-10 py-4 rounded-2xl">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="text-base sm:text-lg">
                {analysisData.testsCount} {t('tests')}
              </span>
            </div>
            
            {/* Анимированная кнопка записи - такая же как в чек-апе */}
            <button 
              onClick={handleAppointment}
              className="w-full sm:w-auto px-4 sm:px-6 md:px-10 lg:px-20 py-3 sm:py-4 border-2 border-white rounded-lg sm:rounded-xl transition-all duration-300 relative overflow-hidden group hover:bg-white hover:text-light-accent hover:scale-105 hover:shadow-lg hover:shadow-white/30 focus:outline-none text-xs sm:text-sm md:text-base"
            >
              {/* Основной текст */}
              <span className="relative z-10 group-hover:font-bold">{t('appointmentButton')}</span>
              
              {/* Пульсирующий фон - переменная интенсивность */}
              <span 
                className="absolute inset-0 bg-white/30 rounded-lg sm:rounded-xl opacity-100 group-hover:opacity-0"
                style={{
                  animation: `pulse ${pulsePower}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                }}
              />
              
              {/* Свечение вокруг кнопки */}
              <span 
                className="absolute -inset-1 bg-white/20 rounded-lg sm:rounded-xl blur-sm group-hover:bg-transparent"
                style={{
                  animation: `pulse ${pulsePower + 0.3}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                }}
              />
              
              {/* Эффект движущихся бликов */}
              <span className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-lg sm:rounded-xl">
                <span 
                  className="absolute h-8 sm:h-12 md:h-20 w-8 sm:w-12 md:w-20 -top-4 sm:-top-6 md:-top-10 -left-4 sm:-left-6 md:-left-10 bg-white/40 rounded-full blur-md transform rotate-45 group-hover:scale-150"
                  style={{ animation: 'moveHighlight1 6s infinite linear' }}
                ></span>
                
                <span 
                  className="absolute h-6 sm:h-10 md:h-16 w-6 sm:w-10 md:w-16 -bottom-3 sm:-bottom-5 md:-bottom-8 -right-3 sm:-right-5 md:-right-8 bg-white/30 rounded-full blur-md transform rotate-45 group-hover:scale-150"
                  style={{ animation: 'moveHighlight2 8s infinite linear' }}
                ></span>
              </span>
              
              {/* Эффект при наведении - рябь по воде */}
              <span 
                className="absolute inset-0 scale-0 rounded-lg sm:rounded-xl bg-white/40 group-hover:animate-ripple"
              ></span>
            </button>
          </div>
        </div>
      </div>
      {/* CSS для анимаций */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes moveHighlight1 {
          0% {
            transform: translateX(-100%) translateY(-20%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) translateY(100%) rotate(45deg);
          }
        }
        
        @keyframes moveHighlight2 {
          0% {
            transform: translateX(200%) translateY(100%) rotate(45deg);
          }
          100% {
            transform: translateX(-100%) translateY(-20%) rotate(45deg);
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .group-hover\\:animate-ripple:hover {
          animation: ripple 1s cubic-bezier(0, 0, 0.2, 1);
        }
      `}</style>
    </main>
  );
};

export default AnalysisDetail;