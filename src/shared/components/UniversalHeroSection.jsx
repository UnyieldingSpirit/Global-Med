import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useThemeStore } from "@/src/store/theme";
import { useInView } from "react-intersection-observer";

const AnimatedCounter = ({ end, duration = 4000, className = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const getParsedParts = () => {
    if (typeof end !== "string") return { number: null, suffix: "" };
    const numberMatch = end.match(/\d+/g);
    const suffix = end.replace(/\d+/g, "").trim();
    return {
      number: numberMatch ? parseInt(numberMatch.join(""), 10) : null,
      suffix,
    };
  };

  const { number: numericEnd, suffix } = getParsedParts();

  useEffect(() => {
    if (!inView || typeof numericEnd !== "number" || isNaN(numericEnd)) return;

    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const easeOutQuad = (t) => t * (2 - t);
      const percentage = Math.min(easeOutQuad(progress / duration), 1);
      countRef.current = Math.floor(percentage * numericEnd);
      setCount(countRef.current);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(numericEnd);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, numericEnd, duration]);

  const formatResult = () => {
    if (typeof numericEnd !== "number" || isNaN(numericEnd)) return end;
    return `${count}${suffix}`;
  };

  return (
    <span ref={ref} className={className}>
      {formatResult()}
    </span>
  );
};

const InfoCard = ({
  title,
  description,
  hasDot = false,
  isWide = false,
  isNumeric = false,
  className = "",
}) => {
  const { theme } = useThemeStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div
      className={`relative p-4 sm:p-5 md:p-6 rounded-2xl transition-colors duration-300 ${
        isHovered
          ? "bg-light-accent text-white"
          : theme === "light"
          ? "bg-white"
          : "bg-dark-block"
      } ${isWide ? "col-span-2" : "col-span-1"} h-auto ${
        isWide
          ? "min-h-[180px] sm:min-h-[200px] md:min-h-[240px]"
          : "min-h-[100px] sm:min-h-[120px] md:min-h-[180px]"
      } ${className}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => isMobile && setIsHovered(!isHovered)}
    >
      {hasDot && (
        <div
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-colors ${
            isHovered
              ? "bg-white"
              : theme === "light"
              ? "bg-[#F7F7F7]"
              : "bg-[#11363C]"
          }`}
        />
      )}

      <div className="h-full flex flex-col">
        <h3
          className={`${
            isWide
              ? "text-xl sm:text-2xl md:text-[32px] lg:text-[40px]"
              : "text-lg sm:text-xl md:text-2xl lg:text-[56px] mt-2 sm:mt-3 md:mt-10"
          } font-semibold mb-1 sm:mb-2 transition-colors leading-tight ${
            isHovered
              ? "text-white"
              : theme === "light"
              ? "text-light-text"
              : "text-dark-text"
          }`}
        >
          {isNumeric ? (
            <AnimatedCounter end={title} className="inline-block" />
          ) : (
            title
          )}
        </h3>

        <p
          className={`text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 md:mt-3 transition-colors line-clamp-3 sm:line-clamp-4 md:line-clamp-none ${
            isHovered
              ? "text-white"
              : theme === "light"
              ? "text-light-text/80"
              : "text-dark-text/80"
          }`}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

const UniversalHeroSection = ({ imageUrl, imageAlt, data, className = "" }) => {
  const items = data?.data?.content?.info?.data?.items || [];
  console.log(items);
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full h-[200px] sm:h-[200px] md:h-[300px] lg:h-[400px] xl:h-[500px] relative rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-5">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        <InfoCard
          title={items[0]?.title}
          description={items[0]?.subtitle}
          isWide={true}
          isNumeric={/^\d/.test(items[1]?.title)}
          className="md:col-span-2 mb-3 sm:mb-4 md:mb-0"
        />
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {[items[1], items[2]].map((item, index) => (
            <InfoCard
              key={index}
              title={item?.title}
              description={item?.subtitle}
              hasDot={true}
              isNumeric={/^\d/.test(item?.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversalHeroSection;
