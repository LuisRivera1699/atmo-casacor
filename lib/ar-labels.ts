export type ARLabelSide = "left" | "right";

export type ARLabelConfig = {
  anchorName: string;
  side: ARLabelSide;
  text: string;
  yOffset?: number;
};

export const arLabelsByStep: Record<number, ARLabelConfig[]> = {
  2: [
    {
      anchorName: "Wall_Label_Point",
      side: "left",
      text: "El pasado se recuerda.\nEl futuro se imagina.",
      yOffset: -56,
    },
    {
      anchorName: "Balloon_Label_Point",
      side: "left",
      text: "Entre ambos, el\npresente resiste la\npresion de los dos.",
      yOffset: 0,
    },
    {
      anchorName: "Wall_Bottom_Label_Point",
      side: "left",
      text: "Por eso esta pieza se llama\nAnclas del tiempo: porque el\nahora funciona como el único\nancla real entre lo que fue y\nlo que aún no llega.",
      yOffset: 56,
    },
  ],
  5: [
    {
      anchorName: "Cloud_Label_Point",
      side: "left",
      text: "Como una nube,\nlos sueños nunca tienen\nuna sola forma.",
      yOffset: -48,
    },
    {
      anchorName: "Cromo_Label_Point",
      side: "right",
      text: "Lo que fue, lo que podría ser\ny lo que ocurre ahora\nencuentran un lugar momentáneo.",
      yOffset: 0,
    },
    {
      anchorName: "Flow_Label_Point",
      side: "left",
      text: "El presente no retiene,\nsolo fluye",
      yOffset: 48,
    },
  ],
};

export function getARLabelsForModel(modelSrc: string) {
  const stepMatch = modelSrc.match(/step-(\d+)\.glb(?:$|[?#])/);

  if (!stepMatch) {
    return [];
  }

  return arLabelsByStep[Number(stepMatch[1])] ?? [];
}
