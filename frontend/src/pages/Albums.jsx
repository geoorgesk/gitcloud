import { useEffect, useState } from 'react';
import { getAlbums, createAlbum, deleteAlbum } from '../services/photoService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2, Plus, Folder } from 'lucide-react';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAlbums().then(setAlbums).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter an album name');
      return;
    }
    try {
      const album = await createAlbum(name);
      setAlbums(prev => [album, ...prev]);
      setName('');
      toast.success('Album created');
    } catch {
      toast.error('Failed to create album');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this album?')) return;
    try {
      await deleteAlbum(id);
      setAlbums(prev => prev.filter(a => a._id !== id));
      toast.success('Album deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold">Albums</h1>
        <p className="text-muted text-sm mt-1">Organize your photos into collections</p>
      </div>

      <div className="flex gap-2 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="New album name"
          className="flex-1 bg-surface border border-border rounded-md px-3 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="button"
          onClick={handleCreate}
          className="bg-btn-primary hover:bg-green-700 text-white text-sm font-medium px-4 py-2.5 rounded-md transition-all flex items-center gap-2"
        >
          <Plus size={15} /> Create
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted text-sm">No albums yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {albums.map((album) => (
            <div
              key={album._id}
              onClick={() => navigate(`/albums/${album._id}`)}
              className="flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg group hover:border-accent/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Folder size={15} strokeWidth={1.5} className="text-accent" />
                <div>
                  <p className="text-white text-sm font-medium">{album.name}</p>
                  <p className="text-muted text-xs">
                    {new Date(album.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => handleDelete(album._id, e)}
                className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}