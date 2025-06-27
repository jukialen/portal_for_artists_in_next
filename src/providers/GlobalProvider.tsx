'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useCurrentLocale, I18nProviderClient } from 'locales/client';

import { ModeProvider } from 'providers/ModeProvider';

import { AffixButton } from 'components/atoms/AffixButton/AffixButton';

type ChildrenType = {
  children: ReactNode;
  locale: string;
};

export const GlobalProvider = ({ children, locale }: ChildrenType) => {
  const pathname = usePathname();
  const router = useRouter();
  const homePage = pathname === `/${locale === 'en' ? '' : locale}`;
  
  locale === '/' && router.replace(`/${useCurrentLocale}`);
  
  useEffect(() => {
    if (homePage) {
      gsap.registerPlugin(ScrollTrigger);

      const sections = document.querySelectorAll('article');
      return sections.forEach((section: HTMLElement) => {
        gsap.fromTo(
          section.children,
          { y: '+=250', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1.2,
            ease: 'easeOut',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: '80% 80%',
              scrub: 3,
            },
          },
        );
      });
    }
  }, [homePage, pathname]);

  return (
        <I18nProviderClient locale={locale}>
          <ModeProvider>
            {children}
            <AffixButton />
          </ModeProvider>
        </I18nProviderClient>
  );
};
