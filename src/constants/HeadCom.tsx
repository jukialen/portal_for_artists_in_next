export const HeadCom = (content: string) => {
  return {
    title: content,
    description: content,
    manifest: '/manifest.webmanifest',
    icons: {
      apple: '/apple-touch-icon.png',
      icon: '/favicon.ico',
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent' as const,
      title: 'Pfartists',
    },
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': 'Pfartists',
      'application-name': 'Pfartists',
      'color-scheme': 'light dark',
      rating: '14 years',
    },
  };
};
