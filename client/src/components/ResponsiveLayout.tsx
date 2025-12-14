import { ReactNode } from "react";

/**
 * ResponsiveLayout Component
 * Adapte le layout en fonction de la taille d'écran
 * - Mobile: < 640px (full width)
 * - Tablet: 640px - 1024px (max-w-2xl)
 * - Desktop: > 1024px (max-w-4xl)
 */

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function ResponsiveLayout({
  children,
  className = "",
}: ResponsiveLayoutProps) {
  return (
    <div
      className={`
        w-full
        mx-auto
        px-4 sm:px-6 lg:px-8
        py-4 sm:py-6 lg:py-8
        max-w-full sm:max-w-2xl lg:max-w-4xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Breakpoints Tailwind utilisés :
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 *
 * Utilisation dans les composants :
 * - Texte: text-sm sm:text-base lg:text-lg
 * - Grille: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
 * - Espacement: px-4 sm:px-6 lg:px-8
 */
