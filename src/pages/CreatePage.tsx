import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
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

const FILTER_TABS = [
  { id: "all", label: "Todos los equipos" },
  { id: "prototipado", label: "Prototipado & Sensores" },
  { id: "wearables", label: "Salud & Wearables" },
  { id: "biomecanica", label: "Biomecánica & Rehab" },
  { id: "estudio", label: "Setup & Estudio" },
];

const AREAS_LIST = [
  {
    title: "Prototipado & Sensores",
    desc: "Adquisición de bioseñales, placas de desarrollo y módulos para prácticas y proyectos técnicos.",
    image: "/images/pilar-prototipado.png",
    cat: "prototipado",
  },
  {
    title: "Salud & Wearables",
    desc: "Dispositivos de monitorización cardiovascular, oximetría y control biométrico.",
    image: "/images/pilar-wearables.png",
    cat: "wearables",
  },
  {
    title: "Biomecánica & Rehab",
    desc: "Electroestimulación, recuperación muscular, instrumentación y ergonomía de estudio.",
    image: "/images/pilar-biomecanica.png",
    cat: "biomecanica",
  },
];

const FAQ_ITEMS = [
  {
    q: "¿Qué diferencia hay entre un módulo sensor (AD8232 / MAX30102) y un equipo clínico cerrado?",
    a: "Los módulos están pensados para prototipado e ingeniería: entregan la señal analógica o digital (I2C) para que tú programes el filtrado y el procesado en microcontroladores como ESP32. Los equipos cerrados (tensiómetros, pulsioxímetros) incluyen algoritmos ya validados y aislamiento eléctrico para uso directo.",
  },
  {
    q: "¿Necesito soldar los pines de los sensores biomédicos para usarlos en protoboard?",
    a: "La mayoría de placas breakout incluyen las tiras de pines sin soldar para que puedas elegir orientación. Con una estación de soldadura regulable básica se dejan listos en menos de 2 minutos para pinchar directamente en protoboard.",
  },
  {
    q: "¿Cómo se selecciona el equipamiento de BioMedPro?",
    a: "Filtramos componentes y dispositivos priorizando hojas de datos claras, compatibilidad estándar (3.3V/5V, I2C, protocolos clínicos validados) y buena relación precisión-precio para estudiantes, investigadores y divulgación médica.",
  },
  {
    q: "¿Dónde se realiza la compra y qué garantía tienen los productos?",
    a: "Todos los enlaces dirigen directamente a Amazon España para que compres con envío rápido, gestión de devoluciones habitual y garantía oficial del fabricante.",
  },
];

// 1. LAS 2 IMÁGENES DE PORTADA
const HERO_IMAGE = "/images/hero-biomed.png";
const PRECISION_BANNER_IMAGE = "/images/precision-biomed.png";

// 2. LAS 16 IMÁGENES DE PRODUCTOS DE AMAZON (coinciden con bio-01 .. bio-16 de catalog.json)
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

