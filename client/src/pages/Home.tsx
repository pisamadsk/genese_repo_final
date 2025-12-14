import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import ConnectionStatus from "@/components/ConnectionStatus";
import { requestNotificationPermission } from "@/lib/notifications";
import { HeartIcon, BrainIcon, HandIcon, ActivityIcon, TrophyIcon, SettingsIcon, LogoutIcon, HomeIcon, ChartIcon, BackIcon, SessionsIcon, DaysIcon, ProgressIcon } from "@/components/Icons";

/**
 * Design: Dark Mode with Orange Accent
 * Main dashboard showing user progress and navigation
 */

export default function Home() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("home");

  const [metScore, setMetScore] = useState<number>(0);
  const [profileLevel, setProfileLevel] = useState<string>("Non disponible");
  const [profileColor, setProfileColor] = useState<string>("text-gray-500");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    
    if (!userData) {
      setLocation("/login");
      return;
    }

    const user = JSON.parse(userData);
    const onboardingKey = `onboardingCompleted_${user.email}`;
    const onboardingCompleted = localStorage.getItem(onboardingKey);
    const profileKey = `userProfile_${user.email}`;
    const userProfile = localStorage.getItem(profileKey);
    const metScoreKey = "metScore";
    const metScoreValue = localStorage.getItem(metScoreKey);

    if (!onboardingCompleted) {
      setLocation("/onboarding");
    } else {
      setUser(user);
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        // Récupérer le score MET
        if (metScoreValue) {
          const met = parseInt(metScoreValue);
          setMetScore(met);
        }
        // Récupérer le niveau IPAQ
        setProfileLevel(profile.level);
        // Définir la couleur selon le niveau
        let color = "text-gray-500";
        if (profile.level.includes("Faible")) color = "text-red-500";
        else if (profile.level.includes("Modéré")) color = "text-yellow-500";
        else if (profile.level.includes("Élevé")) color = "text-green-500";
        setProfileColor(color);
      }
      // Demander la permission pour les notifications
      requestNotificationPermission();
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-24 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b border-border animate-slide-in-down">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Aji Tssourte" className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-bold text-foreground">GENÈSE</h1>
              <p className="text-xs text-muted-foreground">
                Bienvenue, {user.name || "Utilisateur"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground font-semibold"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 animate-slide-in-up">
        {/* Hero Image */}
        <div className="relative h-48 rounded-lg overflow-hidden mb-4">
          <img
            src="/hero-boy.png"
            alt="Mobilité et conscience corporelle"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold text-center">Bienvenue à GENÈSE</h2>
          </div>
        </div>

        {/* Score Circle Card - Motricité Moyenne */}
        <Card className="p-6 text-center transition-smooth hover-lift">
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="#2a2a2a"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="55"
                  fill="none"
                  stroke="#ff9500"
                  strokeWidth="8"
                  strokeDasharray={`${(metScore / 3500) * 345.6} 345.6`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className={`text-2xl font-bold ${profileColor}`}>{metScore}</div>
                  <div className="text-xs text-muted-foreground">MET-min/sem</div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Motricité Moyenne
          </h2>
          <p className={`text-sm font-semibold ${profileColor} mb-1`}>
            {profileLevel}
          </p>
          <p className="text-xs text-muted-foreground">
            Continuez vos efforts pour améliorer votre niveau d'activité !
          </p>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2"><SessionsIcon /></div>
            <div className="text-lg font-bold text-foreground">3</div>
            <div className="text-xs text-muted-foreground">Séances</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2"><DaysIcon /></div>
            <div className="text-lg font-bold text-foreground">5</div>
            <div className="text-xs text-muted-foreground">Jours</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="flex justify-center mb-2"><ProgressIcon /></div>
            <div className="text-lg font-bold text-foreground">+15%</div>
            <div className="text-xs text-muted-foreground">Progrès</div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => setLocation("/bilan")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Démarrer le Bilan Moteur
          </Button>
          <Button
            onClick={() => setLocation("/program")}
            className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            Mon Programme
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">
            Activité Récente
          </h3>
          <div className="space-y-3">
            {[
              { date: "Aujourd'hui", activity: "Bilan moteur complété" },
              { date: "Hier", activity: "Séance mobilité réalisée" },
              { date: "Il y a 2 jours", activity: "Respiration consciente" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">{item.activity}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <span className="text-muted-foreground">→</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Coach Message */}
        <Card className="p-4 bg-orange-500/10 border-orange-500/20">
          <p className="text-sm text-foreground">
            <span className="font-semibold text-orange-500">Coach :</span> "Vous
            faites du bon travail ! Continuez à pratiquer régulièrement pour
            voir des résultats durables."
          </p>
        </Card>
      </div>

      {/* Connection Status */}
      <ConnectionStatus />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border animate-slide-in-up">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-around">
          {[
            { id: "home", label: "Accueil", path: "/home" },
            { id: "bilan", label: "Bilan", path: "/bilan" },
            { id: "program", label: "Programme", path: "/program" },
            { id: "settings", label: "Paramètres", path: "/settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setLocation(tab.path);
              }}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors hover-scale font-semibold ${
                activeTab === tab.id
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.id === "home" && <HomeIcon />}
              {tab.id === "bilan" && <ChartIcon />}
              {tab.id === "program" && <ActivityIcon />}
              {tab.id === "settings" && <SettingsIcon />}
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
