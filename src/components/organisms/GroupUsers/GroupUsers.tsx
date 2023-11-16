'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Divider } from '@chakra-ui/react';

import { backUrl, cloudFrontUrl } from 'constants/links';



import { Links } from 'components/atoms/Links/Links';
import { MoreButton } from 'components/atoms/MoreButton/MoreButton';
import { Tile } from 'components/atoms/Tile/Tile';

import styles from './GroupUsers.module.scss';

type GroupUsersType = {
  id: string;
};

type GroupUserType = {
  name: string;
  logo: string;
  groupId: string;
};

export const GroupUsers = ({ id }: GroupUsersType) => {
  const [adminsArray, setAdminsArray] = useState<GroupUserType[]>([]);
  const [lastAdminsVisible, setAdminsLastVisible] = useState<string>();
  let [iAdmins, setIAdmins] = useState(1);
  const [moderatorsArray, setModeratorsArray] = useState<GroupUserType[]>([]);
  const [lastModeratorsVisible, setModeratorsLastVisible] = useState<string>();
  let [iModerators, setIModerators] = useState(1);
  const [membersArray, setMembersArray] = useState<GroupUserType[]>([]);
  const [lastMembersVisible, setMembersLastVisible] = useState<string>();
  let [iMembers, setIMembers] = useState(1);


  const maxItems = 30;

  const firstAdminList = async () => {
    try {
      const groupList: { data: GroupUserType[] } = await axios.get(`${backUrl}/groups/my-groups/ADMIN`, {
        params: {
          queryData: {
            limit: maxItems,
          },
        },
      });

      const adminArray: GroupUserType[] = [];

      for (const _group of groupList.data) {
        adminArray.push({
          name: _group.name,
          logo: !!_group.logo ? `https://${cloudFrontUrl}/${_group.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          groupId: _group.groupId,
        });
      }

      setAdminsArray(adminArray);
      adminArray.length === maxItems && setAdminsLastVisible(adminArray[adminArray.length - 1].name);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstAdminList();
  }, [id]);

  const firstModeratorsList = async () => {
    try {
      const groupList: { data: GroupUserType[] } = await axios.get(`${backUrl}/my-groups/MODERATOR`, {
        params: {
          queryData: {
            limit: maxItems,
          },
        },
      });

      const moderatorArray: GroupUserType[] = [];

      for (const _g of groupList.data) {
        moderatorArray.push({
          name: _g.name,
          logo: !!_g.logo ? `https://${cloudFrontUrl}/${_g.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          groupId: _g.groupId,
        });
      }

      setModeratorsArray(moderatorArray);
      moderatorArray.length === maxItems && setModeratorsLastVisible(moderatorArray[moderatorArray.length - 1].groupId);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstModeratorsList();
  }, [id]);

  const firstMembersList = async () => {
    try {
      const groupList: { data: GroupUserType[] } = await axios.get(`${backUrl}/my-groups/USER`, {
        params: {
          queryData: {
            limit: maxItems,
          },
        },
      });

      const memberArray: GroupUserType[] = [];

      for (const _g of groupList.data) {
        memberArray.push({
          name: _g.name,
          logo: !!_g.logo ? `https://${cloudFrontUrl}/${_g.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          groupId: _g.groupId,
        });
      }

      setMembersArray(memberArray);
      memberArray.length === maxItems && setMembersLastVisible(memberArray[memberArray.length - 1].groupId);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!id && firstMembersList();
  }, [id]);

  const nextAdminList = async () => {
    try {
      const groupList: { data: GroupUserType[] } = await axios.get(`${backUrl}/my-groups/ADMIN`, {
        params: {
          queryData: {
            limit: maxItems,
            cursor: lastAdminsVisible,
          },
        },
      });

      const nextAdminArray: GroupUserType[] = [];

      for (const _g of groupList.data) {
        nextAdminArray.push({
          name: _g.name,
          logo: !!_g.logo ? `https://${cloudFrontUrl}/${_g.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          groupId: _g.groupId,
        });
      }

      const nextArray = adminsArray.concat(...nextAdminArray);
      setAdminsArray(nextArray);
      setAdminsLastVisible(nextArray[nextArray.length - 1].groupId);
      setIAdmins(iAdmins++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextModeratorsList = async () => {
    try {
      const groupList: { data: GroupUserType[] } = await axios.get(`${backUrl}/my-groups/MODERATOR`, {
        params: {
          queryData: {
            limit: maxItems,
            cursor: lastModeratorsVisible,
          },
        },
      });

      const nextModeratorArray: GroupUserType[] = [];

      for (const _g of groupList.data) {
        nextModeratorArray.push({
          name: _g.name,
          logo: !!_g.logo ? `https://${cloudFrontUrl}/${_g.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          groupId: _g.groupId,
        });
      }

      const nextArray = moderatorsArray.concat(...nextModeratorArray);

      setModeratorsArray(nextArray);
      setModeratorsLastVisible(nextArray[nextArray.length - 1].groupId);
      setIModerators(iModerators++);
    } catch (e) {
      console.error(e);
    }
  };

  const nextMembersList = async () => {
    try {
      const groupList: { data: GroupUserType[] } = await axios.get(`${backUrl}/my-groups/USER`, {
        params: {
          queryData: {
            limit: maxItems,
            cursor: lastMembersVisible,
          },
        },
      });

      const nextMemberArray: GroupUserType[] = [];

      for (const _g of groupList.data) {
        nextMemberArray.push({
          name: _g.name,
          logo: !!_g.logo ? `https://${cloudFrontUrl}/${_g.logo}` : `${process.env.NEXT_PUBLIC_PAGE}/group.svg`,
          groupId: _g.groupId,
        });
      }

      const nextArray = membersArray.concat(...nextMemberArray);
      setMembersArray(nextArray);
      setModeratorsLastVisible(nextArray[nextArray.length - 1].groupId);
      setIMembers(iMembers++);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.tilesSection}>
      <section className={styles.sectionTitleNewGroup}>
        <h2>{language?.Nav?.groups}</h2>
        <Links
          hrefLink="/adding_group"
          classLink={`${styles.sectionTitleNewGroup__button} button`}
          aria-label={language?.Aside?.addingGroup}>
          {language?.Aside?.addingGroup}
        </Links>
      </section>

      <h2 className={styles.title}>{language?.Account?.groups?.adminTitle}</h2>
      <Divider className={styles.divider} />
      {adminsArray.length > 0 ? (
        adminsArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name} link={`/groups/${name}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{language?.Account?.groups?.noAdmin}</p>
      )}
      {!!lastAdminsVisible && adminsArray.length === maxItems * iAdmins && <MoreButton nextElements={nextAdminList} />}
      <h2 className={styles.title}>{language?.Account?.groups?.modsTitle}</h2>
      <Divider className={styles.divider} />
      {moderatorsArray.length > 0 ? (
        moderatorsArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name} link={`/groups/${name}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{language?.Account?.groups?.noMods}</p>
      )}
      {!!lastModeratorsVisible && moderatorsArray.length == maxItems * iModerators && (
        <MoreButton nextElements={nextModeratorsList} />
      )}
      <h2 className={styles.title}>{language?.Account?.groups?.usersTitle}</h2>
      <Divider className={styles.divider} />
      {membersArray.length > 0 ? (
        membersArray.map(({ name, logo }, index) => (
          <Tile key={index} name={name} link={`/groups/${name}`} fileUrl={logo} />
        ))
      ) : (
        <p className={styles.noGroups}>{language?.Account?.groups?.noUsers}</p>
      )}
      {!!lastMembersVisible && membersArray.length === maxItems * iMembers && (
        <MoreButton nextElements={nextMembersList} />
      )}
    </div>
  );
};