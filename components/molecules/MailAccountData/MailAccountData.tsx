import { Inputs } from 'components/atoms/Inputs/Inputs';
import { Button } from 'components/atoms/Button/Button';

export const MailAccountData = () => {
  return (
    <form>
      <label htmlFor="mail__change">E-mail:</label>

      <Inputs typeInput="type" placeholderInput="Aktualny e-mail" />
      <Button
        idButton="mail__change"
        typeButton="submit"
        title="Zmień adres e-mail"
        ariaLabel="E-mail adress change"
      />
    </form>
  );
};
