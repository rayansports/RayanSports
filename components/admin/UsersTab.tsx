'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/app/admin/utils';
import { Plus, Edit2, Trash2, X, Check, ShieldCheck, Mail, Users, UserPlus } from 'lucide-react';

import Dropdown from './Dropdown';

export default function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'admin' | 'user'>('user');
  
  const [formData, setFormData] = useState({ id: '', email: '', role: 'editor' });

  useEffect(() => {
    // We are just simulating users with an `admins` collection that dictates roles
    // as well as a generic `users` collection.
    const qAdmins = query(collection(db, 'admins'));
    const unSubAdmins = onSnapshot(qAdmins, (snapshot) => {
      setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, error => { try { handleFirestoreError(error, OperationType.LIST, 'admins'); } catch(e) {} });

    const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unSubUsers = onSnapshot(qUsers, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, error => { try { handleFirestoreError(error, OperationType.LIST, 'users'); } catch(e) {} });

    return () => {
      unSubAdmins();
      unSubUsers();
    };
  }, []);

  const openForm = (type: 'admin' | 'user', user?: any) => {
    setFormType(type);
    if (user) {
      setFormData({ id: user.id || '', email: user.email || '', role: user.role || (type === 'admin' ? 'admin' : 'editor') });
    } else {
      setFormData({ id: '', email: '', role: type === 'admin' ? 'admin' : 'editor' });
    }
    setIsFormOpen(true);
  };

  const saveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formType === 'admin') {
        // Here we just use the email prefix or a random ID as doc id for admins
        const id = formData.id || formData.email.split('@')[0] + '-' + Date.now().toString().slice(-4);
        await setDoc(doc(db, 'admins', id), {
          email: formData.email,
          role: formData.role
        });
      } else {
        const id = formData.id || `user-${Date.now()}`;
        const payload: any = {
          email: formData.email,
          role: formData.role
        };
        if (!formData.id) {
          payload.createdAt = serverTimestamp();
        } else {
          const existingUser = users.find(u => u.id === id);
          payload.createdAt = existingUser?.createdAt || serverTimestamp();
        }
        await setDoc(doc(db, 'users', id), payload);
      }
      setIsFormOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, formType === 'admin' ? 'admins' : 'users');
    }
  };

  const deleteRecord = async (type: 'admin' | 'user', id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
    try {
      await deleteDoc(doc(db, type === 'admin' ? 'admins' : 'users', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${type === 'admin' ? 'admins' : 'users'}/${id}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 leading-none">Administration & Roles</h2>
          <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Manage staff and system administrators</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => openForm('user')}
            className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </button>
          <button 
            onClick={() => openForm('admin')}
            className="bg-brand-blue border-2 border-brand-blue text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:border-blue-700 transition shadow-sm flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Assign Admin
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-8 border-b-4 border-b-brand-blue">
          <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
              {formData.id ? 'Edit' : 'Add'} {formType === 'admin' ? 'Administrator' : 'System User'}
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={saveRecord} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="email" value={formData.email} disabled={!!formData.id} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 pl-10 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500" placeholder="user@company.com" />
                </div>
                {formData.id && <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Email cannot be changed after creation.</p>}
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Role Assignment</label>
                <Dropdown
                  value={formData.role}
                  onChange={(value) => setFormData({...formData, role: value})}
                  options={
                    formType === 'admin' 
                      ? [{label: "Super Administrator", value: "admin"}, {label: "Store Manager", value: "manager"}]
                      : [{label: "Content Editor", value: "editor"}, {label: "Viewer (Read Only)", value: "viewer"}]
                  }
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" className="bg-brand-blue text-white px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-sm flex items-center gap-2"><Check className="w-4 h-4"/> Save Record</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admins Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-blue" /> System Administrators
            </h3>
          </div>
          {admins.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">No external administrators assigned.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {admins.map(admin => (
                <div key={admin.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-black">
                      {(admin.email || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{admin.email}</div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{admin.role || 'Admin'}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteRecord('admin', admin.id, admin.email)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-500" /> System Users & Staff
            </h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium animate-pulse">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">No additional users found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {users.map(user => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black">
                      {(user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{user.email}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded leading-none">
                          {user.role}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Added {user.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openForm('user', user)} className="p-2 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteRecord('user', user.id, user.email)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
