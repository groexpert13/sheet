import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import GoogleTranslateProvider from '@/components/GoogleTranslateProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Маркетинговая диагностика',
  description: 'Пошаговая диагностика маркетинга: продукты, компетенции, инструменты, финмодель и план действий.',
  metadataBase: new URL('https://sheet.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Маркетинговая диагностика',
    description: 'Пошаговая диагностика маркетинга: продукты, компетенции, инструменты, финмодель и план действий.',
    url: 'https://sheet.vercel.app',
    siteName: 'Маркетинговая диагностика',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: 'https://og-image.vercel.app/%D0%9C%D0%B0%D1%80%D0%BA%D0%B5%D1%82%D0%B8%D0%BD%D0%B3%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%B4%D0%B8%D0%B0%D0%B3%D0%BD%D0%BE%D1%81%D1%82%D0%B8%D0%BA%D0%B0.png?theme=light&md=1&fontSize=75px',
        width: 1200,
        height: 630,
        alt: 'Маркетинговая диагностика',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Маркетинговая диагностика',
    description: 'Пошаговая диагностика маркетинга: продукты, компетенции, инструменты, финмодель и план действий.',
    images: ['https://og-image.vercel.app/%D0%9C%D0%B0%D1%80%D0%BA%D0%B5%D1%82%D0%B8%D0%BD%D0%B3%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%B4%D0%B8%D0%B0%D0%B3%D0%BD%D0%BE%D1%81%D1%82%D0%B8%D0%BA%D0%B0.png?theme=light&md=1&fontSize=75px'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        {children}
        <GoogleTranslateProvider />
      </body>
    </html>
  );
}
