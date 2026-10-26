"use client";

import { useEffect, useRef } from "react";
import { BwbEngine, type Shot, type ViewMode } from "./BwbEngine";
import { getAssetPath } from "@/lib/utils";

export const MODEL_URL = "/Assets/bwb-dissertation.glb";

interface BwbCanvasProps {
  className?: string;
  interactive?: boolean;
  shots?: Shot[];
  /** Ref the parent writes the continuous scroll index into each frame */
  shotIndexRef?: React.MutableRefObject<number>;
  mode?: ViewMode;
  flowOn?: boolean;
  autoRotate?: boolean;
  onProgress?: (p: number) => void;
  onReady?: () => void;
}

export function BwbCanvas({
  className,
  interactive,
  shots,
  shotIndexRef,
  mode = "solid",
  flowOn = true,
  autoRotate = true,
  onProgress,
  onReady,
}: BwbCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BwbEngine | null>(null);

  useEffect(() => {
    const engine = new BwbEngine(canvasRef.current!, { interactive, onProgress, onReady });
    engine.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (shots) engine.shots = shots;
    engine.load(getAssetPath(MODEL_URL));
    engineRef.current = engine;

    let raf = 0;
    const sync = () => {
      if (shotIndexRef) engine.shotIndex = shotIndexRef.current;
      raf = requestAnimationFrame(sync);
    };
    sync();
    return () => {
      cancelAnimationFrame(raf);
      engine.dispose();
    };
    // Engine is created once; props below are pushed in separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setMode(mode);
  }, [mode]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.flowOn = flowOn;
  }, [flowOn]);

  useEffect(() => {
    engineRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);

  return <canvas ref={canvasRef} className={className} />;
}
