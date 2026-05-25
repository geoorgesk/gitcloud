import { useEffect, useState } from 'react';
import { getAlbums, createAlbum, deleteAlbum } from '../services/photoService';
import toast from 'react-hot-toast';
import { Trash2, Plus, Folder } from 'lucide-react';

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlbums().then(setAlbums).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const album = await createAlbum(name);
      setAlbums(prev => [album, ...prev]);
      setName('');
      toast.success('Album created');
    } catch {
      toast.error('Failed to create album');
    }
  };

  const handleDelete = async (id) => {
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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-primary text-2xl font-normal">Albums</h1>
        <p className="text-muted text-sm mt-1">Organize your photos into collections</p>
      </div>

      {/* Create */}
      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New album name"
          className="flex-1 bg-surface border border-border rounded-[6px] px-3 py-[5px] text-sm text-primary placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent transition duration-150"
        />
        <button
          type="submit"
          className="bg-btn-primary text-white text-sm font-medium px-4 py-[5px] rounded-[6px] hover:bg-btn-primary-hover transition duration-150 flex items-center gap-2"
        >
          <Plus size={15} /> Create
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-4 h-4 border-2 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted text-sm">No albums yet</p>
        </div>
      ) : (
        <div className="space-y-0">
          {albums.map((album) => (
            <div
              key={album._id}
              className="flex items-center justify-between px-4 py-3 border border-border first:rounded-t-[6px] last:rounded-b-[6px] -mt-px bg-surface hover:bg-surface-hover transition duration-150 group"
            >
              <div className="flex items-center gap-3">
                <Folder size={16} strokeWidth={1.5} className="text-muted" />
                <div>
                  <p className="text-accent text-sm font-semibold hover:underline">{album.name}</p>
                  <p className="text-muted text-xs">
                    {new Date(album.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(album._id)}
                className="text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition duration-150 p-1"
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