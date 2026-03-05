import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Frontier Prints',
  description: 'Custom 3D print shop storefront with quote requests and owner admin panel.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  );
}
