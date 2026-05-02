'use client';

import { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Helper for generic typing format and fallback
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const auth = getAuth();
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  alert(`Firestore Error: ${errInfo.error}\nCheck console for details.`);
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Avoid calling setLoadingData(true) synchronously if possible, but safe in useEffect initial run.
      // We will move it here to just rely on initial state or simple flag.
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInquiries(data);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const markAsContacted = async (id: string, currentInquiry: any) => {
    if (!window.confirm('Mark this inquiry as contacted?')) return;
    try {
      const ref = doc(db, 'inquiries', id);
      await updateDoc(ref, { 
        status: 'contacted',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  if (loadingUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full border bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Admin Login</h2>
          <p className="text-gray-600 mb-8">Sign in with your authorized Google account to view inquiries.</p>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inquiries Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 sm:mt-0 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          {loadingData ? (
            <div className="p-8 text-center text-gray-500">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by sharing your website link.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Info</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Specs</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className={inquiry.status === 'new' ? 'bg-blue-50/30' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{inquiry.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-tight ${
                            inquiry.status === 'new' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {(inquiry.status || 'new').toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                        <div className="text-sm text-gray-500">{inquiry.email}</div>
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                        <div className="text-xs text-gray-500 mt-1 font-semibold">{inquiry.country}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-900 mb-1">{inquiry.productName}</div>
                        <div className="text-sm text-gray-700">Q: {inquiry.quantity} | Sizes: {inquiry.size}</div>
                        {inquiry.fabric && <div className="text-sm text-gray-500">Fabric: {inquiry.fabric}</div>}
                        {inquiry.printingMethod && <div className="text-sm text-gray-500">Print: {inquiry.printingMethod}</div>}
                        {inquiry.message && (
                          <div className="mt-2 text-xs italic text-gray-500 border-l-2 border-gray-300 pl-2 max-w-xs truncate" title={inquiry.message}>
                            &quot;{inquiry.message}&quot;
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col gap-2 items-end">
                          {inquiry.status === 'new' && (
                            <button 
                              onClick={() => markAsContacted(inquiry.id, inquiry)}
                              className="text-white bg-brand-blue hover:bg-blue-700 px-3 py-1.5 rounded transition-colors text-xs uppercase"
                            >
                              Mark Contacted
                            </button>
                          )}
                          <a 
                            href={`https://wa.me/${(inquiry.phone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 font-semibold text-xs"
                          >
                            Open WhatsApp
                          </a>
                          <button 
                            onClick={() => deleteInquiry(inquiry.id)}
                            className="text-red-600 hover:text-red-900 transition-colors mt-2 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
