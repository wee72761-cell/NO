export interface PcbPin {
  number: string;
  name: string;
  net: string;
  relX: number; // relative offset in mm from component center
  relY: number; // relative offset in mm from component center
}

export interface PcbComponent {
  id: string;
  ref: string; // e.g. "U1", "C1", "R1", "J1"
  name: string; // e.g. "ESP32-S3-WROOM-1", "100nF Ceramic", "USB-C 16P"
  category: "mcu" | "power" | "passive" | "connector" | "sensor" | "ic" | "diode" | "led";
  package: string; // e.g. "QFN-32", "0603", "0805", "SOT-23", "USB-C"
  x: number; // mm
  y: number; // mm
  rotation: 0 | 90 | 180 | 270;
  layer: "top" | "bottom";
  widthMm: number;
  heightMm: number;
  pins: PcbPin[];
  value?: string;
  description?: string;
  lcscPartNumber?: string;
  unitCostUsd: number;
}

export interface PcbNet {
  id: string;
  name: string; // e.g. "GND", "+3V3", "+5V_USB", "I2C_SDA"
  type: "power" | "ground" | "signal" | "differential" | "clock";
  voltage?: number; // Volts
  currentEstA: number; // Amperes
  targetImpedance?: number; // Ohms (e.g. 90 for USB, 50 for RF)
  color?: string;
  pins: string[]; // e.g. ["U1.1", "C1.1", "J1.VBUS"]
}

export interface PcbTrace {
  id: string;
  net: string;
  layer: "F.Cu" | "B.Cu";
  widthMm: number; // mm
  clearanceMm: number; // mm
  points: [number, number][]; // [[x1, y1], [x2, y2], ...]
}

export interface PcbVia {
  id: string;
  net: string;
  x: number;
  y: number;
  drillMm: number;
  padMm: number;
}

export interface PcbBoard {
  id: string;
  title: string;
  version: string;
  author: string;
  description: string;
  dimensions: {
    widthMm: number;
    heightMm: number;
    cornerRadiusMm: number;
  };
  layersCount: number; // Unlimited: 2, 4, 6, 8, 12, 16, 32
  copperThicknessOz: number; // 0.5oz, 1oz, 2oz, 3oz, 4oz+ heavy copper
  substrate: string; // "FR-4 Standard", "High-Tg Isola 370HR", "Rogers RO4350B", "Aluminum IMS", "Polyimide Kapton Flex"
  boardType?: "rigid" | "rigid-flex" | "ims-aluminum" | "high-speed-rf" | "wearable-flex";
  solderMaskColor?: "matte-grey" | "stealth-black" | "forest-green" | "deep-blue" | "arctic-white" | "amber-raw";
  surfaceFinish?: "ENIG" | "HASL_lead_free" | "Immersion_Ag" | "Hard_Gold" | "OSP";
  enclosureMaterial?: "aluminum-6061" | "carbon-fiber" | "polycarbonate" | "stainless-316L";
  components: PcbComponent[];
  nets: PcbNet[];
  traces: PcbTrace[];
  vias: PcbVia[];
  copperPours: {
    net: string;
    layer: "F.Cu" | "B.Cu";
    thermalRelief: boolean;
  }[];
  durabilityRating?: {
    thermalGrade: string;
    shockG: number;
    ipRating: string;
    mtbfHours: number;
  };
}

export type DrcSeverity = "critical" | "warning" | "optimization" | "passed";

export interface PcbPhysicsProof {
  id: string;
  title: string;
  subsystem: string;
  formula: string;
  variables: Record<string, string>;
  calculatedValue: string;
  thresholdOrStandard: string;
  provenBy: string;
  safetyMarginPct: number;
  status: "verified" | "flagged";
  rationale: string;
}

export interface PcbDrcItem {
  id: string;
  category:
    | "clearance"
    | "thermal"
    | "impedance"
    | "decoupling"
    | "current_capacity"
    | "erc_schematic"
    | "manufacturing";
  severity: DrcSeverity;
  rule: string;
  description: string;
  affectedElements: string[];
  location?: { x: number; y: number };
  proofAndFormula?: {
    formula: string;
    variables: Record<string, string>;
    calculatedValue: string;
    threshold: string;
    explanation: string;
  };
  flawExplanation: string;
  fixRecommendation: string;
  autoFixAvailable: boolean;
  fixed?: boolean;
}

export interface PcbVerificationReport {
  score: number; // 0 to 100
  passedCount: number;
  warningCount: number;
  criticalCount: number;
  items: PcbDrcItem[];
  physicsProofs: PcbPhysicsProof[];
  summary: string;
}
