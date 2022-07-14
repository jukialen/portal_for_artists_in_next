import { Divider } from '@chakra-ui/react';

import styles from './DescriptionSection.module.scss';

type DescriptionSectionType = {
  description: string
}

export const DescriptionSection = ({ description }: DescriptionSectionType) => {
  return <section className={styles.container__description}>
    <h2 className={styles.description__title}>Description</h2>
    <Divider />
    <p className={styles.description}>{description}</p>
    <h2 className={styles.description}>Regulamin</h2>
    <Divider />
    <p className={styles.regulations__item}>
      1) Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </p>
    <p className={styles.regulations__item}>
      2) Pellentesque scelerisque tortor nec ex mattis, non consectetur sapien imperdiet. Cras sed sem
      volutpat arcu gravida mattis non commodo ligula. Curabitur sed magna in nisi rutrum iaculis. Morbi sed
      nulla et odio finibus viverra a ac leo. Quisque a enim pharetra, cursus est ut, ullamcorper nibh.
    </p>
    <p className={styles.regulations__item}>
      3) Nam auctor sem eu ipsum consequat rutrum. Phasellus vel nulla sodales, finibus felis nec, ullamcorper
      metus.
    </p>
    <p className={styles.regulations__item}>
      4) Donec ac magna ac risus egestas semper eget vel purus. Curabitur luctus sem sed maximus tincidunt.
      Nullam efficitur leo quis pretium efficitur. Ut id ex eu odio tristique elementum.
    </p>
    <p className={styles.regulations__item}>
      5) Aliquam non nisi ac nulla commodo porta. Morbi id metus eget arcu dictum sodales eu at sapien.
    </p>
    <p className={styles.regulations__item}>
      6) Praesent quis justo non dolor tincidunt convallis pellentesque sit amet libero. Sed sit amet tortor
      tempus, viverra ex et, vestibulum justo. Pellentesque quis leo sed purus accumsan commodo. Duis varius
      lorem at justo rhoncus finibus. Phasellus in tellus a lacus accumsan blandit condimentum sed dolor.
    </p>
    <p className={styles.regulations__item}>
      7) Etiam id nulla a mi molestie ultrices et et neque. Quisque id ligula nec felis facilisis imperdiet.
    </p>
    <p className={styles.regulations__item}>
      8) Curabitur mattis dolor at pellentesque lobortis. Morbi vestibulum ante tincidunt, commodo metus non,
      placerat tortor. Duis mattis urna ut felis ultrices rhoncus.
    </p>
    <p className={styles.regulations__item}>
      9) Integer vel orci rutrum, malesuada risus non, lobortis est. Duis eleifend dui in quam commodo egestas.
    </p>
    <p className={styles.regulations__item}>
      10) Praesent vehicula nisl id mauris lobortis imperdiet. In facilisis neque a libero molestie, sed
      lacinia urna aliquam. Aenean sed dolor porta, venenatis dolor et, sollicitudin ante. Etiam at nisl eget
      libero lobortis faucibus.
    </p>
  </section>
  
}