"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AmbientLight,
  ACESFilmicToneMapping,
  Box3,
  CanvasTexture,
  ColorManagement,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Group,
  PMREMGenerator,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from "three";
import type { Camera, Material, Mesh, Object3D, Texture } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import {
  getARLabelsForModel,
  type ARLabelConfig,
} from "@/lib/ar-labels";
import { getARModelTransformForStep } from "@/lib/ar-model-transforms";

type LivingImageViewerProps = {
  modelSrc: string;
  targetSrc: string;
  placementModelSrc?: string | null;
  placementUsdzSrc?: string | null;
  onOpenPlacement?: () => void;
  onClose: () => void;
};

type ViewerStatus = "loading" | "scanning" | "found" | "error";
type ModelLoadStatus = "loading" | "ready";
type RuntimeLabel = {
  anchor: Object3D;
  config: ARLabelConfig;
  path: SVGPathElement;
  marker: SVGCircleElement;
  smoothed?: {
    anchorX: number;
    anchorY: number;
    controlX: number;
    controlY: number;
    textAnchorX: number;
    textAnchorY: number;
    textX: number;
    textY: number;
  };
  text: HTMLDivElement;
};
type PhysicalMaterialOverrides = Material & {
  clearcoat?: number;
  clearcoatRoughness?: number;
  color?: { set: (color: number) => void };
  envMap?: Texture | null;
  envMapIntensity?: number;
  metalness?: number;
  roughness?: number;
  thickness?: number;
  transmission?: number;
  transmissionMap?: null;
};

ColorManagement.enabled = true;
const labelSvgNamespace = "http://www.w3.org/2000/svg";
const horizontalRotationSpeed = 0.008;

function getRendererPixelRatio() {
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2);
}

function createStudioEnvironment(renderer: WebGLRenderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create environment canvas context.");
  }

  const background = context.createLinearGradient(0, 0, 0, canvas.height);
  background.addColorStop(0, "#ffffff");
  background.addColorStop(0.18, "#e8e8e8");
  background.addColorStop(0.34, "#1f1f1f");
  background.addColorStop(0.5, "#060606");
  background.addColorStop(0.66, "#3f3f3f");
  background.addColorStop(0.82, "#f4f4f4");
  background.addColorStop(1, "#ffffff");
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const panels = [
    { x: 44, y: 34, width: 270, height: 118, alpha: 1 },
    { x: 376, y: 16, width: 92, height: 430, alpha: 0.9 },
    { x: 566, y: 62, width: 370, height: 82, alpha: 1 },
    { x: 694, y: 282, width: 280, height: 132, alpha: 0.88 },
    { x: 120, y: 328, width: 280, height: 76, alpha: 0.96 },
  ];

  for (const panel of panels) {
    context.fillStyle = `rgba(255, 255, 255, ${panel.alpha})`;
    context.fillRect(panel.x, panel.y, panel.width, panel.height);
  }

  const darkBands = [
    { x: 0, y: 194, width: 1024, height: 78, alpha: 0.86 },
    { x: 478, y: 0, width: 92, height: 512, alpha: 0.52 },
    { x: 0, y: 446, width: 1024, height: 34, alpha: 0.72 },
  ];

  for (const band of darkBands) {
    context.fillStyle = `rgba(18, 18, 18, ${band.alpha})`;
    context.fillRect(band.x, band.y, band.width, band.height);
  }

  const sourceTexture = new CanvasTexture(canvas);
  sourceTexture.encoding = sRGBEncoding;
  sourceTexture.mapping = EquirectangularReflectionMapping;

  const pmremGenerator = new PMREMGenerator(renderer);
  const environment = pmremGenerator.fromEquirectangular(sourceTexture);
  sourceTexture.dispose();

  return {
    texture: environment.texture,
    dispose() {
      environment.texture.dispose();
      pmremGenerator.dispose();
    },
  };
}

function hasTransmission(material: Material) {
  const physicalMaterial = material as PhysicalMaterialOverrides;

  return (
    typeof physicalMaterial.transmission === "number" &&
    physicalMaterial.transmission > 0
  );
}

