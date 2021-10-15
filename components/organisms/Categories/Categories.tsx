import { useState } from 'react';

import { Links } from 'components/atoms/Links/Links';

import './Categories.module.scss';

export const Categories = () => {
  const [openSubCategories, setOpenCategories] = useState(false);

  const changeOpenCategories = () => setOpenCategories(!openSubCategories);

  return (
    <ol className="categories">
      <li>
        <Links hrefLink="#" title="Wszystko" />
      </li>

      <li onClick={changeOpenCategories}>
        <Links hrefLink="#" title="Rysunki" />
        <ol className={openSubCategories ? '' : 'hiddenElement'}>
          <li>
            <Links hrefLink="#" title="Realistyczne" />
          </li>
          <li>
            <Links hrefLink="#" title="Manga" />
          </li>
          <li>
            <Links hrefLink="#" title="Anime" />
          </li>
          <li>
            <Links hrefLink="#" title="Komiksy" />
          </li>
        </ol>
      </li>

      <li>
        <Links hrefLink="#" title="Fotografie" />
      </li>
      <li>
        <Links hrefLink="#" title="Animacje" />
      </li>
      <li>
        <Links hrefLink="#" title="Inne" />
      </li>
    </ol>
  );
};
