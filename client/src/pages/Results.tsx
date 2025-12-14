import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BackIcon, TrophyIcon } from "@/components/Icons";

/**
 * Design: Mobile-only with Light/Dark theme
 * Results page showing bilan scores and recommendations
 */

export default function Results() {
  const [, setLocation] = useLocation();
  const [scores, setScores] = useState<{ [key: number]: number }>({});
  const [globalScore, setGlobalScore] = useState(0);
  const [categories, setCategories] = useState<{
    [key: string]: { score: number; tests: number[] };
  }>({});

  useEffect(() => {
    // Charger les scores
    const saved = localStorage.getItem("bilanScores");
    if (saved) {
      const data = JSON.parse(saved);
      setScores(data.scores || {});

      // Calculer le score global
      const scoresArray = Object.values(data.scores || {}) as number[];
      if (scoresArray.length > 0) {
        const avg =
          scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length;
        setGlobalScore(Math.round(avg));
      }

      // Catégoriser les scores
      const cats = {
        mobilité: { score: 0, tests: [1, 4] },
        stabilité: { score: 0, tests: [2, 5] },
        force: { score: 0, tests: [3, 6] },
        conscience: { score: 0, tests: [7, 8] },
      };

      Object.entries(cats).forEach(([key, cat]) => {
        const catScores = cat.tests
          .map((testId) => data.scores[testId])
          .filter((s) => s !== undefined);
        if (catScores.length > 0) {
          cat.score =
            Math.round(
              catScores.reduce((a, b) => a + b, 0) / catScores.length
            ) || 0;
        }
      });

      setCategories(cats);
    }
  }, []);

  const getRecommendation = () => {
    if (globalScore >= 8) {
      return "Excellent ! Continuez à maintenir ce niveau de forme.";
    } else if (globalScore >= 6) {
      return "Bon ! Poursuivez vos efforts pour améliorer votre motricité.";
    } else if (globalScore >= 4) {
      return "Moyen. Augmentez progressivement vos exercices.";
    } else {
      return "À améliorer. Commencez par des exercices doux et progressifs.";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    if (score >= 4) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card border-b border-border animate-slide-in-down">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation("/bilan")}
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground font-semibold"
          >
<BackIcon /> Retour
          </button>
          <h1 className="text-lg font-bold text-foreground">Résultats</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6 animate-slide-in-up">
        {/* Hero Image */}
        <div className="relative h-40 rounded-lg overflow-hidden">
          <img
            src="/stability-hero.jpg"
            alt="Résultats"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Global Score */}
        <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex justify-center mb-4"><TrophyIcon /></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Score Global
          </h2>
          <div className={`text-5xl font-bold mb-2 ${getScoreColor(globalScore)}`}>
            {globalScore}/10
          </div>
          <p className="text-muted-foreground">{getRecommendation()}</p>
        </Card>

        {/* Category Scores */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 px-1">
            Détail par catégorie
          </h3>
          <div className="space-y-3">
            {Object.entries(categories).map(([key, cat]) => (
              <Card key={key} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground capitalize">
                    {key}
                  </h4>
                  <span className={`text-2xl font-bold ${getScoreColor(cat.score)}`}>
                    {cat.score}/10
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(cat.score / 10) * 100}%` }}
                  ></div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Individual Test Scores */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 px-1">
            Scores détaillés
          </h3>
          <Card className="p-4 space-y-2">
            {Object.entries(scores)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([testId, score]) => (
                <div key={testId} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Test {testId}
                  </span>
                  <span className={`font-bold ${getScoreColor(score as number)}`}>
                    {score}/10
                  </span>
                </div>
              ))}
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="p-4 bg-primary/10 border border-primary/20">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <span className="text-lg">📈</span>
            Recommandations
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Pratiquez 3 fois par semaine</li>
            <li>• Augmentez progressivement l'intensité</li>
            <li>• Écoutez votre corps</li>
            <li>• Consultez un professionnel si besoin</li>
          </ul>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={() => setLocation("/program")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            Voir le Programme Personnalisé
          </Button>
          <Button
            onClick={() => setLocation("/home")}
            className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
