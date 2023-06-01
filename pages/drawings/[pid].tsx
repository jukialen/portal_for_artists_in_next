import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { FileType, Tags } from 'types/global.types';

import { useCurrentUser } from 'hooks/useCurrentUser';
import { useHookSWR } from 'hooks/useHookSWR';

import { ZeroFiles } from 'components/atoms/ZeroFiles/ZeroFiles';
import { HeadCom } from 'components/atoms/HeadCom/HeadCom';
import { Wrapper } from 'components/atoms/Wrapper/Wrapper';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Article } from 'components/molecules/Article/Article';

import styles from './index.module.scss';

export default function Drawings() {
  const [userDrawings, setUserDrawings] = useState<FileType[]>([]);
  const [lastVisible, setLastVisible] = useState<string>();
  let [i, setI] = useState(1);

  const router = useRouter();
  const { pid } = router.query;
  const loading = useCurrentUser('/');
  const data = useHookSWR();

  const maxItems = 30;

  const downloadDrawings = async () => {
    try {
      }
    } catch (e) {
      console.error(e);
      console.log('No such drawings!');
    }
  };

  useEffect(() => {
    !!pid && downloadDrawings();
  }, [pid]);

  const nextElements = async () => {
    try {
      }
      const newArray = userDrawings.concat(...nextArray);
      setUserDrawings(newArray);
      setI(++i);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <HeadCom path={router.asPath} content="Sites with drawings and photos." />

      <em className={styles.title}>
        {data?.Aside?.category}: {pid}
      </em>

      <Wrapper>
        {userDrawings.length > 0 ? (
        ) : (
          <ZeroFiles text={data?.ZeroFiles?.files} />
        )}

        {!!lastVisible && userDrawings.length === maxItems * i && <MoreButton nextElements={nextElements} />}
      </Wrapper>
    </>
  );
}
