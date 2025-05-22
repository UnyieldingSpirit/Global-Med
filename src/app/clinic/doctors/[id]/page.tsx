"use client";

import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DoctorDetail from "@/src/shared/components/Doctor/DoctorDetail";
import { useAuth } from "@/src/hooks/useAuth";
import { GBContext } from "@/src/context/globalize-breadcrumb";
import { useLanguageStore } from "@/src/store/language";

interface EducationDetail {
  title: string;
  subtitle: string;
}

interface EducationGroup {
  title: string;
  details: EducationDetail[];
}

interface Certificate {
  name: string;
  image: string;
  subname: string;
}

interface DoctorDetailData {
  uuid: string;
  full_name: string;
  image_url: string;
  slug: string;
  specialization: string;
  specialization_uuid: string;
  experience_years: string;
  qualification: string;
  category: string;
  languages: string;
  education: EducationGroup[];
  certificates: Certificate[];
  price_from: string;
}

interface DoctorDetailResponse {
  data: DoctorDetailData;
}

export default function DoctorDetailPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const id = params?.id;
  const [doctor, setDoctor] = useState<DoctorDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setTitle }: any = useContext(GBContext);
  const { currentLocale } = useLanguageStore();
  const handleAppointmentClick = (): void => {
    console.log("Проверка авторизации:", isAuthenticated());

    if (isAuthenticated()) {
      router.push(`/account/appointment?doctor_id=${doctor?.uuid}`);
    } else {
      router.push(
        `/account/login?redirect_to=/account/appointment?doctor_id=${doctor?.uuid}`
      );
    }
  };

  useEffect(() => {
    const fetchDoctorDetail = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Проверяем и преобразуем id к нужному типу
        const doctorId = Array.isArray(id) ? id[0] : id;

        if (!doctorId) {
          throw new Error("Некорректный идентификатор доктора");
        }

        const apiUrl = "https://globalmed.kelyanmedia.com/api";
        const response = await fetch(`${apiUrl}/doctors/${doctorId}`, {
          headers: {
            "X-Language": currentLocale === "uz" ? "uz" : "ru",
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка API: ${response.status}`);
        }

        const data: DoctorDetailResponse = await response.json();
        setDoctor(data.data);
        setTitle(data.data.full_name);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка при загрузке доктора:", err);
        setError(
          "Не удалось загрузить информацию о докторе. Пожалуйста, попробуйте позже."
        );
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctorDetail();
    } else {
      setError("Идентификатор доктора не указан");
      setLoading(false);
    }
  }, [id, currentLocale]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-light-accent border-t-transparent animate-spin"></div>
          <p className="mt-4 text-light-text dark:text-dark-text">
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
          <p>{error || "Информация о докторе не найдена"}</p>
        </div>
      </div>
    );
  }

  // Преобразуем данные из API в формат, ожидаемый компонентом DoctorDetail
  const doctorData = {
    id: doctor.uuid,
    name: doctor.full_name,
    specialization: doctor.specialization,
    photoUrl: doctor.image_url,
    qualification: doctor.qualification,
    category: doctor.category,
    languages: doctor.languages,
    experience: doctor.experience_years,
    appointmentCost: doctor.price_from,

    // Преобразуем образование
    basicEducation:
      doctor.education.length > 0
        ? doctor.education[0].details.map((item) => ({
            institution: item.title,
            course: item.subtitle,
          }))
        : [],

    additionalEducation:
      doctor.education.length > 1
        ? doctor.education[1].details.map((item) => ({
            institution: item.title,
            course: item.subtitle,
          }))
        : [],

    // Преобразуем сертификаты
    certificates: doctor.certificates.map((cert) => ({
      id: cert.name,
      imageUrl: cert.image,
      title: cert.name,
      expiryDate: cert.subname,
    })),

    // Добавляем обработчик для кнопки записи на прием
    onAppointmentClick: handleAppointmentClick,
  };

  return <DoctorDetail doctor={doctorData} />;
}
