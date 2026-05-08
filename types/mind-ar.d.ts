declare module "mind-ar/dist/mindar-image-three.prod.js" {
  import type { Camera, Group, Scene, WebGLRenderer } from "three";

  type MindARAnchor = {
    group: Group;
    targetIndex: number;
    onTargetFound: (() => void) | null;
    onTargetLost: (() => void) | null;
    onTargetUpdate: (() => void) | null;
    visible: boolean;
  };

  type MindARThreeOptions = {
    container: HTMLElement;
    imageTargetSrc: string;
    maxTrack?: number;
    uiLoading?: "yes" | "no";
    uiScanning?: "yes" | "no";
    uiError?: "yes" | "no";
  };

  export class MindARThree {
    camera: Camera;
    renderer: WebGLRenderer;
    scene: Scene;

    constructor(options: MindARThreeOptions);

    addAnchor(targetIndex: number): MindARAnchor;
    start(): Promise<void>;
    stop(): void;
  }
}
