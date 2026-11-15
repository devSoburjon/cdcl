import { LogOut, LayoutGrid, ShieldAlert } from "lucide-react";
import type { User } from "../App";

export default function Dashboard({ user }: { user: User }) {
  async function logout() {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    await fetch(`${apiUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <header className="border-b border-border bg-bg/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold tracking-tight text-lg">
            <ShieldAlert className="w-5 h-5 text-accent" /> CDCL
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full border border-border" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-sm">
                <p className="font-medium leading-none">{user.name}</p>
                <p className="text-muted text-xs mt-1">@{user.username}</p>
              </div>
            </div>
            
            <button onClick={logout} 
              className="p-2 text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
              title="Chiqish">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Xush kelibsiz, {user.name.split(" ")[0]}</h1>
            <p className="text-muted mt-2">Laboratoriyani tanlang va jangni boshlang.</p>
          </div>

          <div className="border border-dashed border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <LayoutGrid className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Hozircha laboratoriyalar yo'q</h2>
            <p className="text-muted text-sm max-w-md mx-auto mb-6">
              Admin panel orqali birinchi laboratoriya saytini qo'shishingiz mumkin. Qo'shilgach, ular shu yerda kartochkalar ko'rinishida paydo bo'ladi.
            </p>
            
            {user.role === "admin" && (
              <button className="bg-accent text-accent-fg px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Admin panelga o'tish
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}