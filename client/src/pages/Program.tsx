import { useState, useEffect } from "react";
import { BackIcon, ClockIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

/**
 * Design: Mobile-only with Light/Dark theme
 * Program page with sessions and timer
 */

const SESSIONS = [
  {
    id: 1,
    name: "Mobilité Matinale",
    duration: 15,
    exercises: [
      { name: "Échauffement", duration: 3 },
      { name: "Mobilité hanche", duration: 5 },
      { name: "Flexibilité colonne", duration: 4 },
      { name: "Respiration", duration: 3 },
    ],
    difficulty: "Facile",
  },
  {
    id: 2,
    name: "Stabilité Équilibre",
    duration: 20,
    exercises: [
      { name: "Équilibre statique", duration: 5 },
      { name: "Marche en ligne", duration: 5 },
      { name: "Proprioception", duration: 5 },
      { name: "Retour au calme", duration: 5 },
    ],
    difficulty: "Moyen",
  },
  {
    id: 3,
    name: "Force Musculaire",
    duration: 25,
    exercises: [
      { name: "Échauffement", duration: 3 },
      { name: "Renforcement haut du corps", duration: 8 },
      { name: "Renforcement bas du corps", duration: 8 },
      { name: "Étirements", duration: 6 },
    ],
    difficulty: "Difficile",
  },
];

export default function Program() {
  const [, setLocation] = useLocation();
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [completedSessions, setCompletedSessions] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("completedSessions");
    if (saved) {
      setCompletedSessions(JSON.parse(saved));
    }
  }, []);

  const handleSessionComplete = (sessionId: number) => {
    const newCompleted = [...completedSessions];
    if (!newCompleted.includes(sessionId)) {
      newCompleted.push(sessionId);
      setCompletedSessions(newCompleted);
      localStorage.setItem("completedSessions", JSON.stringify(newCompleted));
    }
    setSelectedSession(null);
  };

  if (selectedSession) {
    const session = SESSIONS.find((s) => s.id === selectedSession);
    return (
      <SessionDetail
        session={session!}
        onComplete={() => handleSessionComplete(selectedSession)}
        onBack={() => setSelectedSession(null)}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b border-border animate-slide-in-down">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation("/home")}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
<BackIcon /> Retour
          </button>
          <h1 className="text-lg font-bold text-foreground">Mon Programme</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 animate-slide-in-up">
        {/* Hero Image */}
        <div className="relative h-40 rounded-lg overflow-hidden">
          <img
            src="/breathing-hero.jpg"
            alt="Programme d'exercices"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Stats */}
        <Card className="p-4 bg-primary/10">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Séances complétées</p>
              <p className="text-2xl font-bold text-primary">
                {completedSessions.length}/{SESSIONS.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Durée totale</p>
              <p className="text-2xl font-bold text-primary">60 min</p>
            </div>
          </div>
        </Card>

        {/* Sessions */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 px-1">
            Séances disponibles
          </h3>
          <div className="space-y-3">
            {SESSIONS.map((session) => {
              const isCompleted = completedSessions.includes(session.id);
              return (
                <Card
                  key={session.id}
                  className="p-4 cursor-pointer transition-smooth hover-lift"
                  onClick={() => setSelectedSession(session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {session.name}
                        </h3>
              {isCompleted && (
                        <span className="text-sm text-primary">✓</span>
                      )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {session.exercises.length} exercices
                      </p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          {session.duration} min
                        </span>
                        <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">
                          {session.difficulty}
                        </span>
                      </div>
                    </div>
                    <span className="text-primary ml-4 mt-1">▶</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <Card className="p-4 bg-primary/10 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">Conseils</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Échauffez-vous avant chaque séance</li>
            <li>• Respectez votre rythme</li>
            <li>• Hydratez-vous régulièrement</li>
            <li>• Pratiquez 3 fois par semaine</li>
          </ul>
        </Card>

        {/* Action Button */}
        <Button
          onClick={() => setLocation("/home")}
          className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-3 rounded-lg transition-colors"
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}

interface SessionDetailProps {
  session: (typeof SESSIONS)[0];
  onComplete: () => void;
  onBack: () => void;
}

function SessionDetail({ session, onComplete, onBack }: SessionDetailProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(session.exercises[0].duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(session.duration * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setSessionTimeLeft((st) => Math.max(0, st - 1));
          
          if (newTime <= 0) {
            // Move to next exercise
            if (currentExerciseIndex < session.exercises.length - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
              return session.exercises[currentExerciseIndex + 1].duration * 60;
            } else {
              // Session complete
              setIsRunning(false);
              onComplete();
              return 0;
            }
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, currentExerciseIndex, session.exercises, onComplete]);

  const currentExercise = session.exercises[currentExerciseIndex];
  const progress =
    ((currentExerciseIndex + 1) / session.exercises.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b border-border animate-slide-in-down">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
<BackIcon /> Retour
          </button>
          <h1 className="text-lg font-bold text-foreground">{session.name}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 animate-slide-in-up">
        {/* Progress */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-foreground">
              Exercice {currentExerciseIndex + 1}/{session.exercises.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatTime(sessionTimeLeft)}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </Card>

        {/* Current Exercise */}
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {currentExercise.name}
          </h2>
          <div className="bg-primary/10 rounded-lg p-8 mb-6">
            <div className="text-6xl font-bold text-primary">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex gap-3 justify-center mb-6">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-semibold"
            >
                  {isRunning ? "Pause" : "Démarrer"}
            </Button>
            <Button
              onClick={() => {
                setTimeLeft(currentExercise.duration * 60);
                setIsRunning(false);
              }}
              className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold"
            >
                  Réinitialiser
            </Button>
          </div>

          {/* Exercise Info */}
          <div className="bg-secondary rounded-lg p-4 text-left">
            <p className="text-sm text-muted-foreground mb-2">
              Durée estimée: {currentExercise.duration} min
            </p>
            <p className="text-sm text-foreground">
              Effectuez cet exercice avec attention. Écoutez votre corps et
              n'hésitez pas à faire une pause si nécessaire.
            </p>
          </div>
        </Card>

        {/* Next Exercise Preview */}
        {currentExerciseIndex < session.exercises.length - 1 && (
          <Card className="p-4 bg-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Prochain exercice</p>
            <p className="font-semibold text-foreground">
              {session.exercises[currentExerciseIndex + 1].name}
            </p>
          </Card>
        )}

        {/* Skip Button */}
        <Button
          onClick={() => {
            if (currentExerciseIndex < session.exercises.length - 1) {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
              setTimeLeft(
                session.exercises[currentExerciseIndex + 1].duration * 60
              );
              setIsRunning(false);
            } else {
              onComplete();
            }
          }}
          className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-3 rounded-lg transition-colors"
        >
          Exercice Suivant
        </Button>
      </div>
    </div>
  );
}
