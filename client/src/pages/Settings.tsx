import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { BackIcon, LogoutIcon, NotificationIcon, LanguageIcon, MoonIcon, SunIcon, LogoutIconSmall } from "@/components/Icons";

/**
 * Design: Dark Mode with Orange Accent
 * Settings page for user preferences
 */

export default function Settings() {
  const [, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("fr");
  const [bmi, setBmi] = useState<{ value: string; label: string; color: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Calcul de l'IMC si poids et taille disponibles
      if (parsedUser.weight && parsedUser.height) {
        const heightInMeters = parseFloat(parsedUser.height) / 100;
        const weightInKg = parseFloat(parsedUser.weight);
        const bmiValue = weightInKg / (heightInMeters * heightInMeters);
        
        let label = "";
        let color = "";
        
        if (bmiValue < 18.5) {
          label = "Insuffisance pondérale";
          color = "text-blue-500";
        } else if (bmiValue < 25) {
          label = "Corpulence normale";
          color = "text-green-500";
        } else if (bmiValue < 30) {
          label = "Surpoids";
          color = "text-yellow-500";
        } else {
          label = "Obésité";
          color = "text-red-500";
        }

        setBmi({
          value: bmiValue.toFixed(1),
          label,
          color
        });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("bilanScores");
    setLocation("/login");
  };

  const generatePDF = () => {
    if (!user) return;

    const profile = JSON.parse(localStorage.getItem("userProfile") || '{}');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Logo Integration
    const logoImg = new Image();
    logoImg.src = "/logo-aji.png";
    
    logoImg.onload = () => {
      // Add logo (centered, 70x30mm)
      doc.addImage(logoImg, "PNG", (pageWidth / 2) - 35, yPos, 70, 30);
      yPos += 40;
      
      // User Info Section
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 15;

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Informations Personnelles", margin, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Nom: ${user.name || "Non renseigné"}`, margin, yPos);
      yPos += 7;
      doc.text(`Email: ${user.email || "Non renseigné"}`, margin, yPos);
      yPos += 7;
      doc.text(`Date du bilan: ${new Date().toLocaleDateString('fr-FR')}`, margin, yPos);
      
      yPos += 15;

      // Biometrics Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Données Biométriques", margin, yPos);
      yPos += 10;

      const heightInMeters = user.height ? parseFloat(user.height) / 100 : 0;
      const bmiValue = user.weight && user.height ? parseFloat(user.weight) / (heightInMeters * heightInMeters) : 0;
      let bmiCategory = "Non calculé";
      let bmiColor = "#808080";
      
      if (bmiValue > 0) {
        if (bmiValue < 18.5) { bmiCategory = "Insuffisance pondérale"; bmiColor = "#3b82f6"; }
        else if (bmiValue < 25) { bmiCategory = "Poids normal"; bmiColor = "#22c55e"; }
        else if (bmiValue < 30) { bmiCategory = "Surpoids"; bmiColor = "#eab308"; }
        else { bmiCategory = "Obésité"; bmiColor = "#ef4444"; }
      }

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text(`Poids: ${user.weight || "?"} kg`, margin, yPos);
      doc.text(`Taille: ${user.height || "?"} cm`, pageWidth / 2, yPos);
      yPos += 7;
      
      doc.text(`IMC: ${bmiValue.toFixed(1)}`, margin, yPos);
      doc.setTextColor(bmiColor);
      doc.text(`(${bmiCategory})`, margin + 25, yPos);
      doc.setTextColor(60, 60, 60);

      yPos += 15;

      // Activity Profile Section
      if (profile.level) {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Profil d'Activité (IPAQ)", margin, yPos);
        yPos += 10;

        doc.setFontSize(14);
        let profileColor = "#000000";
        if (profile.color.includes("red")) profileColor = "#ef4444";
        else if (profile.color.includes("yellow")) profileColor = "#eab308";
        else if (profile.color.includes("green")) profileColor = "#22c55e";
        else if (profile.color.includes("blue")) profileColor = "#3b82f6";

        doc.setTextColor(profileColor);
        doc.text(`Niveau: ${profile.level}`, margin, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.text("Basé sur vos réponses au questionnaire international IPAQ,", margin, yPos);
        yPos += 5;
        doc.text("ce niveau détermine l'intensité de votre programme initial.", margin, yPos);
        
        yPos += 10;
        const metScore = parseInt(localStorage.getItem("metScore") || "0");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Score IPAQ: ${metScore} MET-min/semaine`, margin, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Seuils IPAQ:", margin, yPos);
        yPos += 5;
        doc.text("- Faible: < 600 MET-min/semaine", margin + 5, yPos);
        yPos += 5;
        doc.text("- Modere: 600 - 2999 MET-min/semaine", margin + 5, yPos);
        yPos += 5;
        doc.text("- Eleve: >= 3000 MET-min/semaine", margin + 5, yPos);

        yPos += 15;
      }

      // Medical/Injuries Section
      if (user.injuries || user.medicalConditions) {
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Santé & Blessures", margin, yPos);
        yPos += 10;

        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        if (user.injuries) {
          doc.text("Blessures signalées:", margin, yPos);
          yPos += 5;
          const splitInjuries = doc.splitTextToSize(user.injuries, pageWidth - (margin * 2));
          doc.text(splitInjuries, margin, yPos);
          yPos += (splitInjuries.length * 5) + 5;
        }

        if (user.medicalConditions) {
          doc.text("Conditions médicales:", margin, yPos);
          yPos += 5;
          const splitConditions = doc.splitTextToSize(user.medicalConditions, pageWidth - (margin * 2));
          doc.text(splitConditions, margin, yPos);
          yPos += (splitConditions.length * 5) + 5;
        }
      }

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Généré par l'application AJITSSOURAT", pageWidth / 2, footerY, { align: "center" });

      doc.save("bilan-genese.pdf");
    };

    logoImg.onerror = () => {
      doc.save("bilan-genese.pdf");
    };
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation("/home")}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground font-semibold"
          >
<BackIcon /> Retour
          </button>
          <h1 className="text-lg font-bold text-foreground">Paramètres</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 px-1">Profil</h3>
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-500">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  {user?.name || "Utilisateur"}
                </h4>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground">
              Modifier le Profil
            </Button>
          </Card>
        </div>

        {/* Personal Info */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 px-1">
            Informations Personnelles
          </h3>
          <Card className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Âge</label>
                <p className="font-semibold text-foreground">{user?.age} ans</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Niveau</label>
                <p className="font-semibold text-foreground capitalize">
                  {user?.activityLevel || "Non défini"}
                </p>
              </div>
            </div>
            
            {(user?.weight || user?.height) && (
              <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
                {user?.weight && (
                  <div>
                    <label className="text-sm text-muted-foreground">Poids</label>
                    <p className="font-semibold text-foreground">{user.weight} kg</p>
                  </div>
                )}
                {user?.height && (
                  <div>
                    <label className="text-sm text-muted-foreground">Taille</label>
                    <p className="font-semibold text-foreground">{user.height} cm</p>
                  </div>
                )}
              </div>
            )}

            {bmi && (
              <div className="border-t border-border pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm text-muted-foreground">IMC (Indice de Masse Corporelle)</label>
                    <p className={`font-bold text-lg ${bmi.color}`}>{bmi.value}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium bg-secondary ${bmi.color}`}>
                    {bmi.label}
                  </div>
                </div>
              </div>
            )}

            {user?.injuries && (
              <div className="border-t border-border pt-3">
                <label className="text-sm text-muted-foreground">Blessures</label>
                <p className="text-sm text-foreground mt-1">{user.injuries}</p>
              </div>
            )}

            {user?.medicalConditions && (
              <div className="border-t border-border pt-3">
                <label className="text-sm text-muted-foreground">Conditions médicales</label>
                <p className="text-sm text-foreground mt-1">{user.medicalConditions}</p>
              </div>
            )}

            <Button
              onClick={generatePDF}
              className="w-full mt-4 border-primary/20 hover:bg-primary/5 text-primary bg-transparent border"
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger mon bilan PDF
            </Button>
          </Card>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 px-1">Préférences</h3>
          <Card className="p-4 space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <MoonIcon />
                ) : (
                  <SunIcon />
                )}
                <div>
                  <p className="font-semibold text-foreground">Thème</p>
                  <p className="text-xs text-muted-foreground">
                    {theme === "dark" ? "Mode sombre" : "Mode normal"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors ${
                  theme === "dark" ? "bg-primary" : "bg-primary"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                  }`}
                ></div>
              </button>
            </div>

            {/* Notifications */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <NotificationIcon />
                  <div>
                    <p className="font-semibold text-foreground">Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Rappels de séances
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications ? "bg-primary" : "bg-secondary"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  ></div>
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center gap-3 mb-3">
                <LanguageIcon />
                <p className="font-semibold text-foreground">Langue</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { code: "fr", name: "Français" },
                  { code: "ar", name: "العربية" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      language === lang.code
                        ? "bg-orange-500 text-white"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 px-1">À Propos</h3>
          <Card className="p-4 space-y-3 text-sm">
            <div>
              <label className="text-muted-foreground">Version</label>
              <p className="font-semibold text-foreground">1.0.0</p>
            </div>
            <div className="border-t border-border pt-3">
              <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground text-sm">
                Conditions d'utilisation
              </Button>
            </div>
            <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground text-sm">
              Politique de confidentialité
            </Button>
          </Card>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <LogoutIconSmall />
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
