'use client';

import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { UploadCloud, X, Loader2, Image as ImageIcon, Video } from 'lucide-react';

interface MediaUploaderProps {
  onUploadSuccess: (url: string) => void;
  accept?: string;
  label?: string;
}

export default function MediaUploader({ onUploadSuccess, accept = "image/*,video/*", label = "Upload Media" }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transferred, setTransferred] = useState('0 MB');
  const [total, setTotal] = useState('0 MB');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setTransferred('0 MB');
    setTotal((file.size / (1024 * 1024)).toFixed(2) + ' MB');
    setError(null);

    const isVideo = file.type.startsWith('video/');
    const folder = isVideo ? 'videos' : 'images';
    const storageRef = ref(storage, `uploads/${folder}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
        setTransferred((snapshot.bytesTransferred / (1024 * 1024)).toFixed(2) + ' MB');
      },
      (err) => {
        console.error("Upload error:", err);
        setError(err.message);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        onUploadSuccess(downloadURL);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    );
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        accept={accept} 
        onChange={handleFileChange} 
        className="hidden" 
        ref={fileInputRef} 
      />
      
      {!uploading ? (
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-brand-blue hover:bg-blue-50 transition-colors text-slate-500 hover:text-brand-blue group"
        >
          <div className="bg-slate-100 p-3 rounded-full group-hover:bg-blue-100 transition-colors">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest mt-2">{label}</p>
          <p className="text-[10px] text-slate-400">Click to browse files</p>
        </button>
      ) : (
        <div className="w-full border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-4 bg-slate-50">
          <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
              <span>Uploading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-brand-blue h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="text-center mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {transferred} / {total}
            </div>
            <div className="text-center mt-1 text-[9px] text-slate-400 font-medium tracking-wide">Please wait, do not close this window.</div>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}
