'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { I18nProviderClient } from 'source/locales/client';

import { ModeProvider } from 'source/providers/ModeProvider';
import { MenuProvider } from 'source/providers/MenuProvider';

import { AffixButton } from 'source/components/molecules/AffixButton/AffixButton';

type ChildrenType = {
  children: ReactNode;
  locale: string;
};

export const GlobalProvider = ({ children, locale }: ChildrenType) => {
  const pathname = usePathname();

  const homePage = pathname === `/${locale}`;

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
    <CacheProvider>
      <ChakraProvider>
        <I18nProviderClient>
          <ModeProvider>
            <MenuProvider>
              {children}
              <AffixButton />
            </MenuProvider>
          </ModeProvider>
        </I18nProviderClient>
      </ChakraProvider>
    </CacheProvider>
  );
};
