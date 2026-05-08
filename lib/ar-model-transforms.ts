export type ARModelTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

const defaultTransform: ARModelTransform = {
  position: [0, 0, 0],
  rotation: [Math.PI / 2, 0, 0],
  scale: 1.65,
};

export const arModelTransformsByStep: Record<number, ARModelTransform> = {
  1: defaultTransform,
  2: defaultTransform,
  3: defaultTransform,
  4: defaultTransform,
  5: defaultTransform,
};

export function getARModelTransformForStep(step: number | null) {
  if (!step) {
    return defaultTransform;
  }

  return arModelTransformsByStep[step] ?? defaultTransform;
}
