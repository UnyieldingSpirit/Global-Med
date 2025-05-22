"use client";

import React from "react";
import Image from "next/image";

export const MedicalGallery = ({
  images = [
    "/images/medical-image-1.png",
    "/images/medical-image-2.png",
    "/images/medical-image-3.png",
    "/images/medical-image-4.png",
  ],
  alt = "Medical care image",
}) => {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-6 sm:mb-8 md:mb-40">
      {images.map((src, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg aspect-[4/3]"
        >
          <Image
            src={src}
            alt={`${alt} ${index + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
};
