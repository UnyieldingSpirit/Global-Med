import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDoctorsStore } from "@/src/store/doctors";

export const DoctorsPageCleanup = () => {
  const { resetStore } = useDoctorsStore();
  const pathname = usePathname();

  useEffect(() => {
    // Reset store when component unmounts (leaving the page)
    return () => {
      if (pathname.includes("/clinic/doctors")) {
        resetStore();
      }
    };
  }, [pathname]);

  return null; // This component doesn't render anything
};
