"use client"
import Link from 'next/link';
import { useThemeStore } from '../store/theme';
import { useLanguageStore } from '../store/language';

export const metadata = {
  title: 'Страница не найдена | Global Medical Center',
  description: 'Запрашиваемая страница не найдена',
};

export default function NotFound() {
  const { theme } = useThemeStore();
  const { currentLocale, setLocale } = useLanguageStore();
  const translations = {
    ru: {
      title: 'Страница не найдена',
      message: 'Неправильно набран адрес или такой страницы больше нет',
      backToHome: 'Вернуться на главную',
    },
    uz: {
      title: 'Sahifa topilmadi',
      message: 'Noto‘g‘ri kiritilgan manzil yoki bunday sahifa endi mavjud emas',
      backToHome: 'Bosh sahifaga qaytish',
    },
  };
  const t = translations[currentLocale];
  return (
    <div className="container min-h-screen flex flex-col items-center justify-center py-10">
      <h1 className="text-4xl md:text-6xl font-medium text-light-text dark:text-dark-text mb-6">404</h1>
      <h2 className="text-xl md:text-3xl font-medium text-light-text dark:text-dark-text mb-6">
        {t.title}
      </h2>
      <p className="text-lg text-light-text/80 dark:text-dark-text/80 mb-10 text-center max-w-md">
        {t.message}
      </p>
      <Link href="/" className="px-6 py-3 bg-light-accent text-white rounded-xl hover:bg-light-accent/90 transition-colors">
        {t.backToHome}
      </Link>
    </div>
  );
}