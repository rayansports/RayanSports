import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description: 'Request a wholesale or custom OEM manufacturing quote from RayanSports.',
};

export default function RequestQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
