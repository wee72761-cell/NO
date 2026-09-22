"use client";

import { useState, useMemo } from "react";
import {
  Globe,
  MapPin,
  Store,
  Search,
  SlidersHorizontal,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Download,
  ExternalLink,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  Building2,
  DollarSign,
  ShoppingCart,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export type SourcingRegion = "local" | "international";
export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD";

interface VolumeTier {
  qty: number;
  price: number;
}

interface ComponentItem {
  id: string;
  partNumber: string;
  manufacturer: string;
  description: string;
  category: "mcu" | "power" | "sensor" | "passive" | "connector" | "wireless";
  package: string;
  basePriceUsd: number;
  localStock: number;
  internationalStock: number;
  localWarehouse: string;
  internationalWarehouse: string;
  localDistributor: string;
  internationalDistributor: string;
  localLeadDays: string;
  internationalLeadDays: string;
  volumeTiers: VolumeTier[];
  datasheetAvailable: boolean;
  rohsCompliant: boolean;
  moq: number;
  volatilityDeltaPct: number;
}

const INITIAL_CATALOG: ComponentItem[] = [
  {
    id: "comp_esp32s3",
    partNumber: "ESP32-S3-WROOM-1-N8R8",
    manufacturer: "Espressif Systems",
    description: "Dual-core Xtensa LX7 240MHz, 2.4GHz Wi-Fi & BLE 5.0, 8MB Flash, 8MB PSRAM",
    category: "wireless",
    package: "SMD-41 18x25.5mm",
    basePriceUsd: 3.45,
    localStock: 2450,
    internationalStock: 48900,
    localWarehouse: "Dallas Hub (Texas, US)",
    internationalWarehouse: "Shenzhen Central Hub (China)",
    localDistributor: "DigiKey US",
    internationalDistributor: "LCSC Electronics",
    localLeadDays: "1 - 2 days",
    internationalLeadDays: "4 - 7 days",
    volumeTiers: [
      { qty: 1, price: 3.45 },
      { qty: 10, price: 3.12 },
      { qty: 100, price: 2.74 },
      { qty: 1000, price: 2.38 },
      { qty: 10000, price: 2.05 },
    ],
    datasheetAvailable: true,
    rohsCompliant: true,
    moq: 1,
    volatilityDeltaPct: -2.4,
  },
  {
    id: "comp_stm32f4",
    partNumber: "STM32F401CCU6",
    manufacturer: "STMicroelectronics",
    description: "ARM Cortex-M4 84MHz, 256KB Flash, 64KB RAM, USB OTG, 12-bit ADC",
    category: "mcu",
    package: "UFQFPN-48 (7x7mm)",
    basePriceUsd: 2.85,
    localStock: 1820,
    internationalStock: 32400,
    localWarehouse: "Chicago Express Hub (IL, US)",
    internationalWarehouse: "Hong Kong Distribution Facility",
    localDistributor: "Mouser US",
    internationalDistributor: "JLCPCB SMT Library",
    localLeadDays: "1 - 2 days",
    internationalLeadDays: "5 - 8 days",
    volumeTiers: [
      { qty: 1, price: 2.85 },
      { qty: 10, price: 2.55 },
      { qty: 100, price: 2.18 },
      { qty: 1000, price: 1.84 },
      { qty: 10000, price: 1.52 },
    ],
    datasheetAvailable: true,
    rohsCompliant: true,
    moq: 1,
    volatilityDeltaPct: +1.8,
  },
  {
    id: "comp_tps54302",
    partNumber: "TPS54302DDCR",
    manufacturer: "Texas Instruments",
    description: "4.5V to 28V input, 3A synchronous step-down buck converter, 400kHz PWM",
    category: "power",
    package: "SOT-23-6",
    basePriceUsd: 1.15,
    localStock: 8900,
    internationalStock: 120500,
    localWarehouse: "Mansfield Mega-Hub (TX, US)",
    internationalWarehouse: "Shenzhen Baolong Hub",
    localDistributor: "Newark / Farnell",
    internationalDistributor: "LCSC Global",
    localLeadDays: "24h - 48h",
    internationalLeadDays: "4 - 6 days",
    volumeTiers: [
      { qty: 1, price: 1.15 },
      { qty: 10, price: 0.98 },
      { qty: 100, price: 0.76 },
      { qty: 1000, price: 0.58 },
      { qty: 10000, price: 0.44 },
    ],
    datasheetAvailable: true,
    rohsCompliant: true,
    moq: 1,
    volatilityDeltaPct: -4.1,
  },
  {
    id: "comp_drv8302",
    partNumber: "DRV8302DCAR",
    manufacturer: "Texas Instruments",
    description: "Three-Phase Gate Driver with Dual Current Sense Amplifiers & Buck Converter",
    category: "power",
    package: "HTSSOP-56",
    basePriceUsd: 4.80,
    localStock: 640,
    internationalStock: 14200,
    localWarehouse: "Phoenix Regional Center (AZ, US)",
    internationalWarehouse: "Singapore Free Trade Zone",
    localDistributor: "Arrow Electronics",
    internationalDistributor: "PCBWay Global",
    localLeadDays: "2 days",
    internationalLeadDays: "6 - 9 days",
    volumeTiers: [
      { qty: 1, price: 4.80 },
      { qty: 10, price: 4.35 },
      { qty: 100, price: 3.75 },
      { qty: 1000, price: 3.10 },
      { qty: 10000, price: 2.65 },
    ],
    datasheetAvailable: true,
    rohsCompliant: true,
    moq: 1,
    volatilityDeltaPct: +3.2,
  },
  {
    id: "comp_bno085",
    partNumber: "BNO085",
    manufacturer: "CEVA / Bosch Sensortec",
    description: "9-Axis SiP Motion Sensor with dynamic on-chip sensor fusion & calibration",
    category: "sensor",
    package: "LGA-28 (3.8x5.2mm)",
    basePriceUsd: 9.60,
    localStock: 410,
    internationalStock: 8200,
    localWarehouse: "Reno Distribution Hub (NV, US)",
    internationalWarehouse: "Taiwan High-Tech Park Hub",
    localDistributor: "DigiKey US",
    internationalDistributor: "Mouser Global",
    localLeadDays: "1 - 2 days",
    internationalLeadDays: "5 - 8 days",
    volumeTiers: [
      { qty: 1, price: 9.60 },
      { qty: 10, price: 8.90 },
      { qty: 100, price: 7.95 },
      { qty: 1000, price: 6.80 },
      { qty: 10000, price: 5.90 },
    ],
    datasheetAvailable: true,
    rohsCompliant: true,
    moq: 1,
    volatilityDeltaPct: -1.2,
  },
  {
    id: "comp_cap_10u",
    partNumber: "GRM31CR71H106KA12L",
    manufacturer: "Murata Electronics",
    description: "10µF ±10% 50V Ceramic Capacitor X7R, High ripple current rated",
    category: "passive",
    package: "1206 (3216 Metric)",
    basePriceUsd: 0.18,
    localStock: 45000,
    internationalStock: 680000,
    localWarehouse: "Columbus Logistics Center (OH, US)",
    internationalWarehouse: "Shenzhen Futian Bonded Zone",
    localDistributor: "RS Components",
    internationalDistributor: "LCSC Shenzhen",
    localLeadDays: "24h courier",
    internationalLeadDays: "3 - 5 days",
    volumeTiers: [
      { qty: 1, price: 0.18 },
      { qty: 10, price: 0.14 },
      { qty: 100, price: 0.08 },
      { qty: 1000, price: 0.045 },
      { qty: 10000, price: 0.028 },
    ],
    datasheetAvailable: true,
    rohsCompliant: true,
    moq: 10,
    volatilityDeltaPct: +0.5,
  },
  {
    id: "comp_ind_6u8",
    partNumber: "XAL7030-682MEC",
    manufacturer: "Coilcraft",
    description: "6.8µH ±20% 4.1A Shielded Power Inductor, ultra-low DCR (28mΩ)",
    category: "passive",
    package: "SMD-7030 (7.5x7.0mm)",
    basePriceUsd: 1.42,
    localStock: 3200,
    internationalStock: 42000,
    localWarehouse: "Chicago Facility (IL, US)",
    internationalWarehouse: "Shenzhen Central Hub",
    localDistributor: "Newark Electronics",
    internationalDistributor: "LCSC Electronics",
    localLeadDays: "24h - 48h",
    internationalLeadDays: "4 - 7 days",
    volumeTiers: [
      { qty: 1, price: 1.42 },
      { qty: 10, price: 1.25 },
      { qty: 100, price: 0.98 },
      { qty: 1000, price: 0.79 },
      { qty: 10000, price: 0.65 },
    ],
    datasheetAvailable: true,
    rohsCompliant: true,
    moq: 1,
    volatilityDeltaPct: -3.8,
  },
  {
    id: "comp_usbc",
    partNumber: "TYPE-C-31-M-12",
    manufacturer: "Korean Hroparts Elec",
    description: "USB Type-C 16-Pin Receptacle, Mid-Mount SMD, 3A rated, 10,000 cycles",
    category: "connector",
    package: "Hybrid SMT + THT",
    basePriceUsd: 0.35,
    localStock: 12400,
    internationalStock: 250000,
    localWarehouse: "Dallas Hub (TX, US)",
    internationalWarehouse: "Dongguan Direct Factory",
    localDistributor: "DigiKey US",
    internationalDistributor: "JLCPCB SMT Library",
    localLeadDays: "1 - 2 days",
    internationalLeadDays: "3 - 5 days",
    volumeTiers: [
      { qty: 1, price: 0.35 },
      { qty: 10, price: 0.28 },
      { qty: 100, price: 0.21 },
      { qty: 1000, price: 0.15 },
      { qty: 10000, price: 0.11 },
    ],
    datasheetAvailable: true,
    rohsCompliant: true,
    moq: 5,
    volatilityDeltaPct: +2.1,
  },
];

const CURRENCY_RATES: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1.0 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  JPY: { symbol: "¥", rate: 154.5 },
  CAD: { symbol: "CA$", rate: 1.36 },
};

