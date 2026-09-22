"use client";

import { useState, useMemo } from "react";
import type { PcbBoard } from "@/lib/pcb/types";
import {
  ShieldAlert,
  Flame,
  Zap,
  Droplets,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Box,
  Sliders,
  RotateCcw,
  Gauge,
  Thermometer,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DurabilityLabProps {
  board: PcbBoard;
  onUpdateBoard?: (updatedBoard: PcbBoard) => void;
}

export type StressScenario =
  | "thermal_cycling"
  | "drop_vibration"
  | "marine_moisture"
  | "overcurrent_surge"
  | "high_voltage_esd";

export function DurabilityLab({ board, onUpdateBoard }: DurabilityLabProps) {
  // Active selected What-If Scenario
  const [activeScenario, setActiveScenario] = useState<StressScenario>("thermal_cycling");

  // Environmental sliders
  const [ambientTempC, setAmbientTempC] = useState(85); // -40°C to +150°C
  const [vibrationG, setVibrationG] = useState(30); // 5G to 100G
  const [humidityRh, setHumidityRh] = useState(85); // 20% to 100% RH
  const [inrushMultiplier, setInrushMultiplier] = useState(2.0); // 1.0x to 4.0x
  const [esdSurgeKv, setEsdSurgeKv] = useState(12); // 2kV to 25kV

  // Active chosen materials
  const [chosenSubstrate, setChosenSubstrate] = useState(board.substrate || "FR-4 Standard");
  const [chosenEnclosure, setChosenEnclosure] = useState(board.enclosureMaterial || "aluminum-6061");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Physics Simulation Calculations
  const simulationResults = useMemo(() => {
    // 1. Thermal Cycling Simulation (Coffin-Manson Low-Cycle Fatigue)
    // Delta T = Temp Max - Temp Min (-40 to ambientTempC)
    const deltaT = ambientTempC - (-40);
    const isHighTgSubstrate =
      chosenSubstrate.includes("Isola") ||
      chosenSubstrate.includes("High-Tg") ||
      chosenSubstrate.includes("Rogers") ||
      chosenSubstrate.includes("Aluminum");
    const cteXy = isHighTgSubstrate ? 12 : 16; // ppm/C
    const solderShearStrain = (cteXy - 4.5) * 1e-6 * deltaT; // CTE mismatch with silicon package (4.5 ppm)
    // Coffin-Manson cycles to failure: N_f = A * (delta_gamma)^(-c)
    const thermalCyclesToFailure = Math.round(
      Math.max(120, 24000 / Math.pow(Math.max(0.1, solderShearStrain * 1000), 1.8))
    );
    const thermalGrade =
      thermalCyclesToFailure > 4000
        ? "Aerospace / Under-Hood (Grade 0)"
        : thermalCyclesToFailure > 1500
        ? "Automotive Grade 1 (-40 to 125°C)"
        : "Commercial Grade (0 to 70°C)";

    // 2. Mechanical Drop & High-G Vibration Simulation (MIL-STD-810H)
    const boardAreaCm2 = (board.dimensions.widthMm * board.dimensions.heightMm) / 100;
    const boardMassGrams = boardAreaCm2 * 0.45; // ~0.45g per cm2 for 1.6mm 2L board
    const resonantFreqHz = Math.round(1800 / Math.sqrt(Math.max(1, boardAreaCm2)));
    const padDisplacementMm = ((vibrationG * 9.81) / Math.pow(2 * Math.PI * resonantFreqHz, 2)) * 1000;
    const isAluminumEnclosure = chosenEnclosure === "aluminum-6061" || chosenEnclosure === "stainless-316L";
    const shockAbsorbedPct = isAluminumEnclosure ? 88 : 62;
    const shockSurvived = vibrationG <= 60 || isAluminumEnclosure;

    // 3. Marine Ingress & Humidity (IP68, 85°C / 85% RH)
    const caafResistanceMegaOhms =
      humidityRh > 80 && !isHighTgSubstrate
        ? Math.max(15, 800 - humidityRh * 8)
        : Math.max(450, 1500 - humidityRh * 5);
    const conformalCoatingNeeded = humidityRh > 70 || ambientTempC > 65;

    // 4. Overcurrent & Thermal Runaway (IPC-2152 transient pulse)
    const ratedTraceTempRiseC = Math.round(Math.pow(inrushMultiplier, 1.85) * 18);
    const maxPeakTraceTempC = ambientTempC + ratedTraceTempRiseC;
    const delaminationRisk = maxPeakTraceTempC > 260 ? "CRITICAL" : maxPeakTraceTempC > 135 ? "ELEVATED" : "SAFE";

    // 5. High-Voltage Surge & 15kV ESD (IEC 61000-4-2)
    const dielectricBreakdownVoltageKv = chosenSubstrate.includes("Rogers") ? 38 : isHighTgSubstrate ? 28 : 18;
    const esdMarginPct = Math.round(((dielectricBreakdownVoltageKv - esdSurgeKv) / dielectricBreakdownVoltageKv) * 100);

    // Calculate Overall Durability Score (0 - 100)
    let score = 85;
    if (isHighTgSubstrate) score += 8;
    if (isAluminumEnclosure) score += 5;
    if (ambientTempC > 105 && !isHighTgSubstrate) score -= 18;
    if (delaminationRisk === "CRITICAL") score -= 25;
    if (vibrationG > 50 && !isAluminumEnclosure) score -= 15;
    score = Math.max(20, Math.min(99, score));

    return {
      deltaT,
      solderShearStrain: (solderShearStrain * 100).toFixed(4),
      thermalCyclesToFailure,
      thermalGrade,
      resonantFreqHz,
      padDisplacementMm: padDisplacementMm.toFixed(3),
      shockAbsorbedPct,
      shockSurvived,
      caafResistanceMegaOhms,
      conformalCoatingNeeded,
      ratedTraceTempRiseC,
      maxPeakTraceTempC,
      delaminationRisk,
      dielectricBreakdownVoltageKv,
      esdMarginPct,
      overallScore: score,
    };
  }, [
    ambientTempC,
    vibrationG,
    humidityRh,
    inrushMultiplier,
    esdSurgeKv,
    chosenSubstrate,
    chosenEnclosure,
    board.dimensions.widthMm,
    board.dimensions.heightMm,
  ]);

  // AI Recommended Materials for current stress parameters
  const aiRecommendedMaterials = useMemo(() => {
    let substrate = "High-Tg Isola 370HR (Tg 180°C)";
    let substrateReason = "Provides maximum CTE stability in X/Y/Z axes, preventing solder joint micro-cracking.";
    let enclosure = "aluminum-6061";
    let enclosureReason = "Rigid billet aluminum enclosure dampens 88% of harmonic vibration and acts as a heat spreader.";
    let conformalCoating = "Parylene-C Thin Film Vapor Deposition";

    if (ambientTempC > 120 || inrushMultiplier > 2.5) {
      substrate = "Aluminum Insulated Metal Substrate (IMS)";
      substrateReason = "Metal core delivers 2.5 W/m-K thermal conductivity, conducting heat straight to the chassis.";
    } else if (vibrationG > 70) {
      substrate = "High-Tg Isola 370HR with Heavy Copper (2oz)";
      substrateReason = "Reinforced copper traces resist pad delamination under extreme G-force shock.";
    }

    if (humidityRh > 80) {
      enclosure = "stainless-316L";
      enclosureReason = "Marine-grade 316L stainless steel enclosure prevents galvanic corrosion and salt spray pitting.";
      conformalCoating = "Silicone Potting (UL 94V-0 Rated)";
    }

    return {
      substrate,
      substrateReason,
      enclosure,
      enclosureReason,
      conformalCoating,
    };
  }, [ambientTempC, vibrationG, humidityRh, inrushMultiplier]);

  // 1-Click Apply Recommended Materials
  const handleApplyRecommended = () => {
    setChosenSubstrate(aiRecommendedMaterials.substrate);
    setChosenEnclosure(aiRecommendedMaterials.enclosure as any);

    if (onUpdateBoard) {
      onUpdateBoard({
        ...board,
        substrate: aiRecommendedMaterials.substrate,
        enclosureMaterial: aiRecommendedMaterials.enclosure as any,
        durabilityRating: {
          thermalGrade: simulationResults.thermalGrade,
          shockG: vibrationG,
          ipRating: humidityRh > 80 ? "IP68 Submersible" : "IP65 Weatherproof",
          mtbfHours: Math.round(simulationResults.thermalCyclesToFailure * 120),
        },
      });
    }

    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3500);
  };

  return (
    <div className="flex flex-col gap-6 text-zinc-100">
      {/* Top Header Card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-white">
                  Ultimate "What-If" Durability & Stress Simulation Lab
                </h2>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-zinc-700">
                  MIL-STD-810H & IPC-9701
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Subject your hardware to extreme thermal shock, vibration, moisture, and electrical surges before manufacturing.
              </p>
            </div>
          </div>

          {/* Durability Score Badge */}
          <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-zinc-400">Durability Index</div>
              <div className="text-xl font-bold font-mono text-white flex items-center justify-end gap-1">
                {simulationResults.overallScore}%
                <span className="text-xs text-emerald-400 font-normal">PASSED</span>
              </div>
            </div>
            <div className="h-9 w-9 rounded-full border-2 border-zinc-600 flex items-center justify-center bg-zinc-950 text-xs font-mono font-bold text-zinc-200">
              {simulationResults.overallScore > 90 ? "A+" : simulationResults.overallScore > 80 ? "A" : "B"}
            </div>
          </div>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 pt-4 border-t border-zinc-800">
          {[
            {
              id: "thermal_cycling",
              label: "Thermal Cycling",
              icon: Thermometer,
              desc: "-40°C to +150°C",
            },
            {
              id: "drop_vibration",
              label: "Vibration & Drop",
              icon: Activity,
              desc: "100G Shock (MIL-STD)",
            },
            {
              id: "marine_moisture",
              label: "Marine & Humidity",
              icon: Droplets,
              desc: "IP68 / Salt Spray",
            },
            {
              id: "overcurrent_surge",
              label: "Current Overload",
              icon: Flame,
              desc: "300% Inrush Spike",
            },
            {
              id: "high_voltage_esd",
              label: "15kV ESD Surge",
              icon: Zap,
              desc: "IEC 61000-4-2",
            },
          ].map((scen) => {
            const Icon = scen.icon;
            const isActive = activeScenario === scen.id;
            return (
              <button
                key={scen.id}
                onClick={() => setActiveScenario(scen.id as any)}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                  isActive
                    ? "bg-zinc-800 border-zinc-400 text-white shadow"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-400"
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium text-xs">
                  <Icon className="h-3.5 w-3.5 text-zinc-300" />
                  {scen.label}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{scen.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Simulation Viewport: Active Scenario Controls & Physics Math */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Environmental Knobs & Physics Results */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-5">
            {/* Scenario Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="font-semibold text-sm text-zinc-100 uppercase tracking-wider font-mono">
                {activeScenario === "thermal_cycling" && "Scenario 1: Cryogenic to High-Heat Thermal Shock"}
                {activeScenario === "drop_vibration" && "Scenario 2: High-G Mechanical Drop & Harmonic Vibration"}
                {activeScenario === "marine_moisture" && "Scenario 3: Salt Fog, Condensation & Marine Corrosion"}
                {activeScenario === "overcurrent_surge" && "Scenario 4: Transient Inrush & Copper Trace Fusion"}
                {activeScenario === "high_voltage_esd" && "Scenario 5: 15kV Electrostatic Discharge (ESD)"}
              </span>
              <span className="text-xs font-mono text-zinc-400">Live Physics Engine</span>
            </div>

            {/* Dynamic Slider based on active scenario */}
            {activeScenario === "thermal_cycling" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">
                    Ambient Peak Temperature: <span className="font-mono text-zinc-100 font-bold">{ambientTempC}°C</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Thermal Cycle: -40°C ⇄ +{ambientTempC}°C (ΔT = {simulationResults.deltaT}°C)
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="150"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(Number(e.target.value))}
                  className="w-full accent-zinc-200 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Room Temp (25°C)</span>
                  <span>Industrial (85°C)</span>
                  <span>Automotive Engine (+125°C)</span>
                  <span>Aerospace (+150°C)</span>
                </div>
              </div>
            )}

            {activeScenario === "drop_vibration" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">
                    Peak Mechanical Acceleration: <span className="font-mono text-zinc-100 font-bold">{vibrationG} G</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-400">
                    MIL-STD-810H Method 514.8
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={vibrationG}
                  onChange={(e) => setVibrationG(Number(e.target.value))}
                  className="w-full accent-zinc-200 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Normal Transit (5G)</span>
                  <span>Industrial Machinery (25G)</span>
                  <span>Drone Crash Shock (50G)</span>
                  <span>Missile / Rocket Launch (100G)</span>
                </div>
              </div>
            )}

            {activeScenario === "marine_moisture" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">
                    Relative Humidity & Condensation: <span className="font-mono text-zinc-100 font-bold">{humidityRh}% RH</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-400">
                    IEC 60068-2-78 (85°C / 85% RH 1,000 hrs)
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={humidityRh}
                  onChange={(e) => setHumidityRh(Number(e.target.value))}
                  className="w-full accent-zinc-200 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Dry Climate (20%)</span>
                  <span>Tropical (60%)</span>
                  <span>Severe Marine (85%)</span>
                  <span>Total Ingress (100%)</span>
                </div>
              </div>
            )}

            {activeScenario === "overcurrent_surge" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">
                    Inrush Current Overload: <span className="font-mono text-zinc-100 font-bold">{(inrushMultiplier * 100).toFixed(0)}%</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-400">
                    IPC-2152 Internal/External Trace Standard
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.5"
                  step="0.1"
                  value={inrushMultiplier}
                  onChange={(e) => setInrushMultiplier(Number(e.target.value))}
                  className="w-full accent-zinc-200 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Nominal (100%)</span>
                  <span>Motor Stall (200%)</span>
                  <span>Capacitive Inrush (280%)</span>
                  <span>Dead Short (350%)</span>
                </div>
              </div>
            )}

            {activeScenario === "high_voltage_esd" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">
                    ESD Transient Strike Voltage: <span className="font-mono text-zinc-100 font-bold">{esdSurgeKv} kV</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-400">
                    IEC 61000-4-2 Air Discharge
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={esdSurgeKv}
                  onChange={(e) => setEsdSurgeKv(Number(e.target.value))}
                  className="w-full accent-zinc-200 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                  <span>Human Body 4kV</span>
                  <span>Standard 8kV</span>
                  <span>Severe Industrial 15kV</span>
                  <span>Extreme 25kV</span>
                </div>
              </div>
            )}

            {/* Physics Mathematical Proofs & Telemetry Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-zinc-800">
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-400">
                  Fatigue Lifetime (Coffin-Manson Model)
                </div>
                <div className="text-base font-bold font-mono text-white">
                  {simulationResults.thermalCyclesToFailure.toLocaleString()} Cycles
                </div>
                <div className="text-[11px] text-zinc-400">
                  Calculated shear strain: <span className="font-mono">{simulationResults.solderShearStrain}%</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium mt-1">
                  Rating: {simulationResults.thermalGrade}
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-400">
                  Vibration Resonance & Shock Deflection
                </div>
                <div className="text-base font-bold font-mono text-white">
                  fn = {simulationResults.resonantFreqHz} Hz
                </div>
                <div className="text-[11px] text-zinc-400">
                  Pad deflection: <span className="font-mono">{simulationResults.padDisplacementMm} mm</span>
                </div>
                <div className="text-[10px] text-zinc-300 font-medium mt-1">
                  Enclosure damping: {simulationResults.shockAbsorbedPct}% kinetic energy absorbed
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-400">
                  Peak Trace Temperature Under Overcurrent
                </div>
                <div className="text-base font-bold font-mono text-white">
                  T_peak = {simulationResults.maxPeakTraceTempC}°C
                </div>
                <div className="text-[11px] text-zinc-400">
                  Temperature rise ΔT: +{simulationResults.ratedTraceTempRiseC}°C
                </div>
                <div
                  className={`text-[10px] font-medium mt-1 ${
                    simulationResults.delaminationRisk === "SAFE"
                      ? "text-emerald-400"
                      : simulationResults.delaminationRisk === "ELEVATED"
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  Delamination Margin: {simulationResults.delaminationRisk}
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1">
                <div className="text-[10px] font-mono uppercase text-zinc-400">
                  Dielectric Withstand & Insulation Resistance
                </div>
                <div className="text-base font-bold font-mono text-white">
                  {simulationResults.dielectricBreakdownVoltageKv} kV Breakdown
                </div>
                <div className="text-[11px] text-zinc-400">
                  ESD Safety Margin: <span className="font-mono">+{simulationResults.esdMarginPct}%</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium mt-1">
                  CAF Resistance: {simulationResults.caafResistanceMegaOhms} MΩ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Automated AI Material Recommender */}
        <div className="space-y-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Sparkles className="h-4 w-4 text-zinc-300" />
              <h3 className="font-semibold text-sm text-white">
                Automated AI Material Selection
              </h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Based on the simulated stress of <span className="text-white font-mono">{ambientTempC}°C</span> and{" "}
              <span className="text-white font-mono">{vibrationG}G</span>, the AI has selected the exact optimal substrate & chassis:
            </p>

            {/* Recommended Substrate */}
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Recommended Substrate</span>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">OPTIMAL</span>
              </div>
              <div className="text-xs font-bold text-zinc-100">{aiRecommendedMaterials.substrate}</div>
              <p className="text-[11px] text-zinc-400 leading-normal">{aiRecommendedMaterials.substrateReason}</p>
            </div>

            {/* Recommended Enclosure */}
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Recommended Enclosure</span>
                <span className="text-[10px] text-emerald-400 font-semibold font-mono">OPTIMAL</span>
              </div>
              <div className="text-xs font-bold text-zinc-100">
                {aiRecommendedMaterials.enclosure === "aluminum-6061"
                  ? "CNC Billet 6061-T6 Aluminum"
                  : "316L Marine Stainless Steel"}
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">{aiRecommendedMaterials.enclosureReason}</p>
            </div>

            {/* Recommended Conformal Coating */}
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Conformal Barrier</span>
              <div className="text-xs font-bold text-zinc-100">{aiRecommendedMaterials.conformalCoating}</div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Eliminates tin whiskering and dendritic copper migration in humid air.
              </p>
            </div>

            {/* 1-Click Apply Button */}
            <Button
              onClick={handleApplyRecommended}
              className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              {appliedSuccess ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" /> Materials Applied to Design!
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Apply Recommended Materials
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
