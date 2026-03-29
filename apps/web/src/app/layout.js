import './globals.css';
import '../styles/animations.css';

export const metadata = {
  title: 'SheBloom — Doctor Verified Maternal Care Companion',
  description: 'A care coordination platform bridging doctors, caretakers, and maternal persons. Every piece of advice is doctor-verified with WHO/ICMR/ACOG citations.',
  keywords: 'maternal health, pregnancy care, postpartum recovery, doctor verified, caretaker companion, PPD screening',
  manifest: '/manifest.json',
  themeColor: '#2d6a4f',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SheBloom',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