export function HardwareSourcingMarket() {
  const [region, setRegion] = useState<SourcingRegion>("local");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedQty, setSelectedQty] = useState<number>(100);
  const [livePriceFluctuation, setLivePriceFluctuation] = useState<boolean>(true);
  const [catalogSeed, setCatalogSeed] = useState<number>(0);
  const [addedItems, setAddedItems] = useState<Record<string, number>>({});

  // Re-randomize / simulate spot market price movements
  const handleRandomizePrices = () => {
    setCatalogSeed((prev) => prev + 1);
    toast.success("Spot market prices updated from real-time global distributor feeds.");
  };

  // Convert USD price to current selected currency and volume tier
  const getPriceForQty = (item: ComponentItem, qty: number) => {
    // Find closest volume tier <= qty
    let unitUsd = item.basePriceUsd;
    for (const tier of item.volumeTiers) {
      if (qty >= tier.qty) {
        unitUsd = tier.price;
      }
    }

    // Apply slight spot market volatility if enabled
    if (livePriceFluctuation) {
      const pseudoRandom = Math.sin(item.id.length * 11 + catalogSeed * 7);
      const swingMultiplier = 1 + (pseudoRandom * 0.04);
      unitUsd = unitUsd * swingMultiplier;
    }

    // International volume discount factor for Asian mega-distributor
    if (region === "international") {
      unitUsd = unitUsd * 0.88; // ~12% lower cost on global direct bulk
    }

    const curr = CURRENCY_RATES[currency];
    const converted = unitUsd * curr.rate;
    return {
      unitFormatted: `${curr.symbol}${converted < 0.1 ? converted.toFixed(3) : converted.toFixed(2)}`,
      totalFormatted: `${curr.symbol}${(converted * qty).toFixed(2)}`,
      numericUnit: converted,
    };
  };

  const filteredItems = useMemo(() => {
    return INITIAL_CATALOG.filter((item) => {
      const matchesSearch =
        item.partNumber.toLowerCase().includes(search.toLowerCase()) ||
        item.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.package.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter]);

  const handleAddToCart = (item: ComponentItem) => {
    setAddedItems((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + selectedQty,
    }));
    toast.success(`Added ${selectedQty}x ${item.partNumber} to active project procurement BOM.`);
  };

  const handleDownloadQuotationCsv = () => {
    const rows = [
      ["Part Number", "Manufacturer", "Description", "Region", "Warehouse", "Distributor", "Quantity", `Unit Price (${currency})`, `Total (${currency})`, "Lead Time"],
      ...filteredItems.map((item) => {
        const p = getPriceForQty(item, selectedQty);
        return [
          `"${item.partNumber}"`,
          `"${item.manufacturer}"`,
          `"${item.description}"`,
          region.toUpperCase(),
          `"${region === "local" ? item.localWarehouse : item.internationalWarehouse}"`,
          `"${region === "local" ? item.localDistributor : item.internationalDistributor}"`,
          selectedQty,
          `"${p.unitFormatted}"`,
          `"${p.totalFormatted}"`,
          `"${region === "local" ? item.localLeadDays : item.internationalLeadDays}"`,
        ];
      }),
    ];
    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `NO_${region.toUpperCase()}_Procurement_Quote_${selectedQty}pcs.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded Real-time Procurement Quotation CSV.");
  };

  return (
    <div id="hardware-sourcing-market" className="space-y-6">
      {/* Top Header & Strategy Controls */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500 border border-emerald-500/20">
                <Store className="h-3 w-3" /> Live Sourcing Matrix
              </span>
              <span className="text-xs text-muted-foreground">Unified Global Component Broker</span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Electronic Components & Silicon Sourcing
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Compare domestic fast-dispatch distribution against international volume mega-warehouses. Real-time stock, volume tier pricing, and instant BOM synchronization.
            </p>
          </div>

          {/* Local vs International Sourcing Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="inline-flex rounded-lg border border-border bg-muted/50 p-1">
              <button
                type="button"
                onClick={() => setRegion("local")}
                className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  region === "local"
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>Local (Domestic Hubs)</span>
                <span className="rounded bg-emerald-500/10 text-emerald-500 text-[10px] px-1.5 py-0.2">
                  24h-48h
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRegion("international")}
                className={`flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  region === "international"
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                <span>International (Shenzhen Mega-Hub)</span>
                <span className="rounded bg-blue-500/10 text-blue-500 text-[10px] px-1.5 py-0.2">
                  -15% Bulk
                </span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (CA$)</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRandomizePrices}
                className="h-8 gap-1.5 text-xs border-border"
                title="Refresh and simulate live spot market fluctuations"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Spot Tick</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Region Advantage Banner */}
        <div className="mt-5 rounded-lg border border-border/50 bg-muted/30 p-3.5 text-xs flex flex-wrap items-center justify-between gap-4">
          {region === "local" ? (
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="font-semibold text-foreground">Local Distribution Active: </span>
                <span className="text-muted-foreground">
                  Fulfilling from US / North American regional depots (DigiKey Thief River Falls, Newark Chicago, Mouser Mansfield). Overnight / 48h courier available. No import tariff delays.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <div>
                <span className="font-semibold text-foreground">International Sourcing Active: </span>
                <span className="text-muted-foreground">
                  Factory-direct supply lines from Shenzhen, Dongguan, and Taiwan. Deep volume tiered pricing for mass production. Automated DHL/FedEx customs clearance paperwork generated.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Volume Pricing Calc:</span>
            <div className="inline-flex rounded-md border border-border bg-background p-0.5">
              {[1, 10, 100, 1000, 10000].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setSelectedQty(qty)}
                  className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                    selectedQty === qty
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {qty >= 1000 ? `${qty / 1000}k` : qty}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadQuotationCsv}
              className="h-7 text-xs gap-1 ml-2"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Quote CSV</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search part #, MPN, MCU, power IC, package..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: "All Silicon" },
            { id: "mcu", label: "MCUs & DSP" },
            { id: "power", label: "Power & Drivers" },
            { id: "sensor", label: "Sensors & IMU" },
            { id: "passive", label: "Passives & Inductors" },
            { id: "connector", label: "Connectors" },
            { id: "wireless", label: "RF & Wireless" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                categoryFilter === cat.id
                  ? "bg-foreground text-background"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const pricing = getPriceForQty(item, selectedQty);
          const stock = region === "local" ? item.localStock : item.internationalStock;
          const warehouse = region === "local" ? item.localWarehouse : item.internationalWarehouse;
          const distributor = region === "local" ? item.localDistributor : item.internationalDistributor;
          const leadTime = region === "local" ? item.localLeadDays : item.internationalLeadDays;
          const isAdded = addedItems[item.id] !== undefined;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between hover:border-primary/40 transition-all shadow-sm group"
            >
              <div className="space-y-3">
                {/* Header: MPN, Manufacturer, and Volatility */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-foreground font-mono">
                      {item.partNumber}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">{item.manufacturer}</p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold ${
                      item.volatilityDeltaPct < 0
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {item.volatilityDeltaPct < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {Math.abs(item.volatilityDeltaPct)}%
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Package & Compliance badges */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-muted-foreground border border-border/40">
                    {item.package}
                  </span>
                  {item.rohsCompliant && (
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-500 border border-emerald-500/20 font-medium">
                      RoHS
                    </span>
                  )}
                  <span className="rounded bg-blue-500/10 px-2 py-0.5 text-blue-500 border border-blue-500/20 font-medium">
                    MOQ: {item.moq}
                  </span>
                </div>

                {/* Stock & Warehouse Origin */}
                <div className="rounded-lg bg-muted/40 border border-border/40 p-2.5 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Package className="h-3 w-3 text-muted-foreground" />
                      <span>Live Stock:</span>
                    </span>
                    <span className="font-mono font-semibold text-foreground">
                      {stock.toLocaleString()} pcs
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="h-3 w-3 text-muted-foreground" />
                      <span>Lead Time:</span>
                    </span>
                    <span className="font-medium text-foreground">{leadTime}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <span>Distributor:</span>
                    </span>
                    <span className="font-medium text-foreground">{distributor}</span>
                  </div>

                  <div className="pt-1 border-t border-border/40 text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5 text-primary" />
                    <span className="truncate">{warehouse}</span>
                  </div>
                </div>
              </div>

              {/* Price Calculation & Add to BOM Button */}
              <div className="mt-4 pt-3 border-t border-border space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">
                      @{selectedQty} pcs tier
                    </span>
                    <span className="text-base font-bold text-foreground font-mono">
                      {pricing.unitFormatted}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-normal ml-1">/ unit</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground block">Lot Total</span>
                    <span className="text-xs font-semibold text-foreground font-mono">
                      {pricing.totalFormatted}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={isAdded ? "outline" : "default"}
                    onClick={() => handleAddToCart(item)}
                    className="h-8 text-xs gap-1.5 w-full"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    <span>{isAdded ? "Add More" : "Add to BOM"}</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.info(`Redirecting to ${distributor} live checkout portal for ${item.partNumber}`);
                    }}
                    className="h-8 text-xs gap-1 w-full"
                  >
                    <span>Instant Reel</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
