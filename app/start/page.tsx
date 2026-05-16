import bgStartImage from "@/assets/bg-start.png";
import Link from "next/link";

export default function StartPage() {
  return (
    <main className="min-h-svh overflow-hidden bg-black">
      <section
        className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden bg-cover bg-[58%_center] px-[8vw] text-center text-white"
        style={{ backgroundImage: `url(${bgStartImage.src})` }}
      >
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.4)_24%,rgba(0,0,0,0.5)_56%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-black/24" />

        <div className="flex w-full flex-col items-center">
          <div className="text-[clamp(1.45rem,5vw,1.9rem)] font-[400] leading-[1.62] tracking-[-0.055em] max-[370px]:!text-[1.22rem]">
            <p>
              Lo que ves a tu alrededor
              <br />
              no está colocado al azar.
            </p>

            <p className="mt-[0.65rem]">
              Cada punto es parte del recorrido.
            </p>

            <p className="mt-[0.6rem]">
              Cada escultura…
              <br />
              es una puerta distinta.
            </p>
          </div>

          <Link
            href="/steps/2"
            className="mt-[2.4rem] inline-flex h-[2.7rem] min-w-[10.6rem] items-center justify-center rounded-[0.7rem] border-2 border-white bg-transparent px-8 text-[clamp(1.05rem,3.6vw,1.3rem)] font-[400] uppercase tracking-[-0.035em] text-white shadow-none transition-all hover:bg-white/10"
          >
            Empezar
          </Link>
        </div>
      </section>
    </main>
  );
}
