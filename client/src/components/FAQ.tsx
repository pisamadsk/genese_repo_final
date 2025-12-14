import { useState, useMemo } from "react";
import {
  MessageCircle,
  X,
  ChevronDown,
  Search,
  Zap,
  Activity,
  Dumbbell,
  Scale,
  Sofa,
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Droplet,
  Apple,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon?: React.ReactNode;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "1",
    category: "Activité Physique",
    question: "Combien de temps d'activité physique par jour?",
    answer: "L'OMS recommande au moins 150 minutes d'activité modérée ou 75 minutes d'activité vigoureuse par semaine pour les adultes. Cela équivaut à environ 30 minutes, 5 jours par semaine.",
    icon: <Activity className="w-5 h-5" />,
  },
  {
    id: "2",
    category: "Activité Physique",
    question: "Quelle est la différence entre activité modérée et vigoureuse?",
    answer: "Activité modérée: vous pouvez parler mais pas chanter (ex: marche rapide, vélo léger). Activité vigoureuse: vous ne pouvez pas parler (ex: course, sports intensifs).",
    icon: <Dumbbell className="w-5 h-5" />,
  },
  {
    id: "3",
    category: "Santé",
    question: "Qu'est-ce que l'IMC et pourquoi c'est important?",
    answer: "L'IMC (Indice de Masse Corporelle) = poids (kg) / taille² (m²). Il évalue si votre poids est sain. Normal: 18.5-24.9, Surpoids: 25-29.9, Obésité: 30+.",
    icon: <Scale className="w-5 h-5" />,
  },
  {
    id: "4",
    category: "Santé",
    question: "Comment réduire le temps assis?",
    answer: "Levez-vous toutes les heures, prenez les escaliers, marchez pendant les appels, faites du stretching. Même 2-3 minutes de mouvement toutes les heures aide.",
    icon: <Sofa className="w-5 h-5" />,
  },
  {
    id: "5",
    category: "IPAQ",
    question: "Qu'est-ce que le score IPAQ?",
    answer: "L'IPAQ mesure votre niveau d'activité physique en MET-min/semaine. Faible: <600, Modéré: 600-2999, Élevé: ≥3000. Plus le score est élevé, mieux c'est.",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: "6",
    category: "IPAQ",
    question: "Comment augmenter mon score IPAQ?",
    answer: "Augmentez votre activité vigoureuse (8 METs), modérée (4 METs) ou marche (3.3 METs). Même 10 minutes supplémentaires par jour fait une différence.",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: "7",
    category: "Conseils",
    question: "Comment commencer un programme d'exercice?",
    answer: "Commencez progressivement: 10-15 min par jour, augmentez graduellement. Choisissez une activité que vous aimez. Consultez un médecin avant de commencer.",
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "8",
    category: "Conseils",
    question: "Quel est le meilleur moment pour faire du sport?",
    answer: "Le meilleur moment est celui où vous êtes régulier. Matin: plus d'énergie. Soir: muscles plus chauds. L'important est la constance.",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: "9",
    category: "Nutrition",
    question: "Quelle est l'importance de l'hydratation?",
    answer: "Buvez 2-3 litres d'eau par jour. L'hydratation améliore les performances, la récupération et la santé générale.",
    icon: <Droplet className="w-5 h-5" />,
  },
  {
    id: "10",
    category: "Nutrition",
    question: "Faut-il manger avant ou après l'exercice?",
    answer: "Avant: léger snack (banane, yaourt) 30-60 min avant. Après: protéines + glucides dans les 30-60 min pour la récupération.",
    icon: <Apple className="w-5 h-5" />,
  },
];

export default function FAQ() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Tous",
    ...Array.from(new Set(FAQ_ITEMS.map((item) => item.category))),
  ];

  const filteredFAQ = useMemo(() => {
    let filtered = FAQ_ITEMS;

    if (selectedCategory !== "Tous") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Ouvrir FAQ"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-spin" style={{ animationDuration: "0.3s" }} />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* FAQ Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-h-[600px] bg-card border border-border rounded-xl shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-xl">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5" />
              <h3 className="font-bold text-lg">Questions Fréquentes</h3>
            </div>
            <p className="text-xs opacity-90">Conseils fitness & santé personnalisés</p>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-3 border-b border-border bg-secondary/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 p-3 border-b border-border overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white shadow-md scale-105"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-secondary">
            {filteredFAQ.length > 0 ? (
              <div className="space-y-0">
                {filteredFAQ.map((item, index) => (
                  <div
                    key={item.id}
                    className="border-b border-border last:border-b-0 animate-in fade-in slide-in-from-left duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === item.id ? null : item.id)
                      }
                      className="w-full text-left p-4 hover:bg-secondary/50 transition-all duration-200 flex items-start justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="text-orange-500 flex-shrink-0 mt-0.5">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-orange-500 transition-colors line-clamp-2">
                          {item.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-orange-500 flex-shrink-0 transition-transform duration-300 ${
                          expandedId === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expandedId === item.id && (
                      <div className="px-4 pb-4 text-sm text-muted-foreground bg-secondary/30 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Search className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Aucune question trouvée
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Essayez une autre recherche
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border bg-secondary/30 text-xs text-muted-foreground text-center">
            {filteredFAQ.length} question{filteredFAQ.length !== 1 ? "s" : ""} trouvée{filteredFAQ.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
