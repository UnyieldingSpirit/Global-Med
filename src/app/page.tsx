"use client";

import { HeroBanner } from "../shared/components/HeroBanner/HeroBanner";
import { SymptomSelector } from "../shared/components/SymptomSelector/SymptomSelector";
import { MedicalServices } from "../shared/components/MedicalServices/MedicalServices";
import { CheckupSlider } from "../shared/components/CheckupSlider";
import { AnalysisGrid } from "../shared/components/AnalysisGrid";
import { SurgerySlider } from "../shared/components/SurgerySlider";
import { AppointmentSection } from "../shared/components/AppointmentSection";
import { VideoBanner } from "../shared/components/VideoBanner";
import { BenefitsGrid } from "../shared/components/BenefitsGrid";
import { MedicalGallery } from "../shared/components/MedicalGallery";
import { DoctorsSlider } from "../shared/components/DoctorsSlider";
import { ReviewsSlider } from "../shared/components/Review/ReviewsSlider";
import CareerForm from "../shared/components/CareerForm";
import { ContactInfo } from "../shared/components/ContactInfo";
import OurPartners from "../shared/components/OurPartners/OurPartners";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      {/*<SymptomSelector />*/}
      <MedicalServices />
      <CheckupSlider />
      <AnalysisGrid />
      <SurgerySlider />
      <AppointmentSection />
      <VideoBanner />
      <BenefitsGrid />
      <MedicalGallery />
      <DoctorsSlider />
      <CareerForm />
      <ReviewsSlider />
      <OurPartners />
      <ContactInfo />
    </main>
  );
}
