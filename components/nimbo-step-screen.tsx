"use client";

import { doc, onSnapshot } from "firebase/firestore";
import Image, { type StaticImageData } from "next/image";
import dynamic from "next/dynamic";
import { MouseEvent, useEffect, useState } from "react";

import {
  AR_CONFIG_COLLECTION,
  AR_CONFIG_DOC_ID,
  getARActiveTargetId,
  getARTargetSrc,
} from "@/lib/ar-targets";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const LivingImageViewer = dynamic(
  () =>
    import("@/components/ar/living-image-viewer").then(
      (module) => module.LivingImageViewer,
    ),
  { ssr: false },
);

const PlanePlacementViewer = dynamic(
  () =>
    import("@/components/ar/plane-placement-viewer").then(
      (module) => module.PlanePlacementViewer,
    ),
  { ssr: false },
);

type NimboStepScreenProps = {
  arModelSrc?: string | null;
  arTargetSrc: string;
  image: StaticImageData;
  imageAlt: string;
  imageClassName: string;
  placementModelSrc?: string | null;
  placementUsdzSrc?: string | null;
  step: number;
};

const totalSteps = 5;

function isIOSChromeBrowser() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return (
    /CriOS/i.test(navigator.userAgent) &&
    /iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
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
  arModelSrc,
  arTargetSrc,
  image,
  imageAlt,
  imageClassName,
  placementModelSrc,
  placementUsdzSrc,
  step,
}: NimboStepScreenProps) {
  const [isArOpen, setIsArOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isPlacementOpen, setIsPlacementOpen] = useState(false);
  const [isSafariNoticeOpen, setIsSafariNoticeOpen] = useState(false);
  const [hasCopiedSafariLink, setHasCopiedSafariLink] = useState(false);
  const [resolvedArTargetSrc, setResolvedArTargetSrc] = useState(arTargetSrc);
  const nextStep = step + 1;
  const nextHref = step < totalSteps ? `/steps/${nextStep}` : "/finish";
  const backHref = step > 1 ? `/steps/${step - 1}` : "/start";
  const isArAvailable = Boolean(arModelSrc);

  useEffect(() => {
    setResolvedArTargetSrc(arTargetSrc);

    const configRef = doc(db, AR_CONFIG_COLLECTION, AR_CONFIG_DOC_ID);
    const unsubscribe = onSnapshot(
      configRef,
      (snapshot) => {
        const activeTargetId = getARActiveTargetId(
          snapshot.data()?.activeTarget,
        );

        setResolvedArTargetSrc(getARTargetSrc(activeTargetId));
      },
      (error) => {
        console.error("Error loading AR target config", error);
        setResolvedArTargetSrc(arTargetSrc);
      },
    );

    return unsubscribe;
  }, [arTargetSrc]);

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

  function handleOpenPlacement() {
    if (isIOSChromeBrowser()) {
      setIsArOpen(false);
      setIsSafariNoticeOpen(true);
      setHasCopiedSafariLink(false);
      return;
    }

    setIsArOpen(false);

    window.setTimeout(() => {
      setIsPlacementOpen(true);
    }, 180);
  }

  async function handleOpenSafariInstructions() {
    const safariUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(safariUrl);
      setHasCopiedSafariLink(true);
    } catch {
      setHasCopiedSafariLink(false);
    }
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
            onClick={() => setIsArOpen(true)}
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
            {Array.from({ length: totalSteps }, (_, index) => {
              const dotStep = index + 1;

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

      {isArOpen && arModelSrc && (
        <LivingImageViewer
          modelSrc={arModelSrc}
          onClose={() => setIsArOpen(false)}
          onOpenPlacement={handleOpenPlacement}
          placementModelSrc={placementModelSrc}
          placementUsdzSrc={placementUsdzSrc}
          targetSrc={resolvedArTargetSrc}
        />
      )}

      {isPlacementOpen && placementModelSrc && (
        <PlanePlacementViewer
          modelSrc={placementModelSrc}
          onClose={() => setIsPlacementOpen(false)}
          usdzSrc={placementUsdzSrc}
        />
      )}

      {isSafariNoticeOpen && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/72 px-6 text-center text-white"
          role="dialog"
        >
          <div className="w-full max-w-[19rem] rounded-[1.15rem] bg-white px-6 py-7 text-black shadow-[0_1.2rem_3rem_rgba(0,0,0,0.32)]">
            <p className="text-[0.72rem] font-[500] uppercase tracking-[0.16em] text-black/45">
              Living Nimbo Universe
            </p>
            <h2 className="mt-3 text-[1.65rem] font-[700] uppercase leading-[0.94] tracking-[-0.075em]">
              Abre esta experiencia en Safari
            </h2>
            <p className="mt-4 text-[0.95rem] leading-snug tracking-[-0.035em] text-black/64">
              En iPhone, Chrome no puede abrir esta experiencia AR de forma
              confiable. Copiaremos el enlace para que lo pegues en Safari.
            </p>

            <button
              className="mt-6 inline-flex h-[2.7rem] w-full items-center justify-center rounded-[0.78rem] bg-black px-5 text-[0.95rem] font-[500] tracking-[-0.035em] text-white"
              onClick={handleOpenSafariInstructions}
              type="button"
            >
              {hasCopiedSafariLink ? "Link copiado" : "Abrir en Safari"}
            </button>

            {hasCopiedSafariLink && (
              <p className="mt-3 text-[0.78rem] leading-tight tracking-[-0.025em] text-black/52">
                Ahora abre Safari y pega el enlace en la barra de dirección.
              </p>
            )}

            <button
              className="mt-5 text-[0.78rem] font-[500] uppercase tracking-[0.08em] text-black/46"
              onClick={() => setIsSafariNoticeOpen(false)}
              type="button"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
