'use client';

import React, { useEffect, useState } from 'react';
import UniversalHeroSection from '@/src/shared/components/UniversalHeroSection';
import { checkupHeroData, checkupItemsData } from '@/src/shared/mocks/checkupHeroData';
import { UniversalCard } from '@/src/shared/components/UniversalCard';
import { AppointmentSection } from '@/src/shared/components/AppointmentSection';
import { ContactInfo } from '@/src/shared/components/ContactInfo';
import axios from 'axios';

// Интерфейсы для типизации данных API
interface MedicalTest {
  uuid: string;
  name: string;
  mini_description: string;
}

interface CheckupItem {
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
}

export default function Checkups() {
  // Состояния для работы с API
  const [checkupItems, setCheckupItems] = useState<CheckupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Загрузка данных с API при монтировании компонента
  useEffect(() => {
    const fetchCheckups = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://globalmed.kelyanmedia.com/api/checkups');
        setCheckupItems(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке списка чек-апов:', err);
        setError(err instanceof Error ? err : new Error('Ошибка при загрузке данных'));
      } finally {
        setLoading(false);
      }
    };

    fetchCheckups();
  }, []);

  // Функция для получения иконки из мока по slug
  const getIconBySlug = (slug: string) => {
    // Ищем соответствующий элемент в моковых данных
    const mockItem = checkupItemsData.find(item => item.id === slug);
    
    // Если нашли элемент, возвращаем его иконку, иначе возвращаем дефолтную
    return mockItem ? mockItem.iconPath : "/icons/medical-check.svg";
  };

  return (
    <main>
      <UniversalHeroSection
        imageUrl={checkupHeroData.imageUrl}
        imageAlt={checkupHeroData.imageAlt}
        mainCard={checkupHeroData.mainCard}
        secondaryCards={checkupHeroData.secondaryCards}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64 mt-20">
          <div className="text-xl text-light-text dark:text-dark-text">Загрузка программ обследования...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 mt-20">
          <div className="text-xl text-red-500">Ошибка при загрузке данных. Пожалуйста, попробуйте позже.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-20">
          {checkupItems.map((item) => (
            <UniversalCard
              key={item.uuid}
              features={[
                { text: `${item.medical_tests.length} исследований`, icon: "doc" },
                { text: item.duration, icon: "time" }
              ]}
              variant="surgery"
              title={item.title}
              description={item.card_description || item.description}
              // Используем иконку из мока на основе slug
              icon={getIconBySlug(item.slug)}
              link={`/checkups/${item.slug}`}
              buttonText="Подробнее"
              showButton={true}
              buttonStyle="filled"
              hoverBgColor="light-accent"
              titleSize="text-2xl md:text-[40px]"
              additionalInfo={`${item.medical_tests.length} исследований • ${item.duration}`}
              className="border-none shadow-none rounded-b-2xl md:rounded-2xl p-8"
            />
          ))}
        </div>
      )}
      
      <AppointmentSection />
      <ContactInfo />
    </main>
  );
}