type InputsTypes = {
  idInputs?: string;
  typeInput?: string;
  placeholderInput: string;
  className: string;
};

export const Inputs = ({ idInputs, typeInput, placeholderInput, className }: InputsTypes) => {
  return <input type={typeInput} id={idInputs} placeholder={placeholderInput} className={className} />;
};
