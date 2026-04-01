"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { MATERIALS, CATEGORIES, type Material } from "@/lib/materials";

const WEEK_DATES: Record<number, string> = {
  1: "2–9 Feb 2026",
  2: "11–18 Feb 2026",
  3: "18–25 Feb 2026",
  4: "23–25 Feb 2026",
  5: "2–4 Mar 2026",
  6: "9–11 Mar 2026",
  7: "16–25 Mar 2026",
};

const themes = {
  light: {
    bg: "#f8f7f4", bg2: "#ffffff", surface: "#f0eff2",
    text: "#1a1a2e", textMuted: "#6b6b80", textDim: "#9999aa",
    accent: "#5046e5", accent2: "#e5466b",
    border: "#e5e5ea", borderLight: "#f0f0f4",
    cardBg: "#ffffff", cardBorder: "rgba(0,0,0,0.06)", cardHover: "rgba(0,0,0,0.02)",
    heroBg: "linear-gradient(135deg, #f0f0ff 0%, #fff5f5 50%, #f0fff5 100%)",
    searchBg: "rgba(0,0,0,0.03)", searchBorder: "rgba(0,0,0,0.08)",
    navBg: "rgba(248,247,244,0.92)",
    pillBg: "rgba(0,0,0,0.04)", pillText: "#666",
    pillActiveBg: "#5046e5", pillActiveText: "#fff",
    footerText: "#aaa",
  },
  dark: {
    bg: "#0a0a12", bg2: "#111119", surface: "#15151f",
    text: "#e8e8f2", textMuted: "#8888a0", textDim: "#555570",
    accent: "#8b80ff", accent2: "#ff6b9d",
    border: "#222235", borderLight: "#1a1a2e",
    cardBg: "rgba(255,255,255,0.03)", cardBorder: "rgba(255,255,255,0.06)", cardHover: "rgba(255,255,255,0.06)",
    heroBg: "linear-gradient(135deg, #0a0a20 0%, #120a14 50%, #0a120a 100%)",
    searchBg: "rgba(255,255,255,0.04)", searchBorder: "rgba(255,255,255,0.08)",
    navBg: "rgba(10,10,18,0.92)",
    pillBg: "rgba(255,255,255,0.06)", pillText: "#888",
    pillActiveBg: "#8b80ff", pillActiveText: "#fff",
    footerText: "#444",
  },
};

