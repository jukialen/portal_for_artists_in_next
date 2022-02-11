type InputsTypes = {
  idInputs?: string;
  typeInput?: string;
  placeholderInput: string;
  className: string;
  required?: boolean;
};

export const Inputs = ({ idInputs, typeInput, placeholderInput, className, required }: InputsTypes) => {
  return <input type={typeInput} id={idInputs} placeholder={placeholderInput} className={className} required={required} />;
};
