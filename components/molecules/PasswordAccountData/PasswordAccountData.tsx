import { Inputs } from 'components/atoms/Inputs/Inputs';

export const PasswordAccountData = () => {
  return (
    <form>
      <label htmlFor='password'>Hasło:</label>
      
      <Inputs
        idInputs='password'
        typeInput='password'
        placeholderInput='Wpisz aktualne hasło'
        // @ts-ignore
        required='required'
      />
      <Inputs
        typeInput='password'
        placeholderInput='Wpisz nowe hasło'
        // @ts-ignore
        required='required'
      />
      <Inputs
        typeInput='password'
        placeholderInput='Powtórz nowe hasło'
        // @ts-ignore
        required='required'
      />
      
      <button type='submit' aria-label='Submit new password'>
        Zmień hasło
      </button>
    </form>
  );
};