export default function Home() {
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const t = dark ? themes.dark : themes.light;

  const filtered = useMemo(() => {
    let items = MATERIALS;
    if (activeCategory) items = items.filter((m) => m.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.subtitle.toLowerCase().includes(q) ||
          m.topics.some((tp) => tp.toLowerCase().includes(q))
      );
    }
    return items;
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, Material[]>();
    for (const m of filtered) {
      const list = map.get(m.category) || [];
      list.push(m);
      map.set(m.category, list);
    }
    return map;
  }, [filtered]);

  const catOrder: (keyof typeof CATEGORIES)[] = [
    "foundations", "data", "models", "evaluation",
  ];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Segoe UI', -apple-system, system-ui, sans-serif", transition: "background 0.4s, color 0.4s" }}>
      {/* Hero */}
      <header style={{ background: t.heroBg, borderBottom: `1px solid ${t.border}`, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 44px", position: "relative" }}>
          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            style={{
              position: "absolute", top: 24, right: 24,
              width: 52, height: 28, borderRadius: 14, border: "none", cursor: "pointer",
              background: dark ? "#333" : "#ddd",
              transition: "background 0.3s",
              display: "flex", alignItems: "center", padding: "0 3px",
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              background: dark ? "#0a0a12" : "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              transform: dark ? "translateX(24px)" : "translateX(0)",
              transition: "transform 0.3s, background 0.3s",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12,
            }}>
              {dark ? "🌙" : "☀️"}
            </div>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: t.accent, textTransform: "uppercase", fontFamily: "monospace" }}>
              CSGE603130
            </span>
            <span style={{ color: t.textDim }}>•</span>
            <span style={{ fontSize: 12, color: t.textMuted }}>
              Genap 2025/2026 · Fasilkom UI
            </span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 14 }}>
            <span style={{ color: t.text }}>Kecerdasan Artifisial &</span>
            <br />
            <span style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Sains Data Dasar
            </span>
          </h1>
          <p style={{ color: t.textMuted, fontSize: 16, maxWidth: 560, lineHeight: 1.7, marginBottom: 24 }}>
            Visualisasi interaktif materi kuliah — dari AI fundamentals,
            search algorithms, data science, hingga machine learning models.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            {[
              { color: "#16a34a", label: `${MATERIALS.length} Materi Interaktif` },
              { color: "#d97706", label: "7 Minggu Perkuliahan" },
              { color: "#5046e5", label: "Versi publik — materi saja" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: t.textMuted }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: t.textDim, marginTop: 16 }}>by{" "}
            <a href="https://www.instagram.com/ghanyrasyid_/" target="_blank" rel="noopener noreferrer" style={{ color: t.textMuted, textDecoration: "none", fontWeight: 500, borderBottom: `1px dotted ${t.textDim}` }}>Ghany Rasyid</a>
          </p>
        </div>
      </header>

      {/* Search + Filter */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: `1px solid ${t.border}`,
        background: t.navBg, backdropFilter: "blur(16px)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 360 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: t.textDim }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari materi, topik, atau keyword..."
              style={{
                width: "100%", background: t.searchBg, border: `1px solid ${t.searchBorder}`,
                borderRadius: 10, padding: "9px 14px 9px 36px", fontSize: 13,
                color: t.text, outline: "none", fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
            <FilterPill active={!activeCategory} onClick={() => setActiveCategory(null)} t={t}>Semua</FilterPill>
            {catOrder.map((key) => {
              const cat = CATEGORIES[key];
              return (
                <FilterPill key={key} active={activeCategory === key} onClick={() => setActiveCategory(activeCategory === key ? null : key)} t={t}>
                  {cat.icon} {cat.label}
                </FilterPill>
              );
            })}
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ color: t.textMuted, fontSize: 16 }}>Tidak ada materi yang cocok.</p>
          </div>
        )}

        {catOrder.map((catKey) => {
          const items = grouped.get(catKey);
          if (!items || items.length === 0) return null;
          const cat = CATEGORIES[catKey];
          return (
            <section key={catKey} style={{ marginBottom: 44 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>{cat.icon}</span>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: t.text, margin: 0 }}>{cat.label}</h2>
                <span style={{ fontSize: 12, color: t.textDim, fontFamily: "monospace" }}>{items.length}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                {items.map((m) => (
                  <MaterialCard key={m.slug} material={m} t={t} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.border}`, padding: "28px 24px", textAlign: "center" }}>
        <p style={{ color: t.footerText, fontSize: 13 }}>CSGE603130 — Kecerdasan Artifisial dan Sains Data Dasar</p>
        <p style={{ color: t.footerText, fontSize: 11, marginTop: 4, opacity: 0.7 }}>Fakultas Ilmu Komputer · Universitas Indonesia · Genap 2025/2026</p>
      </footer>
    </div>
  );
}

function FilterPill({ active, onClick, children, t }: { active: boolean; onClick: () => void; children: React.ReactNode; t: typeof themes.light }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
      background: active ? t.pillActiveBg : t.pillBg,
      color: active ? t.pillActiveText : t.pillText,
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
      transition: "all 0.2s", fontFamily: "inherit",
      display: "flex", alignItems: "center", gap: 4,
    }}>
      {children}
    </button>
  );
}

function MaterialCard({ material: m, t }: { material: Material; t: typeof themes.light }) {
  return (
    <Link href={`/materi/${m.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{
        borderRadius: 14, border: `1px solid ${t.cardBorder}`, background: t.cardBg,
        padding: "18px 20px", transition: "all 0.25s", cursor: "pointer",
        position: "relative", overflow: "hidden",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = m.color + "50"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${m.color}12`; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.cardBorder; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ display: "flex", alignItems: "start", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{m.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace", color: m.color }}>
                Week {m.week}
              </span>
              {WEEK_DATES[m.week] && (
                <span style={{ fontSize: 10, color: t.textDim }}>{WEEK_DATES[m.week]}</span>
              )}
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: t.text, margin: 0, lineHeight: 1.3 }}>{m.title}</h3>
            <p style={{ fontSize: 12, color: t.textMuted, margin: "3px 0 0", lineHeight: 1.4 }}>{m.subtitle}</p>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {m.topics.slice(0, 4).map((topic) => (
            <span key={topic} style={{
              fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 6,
              background: t.pillBg, color: t.textMuted,
            }}>{topic}</span>
          ))}
          {m.topics.length > 4 && (
            <span style={{ fontSize: 10, color: t.textDim }}>+{m.topics.length - 4}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
