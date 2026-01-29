"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Check, Copy, LogIn, PlusCircle, Users } from "lucide-react";
import { useState } from "react";

interface RoomManagerProps {
  currentRoomCode: string | null;
  userId: string;
  onRoomUpdated: () => void;
}

export function RoomManager({ currentRoomCode, userId, onRoomUpdated }: RoomManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createRoom = async () => {
    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      const newRoomCode = generateRoomCode();

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ room_code: newRoomCode })
        .eq("id", userId);

      if (updateError) throw updateError;

      setSuccess(`¡Sala creada! Código: ${newRoomCode}`);
      onRoomUpdated();
    } catch (err) {
      setError("Error al crear la sala. Intenta de nuevo.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async () => {
    if (!joinCode.trim()) {
      setError("Por favor ingresa un código de sala");
      return;
    }

    setIsJoining(true);
    setError("");
    setSuccess("");

    try {
      const codeToJoin = joinCode.trim().toUpperCase();

      // Verificar que la sala existe
      const { data: existingRoom, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("room_code", codeToJoin)
        .limit(1);

      if (checkError) throw checkError;

      if (!existingRoom || existingRoom.length === 0) {
        setError("Sala no encontrada. Verifica el código.");
        setIsJoining(false);
        return;
      }

      // Unirse a la sala
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ room_code: codeToJoin })
        .eq("id", userId);

      if (updateError) throw updateError;

      setSuccess(`¡Te uniste a la sala ${codeToJoin}!`);
      setJoinCode("");
      onRoomUpdated();
    } catch (err) {
      setError("Error al unirse a la sala. Intenta de nuevo.");
      console.error(err);
    } finally {
      setIsJoining(false);
    }
  };

  const leaveRoom = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ room_code: null })
        .eq("id", userId);

      if (error) throw error;

      setSuccess("Saliste de la sala");
      onRoomUpdated();
    } catch (err) {
      setError("Error al salir de la sala");
      console.error(err);
    }
  };

  const copyRoomCode = () => {
    if (currentRoomCode) {
      navigator.clipboard.writeText(currentRoomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {currentRoomCode ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Tu Sala
            </CardTitle>
            <CardDescription>
              Comparte este código con tu pareja para que puedan ver el progreso juntos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 text-center py-3 px-4 bg-primary/10 rounded-lg">
                <span className="text-2xl font-bold tracking-wider">{currentRoomCode}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyRoomCode}
                title="Copiar código"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={leaveRoom}
            >
              Salir de la sala
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Crear Nueva Sala
              </CardTitle>
              <CardDescription>
                Crea una sala nueva y comparte el código con tu pareja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={createRoom}
                disabled={isCreating}
              >
                {isCreating ? "Creando..." : "Crear Sala"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Unirse a una Sala
              </CardTitle>
              <CardDescription>
                Ingresa el código de sala que te compartió tu pareja
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-code">Código de Sala</Label>
                <Input
                  id="room-code"
                  placeholder="ABC123"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="text-center text-lg tracking-wider"
                />
              </div>
              <Button
                className="w-full"
                onClick={joinRoom}
                disabled={isJoining || !joinCode.trim()}
              >
                {isJoining ? "Uniéndose..." : "Unirse a Sala"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
