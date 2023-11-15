'use client'

import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

export const useGsapScroll = () => {
  useEffect(() => {
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
    }, []);
}