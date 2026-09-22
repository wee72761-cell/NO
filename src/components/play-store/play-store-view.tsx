"use client";

import { useState } from "react";
import {
  Smartphone,
  Download,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  FileCode,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoMark } from "@/components/no-logo";
import { toast } from "@/components/ui/toast";

export function PlayStoreView() {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedAssetLinks, setCopiedAssetLinks] = useState(false);
  const [packageName, setPackageName] = useState("com.no.hardware.studio");
  const [sha256Fingerprint, setSha256Fingerprint] = useState(
    "14:6D:E9:7F:0F:52:EA:CB:5B:67:E6:89:E3:64:BF:6C:54:E6:E1:92:26:7A:B7:6E:9B:F3:33:C9:DD:C7:E2:20"
  );

  const sampleBubblewrapCommands = `# 1. Install Google's official Bubblewrap CLI
npm install -g @bubblewrap/cli

# 2. Initialize project from NO's Web App Manifest
bubblewrap init --manifest=https://your-domain.app/manifest.json

# 3. Build production Android App Bundle (.aab)
bubblewrap build

# Ready! Upload "app-release-bundle.aab" to Google Play Console.`;

  const assetLinksJson = JSON.stringify(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: packageName,
          sha256_cert_fingerprints: [sha256Fingerprint],
        },
      },
    ],
    null,
    2
  );

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(sampleBubblewrapCommands);
    setCopiedCmd(true);
    toast.success("Copied Bubblewrap CLI commands to clipboard.");
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  const handleCopyAssetLinks = () => {
    navigator.clipboard.writeText(assetLinksJson);
    setCopiedAssetLinks(true);
    toast.success("Copied assetlinks.json to clipboard.");
    setTimeout(() => setCopiedAssetLinks(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 py-8 text-zinc-100">
      {/* Top Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 shadow-md">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-display">
                  Google Play Store Deployment & Publishing Portal
                </h1>
                <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-mono text-zinc-300 border border-zinc-700">
                  Google Trusted Web Activity (TWA)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
                The official, Google-recommended standard for distributing web applications on Google Play Store
                with native performance, offline capabilities, push notifications, and full-screen display.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => window.open("https://play.google.com/console", "_blank")}
              className="bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs px-3.5 py-2 rounded-lg shadow flex items-center gap-1.5"
            >
              Open Play Console <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Publishing Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1 & 2: Bubblewrap CLI & PWABuilder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Packaging Guide */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-zinc-300" />
                <h2 className="font-semibold text-sm text-white">
                  Step 1: Generate Android App Bundle (.aab) with Bubblewrap
                </h2>
              </div>
              <button
                onClick={handleCopyCommands}
                className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                {copiedCmd ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copiedCmd ? "Copied" : "Copy Commands"}
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Google created <strong>Bubblewrap</strong>, a command-line tool that takes an existing PWA
              and wraps it into a first-class Android application using a <em>Trusted Web Activity</em>.
              No Android Studio or Java/Kotlin programming is required.
            </p>

            <pre className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-200 overflow-x-auto">
              <code>{sampleBubblewrapCommands}</code>
            </pre>

            <div className="rounded-lg bg-zinc-950 p-3.5 border border-zinc-800 flex items-start gap-3 text-xs text-zinc-400">
              <Sparkles className="h-4 w-4 text-zinc-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200">Alternative 1-Click GUI: PWABuilder</strong>
                <p className="mt-0.5 text-[11px]">
                  You can also paste your URL into <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="text-zinc-200 underline font-medium">pwabuilder.com</a> (developed by Microsoft & Google) to generate a signed Android package with a single click.
                </p>
              </div>
            </div>
          </div>

          {/* Digital Asset Links Generator */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-zinc-300" />
                <h2 className="font-semibold text-sm text-white">
                  Step 2: Digital Asset Links (assetlinks.json)
                </h2>
              </div>
              <button
                onClick={handleCopyAssetLinks}
                className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              >
                {copiedAssetLinks ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copiedAssetLinks ? "Copied JSON" : "Copy JSON"}
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              To ensure the app opens in <strong>full-screen native mode without a browser address bar</strong>,
              host this JSON file at <code className="text-zinc-200">/.well-known/assetlinks.json</code> on your server.
              It proves that the web domain and the Android app belong to the same entity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] font-medium text-zinc-300 block mb-1">Android Package Name</label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 font-mono text-zinc-200 text-xs focus:outline-none focus:border-zinc-600"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-300 block mb-1">SHA-256 Key Certificate Fingerprint</label>
                <input
                  type="text"
                  value={sha256Fingerprint}
                  onChange={(e) => setSha256Fingerprint(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 font-mono text-zinc-200 text-xs focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>

            <pre className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
              <code>{assetLinksJson}</code>
            </pre>
          </div>
        </div>

        {/* Right Col: Google Play Console Submission Checklist */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
              <ShieldCheck className="h-4 w-4 text-zinc-300" />
              <h2 className="font-semibold text-sm text-white">
                Play Console Submission Checklist
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200">1. Play Console Developer Account</strong>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    One-time registration fee of $25 USD at play.google.com/console.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200">2. Web App Manifest Validated</strong>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Configured with standalone mode, icons, and theme color in <code className="text-zinc-300 font-mono">/manifest.json</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200">3. High-Res App Icon (512x512)</strong>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Ready for download via <code className="text-zinc-300 font-mono">/no-icon.svg</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200">4. Feature Graphic (1024x500 PNG)</strong>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Header promotional banner displayed in the Play Store search results.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200">5. Internal Testing Release Track</strong>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Upload your <code className="text-zinc-300 font-mono">.aab</code> to Internal Testing first to install on your own Android phone in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-zinc-200">6. Production Track Rollout</strong>
                  <p className="text-zinc-400 text-[11px] mt-0.5">
                    Promote from Closed Testing to Production for global availability on Google Play Store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
