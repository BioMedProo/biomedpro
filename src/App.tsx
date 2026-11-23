import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import { Bookmark, Sparkles } from "lucide-react";
import { AppProvider, useApp } from "@/context/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { InstallBanner } from "@/components/InstallBanner";
import { CreatePage } from "@/pages/CreatePage";
import { SavedPage } from "@/pages/SavedPage";
import { ProPage } from "@/pages/ProPage";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function IndustrialHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { saved } = useApp();
  const [selectedNav, setSelectedNav] = useState<"catalogo" | "areas" | "kits">(
    pathname === "/pro" ? "kits" : "catalogo"
  );

  useEffect(() => {
    if (pathname === "/pro") {
      setSelectedNav("kits");
    } else if (pathname === "/" && selectedNav === "kits") {
      setSelectedNav("catalogo");
    }
  }, [pathname, selectedNav]);

  const activeUnderline =
    "text-[#1D4ED8] underline underline-offset-8 decoration-2";
  const inactiveStyle = "text-[#0A192F]/75 hover:text-[#0A192F]";

  const handleCatalogClick = () => {
    setSelectedNav("catalogo");
  };

  const handleAreasClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelectedNav("areas");

    if (pathname === "/") {
      document.getElementById("areas")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("areas")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  };

  const handleKitsClick = () => {
    setSelectedNav("kits");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#0A192F]/15 bg-white/95 backdrop-blur-md">
      <div className="bg-[#0A192F] px-4 py-1.5 text-center text-[10px] uppercase tracking-[0.25em] text-slate-200">
        Equipamiento biomédico · Sensores · Wearables · Selección de ingeniería
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-4 sm:px-8">
        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
          <Link
            to="/"
            onClick={handleCatalogClick}
            className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
              pathname === "/" && selectedNav === "catalogo"
                ? activeUnderline
                : inactiveStyle
            }`}
          >
            Catálogo
          </Link>

          <a
            href="/#areas"
            onClick={handleAreasClick}
            className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
              pathname === "/" && selectedNav === "areas"
                ? activeUnderline
                : inactiveStyle
            }`}
          >
            Áreas
          </a>

          <Link
            to="/pro"
            onClick={handleKitsClick}
            className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
              pathname === "/pro" ? activeUnderline : inactiveStyle
            }`}
          >
            Kits TFG
          </Link>
        </nav>

        <div className="flex md:hidden">
          <Link
            to="/"
            onClick={handleCatalogClick}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A192F]"
          >
            Catálogo
          </Link>
        </div>

        <div className="text-center">
          <Link
            to="/"
            onClick={handleCatalogClick}
            className="font-display text-xl font-bold tracking-[0.22em] text-[#0A192F] sm:text-2xl md:text-3xl"
          >
            BIOMEDPRO
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4 sm:gap-6">
          <Link
            to="/pro"
            onClick={handleKitsClick}
            className="hidden items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[#0A192F]/80 transition-colors hover:text-[#1D4ED8] sm:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#1D4ED8]" />
            Guías
          </Link>

          <Link
            to="/guardados"
            className="inline-flex items-center gap-2 border border-[#0A192F]/20 bg-[#F4F6F9] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A192F] transition-colors hover:border-[#0A192F] hover:bg-[#0A192F] hover:text-white"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Lista</span>
            <span>({saved.length})</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function EditorialFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0A192F] text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-10 sm:px-8 md:flex-row md:items-center">
        <div>
          <p className="font-display text-xl font-bold tracking-[0.22em]">BIOMEDPRO</p>
          <p className="mt-1 text-xs text-slate-300/80">
            Curaduría técnica de hardware biomédico, salud personal y equipamiento de estudio.
          </p>
        </div>

        <p className="max-w-md text-[11px] leading-relaxed text-slate-300/70">
          En calidad de Afiliado de Amazon, BioMedPro obtiene ingresos por las compras adscritas que cumplen los requisitos aplicables, sin coste adicional para el usuario.
        </p>
      </div>
    </footer>
  );
}

function Shell() {
  const { looksGenerated } = useApp();

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F4F6F9] text-[#0A192F] pb-16 md:pb-0">
      <ScrollToTop />
      <IndustrialHeader />

      <main className="w-full flex-1">
        <Routes>
          <Route path="/" element={<CreatePage />} />
          <Route path="/guardados" element={<SavedPage />} />
          <Route path="/pro" element={<ProPage />} />
        </Routes>
      </main>

      <EditorialFooter />
      <BottomNav />
      <InstallBanner enabled={looksGenerated >= 3} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AppProvider>
  );
}