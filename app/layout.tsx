import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Corridor Twin | Infrastructure Intelligence',
  description: 'Temporal 3D corridor mapping and construction monitoring proof of concept.'
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
