"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getMotivationalMessage, getPartnerComparisonMessage } from "@/lib/motivational-messages";
import { createClient } from "@/lib/supabase/client";
import { Droplets, LogOut, Settings, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MotivationBanner } from "./motivation-banner";
import { RoomManager } from "./room-manager";
import { UserWaterCard } from "./user-water-card";

const DAILY_GOAL = 10;

interface WaterLog {
  id: string;
  user_id: string;
  glasses: number;
  date: string;
  profiles: {
    display_name: string;
  } | null;
}

interface UserProfile {
  id: string;
  display_name: string;
  room_code: string | null;
}

export function WaterTracker() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [showRoomSetup, setShowRoomSetup] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const today = new Date().toISOString().split("T")[0];

  const fetchData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Get user profile with room_code
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name, room_code")
        .eq("id", user.id)
        .single();

      if (profile) {
        setCurrentUser(profile);
      }

      // Only fetch logs if user is in a room
      if (profile?.room_code) {
        // Get today's water logs for users in the same room
        const { data: logs } = await supabase
          .from("water_logs")
          .select(`
            id,
            user_id,
            glasses,
            date,
            profiles!inner (
              display_name,
              room_code
            )
          `)
          .eq("date", today)
          .eq("profiles.room_code", profile.room_code);

        if (logs) {
          setWaterLogs(logs as WaterLog[]);
        }
      } else {
        setWaterLogs([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, router, today]);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("water_logs_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "water_logs",
          filter: `date=eq.${today}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchData, today]);

  // Update motivational message
  useEffect(() => {
    if (!currentUser) return;

    const myLog = waterLogs.find((log) => log.user_id === currentUser.id);
    const myGlasses = myLog?.glasses ?? 0;
    const partnerLog = waterLogs.find((log) => log.user_id !== currentUser.id);
    const partnerGlasses = partnerLog?.glasses ?? 0;

    const baseMessage = getMotivationalMessage(myGlasses, DAILY_GOAL);
    const comparisonMessage = partnerLog 
      ? getPartnerComparisonMessage(myGlasses, partnerGlasses) 
      : "";

    setMessage(comparisonMessage || baseMessage);
  }, [waterLogs, currentUser]);

  const updateGlasses = async (delta: number) => {
    if (!currentUser || isUpdating) return;

    setIsUpdating(true);
    try {
      const myLog = waterLogs.find((log) => log.user_id === currentUser.id);
      const currentGlasses = myLog?.glasses ?? 0;
      const newGlasses = Math.max(0, Math.min(DAILY_GOAL, currentGlasses + delta));

      if (myLog) {
        await supabase
          .from("water_logs")
          .update({ glasses: newGlasses })
          .eq("id", myLog.id);
      } else {
        await supabase.from("water_logs").insert({
          user_id: currentUser.id,
          glasses: newGlasses,
          date: today,
        });
      }

      // Optimistic update
      setWaterLogs((prev) => {
        const existing = prev.find((log) => log.user_id === currentUser.id);
        if (existing) {
          return prev.map((log) =>
            log.user_id === currentUser.id ? { ...log, glasses: newGlasses } : log
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            user_id: currentUser.id,
            glasses: newGlasses,
            date: today,
            profiles: { display_name: currentUser.display_name },
          },
        ];
      });
    } catch (error) {
      console.error("Error updating glasses:", error);
      fetchData();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Droplets className="w-16 h-16 text-primary animate-bounce" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  const myLog = waterLogs.find((log) => log.user_id === currentUser?.id);
  const myGlasses = myLog?.glasses ?? 0;
  const partnerLogs = waterLogs.filter((log) => log.user_id !== currentUser?.id);

  const messageVariant = myGlasses >= DAILY_GOAL 
    ? "success" 
    : myGlasses < 3 
      ? "encourage" 
      : "default";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">HydroSync</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowRoomSetup(!showRoomSetup)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Sala
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Room Setup Section */}
        {showRoomSetup && currentUser && (
          <RoomManager
            currentRoomCode={currentUser.room_code}
            userId={currentUser.id}
            onRoomUpdated={() => {
              fetchData();
              setShowRoomSetup(false);
            }}
          />
        )}

        {/* No Room Alert */}
        {!currentUser?.room_code && !showRoomSetup && (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              No estás en ninguna sala.{" "}
              <button
                onClick={() => setShowRoomSetup(true)}
                className="font-medium underline underline-offset-4"
              >
                Configura una sala
              </button>
              {" "}para sincronizar con tu pareja.
            </AlertDescription>
          </Alert>
        )}

        {/* Date and Goal */}
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-muted-foreground">
            Meta diaria: <span className="font-semibold text-foreground">{DAILY_GOAL} vasos</span>
          </p>
        </div>

        {/* Motivation Banner */}
        <MotivationBanner message={message} variant={messageVariant} />

        {/* Current User Card */}
        {currentUser && (
          <UserWaterCard
            name={currentUser.display_name}
            glasses={myGlasses}
            goal={DAILY_GOAL}
            isCurrentUser={true}
            onAddGlass={() => updateGlasses(1)}
            onRemoveGlass={() => updateGlasses(-1)}
            isLoading={isUpdating}
          />
        )}

        {/* Partner Cards */}
        {partnerLogs.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Tu pareja</span>
            </div>
            {partnerLogs.map((log) => (
              <UserWaterCard
                key={log.id}
                name={log.profiles?.display_name ?? "Pareja"}
                glasses={log.glasses}
                goal={DAILY_GOAL}
                isCurrentUser={false}
              />
            ))}
          </div>
        )}

        {partnerLogs.length === 0 && (
          <div className="text-center py-8 px-4 rounded-2xl bg-card border border-border">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              Tu pareja aun no ha registrado su consumo de agua hoy.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Cuando lo haga, podras ver su progreso aqui en tiempo real.
            </p>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-card border border-border rounded-2xl p-4 mt-8">
          <h3 className="font-semibold text-foreground mb-2">Tips para hidratarte</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Comienza el dia con un vaso de agua</li>
            <li>Lleva siempre una botella contigo</li>
            <li>Bebe antes de cada comida</li>
            <li>Configura recordatorios cada hora</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
