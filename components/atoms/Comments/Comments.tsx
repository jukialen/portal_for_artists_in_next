import lazy from 'next/dynamic'
import { Discuzz, loadService } from '@discuzz/discuzz'

const LocaleProviderEn = lazy(() => import('@discuzz/locale-en'), { ssr: false })
// const ComposerMarkdown = lazy(() => import('@discuzz/composer-markdown'))
// const ViewerMarkdown = lazy(() => import('@discuzz/viewer-markdown'))

const AuthFirebase = loadService(() => import('@discuzz/auth-firebase'))
const DataFirestore = loadService(() => import('@discuzz/data-firestore'))

export const Comments = () => {
  return (
    <Discuzz
      url={global.location && global.location.href}
      service={{
        auth: AuthFirebase,
        data: DataFirestore,
        config: {
          apiKey: `${process.env.NEXT_PUBLIC_API_KEY}`,
          authDomain: `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}`,
          projectId: `${process.env.NEXT_PUBLIC_PROJ_ID}`,
          storageBucket: `${process.env.NEXT_PUBLIC_STORAGE_BUCKET}`,
          messagingSenderId: `${process.env.NEXT_PUBLIC_SENDER_ID}`,
          appId: `${process.env.NEXT_PUBLIC_APP_ID}`
        }
      }}
      auths={['google', 'github', 'yahoo']}
      // config={{
      //   composer: ComposerMarkdown,
      //   viewer: ViewerMarkdown
      // }}
      locale={LocaleProviderEn}
    />
  );
}