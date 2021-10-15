import './ProfileAccount.module.scss';

export const ProfileAccount = () => {
  return (
    <article id="profile" className="profile">
      <div className="photo__profile" />

      <div className="user__name">
        <label htmlFor="user__name">Twoja nazwa użytkownika:</label>
        <input id="user__name" type="text" />
      </div>

      <div className="about__me">
        <label htmlFor="about__me">O mnie:</label>
        <textarea id="about__me" />
      </div>
    </article>
  );
};
