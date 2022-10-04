import { ReactNode } from 'react';

type LinksType = {
  idInput?: string;
  hrefLink: string;
  classLink?: string;
  children: ReactNode;
};

export const Links = ({ idInput, hrefLink, classLink, children, ...props }: LinksType) => {
  return (
    <a href={hrefLink} id={idInput} className={classLink} {...props}>
      {children}
    </a>
  );
};
