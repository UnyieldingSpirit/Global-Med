import React from 'react';
import { UniversalCard } from '@/src/shared/components/UniversalCard';
import { useThemeStore } from '@/src/store/theme';
import { MedicalDocumentIcon, NotesIcon, PrecisionIcon, StethoscopeIcon } from '@/src/shared/ui/Icon';
import { useLanguageStore } from '@/src/store/language';
import { translations } from './BenefitScheckUpsTranslation'; // Import the translations

interface BenefitsCheckUpsProps {
  className?: string;
}

export const BenefitsCheckUps: React.FC<BenefitsCheckUpsProps> = ({
  className = ''
}) => {
  const { theme } = useThemeStore();
  const { currentLocale, setLocale } = useLanguageStore();

  const t = translations[currentLocale]; // Select translation based on the currentLocale

  const benefits = [
    {
      id: 'doctors',
      title: t.benefits.doctors.title,
      description: t.benefits.doctors.description,
      icon: <StethoscopeIcon size={80} color={theme === 'light' ? '#224F5B' : 'white'} />
    },
    {
      id: 'health',
      title: t.benefits.health.title,
      description: t.benefits.health.description,
      icon: <MedicalDocumentIcon size={80} color={theme === 'light' ? '#224F5B' : 'white'} />
    },
    {
      id: 'precision',
      title: t.benefits.precision.title,
      description: t.benefits.precision.description,
      icon: <PrecisionIcon size={80} color={theme === 'light' ? '#224F5B' : 'white'} />
    },
    {
      id: 'price',
      title: t.benefits.price.title,
      description: t.benefits.price.description,
      icon: <NotesIcon size={80} color={theme === 'light' ? '#224F5B' : 'white'} />
    }
  ];

  const descriptionLines = t.description;

  return (
    <div className={`w-full my-20 ${className}`}>
      <div className="flex flex-col md:flex-row mb-10">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-3xl md:text-5xl font-medium text-[#224F5B] dark:text-white mb-8">
            {t.title}
          </h2>
        </div>
        <div className="w-full md:w-1/2 flex items-center">
          <p className="text-base md:text-lg text-[#224F5B] dark:text-white">
            {descriptionLines.map((line, index) => (
              <span key={index} className="block">{line}</span>
            ))}
          </p>
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-6">
        {benefits.map((benefit) => (
          <UniversalCard
            key={benefit.id}
            title={benefit.title}
            description={benefit.description}
            icon={benefit.icon}
            showButton={false}
            variant="analysis"
          />
        ))}
      </div>
    </div>
  );
};
