"use client";
import { use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MATERIALS } from "@/lib/materials";

const COMPONENT_MAP: Record<string, ReturnType<typeof dynamic>> = {
  "what-is-ai": dynamic(() => import("@/components/Materi1WhatIsAI"), { ssr: false, loading: () => <Loading /> }),
  search: dynamic(() => import("@/components/SearchVisualization"), { ssr: false, loading: () => <Loading /> }),
  "data-science": dynamic(() => import("@/components/Materi3SainsData"), { ssr: false, loading: () => <Loading /> }),
  "eda-visualization": dynamic(() => import("@/components/Materi4Visualisasi"), { ssr: false, loading: () => <Loading /> }),
  "feature-engineering": dynamic(() => import("@/components/FeatureEngineering"), { ssr: false, loading: () => <Loading /> }),
  pca: dynamic(() => import("@/components/PCAVisualization"), { ssr: false, loading: () => <Loading /> }),
  cart: dynamic(() => import("@/components/CARTVisualization"), { ssr: false, loading: () => <Loading /> }),
  "random-forest": dynamic(() => import("@/components/RandomForestViz"), { ssr: false, loading: () => <Loading /> }),
  "model-evaluation": dynamic(() => import("@/components/ModelEvaluation"), { ssr: false, loading: () => <Loading /> }),
  "bias-variance": dynamic(() => import("@/components/BiasVariance"), { ssr: false, loading: () => <Loading /> }),
  knn: dynamic(() => import("@/components/KNNVisualization"), { ssr: false, loading: () => <Loading /> }),
  imbalanced: dynamic(() => import("@/components/ImbalancedClassification"), { ssr: false, loading: () => <Loading /> }),
};

function Loading() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7f4" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: "pulse 1.5s infinite" }}>📚</div>
        <div style={{ color: "#666", fontSize: 14 }}>Memuat materi...</div>
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:0.5; transform:scale(0.95) } }`}</style>
    </div>
  );
}

export default function MateriPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const material = MATERIALS.find((m) => m.slug === slug);
  const Component = COMPONENT_MAP[slug];

  if (!material || !Component) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#f8f7f4", color: "#333" }}>
        <span style={{ fontSize: 64 }}>🤷</span>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Materi tidak ditemukan</h1>
        <Link href="/" style={{ color: "#5046e5", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
          ← Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const currentIdx = MATERIALS.findIndex((m) => m.slug === slug);
  const prev = currentIdx > 0 ? MATERIALS[currentIdx - 1] : null;
  const next = currentIdx < MATERIALS.length - 1 ? MATERIALS[currentIdx + 1] : null;

  return (
    <div style={{ position: "relative" }}>
      {/* Floating back button */}
      <Link
        href="/"
        style={{
          position: "fixed", top: 12, left: 12, zIndex: 9999,
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 12,
          background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          color: "#333", fontSize: 13, fontWeight: 600, textDecoration: "none",
          transition: "all 0.2s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Beranda</span>
      </Link>

      {/* Floating prev/next */}
      <div style={{
        position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 8px", borderRadius: 14,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}>
        {prev ? (
          <Link href={`/materi/${prev.slug}`} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
            color: "#555", textDecoration: "none", background: "rgba(0,0,0,0.04)",
            transition: "all 0.2s",
          }}>
            ← {prev.icon} {prev.title}
          </Link>
        ) : <div />}
        <Link href="/" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 8, background: "rgba(0,0,0,0.04)",
          color: "#555", textDecoration: "none", fontSize: 14,
        }}>
          ⌂
        </Link>
        {next ? (
          <Link href={`/materi/${next.slug}`} style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
            color: "#555", textDecoration: "none", background: "rgba(0,0,0,0.04)",
            transition: "all 0.2s",
          }}>
            {next.icon} {next.title} →
          </Link>
        ) : <div />}
      </div>

      {/* Component renders full-page */}
      <Component />
    </div>
  );
}
