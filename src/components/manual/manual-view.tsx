"use client";

import { useState } from "react";
import {
  BookOpen,
  FileText,
  Search,
  CheckCircle2,
  Compass,
  Cpu,
  Layers,
  Zap,
  Flame,
  ShieldCheck,
  Store,
  Box,
  Sliders,
  Sparkles,
  Award,
  ChevronRight,
  ExternalLink,
  Code2,
} from "lucide-react";
import { NoMark } from "@/components/no-logo";

type ManualSection =
  | "quickstart"
  | "unlimited"
  | "cad_canvas"
  | "physics_proofs"
  | "autofix"
  | "astra6_visualizer"
  | "whatif_durability"
  | "procurement";

type ReferenceBook =
  | "ipc_standards"
  | "signal_integrity"
  | "thermodynamics"
  | "materials_science"
  | "smps_magnetics";

export function ManualView() {
  const [activeTab, setActiveTab] = useState<"manual" | "references">("manual");
  const [activeManualSection, setActiveManualSection] = useState<ManualSection>("quickstart");
  const [activeReferenceBook, setActiveReferenceBook] = useState<ReferenceBook>("ipc_standards");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-8 text-zinc-100">
      {/* Header Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <NoMark className="w-80 h-80" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 shadow-md">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-display">
                  NO Hardware Engineering Manual & Books of References
                </h1>
                <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-mono text-zinc-300 border border-zinc-700">
                  v2.0 Reference Edition
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
                The comprehensive operator's handbook for NO and an authoritative engineering compendium
                grounded in IPC standards, electromagnetic wave theory, thermodynamics, and materials science.
              </p>
            </div>
          </div>

          {/* Tab Switcher: Manual vs Books of References */}
          <div className="flex items-center gap-1.5 bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab("manual")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "manual"
                  ? "bg-zinc-100 text-zinc-950 shadow font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Operator's Manual
            </button>
            <button
              onClick={() => setActiveTab("references")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "references"
                  ? "bg-zinc-100 text-zinc-950 shadow font-semibold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Books of References
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "manual" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Index Nav */}
          <div className="space-y-1 bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 h-fit">
            <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Manual Table of Contents
            </div>
            {[
              { id: "quickstart", label: "1. Quickstart: 60-Sec Hardware", icon: Sparkles },
              { id: "unlimited", label: "2. Unlimited Architecture Generator", icon: Layers },
              { id: "cad_canvas", label: "3. Interactive CAD & Probing", icon: Cpu },
              { id: "physics_proofs", label: "4. Physics Proofs ('Proven by What')", icon: Zap },
              { id: "autofix", label: "5. 1-Click AI Flaw Auto-Fix", icon: ShieldCheck },
              { id: "astra6_visualizer", label: "6. Astra-6 3D Pre-Fab Visualizer", icon: Box },
              { id: "whatif_durability", label: "7. Ultimate What-If Durability", icon: Flame },
              { id: "procurement", label: "8. Global Component Procurement", icon: Store },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeManualSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveManualSection(item.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-left transition-all ${
                    isActive
                      ? "bg-zinc-800 text-white font-medium shadow border border-zinc-700"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Content Section */}
          <div className="lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 space-y-6 text-sm text-zinc-300 leading-relaxed shadow-xl">
            {activeManualSection === "quickstart" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Sparkles className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    1. Quickstart: Concept to Verified Hardware in 60 Seconds
                  </h2>
                </div>
                <p>
                  NO eliminates the slow, error-prone cycle of manual schematic capture and guesswork routing.
                  In NO, you express your design intent in natural language, and the multi-model AI synthesis engine
                  produces a complete, physically validated printed circuit board layout.
                </p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="text-xs font-mono text-zinc-400 font-bold uppercase">The 5-Step NO Pipeline</div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300">
                    <li><strong className="text-white">Synthesize:</strong> Type your target requirements (e.g., "STM32H7 quadcopter flight controller with dual IMUs, CAN transceiver, and 5V 3A buck regulator").</li>
                    <li><strong className="text-white">Inspect 2D/3D:</strong> Switch between the interactive 2D Vector CAD canvas and the Astra-6 3D Pre-Fabrication Visualizer.</li>
                    <li><strong className="text-white">Verify Physics:</strong> Review deterministic equations for trace ampacity (IPC-2152), decoupling inductance, and impedance matching.</li>
                    <li><strong className="text-white">Auto-Fix:</strong> Click <em>AI Auto-Fix</em> to automatically resolve all layout bottlenecks and DRC warnings.</li>
                    <li><strong className="text-white">Procure:</strong> Export KiCad 8 project files, RS-274X Gerbers, or click <em>Shop Materials</em> for instant checkout.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeManualSection === "unlimited" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Layers className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    2. Unlimited Architecture & Stackup Generator
                  </h2>
                </div>
                <p>
                  NO is completely unconstrained by arbitrary layer or material caps. You can engineer:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="font-semibold text-xs text-white">Stackups: 2 to 32 Layers</div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      From cost-effective 2-layer IoT beacons to 16-layer controlled-impedance HDI computing boards.
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="font-semibold text-xs text-white">Substrate Diversity</div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      FR-4, High-Tg Isola 370HR (Tg 180°C), Rogers RO4350B (high-speed RF), Aluminum IMS (Power), and Polyimide Kapton Flex.
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="font-semibold text-xs text-white">Heavy Copper Weights</div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Support for 0.5 oz (thin signals), 1.0 oz (standard), up to 4.0 oz / 6.0 oz heavy copper for high-current motor drivers.
                    </p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="font-semibold text-xs text-white">Custom Enclosures & Form Factors</div>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Arbitrary rectangular, circular, or mechanical contoured outlines with CNC aluminum or polycarbonate chassis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeManualSection === "cad_canvas" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Cpu className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    3. Interactive 2D Vector CAD & Probing Engine
                  </h2>
                </div>
                <p>
                  The NO 2D CAD viewer renders SVG-accelerated trace vectors, component land patterns, pad geometry,
                  and plated through-holes at sub-micron precision:
                </p>
                <ul className="list-disc list-inside space-y-2 text-xs text-zinc-300">
                  <li><strong>Layer Toggles:</strong> Show/hide Front Copper (`F.Cu`), Back Copper (`B.Cu`), Silkscreen, Vias, and Ratsnest.</li>
                  <li><strong>Pan & Zoom:</strong> Use mouse wheel to zoom from 4x to 45x magnification. Drag to pan smoothly.</li>
                  <li><strong>Cross-Probing:</strong> Click any component (e.g. `U1`, `C1`, `R1`) to highlight all connected nets and pins.</li>
                  <li><strong>DRC Heatmap Spots:</strong> Glowing amber and red target markers pinpoint exact rule violations.</li>
                </ul>
              </div>
            )}

            {activeManualSection === "physics_proofs" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Zap className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    4. Physics Proofs: "Proven by What"
                  </h2>
                </div>
                <p>
                  NO never produces black-box answers. Every single rule, trace width, and component placement
                  is backed by mathematical physics equations and international engineering standards:
                </p>
                <div className="space-y-3">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs">
                    <div className="text-emerald-400 font-bold">1. Conductor Ampacity & Thermal Rise (IPC-2152)</div>
                    <div className="text-zinc-400 mt-1">I = 0.048 · ΔT^0.44 · A^0.725</div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-sans">
                      Proves that a 1.2mm trace of 1oz copper carries up to 3.2A with safe temperature rise ΔT &lt; 15°C.
                    </div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs">
                    <div className="text-emerald-400 font-bold">2. High-Frequency Decoupling Loop Inductance</div>
                    <div className="text-zinc-400 mt-1">L_loop = μ0 · (h / w) · 2 · l</div>
                    <div className="text-[11px] text-zinc-400 mt-1 font-sans">
                      Proves that placing 100nF capacitors within 1.8mm of MCU VDD pins keeps parasitic loop inductance under 1.2nH.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeManualSection === "autofix" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <ShieldCheck className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    5. 1-Click AI Flaw Auto-Fix Engine
                  </h2>
                </div>
                <p>
                  When NO detects flaws (e.g. bottlenecked power traces, missing ground vias, or mismatched differential pairs),
                  the <strong>AI Auto-Fix</strong> button applies real mathematical corrections directly to the board:
                </p>
                <ul className="list-disc list-inside space-y-2 text-xs text-zinc-300">
                  <li>Power traces on `+5V_USB` and `+3V3` are widened to 1.0mm - 1.5mm to eliminate voltage drop.</li>
                  <li>Thermal stitching vias are placed adjacent to power inductors and regulator tabs.</li>
                  <li>High-speed USB D+ / D- differential lines are length-matched to within 0.15mm skew tolerance.</li>
                </ul>
              </div>
            )}

            {activeManualSection === "astra6_visualizer" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Box className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    6. Astra-6 3D Pre-Fabrication Visualizer
                  </h2>
                </div>
                <p>
                  Inspect the physical reality of your board before spending any manufacturing capital:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <strong className="text-white">Solder Mask Finishes</strong>
                    <p className="text-zinc-400 mt-1">Preview Matte Grey, Stealth Black, Forest Green, Deep Blue, Arctic White, and Amber Raw.</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <strong className="text-white">Surface Plating</strong>
                    <p className="text-zinc-400 mt-1">Simulate ENIG Gold, Lead-Free HASL, Immersion Silver, and bare OSP copper sheen.</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <strong className="text-white">Layer Stackup Exploder</strong>
                    <p className="text-zinc-400 mt-1">Slide the exploded stack slider to see individual copper layers and dielectric cores suspended in 3D.</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <strong className="text-white">Enclosure Integration</strong>
                    <p className="text-zinc-400 mt-1">Fit test with CNC 6061 Billet Aluminum or optical Polycarbonate covers.</p>
                  </div>
                </div>
              </div>
            )}

            {activeManualSection === "whatif_durability" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Flame className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    7. Ultimate What-If Durability Simulation Lab
                  </h2>
                </div>
                <p>
                  Test how your hardware survives extreme environments before purchasing materials:
                </p>
                <ul className="list-disc list-inside space-y-2 text-xs text-zinc-300">
                  <li><strong>Thermal Shock:</strong> -40°C Arctic to +150°C Engine compartment testing using Coffin-Manson low-cycle fatigue models.</li>
                  <li><strong>Vibration & Drop:</strong> 20G to 100G acceleration under MIL-STD-810H Method 514.8.</li>
                  <li><strong>Marine Humidity:</strong> 85°C / 85% RH corrosion index and dendritic copper migration prevention.</li>
                  <li><strong>AI Material Recommender:</strong> Suggests the exact substrate and enclosure to withstand your operating profile.</li>
                </ul>
              </div>
            )}

            {activeManualSection === "procurement" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Store className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    8. Global Component Procurement Marketplace
                  </h2>
                </div>
                <p>
                  Once you have finalized your design and architecture in NO, purchase every element in 1 click:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="font-bold text-white">PCB Fabricators</div>
                    <p className="text-zinc-400 mt-1">JLCPCB, PCBWay, OSH Park, Eurocircuits.</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="font-bold text-white">Distributors</div>
                    <p className="text-zinc-400 mt-1">LCSC, DigiKey, Mouser, Newark with real part numbers.</p>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <div className="font-bold text-white">Hardware & CNC</div>
                    <p className="text-zinc-400 mt-1">SendCutSend, Xometry, McMaster-Carr for billet cases.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Books of References View */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Books Navigation */}
          <div className="space-y-1 bg-zinc-900/80 rounded-xl p-3 border border-zinc-800 h-fit">
            <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Books of References
            </div>
            {[
              { id: "ipc_standards", label: "Book 1: IPC Standards Compendium", icon: Award },
              { id: "signal_integrity", label: "Book 2: High-Speed Signal Integrity", icon: Zap },
              { id: "thermodynamics", label: "Book 3: Thermodynamics & Heat", icon: Flame },
              { id: "materials_science", label: "Book 4: Materials Science Encyclopedia", icon: Layers },
              { id: "smps_magnetics", label: "Book 5: SMPS Magnetics & EMI", icon: Cpu },
            ].map((book) => {
              const Icon = book.icon;
              const isActive = activeReferenceBook === book.id;
              return (
                <button
                  key={book.id}
                  onClick={() => setActiveReferenceBook(book.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-left transition-all ${
                    isActive
                      ? "bg-zinc-800 text-white font-medium shadow border border-zinc-700"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-zinc-400" />
                  <span className="truncate">{book.label}</span>
                </button>
              );
            })}
          </div>

          {/* Book Content */}
          <div className="lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 space-y-6 text-sm text-zinc-300 leading-relaxed shadow-xl">
            {activeReferenceBook === "ipc_standards" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Award className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    Book 1: IPC International PCB Design Standards
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                    <h3 className="font-bold text-white font-mono text-sm">IPC-2152: Conductor Current-Carrying Capacity</h3>
                    <p className="text-zinc-400">
                      Replaced legacy IPC-D-275 with empirical charts for internal vs external copper traces:
                    </p>
                    <div className="bg-zinc-900 p-2.5 rounded font-mono text-zinc-200">
                      I = 0.048 · (ΔT)^0.44 · A^0.725 (External Layers)<br />
                      I = 0.024 · (ΔT)^0.44 · A^0.725 (Internal Buried Layers)
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Where <code className="text-zinc-200">I</code> is current in Amperes, <code className="text-zinc-200">ΔT</code> is permissible temperature rise in °C, and <code className="text-zinc-200">A</code> is cross-sectional area in mil².
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                    <h3 className="font-bold text-white font-mono text-sm">IPC-2221B: High-Voltage Creepage & Clearance</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono text-[11px]">
                        <thead className="border-b border-zinc-800 text-zinc-400">
                          <tr>
                            <th className="pb-1">Voltage (DC/Peak)</th>
                            <th className="pb-1">Bare Board Clearance</th>
                            <th className="pb-1">Coated Solder Mask</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 text-zinc-300">
                          <tr><td className="py-1">0 - 15V</td><td className="py-1">0.10 mm (4 mil)</td><td className="py-1">0.05 mm (2 mil)</td></tr>
                          <tr><td className="py-1">16 - 30V</td><td className="py-1">0.10 mm (4 mil)</td><td className="py-1">0.05 mm (2 mil)</td></tr>
                          <tr><td className="py-1">31 - 50V</td><td className="py-1">0.60 mm (24 mil)</td><td className="py-1">0.13 mm (5 mil)</td></tr>
                          <tr><td className="py-1">51 - 100V</td><td className="py-1">0.60 mm (24 mil)</td><td className="py-1">0.13 mm (5 mil)</td></tr>
                          <tr><td className="py-1">101 - 300V</td><td className="py-1">1.50 mm (60 mil)</td><td className="py-1">0.40 mm (16 mil)</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeReferenceBook === "signal_integrity" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Zap className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    Book 2: High-Speed Digital Signal Integrity (Bogatin & Johnson)
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                    <h3 className="font-bold text-white font-mono text-sm">Microstrip Characteristic Impedance (Z0)</h3>
                    <div className="bg-zinc-900 p-2.5 rounded font-mono text-zinc-200">
                      Z0 ≈ (87 / √(εr + 1.41)) · ln( 5.98 · h / (0.8 · w + t) )
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Where <code className="text-zinc-200">h</code> is dielectric thickness, <code className="text-zinc-200">w</code> is trace width, <code className="text-zinc-200">t</code> is copper thickness, and <code className="text-zinc-200">εr</code> is relative permittivity.
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                    <h3 className="font-bold text-white font-mono text-sm">High-Frequency Skin Depth (δ)</h3>
                    <div className="bg-zinc-900 p-2.5 rounded font-mono text-zinc-200">
                      δ = √( ρ / (π · f · μ) )
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      At 1 GHz on copper (ρ = 1.68 × 10^-8 Ω·m), skin depth is just 2.09 µm. Current travels only on the outer perimeter of the conductor.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeReferenceBook === "thermodynamics" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Flame className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    Book 3: Thermodynamics & Heat Dissipation Networks
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                    <h3 className="font-bold text-white font-mono text-sm">Thermal Resistance Series Network</h3>
                    <div className="bg-zinc-900 p-2.5 rounded font-mono text-zinc-200">
                      T_junction = T_ambient + P_dissipated · ( θ_jc + θ_cs + θ_sa )
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Where <code className="text-zinc-200">θ_jc</code> is junction-to-case, <code className="text-zinc-200">θ_cs</code> is case-to-heatsink, and <code className="text-zinc-200">θ_sa</code> is heatsink-to-ambient.
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                    <h3 className="font-bold text-white font-mono text-sm">Thermal Via Array Resistance</h3>
                    <div className="bg-zinc-900 p-2.5 rounded font-mono text-zinc-200">
                      R_via = h / ( k_copper · π · (r_outer² - r_inner²) )
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      A 3x3 array of 0.3mm drill vias with 25µm copper plating reduces thermal resistance through a 1.6mm board to under 12 °C/W.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeReferenceBook === "materials_science" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Layers className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    Book 4: Substrate & Materials Science Encyclopedia
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-zinc-800 rounded-lg overflow-hidden">
                    <thead className="bg-zinc-950 text-zinc-300 border-b border-zinc-800">
                      <tr>
                        <th className="p-2.5">Substrate</th>
                        <th className="p-2.5">Dk (εr)</th>
                        <th className="p-2.5">Loss (tan δ)</th>
                        <th className="p-2.5">Glass Tg</th>
                        <th className="p-2.5">Thermal Cond.</th>
                        <th className="p-2.5">Best Application</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/50 text-[11px]">
                      <tr>
                        <td className="p-2.5 font-bold text-white">Standard FR-4</td>
                        <td className="p-2.5">4.4 - 4.6</td>
                        <td className="p-2.5">0.020</td>
                        <td className="p-2.5">130°C</td>
                        <td className="p-2.5">0.3 W/m-K</td>
                        <td className="p-2.5 text-zinc-400">Low-cost IoT, Consumer</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">High-Tg Isola 370HR</td>
                        <td className="p-2.5">4.04</td>
                        <td className="p-2.5">0.021</td>
                        <td className="p-2.5">180°C</td>
                        <td className="p-2.5">0.4 W/m-K</td>
                        <td className="p-2.5 text-zinc-400">Automotive, High-Reliability</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Rogers RO4350B</td>
                        <td className="p-2.5">3.48</td>
                        <td className="p-2.5">0.0037</td>
                        <td className="p-2.5">&gt; 280°C</td>
                        <td className="p-2.5">0.69 W/m-K</td>
                        <td className="p-2.5 text-zinc-400">RF 2.4-24GHz, Radars</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Aluminum IMS</td>
                        <td className="p-2.5">-</td>
                        <td className="p-2.5">-</td>
                        <td className="p-2.5">150°C</td>
                        <td className="p-2.5">2.5 W/m-K</td>
                        <td className="p-2.5 text-zinc-400">LED arrays, Motor BLDC Drives</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white">Kapton Polyimide</td>
                        <td className="p-2.5">3.4</td>
                        <td className="p-2.5">0.002</td>
                        <td className="p-2.5">&gt; 300°C</td>
                        <td className="p-2.5">0.2 W/m-K</td>
                        <td className="p-2.5 text-zinc-400">Flex PCBs, Wearables, Space</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeReferenceBook === "smps_magnetics" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
                  <Cpu className="h-5 w-5 text-zinc-300" />
                  <h2 className="text-lg font-bold text-white">
                    Book 5: Switch-Mode Power Supply (SMPS) Magnetics & EMI
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                    <h3 className="font-bold text-white font-mono text-sm">Inductor Saturation & Flux Density</h3>
                    <div className="bg-zinc-900 p-2.5 rounded font-mono text-zinc-200">
                      B_max = ( V_in · D ) / ( N · A_e · f_sw ) &lt; B_sat
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Ensure peak magnetic flux density <code className="text-zinc-200">B_max</code> stays at least 25% below core saturation threshold <code className="text-zinc-200">B_sat</code> (typically 0.35T to 0.45T for ferrite).
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                    <h3 className="font-bold text-white font-mono text-sm">High di/dt Hot-Loop Minimization Rule</h3>
                    <p className="text-zinc-400 text-[11px]">
                      In a buck regulator, the loop formed by the input capacitor <code className="text-zinc-200">C_in</code>, the high-side MOSFET, and the ground return experiences sharp current transitions <code className="text-zinc-200">di/dt &gt; 10^8 A/s</code>. Radiated EMI is directly proportional to loop area <code className="text-zinc-200">A_loop</code>.
                      Place <code className="text-zinc-200">C_in</code> within 1.5mm of the IC VIN and PGND pins.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
