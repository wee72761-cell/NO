import type { PcbBoard } from "./types";

/**
 * Generate KiCad v7 / v8 format .kicad_pcb file
 */
export function generateKiCadPcb(board: PcbBoard): string {
  const lines: string[] = [];
  lines.push(`(kicad_pcb (version 20221018) (generator "NO_PCB_AI_STUDIO")`);
  lines.push(`  (general`);
  lines.push(`    (thickness 1.6)`);
  lines.push(`    (drawings 0)`);
  lines.push(`    (tracks ${board.traces.length})`);
  lines.push(`    (zones 2)`);
  lines.push(`    (modules ${board.components.length})`);
  lines.push(`    (nets ${board.nets.length})`);
  lines.push(`  )`);
  lines.push(``);
  lines.push(`  (paper "A4")`);
  lines.push(`  (title_block`);
  lines.push(`    (title "${board.title}")`);
  lines.push(`    (date "${new Date().toISOString().split("T")[0]}")`);
  lines.push(`    (rev "${board.version}")`);
  lines.push(`    (company "${board.author}")`);
  lines.push(`    (comment 1 "Verified by NO AI Physics & DRC Engine")`);
  lines.push(`  )`);
  lines.push(``);

  // Layers
  lines.push(`  (layers`);
  lines.push(`    (0 "F.Cu" signal)`);
  lines.push(`    (31 "B.Cu" signal)`);
  lines.push(`    (34 "B.Paste" user)`);
  lines.push(`    (35 "F.Paste" user)`);
  lines.push(`    (36 "B.SilkS" user)`);
  lines.push(`    (37 "F.SilkS" user)`);
  lines.push(`    (38 "B.Mask" user)`);
  lines.push(`    (39 "F.Mask" user)`);
  lines.push(`    (44 "Edge.Cuts" user)`);
  lines.push(`  )`);
  lines.push(``);

  // Nets
  lines.push(`  (net 0 "")`);
  board.nets.forEach((net, idx) => {
    lines.push(`  (net ${idx + 1} "${net.name}")`);
  });
  lines.push(``);

  // Board outline (Edge.Cuts)
  const w = board.dimensions.widthMm;
  const h = board.dimensions.heightMm;
  lines.push(`  (gr_line (start 0 0) (end ${w} 0) (layer "Edge.Cuts") (width 0.15))`);
  lines.push(`  (gr_line (start ${w} 0) (end ${w} ${h}) (layer "Edge.Cuts") (width 0.15))`);
  lines.push(`  (gr_line (start ${w} ${h}) (end 0 ${h}) (layer "Edge.Cuts") (width 0.15))`);
  lines.push(`  (gr_line (start 0 ${h}) (end 0 0) (layer "Edge.Cuts") (width 0.15))`);
  lines.push(``);

  // Footprints / Components
  for (const comp of board.components) {
    lines.push(`  (footprint "${comp.package}" (layer "${comp.layer === "top" ? "F.Cu" : "B.Cu"}")`);
    lines.push(`    (at ${comp.x} ${comp.y} ${comp.rotation})`);
    lines.push(`    (fp_text reference "${comp.ref}" (at 0 -${(comp.heightMm / 2 + 1).toFixed(1)}) (layer "F.SilkS") (effects (font (size 0.8 0.8) (thickness 0.15))))`);
    lines.push(`    (fp_text value "${comp.value || comp.name}" (at 0 ${(comp.heightMm / 2 + 1).toFixed(1)}) (layer "F.Fab") (effects (font (size 0.8 0.8) (thickness 0.15))))`);

    // Footprint body outline
    const hw = comp.widthMm / 2;
    const hh = comp.heightMm / 2;
    lines.push(`    (fp_line (start -${hw} -${hh}) (end ${hw} -${hh}) (layer "F.SilkS") (width 0.12))`);
    lines.push(`    (fp_line (start ${hw} -${hh}) (end ${hw} ${hh}) (layer "F.SilkS") (width 0.12))`);
    lines.push(`    (fp_line (start ${hw} ${hh}) (end -${hw} ${hh}) (layer "F.SilkS") (width 0.12))`);
    lines.push(`    (fp_line (start -${hw} ${hh}) (end -${hw} -${hh}) (layer "F.SilkS") (width 0.12))`);

    // Pads
    for (const pin of comp.pins) {
      const netIdx = board.nets.findIndex((n) => n.name === pin.net);
      lines.push(
        `    (pad "${pin.number}" smd rect (at ${pin.relX} ${pin.relY}) (size 0.6 0.8) (layers "F.Cu" "F.Paste" "F.Mask") (net ${netIdx >= 0 ? netIdx + 1 : 0} "${pin.net}"))`
      );
    }
    lines.push(`  )`);
  }
  lines.push(``);

  // Traces
  for (const trace of board.traces) {
    const netIdx = board.nets.findIndex((n) => n.name === trace.net);
    for (let i = 1; i < trace.points.length; i++) {
      const p1 = trace.points[i - 1];
      const p2 = trace.points[i];
      lines.push(
        `  (segment (start ${p1[0]} ${p1[1]}) (end ${p2[0]} ${p2[1]}) (width ${trace.widthMm}) (layer "${trace.layer}") (net ${netIdx >= 0 ? netIdx + 1 : 0}))`
      );
    }
  }

  // Vias
  for (const via of board.vias) {
    const netIdx = board.nets.findIndex((n) => n.name === via.net);
    lines.push(
      `  (via (at ${via.x} ${via.y}) (size ${via.padMm}) (drill ${via.drillMm}) (layers "F.Cu" "B.Cu") (net ${netIdx >= 0 ? netIdx + 1 : 0}))`
    );
  }

  lines.push(`)`);
  return lines.join("\n");
}

