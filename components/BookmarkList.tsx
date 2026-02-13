import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, ExternalLink, Globe, Layout, Clock } from 'lucide-react';

interface Bookmark {
    id: string;
    url: string;
    title: string;
    user_id: string;
    created_at: string;
}

export default function BookmarkList({ userId }: { userId: string }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching bookmarks:', error);
            } else {
                setBookmarks(data || []);
            }
            setLoading(false);
        };

        fetchBookmarks();

        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const confirmDelete = (id: string) => {
        setDeletingId(id);
    };

    const handleDelete = async () => {
        if (!deletingId) return;

        const idToRemove = deletingId;
        // Optimistic update: UI se turant hata do
        setBookmarks((prev) => prev.filter((b) => b.id !== idToRemove));
        setDeletingId(null);

        const { error } = await supabase.from('bookmarks').delete().eq('id', idToRemove);
        if (error) {
            console.error('Delete error:', error.message);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass p-6 rounded-3xl h-40 animate-pulse bg-white/5" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {bookmarks.length === 0 ? (
                <div className="col-span-full py-24 text-center glass rounded-[2.5rem] border-dashed border-white/10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
                        <Layout className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white/50">Your library is empty</h3>
                    <p className="text-muted-foreground/40 max-w-[250px] mx-auto">Start by adding your first favorite link above! 🚀</p>
                </div>
            ) : (
                bookmarks.map((bookmark) => (
                    <div
                        key={bookmark.id}
                        className="group relative glass p-6 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all hover:translate-y-[-6px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-in overflow-hidden"
                    >
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                    <Globe className="h-5 w-5 text-primary/70" />
                                </div>
                                <button
                                    onClick={() => confirmDelete(bookmark.id)}
                                    className="p-2 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all cursor-pointer"
                                    title="Delete bookmark"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {bookmark.title}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground/60 mb-6">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
                            </div>

                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/5"
                            >
                                <span>Visit Link</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                ))
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
                        onClick={() => setDeletingId(null)}
                    />
                    <div className="glass p-8 rounded-[2.5rem] border border-white/10 w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-destructive/10 rounded-full">
                                <Trash2 className="h-8 w-8 text-destructive" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight text-white">Delete Bookmark?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Are you sure you want to remove this?
                            </p>

                            <div className="flex gap-3 w-full pt-4">
                                <button
                                    onClick={() => setDeletingId(null)}
                                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/5 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/5 cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


