import Image from "next/image";
import { cn } from "@/lib/utils";
import { loginConfig } from "../config/login";

type LoginLogoProps = {
  className?: string;
  size?: number;
};

export function LoginLogo({ className, size = 56 }: LoginLogoProps) {
  // Serve 3x pixels so the logo stays sharp on retina displays
  const srcSize = Math.max(size * 3, 192);

  return (
    <Image
      src="/logo-horautil-360.png"
      alt={loginConfig.brand}
      width={srcSize}
      height={srcSize}
      quality={100}
      className={cn("shrink-0 rounded-2xl object-cover shadow-sm", className)}
      style={{ width: size, height: size }}
      priority
    />
  );
}
