'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

import { ContainerType } from 'types/global.types';

import styles from './HomeImageContainers.module.css';

type HomeImageContainersType = {
  containerData: ContainerType[];
  width: number;
  height: number;
};

export const HomeImageContainers = ({ containerData, width, height }: HomeImageContainersType) => {
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
            scroller: 'main',
          },
        },
      );
    });
  }, []);

  return (
    <>
      {containerData.map((item, index) => (
        <article className={styles.main__container} key={index}>
          <div className={styles.container}>
            <h4 className={styles.question}>{item.question}</h4>
            <p className={styles.answer}>{item.answer}</p>
          </div>

          {item.mode ? (
            <video muted loop autoPlay playsInline preload="auto" width={width} height={height} className={styles.image}>
              <source src={item.imageSource[0] as string} type='video/mp4; codecs="hvc1"' />
              <source src={item.imageSource[1] as string} type='video/mp4' />
            </video>
          ) : (
            <Image
              src={item.imageSource[0]}
              width={width}
              height={height}
              className={styles.image}
              loading="lazy"
              alt={item.imageAlt[0]}
              quality={item.quality}
            />
          )}
        </article>
      ))}
    </>
  );
};
