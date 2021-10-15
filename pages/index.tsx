import Image from 'next/image';

import './index.module.scss';


export default function Home() {
  return (
    <div className="workspace">
      <h1>Welcome artysto!</h1>

      <h3>
        Szukasz serwisu, który spełni będzie dedykowany tobie, a nie milionom osób więc nikomu?
        <br />
        <br />
        Szukasz serwisu, który sprawdzi się jako graficzny pamiętnik? A może chcesz się pochwalić
        swoimi artystycznymi dziełami?
      </h3>

      <h2>
        Dobrze trafiłeś! Jest to serwis dedykowany takim osobom jak ty.
        <br />
        <br />
        Od niedzielnych artystów po ludzi tworzących swoje wirtualne podręczne portfolio.
      </h2>

      <div className="main__container">
        <div className="container">
          <h4>Krótki film? Jakiś Gif? Rysunek? Obraz? Zdjęcie?</h4>
          <p>Nie ma problemu! Wysyłasz na serwer i już!</p>
        </div>

        <Image src="#" className="image" alt="picture.jpg" />
      </div>

      <div className="main__container">
        <div className="container">
          <h4>Chcesz zobaczyć co inni robią?</h4>

          <p>Kliknij w nick i przeglądaj.</p>
        </div>

        <Image src="#" className="image" alt="picture.jpg" />
      </div>

      <div className="main__container">
        <div className="container">
          <h4>Chcesz zobaczyć co jest na topie?</h4>

          <p>Już to masz na głównej stronie. Wystarczy się zalogować!</p>
        </div>

        <Image src="#" className="image" alt="picture.jpg" />
      </div>

      <div className="main__container">
        <div className="container">
          <h4>
            Chcesz zobaczyć co ostatnio polubiłeś/aś? <br />
          </h4>

          <p>Wystarczy się zalogować i już masz to!</p>
        </div>

        <Image src="#" className="image" alt="picture.jpg" />
      </div>

      <div className="main__container">
        <div className="container">
          <h4>Design?</h4>

          <p>
            Oczywiście minimalistyczny! Twoje ma być na wierzchu, nie nasze. Dzięki temu wszystko
            wszystko jest też czytelniejsze, więc nic się nie zlewa w jedną animację lub obraz.
          </p>
        </div>

        <Image src="#" className="image" alt="picture.jpg" />
      </div>

      <div className="main__container">
        <div className="container">
          <h4>Interfejs jest za jasny?</h4>

          <p>No to cyk i masz ciemny!</p>
        </div>

        <Image src="#" className="image" alt="picture.jpeg" />
      </div>

      <div className="main__container">
        <div className="container">
          <h4>Chcesz znaleźć coś o określonym typie?</h4>

          <p>
            Wybierz tag. A może sam coś dodałeś/aś i chcesz by łatwiej ludzie znaleźli? <br />
            Dodaj tag.
          </p>
        </div>

        <Image src="#" className="image" alt="obraz.jpg" />
      </div>

      <div className="main__container">
        <div className="container">
          <h4>Szukasz ludzi o podobnym upodobaniach?</h4>

          <p>Wybierz grupę lub, jeszcze lepiej sam/a ją stwórz!</p>
        </div>

        <Image src="#" className="image" alt="obraz.jpg" />
      </div>

      <div className="main__container">
        <div className="container">
          <h4>Masz tutaj artystycznych przyjaciół?</h4>

          <p>Zawsze masz ich pod ręką. Szybko, więc wiesz czym się ostatnio pochwalili.</p>
        </div>

        <Image src="#" className="image" alt="picture.jpg" />
      </div>
    </div>
  );
}

