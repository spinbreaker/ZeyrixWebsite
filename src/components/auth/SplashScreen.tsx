import type { ReactNode } from "react";
import Image from "next/image";

interface SplashScreenProps {
  children?: ReactNode;
}

export default function SplashScreen({ children }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-background">
      <div className={`${!children && "animate-pulse"}`}>
        <Image src="/icons/logoFavicon.svg" alt="Logo" width={44} height={44} />
      </div>
      {children}
    </div>
  );
}
