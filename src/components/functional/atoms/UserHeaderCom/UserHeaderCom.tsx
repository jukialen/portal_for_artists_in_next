'use client';

import { useState } from 'react';
import type { KeyboardEvent as KeyEvent } from 'react';

import { createClient } from 'utils/supabase/clientCSR';
import { EventType, Tags, UserType } from 'types/global.types';

import { Avatar } from 'components/ui/atoms/Avatar/Avatar';

import styles from './UserHeaderCom.module.css';
import { IoCloseOutline, IoSearch } from 'react-icons/io5';

type HeadersType = {
  headers: {
    groups: string;
    friends: string;
    search: string;
    account: string;
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

  const [searchValues, setSearchValues] = useState('');
  const [results, setResults] = useState<SearchingValues[]>([]);

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

  const addData = (
    title: number,
    searchArray: SearchingValues[],
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

  const noSearchResults = (searchArray: SearchingValues[]) => {
    for (let i = 0; i < searchOptions.length; ++i) {
      searchArray.push({
        categoryName: searchOptions[i],
        data: translated.notFound,
      });
    }
  };

  const searching = async () => {
    const searchArray: SearchingValues[] = [];

    try {
      const { data, error } = await supabase
        .from('Users')
        .select('id, pseudonym, profilePhoto, description')
        .textSearch('pseudonym', searchValues);

      if (!!error) searchArray.push({ categoryName: searchOptions[0], data: translated.notFound });

      if (!!data && data.length > 0) {
        for (const s of data!) addData(0, searchArray, s);

        for (const du of data!) {
          const { data: da, error: err } = await supabase
            .from('Friends')
            .select('Users!friendId (pseudonym, profilePhoto, description)')
            .eq('usernameId', userData?.id!)
            .textSearch('friendId', du.id);

          if (!!err) searchArray.push({ categoryName: searchOptions[1], data: translated.notFound });

          if (!!da && da.length > 0) for (const s of da!) addData(1, searchArray, s.Users);
        }
      }

      const { data: d, error: er } = await supabase
        .from('Groups')
        .select('name, logo, description')
        .textSearch('name', searchValues);

      if (!!er) searchArray.push({ categoryName: searchOptions[2], data: translated.notFound });

      if (!!d && d.length > 0) for (const s of d!) addData(2, searchArray, s);

      const { data: dt, error: e } = await supabase
        .from('Files')
        .select('name, shortDescription, fileUrl, tags')
        .textSearch('fts_document', searchValues);

      if (dt) {
        for (let i = 3; i < searchOptions.length; ++i) {
          if (!!e) searchArray.push({ categoryName: searchOptions[i], data: translated.notFound });

          for (const s of dt!) addData(i, searchArray, s);
        }
      }

      searchArray.length === 0 && noSearchResults(searchArray);
      setResults(searchArray);
    } catch (e) {
      console.error(e);
      noSearchResults(searchArray);
    }
  };

  const updateVal = (e: EventType) => setSearchValues(e.currentTarget.value);

  const handleKeyDown = async (e: KeyEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await searching();
    }
  };

  return (
    <>
      <div className={styles.search} id='user-header-search' popover='auto'>
        <input
          type="search"
          id="search"
          name="search"
          placeholder={headers.search}
          value={searchValues}
          onChange={updateVal}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <span className={styles.shortcut}>Ctrl/Cmd+k</span>
        <button
          className={styles.rightButton}
          aria-label="search phrases"
          onClick={searching}
          popoverTarget="user-header-search-results"
          popoverTargetAction="show">
          <IoSearch />
        </button>
      </div>

      <div className={styles.searching} id='user-header-search-results' popover='auto'>
        <button
          className={styles.closeButton}
          popoverTarget='user-header-search'
          popoverTargetAction='hide'
          aria-label="close search">
          <IoCloseOutline />
        </button>
        <div className={styles.searchValues}>
          {translated.searchResultTitle}
          {searchValues}
        </div>
        <div className={styles.searchResults}>
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
        </div>
      </div>
    </>
  );
};

