import { supabase } from '@/lib/supabase';
import { LogIn, AlertCircle, Bookmark, Shield, Zap } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function Auth() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const handleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Login error:', error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-full max-w-md space-y-8 animate-in text-center">
                {/* Logo & Headline */}
                <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <Bookmark className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-primary bg-clip-text text-transparent">
                        Smart Bookmarks
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-[400px] mx-auto leading-relaxed">
                        Your digital library, organized and synced across all your devices in real-time.
                    </p>
                </div>

                {/* Main Card */}
                <div className="glass p-8 rounded-[2rem] border border-white/10 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-left">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm font-medium">
                                {error === 'no-code' && "Authentication code was missing. Please try again."}
                                {error === 'exchange-failed' && "Failed to exchange code for session. Your login link may have expired."}
                                {error === 'auth-callback-failed' && "Authentication failed. Please try again."}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            onClick={handleLogin}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black rounded-2xl font-bold hover:bg-zinc-100 transition-all border border-zinc-200 shadow-xl cursor-pointer group/btn"
                        >
                            <Image src="/google.svg" alt="Google" width={24} height={24} className="group-hover/btn:scale-110 transition-transform" />
                            Sign in with Google
                        </button>

                        <p className="text-xs text-muted-foreground">
                            By signing in, you agree to our Terms of Service.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col items-center gap-1">
                            <Shield className="h-4 w-4 text-primary/60" />
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Secure</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Zap className="h-4 w-4 text-primary/60" />
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Real-time</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground/60">
                    Trusted by developers worldwide.
                </p>
            </div>
        </div>
    );
}


