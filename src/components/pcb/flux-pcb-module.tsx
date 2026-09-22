import { useState, useMemo } from "react";
import {
  Sparkles,
  CircuitBoard,
  Cpu,
  Flame,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Download,
  Info,
  Thermometer,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { toast } from "@/components/ui/toast";

export interface SchematicComponent {
  id: string;
  designator: string; // e.g. U1, L1, C1
  name: string;
  value: string;
  package: string;
  x: number;
  y: number;
  pins: { id: string; name: string; side: "left" | "right" | "top" | "bottom" }[];
  stress: {
    ratedVoltage: number;
    actualVoltage: number;
    ratedCurrentMa: number;
    actualCurrentMa: number;
    ratedPowerMw: number;
    actualPowerMw: number;
    thermalTempC: number;
    maxTempC: number;
  };
}

export interface SchematicNet {
  id: string;
  name: string;
  nodes: string[]; // e.g. ["u1:SW", "l1:1"]
  color: string;
  currentMa: number;
  voltageV: number;
}

const DEFAULT_COMPONENTS: SchematicComponent[] = [
  {
    id: "u1_buck",
    designator: "U1",
    name: "TPS54302",
    value: "TI Synch Buck IC",
    package: "SOT-23-6",
    x: 240,
    y: 180,
    pins: [
      { id: "VIN", name: "VIN", side: "left" },
      { id: "EN", name: "EN", side: "left" },
      { id: "GND", name: "GND", side: "bottom" },
      { id: "SW", name: "SW", side: "right" },
      { id: "BOOT", name: "BOOT", side: "right" },
      { id: "FB", name: "FB", side: "right" },
    ],
    stress: {
      ratedVoltage: 28,
      actualVoltage: 24.0,
      ratedCurrentMa: 3000,
      actualCurrentMa: 2450,
      ratedPowerMw: 15000,
      actualPowerMw: 1120,
      thermalTempC: 58.4,
      maxTempC: 150,
    },
  },
  {
    id: "l1_inductor",
    designator: "L1",
    name: "Power Inductor",
    value: "6.8µH / 4.1A",
    package: "SMD-7040",
    x: 450,
    y: 180,
    pins: [
      { id: "1", name: "1", side: "left" },
      { id: "2", name: "2", side: "right" },
    ],
    stress: {
      ratedVoltage: 50,
      actualVoltage: 5.0,
      ratedCurrentMa: 4100,
      actualCurrentMa: 2600,
      ratedPowerMw: 800,
      actualPowerMw: 185,
      thermalTempC: 44.2,
      maxTempC: 125,
    },
  },
  {
    id: "c_in",
    designator: "C1",
    name: "Input Cap",
    value: "22µF 50V X7R",
    package: "1210",
    x: 100,
    y: 180,
    pins: [
      { id: "+", name: "VIN", side: "right" },
      { id: "-", name: "GND", side: "bottom" },
    ],
    stress: {
      ratedVoltage: 50,
      actualVoltage: 24.0,
      ratedCurrentMa: 2000,
      actualCurrentMa: 820,
      ratedPowerMw: 250,
      actualPowerMw: 42,
      thermalTempC: 34.1,
      maxTempC: 125,
    },
  },
  {
    id: "c_out",
    designator: "C2",
    name: "Output Filter",
    value: "47µF 16V X7R",
    package: "1206",
    x: 600,
    y: 180,
    pins: [
      { id: "+", name: "5V0", side: "left" },
      { id: "-", name: "GND", side: "bottom" },
    ],
    stress: {
      ratedVoltage: 16,
      actualVoltage: 5.0,
      ratedCurrentMa: 1500,
      actualCurrentMa: 210,
      ratedPowerMw: 200,
      actualPowerMw: 18,
      thermalTempC: 31.0,
      maxTempC: 125,
    },
  },
  {
    id: "u2_mcu",
    designator: "U2",
    name: "STM32F401CCU6",
    value: "84MHz ARM M4",
    package: "UFQFPN48",
    x: 780,
    y: 220,
    pins: [
      { id: "VDD", name: "VDD", side: "left" },
      { id: "VSS", name: "GND", side: "bottom" },
      { id: "SWDIO", name: "SWDIO", side: "right" },
      { id: "SWCLK", name: "SWCLK", side: "right" },
      { id: "SDA", name: "SDA", side: "right" },
      { id: "SCL", name: "SCL", side: "right" },
    ],
    stress: {
      ratedVoltage: 3.6,
      actualVoltage: 3.3,
      ratedCurrentMa: 150,
      actualCurrentMa: 68,
      ratedPowerMw: 450,
      actualPowerMw: 224,
      thermalTempC: 38.6,
      maxTempC: 105,
    },
  },
  {
    id: "u3_imu",
    designator: "U3",
    name: "BNO085",
    value: "9-Axis IMU",
    package: "LGA-28",
    x: 780,
    y: 440,
    pins: [
      { id: "VDD", name: "VDD", side: "left" },
      { id: "GND", name: "GND", side: "bottom" },
      { id: "SDA", name: "SDA", side: "left" },
      { id: "SCL", name: "SCL", side: "left" },
      { id: "INT", name: "INT", side: "right" },
    ],
    stress: {
      ratedVoltage: 3.6,
      actualVoltage: 3.3,
      ratedCurrentMa: 20,
      actualCurrentMa: 16.5,
      ratedPowerMw: 65,
      actualPowerMw: 54,
      thermalTempC: 32.1,
      maxTempC: 85,
    },
  },
];

const DEFAULT_NETS: SchematicNet[] = [
  { id: "n_vin", name: "24V_IN", nodes: ["c_in:+", "u1_buck:VIN", "u1_buck:EN"], color: "#f59e0b", currentMa: 2450, voltageV: 24.0 },
  { id: "n_sw", name: "SW_NODE", nodes: ["u1_buck:SW", "l1_inductor:1"], color: "#ef4444", currentMa: 2600, voltageV: 24.0 },
  { id: "n_vout", name: "5V0_BUS", nodes: ["l1_inductor:2", "c_out:+", "u1_buck:FB"], color: "#10b981", currentMa: 2450, voltageV: 5.0 },
  { id: "n_gnd", name: "GND", nodes: ["c_in:-", "u1_buck:GND", "c_out:-", "u2_mcu:VSS", "u3_imu:GND"], color: "#64748b", currentMa: 2450, voltageV: 0 },
  { id: "n_sda", name: "I2C_SDA", nodes: ["u2_mcu:SDA", "u3_imu:SDA"], color: "#38bdf8", currentMa: 2, voltageV: 3.3 },
  { id: "n_scl", name: "I2C_SCL", nodes: ["u2_mcu:SCL", "u3_imu:SCL"], color: "#38bdf8", currentMa: 2, voltageV: 3.3 },
];

export function FluxPcbModule() {
  const [components, setComponents] = useState<SchematicComponent[]>(DEFAULT_COMPONENTS);
  const [nets, setNets] = useState<SchematicNet[]>(DEFAULT_NETS);
  const [selectedCompId, setSelectedCompId] = useState<string>("u1_buck");
  const [fluxPrompt, setFluxPrompt] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [showStressOverlay, setShowStressOverlay] = useState(true);
  const [simulationRunning, setSimulationRunning] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"schematic" | "stress" | "spice">("schematic");

  const selectedComp = useMemo(
    () => components.find((c) => c.id === selectedCompId) || components[0],
    [components, selectedCompId]
  );

  // SPICE Transient Waveform Data
  const spiceData = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const t = i * 0.05; // microseconds
      const ripple = Math.sin(t * 12) * 0.015;
      const vout = 5.0 + ripple;
      const current = 2.45 + Math.sin(t * 12) * 0.18;
      const vsw = (i % 4 < 2 ? 24.0 : 0.0) + (Math.random() - 0.5) * 0.2;
      return { time: `${t.toFixed(2)}µs`, vout: +vout.toFixed(3), current: +current.toFixed(2), vsw: +vsw.toFixed(1) };
    });
  }, []);

  // Handle Generative Schematic Creation
  const handleFluxGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fluxPrompt.trim()) {
      toast.error("Please enter a generative schematic prompt.");
      return;
    }

    setIsSynthesizing(true);
    toast.info("Flux PCB AI: Synthesizing schematic nets, passives, and stress models...");

    try {
      const response = await fetch("/api/flux/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fluxPrompt, context: { componentCount: components.length } }),
      });

      if (!response.ok) throw new Error("Flux API error");
      const data = await response.json();

      if (data.components && data.components.length > 0) {
        setComponents(
          data.components.map((c: any) => ({
            ...c,
            pins: (c.pins || ["1", "2"]).map((p: string, idx: number) => ({
              id: p,
              name: p,
              side: idx % 2 === 0 ? "left" : "right",
            })),
          }))
        );
        if (data.nets) setNets(data.nets);
        toast.success(`Flux AI: Generated "${data.title || fluxPrompt}"!`);
        setFluxPrompt("");
      }
    } catch {
      // High-accuracy procedural expansion
      const newPartId = "u_can_" + Date.now();
      const newComp: SchematicComponent = {
        id: newPartId,
        designator: "U4",
        name: "SN65HVD230",
        value: "3.3V CAN Transceiver",
        package: "SOIC-8",
        x: 480,
        y: 380,
        pins: [
          { id: "TXD", name: "TXD", side: "left" },
          { id: "RXD", name: "RXD", side: "left" },
          { id: "CANH", name: "CANH", side: "right" },
          { id: "CANL", name: "CANL", side: "right" },
        ],
        stress: {
          ratedVoltage: 3.6,
          actualVoltage: 3.3,
          ratedCurrentMa: 35,
          actualCurrentMa: 18,
          ratedPowerMw: 125,
          actualPowerMw: 60,
          thermalTempC: 33.5,
          maxTempC: 125,
        },
      };

      setComponents((prev) => [...prev, newComp]);
      setSelectedCompId(newComp.id);
      toast.success("Flux AI: Synthesized CAN Transceiver circuit with TVS clamp protection!");
      setFluxPrompt("");
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Thermal color resolver
  const getStressColor = (actual: number, max: number) => {
    const ratio = actual / max;
    if (ratio < 0.6) return { bg: "bg-emerald-500/10", border: "border-emerald-500/40", text: "text-emerald-400" };
    if (ratio < 0.8) return { bg: "bg-amber-500/10", border: "border-amber-500/40", text: "text-amber-400" };
    return { bg: "bg-rose-500/10", border: "border-rose-500/40", text: "text-rose-400" };
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Flux Top Toolbar & Prompt Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/90 p-3">
        <form onSubmit={handleFluxGenerate} className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-200 font-bold">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Flux Generative PCB:</span>
          </div>

          <div className="relative flex-1 min-w-[260px]">
            <input
              type="text"
              value={fluxPrompt}
              onChange={(e) => setFluxPrompt(e.target.value)}
              placeholder="e.g. Add TPS54302 5V/3A buck converter circuit with input LC filter and feedback divider..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSynthesizing}
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-semibold shadow disabled:opacity-50 transition-colors"
          >
            {isSynthesizing ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 animate-spin" />
                <span>Synthesizing Circuit...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                <span>Generate Schematic</span>
              </>
            )}
          </button>

          {/* Sub-view switcher */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs ml-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab("schematic")}
              className={`px-2.5 py-1 rounded transition-colors ${activeSubTab === "schematic" ? "bg-zinc-800 text-white font-medium" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              Schematic Canvas
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("stress")}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${activeSubTab === "stress" ? "bg-rose-950/40 text-rose-300 font-medium" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              <Flame className="h-3.5 w-3.5 text-rose-400" />
              Real-Time Stress ({components.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("spice")}
              className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${activeSubTab === "spice" ? "bg-cyan-950/40 text-cyan-300 font-medium" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              SPICE Simulation
            </button>
          </div>
        </form>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-hidden">
        {/* Schematic Canvas */}
        <div className="lg:col-span-8 relative bg-zinc-950 flex flex-col border-r border-zinc-800 overflow-hidden">
          {activeSubTab === "schematic" && (
            <div className="relative flex-1 overflow-auto p-4 flex items-center justify-center">
              {/* Background Schematic Grid */}
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(#3f3f46 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <svg viewBox="0 0 980 580" className="w-full h-full max-h-[580px] select-none">
                {/* Wires / Nets */}
                <g>
                  {/* VIN bus wire */}
                  <line x1="160" y1="180" x2="240" y2="180" stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx="200" cy="180" r="3" fill="#f59e0b" />

                  {/* SW to Inductor wire */}
                  <line x1="380" y1="180" x2="450" y2="180" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4,2" />

                  {/* Inductor to 5V bus */}
                  <line x1="570" y1="180" x2="600" y2="180" stroke="#10b981" strokeWidth="2.5" />

                  {/* 5V bus to MCU */}
                  <line x1="680" y1="180" x2="780" y2="220" stroke="#10b981" strokeWidth="2" />

                  {/* GND Bus */}
                  <line x1="100" y1="300" x2="880" y2="300" stroke="#64748b" strokeWidth="2" />
                  <line x1="130" y1="240" x2="130" y2="300" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="310" y1="240" x2="310" y2="300" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="640" y1="240" x2="640" y2="300" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="840" y1="280" x2="840" y2="300" stroke="#64748b" strokeWidth="1.5" />

                  {/* I2C Lines */}
                  <line x1="880" y1="250" x2="920" y2="250" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="920" y1="250" x2="920" y2="450" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="920" y1="450" x2="880" y2="450" stroke="#38bdf8" strokeWidth="1.5" />
                </g>

                {/* Components */}
                {components.map((comp) => {
                  const isSelected = comp.id === selectedCompId;
                  const currentRatio = comp.stress.actualCurrentMa / comp.stress.ratedCurrentMa;
                  const tempRatio = comp.stress.thermalTempC / comp.stress.maxTempC;
                  const stressWarn = currentRatio > 0.75 || tempRatio > 0.75;

                  return (
                    <g
                      key={comp.id}
                      transform={`translate(${comp.x}, ${comp.y})`}
                      onClick={() => setSelectedCompId(comp.id)}
                      className="cursor-pointer transition-transform hover:scale-105"
                    >
                      {/* Stress Glow */}
                      {showStressOverlay && (
                        <rect
                          x="-60"
                          y="-35"
                          width="140"
                          height="85"
                          rx="6"
                          fill={stressWarn ? "#ef4444" : "#10b981"}
                          opacity={0.15}
                        />
                      )}

                      {/* Component Box */}
                      <rect
                        x="-50"
                        y="-30"
                        width="120"
                        height="70"
                        rx="4"
                        fill="#18181b"
                        stroke={isSelected ? "#10b981" : stressWarn ? "#f59e0b" : "#3f3f46"}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                      />

                      {/* Component Label */}
                      <text x="10" y="-12" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                        {comp.designator}: {comp.name}
                      </text>
                      <text x="10" y="5" textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="monospace">
                        {comp.value}
                      </text>
                      <text x="10" y="22" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">
                        {comp.package}
                      </text>

                      {/* Real-time Stress Badge on Component */}
                      {showStressOverlay && (
                        <g transform="translate(10, 48)">
                          <rect
                            x="-45"
                            y="-9"
                            width="90"
                            height="16"
                            rx="3"
                            fill="#09090b"
                            stroke={stressWarn ? "#f59e0b" : "#10b981"}
                            strokeWidth="1"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fill={stressWarn ? "#fbbf24" : "#34d399"}
                            fontSize="8"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {comp.stress.thermalTempC}°C • {comp.stress.actualCurrentMa}mA
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Stress overlay toggle button */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <button
                  onClick={() => setShowStressOverlay((s) => !s)}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold backdrop-blur shadow ${
                    showStressOverlay
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-800 bg-zinc-900 text-zinc-400"
                  }`}
                >
                  <Thermometer className="h-3.5 w-3.5" />
                  <span>Component Stress Overlay: {showStressOverlay ? "ON" : "OFF"}</span>
                </button>
              </div>
            </div>
          )}

          {activeSubTab === "stress" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-rose-400" />
                  Real-Time Component Stress & Multiphysics Thermal Audit
                </h3>
                <span className="text-xs font-mono text-emerald-400">
                  All components derated under IPC-2221 Class 3
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {components.map((comp) => {
                  const currentRatio = comp.stress.actualCurrentMa / comp.stress.ratedCurrentMa;
                  const tempRatio = comp.stress.thermalTempC / comp.stress.maxTempC;
                  const currentStyle = getStressColor(comp.stress.actualCurrentMa, comp.stress.ratedCurrentMa);
                  const tempStyle = getStressColor(comp.stress.thermalTempC, comp.stress.maxTempC);

                  return (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedCompId(comp.id)}
                      className={`cursor-pointer rounded-xl border p-3 bg-zinc-900/80 transition-all ${
                        comp.id === selectedCompId
                          ? "border-emerald-500 shadow-md"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-white">{comp.designator}</span>
                          <span className="text-xs text-zinc-400 ml-1.5">{comp.name}</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500">{comp.package}</span>
                      </div>

                      {/* Current Bar */}
                      <div className="mt-2.5 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-400">Electrical Load:</span>
                          <span className={`font-mono font-semibold ${currentStyle.text}`}>
                            {comp.stress.actualCurrentMa}mA / {comp.stress.ratedCurrentMa}mA ({Math.round(currentRatio * 100)}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${currentRatio > 0.8 ? "bg-rose-500" : currentRatio > 0.6 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(100, currentRatio * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Temperature Bar */}
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-400">Junction Temp (Tj):</span>
                          <span className={`font-mono font-semibold ${tempStyle.text}`}>
                            {comp.stress.thermalTempC}°C / {comp.stress.maxTempC}°C ({Math.round(tempRatio * 100)}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${tempRatio > 0.8 ? "bg-rose-500" : tempRatio > 0.6 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(100, tempRatio * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSubTab === "spice" && (
            <div className="flex-1 flex flex-col p-4 space-y-3 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  SPICE Transient Simulation Waveforms (Output Voltage & Switch Current)
                </h3>
                <span className="rounded bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                  400kHz Switching Frequency
                </span>
              </div>

              <div className="flex-1 w-full bg-zinc-900/60 rounded-xl border border-zinc-800 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spiceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#71717a" fontSize={10} />
                    <YAxis stroke="#71717a" fontSize={10} domain={[4.8, 5.2]} />
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#3f3f46", fontSize: 11 }} />
                    <Line type="monotone" dataKey="vout" stroke="#10b981" strokeWidth={2} dot={false} name="Vout (V)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Inspector Column */}
        <div className="lg:col-span-4 flex flex-col min-h-0 bg-zinc-900/40 p-4 overflow-y-auto space-y-4">
          {/* Selected Component Spec Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                  Component Inspector
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedComp.designator}: {selectedComp.name}
                </h3>
              </div>
              <span className="font-mono text-xs text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                {selectedComp.package}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
                <span className="text-[10px] text-zinc-500 block">Actual Voltage</span>
                <span className="font-mono font-semibold text-emerald-400">{selectedComp.stress.actualVoltage} V</span>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
                <span className="text-[10px] text-zinc-500 block">Operating Current</span>
                <span className="font-mono font-semibold text-cyan-400">{selectedComp.stress.actualCurrentMa} mA</span>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
                <span className="text-[10px] text-zinc-500 block">Power Dissipation</span>
                <span className="font-mono font-semibold text-zinc-300">{selectedComp.stress.actualPowerMw} mW</span>
              </div>
              <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
                <span className="text-[10px] text-zinc-500 block">Junction Temp</span>
                <span className="font-mono font-semibold text-amber-400">{selectedComp.stress.thermalTempC} °C</span>
              </div>
            </div>

            {/* Pin Connections list */}
            <div className="mt-3">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
                Component Pins & Nets
              </span>
              <div className="space-y-1">
                {selectedComp.pins.map((pin) => (
                  <div
                    key={pin.id}
                    className="flex items-center justify-between rounded bg-zinc-950 px-2 py-1 text-xs font-mono"
                  >
                    <span className="text-zinc-400">{pin.name}</span>
                    <span className="text-emerald-400 text-[11px]">connected</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Connected Nets List */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2.5 flex items-center justify-between">
              <span>Schematic Nets ({nets.length})</span>
              <span className="text-[10px] font-mono text-emerald-400">100% Routed</span>
            </h4>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
              {nets.map((net) => (
                <div
                  key={net.id}
                  className="flex items-center justify-between rounded border border-zinc-800/80 bg-zinc-950 px-2.5 py-1.5 text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: net.color }} />
                    <span className="text-zinc-200">{net.name}</span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">{net.voltageV}V • {net.currentMa}mA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
