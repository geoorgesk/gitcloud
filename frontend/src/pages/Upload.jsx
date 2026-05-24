import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadPhoto } from '../services/photoService';
import toast from 'react-hot-toast';
import { Upload as UploadIcon, X, Check, Loader } from 'lucide-react';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((accepted) => {
    const newFiles = accepted.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      preview: URL.createObjectURL(file),
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const uploadAll = async () => {
    setUploading(true);
    for (const item of files.filter(f => f.status === 'pending')) {
      try {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploading' } : f));
        await uploadPhoto(item.file);
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'done' } : f));
      } catch {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error' } : f));
        toast.error(`Failed: ${item.file.name}`);
      }
    }
    setUploading(false);
    toast.success('Upload complete');
  };

  const remove = (id) => setFiles(prev => prev.filter(f => f.id !== id));
  const pending = files.filter(f => f.status === 'pending').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold">Upload</h1>
        <p className="text-muted text-sm mt-1">Add photos to your GitCloud storage</p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border border-dashed rounded-lg p-12 text-center cursor-pointer transition-all mb-6 ${
          isDragActive ? 'border-white/40 bg-white/5' : 'border-border hover:border-white/20'
        }`}
      >
        <input {...getInputProps()} />
        <UploadIcon size={24} strokeWidth={1.5} className="text-muted mx-auto mb-3" />
        <p className="text-white text-sm font-medium">
          {isDragActive ? 'Drop files here' : 'Drag photos here'}
        </p>
        <p className="text-muted text-xs mt-1">or click to browse — JPG, PNG, WEBP up to 10MB</p>
      </div>

      {/* Files */}
      {files.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted text-sm">{files.length} files selected</p>
            {pending > 0 && (
              <button
                onClick={uploadAll}
                disabled={uploading}
                className="bg-white text-black text-xs font-medium px-4 py-2 rounded-md hover:bg-white/90 transition-all disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : `Upload ${pending} files`}
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {files.map((item) => (
              <div key={item.id} className="relative group aspect-square">
                <img
                  src={item.preview}
                  className="w-full h-full object-cover rounded-md"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  {item.status === 'pending' && (
                    <button onClick={() => remove(item.id)}>
                      <X size={16} className="text-white" />
                    </button>
                  )}
                  {item.status === 'uploading' && (
                    <Loader size={16} className="text-white animate-spin" />
                  )}
                  {item.status === 'done' && (
                    <Check size={16} className="text-green-400" />
                  )}
                  {item.status === 'error' && (
                    <X size={16} className="text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}