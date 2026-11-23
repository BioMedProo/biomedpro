import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Look } from "@/lib/generateLook";
import { APP_NAME, SHARE_FOOTER_URL, colorHex, occasionLabel } from "@/data/config";
import { track } from "@/hooks/useLocalStorage";

const preloadImage = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (img.decode) {
        img.decode().then(() => resolve()).catch(() => resolve());
      } else {
        resolve();
      }
    };
    img.onerror = reject;
    img.src = src;
  });

export function useShareCard() {
  const [currentLook, setCurrentLook] = useState<Look | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const capture = async (look: Look, isPro: boolean): Promise<Blob | null> => {
    setCurrentLook(look);
    await new Promise((r) => setTimeout(r, 80));

    const urls = look.items.map((i) => i.imageUrl);
    try {
      await Promise.all(urls.map(preloadImage));
    } catch {
      /* seguimos aunque alguna falle; hay fallback en el collage */
    }

    const node = containerRef.current;
    if (!node) return null;

    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 1,
        cacheBust: true,
        width: 1080,
        height: 1920,
      });
      const res = await fetch(dataUrl);
      return await res.blob();
    } catch (e) {
      console.debug("capture error", e);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const share = async (look: Look, isPro: boolean): Promise<boolean> => {
    setIsCapturing(true);
    track("share_clicked", { signature: look.signature });
    const blob = await capture(look, isPro);
    if (!blob) {
      return false;
    }
    const file = new File([blob], "lookbook-look.png", { type: "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (data: { files?: File[] }) => boolean;
    };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: look.title });
        return true;
      } catch {
        return false;
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lookbook-look.png";
    a.click();
    URL.revokeObjectURL(url);
    return true;
  };

  const ShareCard = isCapturing || currentLook ? renderShareCard(currentLook, isPro, containerRef) : null;

  return { share, ShareCard, isCapturing };
}

function renderShareCard(
  look: Look | null,
  isPro: boolean,
  ref: React.RefObject<HTMLDivElement>,
) {
  if (!look) return null;
  const items = look.items;
  const isDress = items.some((i) => i.category === "dress");

  const layout = isDress
    ? [
        { cat: "dress", w: 500, top: 380, left: 290, rot: -2 },
        { cat: "shoes", w: 300, top: 1160, left: 220, rot: 3 },
        { cat: "bag", w: 280, top: 1140, left: 620, rot: -3 },
        { cat: "accessory", w: 190, top: 1420, left: 450, rot: 2 },
      ]
    : [
        { cat: "top", w: 400, top: 400, left: 340, rot: -2 },
        { cat: "bottom", w: 440, top: 760, left: 320, rot: 2 },
        { cat: "shoes", w: 290, top: 1180, left: 220, rot: -3 },
        { cat: "bag", w: 270, top: 1160, left: 630, rot: 3 },
        { cat: "accessory", w: 180, top: 1450, left: 450, rot: -2 },
      ];

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: "-9999px",
        top: 0,
        width: 1080,
        height: 1920,
        backgroundColor: "#F4EFE8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Georgia, serif",
      }}
      aria-hidden="true"
    >
      <div style={{ marginTop: 140, fontSize: 40, letterSpacing: 8, color: "#151515" }}>
        {APP_NAME}
      </div>
      <div style={{ marginTop: 40, fontSize: 72, fontWeight: 600, color: "#151515" }}>
        {look.title}
      </div>
      <div style={{ marginTop: 20, fontSize: 32, color: "#6B6B6B", fontFamily: "Inter, sans-serif" }}>
        {look.occasion ? occasionLabel(look.occasion) : "Look"}
      </div>
      <div style={{ position: "relative", width: 1080, height: 1200, marginTop: 60 }}>
        {layout.map((slot, idx) => {
          const item = items.find((i) => i.category === slot.cat);
          if (!item) return null;
          return (
            <img
              key={item.id}
              src={item.imageUrl}
              alt=""
              crossOrigin="anonymous"
              style={{
                position: "absolute",
                width: slot.w,
                top: slot.top - 200,
                left: slot.left,
                transform: `rotate(${slot.rot}deg)`,
                objectFit: "cover",
                zIndex: idx,
              }}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
        {look.usedColors.map((c) => (
          <span
            key={c}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              backgroundColor: colorHex(c),
              border: "2px solid #FFFFFF",
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: "auto",
          marginBottom: 120,
          fontSize: 28,
          letterSpacing: 4,
          color: "#6B6B6B",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {isPro ? (
          `${APP_NAME} · ${SHARE_FOOTER_URL}`
        ) : (
          <>
            {APP_NAME} <span style={{ opacity: 0.6 }}>· {SHARE_FOOTER_URL}</span>
          </>
        )}
      </div>
    </div>
  );
}

