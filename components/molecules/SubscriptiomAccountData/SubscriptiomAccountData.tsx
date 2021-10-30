export const SubscriptiomAccountData = () => {
  return (
    <form>
      <label htmlFor='subscription__info'>Subskrypcja:</label>
      <button
        id='subscription__info'
        aria-label='Info about subscription'
      >
        Aktualny plan
      </button>
      <button className='subscription__check' aria-label='Change subscription'>
        Zmień
      </button>
    </form>
  );
};
