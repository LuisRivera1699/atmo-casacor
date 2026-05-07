import Image from "next/image";
import Link from "next/link";

import ecoImage from "@/assets/eco.png";
import flujoImage from "@/assets/flujo.png";
import middleBannerImage from "@/assets/middle-banner.png";
import murosImage from "@/assets/muros.png";
import nimboImage from "@/assets/nimbo.png";
import { AtmoDessertForm } from "@/components/atmo-dessert-form";

export default function Home() {
  return (
    <main className="min-h-svh overflow-hidden bg-black">
      <header className="fixed left-0 top-0 z-50 flex h-14 w-full items-center bg-white px-[5vw] shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <a href="/" aria-label="studio ÁTMO home" className="inline-flex">
          <img
            src="https://www.studioatmoart.com/assets/images/logo-black.png"
            alt="studio ÁTMO"
            className="h-auto w-[9.5rem] max-w-[48vw]"
          />
        </a>
      </header>

      <section className="relative isolate flex min-h-svh w-full flex-col justify-center overflow-hidden bg-black px-[12.2vw] text-white">
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
          src="https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/cms%2Fvideos%2F1765847087550-atmo-hero.mp4?alt=media&token=fee96900-7c0d-4a8e-a3fa-a766b2e0372d"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_14%,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.52)_23%,rgba(0,0,0,0)_45%),linear-gradient(180deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.32)_32%,rgba(0,0,0,0.42)_58%,rgba(0,0,0,0.86)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-black/20" />

        <div>
          <h1 className="whitespace-pre-line text-[clamp(2.65rem,10.6vw,5rem)] font-[700] leading-[1.12] tracking-[0.075em]">
            {"No todo\nlo que ves…\nestá vivo."}
          </h1>
        </div>

        <div className="mt-[2.8svh]">
          <p className="whitespace-nowrap text-[clamp(1.2rem,4.2vw,1.7rem)] font-[300] italic leading-none tracking-[0.1em]">
            Pero todo lo que sientes, sí.
          </p>
        </div>

        <div className="mt-[3.2svh] text-left">
          <p className="max-w-[24rem] text-[clamp(0.88rem,3vw,1.05rem)] font-[400] leading-[1.34] tracking-[-0.025em] text-white">
            Completa el recorrido, conoce el universo de nimbo y consigue un
            reward ¡gratis!
          </p>

          <Link
            className="mt-[1.8svh] inline-flex h-10 min-w-[12.5rem] items-center justify-center rounded-[0.75rem] border-2 border-white bg-transparent px-6 text-[clamp(0.95rem,3.2vw,1.15rem)] font-[400] uppercase tracking-[-0.02em] text-white shadow-none transition-all hover:bg-white/10 hover:text-white"
            href="/start"
          >
            Inicio
          </Link>
        </div>
      </section>

      <section className="home-nimbo-section relative h-[1024px] overflow-hidden bg-white text-black">
        <h2 className="home-sculpture-title absolute left-[12.2vw] top-[6.4rem] z-10 text-[clamp(3.45rem,12vw,4.1rem)] font-[400] leading-[0.96] tracking-[-0.075em]">
          Esto <span className="font-[700]">NO</span>
          <br />
          es una
          <br />
          escultura
        </h2>

        <Image
          src={nimboImage}
          alt="Figura Nimbo transparente"
          className="home-nimbo-figure absolute right-[2.8vw] top-[1.1rem] z-10 h-[26.2rem] w-auto"
          priority
        />

        <Image
          src={flujoImage}
          alt="Nube Nimbo sobre base fluida"
          className="home-flujo-figure absolute left-[-10.5vw] top-[19.4rem] z-20 h-auto w-[68vw] max-w-[21.5rem]"
        />

        <div className="home-nimbo-band absolute left-0 top-[29.7rem] h-[14.7rem] w-full bg-[#101010]" />

        <div className="home-nimbo-copy absolute left-[35.5vw] top-[31.8rem] z-10 text-white">
          <p className="home-nimbo-kicker text-[clamp(1.75rem,5.8vw,2.15rem)] font-[400] leading-none tracking-[-0.06em]">
            Bienvenido al
          </p>
          <p className="home-nimbo-title mt-[0.2rem] text-[clamp(4rem,13.2vw,5rem)] font-[400] leading-[0.9] tracking-[-0.075em]">
            Nimbo
            <br />
            Universe
          </p>
        </div>

        <Image
          src={ecoImage}
          alt="Forma abstracta metálica Nimbo"
          className="home-eco-figure absolute right-[-1.8vw] top-[39.2rem] z-20 h-auto w-[48vw] max-w-[15.5rem]"
        />

        <div className="home-presence-copy absolute left-[12.2vw] top-[51.5rem] z-10 text-[clamp(1.25rem,4.15vw,1.55rem)] font-[400] leading-[1.48] tracking-[-0.055em]">
          <p>
            Nimbo no es un objeto.
            <br />
            Es una presencia.
          </p>
          <p className="mt-[2.4rem]">
            No fue creado para ser visto.
            <br />
            Fue creado para ser sentido.
          </p>
        </div>
      </section>

      <section className="bg-black">
        <video
          className="block h-auto w-full"
          src="https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/cms%2Fvideos%2F1765847087550-atmo-hero.mp4?alt=media&token=fee96900-7c0d-4a8e-a3fa-a766b2e0372d"
          autoPlay
          muted
          loop
          playsInline
        />
      </section>

      <section className="bg-[#101010] px-[8vw] py-[3.6rem] text-center text-white">
        <p className="text-[clamp(1.25rem,4.5vw,1.7rem)] font-[400] leading-[1.4] tracking-[-0.045em]">
          <span className="font-[650]">ÁTMO</span> no crea piezas.
          <br />
          Crea atmósferas.
        </p>

        <p className="mt-[2.8rem] text-[clamp(1.25rem,4.5vw,1.7rem)] font-[400] leading-[1.5] tracking-[-0.045em]">
          Cada obra es un punto de encuentro
          <br />
          entre lo visible…
          <br />y lo que no puedes explicar.
        </p>
      </section>

      <section className="bg-black">
        <Image
          src={middleBannerImage}
          alt="Nimbo en una mesa dentro de una atmósfera oscura"
          className="block h-auto w-full"
        />
      </section>

      <section className="bg-white px-[9.5vw] py-[1.6rem] text-center text-black">
        <p className="text-[clamp(1.15rem,4.1vw,1.55rem)] font-[400] leading-[1.4] tracking-[-0.055em] text-black/80">
          Lo que ves a tu alrededor
          <br />
          no está colocado al azar.
        </p>

        <p className="mt-[1.6rem] text-[clamp(1.15rem,4.1vw,1.55rem)] font-[400] leading-[1.4] tracking-[-0.055em] text-black/80">
          Cada punto es parte del recorrido.
        </p>

        <p className="mt-[1.55rem] text-[clamp(1.15rem,4.1vw,1.55rem)] font-[400] leading-[1.4] tracking-[-0.055em] text-black/80">
          Cada escultura…
          <br />
          es una puerta distinta.
        </p>

        <Image
          src={murosImage}
          alt="Dos esculturas de muros Nimbo"
          className="mx-auto mt-[1.15rem] h-auto w-[104vw] max-w-none -translate-x-[11vw]"
        />

        <div className="mt-[2.25rem] flex flex-col items-center gap-[1.1rem]">
          <Link
            className="inline-flex h-10 w-full max-w-[20rem] items-center justify-center rounded-[0.7rem] border-2 border-black bg-transparent px-5 text-[clamp(0.95rem,3.2vw,1.1rem)] font-[400] uppercase tracking-[-0.045em] text-black shadow-none transition-all hover:bg-black/5 hover:text-black"
            href="/start"
          >
            Explorar el universo
          </Link>

          <a
            className="inline-flex h-10 w-full max-w-[20rem] items-center justify-center rounded-[0.7rem] border-2 border-black bg-transparent px-5 text-[clamp(0.95rem,3.2vw,1.1rem)] font-[400] uppercase tracking-[-0.045em] text-black shadow-none transition-all hover:bg-black/5 hover:text-black"
            href="https://studioatmoart.com"
            rel="noreferrer"
            target="_blank"
          >
            Descubrir más
          </a>
        </div>
      </section>

      <AtmoDessertForm />
    </main>
  );
}