function getStepNumberFromModelSrc(modelSrc: string) {
  const stepMatch = modelSrc.match(/step-(\d+)\.glb(?:$|[?#])/);

  return stepMatch ? Number(stepMatch[1]) : null;
}

function isStepFiveCloudMaterial(material: Material, modelSrc: string) {
  return (
    getStepNumberFromModelSrc(modelSrc) === 5 &&
    material.name === "Material.006"
  );
}

function tunePBRMaterial(
  material: Material,
  environmentMap: Texture,
  modelSrc: string,
) {
  const physicalMaterial = material as PhysicalMaterialOverrides;
  const isDarkBlock = hasTransmission(material);

  material.transparent = false;
  material.opacity = 1;
  material.depthTest = true;
  material.depthWrite = true;

  if ("alphaTest" in material) {
    material.alphaTest = 0;
  }

  physicalMaterial.envMap = environmentMap;
  physicalMaterial.envMapIntensity = isDarkBlock ? 0.55 : 4.6;

  if (isStepFiveCloudMaterial(material, modelSrc)) {
    physicalMaterial.color?.set(0xf2f1ed);
    physicalMaterial.envMapIntensity = 0.22;
    physicalMaterial.metalness = 0;
    physicalMaterial.roughness = 0.74;
    physicalMaterial.clearcoat = 0;
    physicalMaterial.clearcoatRoughness = 0.45;
  } else if (isDarkBlock) {
    physicalMaterial.color?.set(0x030303);
    physicalMaterial.metalness = 0.5;
    physicalMaterial.roughness = 0.18;
    physicalMaterial.clearcoat = 0.85;
    physicalMaterial.clearcoatRoughness = 0.08;
    physicalMaterial.transmission = 0;
    physicalMaterial.transmissionMap = null;
    physicalMaterial.thickness = 0;
  } else {
    physicalMaterial.color?.set(0xd2d4d3);
    physicalMaterial.metalness = 1;
    physicalMaterial.roughness = 0.06;
    physicalMaterial.clearcoat = 1;
    physicalMaterial.clearcoatRoughness = 0.035;
  }

  material.needsUpdate = true;
}

function normalizeModelMaterials(
  model: Object3D,
  environmentMap: Texture,
  modelSrc: string,
) {
  model.traverse((object) => {
    if (!("isMesh" in object) || object.isMesh !== true) {
      return;
    }

    const mesh = object as Mesh;
    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    for (const material of materials) {
      tunePBRMaterial(material, environmentMap, modelSrc);
    }
  });
}

function createLabelTextElement(config: ARLabelConfig) {
  const element = document.createElement("div");
  element.className =
    "absolute rounded-[0.72rem] bg-black/78 px-3 py-2 text-center text-[0.63rem] font-[400] leading-[1.08] tracking-[-0.035em] text-white shadow-[0_0.55rem_1.6rem_rgba(0,0,0,0.22)] backdrop-blur-[2px] max-[370px]:text-[0.55rem]";
  element.textContent = config.text;

  return element;
}

function createLabelLineElement() {
  const path = document.createElementNS(labelSvgNamespace, "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "rgba(255, 255, 255, 0.68)");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  path.setAttribute("stroke-width", "1.2");

  return path;
}

function createLabelMarkerElement() {
  const marker = document.createElementNS(labelSvgNamespace, "circle");
  marker.setAttribute("fill", "rgba(255, 255, 255, 0.2)");
  marker.setAttribute("r", "4.2");
  marker.setAttribute("stroke", "rgba(255, 255, 255, 0.78)");
  marker.setAttribute("stroke-width", "1.2");

  return marker;
}

function createLabelOverlayElements(
  overlay: HTMLDivElement,
  model: Object3D,
  labels: ARLabelConfig[],
) {
  const svg = document.createElementNS(labelSvgNamespace, "svg");
  svg.setAttribute("class", "absolute inset-0 h-full w-full overflow-visible");
  overlay.appendChild(svg);

  const runtimeLabels = labels.flatMap((config) => {
    const anchor = model.getObjectByName(config.anchorName);

    if (!anchor) {
      return [];
    }

    const path = createLabelLineElement();
    const marker = createLabelMarkerElement();
    const text = createLabelTextElement(config);

    svg.appendChild(path);
    svg.appendChild(marker);
    overlay.appendChild(text);

    return [{ anchor, config, path, marker, text }];
  });

  return {
    labels: runtimeLabels,
    dispose() {
      overlay.replaceChildren();
    },
  };
}

function updateLabelOverlay(
  labels: RuntimeLabel[],
  camera: Camera,
  container: HTMLElement,
) {
  const bounds = container.getBoundingClientRect();
  const worldPosition = new Vector3();
  const projectedPosition = new Vector3();
  const labelWidth = Math.min(bounds.width * 0.36, 150);

  for (const label of labels) {
    const { anchor, config, marker, path, text } = label;
    anchor.getWorldPosition(worldPosition);
    projectedPosition.copy(worldPosition).project(camera);

    const isVisible =
      projectedPosition.z > -1 &&
      projectedPosition.z < 1 &&
      Number.isFinite(projectedPosition.x) &&
      Number.isFinite(projectedPosition.y);

    if (!isVisible) {
      marker.style.opacity = "0";
      path.style.opacity = "0";
      text.style.opacity = "0";
      label.smoothed = undefined;
      continue;
    }

    const anchorX = (projectedPosition.x * 0.5 + 0.5) * bounds.width;
    const anchorY = (-projectedPosition.y * 0.5 + 0.5) * bounds.height;
    const labelOffsetY = config.yOffset ?? 0;
    const rawTextY = anchorY + labelOffsetY;
    const textY = Math.min(Math.max(rawTextY, 96), bounds.height - 132);
    const isLeft = config.side === "left";
    const horizontalGap = Math.min(bounds.width * 0.08, 36);
    const textX = isLeft
      ? Math.max(14, anchorX - labelWidth - horizontalGap)
      : Math.min(bounds.width - labelWidth - 14, anchorX + horizontalGap);
    const textAnchorX = isLeft ? textX + labelWidth : textX;
    const textAnchorY = textY + 20;
    const controlX = isLeft
      ? (textAnchorX + anchorX) / 2 - 10
      : (textAnchorX + anchorX) / 2 + 10;
    const controlY = (textAnchorY + anchorY) / 2;
    const target = {
      anchorX,
      anchorY,
      controlX,
      controlY,
      textAnchorX,
      textAnchorY,
      textX,
      textY,
    };

    if (!label.smoothed) {
      label.smoothed = target;
    } else {
      const smoothing = 0.18;
      label.smoothed = {
        anchorX:
          label.smoothed.anchorX +
          (target.anchorX - label.smoothed.anchorX) * smoothing,
        anchorY:
          label.smoothed.anchorY +
          (target.anchorY - label.smoothed.anchorY) * smoothing,
        controlX:
          label.smoothed.controlX +
          (target.controlX - label.smoothed.controlX) * smoothing,
        controlY:
          label.smoothed.controlY +
          (target.controlY - label.smoothed.controlY) * smoothing,
        textAnchorX:
          label.smoothed.textAnchorX +
          (target.textAnchorX - label.smoothed.textAnchorX) * smoothing,
        textAnchorY:
          label.smoothed.textAnchorY +
          (target.textAnchorY - label.smoothed.textAnchorY) * smoothing,
        textX:
          label.smoothed.textX +
          (target.textX - label.smoothed.textX) * smoothing,
        textY:
          label.smoothed.textY +
          (target.textY - label.smoothed.textY) * smoothing,
      };
    }

    const smoothed = label.smoothed;

    text.style.opacity = "1";
    text.style.transform = `translate3d(${smoothed.textX}px, ${smoothed.textY}px, 0)`;
    text.style.width = `${labelWidth}px`;

    marker.style.opacity = "1";
    marker.setAttribute("cx", `${smoothed.anchorX}`);
    marker.setAttribute("cy", `${smoothed.anchorY}`);

    path.style.opacity = "1";
    path.setAttribute(
      "d",
      `M ${smoothed.textAnchorX} ${smoothed.textAnchorY} Q ${smoothed.controlX} ${smoothed.controlY} ${smoothed.anchorX} ${smoothed.anchorY}`,
    );
  }
}

function hideLabelOverlay(labels: RuntimeLabel[]) {
  for (const label of labels) {
    label.marker.style.opacity = "0";
    label.path.style.opacity = "0";
    label.text.style.opacity = "0";
    label.smoothed = undefined;
  }
}

function formatRuntimeError(error: unknown) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function LivingImageViewer({
  modelSrc,
  onOpenPlacement,
  placementModelSrc,
  targetSrc,
  onClose,
}: LivingImageViewerProps) {
  const mindarContainerRef = useRef<HTMLDivElement>(null);
  const labelOverlayRef = useRef<HTMLDivElement>(null);
  const [modelLoadStatus, setModelLoadStatus] =
    useState<ModelLoadStatus>("loading");
  const [status, setStatus] = useState<ViewerStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const labels = useMemo(() => getARLabelsForModel(modelSrc), [modelSrc]);

  useEffect(() => {
    let isDisposed = false;
    let isTargetVisible = false;
    let disposeLabelOverlay: (() => void) | undefined;
    let runtimeLabels: RuntimeLabel[] = [];
    let disposeAnchoredModel: (() => void) | undefined;
    let mindarThree:
      | InstanceType<
          typeof import("mind-ar/dist/mindar-image-three.prod.js").MindARThree
        >
      | null = null;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function showRuntimeError(source: string, error: unknown) {
      if (isDisposed) {
        return;
      }

      const message = `${source}: ${formatRuntimeError(error)}`;
      console.error(message, error);
      setStatus("error");
      setErrorMessage(message);
    }

    function handleWindowError(event: ErrorEvent) {
      showRuntimeError("window.error", event.error ?? event.message);
    }

    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      showRuntimeError("unhandledrejection", event.reason);
    }

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    function setMindARLayerStyles(container: HTMLElement) {
      const children = Array.from(container.children) as HTMLElement[];

      for (const child of children) {
        child.style.inset = "0";
        child.style.height = "100%";
        child.style.pointerEvents = "none";
        child.style.width = "100%";

        if (child.tagName.toLowerCase() === "video") {
          child.style.objectFit = "cover";
          child.style.zIndex = "0";
        } else {
          child.style.zIndex = "1";
        }
      }
    }

    async function setupAnchoredModel(
      anchorGroup: Group,
      currentMindarThree: InstanceType<
        typeof import("mind-ar/dist/mindar-image-three.prod.js").MindARThree
      >,
      container: HTMLElement,
    ) {
      const { renderer, scene } = currentMindarThree;

      const ambientLight = new AmbientLight(0xffffff, 0.18);
      scene.add(ambientLight);

      const keyLight = new DirectionalLight(0xffffff, 0.72);
      keyLight.position.set(3, 4, 5);
      scene.add(keyLight);

      const fillLight = new DirectionalLight(0xffffff, 0.18);
      fillLight.position.set(-3, 2, 3);
      scene.add(fillLight);

      renderer.outputEncoding = sRGBEncoding;
      renderer.useLegacyLights = false;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.setPixelRatio(getRendererPixelRatio());

      const handleContextLost = (event: Event) => {
        event.preventDefault();
        showRuntimeError(
          "webglcontextlost",
          "Safari perdió el contexto WebGL del visor 3D.",
        );
      };
      renderer.domElement.addEventListener(
        "webglcontextlost",
        handleContextLost,
        false,
      );

      const environment = createStudioEnvironment(renderer);
      scene.environment = environment.texture;

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");

      function disposeSceneResources() {
        renderer.domElement.removeEventListener(
          "webglcontextlost",
          handleContextLost,
          false,
        );
        scene.remove(ambientLight);
        scene.remove(keyLight);
        scene.remove(fillLight);
        scene.environment = null;
        environment.dispose();
        dracoLoader.dispose();
      }

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      const gltf = await loader.loadAsync(modelSrc);

      if (isDisposed) {
        disposeSceneResources();
        return;
      }

      const model = gltf.scene;
      normalizeModelMaterials(model, environment.texture, modelSrc);

      const box = new Box3().setFromObject(model);
      const center = box.getCenter(new Vector3());
      const size = box.getSize(new Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const transform = getARModelTransformForStep(
        getStepNumberFromModelSrc(modelSrc),
      );
      const normalizedScale =
        maxDimension > 0 ? transform.scale / maxDimension : transform.scale;
      const modelRoot = new Group();
      const [positionX, positionY, positionZ] = transform.position;
      const [rotationX, rotationY, rotationZ] = transform.rotation;

      model.position.set(
        -center.x * normalizedScale,
        -box.min.y * normalizedScale,
        -center.z * normalizedScale,
      );
      model.scale.setScalar(normalizedScale);
      modelRoot.position.set(positionX, positionY, positionZ);
      modelRoot.rotation.set(rotationX, rotationY, rotationZ);
      modelRoot.add(model);
      anchorGroup.add(modelRoot);

      let isDraggingModel = false;
      let lastPointerX = 0;

      function stopDraggingModel() {
        isDraggingModel = false;
      }

      function handlePointerDown(event: PointerEvent) {
        if (!isTargetVisible) {
          return;
        }

        isDraggingModel = true;
        lastPointerX = event.clientX;
        container.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      }

      function handlePointerMove(event: PointerEvent) {
        if (!isDraggingModel) {
          return;
        }

        const deltaX = event.clientX - lastPointerX;
        lastPointerX = event.clientX;
        model.rotation.y += deltaX * horizontalRotationSpeed;
        model.updateMatrixWorld(true);
        event.preventDefault();
      }

      function handlePointerUp(event: PointerEvent) {
        stopDraggingModel();
        container.releasePointerCapture?.(event.pointerId);
      }

      container.addEventListener("pointerdown", handlePointerDown);
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerup", handlePointerUp);
      container.addEventListener("pointercancel", handlePointerUp);

      if (labelOverlayRef.current && labels.length > 0) {
        const labelOverlay = createLabelOverlayElements(
          labelOverlayRef.current,
          model,
          labels,
        );
        runtimeLabels = labelOverlay.labels;
        disposeLabelOverlay = labelOverlay.dispose;
      }

      setModelLoadStatus("ready");

      return () => {
        container.removeEventListener("pointerdown", handlePointerDown);
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerup", handlePointerUp);
        container.removeEventListener("pointercancel", handlePointerUp);
        anchorGroup.remove(modelRoot);
        disposeSceneResources();
      };
    }

    async function setupMindAR(container: HTMLElement) {
      const { MindARThree } = await import(
        "mind-ar/dist/mindar-image-three.prod.js"
      );

      if (isDisposed) {
        return;
      }

      mindarThree = new MindARThree({
        container,
        imageTargetSrc: targetSrc,
        maxTrack: 1,
        uiError: "no",
        uiLoading: "no",
        uiScanning: "no",
      });

      const anchor = mindarThree.addAnchor(0);
      anchor.onTargetFound = () => {
        isTargetVisible = true;
        setStatus("found");
      };
      anchor.onTargetLost = () => {
        isTargetVisible = false;
        hideLabelOverlay(runtimeLabels);
        setStatus("scanning");
      };

      await mindarThree.start();

      if (isDisposed) {
        mindarThree.stop();
        return;
      }

      setMindARLayerStyles(container);
      setStatus("scanning");

      mindarThree.renderer.setAnimationLoop(() => {
        if (!mindarThree) {
          return;
        }

        try {
          if (isTargetVisible) {
            updateLabelOverlay(runtimeLabels, mindarThree.camera, container);
          } else {
            hideLabelOverlay(runtimeLabels);
          }

          mindarThree.renderer.render(mindarThree.scene, mindarThree.camera);
        } catch (error) {
          showRuntimeError("render", error);
        }
      });

      return anchor.group;
    }

    async function setup() {
      const mindarContainer = mindarContainerRef.current;

      if (!mindarContainer) {
        return;
      }

      try {
        setModelLoadStatus("loading");
        const anchorGroup = await setupMindAR(mindarContainer);

        if (isDisposed || !mindarThree || !anchorGroup) {
          return;
        }

        disposeAnchoredModel = await setupAnchoredModel(
          anchorGroup,
          mindarThree,
          mindarContainer,
        );
      } catch (error) {
        if (isDisposed) {
          return;
        }

        showRuntimeError("setup", error);
      }
    }

    setup();

    return () => {
      isDisposed = true;
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      mindarThree?.renderer.setAnimationLoop(null);
      mindarThree?.stop();
      disposeLabelOverlay?.();
      disposeAnchoredModel?.();
    };
  }, [labels, modelSrc, targetSrc]);

  const isModelVisible = status === "found";
  const isModelReady = modelLoadStatus === "ready";
  const isScanning = status === "scanning";
  const isFound = status === "found";
  const isPlacementAvailable = Boolean(placementModelSrc);
  const shouldShowModelLoader =
    status !== "error" && (status === "loading" || !isModelReady);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[100] overflow-hidden bg-black text-white"
      role="dialog"
    >
      <div
        ref={mindarContainerRef}
        className="absolute inset-0 touch-none overflow-hidden bg-black"
      />

      <div
        ref={labelOverlayRef}
        className={[
          "pointer-events-none absolute inset-0 z-30 transition-opacity duration-300",
          isModelVisible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-black/72 to-transparent px-5 pb-10 pt-5">
        <p className="text-[0.78rem] font-[400] uppercase tracking-[0.14em] text-white/62">
          Living Nimbo Universe
        </p>
        <p className="mt-1 max-w-[17rem] text-[1rem] font-[400] leading-tight tracking-[-0.035em]">
          {isFound
            ? "Disparador detectado. Mueve el díptico para explorar la pieza."
            : isModelReady && isScanning
              ? "Apunta la cámara al disparador en el díptico para revelar la pieza."
              : "Cargando modelo 3D..."}
        </p>
      </div>

      {shouldShowModelLoader && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/45 px-8 text-center">
          <p className="text-[1rem] tracking-[-0.035em]">
            Cargando modelo 3D...
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/72 px-8 text-center">
          <p className="max-w-[18rem] text-[1rem] leading-snug tracking-[-0.035em]">
            {errorMessage}
          </p>
        </div>
      )}

      {isModelReady && (
        <div className="absolute inset-x-0 bottom-5 z-40 flex justify-center px-5">
          <button
            aria-disabled={!isPlacementAvailable}
            className={[
              "inline-flex h-[2.55rem] min-w-[13rem] items-center justify-center rounded-[0.72rem] bg-white px-6 text-[0.9rem] font-[500] tracking-[-0.04em] text-black shadow-[0_0.7rem_1.7rem_rgba(0,0,0,0.22)] transition hover:bg-white/90 max-[370px]:h-[2.35rem] max-[370px]:text-[0.78rem]",
              !isPlacementAvailable ? "cursor-not-allowed opacity-[0.42]" : "",
            ].join(" ")}
            disabled={!isPlacementAvailable}
            onClick={onOpenPlacement}
            type="button"
          >
            Posiciónala en tu entorno
          </button>
        </div>
      )}

      <button
        aria-label="Cerrar cámara AR"
        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[1.25rem] leading-none text-black shadow-[0_0.6rem_1.6rem_rgba(0,0,0,0.22)]"
        onClick={onClose}
        type="button"
      >
        ×
      </button>
    </div>
  );
}
