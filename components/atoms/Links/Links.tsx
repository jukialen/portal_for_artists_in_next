import { ReactNode } from 'react';
import { Link } from '@chakra-ui/next-js';

type LinksType = {
  idInput?: string;
  hrefLink: string;
  classLink?: string;
  children: ReactNode;
};

export const Links = ({ idInput, hrefLink, classLink, children, ...props }: LinksType) => {
  return (
    <Link href={hrefLink} id={idInput} className={classLink} {...props}>
      {children}
    </Link>
  );
};
