import { Button } from 'components/atoms/Button/Button';
import { Inputs } from 'components/atoms/Inputs/Inputs';

export const PasswordAccountData = () => {
  return (
    <form>
      <label htmlFor="password">Hasło:</label>

      <Inputs
        idInputs="password"
        typeInput="password"
        placeholderInput="Wpisz aktualne hasło"
        // @ts-ignore
        required="required"
      />
      <Inputs
        typeInput="password"
        placeholderInput="Wpisz nowe hasło"
        // @ts-ignore
        required="required"
      />
      <Inputs
        typeInput="password"
        placeholderInput="Powtórz nowe hasło"
        // @ts-ignore
        required="required"
      />

      <Button typeButton="submit" title="Zmień hasło" ariaLabel="Submit new password" />
    </form>
  );
};
