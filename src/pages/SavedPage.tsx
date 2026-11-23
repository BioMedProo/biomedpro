import { Link } from "react-router-dom";
import { Bookmark, ExternalLink, Trash2, ArrowRight } from "lucide-react";
import catalogData from "@/data/catalog.json";
import { useApp } from "@/context/AppContext";

interface BioItem {
  id: string;
  name: string;
  category: string;
  tag: string;
  brand: string;
  price: number;
  techNote: string;
  imageUrl?: string;
  buyUrl: string;
}

const AMAZON_ITEM_IMAGES: Record<string, string> = {
  "bio-01": "/images/amazon/bio-01.png",
  "bio-02": "/images/amazon/bio-02.png",
  "bio-03": "/images/amazon/bio-03.png",
  "bio-04": "/images/amazon/bio-04.png",
  "bio-05": "/images/amazon/bio-05.png",
  "bio-06": "/images/amazon/bio-06.png",
  "bio-07": "/images/amazon/bio-07.png",
  "bio-08": "/images/amazon/bio-08.png",
  "bio-09": "/images/amazon/bio-09.png",
  "bio-10": "/images/amazon/bio-10.png",
  "bio-11": "/images/amazon/bio-11.png",
  "bio-12": "/images/amazon/bio-12.png",
  "bio-13": "/images/amazon/bio-13.png",
  "bio-14": "/images/amazon/bio-14.png",
  "bio-15": "/images/amazon/bio-15.png",
  "bio-16": "/images/amazon/bio-16.png",
};

export function SavedPage() {
  const { saved, removeSaved, lookDescription } = useApp() as Record<string, any>;
  const savedList = Array.isArray(saved) ? saved : [];

  const rawCatalog = (catalogData as any)?.default ?? catalogData;
  const catalogItems: BioItem[] = Array.isArray(rawCatalog?.items)
    ? rawCatalog.items
    : [];

  const catalogById = new Map<string, BioItem>(
    catalogItems.map((item) => [item.id, item])
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#0A192F]/15 pb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
            Selección Personal
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-tight text-[#0A192F]">
            Mi Lista BioMedPro
          </h1>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A192F]/70">
          {savedList.length} {savedList.length === 1 ? "elemento" : "elementos"}
        </span>
      </div>

      {savedList.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-[#0A192F]/15 bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F6F9] text-[#1D4ED8]">
            <Bookmark className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0A192F]">
            Aún no tienes equipos guardados
          </h2>
          <p className="mt-2 max-w-md text-sm text-[#0A192F]/75">
            Explora el catálogo de sensores, wearables o material de laboratorio y guarda aquí lo que necesites revisar o comprar en Amazon.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 bg-[#0A192F] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:bg-[#1D4ED8]"
          >
            Ir al catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {savedList.map((entry: any, idx: number) => {
            const firstItem = Array.isArray(entry?.items) ? entry.items[0] : entry;
            const itemId: string | undefined =
              entry?.id ?? firstItem?.id ?? entry?.signature;
            const matchedCatalog = itemId ? catalogById.get(itemId) : undefined;

            const title =
              matchedCatalog?.name ??
              firstItem?.name ??
              (typeof lookDescription === "function" ? lookDescription(entry) : null) ??
              entry?.title ??
              "Equipo BioMedPro";

            const brand = matchedCatalog?.brand ?? firstItem?.brand ?? "BioMedPro";
            const tag = matchedCatalog?.tag ?? firstItem?.tag ?? "Guardado";
            const techNote = matchedCatalog?.techNote ?? firstItem?.techNote;
            const priceValue = Number(matchedCatalog?.price ?? firstItem?.price ?? 0);
            const buyUrl = matchedCatalog?.buyUrl ?? firstItem?.buyUrl ?? entry?.buyUrl;

            const imageUrl =
              (itemId && AMAZON_ITEM_IMAGES[itemId]) ||
              matchedCatalog?.imageUrl ||
              firstItem?.imageUrl ||
              entry?.imageUrl ||
              "/images/hero-biomed.png";

            const removeKey = entry?.id ?? itemId ?? String(idx);

            return (
              <article
                key={removeKey}
                className="group flex flex-col justify-between border border-[#0A192F]/15 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0A192F] hover:shadow-[0_14px_30px_-10px_rgba(10,25,47,0.16)]"
              >
                <div>
                  <div className="relative aspect-square w-full overflow-hidden bg-[#F4F6F9] p-4">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 bg-[#0A192F] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {tag}
                    </span>
                  </div>

                  <div className="space-y-2.5 p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1D4ED8]">
                      {brand}
                    </div>
                    <h3 className="font-display text-base font-bold leading-snug text-[#0A192F]">
                      {title}
                    </h3>
                    {techNote && (
                      <p className="border-l-2 border-[#0A192F]/25 pl-2.5 text-xs leading-relaxed text-[#0A192F]/75">
                        {techNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-[#0A192F]/10 bg-[#F4F6F9]/70 px-4 py-3">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#0A192F]/60">
                      Ref. aprox.
                    </span>
                    <span className="font-display text-base font-bold text-[#0A192F]">
                      {priceValue.toFixed(2)} €
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => typeof removeSaved === "function" && removeSaved(removeKey)}
                      title="Quitar de la lista"
                      className="inline-flex h-9 items-center gap-1.5 border border-[#0A192F]/20 bg-white px-3 text-xs font-medium text-[#0A192F]/80 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Quitar
                    </button>

                    {buyUrl && (
                      <a
                        href={buyUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="group/link inline-flex h-9 items-center gap-1.5 bg-[#0A192F] px-3.5 text-[11px] font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#1D4ED8] active:scale-95"
                      >
                        Amazon
                        <ExternalLink className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}