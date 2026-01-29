"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Droplets, Zap, Heart } from "lucide-react";

interface MotivationBannerProps {
  message: string;
  variant?: "default" | "success" | "encourage";
}

export function MotivationBanner({ message, variant = "default" }: MotivationBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [message]);

  const Icon = variant === "success" ? Heart : variant === "encourage" ? Zap : Droplets;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 transition-all duration-500",
        "bg-card border border-border shadow-sm",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          variant === "success" 
            ? "bg-accent text-accent-foreground" 
            : "bg-primary/10 text-primary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <p className={cn(
          "text-sm sm:text-base font-medium text-foreground text-balance",
        )}>
          {message}
        </p>
      </div>
      
      {/* Decorative water drops */}
      <div className="absolute -top-1 -right-1 opacity-10">
        <Droplets className="w-16 h-16 text-primary" />
      </div>
    </div>
  );
}
