import "server-only";

export { AR_TARGET_SRC } from "@/lib/ar-targets";

export const TOTAL_STEPS = 5;

type StepARAssets = {
  livingImageGlb: string;
  placementGlb: string;
  placementUsdz: string;
};

export const remoteARAssetsByStep: Record<number, StepARAssets> = {
  1: {
    livingImageGlb: "",
    placementGlb: "",
    placementUsdz: "",
  },
  2: {
    livingImageGlb:
      "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/ar%2Fstep-2.glb?alt=media&token=c4a7f1c8-d1ae-4860-b472-d82ceaf2c259",
    placementGlb:
      "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/ar%2Fancla.glb?alt=media&token=71668edf-7870-49f6-99dc-cb5dc4e5fef7",
    placementUsdz:
      "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/ar%2Fancla.usdz?alt=media&token=a43d2353-f9f9-406d-bf68-660f5218853c",
  },
  3: {
    livingImageGlb: "",
    placementGlb: "",
    placementUsdz: "",
  },
  4: {
    livingImageGlb: "",
    placementGlb: "",
    placementUsdz: "",
  },
  5: {
    livingImageGlb:
      "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/ar%2Fstep-5.glb?alt=media&token=bcb7c46a-a272-4bc7-937c-8cf2f67fcc4c",
    placementGlb:
      "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/ar%2Fstep-5-ip.glb?alt=media&token=e1ce508d-389a-4476-819b-5691be97d69c",
    placementUsdz:
      "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/ar%2Fstep-5-ip.usdz?alt=media&token=c463cef2-b05a-4e81-9575-6602d03693bb",
  },
};

function getRemoteAssetSrc(src: string | undefined) {
  const trimmedSrc = src?.trim();

  return trimmedSrc ? trimmedSrc : null;
}

export function getStepModelSrc(step: number) {
  return getRemoteAssetSrc(remoteARAssetsByStep[step]?.livingImageGlb);
}

export function getStepPlacementModelSrc(step: number) {
  return getRemoteAssetSrc(remoteARAssetsByStep[step]?.placementGlb);
}

export function getStepPlacementUsdzSrc(step: number) {
  return getRemoteAssetSrc(remoteARAssetsByStep[step]?.placementUsdz);
}
