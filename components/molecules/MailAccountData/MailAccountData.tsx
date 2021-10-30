import { Inputs } from 'components/atoms/Inputs/Inputs';

export const MailAccountData = () => {
  return (
    <form>
      <label htmlFor='mail__change'>E-mail:</label>
      
      <Inputs typeInput='type' placeholderInput='Aktualny e-mail' />
      <button
        id='mail__change'
        type='submit'
        aria-label='E-mail adress change'
      >
        Zmień adres e-mail
      </button>
    </form>
  );
};
