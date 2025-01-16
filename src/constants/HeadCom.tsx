export const HeadCom = (content: string) => {
  return {
    title: content,
    description: content,
    themeColor: '#FFD068',
    manifest: '/manifest.json',
    icons: {
      apple: '/apple-touch-icon.png',
    },
  }
};
