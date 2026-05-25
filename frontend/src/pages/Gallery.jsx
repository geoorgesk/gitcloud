import { useEffect, useState } from 'react';
import { getPhotos, deletePhoto, toggleFavorite, assignToAlbum, getAlbums } from '../services/photoService';
import toast from 'react-hot-toast';
import { Trash2, Heart, Download, X, Search, FolderPlus, Check } from 'lucide-react';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [albumPicker, setAlbumPicker] = useState(null);

  useEffect(() => {
    fetchPhotos();
    getAlbums().then(setAlbums);
  }, []);

  const fetchPhotos = async () => {
    try {
      const data = await getPhotos();
      setPhotos(data);
    } finally {
      setLoading(false);
    }
  };

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
            className="bg-surface border border-border rounded-md pl-9 pr-3 py-1.5 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-56 transition-all duration-150"
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
                  
                  {/* Album Picker */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlbumPicker(albumPicker === photo._id ? null : photo._id);
                      }}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:text-accent transition-colors duration-150"
                      style={{ background: 'rgba(13,17,23,0.75)' }}
                      title="Add to album"
                    >
                      <FolderPlus size={14} />
                    </button>
                    {albumPicker === photo._id && (
                      <div
                        className="absolute bottom-10 right-0 bg-surface border border-border rounded-md shadow-lg z-10 w-48 overflow-hidden animate-fade-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-3 py-2 border-b border-border bg-surface-hover">
                          <p className="text-primary text-xs font-semibold">Select album</p>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {albums.length === 0 ? (
                            <p className="text-muted text-xs px-3 py-3 text-center">No albums created</p>
                          ) : (
                            albums.map(album => (
                              <button
                                key={album._id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignAlbum(photo, album._id);
                                }}
                                className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-primary hover:bg-surface-hover transition-colors duration-150"
                              >
                                <span className="truncate">{album.name}</span>
                                {photo.albumId === album._id && <Check size={14} className="text-success shrink-0 ml-2" />}
                              </button>
                            ))
                          )}
                        </div>
                        {photo.albumId && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignAlbum(photo, null);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-surface-hover border-t border-border transition-colors duration-150"
                          >
                            Remove from album
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleFavorite(photo, e)}
                    className="w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-150"
                    style={{ background: 'rgba(13,17,23,0.75)' }}
                  >
                    <Heart
                      size={14}
                      className={photo.isFavorite ? 'text-danger' : 'text-white hover:text-danger'}
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