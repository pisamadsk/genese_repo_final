import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";

/**
 * Design: Dark Mode with Orange Accent
 * - Background: #0f0f0f (very dark)
 * - Card: #1a1a1a (dark gray)
 * - Primary: #ff9500 (orange)
 * - Text: #e8e8e8 (light gray)
 */

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    age: "",
    // activityLevel supprimé de l'inscription
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (!formData.email.includes("@")) {
      alert("Email invalide");
      return;
    }
    
    if (formData.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    if (!isLogin) {
      // LOGIQUE D'INSCRIPTION
      if (!formData.name || !formData.age) {
        alert("Veuillez remplir tous les champs d'inscription");
        return;
      }
      
      const age = parseInt(formData.age);
      if (age < 20 || age > 30) {
        alert("L'âge doit être entre 20 et 30 ans");
        return;
      }

      // Sauvegarder les données d'inscription (simulation backend)
      localStorage.setItem("registeredUser", JSON.stringify(formData));
      alert("Inscription réussie ! Veuillez maintenant vous connecter.");
      setIsLogin(true); // Basculer vers l'écran de connexion
      return;
    }

    // LOGIQUE DE CONNEXION
    const registeredUser = localStorage.getItem("registeredUser");
    if (registeredUser) {
      const user = JSON.parse(registeredUser);
      if (user.email !== formData.email || user.password !== formData.password) {
        alert("Email ou mot de passe incorrect");
        return;
      }
      // Connexion réussie
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      // Fallback pour le prototype si pas d'inscription préalable (mode démo)
      localStorage.setItem("user", JSON.stringify(formData));
    }
    
    // Vérifier si l'onboarding a déjà été fait pour CET utilisateur
    const userEmail = formData.email;
    const onboardingKey = `onboardingCompleted_${userEmail}`;
    const onboardingCompleted = localStorage.getItem(onboardingKey);
    
    if (onboardingCompleted) {
      setLocation("/");
    } else {
      setLocation("/onboarding");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10">
        <div className="p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <img src="/logo.png" alt="Aji Tssourte" className="w-24 h-24 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">GENÈSE</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Reprendre le contrôle de votre corps
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Toggle between login and signup */}
            <div className="flex gap-2 mb-6 bg-secondary rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  isLogin
                    ? "bg-orange-500 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isLogin
                    ? "bg-orange-500 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Name (signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nom complet
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}

            {/* Age (signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Âge
                </label>
                <Input
                  type="number"
                  name="age"
                  placeholder="20-30"
                  value={formData.age}
                  onChange={handleChange}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}



            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {isLogin ? "Se connecter" : "S'inscrire"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <p>
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-orange-500 hover:text-orange-400 font-medium"
                >
                  S'inscrire
                </button>
              </p>
            ) : (
              <p>
                Déjà inscrit ?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-orange-500 hover:text-orange-400 font-medium"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
