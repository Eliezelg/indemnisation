'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useState, useTransition } from 'react';

type Locale = 'fr' | 'he' | 'en' | 'es';

const languages = {
  fr: { name: 'Français', flag: '🇫🇷' },
  he: { name: 'עברית', flag: '🇮🇱' },
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
};

export default function LanguageSelector() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = async (newLocale: Locale) => {
    // Mettre à jour la locale dans l'API si l'utilisateur est connecté
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await fetch('http://localhost:3001/users/me/locale', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ locale: newLocale }),
        });
      } catch (error) {
        console.error('Failed to update preferred locale:', error);
        // Continue même si la mise à jour échoue
      }
    }

    // Changer la langue de l'interface
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        disabled={isPending}
      >
        <span className="text-xl">{languages[locale].flag}</span>
        <span className="hidden sm:inline text-sm font-medium text-gray-700">
          {languages[locale].name}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu déroulant */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {(Object.keys(languages) as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLocaleChange(lang)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  locale === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
                disabled={isPending}
              >
                <span className="text-xl">{languages[lang].flag}</span>
                <span className="font-medium">{languages[lang].name}</span>
                {locale === lang && (
                  <svg
                    className="w-4 h-4 ml-auto text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
