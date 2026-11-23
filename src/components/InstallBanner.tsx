import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, MonitorSmartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "lookbook.installDismissed";

export function InstallBanner({ enabled }: { enabled: boolean }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const shownRef = useRef(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (!enabled || shownRef.current) return;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) return;
    if (deferred || /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      shownRef.current = true;
      setVisible(true);
    }
  }, [enabled, deferred]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* noop */
    }
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      dismiss();
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div
      className="fixed bottom-20 left-1/2 z-40 w-[calc(100%-2rem)] max-w-[448px] -translate-x-1/2 rounded-lg border border-line bg-white/95 px-4 py-3 shadow-sm backdrop-blur"
      role="dialog"
      aria-label="Instalar app"
    >
      <div className="flex items-start gap-3">
        <MonitorSmartphone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink">Instala LOOKBOOK</p>
          {isIOS ? (
            <p className="mt-0.5 text-xs text-muted">
              Compartir &gt; Añadir a pantalla de inicio
            </p>
          ) : (
            <button
              onClick={install}
              className="mt-1 min-h-[44px] rounded border border-accent px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white"
            >
              Instalar app
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Cerrar aviso de instalación"
          className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center text-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
