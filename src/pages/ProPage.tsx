import { Link } from "react-router-dom";
import { Cpu, Activity, Wrench, ArrowRight } from "lucide-react";

const GUIDES = [
  {
    title: "Kits de Adquisición de Bioseñales",
    description:
      "Combinaciones recomendadas de placas (ESP32/Arduino), sensores ECG/PPG y etapas de filtrado para prácticas y TFG.",
    icon: Activity,
    filterLink: "/",
  },
  {
    title: "Guía de Sensores y Wearables",
    description:
      "Qué tener en cuenta en fotopletismografía (PPG), bioimpedancia (BIA) y validación de dispositivos de medición.",
    icon: Cpu,
    filterLink: "/",
  },
  {
    title: "Setup de Laboratorio y Estudio",
    description:
      "Herramientas de medida, soldadura, cálculo y ergonomía seleccionadas para el día a día en ingeniería.",
    icon: Wrench,
    filterLink: "/",
  },
];

export function ProPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8">
      <div className="mb-10 text-center">
        <span className="inline-block bg-[#0A192F] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
          Recursos Técnicos
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-[#0A192F] sm:text-5xl">
          BIOMEDPRO Guías &amp; Kits
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[#0A192F]/75">
          Selección estructurada de hardware, sensores y material técnico para proyectos, salud y estudio.
        </p>
      </div>

      <div className="space-y-4">
        {GUIDES.map(({ title, description, icon: Icon, filterLink }) => (
          <div
            key={title}
            className="flex flex-col justify-between gap-4 border border-[#0A192F]/15 bg-white p-6 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F6F9] text-[#1D4ED8]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-[#0A192F]">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#0A192F]/75">
                  {description}
                </p>
              </div>
            </div>

            <Link
              to={filterLink}
              className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#0A192F] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#1D4ED8]"
            >
              Ver equipos
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}