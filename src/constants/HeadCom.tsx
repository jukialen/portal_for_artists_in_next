export const HeadCom = (content: string) => {
  return {
    title: content,
    description: content,
    // manifest: '/manifest.json',
    icons: {
      apple: '/apple-touch-icon.png',
    },
  }
};
