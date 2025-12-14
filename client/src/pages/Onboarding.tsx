import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import TimePicker from "@/components/TimePicker";

// Questions complètes IPAQ (7 questions)
// Types: 'days' (0-7), 'duration' (heures/minutes)
const QUESTIONS = [
  {
    id: 1,
    type: 'days',
    question: "Au cours des 7 derniers jours, combien de jours avez-vous fait des activités physiques INTENSES (porter des charges lourdes, bêcher, VTT, football) ?",
    nextIfZero: 3, // Saut vers Q3 si 0 jours
  },
  {
    id: 2,
    type: 'duration',
    question: "Au total, combien de temps avez-vous passé à faire des activités INTENSES ces jours-là ?",
  },
  {
    id: 3,
    type: 'days',
    question: "Au cours des 7 derniers jours, combien de jours avez-vous fait des activités physiques MODÉRÉES (porter des charges légères, vélo tranquille, volley) ? Ne pas inclure la marche.",
    nextIfZero: 5, // Saut vers Q5 si 0 jours
  },
  {
    id: 4,
    type: 'duration',
    question: "Au total, combien de temps avez-vous passé à faire des activités MODÉRÉES ces jours-là ?",
  },
  {
    id: 5,
    type: 'days',
    question: "Au cours des 7 derniers jours, combien de jours avez-vous MARCHÉ au moins 10 minutes d'affilée ?",
    nextIfZero: 7, // Saut vers Q7 si 0 jours
  },
  {
    id: 6,
    type: 'duration',
    question: "Au total, combien de temps avez-vous passé à MARCHER ces jours-là ?",
  },
  {
    id: 7,
    type: 'duration',
    question: "Au cours des 7 derniers jours, combien de temps avez-vous passé ASSIS pendant un jour de semaine ?",
  },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [details, setDetails] = useState({
    weight: "",
    height: "",
    injuries: "",
    medicalConditions: "",
  });

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleDaysChange = (days: number) => {
    setAnswers((prev) => ({ ...prev, [step]: days }));
  };

  const handleDurationChange = (field: 'hours' | 'minutes', value: string) => {
    const currentAnswer = answers[step] || { hours: 0, minutes: 0 };
    const numValue = value === "" ? 0 : parseInt(value);
    
    setAnswers((prev) => ({
      ...prev,
      [step]: { ...currentAnswer, [field]: numValue }
    }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const currentQ = QUESTIONS[step];
    
    // Gestion des sauts conditionnels (ex: si 0 jours, on saute la question de durée)
    if (currentQ.type === 'days' && currentQ.nextIfZero !== undefined && answers[step] === 0) {
      // Trouver l'index de la question cible
      const nextIndex = QUESTIONS.findIndex(q => q.id === currentQ.nextIfZero);
      if (nextIndex !== -1) {
        setStep(nextIndex);
        return;
      }
    }

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const calculateProfile = () => {
    // Calcul simplifié des METs (Metabolic Equivalent of Task)
    // Formule approximative IPAQ :
    // Marche = 3.3 METs * minutes * jours
    // Modéré = 4.0 METs * minutes * jours
    // Intense = 8.0 METs * minutes * jours
    
    let metVigoureuse = 0;
    let metModeree = 0;
    let metMarche = 0;

    // Récupération des données (index basé sur l'ordre des questions)
    // Q1 (idx 0): Jours Vigoureuse, Q2 (idx 1): Durée Vigoureuse
    const joursVigoureuse = answers[0] || 0;
    const dureeVigoureuse = answers[1] ? (answers[1].hours * 60 + answers[1].minutes) : 0;
    metVigoureuse = 8.0 * dureeVigoureuse * joursVigoureuse;

    // Q3 (idx 2): Jours Modérée, Q4 (idx 3): Durée Modérée
    const joursModeree = answers[2] || 0;
    const dureeModeree = answers[3] ? (answers[3].hours * 60 + answers[3].minutes) : 0;
    metModeree = 4.0 * dureeModeree * joursModeree;

    // Q5 (idx 4): Jours Marche, Q6 (idx 5): Durée Marche
    const joursMarche = answers[4] || 0;
    const dureeMarche = answers[5] ? (answers[5].hours * 60 + answers[5].minutes) : 0;
    metMarche = 3.3 * dureeMarche * joursMarche;

    const totalMETs = metVigoureuse + metModeree + metMarche;

    // Catégorisation IPAQ
    // Bas: < 600 MET-minutes/semaine
    // Modéré: 600-3000 MET-minutes/semaine
    // Élevé: > 3000 MET-minutes/semaine
    
    // Q7 (idx 6): Temps assis par jour (en minutes)
    const tempsAssisDuree = answers[6] ? (answers[6].hours * 60 + answers[6].minutes) : 0;
    const isSedentaire = tempsAssisDuree >= 480; // >= 8 heures

    // Catégorisation IPAQ officielle
    // Faible: < 600 MET-minutes/semaine
    // Modéré: 600-2999 MET-minutes/semaine
    // Élevé: >= 3000 MET-minutes/semaine
    
    let level = "";
    let color = "";
    
    if (totalMETs < 600) {
      level = isSedentaire ? "Faible + Sédentaire" : "Faible";
      color = isSedentaire ? "text-red-600" : "text-red-500";
    } else if (totalMETs < 3000) {
      level = isSedentaire ? "Modéré + Sédentaire" : "Modéré";
      color = isSedentaire ? "text-yellow-600" : "text-yellow-500";
    } else {
      level = isSedentaire ? "Élevé + Sédentaire" : "Élevé";
      color = isSedentaire ? "text-green-600" : "text-green-500";
    }
    
    return { level, color };
  };

  const handleSummaryConfirm = () => {
    setShowSummary(false);
    setShowDetailsForm(true);
  };

  const handleEditQuestion = (questionIndex: number) => {
    setStep(questionIndex);
    setShowSummary(false);
  };

  const finishOnboarding = () => {
    setIsAnalyzing(true);
    
    // Simulation d'analyse
    setTimeout(() => {
      const profile = calculateProfile();
      
      // Calcul du score MET pour affichage
      const joursVigoureuse = answers[0] || 0;
      const dureeVigoureuse = answers[1] ? (answers[1].hours * 60 + answers[1].minutes) : 0;
      const metVigoureuse = 8.0 * dureeVigoureuse * joursVigoureuse;

      const joursModeree = answers[2] || 0;
      const dureeModeree = answers[3] ? (answers[3].hours * 60 + answers[3].minutes) : 0;
      const metModeree = 4.0 * dureeModeree * joursModeree;

      const joursMarche = answers[4] || 0;
      const dureeMarche = answers[5] ? (answers[5].hours * 60 + answers[5].minutes) : 0;
      const metMarche = 3.3 * dureeMarche * joursMarche;

      const totalMETs = metVigoureuse + metModeree + metMarche;
      
      // Récupérer l'utilisateur actuel pour la clé unique
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        
        // Mise à jour de l'utilisateur avec les nouvelles infos
        const updatedUser = {
          ...user,
          weight: details.weight,
          height: details.height,
          injuries: details.injuries,
          medicalConditions: details.medicalConditions,
          activityLevel: profile.level, // Mise à jour du niveau d'activité basé sur le test
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("metScore", totalMETs.toString());
        
        // Sauvegarder le statut d'onboarding
        const onboardingKey = `onboardingCompleted_${user.email}`;
        localStorage.setItem(onboardingKey, "true");
        
        // Sauvegarder le profil lié à l'utilisateur
        const profileKey = `userProfile_${user.email}`;
        localStorage.setItem(profileKey, JSON.stringify(profile));
        
        // Garder une copie générique pour l'affichage immédiat (rétrocompatibilité)
        localStorage.setItem("userProfile", JSON.stringify(profile));
      }
      
      // Redirection vers la page d'analyse/résultat
      setLocation("/analysis");
    }, 2000);
  };

  if (showSummary && !isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6 pt-12 animate-fade-in">
        <div className="max-w-md mx-auto w-full space-y-6 pb-20">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Récapitulatif</h1>
            <p className="text-muted-foreground">Vérifiez vos réponses avant de continuer.</p>
          </div>

          <div className="space-y-4">
            {QUESTIONS.map((q, index) => {
              // Ne pas afficher les questions sautées (ex: durée si 0 jours)
              if (answers[index] === undefined) return null;

              let answerText = "";
              if (q.type === 'days') {
                answerText = `${answers[index]} jour${answers[index] > 1 ? 's' : ''}`;
              } else {
                const h = answers[index]?.hours || 0;
                const m = answers[index]?.minutes || 0;
                if (h > 0) answerText += `${h}h `;
                if (m > 0) answerText += `${m}min`;
                if (h === 0 && m === 0) answerText = "0min";
              }

              return (
                <div key={q.id} className="bg-card border border-border rounded-xl p-4 flex justify-between items-center">
                  <div className="flex-1 pr-4">
                    <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{q.question}</p>
                    <p className="font-semibold text-foreground">{answerText}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditQuestion(index)}
                    className="text-primary hover:text-primary/80"
                  >
                    Modifier
                  </Button>
                </div>
              );
            })}
          </div>

          <Button
            onClick={handleSummaryConfirm}
            className="w-full py-6 text-lg font-semibold rounded-xl mt-8"
          >
            Valider mes réponses
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (showDetailsForm && !isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6 pt-12 animate-fade-in">
        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Informations Complémentaires</h1>
            <p className="text-muted-foreground">Ces détails nous aident à affiner votre programme.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  placeholder="70"
                  value={details.weight}
                  onChange={handleDetailsChange}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Taille (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  placeholder="175"
                  value={details.height}
                  onChange={handleDetailsChange}
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="injuries">Blessures récentes ou douleurs chroniques</Label>
              <Textarea
                id="injuries"
                name="injuries"
                placeholder="Ex: Douleur au genou droit, mal de dos..."
                value={details.injuries}
                onChange={handleDetailsChange}
                className="bg-secondary border-border min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalConditions">Conditions médicales particulières</Label>
              <Textarea
                id="medicalConditions"
                name="medicalConditions"
                placeholder="Ex: Asthme, diabète, hypertension..."
                value={details.medicalConditions}
                onChange={handleDetailsChange}
                className="bg-secondary border-border min-h-[100px]"
              />
            </div>
          </div>

          <Button
            onClick={finishOnboarding}
            className="w-full py-6 text-lg font-semibold rounded-xl mt-8"
          >
            Terminer et Analyser
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Analyse de votre profil...</h2>
        <p className="text-muted-foreground">Nous calculons votre niveau d'activité pour personnaliser votre programme.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          {step > 0 ? (
            <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <span className="text-sm font-medium text-muted-foreground">
            Question {step + 1}/{QUESTIONS.length}
          </span>
          <div className="w-10" />
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Content */}
      <div className="flex-1 px-6 flex flex-col justify-center max-w-md mx-auto w-full pb-20">
        <h1 className="text-2xl font-bold text-foreground mb-8 leading-tight">
          {currentQuestion.question}
        </h1>

        <div className="space-y-6">
          {currentQuestion.type === 'days' && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground px-2">
                <span>0 jours</span>
                <span>7 jours</span>
              </div>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDaysChange(day)}
                    className={`aspect-square rounded-xl border-2 flex items-center justify-center text-lg font-semibold transition-all ${
                      answers[step] === day
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50 bg-card text-foreground"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {answers[step] !== undefined 
                  ? `${answers[step]} jour${answers[step] > 1 ? 's' : ''} par semaine`
                  : "Sélectionnez un nombre de jours"}
              </p>
            </div>
          )}

          {currentQuestion.type === 'duration' && (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Sélectionnez le temps passé à cette activité
              </p>
              <TimePicker
                value={answers[step] || { hours: 0, minutes: 0 }}
                onChange={(value) => setAnswers((prev) => ({ ...prev, [step]: value }))}
                maxHours={23}
                maxMinutes={59}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 bg-background border-t border-border">
        <div className="max-w-md mx-auto">
          <Button
            onClick={handleNext}
            disabled={
              currentQuestion.type === 'days' 
                ? answers[step] === undefined 
                : false // Toujours activé pour la durée car 0h0m est valide par défaut
            }
            className="w-full py-6 text-lg font-semibold rounded-xl"
          >
            {step === QUESTIONS.length - 1 ? "Voir le récapitulatif" : "Continuer"}
            {step < QUESTIONS.length - 1 && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
