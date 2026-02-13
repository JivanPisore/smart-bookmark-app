'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Auth from '@/components/Auth';
import AddBookmark from '@/components/AddBookmark';
import BookmarkList from '@/components/BookmarkList';
import { LogOut, User as UserIcon, ChevronDown, Mail, Settings, Shield } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="animate-in pb-20">
      <header className="sticky top-0 z-[100] w-full glass border-b border-white/5 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-white bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">
              SMART BOOKMARKS
            </h1>
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
              <p className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">
                Digital Library
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`flex items-center gap-3 p-1.5 pl-4 glass rounded-full border transition-all cursor-pointer group
                ${menuOpen ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]' : 'border-white/10 hover:border-white/20'}`}
            >
              <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors hidden sm:block">
                {user.email?.split('@')[0]}
              </span>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center border border-white/20 shadow-inner">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
              <ChevronDown className={`h-4 w-4 text-white/40 mr-2 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />

                <div className="absolute right-0 mt-4 w-72 glass border border-white/10 rounded-[2rem] shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300 overflow-hidden">
                  <div className="p-2">
                    <div className="px-4 py-3 flex items-center gap-3 group/item">
                      <div className="p-2 bg-white/5 rounded-lg group-hover/item:bg-primary/10 transition-colors">
                        <Mail className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Account Active</p>
                        <p className="text-sm text-white/90 truncate font-semibold">{user.email}</p>
                      </div>
                    </div>

                    <div className="h-px bg-white/5 my-2 mx-4" />

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-4 hover:bg-destructive/10 text-destructive rounded-2xl transition-all group/logout cursor-pointer"
                    >
                      <div className="p-2 bg-destructive/10 rounded-lg group-hover/logout:bg-destructive/20 transition-colors cursor-pointer">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm">Sign Out Account</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

  <div className="max-w-4xl mx-auto space-y-16 pt-8">
        <AddBookmark userId={user.id} />

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Your Library</h2>
            <div className="h-px flex-1 bg-border/50"></div>
          </div>
          <BookmarkList userId={user.id} />
        </div>
      </div>

      <footer className="pt-20 pb-10 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Smart Bookmarks. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
