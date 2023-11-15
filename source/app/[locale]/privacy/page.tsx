import { Metadata } from 'next';
import { setStaticParamsLocale } from 'next-international/server';

import { HeadCom } from 'source/constants/HeadCom';

import { getI18n } from 'source/locales/server';

import styles from './page.module.scss';

export const metadata: Metadata = HeadCom('Site with informations about privacy policy.');

export default async function Privacy({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

  const t = await getI18n();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('Footer.privacyPolice')}</h2>

      <p className={styles.param}>
        1) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque condimentum facilisis dui, ut elementum urna
        efficitur ut. Integer euismod molestie felis. Suspendisse potenti. Quisque eu ornare urna, sit amet condimentum
        massa. Fusce auctor lacinia leo, ut tincidunt dui ullamcorper eu. Aenean accumsan nibh a dapibus accumsan. Morbi
        pellentesque id tortor non lacinia. Maecenas a magna lectus. Praesent aliquet orci sit amet tellus consequat, at
        tristique dui volutpat. Etiam facilisis sapien at facilisis gravida. Curabitur porta, lacus nec malesuada
        faucibus, ex tortor rutrum dui, in aliquet orci orci a nisi.
      </p>

      <p className={styles.param}>
        2) Donec tincidunt eu turpis et porttitor. Nunc eros metus, convallis eu vestibulum non, euismod ac tortor.
        Maecenas eget elementum tortor, eget pulvinar ipsum. Cras eget tellus sed orci sagittis rutrum nec in lectus.
        Vestibulum auctor enim sed mauris placerat finibus. Cras dolor massa, tincidunt sed tellus in, efficitur
        vehicula lorem. Integer et mauris quis nisi hendrerit hendrerit at ac turpis.
      </p>

      <p className={styles.param}>
        3) Pellentesque erat arcu, semper eget fermentum et, rhoncus quis magna. Nunc suscipit sapien ac tellus
        efficitur, nec ultricies libero vulputate. Aliquam sodales facilisis nisi, non rhoncus sem laoreet in. Donec
        maximus elit quis nunc volutpat, sed imperdiet nunc tincidunt. Quisque rutrum urna vel sollicitudin sagittis.
        Mauris facilisis laoreet tempor. Donec eget varius eros.
      </p>

      <p className={styles.param}>
        4) Pellentesque ac massa at ante mattis condimentum nec a enim. Vestibulum mollis, mauris ac gravida mattis,
        risus massa mollis felis, et commodo erat nibh id tellus. Nunc quam ante, mollis id mi sit amet, aliquam
        vulputate magna. Vivamus pharetra quis mi at egestas. Aliquam nisl dui, pulvinar ut molestie ac, molestie vel
        nibh. Etiam ac felis sodales, varius dolor ac, efficitur augue. Ut elementum dolor eget augue vehicula, et
        lobortis urna placerat. Suspendisse hendrerit ligula cursus ante dignissim varius. Sed et nulla ultricies,
        lacinia dolor nec, blandit diam.
      </p>

      <p className={styles.param}>
        5) Etiam et tempus sem. Sed non quam non diam feugiat vestibulum. Vivamus sit amet euismod ipsum, sollicitudin
        vehicula nibh. Integer ultrices laoreet diam. Donec eget consectetur sapien. Ut efficitur, nisi et malesuada
        condimentum, diam orci facilisis lorem, id tincidunt leo velit vitae nisi. Suspendisse maximus ultricies enim eu
        pharetra. Duis rutrum molestie arcu ac lacinia. Mauris rutrum hendrerit augue a condimentum. Nulla at ligula
        odio. Vivamus molestie, leo sed efficitur mollis, tortor ante imperdiet urna, in lacinia nulla nulla vitae
        sapien. Suspendisse faucibus urna non nisl elementum accumsan vel nec purus.
      </p>

      <p className={styles.param}>
        6) Fusce ut nibh tortor. Nullam arcu mauris, consectetur vel augue maximus, dapibus congue dui. Ut bibendum
        augue at gravida vehicula. Sed tempus nunc risus, eu eleifend nunc pulvinar ac. Suspendisse eu purus et massa
        euismod volutpat. Morbi pretium, arcu et rhoncus suscipit, nunc erat feugiat lacus, consequat blandit mauris
        lacus a tellus. Sed eget sollicitudin orci, eget mattis justo.
      </p>

      <p className={styles.param}>
        7) Proin id lorem nulla. Aliquam orci metus, gravida non augue eget, fermentum laoreet turpis. Praesent id
        turpis sed erat dignissim convallis. Praesent elementum sem ac diam laoreet cursus. Aenean non ante aliquam,
        dignissim eros eget, gravida elit. Vestibulum maximus imperdiet nulla et aliquet. Integer varius ornare quam, id
        laoreet est interdum sit amet. Fusce faucibus auctor nibh, lacinia pharetra elit efficitur ut. Nunc quam tortor,
        molestie at luctus aliquet, volutpat at enim. Nam fringilla elementum orci, eget tristique massa. Etiam commodo
        varius velit, ut imperdiet justo viverra a. Sed sed mi nec metus facilisis maximus. Praesent vitae nibh sit amet
        lacus tempus elementum vel vitae orci. Nam dolor sem, faucibus egestas purus sit amet, maximus vehicula eros.
        Aliquam erat volutpat. Pellentesque mollis in risus a molestie.
      </p>

      <p className={styles.param}>
        8) Nullam nunc dolor, scelerisque eget placerat eu, porta nec tortor. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Fusce eget ultricies velit. Etiam cursus pretium justo, at accumsan nulla. Praesent venenatis
        feugiat leo, luctus venenatis diam viverra in. Proin enim sem, vehicula et massa at, tincidunt maximus magna.
        Curabitur mattis fringilla velit, sed consequat purus eleifend quis. Donec faucibus diam vel felis pretium
        aliquam. Ut purus libero, viverra ut eros eget, laoreet tincidunt nibh. Aenean gravida urna nisl, iaculis
        sollicitudin nisi placerat sit amet. Quisque gravida mattis ante, eget eleifend lorem ullamcorper id. Quisque
        nec mi scelerisque, interdum augue non, mattis magna. Phasellus et sagittis massa, vel malesuada purus. Cras
        finibus a enim ac ullamcorper. Etiam condimentum elit quis aliquet sodales. Integer mauris massa, vehicula id
        congue vitae, venenatis id eros.
      </p>

      <p className={styles.param}>
        9) In lectus dui, convallis fermentum orci sed, tincidunt viverra ipsum. Nam odio libero, ultrices vitae erat
        id, convallis imperdiet nibh. Suspendisse quis magna bibendum, semper ante nec, feugiat mi. Sed pharetra
        sagittis nisi, sed laoreet justo fringilla vitae. Fusce quam nibh, porta eu elit vel, tincidunt porta dolor. Sed
        imperdiet turpis non enim tincidunt sagittis. Maecenas volutpat, diam at venenatis sagittis, est leo iaculis
        libero, nec vestibulum ante erat eu mi.
      </p>

      <p className={styles.param}>
        10) Nam eleifend ipsum est, ac pretium dolor laoreet nec. Etiam commodo ligula nec odio lacinia Phasellus et
        placerat quam, nec luctus neque. Donec et semper magna. Donec ullamcorperneque vel enim faucibus scelerisque.
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Class aptent
        taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque ullamcorper lorem
        tristique dui tristique, sit amet mattis diam aliquam. Vivamus in sem id purus blandit vestibulum.
      </p>

      <p className={styles.param}>
        11) Quisque at mi risus. Pellentesque quis laoreet odio, eu facilisis nisl. Nullam consequat condimentum urna et
        congue. Curabitur nec enim pulvinar, luctus sapien eu, tempor leo. Donec et laoreet felis. Sed vel ligula
        tempor, tristique lorem a, lobortis lorem. Sed iaculis interdum ex, sed ultrices sem. Mauris dictum iaculis diam
        quis luctus. Vestibulum tempus massa sit amet enim mattis rhoncus. Nullam at magna eget felis consectetur luctus
        eget at sem. Curabitur faucibus est id mollis vulputate. Cras augue est, dignissim nec faucibus non, tempus non
        odio. Maecenas vitae volutpat libero, euismod consectetur metus. Donec augue ex, posuere ut pharetra non, tempus
        sollicitudin libero. Nunc nec finibus sem. Phasellus at lacus eu enim condimentum commodo nec tincidunt urna.
      </p>

      <p className={styles.param}>
        12) Aenean id erat sed mi dapibus tincidunt. Fusce vel arcu erat. Quisque nec lacinia sapien. Aenean eleifend
        egestas fermentum. Phasellus commodo convallis lorem. Cras pretium scelerisque leo ultrices viverra. Duis
        tincidunt hendrerit odio, ac blandit leo auctor vel. Quisque ac egestas nisl. Proin quis augue id lectus finibus
        efficitur. Duis quis aliquet sem, at varius lacus. Aliquam pulvinar enim eu erat tempor ornare. Donec metus
        sapien, tempor vel finibus et, egestas ut augue.
      </p>

      <p className={styles.param}>
        13) Curabitur lobortis fermentum ante, et pharetra metus. Morbi quis nibh tortor. Aliquam ullamcorper convallis
        sapien, eget molestie metus mollis quis. Aliquam ut ipsum vitae sapien facilisis feugiat. Nunc eros nunc, dictum
        ac nisi ut, varius mattis nibh. Sed in arcu in nulla ultricies tempor in eu libero. Aenean eget sem quis velit
        rutrum malesuada. Vestibulum justo sapien, fermentum sed elit ac, laoreet dapibus nibh. Interdum et malesuada
        fames ac ante ipsum primis in faucibus. Nunc quis nisi at tellus dictum tristique. Integer leo sem, ornare ut
        sodales ac, sagittis et tellus.
      </p>

      <p className={styles.param}>
        14) Etiam vel convallis nunc. Nam congue non nulla sed tempus. Nam imperdiet libero sit amet diam maximus, at
        pretium mi semper. Integer sodales lacus scelerisque, fringilla tellus id, facilisis justo. Donec fringilla,
        purus tempus auctor placerat, felis quam rutrum libero, ac posuere justo odio luctus metus. Aenean ultrices
        justo non augue fermentum, a aliquam dolor tincidunt. In varius at turpis non sagittis. Nunc mollis vel ante id
        congue. Curabitur efficitur orci sed risus vestibulum scelerisque.
      </p>

      <p className={styles.param}>
        15) Praesent sit amet tempus purus. Nulla nec enim in lacus pharetra congue. Maecenas faucibus odio sit amet
        tincidunt eleifend. Nullam ut facilisis quam. Nam imperdiet mi finibus velit vulputate, sit amet fringilla
        sapien auctor. Vestibulum rutrum lacinia pulvinar. Sed ipsum nunc, bibendum vitae elementum id, pellentesque et
        nunc. Praesent enim dui, molestie eget sagittis id, dapibus in arcu. Nullam aliquet, erat id pellentesque
        suscipit, dolor mauris accumsan nisl, at lobortis libero nisl ac odio. Aenean sodales semper lacus, a varius
        ligula ullamcorper id. Suspendisse erat massa, venenatis eget ipsum sed, ullamcorper fermentum sapien.
        Suspendisse faucibus nisi at pellentesque luctus. Suspendisse dignissim ullamcorper metus, sed vehicula risus.
      </p>

      <p className={styles.param}>
        16) Donec ornare libero non ipsum imperdiet viverra. Donec commodo pulvinar felis ac vulputate. Aenean nec
        placerat odio. Ut accumsan urna euismod erat tincidunt sollicitudin. Morbi vel aliquet odio. Vestibulum in
        gravida nulla. Cras id turpis at massa venenatis rhoncus at nec orci. Phasellus eleifend, erat in maximus
        faucibus, magna dolor interdum sapien, malesuada varius orci lectus eu diam. Quisque gravida molestie massa, sit
        amet suscipit massa ultrices vitae. Sed porttitor facilisis accumsan. In luctus, tortor et bibendum malesuada,
        erat dui fringilla enim, in ultricies risus mi interdum magna. Integer augue dolor, pulvinar accumsan sagittis
        quis, ornare at metus. Nunc non arcu placerat, elementum metus nec, bibendum mi. Praesent lobortis sagittis
        libero, sit amet dignissim eros mollis ut. Vestibulum venenatis, quam vitae pharetra pellentesque, libero diam
        commodo tellus, et euismod felis nibh non justo. Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas.
      </p>

      <p className={styles.param}>
        17) Morbi non suscipit neque. Pellentesque vehicula vulputate felis et ultrices. Nulla nec sollicitudin elit.
        Sed neque lacus, vestibulum ac mi a, scelerisque placerat felis. Proin viverra turpis vitae pretium luctus.
        Donec luctus, felis sit amet tincidunt tempor, ante sem consequat lacus, maximus finibus ipsum turpis a sem.
        Vestibulum enim elit, pulvinar a placerat sit amet, euismod vel leo. Nam sodales nisl massa, eu fermentum felis
        condimentum at. Integer volutpat massa et efficitur gravida. Nulla ac felis sed nisl efficitur semper sit amet
        in magna. Suspendisse commodo aliquet metus ut pharetra. Sed sodales nulla et interdum sagittis. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec ut lorem eget urna
        finibus pretium.
      </p>

      <p className={styles.param}>
        18) Sed lobortis eu sapien a iaculis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
        ridiculus mus. Duis ultrices metus dolor, sed eleifend ante pretium nec. Pellentesque vulputate porta nunc, et
        faucibus mi volutpat a. Ut finibus faucibus nisl id vulputate. Proin tincidunt interdum odio, id ornare erat
        placerat nec. Morbi in eros sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
        turpis egestas. Nunc finibus consequat sodales. Maecenas risus est, pretium non nunc et, elementum euismod nisi.
        Mauris ac lacus libero. In tempus eros eu suscipit blandit. Duis vel lorem justo.
      </p>

      <p className={styles.param}>
        19) Integer sit amet tristique odio, eu aliquet ipsum. Morbi scelerisque neque sit amet purus vehicula pretium.
        Morbi felis libero, elementum quis ante in, commodo molestie leo. Ut sit amet justo id erat interdum euismod.
        Suspendisse vel risus vitae mauris pellentesque finibus ac nec neque. Quisque at velit semper sem suscipit
        ultricies. Praesent tincidunt posuere vulputate. Sed mauris ex, pharetra in mollis ut, faucibus ut magna. Cras
        pulvinar nulla dapibus, luctus mauris sit amet, egestas justo. Pellentesque hendrerit leo nec urna pellentesque
        dictum. Donec et mauris at ipsum blandit vehicula pellentesque vel lectus.
      </p>

      <p className={styles.param}>
        20) Interdum et malesuada fames ac ante ipsum primis in faucibus. Nulla facilisi. Suspendisse nec pharetra nunc.
        Pellentesque eu dui facilisis, elementum augue a, ultrices est. Quisque pulvinar viverra volutpat. Fusce vitae
        faucibus eros, id posuere quam. In at maximus neque, nec commodo libero. Integer mattis orci id eros vulputate
        pretium. Sed imperdiet vitae neque eu malesuada.
      </p>

      <p className={styles.param}>
        21) Curabitur mattis libero non pharetra laoreet. Vestibulum volutpat dui eros, sed posuere erat sodales non.
        Aliquam at eros suscipit, interdum orci convallis, aliquam dolor. In fermentum, urna gravida tincidunt aliquam,
        metus lectus faucibus elit, et luctus lectus felis in velit. In vehicula ac nulla vel varius. In rutrum faucibus
        tellus vel cursus. Aliquam iaculis, velit non tincidunt scelerisque, quam eros sollicitudin dui, eu condimentum
        velit metus non diam. Sed maximus mauris eget porta euismod. Pellentesque rutrum enim felis, et tempor velit
        pharetra et. Nullam consectetur porta urna, a ultrices felis tempor quis. Proin vitae mattis nisl. Mauris
        aliquam nisl non malesuada aliquet.
      </p>

      <p className={styles.param}>
        22) Suspendisse ullamcorper, mi nec aliquam consectetur, nulla augue mollis tellus, vel aliquet mauris quam in
        urna. Etiam turpis lacus, tempus eget ex eu, congue accumsan lectus. Sed nec dignissim nisi, vitae aliquet nunc.
        Sed sodales diam in pharetra tincidunt. Vestibulum suscipit quam tortor, et dictum sapien ultrices porttitor.
        Fusce porttitor purus eu ligula tempus eleifend. Nunc luctus est velit, vitae finibus massa tincidunt a.
      </p>

      <p className={styles.param}>
        23) Sed dui tortor, blandit eu dui et, commodo lobortis est. In in gravida ex, lacinia congue erat. Aliquam
        ornare justo eu nisl facilisis, ut tempor lorem lacinia. Vivamus vulputate commodo neque. Aenean turpis dui,
        fermentum sit amet condimentum vitae, dignissim vel neque. In porta pharetra magna, ac semper sem laoreet ac.
        Phasellus facilisis purus in fringilla elementum. Praesent aliquam fringilla elit, nec facilisis urna interdum
        et.
      </p>

      <p className={styles.param}>
        24) Phasellus vel arcu pharetra, pulvinar massa non, pretium odio. Vivamus condimentum justo fringilla orci
        pulvinar volutpat. Etiam placerat neque in tellus congue, varius ultrices tellus sodales. Sed porttitor
        fermentum urna. Donec pharetra dapibus malesuada. Morbi tempus elit nec faucibus iaculis. Maecenas vel mauris
        ipsum. Etiam id risus semper, faucibus sapien id, laoreet erat.
      </p>

      <p className={styles.param}>
        25) Nulla est lectus, pellentesque nec velit ac, maximus posuere enim. In auctor viverra ex. Fusce sodales
        cursus nisl in vestibulum. Donec at ornare tortor. Etiam porta quam nunc, eu bibendum ligula euismod non.
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed placerat erat vel
        nibh ullamcorper mollis. Maecenas fermentum turpis a nibh suscipit varius. Vestibulum volutpat consectetur
        lacus, quis lobortis nisi dapibus at. Vivamus at purus ac mi euismod interdum. Curabitur sollicitudin suscipit
        placerat. Donec sed nisi et purus imperdiet congue. Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Suspendisse rutrum aliquet tortor, vel porta risus feugiat eget. Praesent
        viverra orci vitae turpis aliquet, sed interdum velit ornare.
      </p>

      <p className={styles.param}>
        26) Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras est ante, malesuada eu risus at,
        hendrerit tincidunt sem. Sed eget ultricies massa. Maecenas libero odio, ullamcorper non pharetra bibendum,
        vulputate eu augue. Donec placerat volutpat diam, sed molestie est suscipit in. Sed at condimentum nisl. Morbi
        non ligula ut erat mollis dapibus sed vel nulla. Maecenas porta quam eu sem commodo volutpat.
      </p>

      <p className={styles.param}>
        27) Curabitur sollicitudin mauris at quam suscipit, vel pharetra leo efficitur. Phasellus porttitor lorem neque,
        ac hendrerit enim pellentesque a. Suspendisse in finibus erat. Praesent eu vestibulum purus, sit amet congue
        tellus. Aenean lobortis est ultricies velit laoreet accumsan ac eu risus. Mauris in nisi vitae ante maximus
        feugiat eu scelerisque est. Proin eu erat eu nibh facilisis vulputate nec et tortor. Suspendisse at tortor quis
        magna suscipit suscipit vitae ac lacus.
      </p>

      <p className={styles.param}>
        28) Aliquam aliquam felis eu mi efficitur, id sagittis mauris egestas. Duis efficitur, mauris nec malesuada
        ullamcorper, orci lacus venenatis est, ac sollicitudin purus diam quis eros. Curabitur ultricies lacus neque,
        sed scelerisque risus vestibulum id. Mauris hendrerit lorem est, id volutpat metus rutrum at. Pellentesque
        mattis aliquet justo in faucibus. Nulla elementum neque enim, a molestie leo fringilla ullamcorper. Morbi semper
        magna nunc, at consequat ligula euismod sit amet. Donec lectus massa, aliquet ac odio in, condimentum vulputate
        leo. Fusce cursus porta nunc id hendrerit. Nam eget est nulla. In vel orci quam.
      </p>

      <p className={styles.param}>
        29) Vestibulum pharetra eleifend fermentum. Nunc et sapien in sem gravida laoreet vitae ut justo. Sed aliquam
        fringilla augue sit amet egestas. Donec condimentum dui eget odio hendrerit, id dictum ligula porta. Proin eget
        arcu massa. Pellentesque consequat pellentesque risus sed varius. Vestibulum eget ligula lacinia, molestie odio
        sit amet, luctus metus. Nullam sed libero arcu.
      </p>

      <p className={styles.param}>
        30) Sed ut auctor purus, eget tincidunt orci. Fusce imperdiet metus sit amet tortor commodo hendrerit. Nam a
        ante velit. Proin mattis dolor nec faucibus rutrum. Cras quis nisi condimentum, tempus nulla ut, efficitur dui.
        Nam posuere magna at tempus lobortis. Nulla sit amet vestibulum urna. Morbi ornare neque sed nulla elementum,
        sed dictum purus dictum. Nunc sit amet varius nibh.
      </p>

      <p className={styles.param}>
        31) Maecenas quis vehicula ex. Sed diam lacus, fringilla vel dolor sit amet, ullamcorper hendrerit dolor. Fusce
        tempor ante semper luctus fermentum. Mauris tincidunt luctus quam, a aliquet libero lacinia non. Sed ut augue
        consectetur, ultricies risus ac, semper elit. Proin at nunc vel ante tempor dapibus id vel erat. In eget
        vulputate turpis. Aliquam vulputate sapien et nisi euismod, congue maximus massa luctus. Nulla augue arcu,
        viverra at mollis auctor, vehicula ut orci.
      </p>

      <p className={styles.param}>
        32) Mauris felis magna, dignissim ut ultrices non, cursus at quam. Pellentesque a iaculis nisl. Phasellus vitae
        tellus id est maximus euismod sed eget ante. Nullam nec libero in urna facilisis fermentum vitae id elit. In
        aliquet laoreet orci, et ultricies nunc venenatis aliquam. Phasellus ultrices purus et ipsum lacinia ultrices.
        Nunc convallis luctus felis ut suscipit. Proin ullamcorper ante urna. Duis convallis magna consectetur, aliquam
        erat at, consequat arcu. Ut ipsum justo, tincidunt sed dolor sit amet, consequat imperdiet tortor. Cras volutpat
        dictum enim sit amet placerat. Aliquam ante lorem, aliquam eu ipsum vitae, tincidunt rhoncus eros. Fusce lacus
        neque, auctor id semper ac, blandit eu justo. Phasellus in aliquet ligula. Praesent efficitur eros sed nisi
        dignissim, vel pharetra libero molestie.
      </p>

      <p className={styles.param}>
        33) Pellentesque sed nibh bibendum, convallis leo sed, sagittis nunc. Duis tincidunt diam quam, id semper lacus
        pulvinar id. Duis tristique egestas facilisis. Proin tempus metus ut risus faucibus fermentum. Maecenas at
        pretium dui. Nunc non dignissim erat. Mauris risus arcu, vestibulum rutrum rutrum sed, sollicitudin ac ante.
      </p>

      <p className={styles.param}>
        34) Praesent vitae est vitae mauris vestibulum mattis non vel dui. Mauris eleifend suscipit quam, quis consequat
        arcu condimentum ut. Vivamus pellentesque maximus turpis id sagittis. Vestibulum porta scelerisque dolor, at
        ultrices arcu porta quis. Nunc hendrerit rutrum luctus. Aliquam ut scelerisque mauris. Curabitur efficitur diam
        sed elit eleifend maximus. Nunc non tempor purus. Maecenas id dui eget lectus tincidunt semper at a dui. Etiam a
        turpis diam. Morbi laoreet bibendum magna, non finibus nibh pellentesque vitae. Pellentesque lacinia hendrerit
        tellus quis vehicula. Vivamus risus dolor, volutpat lacinia cursus quis, luctus vitae est.
      </p>

      <p className={styles.param}>
        35) Etiam sed massa nec metus auctor iaculis. In malesuada mauris sit amet pharetra dapibus. Cras eget nulla
        scelerisque ipsum volutpat aliquet. Donec quis elit finibus, maximus est id, accumsan felis. Donec tristique
        vulputate lectus, vel feugiat enim facilisis non. Cras imperdiet leo lorem, ut blandit neque finibus eu. Proin
        vestibulum finibus eros et consectetur. Sed eget tellus in velit tincidunt sollicitudin. Donec varius ex in
        egestas tincidunt. Etiam vitae tempor nisi, sedultrices nisi. Phasellus massa odio, posuere sed arcu in,
        eleifend bibendum tortor. Pellentesque ornare semper justo, a ullamcorper tortor laoreet quis. Ut vestibulum
        feugiat libero, ut rutrum mauris gravida eleifend.
      </p>

      <p className={styles.param}>
        36) Nulla ipsum nulla, consectetur eu sem vitae, dignissim condimentum velit. Proin vitae quam in nunc vehicula
        scelerisque eu non sapien. Sed accumsan placerat eros, a rutrum dui. Vestibulum ante ipsum primis in faucibus
        orci luctus et ultrices posuere cubilia curae; Curabitur ac iaculis ligula. Suspendisse sodales varius augue sed
        bibendum. Nullam nulla leo, sodales vel urna sit amet, aliquam tincidunt tortor. Nullam vel erat condimentum,
        tincidunt lacus et, tempor turpis. Mauris porta, elit nec auctor blandit, justo dolor rutrum ex, vitae maximus
        arcu lacus non ligula. Morbi iaculis molestie elit a fringilla. Pellentesque laoreet at quam vitae condimentum.
      </p>

      <p className={styles.param}>
        37) Nullam convallis, nisl eu molestie vehicula, orci est rutrum diam, eget tristique ligula eros et orci.
        Curabitur viverra accumsan mi nec tincidunt. Phasellus sollicitudin est lorem, at euismod enim aliquet sit amet.
        Ut ultricies varius elit, eget efficitur ligula facilisis non. Quisque accumsan fringilla urna. Vestibulum ipsum
        ante, ultricies ut lectus sed, pharetra consectetur massa. Pellentesque sed mollis justo. Ut id risus non sem
        pellentesque vulputate et et augue. Aenean suscipit pharetra velit, id luctus nunc dictum et. Vivamus maximus
        ullamcorper porttitor. Proin vel tristique velit.
      </p>

      <p className={styles.param}>
        38) Vestibulum sit amet tempus leo. Donec gravida gravida diam, sit amet tempor velit feugiat eu. Aliquam
        gravida elementum dui, quis aliquet massa scelerisque in. Sed ac elementum felis. Pellentesque ullamcorper ipsum
        a scelerisque viverra. Sed euismod nisl eget elit commodo, tempor accumsan felis vulputate. Aenean pellentesque
        bibendum odio at efficitur. Sed in auctor turpis, ac congue libero. Duis euismod nunc elit, ut semper lacus
        volutpat in. Quisque interdum orci vitae ligula accumsan sollicitudin. Suspendisse potenti. Donec at dolor nunc.
        Vivamus quis mattis est.
      </p>

      <p className={styles.param}>
        39) Nullam finibus diam ac lacus rhoncus, vitae placerat urna porttitor. Pellentesque sagittis risus metus.
        Aliquam rutrum scelerisque gravida. Aliquam consectetur, ex ut mattis fermentum, nulla nulla accumsan ligula,
        sed scelerisque neque magna id ante. Proin fermentum vel leo ac pellentesque. Integer id nunc vel odio volutpat
        imperdiet ac ac metus. Nunc quis aliquet nunc. Sed ac lacus vel nibh vestibulum porttitor. Cras quis augue
        sodales, fringilla leo eget, tincidunt risus. In ultricies ante ut eros faucibus lacinia.
      </p>

      <p className={styles.param}>
        40) Donec nisi velit, ultricies sit amet tincidunt eget, aliquet et eros. Ut eleifend consectetur enim sed
        tincidunt. Mauris rutrum lacus augue, in hendrerit est sodales at. Phasellus eget libero consequat, dapibus mi
        id, lacinia odio. Cras consequat, risus ut volutpat tempus, magna nisi efficitur libero, ac tristique ex ligula
        nec purus. Vivamus odio lectus, laoreet in volutpat vel, vehicula ut orci. Vestibulum nec nunc augue. Cras
        tristique sem leo, at tincidunt leo suscipit non. Aliquam a urna nunc. Cras ac vulputate nisi. Vestibulum congue
        turpis et lacus euismod vehicula. Pellentesque tincidunt sit amet libero eget vehicula. In hac habitasse platea
        dictumst.
      </p>
    </div>
  );
}
