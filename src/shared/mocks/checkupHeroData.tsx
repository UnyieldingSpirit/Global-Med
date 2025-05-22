import React from "react";
import {
  ButterflyLogoSmallIcon,
  ConnectionsIcon,
  HealthMonitorIcon,
  LightbulbIcon,
  LocationPinIcon,
  MagnifyingGlassIcon,
  MuscleIcon,
  PacifierIcon,
  PregnancyIcon,
} from "@/src/shared/ui/Icon";
import NeuronIcon from "../ui/Icon/NeuronIcon";

export const checkupHeroData = {
  imageUrl: "/images/checkup-doctor.png",
  imageAlt: "Медицинский осмотр",
  mainCard: {
    title: "Чек-ап",
    description:
      "Это комплексное медицинское обследование, которое помогает выявить скрытые заболевания, оценить общее состояние здоровья и предотвратить возможные риски. Мы разработали программы для разных возрастов и потребностей, чтобы вы могли провести диагностику здоровья максимально быстро и комфортно.",
  },
  secondaryCards: [
    {
      title: "16",
      description:
        "видов чек-апов — для мужчин, женщин и детей, включая базовые и специализированные программы",
    },
    {
      title: "1 000+",
      description:
        "человек ежегодно проходят у нас чек-апы, доверяя экспертам диагностику здоровья",
    },
  ],
};

export const checkupItemsData = [
  {
    id: "planned-operation",
    title: "Плановая операция",
    description:
      "Комплекс исследований для оценки общего состояния здоровья и снижения рисков перед хирургическим вмешательством",
    iconPath: <HealthMonitorIcon size={190} />,
    stats: [
      { icon: "doc", value: "11 исследований" },
      { icon: "time", value: "1,5 часа" },
    ],
  },
  {
    id: "womens-health",
    title: "Женское здоровье",
    description:
      "Комплексное обследование для контроля гормонального фона, репродуктивной системы и общего самочувствия",
    iconPath: <MagnifyingGlassIcon size={190} />,
    stats: [
      { icon: "doc", value: "6 исследований" },
      { icon: "time", value: "1 час" },
    ],
  },
  {
    id: "premium-womens-health",
    title: "Премиум. Женское здоровье",
    description:
      "Расширенная диагностика с углубленным анализом гормонов, репродуктивной системы и общего состояния организма",
    iconPath: <MagnifyingGlassIcon size={190} />,
    stats: [
      { icon: "doc", value: "9 исследований" },
      { icon: "time", value: "1,5 часа" },
    ],
  },
  {
    id: "mens-health-under-40",
    title: "Мужское здоровье до 40 лет",
    description:
      "Комплексное обследование для оценки гормонального баланса, репродуктивной функции и общего состояния организма",
    iconPath: <LocationPinIcon size={190} />,
    stats: [
      { icon: "doc", value: "5 исследований" },
      { icon: "time", value: "1 час" },
    ],
  },
  {
    id: "mens-health-over-40",
    title: "Мужское здоровье 40+ лет",
    description:
      "Комплексное обследование, включающее проверку урологического здоровья, гормонального фона и скрытых инфекций",
    iconPath: <LocationPinIcon size={190} />,
    stats: [
      { icon: "doc", value: "5 исследований" },
      { icon: "time", value: "1 час" },
    ],
  },
  {
    id: "premium-mens-health-under-40",
    title: "Премиум. Мужское здоровье до 40 лет",
    description:
      "Расширенное комплексное обследование для оценки гормонального баланса, репродуктивной функции и общего состояния организма",
    iconPath: <LocationPinIcon size={190} />,
    stats: [
      { icon: "doc", value: "7 исследований" },
      { icon: "time", value: "1,5 часа" },
    ],
  },
  {
    id: "premium-mens-health-over-40",
    title: "Премиум. Мужское здоровье 40+ лет",
    description:
      "Расширенное комплексное обследование, включающее проверку урологического здоровья, гормонального фона и скрытых инфекций",
    iconPath: <LocationPinIcon size={190} />,
    stats: [
      { icon: "doc", value: "11 исследований" },
      { icon: "time", value: "2 часа" },
    ],
  },
  {
    id: "healthy-family",
    title: "Здоровая семья",
    description:
      "Комплексное обследование для мужчин и женщин, помогающее оценить общее состояние здоровья и выявить риски заболеваний",
    iconPath: <ButterflyLogoSmallIcon size={190} />,
    stats: [
      { icon: "doc", value: "11 исследований" },
      { icon: "time", value: "2 часа" },
    ],
  },
  {
    id: "premium-healthy-family",
    title: "Премиум. Здоровая семья",
    description:
      "Расширенное комплексное обследование для мужчин и женщин с детальной диагностикой, углубленными анализами и консультациями врачей",
    iconPath: <ButterflyLogoSmallIcon size={190} />,
    stats: [
      { icon: "doc", value: "20 исследований" },
      { icon: "time", value: "3 часа" },
    ],
  },
  {
    id: "want-to-be-mother",
    title: "Хочу стать мамой",
    description:
      "Комплексное обследование для женщин, планирующих беременность, включающее важные анализы, УЗИ и консультации специалистов для подготовки к здоровому зачатию",
    iconPath: <PregnancyIcon size={190} />,
    stats: [
      { icon: "doc", value: "12 исследований" },
      { icon: "time", value: "2 часа" },
    ],
  },
  {
    id: "want-to-be-father",
    title: "Хочу стать папой",
    description:
      "Комплексное обследование мужского здоровья, включающее анализы и диагностику репродуктивной функции, чтобы убедиться в готовности организма к зачатию ребенка",
    iconPath: <NeuronIcon size={190} />,
    stats: [
      { icon: "doc", value: "10 исследований" },
      { icon: "time", value: "1,5 часа" },
    ],
  },
  {
    id: "golden-age-55-plus-women",
    title: "Золотой возраст 55+ (женщины)",
    description:
      "Комплексное обследование для оценки общего состояния здоровья, работы сердца, сосудов, гормонального фона и профилактики возрастных изменений",
    iconPath: <MagnifyingGlassIcon size={190} />,
    stats: [
      { icon: "doc", value: "9 исследований" },
      { icon: "time", value: "1,5 часа" },
    ],
  },
  {
    id: "golden-age-55-plus-men",
    title: "Золотой возраст 55+ (мужчины)",
    description:
      "Комплексное обследование, включающее проверку сердца, сосудов, гормонального баланса и ключевых показателей здоровья для активной и полноценной жизни",
    iconPath: <LocationPinIcon size={190} />,
    stats: [
      { icon: "doc", value: "10 исследований" },
      { icon: "time", value: "1,5 часа" },
    ],
  },
  {
    id: "healthy-child-kindergarten",
    title: "Здоровый ребенок. Детский сад",
    description:
      "Комплексное обследование, включающее анализы, осмотры специалистов и необходимые исследования для поступления в детский сад",
    iconPath: <PacifierIcon size={190} />,
    stats: [
      { icon: "doc", value: "10 исследований" },
      { icon: "time", value: "1,5 часа" },
    ],
  },
  {
    id: "fitness-control",
    title: "Фитнес-контроль",
    description:
      "Комплексная оценка состояния сердца, сосудов, суставов и определение уровня ключевых витаминов и микроэлементов для поддержания физической формы",
    iconPath: <MuscleIcon size={190} />,
    stats: [
      { icon: "doc", value: "8 исследований" },
      { icon: "time", value: "1,5 часа" },
    ],
  },
  {
    id: "diabetes",
    title: "Сахарный диабет",
    description:
      "Комплексное обследование для раннего выявления, контроля и профилактики сахарного диабета",
    iconPath: <ConnectionsIcon size={190} />,
    stats: [
      { icon: "doc", value: "6 исследований" },
      { icon: "time", value: "1 час" },
    ],
  },
];

