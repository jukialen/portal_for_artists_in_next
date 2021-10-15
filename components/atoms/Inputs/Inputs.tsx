type InputsTypes = {
  idInputs?: string;
  typeInput?: string;
  placeholderInput: string;

  props?: string[];
};

export const Inputs = ({ idInputs, typeInput, placeholderInput, ...props }: InputsTypes) => {
  return <input type={typeInput} id={idInputs} placeholder={placeholderInput} {...props} />;
};
