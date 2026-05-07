import { notFound } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore/lite';
import { liteDb as db } from '@/lib/firebase';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60; // Revalidate every 60 seconds

async function getPageBySlug(slug: string) {
  try {
    const q = query(collection(db, 'pages'), where('slug', '==', slug), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
    }
  } catch (error) {
    console.error('Error fetching page:', error);
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await getPageBySlug(resolvedParams.slug);

  if (!page) {
    return { title: 'Page Not Found | RayanSports' };
  }

  return {
    title: `${page.title} | RayanSports`,
    description: page.metaDescription || `Read ${page.title} at RayanSports.`,
  };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const page = await getPageBySlug(resolvedParams.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <div className="bg-slate-900 border-b border-slate-800 pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4">{page.title}</h1>
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-3 h-3 text-slate-500 mx-1" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">{page.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div className="flex-1 py-12 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 prose prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-h1:text-3xl prose-h2:text-2xl prose-a:text-brand-blue hover:prose-a:text-blue-800 prose-img:rounded-xl">
            <ReactMarkdown>
              {page.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
