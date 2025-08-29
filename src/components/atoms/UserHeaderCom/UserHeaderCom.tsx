'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon, Button, Input, Group, IconButton } from '@chakra-ui/react';
import { Dialog } from '@ark-ui/react/dialog';

import { createClient } from 'utils/supabase/clientCSR';

import { EventType, Tags, UserType } from 'types/global.types';

import { Avatar } from 'components/atoms/Avatar/Avatar';

import styles from './UserHeaderCom.module.scss';
import { MdOutlineGroups, MdOutlineHome } from 'react-icons/md';
import { IoCloseOutline, IoSearch } from 'react-icons/io5';

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
  ];

  const toggleSearch = () => {
    if (search) {
      setSearch(false);
    } else {
      setSearch(!search);
      !!searchInputRef.current && searchInputRef.current.focus();
    }
  };

  const toggleProfileMenu = () => showProfileMenu(!profileMenu);

  const sign__out = async () => {
    try {
      await supabase.auth.signOut();
      toggleProfileMenu();
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const searching = async () => {
    const searchArray: SearchingValues[] = [];

    const noResults = () => {
      for (let i = 0; i < searchOptions.length; ++i) {
        searchArray.push({
          categoryName: searchOptions[i],
          data: translated.notFound,
        });
      }
    };

    const addData = (
      title: number,
      d: {
        pseudonym?: string;
        profilePhoto?: string;
        description?: string;
        name?: string;
        logo?: string | null;
        shortDescription?: string | null;
        fileUrl?: string | null;
        tags?: Tags;
      },
    ) => {
      searchArray.push({
        categoryName: searchOptions[title],
        data: {
          name: d.name || d.pseudonym!,
          description: d.shortDescription || d.description!,
          fileUrl: d.logo || d.profilePhoto!,
        },
      });
    };
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id, pseudonym, profilePhoto, description')
        .textSearch('pseudonym', searchValues);

      if (!!error) searchArray.push({ categoryName: searchOptions[0], data: translated.notFound });

      if (!!data && data.length > 0) {
        for (const s of data!) addData(0, s);

        for (const du of data!) {
          const { data: da, error: err } = await supabase
            .from('Friends')
            .select('Users!friendId (pseudonym, profilePhoto, description)')
            .eq('usernameId', userData?.id!)
            .textSearch('friendId', du.id);

          if (!!err) searchArray.push({ categoryName: searchOptions[1], data: translated.notFound });

          if (!!da && da.length > 0) for (const s of da!) addData(1, s.Users);
        }
      }

      const { data: d, error: er } = await supabase
        .from('Groups')
        .select('name, logo, description')
        .textSearch('name', searchValues);

      if (!!er) searchArray.push({ categoryName: searchOptions[2], data: translated.notFound });

      if (!!d && d.length > 0) for (const s of d!) addData(2, s);

      const { data: dt, error: e } = await supabase
        .from('Files')
        .select('name, shortDescription, fileUrl, tags')
        .textSearch('fts_document', searchValues);

      if (dt) {
        for (let i = 3; i < searchOptions.length; ++i) {
          if (!!e) searchArray.push({ categoryName: searchOptions[i], data: translated.notFound });

          for (const s of dt!) addData(i, s);
        }
      }

      searchArray.length === 0 && noResults();
      setResults(searchArray);
      setOpen(true);
    } catch (e) {
      console.error(e);
      noResults();
      setOpen(true);
    }
  };

  const updateVal = (e: EventType) => setSearchValues(e.target.value);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await searching();
    }
  };

  const clearInput = () => setSearchValues('');

  return (
    <>
      <Button
        onClick={() => push('/app')}
        className={styles.menu_buttons}
        aria-label="this button redirect to groups's section">
        <MdOutlineHome className={styles.buttons} />
        <p>{headers.home}</p>
      </Button>
      <div className={styles.buttons}>
        <Button
          onClick={() => push('/groups/list')}
          colorScheme="yellow"
          className={styles.menu_buttons}
          aria-label="button for groups">
          <MdOutlineGroups className={styles.buttons} />
          <p>{headers.groups}</p>
        </Button>
        <Button
          onClick={() => push('/friends')}
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
              strokeLinejoin="round"
              className={styles.buttons}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </Icon>
          <p>{headers.friends}</p>
        </Button>
        <Button className={styles.menu_buttons} onClick={toggleSearch} aria-label="this button shows searching">
          <IoSearch className={styles.buttons} />
          <p>{headers.search}</p>
        </Button>
      </div>
      <Button colorScheme="yellow" className={styles.menu_buttons} onClick={toggleProfileMenu}>
        <Avatar fallbackName={userData?.pseudonym!} src={userData?.profilePhoto!} alt="" />
        <p>{headers.account}</p>
      </Button>

      <Group className={`${styles.search} ${search ? styles.search__active : ''}`}>
        <Input
          ref={searchInputRef}
          type="search"
          id="search"
          name="search"
          placeholder={headers.search}
          value={searchValues}
          onChange={updateVal}
          onKeyDown={handleKeyDown}
        />
        {!!searchValues && (
          <button className={styles.clearPhrase} onClick={clearInput}>
            <IoCloseOutline />
          </button>
        )}
        <span className={styles.shortcut}>Ctrl/Cmd+k</span>
        <IconButton colorScheme="pink" className={styles.rightButton} aria-label="search phrases" onClick={searching}>
          <IoSearch />
        </IconButton>
      </Group>

      <Dialog.Root
        lazyMount
        unmountOnExit
        open={open}
        onOpenChange={(e) => {
          setOpen(e.open);
          if (!e.open) {
            setSearch(false);
            setSearchValues('');
            setResults([]);
          }
        }}>
        <Dialog.Content className={styles.searching}>
          <div className={styles.closeButton}>
            <Dialog.CloseTrigger>
              <IoCloseOutline />
            </Dialog.CloseTrigger>
          </div>
          <Dialog.Title className={styles.searchValues}>
            {translated.searchResultTitle}
            {searchValues}
          </Dialog.Title>
          <Dialog.Description className={styles.searchResults}>
            {results.map((option, key) => (
              <section key={key} className={styles.dataSearching}>
                <h4 className={styles.categoryName}>{option.categoryName}</h4>
                <div className={styles.data}>
                  {typeof option.data === 'string' ? (
                    translated.notFound
                  ) : (
                    <>
                      <Avatar src={option.data.fileUrl} fallbackName={option.data.name} alt={option.data.description} />
                      <p>{option.data.name}</p>
                      <p>{option.data.description}</p>
                      {option.data.tags && <p>{option.data.tags}</p>}
                    </>
                  )}
                </div>
              </section>
            ))}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Root>
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
