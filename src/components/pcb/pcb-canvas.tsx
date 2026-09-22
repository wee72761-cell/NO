"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { PcbBoard, PcbComponent, PcbDrcItem } from "@/lib/pcb/types";
import { ZoomIn, ZoomOut, Maximize2, Layers, Eye, EyeOff, Crosshair } from "lucide-react";

interface PcbCanvasProps {
  board: PcbBoard;
  drcItems?: PcbDrcItem[];
  selectedElement: string | null;
  onSelectElement: (id: string | null) => void;
}

export function PcbCanvas({
  board,
  drcItems = [],
  selectedElement,
  onSelectElement,
}: PcbCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(12); // pixels per mm (default: 12px = 1mm)
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Layer visibility toggles
  const [showTopCopper, setShowTopCopper] = useState(true);
  const [showBottomCopper, setShowBottomCopper] = useState(true);
  const [showSilkscreen, setShowSilkscreen] = useState(true);
  const [showVias, setShowVias] = useState(true);
  const [showDrcMarkers, setShowDrcMarkers] = useState(true);
  const [showRatsnest, setShowRatsnest] = useState(false);

  // Active hover info
  const [hoveredInfo, setHoveredInfo] = useState<{
    x: number;
    y: number;
    title: string;
    details: string;
  } | null>(null);

  // Fit board to view on initial mount
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const boardW = board.dimensions.widthMm;
      const boardH = board.dimensions.heightMm;
      const pad = 80;
      const fitScale = Math.min((clientWidth - pad) / boardW, (clientHeight - pad) / boardH);
      const initialScale = Math.max(6, Math.min(18, fitScale));
      setScale(initialScale);
      setPan({
        x: (clientWidth - boardW * initialScale) / 2,
        y: (clientHeight - boardH * initialScale) / 2,
      });
    }
  }, [board.id, board.dimensions.widthMm, board.dimensions.heightMm]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    setScale((prev) => Math.max(4, Math.min(45, prev * zoomFactor)));
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 || e.button === 1) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const resetView = () => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const boardW = board.dimensions.widthMm;
      const boardH = board.dimensions.heightMm;
      const fitScale = Math.min((clientWidth - 80) / boardW, (clientHeight - 80) / boardH);
      const newScale = Math.max(6, Math.min(18, fitScale));
      setScale(newScale);
      setPan({
        x: (clientWidth - boardW * newScale) / 2,
        y: (clientHeight - boardH * newScale) / 2,
      });
    }
  };

  // Pre-calculate DRC violation spots
  const violationPoints = useMemo(() => {
    return drcItems
      .filter((i) => i.location && i.severity === "critical")
      .map((item) => ({
        id: item.id,
        x: item.location!.x,
        y: item.location!.y,
        rule: item.rule,
        description: item.description,
      }));
  }, [drcItems]);

  const boardWpx = board.dimensions.widthMm * scale;
  const boardHpx = board.dimensions.heightMm * scale;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-zinc-950 font-sans select-none">
      {/* Top Floating Viewport Toolbar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/90 p-1.5 backdrop-blur-md shadow-xl text-xs text-zinc-300">
        <button
          onClick={() => setScale((s) => Math.min(45, s * 1.2))}
          className="rounded p-1.5 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(4, s * 0.8))}
          className="rounded p-1.5 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={resetView}
          className="rounded p-1.5 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Fit board to screen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <div className="mx-1 h-4 w-px bg-zinc-800" />
        <span className="px-1.5 font-mono text-[11px] text-zinc-400">
          Scale: {scale.toFixed(1)} px/mm ({((scale / 12) * 100).toFixed(0)}%)
        </span>
      </div>

      {/* Layer Visibility Controller */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 p-2 backdrop-blur-md shadow-xl text-xs text-zinc-300">
        <div className="flex items-center gap-1.5 font-medium text-zinc-400 pb-1 border-b border-zinc-800">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span>PCB Layers</span>
        </div>

        <button
          onClick={() => setShowTopCopper(!showTopCopper)}
          className={`flex items-center justify-between gap-3 px-1.5 py-1 rounded transition-colors ${
            showTopCopper ? "text-red-400 font-semibold" : "text-zinc-500"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block shadow-sm" />
            Top Copper (F.Cu)
          </span>
          {showTopCopper ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={() => setShowBottomCopper(!showBottomCopper)}
          className={`flex items-center justify-between gap-3 px-1.5 py-1 rounded transition-colors ${
            showBottomCopper ? "text-cyan-400 font-semibold" : "text-zinc-500"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500 inline-block shadow-sm" />
            Bottom Copper (B.Cu)
          </span>
          {showBottomCopper ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={() => setShowSilkscreen(!showSilkscreen)}
          className={`flex items-center justify-between gap-3 px-1.5 py-1 rounded transition-colors ${
            showSilkscreen ? "text-zinc-100 font-semibold" : "text-zinc-500"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-200 inline-block shadow-sm" />
            Silkscreen (F.SilkS)
          </span>
          {showSilkscreen ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={() => setShowVias(!showVias)}
          className={`flex items-center justify-between gap-3 px-1.5 py-1 rounded transition-colors ${
            showVias ? "text-amber-400 font-semibold" : "text-zinc-500"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block shadow-sm" />
            Vias & Drills
          </span>
          {showVias ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={() => setShowDrcMarkers(!showDrcMarkers)}
          className={`flex items-center justify-between gap-3 px-1.5 py-1 rounded transition-colors ${
            showDrcMarkers ? "text-rose-400 font-semibold" : "text-zinc-500"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse inline-block shadow-sm" />
            DRC Violations ({violationPoints.length})
          </span>
          {showDrcMarkers ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Main Interactive CAD Stage */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <svg
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: `${scale * 5}px ${scale * 5}px`,
          }}
        >
          <g transform={`translate(${pan.x}, ${pan.y})`}>
            {/* PCB Substrate Core Body */}
            <rect
              x={0}
              y={0}
              width={boardWpx}
              height={boardHpx}
              rx={board.dimensions.cornerRadiusMm * scale}
              ry={board.dimensions.cornerRadiusMm * scale}
              fill="#062e19" // Classic deep solder mask green
              stroke="#0f5132"
              strokeWidth={scale * 0.3}
              className="filter drop-shadow-2xl"
            />

            {/* Ground Plane Pour Mesh/Hatch */}
            <rect
              x={scale * 0.4}
              y={scale * 0.4}
              width={boardWpx - scale * 0.8}
              height={boardHpx - scale * 0.8}
              rx={(board.dimensions.cornerRadiusMm - 0.4) * scale}
              ry={(board.dimensions.cornerRadiusMm - 0.4) * scale}
              fill="#083820"
              opacity={0.6}
            />

            {/* Bottom Copper Traces (B.Cu) */}
            {showBottomCopper && (
              <g id="layer-b-cu">
                {board.traces
                  .filter((t) => t.layer === "B.Cu")
                  .map((trace) => {
                    const isSelected = selectedElement === trace.id || selectedElement === trace.net;
                    const pathD = trace.points
                      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p[0] * scale} ${p[1] * scale}`)
                      .join(" ");

                    return (
                      <path
                        key={trace.id}
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? "#38bdf8" : "#0284c7"}
                        strokeWidth={trace.widthMm * scale}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isSelected ? 1 : 0.85}
                        className="cursor-pointer transition-all hover:stroke-sky-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectElement(trace.net);
                        }}
                        onMouseEnter={(e) => {
                          setHoveredInfo({
                            x: e.clientX,
                            y: e.clientY,
                            title: `Net: ${trace.net} (Bottom Copper)`,
                            details: `Width: ${trace.widthMm}mm | Clearance: ${trace.clearanceMm}mm`,
                          });
                        }}
                        onMouseLeave={() => setHoveredInfo(null)}
                      />
                    );
                  })}
              </g>
            )}

            {/* Top Copper Traces (F.Cu) */}
            {showTopCopper && (
              <g id="layer-f-cu">
                {board.traces
                  .filter((t) => t.layer === "F.Cu")
                  .map((trace) => {
                    const isSelected = selectedElement === trace.id || selectedElement === trace.net;
                    const pathD = trace.points
                      .map((p, idx) => `${idx === 0 ? "M" : "L"} ${p[0] * scale} ${p[1] * scale}`)
                      .join(" ");

                    return (
                      <path
                        key={trace.id}
                        d={pathD}
                        fill="none"
                        stroke={isSelected ? "#fbbf24" : "#dc2626"}
                        strokeWidth={trace.widthMm * scale}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isSelected ? 1 : 0.9}
                        className="cursor-pointer transition-all hover:stroke-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectElement(trace.net);
                        }}
                        onMouseEnter={(e) => {
                          setHoveredInfo({
                            x: e.clientX,
                            y: e.clientY,
                            title: `Net: ${trace.net} (Top Copper)`,
                            details: `Width: ${trace.widthMm}mm | Clearance: ${trace.clearanceMm}mm`,
                          });
                        }}
                        onMouseLeave={() => setHoveredInfo(null)}
                      />
                    );
                  })}
              </g>
            )}

            {/* Vias and Plated Holes */}
            {showVias && (
              <g id="layer-vias">
                {board.vias.map((via) => {
                  const isSelected = selectedElement === via.net;
                  return (
                    <g
                      key={via.id}
                      transform={`translate(${via.x * scale}, ${via.y * scale})`}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectElement(via.net);
                      }}
                    >
                      {/* Annular copper ring */}
                      <circle
                        r={(via.padMm * scale) / 2}
                        fill={isSelected ? "#f59e0b" : "#d97706"}
                        stroke="#b45309"
                        strokeWidth={scale * 0.05}
                      />
                      {/* Drill hole */}
                      <circle r={(via.drillMm * scale) / 2} fill="#000000" />
                    </g>
                  );
                })}
              </g>
            )}

            {/* Components and Silkscreen */}
            <g id="layer-components">
              {board.components.map((comp) => {
                const isSelected = selectedElement === comp.id || selectedElement === comp.ref;
                const compW = comp.widthMm * scale;
                const compH = comp.heightMm * scale;

                return (
                  <g
                    key={comp.id}
                    transform={`translate(${comp.x * scale}, ${comp.y * scale}) rotate(${comp.rotation})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectElement(comp.ref);
                    }}
                    onMouseEnter={(e) => {
                      setHoveredInfo({
                        x: e.clientX,
                        y: e.clientY,
                        title: `${comp.ref}: ${comp.name}`,
                        details: `Pkg: ${comp.package} | Value: ${comp.value || "N/A"} | LCSC: ${comp.lcscPartNumber || "N/A"}`,
                      });
                    }}
                    onMouseLeave={() => setHoveredInfo(null)}
                  >
                    {/* Component Package Body */}
                    <rect
                      x={-compW / 2}
                      y={-compH / 2}
                      width={compW}
                      height={compH}
                      fill={isSelected ? "#312e81" : "#18181b"}
                      stroke={isSelected ? "#818cf8" : "#27272a"}
                      strokeWidth={scale * 0.12}
                      rx={scale * 0.2}
                      ry={scale * 0.2}
                      opacity={0.95}
                    />

                    {/* Silkscreen outline & Ref Designator */}
                    {showSilkscreen && (
                      <>
                        <rect
                          x={-compW / 2 - scale * 0.2}
                          y={-compH / 2 - scale * 0.2}
                          width={compW + scale * 0.4}
                          height={compH + scale * 0.4}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth={scale * 0.08}
                          opacity={0.8}
                        />
                        {/* Pin 1 orientation mark */}
                        <circle
                          cx={-compW / 2 + scale * 0.6}
                          cy={-compH / 2 + scale * 0.6}
                          r={scale * 0.25}
                          fill="#ffffff"
                        />
                        {/* Ref text */}
                        <text
                          x={0}
                          y={scale * 0.3}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize={Math.max(8, scale * 0.8)}
                          fontFamily="monospace"
                          fontWeight="bold"
                          className="pointer-events-none"
                        >
                          {comp.ref}
                        </text>
                      </>
                    )}

                    {/* SMD / Through-Hole Copper Pads */}
                    {comp.pins.map((pin) => {
                      const isPinSelected = selectedElement === pin.net;
                      const padW = scale * 0.6;
                      const padH = scale * 0.9;
                      return (
                        <rect
                          key={pin.number}
                          x={pin.relX * scale - padW / 2}
                          y={pin.relY * scale - padH / 2}
                          width={padW}
                          height={padH}
                          fill={isPinSelected ? "#fbbf24" : "#f59e0b"}
                          stroke="#b45309"
                          strokeWidth={scale * 0.05}
                          rx={scale * 0.1}
                          ry={scale * 0.1}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>

            {/* DRC Violation Overlay Rings */}
            {showDrcMarkers &&
              violationPoints.map((v) => (
                <g key={v.id} transform={`translate(${v.x * scale}, ${v.y * scale})`}>
                  <circle
                    r={scale * 2.5}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={scale * 0.25}
                    strokeDasharray={`${scale * 0.4}, ${scale * 0.4}`}
                    className="animate-spin"
                    style={{ transformOrigin: "0 0" }}
                  />
                  <circle r={scale * 0.8} fill="#ef4444" opacity={0.8} />
                  <text
                    x={scale * 1.5}
                    y={scale * 0.3}
                    fill="#fca5a5"
                    fontSize={Math.max(9, scale * 0.8)}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    ! DRC: {v.rule.slice(0, 20)}
                  </text>
                </g>
              ))}

            {/* Board Dimensions Dimensions Label */}
            <text
              x={boardWpx / 2}
              y={boardHpx + scale * 2.5}
              textAnchor="middle"
              fill="#71717a"
              fontSize={11}
              fontFamily="monospace"
            >
              {board.dimensions.widthMm} mm × {board.dimensions.heightMm} mm ({board.layersCount} Layers, {board.copperThicknessOz}oz Cu)
            </text>
          </g>
        </svg>
      </div>

      {/* Hover Info Tooltip */}
      {hoveredInfo && (
        <div
          className="pointer-events-none fixed z-50 rounded border border-zinc-700 bg-zinc-900/95 px-2.5 py-1.5 shadow-2xl text-xs text-zinc-200"
          style={{
            left: hoveredInfo.x + 14,
            top: hoveredInfo.y + 14,
          }}
        >
          <div className="font-semibold text-white">{hoveredInfo.title}</div>
          <div className="text-[11px] text-zinc-400 font-mono">{hoveredInfo.details}</div>
        </div>
      )}
    </div>
  );
}
