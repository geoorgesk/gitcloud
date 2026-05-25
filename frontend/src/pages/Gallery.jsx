import { useEffect, useState } from 'react';
import { getPhotos, deletePhoto, toggleFavorite } from '../services/photoService';
import toast from 'react-hot-toast';
import { Trash2, Heart, Download, X, Search } from 'lucide-react';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getPhotos();
        setPhotos(data);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const handleDelete = async (photo, e) => {
    e?.stopPropagation();
    if (!confirm('Delete this photo?')) return;
    try {
      await deletePhoto(photo._id);
      setPhotos(prev => prev.filter(p => p._id !== photo._id));
      if (selected?._id === photo._id) setSelected(null);
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleFavorite = async (photo, e) => {
    e?.stopPropagation();
    try {
      const updated = await toggleFavorite(photo._id);
      setPhotos(prev => prev.map(p => p._id === updated._id ? updated : p));
    } catch {
      toast.error('Failed');
    }
  };

  const filtered = photos.filter(p =>
    p.filename.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-5 h-5 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-primary text-2xl font-normal">Gallery</h1>
          <p className="text-muted text-sm mt-1">{photos.length} photos</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search photos..."
            className="bg-surface border border-border rounded-[6px] pl-9 pr-3 py-[5px] text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition duration-150 w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted text-sm">No photos found</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((photo) => (
            <div
              key={photo._id}
              className="break-inside-avoid relative group cursor-pointer rounded-[6px] overflow-hidden border border-border hover:border-border-hover transition duration-150"
              onClick={() => setSelected(photo)}
            >
              <img
                src={photo.githubUrl}
                alt={photo.filename}
                className={`w-full object-cover ${loadedImages[photo._id] ? 'animate-img-in' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setLoadedImages(prev => ({ ...prev, [photo._id]: true }))}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-150">
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-150">
                  <button
                    onClick={(e) => handleFavorite(photo, e)}
                    className="w-8 h-8 bg-bg/80 rounded-[6px] flex items-center justify-center hover:bg-surface text-muted hover:text-primary transition duration-150"
                  >
                    <Heart
                      size={14}
                      className={photo.isFavorite ? 'text-danger fill-current' : ''}
                      fill={photo.isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button
                    onClick={(e) => handleDelete(photo, e)}
                    className="w-8 h-8 bg-bg/80 rounded-[6px] flex items-center justify-center hover:bg-surface text-muted hover:text-danger transition duration-150"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-overlay z-50 flex items-center justify-center p-8"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-modal-in max-w-5xl w-full"
          >
            <img
              src={selected.githubUrl}
              alt={selected.filename}
              className="max-h-[80vh] w-full object-contain rounded-[6px]"
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-primary text-sm font-semibold truncate">{selected.filename}</p>
                <p className="text-muted text-xs mt-0.5">
                  {selected.repoName} · {(selected.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-btn-primary text-white text-sm font-medium px-4 py-[5px] rounded-[6px] hover:bg-btn-primary-hover transition duration-150 flex items-center gap-2"
                >
                  <Download size={14} /> Download
                </a>
                <button
                  onClick={() => handleDelete(selected)}
                  className="bg-surface border border-border text-primary text-sm px-4 py-[5px] rounded-[6px] hover:border-danger hover:text-danger transition duration-150 flex items-center gap-2"
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 bg-surface border border-border rounded-[6px] flex items-center justify-center hover:border-border-hover text-muted hover:text-primary transition duration-150"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}