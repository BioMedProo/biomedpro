import { NavLink } from "react-router-dom";
import { Cpu, Bookmark, Layers } from "lucide-react";
import { useApp } from "@/context/AppContext";

const navItems = [
  { to: "/", label: "Catálogo", icon: Cpu },
  { to: "/guardados", label: "Mi Lista", icon: Bookmark },
  { to: "/pro", label: "Kits", icon: Layers },
];

export function BottomNav() {
  const { saved } = useApp();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0A192F]/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegación móvil"
    >
      <div className="mx-auto flex w-full max-w-md items-stretch justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-[0.16em] transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-300/70 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {to === "/guardados" && saved.length > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1D4ED8] px-1 text-[9px] font-bold text-white">
                      {saved.length}
                    </span>
                  )}
                </span>
                <span className={isActive ? "font-semibold" : ""}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}