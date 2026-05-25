import { useEffect, useState } from 'react';
import { getPhotos, deletePhoto, toggleFavorite } from '../services/photoService';
import toast from 'react-hot-toast';
import { Trash2, Heart, Download, X, Search } from 'lucide-react';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-primary text-2xl font-semibold">Gallery</h1>
          <p className="text-muted text-sm mt-1">{photos.length} photos</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search photos..."
            className="bg-surface border border-border rounded-md pl-9 pr-3 py-1.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-56"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted text-sm">No photos found</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((photo) => (
            <div
              key={photo._id}
              className="break-inside-avoid relative group cursor-pointer rounded-md overflow-hidden border border-border hover:border-border-hover transition-colors duration-150"
              onClick={() => setSelected(photo)}
            >
              <img
                src={photo.githubUrl}
                alt={photo.filename}
                className="w-full block object-cover"
                loading="lazy"
                onLoad={(e) => { e.target.style.opacity = 1; }}
                style={{ opacity: 0, transition: 'opacity 300ms ease' }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-150">
                <div className="absolute bottom-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={(e) => handleFavorite(photo, e)}
                    className="w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-150"
                    style={{ background: 'rgba(13,17,23,0.75)' }}
                  >
                    <Heart
                      size={14}
                      className={photo.isFavorite ? 'text-danger' : 'text-white'}
                      fill={photo.isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button
                    onClick={(e) => handleDelete(photo, e)}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:text-danger transition-colors duration-150"
                    style={{ background: 'rgba(13,17,23,0.75)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ background: 'rgba(1,4,9,0.85)' }}
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-modal-in max-w-5xl w-full"
          >
            <img
              src={selected.githubUrl}
              alt={selected.filename}
              className="max-h-[80vh] w-full object-contain rounded-md"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="min-w-0 mr-4">
                <p className="text-primary text-sm font-semibold truncate">{selected.filename}</p>
                <p className="text-muted text-xs mt-0.5">
                  {selected.repoName} · {(selected.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-btn-primary text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-btn-primary-hover transition-colors duration-150 flex items-center gap-1.5 no-underline"
                >
                  <Download size={14} /> Download
                </a>
                <button
                  onClick={() => handleDelete(selected)}
                  className="bg-surface border border-border text-primary text-sm px-3 py-1.5 rounded-md hover:border-danger hover:text-danger transition-colors duration-150 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={14} /> Delete
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 bg-surface border border-border rounded-md flex items-center justify-center hover:border-border-hover text-muted hover:text-primary transition-colors duration-150 cursor-pointer"
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