import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import useSWR from "swr";

import styles from './index.module.scss';

export default function Home() {
  const router = useRouter();
  // @ts-ignore
  const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR(`/languages/${router.locale}.json`, fetcher);
  
  let user;
  
  useEffect(() => {
    user = localStorage.getItem('user');
    user && router.push('/app');
  }, [user]);
  
  return (
    <div className='workspace'>
      <Head>
        <link
          rel='alternate'
          hrefLang={router.locale}
          href={`${process.env.NEXT_PUBLIC_PAGE}${router.locale === 'en' ? '' : `/${router.locale}`}${router.asPath}`}
        />
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <title>{data?.title}</title>
      </Head>
      
      
      <h1 className={styles.title}>Welcome artysto!</h1>
      
      <h3 className={styles.h3}>
        Szukasz serwisu, który spełni będzie dedykowany tobie, a nie milionom osób więc nikomu?
        <br />
        <br />
        Szukasz serwisu, który sprawdzi się jako graficzny pamiętnik? A może chcesz się pochwalić
        swoimi artystycznymi dziełami?
      </h3>
      
      <h2 className={styles.h2}>
        Dobrze trafiłeś! Jest to serwis dedykowany takim osobom jak ty.
        <br />
        <br />
        Od niedzielnych artystów po ludzi tworzących swoje wirtualne podręczne portfolio.
      </h2>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>Krótki film? Jakiś Gif? Rysunek? Obraz? Zdjęcie?</h4>
          <p className={styles.answer}>Nie ma problemu! Wysyłasz na serwer i już!</p>
        </div>
        
        <img src='#' className={styles.image} alt='picture.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>Chcesz zobaczyć co inni robią?</h4>
          
          <p className={styles.answer}>Kliknij w nick i przeglądaj.</p>
        </div>
        
        <img src='#' className={styles.image} alt='obraz.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>Chcesz zobaczyć co jest na topie?</h4>
          
          <p className={styles.answer}>Już to masz na głównej stronie. Wystarczy się zalogować!</p>
        </div>
        
        <img src='#' className={styles.image} alt='obraz.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>
            Chcesz zobaczyć co ostatnio polubiłeś/aś? <br />
          </h4>
          
          <p className={styles.answer}>Wystarczy się zalogować i już masz to!</p>
        </div>
        
        <img src='#' className={styles.image} alt='obraz.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>Design?</h4>
          
          <p className={styles.answer}>
            Oczywiście minimalistyczny! Twoje ma być na wierzchu, nie nasze. Dzięki temu wszystko
            wszystko jest też czytelniejsze, więc nic się nie zlewa w jedną animację lub obraz.
          </p>
        </div>
        
        <img src='#' className={styles.image} alt='obraz.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>Interfejs jest za jasny?</h4>
          
          <p className={styles.answer}>No to cyk i masz ciemny!</p>
        </div>
        
        <img src='#' className={styles.image} alt='obraz.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>Chcesz znaleźć coś o określonym typie?</h4>
          
          <p className={styles.answer}>
            Wybierz tag. A może sam coś dodałeś/aś i chcesz by łatwiej ludzie znaleźli? <br />
            Dodaj tag.
          </p>
        </div>
        
        <img src='#' className={styles.image} alt='obraz.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>Szukasz ludzi o podobnym upodobaniach?</h4>
          
          <p className={styles.answer}>Wybierz grupę lub, jeszcze lepiej sam/a ją stwórz!</p>
        </div>
        
        <img src='#' className={styles.image} alt='obraz.jpg' />
      </div>
      
      <div className={styles.main__container}>
        <div className={styles.container}>
          <h4 className={styles.question}>Masz tutaj artystycznych przyjaciół?</h4>
          
          <p className={styles.answer}>Zawsze masz ich pod ręką. Szybko, więc wiesz czym się ostatnio pochwalili.</p>
        </div>
        
        <img src='#' className={styles.image} alt='picture.jpg' />
      </div>
    </div>
  );
}
