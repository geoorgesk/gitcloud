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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-primary text-2xl font-normal">Upload</h1>
        <p className="text-muted text-sm mt-1">Add photos to your GitCloud storage</p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-[6px] p-10 text-center cursor-pointer transition duration-150 mb-6 ${
          isDragActive ? 'border-accent bg-accent/5' : 'border-border hover:border-border-hover'
        }`}
      >
        <input {...getInputProps()} />
        <UploadIcon size={32} strokeWidth={1.5} className="text-muted mx-auto mb-3" />
        <p className="text-primary text-sm font-medium">
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
                className="bg-btn-primary text-white text-sm font-medium px-4 py-[5px] rounded-[6px] hover:bg-btn-primary-hover transition duration-150 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : `Upload ${pending} files`}
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {files.map((item) => (
              <div key={item.id} className="relative group aspect-square rounded-[6px] overflow-hidden border border-border">
                <img
                  src={item.preview}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/60 rounded-[6px] opacity-0 group-hover:opacity-100 transition duration-150 flex items-center justify-center">
                  {item.status === 'pending' && (
                    <button onClick={() => remove(item.id)}>
                      <X size={16} className="text-primary" />
                    </button>
                  )}
                  {item.status === 'uploading' && (
                    <Loader size={16} className="text-accent animate-spin" />
                  )}
                  {item.status === 'done' && (
                    <Check size={16} className="text-success" />
                  )}
                  {item.status === 'error' && (
                    <X size={16} className="text-danger" />
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