export const checkupDetailTranslations = {
  ru: {
    title: "Чек-ап: Плановая операция",
    description:
      "Комплексное обследование перед операцией помогает оценить общее состояние здоровья, выявить возможные риски и подготовить организм к хирургическому вмешательству. Включает ключевые анализы и диагностические исследования, необходимые для безопасного проведения операции и быстрого восстановления.",
    duration: "1,5 часа",
    price: "1 605 000 сум",
    instrumentalExams: "инструментальных обследований",
    labTests: "лабораторных исследований",
    doctorConsultation: "консультация врача",
    bookButton: "Записаться на чек-ап",
    programTitle: "Программа диагностики",
    programDescription:
      "Программа диагностики перед операцией включает 11 ключевых исследований, которые помогают получить полную картину состояния организма. Обследование занимает около 1,5 часов, после чего врач сможет оценить результаты и, при необходимости, назначить дополнительные обследования в зависимости от профиля предстоящего хирургического вмешательства.",
    faqItems: [
      {
        title: "Общий анализ крови",
        content:
          "Базовое исследование, которое оценивает количество красных и белых кровяных клеток, гемоглобин, тромбоциты и другие показатели",
      },
      {
        title: "Общий анализ мочи",
        content:
          "Позволяет оценить функцию почек и выявить возможные воспалительные процессы в мочевыводящих путях",
      },
      {
        title: "Коагулограмма",
        content:
          "Коагулограмма — комплексный анализ свертываемости крови. Включает показатели МНО, АЧТВ, фибриногена и протромбинового времени, позволяя оценить риски тромбозов и кровотечений",
      },
      {
        title: "Рентген легких",
        content:
          "Исследование, которое позволяет оценить состояние легочной ткани и выявить патологические изменения",
      },
      {
        title: "ЭКГ",
        content:
          "Электрокардиография — метод исследования электрической активности сердца для выявления нарушений ритма и других патологий",
      },
      {
        title: "Скрининг на гепатиты, ВИЧ и сифилис",
        content:
          "Обязательное исследование перед любым хирургическим вмешательством для оценки инфекционного статуса",
      },
      {
        title: "Группа крови и резус фактор",
        content:
          "Необходимо для подготовки совместимой крови на случай необходимости переливания",
      },
      {
        title: "Биохимический анализ крови",
        content: "Комплексная оценка функций печени, почек и других органов",
      },
      {
        title: "УЗДГ вен нижних конечностей",
        content:
          "Ультразвуковое доплерографическое исследование вен для оценки риска тромбоэмболических осложнений",
      },
      {
        title: "Осмотр терапевта",
        content:
          "Консультация специалиста для общей оценки состояния здоровья и возможных рисков",
      },
      {
        title: "Дополнительные обследования по профилю специалиста",
        content:
          "Зависят от характера предстоящей операции и могут включать дополнительные диагностические процедуры",
      },
    ],
    ourPartnersTitle: "Наши партнеры",
  },
  uz: {
    title: "Chek-ap: Rejali operatsiya",
    description:
      "Operatsiyadan oldin kompleks tekshiruv umumiy sog'liq holatini baholashga, mumkin bo'lgan xavflarni aniqlashga va organizmni jarrohlik aralashuviga tayyorlashga yordam beradi. O'z ichiga xavfsiz operatsiya o'tkazish va tez tiklanish uchun zarur bo'lgan asosiy tahlillar va diagnostik tekshiruvlarni oladi.",
    duration: "1,5 soat",
    price: "1 605 000 so'm",
    instrumentalExams: "instrumental tekshiruvlar",
    labTests: "laboratoriya tadqiqotlari",
    doctorConsultation: "shifokor maslahati",
    bookButton: "Chek-apga yozilish",
    programTitle: "Diagnostika dasturi",
    programDescription:
      "Operatsiyadan oldingi diagnostika dasturi organizmning to'liq holatini baholashga yordam beradigan 11 ta asosiy tekshiruvni o'z ichiga oladi. Tekshiruv taxminan 1,5 soat davom etadi, shundan so'ng shifokor natijalarni baholay oladi va zarur bo'lsa, rejalashtirilgan jarrohlik aralashuvining profiliga qarab qo'shimcha tekshiruvlarni tayinlashi mumkin.",
    faqItems: [
      {
        title: "Umumiy qon tahlili",
        content:
          "Qizil va oq qon hujayralarining sonini, gemoglobin, trombotsitlar va boshqa ko'rsatkichlarni baholaydigan asosiy tadqiqot",
      },
      {
        title: "Umumiy siydik tahlili",
        content:
          "Buyraklar funktsiyasini baholash va siydik yo'llarida potentsial yallig'lanish jarayonlarini aniqlash imkonini beradi",
      },
      {
        title: "Koagulogramma",
        content:
          "Koagulogramma — qonning ivish qobiliyatining kompleks tahlili. INR, APTT, fibrinogen va protrombin vaqtining ko'rsatkichlarini o'z ichiga oladi, bu esa trombozlar va qon ketishlar xavflarini baholash imkonini beradi",
      },
      {
        title: "O'pka rentgeni",
        content:
          "O'pka to'qimasining holatini baholash va patologik o'zgarishlarni aniqlash imkonini beradigan tadqiqot",
      },
      {
        title: "EKG",
        content:
          "Elektrokardiografiya — yurak ritmining buzilishini va boshqa patologiyalarni aniqlash uchun yurak elektrik faoliyatini o'rganish usuli",
      },
      {
        title: "Gepatitlar, OIV va zaxm uchun skrining",
        content:
          "Infektsion holatni baholash uchun har qanday jarrohlik aralashuvidan oldin majburiy tadqiqot",
      },
      {
        title: "Qon guruhi va rezus omili",
        content:
          "Qon quyish zarurati bo'lgan taqdirda mos keluvchi qonni tayyorlash uchun zarur",
      },
      {
        title: "Biokimyoviy qon tahlili",
        content:
          "Jigar, buyraklar va boshqa organlar funktsiyalarining kompleks baholanishi",
      },
      {
        title: "Pastki oyoq venalarining UZDG",
        content:
          "Tromboembolik asoratlar xavfini baholash uchun venalarning ultratovush doplerografik tekshiruvi",
      },
      {
        title: "Terapevt ko'rigi",
        content:
          "Umumiy sog'liq holatini va potentsial xavflarni baholash uchun mutaxassis konsultatsiyasi",
      },
      {
        title: "Mutaxassis profili bo'yicha qo'shimcha tekshiruvlar",
        content:
          "Kelgusi operatsiyaning xarakteriga bog'liq va qo'shimcha diagnostik protseduralarni o'z ichiga olishi mumkin",
      },
    ],
    ourPartnersTitle: "Bizning hamkorlarimiz",
  },
};
