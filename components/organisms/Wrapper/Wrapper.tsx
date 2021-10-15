import { Article } from 'components/molecules/Article/Article';

import './Wrapper.module.scss';

type wrapperType = {
  idWrapper: string;
};

export const Wrapper = ({ idWrapper }: wrapperType) => {
  return (
    <div className="wrapper">
      <div id={idWrapper} className="carousel">
        <div className="content">
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
          <Article imgLink="#" imgDescription="Photo title" authorName="Z bazy" />
        </div>
      </div>

      <button className="top__left__arrow" aria-label="top left arrow" />
      <button className="top__right__arrow" aria-label="top right arrow" />
    </div>
  );
};
