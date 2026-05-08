export const AR_CONFIG_COLLECTION = "app-config";
export const AR_CONFIG_DOC_ID = "ar";

export const AR_TARGETS = {
  nimbo: {
    id: "nimbo",
    label: "Nimbo",
    src: "/ar/targets/nimbo.mind",
  },
  dip: {
    id: "dip",
    label: "DIP",
    src: "/ar/targets/dip.mind",
  },
} as const;

export type ARTargetId = keyof typeof AR_TARGETS;

export const DEFAULT_AR_TARGET_ID: ARTargetId = "nimbo";
export const AR_TARGET_SRC = AR_TARGETS[DEFAULT_AR_TARGET_ID].src;
export const AR_TARGET_OPTIONS = Object.values(AR_TARGETS);

export function getARActiveTargetId(value: unknown): ARTargetId {
  return typeof value === "string" && value in AR_TARGETS
    ? (value as ARTargetId)
    : DEFAULT_AR_TARGET_ID;
}

export function getARTargetSrc(targetId: ARTargetId) {
  return AR_TARGETS[targetId].src;
}
