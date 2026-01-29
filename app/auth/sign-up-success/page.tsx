import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignUpSuccessPage() {
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
            <div className="mx-auto w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <CardTitle className="text-xl">Revisa tu email</CardTitle>
            <CardDescription>
              Te enviamos un enlace de confirmacion a tu correo electronico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground space-y-2">
              <p>1. Abre tu bandeja de entrada</p>
              <p>2. Busca el email de HydroSync</p>
              <p>3. Haz clic en el enlace de confirmacion</p>
              <p>4. Regresa aqui e inicia sesion</p>
            </div>
            
            <Link 
              href="/auth/login" 
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Ir a iniciar sesion
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <p className="text-xs text-center text-muted-foreground">
              No recibiste el email? Revisa tu carpeta de spam
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
