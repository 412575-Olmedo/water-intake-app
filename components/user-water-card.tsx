"use client";

import { WaterGlass } from "./water-glass";
import { ProgressRing } from "./progress-ring";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Droplets, Trophy, Sparkles } from "lucide-react";

interface UserWaterCardProps {
  name: string;
  glasses: number;
  goal: number;
  isCurrentUser: boolean;
  onAddGlass?: () => void;
  onRemoveGlass?: () => void;
  isLoading?: boolean;
}

export function UserWaterCard({
  name,
  glasses,
  goal,
  isCurrentUser,
  onAddGlass,
  onRemoveGlass,
  isLoading,
}: UserWaterCardProps) {
  const progress = Math.min((glasses / goal) * 100, 100);
  const isComplete = glasses >= goal;

  const handleGlassClick = (index: number) => {
    if (!isCurrentUser || isLoading) return;
    
    if (index < glasses) {
      onRemoveGlass?.();
    } else if (index === glasses) {
      onAddGlass?.();
    }
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        isCurrentUser 
          ? "ring-2 ring-primary shadow-lg" 
          : "opacity-90",
        isComplete && "ring-2 ring-accent"
      )}
    >
      {isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2">
            <Trophy className="w-6 h-6 text-accent animate-bounce" />
          </div>
          <Sparkles className="absolute top-4 left-4 w-4 h-4 text-accent animate-pulse" />
          <Sparkles className="absolute bottom-8 right-8 w-3 h-3 text-accent animate-pulse delay-150" />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
              isCurrentUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground"
            )}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {name}
                {isCurrentUser && (
                  <span className="ml-2 text-xs text-muted-foreground">(Tu)</span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {glasses} de {goal} vasos
              </p>
            </div>
          </div>
          
          <ProgressRing progress={progress} size={60} strokeWidth={5}>
            <span className={cn(
              "text-sm font-bold",
              isComplete ? "text-accent" : "text-primary"
            )}>
              {Math.round(progress)}%
            </span>
          </ProgressRing>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap justify-center gap-2 py-4">
          {Array.from({ length: goal }).map((_, index) => (
            <WaterGlass
              key={index}
              index={index}
              filled={index < glasses}
              onClick={() => handleGlassClick(index)}
              disabled={!isCurrentUser || isLoading || (index !== glasses && index >= glasses)}
            />
          ))}
        </div>
        
        {isCurrentUser && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              type="button"
              onClick={onRemoveGlass}
              disabled={glasses <= 0 || isLoading}
              className={cn(
                "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all",
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              )}
            >
              <Droplets className="w-4 h-4" />
              -1 vaso
            </button>
            <button
              type="button"
              onClick={onAddGlass}
              disabled={glasses >= goal || isLoading}
              className={cn(
                "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "animate-pulse hover:animate-none"
              )}
            >
              <Droplets className="w-4 h-4" />
              +1 vaso
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
