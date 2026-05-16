"use client";

import Image, { type StaticImageData } from "next/image";
import dynamic from "next/dynamic";
import { MouseEvent, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const PlanePlacementViewer = dynamic(
  () =>
    import("@/components/ar/plane-placement-viewer").then(
      (module) => module.PlanePlacementViewer,
    ),
  { ssr: false },
);

type NimboStepScreenProps = {
  image: StaticImageData;
  imageAlt: string;
  imageClassName: string;
  placementModelSrc?: string | null;
  placementUsdzSrc?: string | null;
  step: number;
};

const visibleSteps = [2, 5] as const;
const quickLookPreviewImageSrc =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function isIOSDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iPad|iPhone|iPod/i.test(navigator.userAgent);
}

function isAndroidDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android/i.test(navigator.userAgent);
}

function getAbsoluteAssetUrl(src?: string | null) {
  if (!src || typeof window === "undefined") {
    return src ?? "";
  }

  return new URL(src, window.location.href).toString();
}

function getSceneViewerIntentUrl(modelSrc: string) {
  const fileUrl = encodeURIComponent(getAbsoluteAssetUrl(modelSrc));
  const fallbackUrl = encodeURIComponent(window.location.href);

  return `intent://arvr.google.com/scene-viewer/1.0?file=${fileUrl}&mode=ar_preferred&title=Living%20Nimbo%20Universe#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${fallbackUrl};end;`;
}

function SpaceIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 3.8 5.3 7.7v7.8l6.7 3.9 6.7-3.9V7.7L12 3.8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="m5.7 7.9 6.3 3.7 6.3-3.7M12 11.6v7.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function NimboStepScreen({
  image,
  imageAlt,
  imageClassName,
  placementModelSrc,
  placementUsdzSrc,
  step,
}: NimboStepScreenProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);
  const quickLookAnchorRef = useRef<HTMLAnchorElement | null>(null);
  const currentStepIndex = visibleSteps.findIndex(
    (visibleStep) => visibleStep === step,
  );
  const nextVisibleStep = visibleSteps[currentStepIndex + 1];
  const previousVisibleStep = visibleSteps[currentStepIndex - 1];
  const nextHref = nextVisibleStep ? `/steps/${nextVisibleStep}` : "/finish";
  const backHref = previousVisibleStep
    ? `/steps/${previousVisibleStep}`
    : "/start";
  const isArAvailable = Boolean(placementModelSrc || placementUsdzSrc);

  function handleAnimatedNavigation(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (isLeaving) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    setIsLeaving(true);
    window.setTimeout(() => {
      window.location.href = href;
    }, 260);
  }

  function handleOpenNativeAR() {
    if (isIOSDevice()) {
      quickLookAnchorRef.current?.click();
      return;
    }

    if (isAndroidDevice() && placementModelSrc) {
      window.location.href = getSceneViewerIntentUrl(placementModelSrc);
      return;
    }

    setIsPlacementOpen(true);
  }

  return (
    <main className="h-svh overflow-hidden bg-white">
      <section
        key={step}
        className={cn(
          "step-screen-enter relative isolate flex h-svh flex-col items-center justify-center overflow-hidden bg-white px-[8vw] text-center text-black transition-all duration-300 ease-out",
          isLeaving && "-translate-x-5 opacity-0",
        )}
      >
        <div className="absolute inset-x-0 bottom-0 top-[49.6svh] -z-10 rounded-t-[0.25rem] bg-[#0b0b0b]" />

        <div className="step-layer-enter relative z-20">
          <h1 className="text-[clamp(1.75rem,6.1vw,2.25rem)] font-[700] uppercase leading-[1.04] tracking-[-0.075em] max-[370px]:!text-[1.42rem]">
            Encuentra esta pieza
            <br />y traela a la realidad
          </h1>

          <button
            aria-disabled={!isArAvailable}
            className={cn(
              "mt-[0.9rem] inline-flex h-[2.35rem] items-center gap-2 rounded-[0.7rem] bg-black px-4 text-[0.78rem] font-[400] tracking-[-0.035em] text-white transition max-[370px]:h-[2.2rem] max-[370px]:text-[0.72rem]",
              !isArAvailable && "cursor-not-allowed opacity-[0.42]",
            )}
            disabled={!isArAvailable}
            onClick={handleOpenNativeAR}
            type="button"
          >
            <SpaceIcon />
            <span className="text-white/55">›</span>
            Ver en tu espacio
          </button>
        </div>

        <div className="step-layer-enter relative z-10 mx-auto mt-[1.2rem] flex h-[36svh] items-end justify-center [animation-delay:90ms] max-[370px]:h-[31.5svh]">
          <Image
            src={image}
            alt={imageAlt}
            className={cn(
              "h-auto max-h-[36svh] max-w-none object-contain max-[370px]:max-h-[31.5svh]",
              imageClassName,
            )}
            priority
          />
        </div>

        <div className="step-layer-enter mt-[3svh] text-white [animation-delay:160ms]">
          <p className="text-[clamp(1.55rem,5.45vw,2rem)] font-[400] leading-[1.5] tracking-[-0.06em] max-[370px]:!text-[1.2rem]">
            Lo que ves a tu alrededor
            <br />
            no está colocado al azar.
          </p>

          <a
            className="mx-auto mt-[1.7rem] inline-flex h-[2.55rem] min-w-[10.4rem] items-center justify-center rounded-[0.7rem] border-2 border-white bg-transparent px-8 text-[clamp(1.05rem,3.8vw,1.35rem)] font-[400] uppercase tracking-[-0.035em] text-white transition-all hover:bg-white/10 max-[370px]:h-[2.35rem] max-[370px]:!text-[0.95rem]"
            href={nextHref}
            onClick={(event) => handleAnimatedNavigation(event, nextHref)}
          >
            Siguiente
          </a>

          <div className="mt-[0.85rem] flex justify-center gap-[0.22rem]">
            {visibleSteps.map((dotStep) => {
              return (
                <span
                  key={dotStep}
                  className={cn(
                    "h-[0.38rem] w-[0.38rem] rounded-full",
                    dotStep === step ? "bg-white" : "bg-white/42",
                  )}
                />
              );
            })}
          </div>

          <a
            className="mx-auto mt-[0.8rem] inline-flex items-center justify-center text-[0.78rem] font-[400] uppercase tracking-[0.08em] text-white/58 transition hover:text-white"
            href={backHref}
            onClick={(event) => handleAnimatedNavigation(event, backHref)}
          >
            Atrás
          </a>
        </div>
      </section>

      {placementUsdzSrc && (
        <a
          ref={quickLookAnchorRef}
          aria-hidden="true"
          className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
          href={getAbsoluteAssetUrl(placementUsdzSrc)}
          rel="ar"
          tabIndex={-1}
        >
          <img alt="" src={quickLookPreviewImageSrc} />
        </a>
      )}

      {isPlacementOpen && placementModelSrc && (
        <PlanePlacementViewer
          modelSrc={placementModelSrc}
          onClose={() => setIsPlacementOpen(false)}
          usdzSrc={placementUsdzSrc}
        />
      )}
    </main>
  );
}
