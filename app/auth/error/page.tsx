import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Droplets className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">HydroSync</h1>
        </div>

        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Error de autenticacion</CardTitle>
            <CardDescription>
              Hubo un problema al verificar tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              El enlace puede haber expirado o ya fue utilizado. 
              Por favor intenta iniciar sesion o registrarte nuevamente.
            </p>
            
            <div className="flex flex-col gap-2">
              <Link 
                href="/auth/login" 
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Iniciar sesion
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                href="/auth/sign-up" 
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Crear cuenta nueva
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
