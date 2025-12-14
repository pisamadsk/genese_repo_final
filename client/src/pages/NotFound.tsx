import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>

        <h2 className="text-xl font-semibold text-muted-foreground mb-4">
          Page non trouvée
        </h2>

        <p className="text-muted-foreground mb-8">
          Désolé, la page que vous recherchez n'existe pas.
        </p>

        <Button
          onClick={() => setLocation("/")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Retour à l'accueil
        </Button>
      </Card>
    </div>
  );
}
