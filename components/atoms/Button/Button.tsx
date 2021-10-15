import { MouseEventHandler, ReactNode } from 'react';

type buttonType = {
  idButton?: string;
  classButton?: string;
  typeButton?: 'button' | 'submit';
  title?: string;
  ariaLabel: string;
  elementButton?: ReactNode;
  onClick?: MouseEventHandler;
  props?: string[];
};

export const Button = ({
  idButton,
  classButton,
  typeButton,
  title,
  ariaLabel,
  elementButton,
  onClick,
  ...props
}: buttonType) => {
  return (
    <button
      id={idButton}
      className={classButton}
      type={typeButton}
      aria-label={ariaLabel}
      onClick={onClick}
      {...props}
    >
      {title}
      {elementButton}
    </button>
  );
};
