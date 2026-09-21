"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCw, RotateCcw, Box, Compass } from "lucide-react";
import { getAssetPath } from "@/lib/utils";

interface ModelViewer3DProps {
  src: string;
  poster?: string;
  alt: string;
  height?: string;
  hudLabel?: string;
  autoRotate?: boolean;
}

// Global flag to prevent redundant dynamic imports
let modelViewerScriptLoaded = false;
let modelViewerScriptLoading: Promise<any> | null = null;

function loadModelViewer() {
  if (typeof window === "undefined") return Promise.resolve();
  if (modelViewerScriptLoaded || customElements.get("model-viewer")) {
    modelViewerScriptLoaded = true;
    return Promise.resolve();
  }
  if (!modelViewerScriptLoading) {
    modelViewerScriptLoading = import("@google/model-viewer")
      .then(() => {
        modelViewerScriptLoaded = true;
      })
      .catch((err) => {
        console.error("Failed to load @google/model-viewer:", err);
      });
  }
  return modelViewerScriptLoading;
}

export function ModelViewer3D({
  src,
  poster,
  alt,
  height = "340px",
  hudLabel = "CAD / CFD 3D MODEL HUD",
  autoRotate = true,
}: ModelViewer3DProps) {
  const viewerRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [scriptReady, setScriptReady] = useState(modelViewerScriptLoaded);

  useEffect(() => {
    let isMounted = true;
    loadModelViewer().then(() => {
      if (isMounted) setScriptReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.cameraTarget = "auto auto auto";
      viewerRef.current.cameraOrbit = "0deg 75deg 100%";
    }
  };

  const toggleRotate = () => {
    if (viewerRef.current) {
      if (isRotating) {
        viewerRef.current.removeAttribute("auto-rotate");
        setIsRotating(false);
      } else {
        viewerRef.current.setAttribute("auto-rotate", "");
        setIsRotating(true);
      }
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-cyan-500/20 shadow-lg group flex flex-col"
      style={{ height }}
    >
      {/* HUD Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-cyan-500/20 text-xs font-mono text-cyan-700 dark:text-cyan-400 z-20 shrink-0">
        <div className="flex items-center gap-1.5 font-bold tracking-wider truncate">
          <Box className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse shrink-0" />
          <span className="truncate">{hudLabel}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={toggleRotate}
            type="button"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border ${
              isRotating
                ? "bg-cyan-50 dark:bg-cyan-500/20 border-cyan-300 dark:border-cyan-400/40 text-cyan-700 dark:text-cyan-300 font-semibold"
                : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm"
            }`}
            title="Toggle Auto-Rotation"
          >
            <RotateCw className="w-3 h-3" />
            <span className="hidden sm:inline">Rotate</span>
          </button>

          <button
            onClick={handleReset}
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 hover:border-cyan-400 dark:hover:border-cyan-500/40 transition-all shadow-sm"
            title="Reset Camera Angle"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Model Viewer Container */}
      <div className="relative w-full flex-1 flex items-center justify-center bg-gradient-to-b from-slate-100/70 via-slate-50 to-slate-100/90 dark:from-slate-950/90 dark:to-slate-950 overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,transparent_70%)] pointer-events-none" />

        {scriptReady ? (
          // @ts-ignore - custom element
          <model-viewer
            ref={viewerRef}
            src={getAssetPath(src)}
            poster={getAssetPath(poster)}
            alt={alt}
            auto-rotate={isRotating ? "" : undefined}
            camera-controls
            touch-action="pan-y"
            interaction-prompt="none"
            shadow-intensity="1.2"
            exposure="1"
            environment-image="neutral"
            loading="lazy"
            reveal="auto"
            onLoad={() => setLoaded(true)}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              display: "block",
            }}
          >
            {/* Loading / Progress indicator */}
            {!loaded && (
              <div
                slot="poster"
                className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-xs bg-slate-100 dark:bg-slate-950"
              >
                <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading 3D CAD Mesh...</span>
              </div>
            )}
            {/* @ts-ignore */}
          </model-viewer>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-xs">
            <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span>Initializing WebGL Scene...</span>
          </div>
        )}
      </div>

      {/* Interactive Orbit Hint */}
      <div className="absolute bottom-2.5 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/85 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/90 dark:border-slate-700/60 text-[10px] font-mono text-slate-600 dark:text-slate-300 pointer-events-none shadow-sm">
        <Compass className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
        <span>Drag to orbit · Scroll to zoom</span>
      </div>
    </div>
  );
}
