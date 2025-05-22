"use client";

import React, { useState, useEffect } from "react";
import UniversalHeroSection from "@/src/shared/components/UniversalHeroSection";
import { UniversalCard } from "@/src/shared/components/UniversalCard";
import { useThemeStore } from "@/src/store/theme";
import { useLanguageStore } from "@/src/store/language";
import { ContactInfo } from "@/src/shared/components/ContactInfo";
import { AppointmentSection } from "@/src/shared/components/AppointmentSection";
import axios from "axios";
import {
  LightbulbIcon,
  EyeIcon,
  ButterflyIcon,
  MedicalIcon,
  AngelIcon,
  BlobShape,
  ButterflyWingsIcon,
  DocumentPenIcon,
  MedicalMicroscopeIcon,
  ThyroidIcon,
} from "@/src/shared/ui/Icon";
import BonesIcon from "@/src/shared/ui/Icon/BonesIcon";
import NoseIcon from "@/src/shared/ui/Icon/NoseIcon";

const serviceIconMap: { [key: string]: React.ReactNode } = {
  "lor-247": <LightbulbIcon size={80} />,
  oftalmologiia: <EyeIcon size={80} />,
  pediatriia: <ButterflyIcon size={80} />,
  ginekologiia: <AngelIcon size={80} />,
  nevrologiia: <BlobShape size={80} />,
  onkologiia: <ButterflyWingsIcon size={80} />,
  xirurgiia: <DocumentPenIcon size={80} />,
  uzi: <MedicalMicroscopeIcon size={80} />,
  endokrinologiia: <ThyroidIcon size={80} />,
  travmatologiia: <AngelIcon size={80} />,
};

interface Service {
  uuid: string;
  slug: string;
  name: string;
  card_description: string;
  description: string;
  mini_description: string;
  icon: string | null;
  symptoms_list: string[];
  services_list: { name: string; value: string }[];
}

interface ServicesResponse {
  data: Service[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function ServicesPage() {
  const { theme } = useThemeStore();
  const { currentLocale } = useLanguageStore();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const heroData = {
    imageUrl: "/images/medical-services.png",
    imageAlt:
      currentLocale === "uz"
        ? "Klinikamizdagi tibbiy xizmatlar"
        : "Медицинские услуги в нашей клинике",
    // mainCard: {
    //   title: currentLocale === 'uz'
    //     ? "Tibbiy xizmatlar"
    //     : "Медицинские услуги",
    //   description:
    //     currentLocale === 'uz'
    //       ? "Biz zamonaviy usullar va asbob-uskunalardan foydalangan holda professional tekshiruv va davolash xizmatlarini taqdim etamiz. Markazimizda tajribali shifokorlar sizni individual yondashuv bilan kutib olishadi va davolanish jarayonining har bir bosqichida qulaylikni ta'minlaydi."
    //       : "Мы предоставляем профессиональное обследование и лечение, используя новейшие методы и оборудование, чтобы обеспечить вам высококачественную медицинскую помощь. В нашем центре вас ждут опытные врачи, готовые предоставить индивидуальный подход и гарантировать комфорт на каждом этапе лечения.",
    // },
    // secondaryCards: [
    //   {
    //     title: "10",
    //     description: currentLocale === 'uz'
    //       ? "yo‘nalish bo‘yicha yuqori sifatli tibbiy xizmatlar ko‘rsatamiz"
    //       : "направлений, в которых мы оказываем высококачественное медицинское обслуживание"
    //   },
    //   {
    //     title: "10 000+",
    //     description: currentLocale === 'uz'
    //       ? "har yili minglab bemorlar sog‘lig‘ini bizga ishonib topshiradi"
    //       : "пациентов ежегодно доверяют нам своё здоровье, проходя диагностику и лечение в клинике"
    //   }
    // ]
  };
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ServicesResponse>(
          "https://globalmed.kelyanmedia.com/api/services",
          {
            headers: {
              "X-Language": currentLocale || "ru",
            },
          }
        );
        setServices(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Ошибка при загрузке списка услуг:", err);
        setError(
          err instanceof Error ? err : new Error("Ошибка при загрузке данных")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [currentLocale]);
  const [dataPagesService, setDataPagesService] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://globalmed.kelyanmedia.com/api/pages/services",
          {
            headers: {
              "X-Language": currentLocale,
            },
          }
        );
        const result = await response.json();
        setDataPagesService(result);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [currentLocale]);
  return (
    <main>
      <UniversalHeroSection
        data={dataPagesService}
        imageUrl={heroData.imageUrl}
        imageAlt={heroData.imageAlt}
        className="mb-20"
      />

      <div className="w-full mt-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-light-text dark:text-dark-text">
              Загрузка услуг...
            </p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500">
              Ошибка при загрузке данных. Пожалуйста, попробуйте позже.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.uuid} className="h-full">
                <UniversalCard
                  variant="service"
                  title={service.name}
                  description={
                    service.card_description || service.mini_description
                  }
                  additionalInfo={`${
                    currentLocale === "uz" ? "Xizmatlar: " : "Услуги: "
                  }${service.services_list.length}`}
                  icon={service.icon}
                  link={`/services/${service.slug}`}
                  buttonText={` ${
                    currentLocale === "uz" ? "Batafsil" : "Подробнее"
                  }`}
                  className="h-full"
                  iconPosition="center"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <AppointmentSection />
      <ContactInfo />
    </main>
  );
}
