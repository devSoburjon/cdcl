import { useState } from "react";
import { Shield } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  function goGoogle() {
    setLoading(true);
    // Render'da VITE_API_URL backend manzilini beradi. Lokalda nisbiy ishlaydi.
    const apiUrl = import.meta.env.VITE_API_URL || "";
    window.location.href = `${apiUrl}/api/auth/google/start`;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-bg text-fg">
      {/* Chap panel — Brend va animatsiya */}
      <aside className="hidden lg:flex flex-col justify-between p-12
                        bg-gradient-to-br from-indigo-600 via-indigo-500 to-fuchsia-600
                        text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
             style={{ backgroundImage:
               "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)",
               backgroundSize: "24px 24px" }} />
        
        <div className="relative z-10 flex items-center gap-2 font-semibold tracking-tight text-xl">
          <Shield className="w-6 h-6" /> CDCL
        </div>

        <div className="relative z-10 space-y-8">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            Hujum qiling.<br/>Himoya qiling.<br/>O'rganing.
          </h1>
          
          <div className="rounded-xl bg-black/40 backdrop-blur-md p-5 font-mono text-sm space-y-2 border border-white/10 shadow-2xl">
            <p><span className="text-emerald-400">$</span> nmap -sV target.cdcl.local</p>
            <p className="text-white/50">PORT   STATE SERVICE</p>
            <p className="text-white/50">80/tcp open  http</p>
            <p><span className="text-emerald-400">$</span> curl "target/?id=1' OR '1'='1"</p>
            <p className="text-rose-400">flag captured ✓</p>
            <p><span className="text-emerald-400">$</span> <span className="animate-pulse">_</span></p>
          </div>
        </div>

        <p className="relative z-10 text-sm text-white/60 font-medium">
          Raqobatli kiberxavfsizlik laboratoriyasi.
        </p>
      </aside>

      {/* O'ng panel — Kirish formasi */}
      <main className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 font-semibold text-lg mb-6">
              <Shield className="w-5 h-5 text-accent" /> CDCL
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Kirish</h2>
            <p className="text-sm text-muted">Google akkountingiz bilan davom eting.</p>
          </div>

          <button onClick={goGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl
                       border border-border bg-bg px-4 py-3.5 text-sm font-semibold
                       hover:bg-border/30 transition-all duration-200 disabled:opacity-50
                       focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg">
            <GoogleIcon className="w-5 h-5" />
            {loading ? "Yo'naltirilmoqda…" : "Google bilan davom etish"}
          </button>

          <p className="text-xs text-muted text-center leading-relaxed">
            Davom etish orqali siz <a className="underline hover:text-fg transition-colors" href="#">foydalanish shartlari</a>
            {" "}va <a className="underline hover:text-fg transition-colors" href="#">maxfiylik siyosati</a>ga rozilik bildirasiz.
          </p>
        </div>
      </main>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}