export function CreatePage() {
  const { saved, toggleSave } = useApp();
  const rawCatalog = (catalogData as any)?.default ?? catalogData;

  const allItems: BioItem[] = Array.isArray(rawCatalog?.items)
    ? rawCatalog.items
    : [];

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchPrice = maxBudget === null || item.price <= maxBudget;
      return matchCat && matchPrice;
    });
  }, [allItems, selectedCategory, maxBudget]);

  const isItemSaved = (itemId: string) => {
    return (
      Array.isArray(saved) &&
      saved.some((entry: any) => {
        const firstItem = Array.isArray(entry?.items) ? entry.items[0] : entry;
        return entry?.id === itemId || firstItem?.id === itemId;
      })
    );
  };

  const handleSaveItem = (item: BioItem) => {
    const resolvedImage = AMAZON_ITEM_IMAGES[item.id] ?? item.imageUrl;
    const enrichedItem = { ...item, imageUrl: resolvedImage };

    toggleSave({
      id: item.id,
      signature: item.id,
      title: item.name,
      imageUrl: resolvedImage,
      items: [enrichedItem],
    } as any);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const catalogSection = document.getElementById("catalogo-productos");
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      {/* 1. HERO TÉCNICO EN BLANCO Y AZUL MARINO */}
      <section className="relative overflow-hidden bg-white px-4 pt-8 pb-12 sm:px-8 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="animate-fade-up flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-[220px] text-[11px] font-semibold uppercase leading-snug tracking-[0.2em] text-[#0A192F]/80">
              La precisión empieza en cada sensor
            </p>
            <span className="inline-flex items-center gap-2 border border-[#0A192F]/20 bg-[#F4F6F9] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#1D4ED8]" />
              Selección Técnica 2026
            </span>
          </div>

          <div className="relative my-6 flex min-h-[260px] items-center justify-center sm:my-8 sm:min-h-[380px]">
            <h1
              aria-label="BioMedPro"
              className="animate-fade-up animate-delay-100 pointer-events-none select-none text-center font-display text-[21vw] font-bold uppercase leading-none tracking-[-0.03em] text-[#0A192F] sm:text-[17vw] lg:text-[13.5rem]"
            >
              BIOMED
            </h1>

            <div className="animate-fade-up animate-delay-100 relative z-10 w-56 sm:w-72 md:w-80">
              <img
                src={HERO_IMAGE}
                alt="Hardware de adquisición biomédica"
                fetchPriority="high"
                decoding="sync"
                className="animate-float-slow aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="animate-fade-up animate-delay-300 mt-4 flex flex-col items-start justify-between gap-6 border-t border-[#0A192F]/15 pt-6 md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#catalogo-productos"
                className="group inline-flex items-center gap-2 bg-[#0A192F] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1D4ED8] hover:shadow-md active:scale-95"
              >
                Explorar catálogo
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <button
                type="button"
                onClick={() => handleSelectCategory("prototipado")}
                className="inline-flex items-center gap-2 border border-[#0A192F]/30 bg-transparent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0A192F] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0A192F] hover:bg-[#0A192F]/5 active:scale-95"
              >
                Configurar kit TFG
              </button>
            </div>

            <p className="max-w-xs text-right text-[11px] font-medium uppercase leading-relaxed tracking-[0.16em] text-[#0A192F]/75">
              Hardware, wearables y equipamiento validado con criterio de ingeniería biomédica.
            </p>
          </div>
        </div>
      </section>

      {/* 2. BLOQUE DIVIDIDO «PRECISIÓN EN CADA DETALLE» */}
      <section className="group overflow-hidden border-b border-[#0A192F]/15 bg-[#E8ECF2]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center lg:grid-cols-12">
          <div className="space-y-5 px-6 py-12 sm:px-10 lg:col-span-6 lg:py-16">
            <span className="inline-block bg-[#0A192F] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              Criterio Técnico
            </span>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-[#0A192F] sm:text-5xl">
              Precisión en cada detalle
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-[#0A192F]/80 sm:text-base">
              Evita compras incompatibles o dispositivos sin rigor. Cada pieza incluye una nota técnica sobre resolución de sensor, filtrado o aplicación real en laboratorio y salud.
            </p>
            <div className="pt-2">
              <a
                href="#catalogo-productos"
                className="group/btn inline-flex items-center gap-2 bg-[#1D4ED8] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0A192F] hover:shadow-md active:scale-95"
              >
                Filtrar por objetivo
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="h-full min-h-[280px] overflow-hidden bg-[#0A192F] lg:col-span-6">
            <img
              src={PRECISION_BANNER_IMAGE}
              alt="Detalle de instrumentación biomédica"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 3. TRES ÁREAS / PILARES */}
      <section
        id="areas"
        className="scroll-mt-20 border-b border-[#0A192F]/15 bg-white px-4 py-14 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
              Especialidades
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-[#0A192F] sm:text-3xl">
              Áreas de Aplicación
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {AREAS_LIST.map((pilar) => (
              <button
                key={pilar.title}
                type="button"
                onClick={() => handleSelectCategory(pilar.cat)}
                className="group flex flex-col overflow-hidden border border-[#0A192F]/15 bg-[#F4F6F9] text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#0A192F] hover:shadow-md"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#0A192F]">
                  <img
                    src={pilar.image}
                    alt={pilar.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0A192F] transition-colors group-hover:text-[#1D4ED8]">
                      {pilar.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#0A192F]/75 sm:text-sm">
                      {pilar.desc}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A192F] group-hover:text-[#1D4ED8]">
                    Ver área
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CATÁLOGO DE PRODUCTOS */}
      <section
        id="catalogo-productos"
        className="scroll-mt-20 mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#0A192F]/15 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
              Selección Curada
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-[#0A192F] sm:text-3xl">
              Equipamiento Recomendado
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0A192F]/70">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Presupuesto:
            </span>
            {[
              { label: "Todos", value: null },
              { label: "< 30 €", value: 30 },
              { label: "< 60 €", value: 60 },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setMaxBudget(b.value)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                  maxBudget === b.value
                    ? "bg-[#0A192F] text-white shadow-sm"
                    : "bg-white text-[#0A192F] hover:-translate-y-0.5 hover:bg-slate-100"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          {FILTER_TABS.map((tab) => {
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`whitespace-nowrap px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-200 active:scale-95 ${
                  active
                    ? "bg-[#0A192F] text-white shadow-sm"
                    : "border border-[#0A192F]/15 bg-white text-[#0A192F] hover:-translate-y-0.5 hover:border-[#0A192F]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item, idx) => {
            const isSaved = isItemSaved(item.id);
            const productImage = AMAZON_ITEM_IMAGES[item.id] ?? item.imageUrl;
            return (
              <article
                key={`${selectedCategory}-${maxBudget}-${item.id}`}
                style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
                className="animate-fade-up group flex flex-col justify-between border border-[#0A192F]/15 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0A192F] hover:shadow-[0_14px_30px_-10px_rgba(10,25,47,0.16)]"
              >
                <div>
                  <div className="relative aspect-square w-full overflow-hidden bg-[#F4F6F9] p-4">
                    <img
                      src={productImage}
                      alt={item.name}
                      className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 bg-[#0A192F] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white transition-colors duration-300 group-hover:bg-[#1D4ED8]">
                      {item.tag}
                    </span>
                  </div>

                  <div className="space-y-2.5 p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1D4ED8]">
                      {item.brand}
                    </div>
                    <h3 className="font-display text-base font-bold leading-snug text-[#0A192F] transition-colors duration-200 group-hover:text-[#1D4ED8]">
                      {item.name}
                    </h3>
                    <p className="border-l-2 border-[#0A192F]/25 pl-2.5 text-xs leading-relaxed text-[#0A192F]/75 transition-colors duration-200 group-hover:border-[#1D4ED8]">
                      {item.techNote}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-[#0A192F]/10 bg-[#F4F6F9]/70 px-4 py-3">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-[#0A192F]/60">
                      Ref. aprox.
                    </span>
                    <span className="font-display text-base font-bold text-[#0A192F]">
                      {Number(item.price || 0).toFixed(2)} €
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveItem(item)}
                      title="Guardar en mi lista"
                      className={`flex h-9 w-9 items-center justify-center border transition-all duration-200 active:scale-90 ${
                        isSaved
                          ? "border-[#1D4ED8] bg-[#1D4ED8] text-white"
                          : "border-[#0A192F]/20 bg-white text-[#0A192F] hover:border-[#0A192F]"
                      }`}
                    >
                      {isSaved ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>

                    <a
                      href={item.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="group/link inline-flex h-9 items-center gap-1.5 bg-[#0A192F] px-3.5 text-[11px] font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#1D4ED8] active:scale-95"
                    >
                      Amazon
                      <ExternalLink className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. PREGUNTAS FRECUENTES TÉCNICAS */}
      <section className="border-t border-[#0A192F]/15 bg-white px-4 py-14 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1D4ED8]">
              Dudas Habituales
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-[#0A192F] sm:text-3xl">
              Criterios Técnicos y Compra
            </h2>
          </div>

          <div className="divide-y divide-[#0A192F]/15 border border-[#0A192F]/15">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.q} className="bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#F4F6F9]/60"
                  >
                    <span className="font-display text-sm font-bold text-[#0A192F] sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#1D4ED8] transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs leading-relaxed text-[#0A192F]/80 sm:text-sm">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}