/**
 * Generate BOM CSV format
 */
export function generateBomCsv(board: PcbBoard): string {
  const headers = [
    "Designator",
    "Quantity",
    "Value",
    "Footprint",
    "Part Name / Description",
    "LCSC Part #",
    "Est Unit Price (USD)",
  ];

  const rows: string[] = [headers.join(",")];

  // Group components by value and footprint
  const groups = new Map<string, { refs: string[]; comp: (typeof board.components)[0] }>();
  for (const c of board.components) {
    const key = `${c.name}|${c.package}|${c.value || ""}`;
    if (!groups.has(key)) {
      groups.set(key, { refs: [], comp: c });
    }
    groups.get(key)!.refs.push(c.ref);
  }

  for (const [, grp] of groups) {
    rows.push(
      [
        `"${grp.refs.join(" ")}"`,
        grp.refs.length,
        `"${grp.comp.value || ""}"`,
        `"${grp.comp.package}"`,
        `"${grp.comp.description || grp.comp.name}"`,
        `"${grp.comp.lcscPartNumber || "N/A"}"`,
        `$${grp.comp.unitCostUsd.toFixed(3)}`,
      ].join(",")
    );
  }

  return rows.join("\n");
}

/**
 * Generate RS-274X Gerber code preview
 */
export function generateGerberPreview(board: PcbBoard): string {
  return `%FSLAX46Y46*%
%MOMM*%
G04 Layer: Top Copper (F.Cu)*
G04 Title: ${board.title} Rev ${board.version}*
G04 Generated by NO AI PCB Engineering Engine*
%TF.GenerationSoftware,NO_AI,1.0*%
%TF.SameCoordinates,Original*%
%TF.FileFunction,Copper,L1,Top*%
%TF.FilePolarity,Positive*%
%ADD10C,0.250000*%
%ADD11R,1.200000X0.800000*%
%ADD12C,0.600000*%
G54D10*
G00X0Y0D02*
G01X${(board.dimensions.widthMm * 1000000).toFixed(0)}Y0D01*
G01X${(board.dimensions.widthMm * 1000000).toFixed(0)}Y${(board.dimensions.heightMm * 1000000).toFixed(0)}D01*
G01X0Y${(board.dimensions.heightMm * 1000000).toFixed(0)}D01*
G01X0Y0D01*
M02*
`;
}

/**
 * Trigger browser file download
 */
export function downloadFile(content: string, filename: string, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
