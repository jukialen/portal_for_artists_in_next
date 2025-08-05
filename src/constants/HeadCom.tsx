export const HeadCom = (content: string) => {
  return {
    title: content,
    description: content,
    manifest: '/manifest.webmanifest',
    icons: {
      apple: '/apple-touch-icon.png',
      icon: '/favicon.ico',
    },
  };
};
