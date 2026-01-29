"use client";

import { cn } from "@/lib/utils";

interface WaterGlassProps {
  filled: boolean;
  index: number;
  onClick: () => void;
  disabled?: boolean;
}

export function WaterGlass({ filled, index, onClick, disabled }: WaterGlassProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-12 h-16 sm:w-14 sm:h-18 transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      aria-label={filled ? `Remove glass ${index + 1}` : `Add glass ${index + 1}`}
    >
      <svg
        viewBox="0 0 40 56"
        fill="none"
        className="w-full h-full drop-shadow-md"
      >
        {/* Glass outline */}
        <path
          d="M4 8L8 48C8.5 52 12 54 20 54C28 54 31.5 52 32 48L36 8H4Z"
          className={cn(
            "transition-all duration-300",
            filled ? "stroke-primary" : "stroke-muted-foreground/40"
          )}
          strokeWidth="2.5"
          fill="none"
        />
        
        {/* Water fill with animation */}
        <path
          d="M6 12L9 46C9.3 49 12.5 51 20 51C27.5 51 30.7 49 31 46L34 12H6Z"
          className={cn(
            "transition-all duration-500 ease-out",
            filled 
              ? "fill-primary/80" 
              : "fill-muted/30"
          )}
          style={{
            clipPath: filled 
              ? "inset(0% 0% 0% 0%)" 
              : "inset(100% 0% 0% 0%)",
            transition: "clip-path 0.5s ease-out, fill 0.3s ease-out"
          }}
        />
        
        {/* Water surface wave effect when filled */}
        {filled && (
          <ellipse
            cx="20"
            cy="14"
            rx="13"
            ry="2"
            className="fill-primary/60 animate-pulse"
          />
        )}
        
        {/* Glass rim */}
        <ellipse
          cx="20"
          cy="8"
          rx="16"
          ry="3"
          className={cn(
            "transition-colors duration-300",
            filled ? "stroke-primary fill-primary/10" : "stroke-muted-foreground/40 fill-muted/10"
          )}
          strokeWidth="2"
        />
      </svg>
      
      {/* Sparkle effect when filled */}
      {filled && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-primary-foreground rounded-full opacity-80 animate-ping" />
      )}
    </button>
  );
}
