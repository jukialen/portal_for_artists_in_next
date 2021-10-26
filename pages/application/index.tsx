import { useRouter } from "next/router";
import { useEffect } from "react";

import { Wrapper } from "components/organisms/Wrapper/Wrapper";

import styles from './index.module.scss';

export default function Application() {
    const router = useRouter();
    let user;

    useEffect(() => {
        user = localStorage.getItem('user');
        !user && router.push('/');
    }, [user]);

    return (
    <section className="workspace">
        <h2 className={styles.top__among__users}>TOP10 według użytkowników</h2>
        <Wrapper idWrapper="carouselTop"/>
        <h2 className={styles.liked}>Ostatnie 10 polubionych</h2>
        <Wrapper idWrapper="carouselLiked"/>
    </section>
    )
};