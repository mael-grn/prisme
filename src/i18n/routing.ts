import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['en', 'fr'],
    defaultLocale: 'fr'
});

// Ces utilitaires remplaceront le "Link" et "useRouter" natifs de Next.js
// pour ajouter automatiquement le /fr/ ou /en/ dans les URLs
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);