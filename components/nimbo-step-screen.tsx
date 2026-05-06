"use client";

import Image, { type StaticImageData } from "next/image";
import { MouseEvent, useState } from "react";

import { cn } from "@/lib/utils";

type NimboStepScreenProps = {
  image: StaticImageData;
  imageAlt: string;
  imageClassName: string;
  step: number;
};

const totalSteps = 5;

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
  step,
}: NimboStepScreenProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const nextStep = step + 1;
  const nextHref = step < totalSteps ? `/steps/${nextStep}` : "/finish";
  const backHref = step > 1 ? `/steps/${step - 1}` : "/start";

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

  return (
    <main className="min-h-svh overflow-hidden bg-white">
      <section
        key={step}
        className={cn(
          "step-screen-enter relative isolate min-h-svh overflow-hidden bg-white px-[8vw] text-center text-black transition-all duration-300 ease-out",
          isLeaving && "-translate-x-5 opacity-0",
        )}
      >
        <div className="absolute inset-x-0 bottom-0 top-[49.6svh] -z-10 rounded-t-[0.25rem] bg-[#0b0b0b]" />

        <div className="step-layer-enter relative z-20 pt-[14.2svh]">
          <h1 className="text-[clamp(1.75rem,6.1vw,2.25rem)] font-[700] uppercase leading-[1.04] tracking-[-0.075em]">
            Encuentra esta pieza
            <br />y traela a la realidad
          </h1>

          <button
            className="mt-[1.35rem] inline-flex h-[2.45rem] items-center gap-2 rounded-[0.7rem] bg-black px-4 text-[0.78rem] font-[400] tracking-[-0.035em] text-white"
            type="button"
          >
            <SpaceIcon />
            <span className="text-white/55">›</span>
            Ver en tu espacio
          </button>
        </div>

        <div className="step-layer-enter relative z-10 mx-auto mt-[2.1rem] flex h-[28svh] items-end justify-center [animation-delay:90ms]">
          <Image
            src={image}
            alt={imageAlt}
            className={cn(
              "h-auto max-h-[28svh] max-w-none object-contain",
              imageClassName,
            )}
            priority
          />
        </div>

        <div className="step-layer-enter mt-[5.2svh] text-white [animation-delay:160ms]">
          <p className="text-[clamp(1.55rem,5.45vw,2rem)] font-[400] leading-[1.58] tracking-[-0.06em]">
            Lo que ves a tu alrededor
            <br />
            no está colocado al azar.
          </p>

          <a
            className="mx-auto mt-[6.2svh] inline-flex h-[2.7rem] min-w-[10.8rem] items-center justify-center rounded-[0.7rem] border-2 border-white bg-transparent px-8 text-[clamp(1.05rem,3.8vw,1.35rem)] font-[400] uppercase tracking-[-0.035em] text-white transition-all hover:bg-white/10"
            href={nextHref}
            onClick={(event) => handleAnimatedNavigation(event, nextHref)}
          >
            Siguiente
          </a>

          <div className="mt-[1.3rem] flex justify-center gap-[0.22rem]">
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
            className="mx-auto mt-[1.15rem] inline-flex items-center justify-center text-[0.82rem] font-[400] uppercase tracking-[0.08em] text-white/58 transition hover:text-white"
            href={backHref}
            onClick={(event) => handleAnimatedNavigation(event, backHref)}
          >
            Atrás
          </a>
        </div>
      </section>
    </main>
  );
}
