import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Link as LinkIcon, Type, Sparkles } from 'lucide-react';

export default function AddBookmark({ userId }: { userId: string }) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !title) return;

        setLoading(true);
        const { error } = await supabase
            .from('bookmarks')
            .insert([{ url, title, user_id: userId }]);

        if (error) {
            alert(error.message);
        } else {
            setUrl('');
            setTitle('');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
        setLoading(false);
    };

    return (
        <section className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 blur-2xl rounded-full" />
            <form onSubmit={handleSubmit} className="relative group p-1 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent">
                <div className="glass p-8 rounded-[1.9rem] space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Quick Add</h2>
                        </div>
                        {success && (
                            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full animate-in flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                    Added to library
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-[1.5]">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <input
                                type="text"
                                placeholder="What's this bookmark about?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30 font-medium text-white"
                                required
                            />
                        </div>
                        <div className="relative flex-[2]">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                            <input
                                type="url"
                                placeholder="Paste the link here..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/30 font-medium text-white"
                                required
                            />
                        </div>
                        <div className="relative group/btn-container lg:w-auto">
                            {/* High-visibility glow effect */}
                            <div className={`absolute -inset-1 blur-xl rounded-2xl -z-10 transition-all duration-500
                                ${success ? 'bg-emerald-500/50' : 'bg-primary/40 group-hover/btn-container:bg-primary/60 group-hover/btn-container:scale-110'}
                            `} />

                            <button
                                type="submit"
                                disabled={loading || success}
                                className={`w-full lg:w-auto px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group/btn cursor-pointer relative overflow-hidden border border-white/20 shadow-2xl
                                    ${success
                                        ? 'bg-emerald-500 text-white shadow-emerald-500/40'
                                        : 'bg-primary text-white hover:scale-[1.03] active:scale-[0.97] shadow-primary/40'
                                    }`}
                            >
                                {/* Background Overlay for Depth */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

                                {loading ? (
                                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : success ? (
                                    <Sparkles className="h-5 w-5 animate-pulse" />
                                ) : (
                                    <div className="flex items-center gap-2 relative z-10">
                                        <span className="tracking-tight text-lg">Add Bookmark</span>
                                        <Plus className="h-5 w-5 group-hover/btn:rotate-90 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </div>


                    </div>
                </div>
            </form>
        </section>
    );
}


