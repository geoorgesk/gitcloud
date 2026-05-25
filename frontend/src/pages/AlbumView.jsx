import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPhotos, deletePhoto, getAlbums, toggleFavorite } from '../services/photoService';
import toast from 'react-hot-toast';
import { Trash2, ArrowLeft, Heart, X } from 'lucide-react';

export default function AlbumView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // FIXED: Moved fetchData ABOVE the useEffect so it is properly defined before being called
  const fetchData = async () => {
    try {
      const [allPhotos, allAlbums] = await Promise.all([
        getPhotos({ albumId: id }),
        getAlbums(),
      ]);
      setPhotos(allPhotos);
      setAlbum(allAlbums.find(a => a._id === id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-5 h-5 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-8 pb-4 border-b border-border">
        <button
          onClick={() => navigate('/albums')}
          className="text-muted hover:text-primary transition-colors duration-150 p-1"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-primary text-2xl font-semibold">{album?.name || 'Album'}</h1>
          <p className="text-muted text-sm mt-0.5">{photos.length} photos</p>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted text-sm">No photos in this album yet</p>
          <p className="text-muted text-xs mt-1">Go to the Gallery and assign photos to this album.</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <div
              key={photo._id}
              className="break-inside-avoid relative group cursor-pointer rounded-md overflow-hidden border border-border hover:border-border-hover transition-colors duration-150"
              onClick={() => setSelected(photo)}
            >
              <img
                src={photo.githubUrl}
                alt={photo.filename}
                className="w-full object-cover"
                loading="lazy"
                onLoad={(e) => { e.target.style.opacity = 1; }}
                style={{ opacity: 0, transition: 'opacity 300ms ease' }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-150">
                <div className="absolute bottom-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
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

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ background: 'rgba(1,4,9,0.85)' }}
          onClick={() => setSelected(null)}
        >
          <div onClick={(e) => e.stopPropagation()} className="animate-modal-in max-w-4xl w-full">
            <img
              src={selected.githubUrl}
              alt={selected.filename}
              className="max-h-[80vh] w-full object-contain rounded-md"
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-primary text-sm font-semibold">{selected.filename}</p>
                <p className="text-muted text-xs mt-0.5">
                  {selected.repoName} · {(selected.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 bg-surface border border-border rounded-md flex items-center justify-center hover:border-border-hover text-muted hover:text-primary transition-colors duration-150 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}