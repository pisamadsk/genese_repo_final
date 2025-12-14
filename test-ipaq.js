// Script de test pour vérifier l'algorithme IPAQ
// Simule différents scénarios et vérifie les résultats

function calculateIPAQ(answers) {
  // Calcul des METs
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

  // Détection sédentaire
  const tempsAssisDuree = answers[6] ? (answers[6].hours * 60 + answers[6].minutes) : 0;
  const isSedentaire = tempsAssisDuree >= 480; // >= 8 heures

  // Catégorisation
  let level = "";
  if (totalMETs < 600) {
    level = isSedentaire ? "Faible + Sédentaire" : "Faible";
  } else if (totalMETs < 3000) {
    level = isSedentaire ? "Modéré + Sédentaire" : "Modéré";
  } else {
    level = isSedentaire ? "Élevé + Sédentaire" : "Élevé";
  }

  return {
    metVigoureuse,
    metModeree,
    metMarche,
    totalMETs: Math.round(totalMETs),
    tempsAssis: tempsAssisDuree,
    isSedentaire,
    level,
  };
}

// Scénarios de test
const scenarios = [
  {
    name: "Scenario 1: Faible activité, NON sédentaire",
    answers: [
      0, // Q1: 0 jours vigoureuse
      { hours: 0, minutes: 0 }, // Q2: durée vigoureuse
      0, // Q3: 0 jours modérée
      { hours: 0, minutes: 0 }, // Q4: durée modérée
      1, // Q5: 1 jour marche
      { hours: 0, minutes: 30 }, // Q6: 30 min marche
      { hours: 4, minutes: 0 }, // Q7: 4h assis (< 8h)
    ],
    expected: "Faible",
  },
  {
    name: "Scenario 2: Faible activité, SÉDENTAIRE",
    answers: [
      0,
      { hours: 0, minutes: 0 },
      0,
      { hours: 0, minutes: 0 },
      1,
      { hours: 0, minutes: 30 },
      { hours: 9, minutes: 0 }, // 9h assis (>= 8h)
    ],
    expected: "Faible + Sédentaire",
  },
  {
    name: "Scenario 3: Modéré activité, NON sédentaire",
    answers: [
      0,
      { hours: 0, minutes: 0 },
      3, // 3 jours modérée
      { hours: 0, minutes: 45 }, // 45 min modérée
      3, // 3 jours marche
      { hours: 0, minutes: 30 }, // 30 min marche
      { hours: 5, minutes: 0 }, // 5h assis
    ],
    expected: "Modéré",
  },
  {
    name: "Scenario 4: Modéré activité, SÉDENTAIRE",
    answers: [
      0,
      { hours: 0, minutes: 0 },
      3,
      { hours: 0, minutes: 45 },
      3,
      { hours: 0, minutes: 30 },
      { hours: 10, minutes: 0 }, // 10h assis
    ],
    expected: "Modéré + Sédentaire",
  },
  {
    name: "Scenario 5: Eleve activite, NON sedentaire",
    answers: [
      4, // 4 jours vigoureuse
      { hours: 1, minutes: 0 }, // 1h vigoureuse
      4, // 4 jours moderee
      { hours: 1, minutes: 0 }, // 1h moderee
      4, // 4 jours marche
      { hours: 0, minutes: 30 }, // 30 min marche
      { hours: 6, minutes: 0 }, // 6h assis
    ],
    expected: "Élevé",
  },
  {
    name: "Scenario 6: Eleve activite, SEDENTAIRE",
    answers: [
      4,
      { hours: 1, minutes: 0 },
      4,
      { hours: 1, minutes: 0 },
      4,
      { hours: 0, minutes: 30 },
      { hours: 9, minutes: 0 }, // 9h assis
    ],
    expected: "Élevé + Sédentaire",
  },
];

// Exécution des tests
console.log("=== TEST ALGORITHME IPAQ ===\n");

let passed = 0;
let failed = 0;

scenarios.forEach((scenario) => {
  const result = calculateIPAQ(scenario.answers);
  const isPass = result.level === scenario.expected;

  console.log(`📋 ${scenario.name}`);
  console.log(`   Score MET: ${result.totalMETs} MET-min/sem`);
  console.log(`   Temps assis: ${result.tempsAssis} min (${result.isSedentaire ? "SÉDENTAIRE" : "NON sédentaire"})`);
  console.log(`   Résultat: ${result.level}`);
  console.log(`   Attendu: ${scenario.expected}`);
  console.log(isPass ? `   ✅ PASS` : `   ❌ FAIL`);
  console.log();

  if (isPass) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`\n=== RÉSUMÉ ===`);
console.log(`✅ Réussis: ${passed}/${scenarios.length}`);
console.log(`❌ Échoués: ${failed}/${scenarios.length}`);
console.log(`\nTous les 6 niveaux IPAQ sont testés:`);
console.log(`1. Faible`);
console.log(`2. Faible + Sédentaire`);
console.log(`3. Modéré`);
console.log(`4. Modéré + Sédentaire`);
console.log(`5. Élevé`);
console.log(`6. Élevé + Sédentaire`);
