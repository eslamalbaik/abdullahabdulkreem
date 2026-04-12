import React from "react";
import { SARCurrencyLogo } from "./SARCurrencyLogo";
import { cn } from "@/lib/utils";

interface CurrencyProps {
  amount: number | string;
  className?: string;
  logoClassName?: string;
  size?: "sm" | "md" | "lg";
}

export const Currency: React.FC<CurrencyProps> = ({ 
  amount, 
  className, 
  logoClassName,
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl font-bold",
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5", sizeClasses[size], className)}>
      <span className="font-sans antialiased">{amount}</span>
      <SARCurrencyLogo className={logoClassName} />
    </span>
  );
};
