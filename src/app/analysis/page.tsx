"use client";

import React from "react";
import { AnalysisHeroSection } from "@/src/shared/components/AnalysisHeroSection";
import AnalysisGridTho from "@/src/shared/components/AnalysisGridTho";
import { AppointmentSection } from "@/src/shared/components/AppointmentSection";
import { ContactInfo } from "@/src/shared/components/ContactInfo";

export default function AnalysisPage() {
  return (
    <main>
      <AnalysisHeroSection />
      <AnalysisGridTho />
      <AppointmentSection />
      <ContactInfo />
    </main>
  );
}
