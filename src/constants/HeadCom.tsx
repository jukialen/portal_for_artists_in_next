export const HeadCom = (content: string) => {
  return {
    title: content,
    description: content,
    manifest: '/manifest.webmanifest',
    icons: {
      apple: '/apple-touch-icon.png',
      icon: '/favicon.ico',
    },
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'hsl(0, 0%, 97%, 0.9)' },
      { media: '(prefers-color-scheme: dark)', color: 'hsla(0, 0%, 97%, 0.1)' },
    ],
  };
};
