"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type PlanePlacementViewerProps = {
  modelSrc: string;
  usdzSrc?: string | null;
  onClose: () => void;
};

type ModelViewerElement = HTMLElement & {
  activateAR?: () => Promise<void> | void;
};

type ViewerStatus = "loading" | "ready" | "launching" | "presenting" | "error";
const quickLookButtonImageSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='196' height='54' viewBox='0 0 196 54'%3E%3Crect width='196' height='54' rx='14' fill='white'/%3E%3Ctext x='98' y='32' text-anchor='middle' font-family='Arial,sans-serif' font-size='15' font-weight='500' letter-spacing='-0.4' fill='black'%3EIniciar AR%3C/text%3E%3C/svg%3E";

function isIOSDevice() {
  return (
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/i.test(navigator.userAgent)
  );
}

function formatPlacementError(error: unknown) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function getAbsoluteAssetUrl(src?: string | null) {
  if (!src || typeof window === "undefined") {
    return src ?? "";
  }

  return new URL(src, window.location.href).toString();
}

async function preloadAssetWithProgress(
  src: string,
  signal: AbortSignal,
  onProgress: (progress: number) => void,
) {
  const response = await fetch(src, {
    cache: "force-cache",
    signal,
  });

  if (!response.ok) {
    throw new Error(`No se pudo cargar el modelo USDZ (${response.status}).`);
  }

  const contentLength = Number(response.headers.get("content-length") ?? 0);

  if (!response.body) {
    await response.blob();
    onProgress(1);
    return;
  }

  const reader = response.body.getReader();
  let receivedLength = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    receivedLength += value.length;

    if (contentLength > 0) {
      onProgress(Math.min(receivedLength / contentLength, 1));
    }
  }

  onProgress(1);
}

