import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../../firebase';
import { getDoc } from 'firebase/firestore';

import { likePost, user } from 'config/referencesFirebase';

import { getDate } from 'helpers/getDate';

import { Post } from 'components/molecules/Post/Post';

export default function PostFromGroup() {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [liked, setLiked] = useState<string[]>([]);
  const [likes, setLikes] = useState(0);
  const [logoUser, setLogoUser] = useState('');

  const { locale, asPath } = useRouter();
  const currentUser = auth.currentUser?.uid;

  const split = asPath.split('/');
  const name = decodeURIComponent(split[2]);
  const author = decodeURIComponent(split[3]);
  const idPost = decodeURIComponent(split[4]);

  const downloadPosts = async () => {
    try {
      const docSnap = await getDoc(likePost(name!, idPost));

      if (docSnap.exists()) {
        setUserId(docSnap.data().author);
        setTitle(docSnap.data().title);
        setDate(getDate(locale!, docSnap.data().date));
        setDescription(docSnap.data().message);
        setLiked(docSnap.data().liked);
        setLikes(docSnap.data().likes);

        const logo = await getDoc(user(docSnap.data().author));

        if (logo.exists()) {
          setLogoUser(logo.data().profilePhoto);
        } else {
          console.log('No profile photo');
        }
      } else {
        console.log('No such document!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    !!(name && idPost) && downloadPosts();
  }, [locale]);

  return (
    <Post
      pseudonym={author}
      title={title}
      date={date}
      content={description}
      nameGroup={name}
      idPost={idPost}
      authorId={currentUser}
      userId={userId}
      likes={likes}
      liked={liked}
      profilePhoto={logoUser}
    />
  );
}
