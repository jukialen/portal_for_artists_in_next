import { useRouter } from "next/router";

import { HeadCom } from 'components/atoms/HeadCom/HeadCom';

const Authors = () => {
  const { asPath } = useRouter()
  
  return (
    <>
      <HeadCom path={asPath} content='Site about project authors.' />
      
      <h2>Tutaj będą znajdować się informacje o autorach projektu</h2>
    </>
  );
};

export default Authors;
