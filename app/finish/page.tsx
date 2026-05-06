import bgStartImage from "@/assets/bg-start.png";

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        width="17"
        height="17"
        x="3.5"
        y="3.5"
        stroke="currentColor"
        strokeWidth="1.9"
        rx="5"
      />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default function FinishPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-black">
      <section
        className="relative isolate flex min-h-svh w-full flex-col items-center overflow-hidden bg-cover bg-[58%_center] px-[8vw] text-center text-white"
        style={{ backgroundImage: `url(${bgStartImage.src})` }}
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.5)_28%,rgba(0,0,0,0.56)_62%,rgba(0,0,0,0.78)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-black/30" />

        <div className="step-layer-enter pt-[13.4svh]">
          <img
            src="https://www.studioatmoart.com/assets/images/logo-white.png"
            alt="studio ÁTMO"
            className="mx-auto h-auto w-[57vw] max-w-[17rem]"
          />
        </div>

        <div className="step-layer-enter mt-[6svh] text-[clamp(1.45rem,5vw,1.85rem)] font-[400] leading-[1.48] tracking-[-0.055em] [animation-delay:80ms]">
          <p>Ya eres parte de este mundo.</p>

          <p className="mt-[2.1rem] font-[700] tracking-[-0.07em]">
            ¡Reclama tu reward en caja!
          </p>

          <p className="mt-[2.15rem]">
            Sube un story etiquetandonos
            <br />y recibe un café <span className="font-[700]">gratis</span>
          </p>

          <p className="mt-[2.15rem]">
            Rellena el formulario
            <br />y recibe un postre <span className="font-[700]">gratis</span>
          </p>
        </div>

        <div className="step-layer-enter mt-[6.8svh] flex flex-col items-center [animation-delay:160ms]">
          <a
            className="inline-flex h-[2.7rem] min-w-[11.2rem] items-center justify-center rounded-[0.7rem] border-2 border-white bg-transparent px-6 text-[clamp(1rem,3.7vw,1.25rem)] font-[400] tracking-[-0.035em] text-white transition-all hover:bg-white/10"
            href="/#formulario"
          >
            Ir al formulario
          </a>

          <a
            aria-label="Abrir Instagram Stories"
            className="mt-[1.45rem] inline-flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-white text-black"
            href="instagram://story-camera"
          >
            <InstagramIcon />
          </a>
        </div>
      </section>
    </main>
  );
}