export function PlanePlacementViewer({
  modelSrc,
  usdzSrc,
  onClose,
}: PlanePlacementViewerProps) {
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAttemptedLaunch, setHasAttemptedLaunch] = useState(false);
  const [isModelViewerReady, setIsModelViewerReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [status, setStatus] = useState<ViewerStatus>("loading");
  const shouldUseQuickLook = isIOSDevice();
  const quickLookHref = useMemo(() => getAbsoluteAssetUrl(usdzSrc), [usdzSrc]);

  function showError(source: string, error: unknown) {
    const message = `${source}: ${formatPlacementError(error)}`;
    console.error(message, error);
    setErrorMessage(message);
    setStatus("error");
  }

  async function startAR(showErrors = true) {
    const modelViewer = modelViewerRef.current;

    if (!modelViewer?.activateAR) {
      if (showErrors) {
        showError("placement", "El navegador no expuso activateAR().");
      }

      return;
    }

    try {
      setHasAttemptedLaunch(true);
      setStatus("launching");
      await modelViewer.activateAR();
    } catch (error) {
      setStatus("ready");

      if (showErrors) {
        showError("activateAR", error);
      }
    }
  }

  useEffect(() => {
    let isDisposed = false;
    const abortController = new AbortController();

    async function setupModelViewer() {
      if (shouldUseQuickLook) {
        if (!usdzSrc) {
          showError("assets", "En iOS hace falta el modelo USDZ de esta pieza.");
          return;
        }

        try {
          setLoadProgress(0);
          setStatus("loading");
          await preloadAssetWithProgress(
            quickLookHref,
            abortController.signal,
            (progress) => {
              if (!isDisposed) {
                setLoadProgress(progress);
              }
            },
          );

          if (!isDisposed) {
            setStatus("ready");
          }
        } catch (error) {
          if (!isDisposed && !abortController.signal.aborted) {
            showError("usdz preload", error);
          }
        }

        return;
      }

      try {
        await import("@google/model-viewer");

        if (!isDisposed) {
          setIsModelViewerReady(true);
        }
      } catch (error) {
        showError("model-viewer import", error);
      }
    }

    setupModelViewer();

    return () => {
      isDisposed = true;
      abortController.abort();
    };
  }, [quickLookHref, shouldUseQuickLook, usdzSrc]);

  useEffect(() => {
    if (shouldUseQuickLook || !isModelViewerReady) {
      return;
    }

    if (!modelSrc) {
      showError("assets", "No existe el modelo GLB para esta pieza.");
      return;
    }
  }, [isModelViewerReady, modelSrc, shouldUseQuickLook]);

  useEffect(() => {
    if (shouldUseQuickLook || !isModelViewerReady || !modelViewerRef.current) {
      return;
    }

    const modelViewer = modelViewerRef.current;

    function handleLoad() {
      setLoadProgress(1);
      setStatus("ready");
    }

    function handleProgress(event: Event) {
      const progressEvent = event as CustomEvent<{
        totalProgress?: number;
      }>;
      setLoadProgress(progressEvent.detail?.totalProgress ?? 0);
    }

    function handleError(event: Event) {
      showError("model-viewer", event);
    }

    function handleARStatus(event: Event) {
      const arEvent = event as CustomEvent<{ status?: string }>;

      if (arEvent.detail?.status === "session-started") {
        setStatus("presenting");
      }

      if (
        arEvent.detail?.status === "failed" ||
        arEvent.detail?.status === "not-presenting"
      ) {
        setStatus("ready");
      }
    }

    modelViewer.addEventListener("load", handleLoad);
    modelViewer.addEventListener("progress", handleProgress);
    modelViewer.addEventListener("error", handleError);
    modelViewer.addEventListener("ar-status", handleARStatus);

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
      modelViewer.removeEventListener("progress", handleProgress);
      modelViewer.removeEventListener("error", handleError);
      modelViewer.removeEventListener("ar-status", handleARStatus);
    };
  }, [isModelViewerReady, shouldUseQuickLook]);

  const progressPercent = Math.round(loadProgress * 100);
  const canStartAR = status === "ready";
  const loaderText =
    status === "loading"
      ? shouldUseQuickLook
        ? "Descargando pieza 3D para Safari..."
        : "Preparando la pieza para tu entorno..."
      : status === "launching"
        ? "Abriendo experiencia AR..."
        : status === "presenting"
          ? "Experiencia AR activa"
        : "La pieza está lista. Toca Iniciar AR para posicionarla.";

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[110] overflow-hidden bg-[#050505] text-white"
      role="dialog"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.04)_28%,rgba(0,0,0,0)_58%)]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center">
        <p className="text-[0.72rem] font-[400] uppercase tracking-[0.18em] text-white/54">
          Living Nimbo Universe
        </p>
        <h2 className="mt-3 max-w-[17rem] text-[clamp(1.8rem,7vw,2.65rem)] font-[700] uppercase leading-[0.94] tracking-[-0.075em]">
          Posiciona la pieza
          <br />
          en tu entorno
        </h2>

        <div className="mt-8 flex w-full max-w-[17rem] flex-col items-center">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/14">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-300"
              style={{ width: `${Math.max(progressPercent, status === "loading" ? 8 : 100)}%` }}
            />
          </div>

          <p className="mt-4 min-h-[2.4rem] text-[0.95rem] font-[400] leading-tight tracking-[-0.035em] text-white/76">
            {errorMessage ?? loaderText}
          </p>

          {shouldUseQuickLook && canStartAR && usdzSrc && !errorMessage && (
            <a
              aria-label="Iniciar AR"
              className="mt-6 inline-flex h-[2.7rem] w-[9.8rem] items-center justify-center"
              href={quickLookHref}
              rel="ar"
            >
              <img
                alt="Iniciar AR"
                className="h-full w-full rounded-[0.74rem] shadow-[0_0.6rem_1.6rem_rgba(0,0,0,0.22)]"
                src={quickLookButtonImageSrc}
              />
            </a>
          )}

          {!shouldUseQuickLook &&
            (canStartAR || hasAttemptedLaunch) &&
            !errorMessage && (
            <button
              className="mt-6 inline-flex h-[2.7rem] min-w-[9.8rem] items-center justify-center rounded-[0.74rem] bg-white px-6 text-[0.92rem] font-[500] tracking-[-0.035em] text-black"
              onClick={() => startAR(true)}
              type="button"
            >
              Iniciar AR
            </button>
          )}
        </div>
      </div>

      {!shouldUseQuickLook && isModelViewerReady && (
        <model-viewer
          ref={modelViewerRef}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          camera-controls
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
          ios-src={usdzSrc ?? undefined}
          reveal="auto"
          src={modelSrc}
        />
      )}

      <button
        aria-label="Cerrar experiencia de posicionamiento"
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[1.25rem] leading-none text-black shadow-[0_0.6rem_1.6rem_rgba(0,0,0,0.22)]"
        onClick={onClose}
        type="button"
      >
        ×
      </button>
    </div>
  );
}
