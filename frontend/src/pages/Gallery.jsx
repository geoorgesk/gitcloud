import { useEffect, useState } from 'react';
import { getPhotos, deletePhoto, toggleFavorite, assignToAlbum, getAlbums } from '../services/photoService';
import toast from 'react-hot-toast';
import { Trash2, Heart, Download, X, Search, FolderPlus } from 'lucide-react';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [albumPicker, setAlbumPicker] = useState(null);

  // 1. FIXED: Moved fetchPhotos ABOVE the useEffect so it can be accessed
  const fetchPhotos = async () => {
    try {
      const data = await getPhotos();
      setPhotos(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    getAlbums().then(setAlbums);
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

  const handleAssignAlbum = async (photo, albumId) => {
    try {
      const updated = await assignToAlbum(photo._id, albumId);
      setPhotos(prev => prev.map(p => p._id === updated._id ? updated : p));
      setAlbumPicker(null);
      toast.success(albumId ? 'Added to album' : 'Removed from album');
    } catch {
      toast.error('Failed to update album');
    }
  };

  const filtered = photos.filter(p =>
    p.filename.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-semibold">Gallery</h1>
          <p className="text-muted text-sm mt-1">{photos.length} photos</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search photos..."
            className="bg-surface border border-border rounded-md pl-8 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-white/30 w-48"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted text-sm">No photos found</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((photo) => (
            <div
              key={photo._id}
              className="break-inside-avoid relative group cursor-pointer rounded-md overflow-hidden"
              onClick={() => setSelected(photo)}
            >
              <img
                src={photo.githubUrl}
                alt={photo.filename}
                className="w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200">
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlbumPicker(albumPicker === photo._id ? null : photo._id);
                      }}
                      className="w-7 h-7 bg-black/60 backdrop-blur rounded-md flex items-center justify-center hover:bg-black/80 transition-all"
                    >
                      <FolderPlus size={13} className="text-white" />
                    </button>
                    {albumPicker === photo._id && (
                      <div
                        className="absolute bottom-8 right-0 bg-surface border border-border rounded-lg shadow-xl z-10 min-w-36 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-muted text-xs px-3 py-2 border-b border-border">
                          Add to album
                        </p>
                        {albums.length === 0 ? (
                          <p className="text-muted text-xs px-3 py-2">No albums yet</p>
                        ) : (
                          albums.map(album => (
                            <button
                              key={album._id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignAlbum(photo, album._id);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-all ${
                                photo.albumId === album._id ? 'text-green-400' : 'text-white'
                              }`}
                            >
                              {album.name}
                              {photo.albumId === album._id && ' ✓'}
                            </button>
                          ))
                        )}
                        {photo.albumId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignAlbum(photo, null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5 border-t border-border"
                          >
                            Remove from album
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleFavorite(photo, e)}
                    className="w-7 h-7 bg-black/60 backdrop-blur rounded-md flex items-center justify-center hover:bg-black/80 transition-all"
                  >
                    <Heart
                      size={13}
                      className={photo.isFavorite ? 'text-red-400' : 'text-white'}
                      fill={photo.isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>
                  <button
                    onClick={(e) => handleDelete(photo, e)}
                    className="w-7 h-7 bg-black/60 backdrop-blur rounded-md flex items-center justify-center hover:bg-red-500/80 transition-all"
                  >
                    <Trash2 size={13} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full"
          >
            <img
              src={selected.githubUrl}
              alt={selected.filename}
              className="max-h-[75vh] w-full object-contain rounded-lg"
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-white text-sm font-medium truncate">
                  {selected.filename}
                </p>
                <p className="text-muted text-xs mt-0.5">
                  {selected.repoName} · {(selected.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex gap-2">
                {/* 2. FIXED: Added missing '<a' tag here */}
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-white text-black text-xs font-medium px-3 py-2 rounded-md hover:bg-white/90 transition-all"
                >
                  <Download size={13} /> Download
                </a>
                <button
                  onClick={() => handleDelete(selected)}
                  className="flex items-center gap-2 bg-surface border border-border text-white text-xs px-3 py-2 rounded-md hover:border-red-500/50 hover:text-red-400 transition-all"
                >
                  <Trash2 size={13} /> Delete
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 bg-surface border border-border rounded-md flex items-center justify-center hover:border-white/30 transition-all"
                >
                  <X size={14} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}