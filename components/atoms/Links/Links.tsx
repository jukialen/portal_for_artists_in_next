import { ReactNode } from 'react';

type linksType = {
  idInput?: string;
  hrefLink: string;
  classLink?: string;
  title?: string;
  elementLink?: ReactNode;
};

export const Links = ({
  idInput,
  hrefLink,
  classLink,
  title,
  elementLink,
  ...props
}: linksType) => {
  return (
    <a href={hrefLink} id={idInput} className={classLink} {...props}>
      {title}
      {elementLink}
    </a>
  );
};
