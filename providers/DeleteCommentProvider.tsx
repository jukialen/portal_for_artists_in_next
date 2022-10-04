import { createContext, ReactNode, useState } from 'react';

type ChildrenType = {
  children: ReactNode;
};

export const DCContext = createContext({
  del: false,
  changeDel: () => {},
});

export const DCProvider = ({ children }: ChildrenType) => {
  const [del, setDel] = useState(false);

  const changeDel = () => setDel(!del);

  return <DCContext.Provider value={{ del, changeDel }}>{children}</DCContext.Provider>;
};
