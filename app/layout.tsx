import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Diwali 2026: Immersive 3D Celebration Experience',
  description: 'An exceptional, fully immersive 3D Diwali 2026 celebration experience inspired by the epic return of Lord Rama to Ayodhya after defeating Ravana. Experience the Agni Astra fire bow release, the golden kingdom of Ayodhya, and millions of glowing diyas.',
  openGraph: {
    title: 'Diwali 2026: Immersive 3D Celebration Experience',
    description: 'An exceptional, fully immersive 3D Diwali 2026 celebration experience inspired by the epic return of Lord Rama to Ayodhya after defeating Ravana.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diwali 2026: Immersive 3D Celebration Experience',
    description: 'An exceptional, fully immersive 3D Diwali 2026 celebration experience inspired by the epic return of Lord Rama to Ayodhya after defeating Ravana.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
