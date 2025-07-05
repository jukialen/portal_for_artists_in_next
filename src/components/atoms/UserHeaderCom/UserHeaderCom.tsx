'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon, Button, Input, Group, IconButton } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogRoot } from 'components/ui/dialog';
import { Avatar } from 'components/ui/avatar';

import { createClient } from 'utils/supabase/clientCSR';

import { EventType, Tags, UserType } from 'types/global.types';

import styles from './UserHeaderCom.module.scss';
import { MdOutlineGroups, MdOutlineHome } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';

type HeadersType = {
  headers: {
    home: string;
    groups: string;
    friends: string;
    search: string;
    account: string;
    profile: string;
    title: string;
    signOut: string;
    signIn: string;
    signup: string;
  };
  userData: UserType;
  translated: {
    category: string;
    drawings: string;
    realistic: string;
    manga: string;
    anime: string;
    comics: string;
    photographs: string;
    animations: string;
    videos: string;
    others: string;
    friends: string;
    groups: string;
    notFound: string;
    searchResultTitle: string;
  };
};

export const UserHeaderCom = ({ headers, userData, translated }: HeadersType) => {
  type SearchingValues = {
    categoryName: string;
    data:
      | {
          name: string;
          description: string;
          fileUrl: string;
          tags?: Tags;
        }
      | typeof translated.notFound;
  };

  const [profileMenu, showProfileMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchingState, setSearchingState] = useState(false);
  const [searchValues, setSearchValues] = useState('');
  const { push, refresh } = useRouter();
  const [results, setResults] = useState<SearchingValues[]>([]);
  const [open, setOpen] = useState(false);

  const supabase = createClient();

  const searchOptions = [
    headers.account,
    headers.friends,
    headers.groups,
    translated.drawings,
    translated.realistic,
    translated.manga,
    translated.anime,
    translated.comics,
    translated.photographs,
    translated.animations,
    translated.videos,
    translated.others,
  ];

  const toggleSearch = () => {
    setSearch(!search);
    setSearchingState(false);
  };
  const toggleProfileMenu = () => showProfileMenu(!profileMenu);

  const sign__out = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.setItem('menu', 'false');
      toggleProfileMenu();
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const searching = async () => {
    setSearchingState(true);
    const searchArray: SearchingValues[] = [];

    try {
      const { data, error } = await supabase
        .from('Users')
        .select('pseudonym, profilePhoto, description')
        .textSearch('pseudonym', `${searchValues}`);

      if (!!error) {
        searchArray.push({ categoryName: searchOptions[0], data: translated.notFound });
      }

      for (const s of data!) {
        searchArray.push({
          categoryName: searchOptions[0],
          data: {
            name: s?.pseudonym,
            description: s.description!,
            fileUrl: s.profilePhoto!,
          },
        });
      }

      const { data: da, error: err } = await supabase
        .from('Friends')
        .select('Users (pseudonym, profilePhoto, description)')
        .eq('usernameId', userData?.id!)
        .textSearch('pseudonym', `${searchValues}`);

      if (!!err) {
        searchArray.push({ categoryName: searchOptions[1], data: translated.notFound });
      }

      for (const s of da!) {
        searchArray.push({
          categoryName: searchOptions[1],
          data: {
            name: s.Users?.pseudonym!,
            description: s.Users?.description!,
            fileUrl: s.Users?.profilePhoto!,
          },
        });
      }

      const { data: d, error: er } = await supabase
        .from('Groups')
        .select('name, logo, description')
        .textSearch('name', `${searchValues}`);

      if (!!er) searchArray.push({ categoryName: searchOptions[2], data: translated.notFound });

      for (const s of d!) {
        searchArray.push({
          categoryName: searchOptions[2],
          data: {
            name: s?.name,
            description: s.description!,
            fileUrl: s.logo!,
          },
        });
      }

      const { data: dt, error: e } = await supabase
        .from('Files')
        .select('name, shortDescription, fileUrl, tags')
        .textSearch('title', `${searchValues}`);

      for (let i = 3; i <= searchOptions.length; ++i) {
        if (!!e) searchArray.push({ categoryName: searchOptions[i], data: translated.notFound });

        for (const s of dt!) {
          searchArray.push({
            categoryName: searchOptions[i],
            data: {
              name: s.name!,
              description: s.shortDescription!,
              fileUrl: s.fileUrl,
              tags: s.tags,
            },
          });
        }
      }
      setResults(searchArray);
    } catch (e) {
      console.error(e);
      for (let i = 0; i <= searchOptions.length; ++i) {
        searchArray.push({
          categoryName: searchOptions[i],
          data: translated.notFound,
        });
      }
    }
  };

  const updateVal = async (e: EventType) => {
    setSearchValues(e.target.value);
    setOpen(true);
  };

  return (
    <>
      <Button
        colorScheme="yellow"
        onClick={() => push('/app')}
        className={styles.menu_buttons}
        aria-label="this button redirect to groups's section">
        <MdOutlineHome />
        <p>{headers.home}</p>
      </Button>
      <div className={styles.buttons}>
        <Button
          onClick={() => push('/groups/list')}
          colorScheme="yellow"
          className={styles.menu_buttons}
          aria-label="button for groups">
          <MdOutlineGroups />
          <p>{headers.groups}</p>
        </Button>
        <Button
          onClick={() => push('/friends')}
          colorScheme="yellow"
          className={styles.menu_buttons}
          aria-label="this button redirect to friends's section">
          <Icon>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </Icon>
          <p>{headers.friends}</p>
        </Button>
        <Button
          colorScheme="yellow"
          className={styles.menu_buttons}
          onClick={toggleSearch}
          aria-label="this button shows searching">
          <IoSearch />
          <p>{headers.search}</p>
        </Button>
      </div>
      <Button colorScheme="yellow" className={styles.menu_buttons} onClick={toggleProfileMenu}>
        <Avatar name={userData?.pseudonym!} src={userData?.profilePhoto!} size="sm" />
        <p>{headers.account}</p>
      </Button>

      <Group className={`${styles.search} ${search ? styles.search__active : ''}`}>
        <Input
          type="search"
          id="search"
          name="search"
          placeholder={headers.search}
          defaultValue=""
          onChange={updateVal}
        />
        <IconButton colorScheme="pink" className={styles.rightButton} aria-label="search phrases" onClick={searching}>
          <IoSearch />
        </IconButton>
      </Group>
      {!!results && searchingState && (
        <DialogRoot lazyMount open={open}>
          <DialogContent>
            <div className={styles.searching}>
              <h3 className={styles.searchValues}>
                {translated.searchResultTitle}
                {searchValues}
              </h3>
              {results.map((option, key) => (
                <section key={key} className={styles.dataSearching}>
                  <h4 className={styles.categoryName}>{option.categoryName}</h4>
                  <div className={styles.data}>
                    {typeof option.data === 'string' ? (
                      translated.notFound
                    ) : (
                      <>
                        <Avatar src={option.data.fileUrl} />
                        <p>{option.data.name}</p>
                        <p>{option.data.description}</p>
                        {option.data.tags && <p>{option.data.tags}</p>}
                      </>
                    )}
                  </div>
                </section>
              ))}
            </div>
            <DialogBody />
          </DialogContent>
        </DialogRoot>
      )}
      <ul className={`${styles.menu_profile} ${profileMenu ? styles.menu_profile__active : ''}`}>
        <li>
          <Link href={`/account/${userData?.pseudonym}`} onClick={toggleProfileMenu}>
            {headers.profile}
          </Link>
        </li>
        <li>
          <Link href={'/settings'} onClick={toggleProfileMenu}>
            {headers.title}
          </Link>
        </li>
        <li>
          <Button colorScheme="yellow" onClick={sign__out} type="submit">
            {headers.signOut}
          </Button>
        </li>
      </ul>
    </>
  );
};
