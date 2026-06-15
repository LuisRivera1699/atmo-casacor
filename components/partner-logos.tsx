import Image from "next/image";

import aminiLogo from "@/assets/amini.png";
import atmoLogo from "@/assets/atmo.png";
import peatonalLogo from "@/assets/peatonal.png";

export function PartnerLogos() {
  return (
    <div className="flex max-w-[22rem] items-center justify-center gap-[1rem] opacity-90 sm:max-w-none sm:gap-[1.2rem]">
      <Image
        src={peatonalLogo}
        alt="Peatonal"
        width={peatonalLogo.width}
        height={peatonalLogo.height}
        className="h-[0.95rem] w-auto max-w-[4.5rem] shrink-0 object-contain sm:h-[1.05rem] sm:max-w-[5rem]"
      />
      <Image
        src={atmoLogo}
        alt="Studio ATMO"
        width={atmoLogo.width}
        height={atmoLogo.height}
        className="h-[1.35rem] w-auto max-w-[5.2rem] shrink-0 object-contain sm:h-[1.5rem] sm:max-w-[5.8rem]"
      />
      <Image
        src={aminiLogo}
        alt="Amini"
        width={aminiLogo.width}
        height={aminiLogo.height}
        className="h-[1.35rem] w-auto max-w-[4.8rem] shrink-0 object-contain sm:h-[1.5rem] sm:max-w-[5.3rem]"
      />
    </div>
  );
}
