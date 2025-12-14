import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface IPAQChartProps {
  metScore: number;
}

export default function IPAQChart({ metScore }: IPAQChartProps) {
  // Données pour le graphique
  const data = [
    {
      name: 'Votre Score',
      value: Math.min(metScore, 3500), // Cap à 3500 pour la visualisation
      fill: metScore < 600 ? '#ef4444' : metScore < 3000 ? '#eab308' : '#22c55e',
    },
  ];

  // Seuils IPAQ
  const thresholds = [
    { name: 'Faible', value: 600, color: '#ef4444' },
    { name: 'Modéré', value: 3000, color: '#eab308' },
    { name: 'Élevé', value: 3500, color: '#22c55e' },
  ];

  // Déterminer la catégorie
  let category = 'Faible';
  let categoryColor = '#ef4444';
  if (metScore >= 3000) {
    category = 'Élevé';
    categoryColor = '#22c55e';
  } else if (metScore >= 600) {
    category = 'Modéré';
    categoryColor = '#eab308';
  }

  return (
    <div className="w-full space-y-6">
      {/* Graphique à barres */}
      <div className="bg-secondary/30 rounded-lg p-6 border border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Comparaison avec les Seuils IPAQ</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value) => `${Math.round(value as number)} MET-min/sem`}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              <Cell fill={data[0].fill} />
            </Bar>
            
            {/* Lignes de référence pour les seuils */}
            <ReferenceLine y={600} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Seuil Faible (600)', position: 'right', fill: '#ef4444', fontSize: 12 }} />
            <ReferenceLine y={3000} stroke="#eab308" strokeDasharray="5 5" label={{ value: 'Seuil Modéré (3000)', position: 'right', fill: '#eab308', fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Légende des seuils */}
      <div className="grid grid-cols-3 gap-4">
        {thresholds.map((threshold, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-border/50 bg-secondary/30 text-center"
          >
            <div
              className="w-4 h-4 rounded-full mx-auto mb-2"
              style={{ backgroundColor: threshold.color }}
            ></div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">{threshold.name}</p>
            <p className="text-sm font-bold text-foreground">{threshold.value} MET-min/sem</p>
          </div>
        ))}
      </div>

      {/* Résumé de la catégorie */}
      <div className="p-4 rounded-lg border-2" style={{ borderColor: categoryColor, backgroundColor: `${categoryColor}15` }}>
        <p className="text-sm text-muted-foreground mb-1">Votre Catégorie IPAQ</p>
        <p className="text-2xl font-bold" style={{ color: categoryColor }}>
          {category}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {metScore < 600
            ? 'Augmentez votre activité physique pour atteindre le niveau Modéré.'
            : metScore < 3000
            ? 'Continuez vos efforts pour atteindre le niveau Élevé.'
            : 'Excellent ! Vous avez atteint le niveau Élevé d\'activité physique.'}
        </p>
      </div>
    </div>
  );
}
