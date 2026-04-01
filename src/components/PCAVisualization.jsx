import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
//  MATERI 6: REDUKSI DIMENSI & PCA — Interactive Visualization
// ═══════════════════════════════════════════════════════════════

const THEMES = {
  dark: {
    bg: "#0b0f1a", bgCard: "#111827", bgCardHover: "#1a2235",
    bgSurface: "#0f1525", bgAccent: "rgba(99,200,255,0.06)",
    text: "#e2e8f0", textMuted: "#8b95a8", textDim: "#5a647a",
    border: "rgba(255,255,255,0.06)", borderAccent: "rgba(99,200,255,0.15)",
    accent: "#63c8ff", accent2: "#a78bfa", accent3: "#34d399", accent4: "#f472b6",
    accentWarm: "#fbbf24", danger: "#f87171",
    gridLine: "rgba(255,255,255,0.04)", axisLine: "rgba(255,255,255,0.15)",
    shadow: "0 8px 32px rgba(0,0,0,0.5)",
    glow: "0 0 40px rgba(99,200,255,0.08)",
  },
  light: {
    bg: "#f8f9fc", bgCard: "#ffffff", bgCardHover: "#f1f5f9",
    bgSurface: "#f0f3f8", bgAccent: "rgba(59,130,246,0.05)",
    text: "#1e293b", textMuted: "#64748b", textDim: "#94a3b8",
    border: "rgba(0,0,0,0.08)", borderAccent: "rgba(59,130,246,0.2)",
    accent: "#3b82f6", accent2: "#7c3aed", accent3: "#059669", accent4: "#db2777",
    accentWarm: "#d97706", danger: "#dc2626",
    gridLine: "rgba(0,0,0,0.04)", axisLine: "rgba(0,0,0,0.2)",
    shadow: "0 8px 32px rgba(0,0,0,0.08)",
    glow: "0 0 40px rgba(59,130,246,0.06)",
  },
};

// ── SECTION DATA ──
const SECTIONS = [
  { id: "intro", label: "Intro", icon: "🎯" },
  { id: "covariance", label: "Kovarian", icon: "📊" },
  { id: "basis", label: "Basis", icon: "📐" },
  { id: "transform", label: "Transformasi", icon: "🔄" },
  { id: "eigen", label: "Eigen", icon: "⚡" },
  { id: "diagonal", label: "Diagonal", icon: "🔲" },
  { id: "pca-steps", label: "PCA Steps", icon: "🧬" },
  { id: "variance", label: "Variance", icon: "📈" },
  { id: "app", label: "Aplikasi", icon: "🎭" },
];

// ── SVG Mini Components ──
function CoordGrid({ w, h, t, cx, cy, scale, showGrid = true }) {
  const lines = [];
  if (showGrid) {
    for (let i = -10; i <= 10; i++) {
      const px = cx + i * scale;
      const py = cy - i * scale;
      if (px >= 0 && px <= w) lines.push(<line key={`vg${i}`} x1={px} y1={0} x2={px} y2={h} stroke={t.gridLine} strokeWidth={1} />);
      if (py >= 0 && py <= h) lines.push(<line key={`hg${i}`} x1={0} y1={py} x2={w} y2={py} stroke={t.gridLine} strokeWidth={1} />);
    }
  }
  return (
    <g>
      {lines}
      <line x1={0} y1={cy} x2={w} y2={cy} stroke={t.axisLine} strokeWidth={1.5} />
      <line x1={cx} y1={0} x2={cx} y2={h} stroke={t.axisLine} strokeWidth={1.5} />
    </g>
  );
}

function DataPoint({ cx, cy, r = 5, fill, glow, delay = 0 }) {
  return (
    <g>
      {glow && <circle cx={cx} cy={cy} r={r + 4} fill={glow} opacity={0.3}>
        <animate attributeName="r" values={`${r + 2};${r + 6};${r + 2}`} dur="2s" repeatCount="indefinite" />
      </circle>}
      <circle cx={cx} cy={cy} r={r} fill={fill} style={{ animation: `popIn 0.4s ${delay}s both` }} />
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, width = 2, dashed = false }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLen = 10;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}
        strokeDasharray={dashed ? "6 4" : "none"} />
      <polygon
        points={`${x2},${y2} ${x2 - headLen * Math.cos(angle - 0.4)},${y2 - headLen * Math.sin(angle - 0.4)} ${x2 - headLen * Math.cos(angle + 0.4)},${y2 - headLen * Math.sin(angle + 0.4)}`}
        fill={color}
      />
    </g>
  );
}

// ═══════════ SECTION COMPONENTS ═══════════

function IntroSection({ t }) {
  return (
    <div>
      <SectionTitle t={t} icon="🎯" title="Apa itu Dimensionality Reduction?" />
      <p style={{ color: t.textMuted, lineHeight: 1.8, fontSize: 15, marginBottom: 24 }}>
        Data kamu bisa punya ratusan kolom (fitur), tapi <b style={{ color: t.accent }}>tidak semua relevan</b>. 
        Dimensionality reduction = teknik mengurangi jumlah fitur sambil menjaga informasi penting.
      </p>

      {/* Visual: banyak kolom → sedikit kolom */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "32px 0", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              width: 18, height: 80 + Math.random() * 40,
              borderRadius: 4,
              background: i < 3 ? t.accent : i < 6 ? t.accent2 : t.textDim + "40",
              opacity: i >= 6 ? 0.3 : 0.8,
              animation: `slideUp 0.5s ${i * 0.05}s both`,
            }} />
          ))}
        </div>
        <svg width={60} height={40}><Arrow x1={5} y1={20} x2={55} y2={20} color={t.accentWarm} width={3} /></svg>
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{
              width: 24, height: 90 + i * 15,
              borderRadius: 4,
              background: [t.accent, t.accent2, t.accent3][i],
              opacity: 0.9,
              animation: `slideUp 0.5s ${0.8 + i * 0.1}s both`,
            }} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
        {[
          { icon: "🏗️", title: "Tujuan", desc: "Cari representasi berdimensi lebih rendah" },
          { icon: "🧬", title: "Metode", desc: "PCA (Principal Component Analysis)" },
          { icon: "💡", title: "Kenapa?", desc: "Kurangi noise, hemat komputasi, hindari curse of dimensionality" },
          { icon: "🔗", title: "Hubungan", desc: "Fitur yang berkorelasi tinggi → bisa digabung jadi 1" },
        ].map((item, i) => (
          <div key={i} style={{
            background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16,
            animation: `fadeIn 0.4s ${0.3 + i * 0.1}s both`,
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, color: t.text, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
            <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CovarianceSection({ t }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const irisData = [
    ["", "Sepal L", "Sepal W", "Petal L", "Petal W"],
    ["Sepal L", 0.686, -0.039, 1.274, 0.517],
    ["Sepal W", -0.039, 0.188, -0.322, -0.118],
    ["Petal L", 1.274, -0.322, 3.113, 1.296],
    ["Petal W", 0.517, -0.118, 1.296, 0.582],
  ];

  const getColor = (val) => {
    if (typeof val !== "number") return "transparent";
    const abs = Math.abs(val);
    const max = 3.2;
    const ratio = Math.min(abs / max, 1);
    if (val > 0) return `rgba(52,211,153,${ratio * 0.6})`;
    return `rgba(248,113,113,${ratio * 0.6})`;
  };

  return (
    <div>
      <SectionTitle t={t} icon="📊" title="Matriks Kovarian" />
      
      <div style={{ background: t.bgAccent, borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${t.borderAccent}` }}>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
          <b style={{ color: t.accent }}>Kovarian</b> mengukur seberapa besar dua variabel berubah bersamaan.
          <b style={{ color: t.accent3 }}> Positif</b> = naik bareng, <b style={{ color: t.danger }}> Negatif</b> = berlawanan arah.
          <br /><b style={{ color: t.accent2 }}>Korelasi</b> = kovarian yang dinormalisasi (range -1 sampai 1).
        </div>
      </div>

      {/* Formula */}
      <div style={{
        background: t.bgCard, borderRadius: 12, padding: 20, textAlign: "center",
        border: `1px solid ${t.border}`, marginBottom: 20, fontFamily: "'Fira Code', monospace",
      }}>
        <div style={{ fontSize: 13, color: t.textDim, marginBottom: 8 }}>Rumus Kovarian:</div>
        <div style={{ fontSize: 18, color: t.text }}>
          cov(X,Y) = <span style={{ color: t.accent }}>Σ(xᵢ - x̄)(yᵢ - ȳ)</span> / <span style={{ color: t.accent2 }}>N</span>
        </div>
        <div style={{ fontSize: 12, color: t.textDim, marginTop: 8 }}>
          x̄ = rata-rata X, ȳ = rata-rata Y, N = jumlah data
        </div>
      </div>

      {/* Interactive Iris Covariance Matrix */}
      <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 10, fontWeight: 600 }}>
        Matriks Kovarian Iris Dataset <span style={{ color: t.textDim, fontWeight: 400 }}>(hover untuk detail)</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 3 }}>
          <tbody>
            {irisData.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => {
                  const isHeader = i === 0 || j === 0;
                  const isHovered = hoveredCell && (hoveredCell.i === i || hoveredCell.j === j);
                  const isDiag = i === j && i > 0;
                  return (
                    <td key={j}
                      onMouseEnter={() => !isHeader && setHoveredCell({ i, j })}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        padding: "10px 8px", textAlign: "center",
                        fontSize: isHeader ? 11 : 14,
                        fontWeight: isHeader ? 700 : isDiag ? 700 : 400,
                        color: isHeader ? t.textMuted : isDiag ? t.accentWarm : t.text,
                        background: isHeader ? "transparent" : getColor(cell),
                        borderRadius: 6,
                        border: isHovered && !isHeader ? `2px solid ${t.accent}` : `2px solid transparent`,
                        transition: "all 0.2s",
                        fontFamily: isHeader ? "inherit" : "'Fira Code', monospace",
                      }}
                    >
                      {typeof cell === "number" ? cell.toFixed(3) : cell}
                      {isDiag && <div style={{ fontSize: 9, color: t.textDim }}>var</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hoveredCell && hoveredCell.i > 0 && hoveredCell.j > 0 && (
        <div style={{
          marginTop: 10, padding: 10, background: t.bgCard, borderRadius: 8,
          border: `1px solid ${t.accent}30`, fontSize: 13, color: t.textMuted,
          animation: "fadeIn 0.2s both",
        }}>
          cov({irisData[0][hoveredCell.j]}, {irisData[hoveredCell.i][0]}) = <b style={{ color: t.text }}>{irisData[hoveredCell.i][hoveredCell.j]}</b>
          {hoveredCell.i === hoveredCell.j ? " → Ini adalah VARIANSI (diagonal)" :
            irisData[hoveredCell.i][hoveredCell.j] > 0 ? " → Berkorelasi positif" : " → Berkorelasi negatif"}
        </div>
      )}

      <div style={{
        marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
      }}>
        <div style={{ background: `${t.accent3}15`, borderRadius: 8, padding: 10, fontSize: 12, color: t.textMuted }}>
          <b style={{ color: t.accent3 }}>Tertinggi:</b> cov(Petal L, Petal W) = 1.296
        </div>
        <div style={{ background: `${t.danger}15`, borderRadius: 8, padding: 10, fontSize: 12, color: t.textMuted }}>
          <b style={{ color: t.danger }}>Terendah:</b> cov(Sepal W, Petal L) = -0.322
        </div>
      </div>
    </div>
  );
}

function BasisSection({ t }) {
  const [activeBase, setActiveBase] = useState(0);
  const w = 320, h = 260, cx = w / 2, cy = h / 2, sc = 30;

  const bases = [
    { name: "B1 Standard", v1: [1, 0], v2: [0, 1], coord: [2, 2], label: "(2,2)" },
    { name: "B2", v1: [1, 1], v2: [1, -1], coord: [2, 0], label: "(2,0)" },
    { name: "B3", v1: [1, 3], v2: [2, 1], coord: ["?", "?"], label: "(?,?)" },
  ];
  const b = bases[activeBase];
  const ptX = cx + 2 * sc, ptY = cy - 2 * sc;

  return (
    <div>
      <SectionTitle t={t} icon="📐" title="Basis, Dimensi & Koordinat Relatif" />

      <div style={{ background: t.bgAccent, borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${t.borderAccent}` }}>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
          <b style={{ color: t.accent }}>Basis</b> = kumpulan vektor yang bebas linier dan merentang seluruh ruang vektor.
          <br /><b style={{ color: t.accent2 }}>Dimensi</b> = jumlah vektor dalam basis = jumlah fitur/kolom pada data.
          <br />Basis yang berbeda → <b style={{ color: t.accentWarm }}>koordinat relatif</b> yang berbeda untuk titik yang sama!
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {bases.map((base, i) => (
          <button key={i} onClick={() => setActiveBase(i)} style={{
            flex: 1, padding: "8px 4px", borderRadius: 8, border: `1px solid ${activeBase === i ? t.accent : t.border}`,
            background: activeBase === i ? t.accent + "20" : t.bgCard, color: activeBase === i ? t.accent : t.textMuted,
            cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
          }}>{base.name}</button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={w} height={h} style={{ background: t.bgCard, borderRadius: 12, border: `1px solid ${t.border}` }}>
          <CoordGrid w={w} h={h} t={t} cx={cx} cy={cy} scale={sc} />
          {/* Basis vectors */}
          <Arrow x1={cx} y1={cy} x2={cx + b.v1[0] * sc * 2.5} y2={cy - b.v1[1] * sc * 2.5} color={t.accent} width={2.5} />
          <Arrow x1={cx} y1={cy} x2={cx + b.v2[0] * sc * 2.5} y2={cy - b.v2[1] * sc * 2.5} color={t.accent3} width={2.5} />
          {/* The point (2,2) in standard coords */}
          <DataPoint cx={ptX} cy={ptY} r={7} fill={t.danger} glow={t.danger} />
          <text x={ptX + 12} y={ptY - 8} fill={t.text} fontSize={12} fontWeight={700}>(2,2)</text>
          {/* Labels */}
          <text x={cx + b.v1[0] * sc * 2.5 + 5} y={cy - b.v1[1] * sc * 2.5 - 5}
            fill={t.accent} fontSize={10} fontWeight={600}>v₁({b.v1.join(",")})</text>
          <text x={cx + b.v2[0] * sc * 2.5 + 5} y={cy - b.v2[1] * sc * 2.5 + 14}
            fill={t.accent3} fontSize={10} fontWeight={600}>v₂({b.v2.join(",")})</text>
        </svg>
      </div>

      <div style={{
        marginTop: 12, textAlign: "center", padding: 12, background: t.bgCard,
        borderRadius: 10, border: `1px solid ${t.border}`, fontFamily: "'Fira Code', monospace",
      }}>
        <span style={{ color: t.textDim, fontSize: 12 }}>Koordinat relatif terhadap {b.name}:</span>
        <div style={{ fontSize: 20, color: t.accentWarm, fontWeight: 700, marginTop: 4 }}>
          {b.label}
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>
          (2,2) = {b.coord[0]}·({b.v1.join(",")}) + {b.coord[1]}·({b.v2.join(",")})
        </div>
      </div>
    </div>
  );
}

function TransformSection({ t }) {
  const [step, setStep] = useState(0);
  const w = 340, h = 240, cx = w / 2, cy = h / 2, sc = 35;
  const rawPt = [2, 2];
  const transformed = [2, 0];
  const interpFactor = step === 0 ? 0 : step === 1 ? 0.5 : 1;
  const curPt = [
    rawPt[0] + (transformed[0] - rawPt[0]) * interpFactor,
    rawPt[1] + (transformed[1] - rawPt[1]) * interpFactor,
  ];

  return (
    <div>
      <SectionTitle t={t} icon="🔄" title="Transformasi Linier" />

      <div style={{ background: t.bgAccent, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${t.borderAccent}` }}>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
          Mengubah koordinat dari satu basis ke basis lain = <b style={{ color: t.accent }}>transformasi linier</b>.
          <br />Bisa dinyatakan sebagai <b style={{ color: t.accent2 }}>perkalian matriks</b>: T(u) = [T]·u
        </div>
      </div>

      {/* Transformation matrix visual */}
      <div style={{
        background: t.bgCard, borderRadius: 12, padding: 16, textAlign: "center",
        border: `1px solid ${t.border}`, marginBottom: 16, fontFamily: "'Fira Code', monospace",
      }}>
        <div style={{ fontSize: 12, color: t.textDim, marginBottom: 8 }}>Dari B1 standar ke B2 = {"{"} (1,1), (1,-1) {"}"}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 15, color: t.text, flexWrap: "wrap" }}>
          <span style={{ color: t.textDim }}>[T] =</span>
          <div style={{ display: "inline-grid", gridTemplateColumns: "1fr 1fr", gap: "2px 12px", padding: "6px 14px", border: `2px solid ${t.accent}40`, borderRadius: 6 }}>
            <span style={{ color: t.accent }}>0.5</span><span style={{ color: t.accent3 }}>0.5</span>
            <span style={{ color: t.accent }}>0.5</span><span style={{ color: t.danger }}>-0.5</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: t.textDim, marginTop: 10 }}>
          Cara cari [T]: gabung vektor basis → matriks, lalu <b style={{ color: t.accentWarm }}>inverskan</b>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["Awal (2,2)", "Transisi", "Hasil (2,0)"].map((label, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: "6px 4px", borderRadius: 6,
            border: `1px solid ${step === i ? t.accentWarm : t.border}`,
            background: step === i ? t.accentWarm + "20" : t.bgCard,
            color: step === i ? t.accentWarm : t.textMuted,
            cursor: "pointer", fontSize: 11, fontWeight: 600,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={w} height={h} style={{ background: t.bgCard, borderRadius: 12, border: `1px solid ${t.border}` }}>
          <CoordGrid w={w} h={h} t={t} cx={cx} cy={cy} scale={sc} />
          {step > 0 && <>
            <Arrow x1={cx} y1={cy} x2={cx + 1 * sc * 2} y2={cy - 1 * sc * 2} color={t.accent + "60"} width={1.5} dashed />
            <Arrow x1={cx} y1={cy} x2={cx + 1 * sc * 2} y2={cy + 1 * sc * 2} color={t.accent3 + "60"} width={1.5} dashed />
          </>}
          <DataPoint cx={cx + curPt[0] * sc} cy={cy - curPt[1] * sc} r={8} fill={t.accentWarm} glow={t.accentWarm} />
          <text x={cx + curPt[0] * sc + 12} y={cy - curPt[1] * sc - 10} fill={t.text} fontSize={12} fontWeight={700}>
            ({curPt[0].toFixed(1)}, {curPt[1].toFixed(1)})
          </text>
        </svg>
      </div>
    </div>
  );
}

function EigenSection({ t }) {
  const [showTransform, setShowTransform] = useState(false);
  const w = 320, h = 260, cx = w / 2, cy = h / 2, sc = 40;

  return (
    <div>
      <SectionTitle t={t} icon="⚡" title="Nilai & Vektor Eigen" />

      <div style={{
        background: t.bgCard, borderRadius: 12, padding: 20, textAlign: "center",
        border: `2px solid ${t.accent}30`, marginBottom: 16,
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: t.accent, fontFamily: "'Fira Code', monospace", letterSpacing: 2 }}>
          Av = λv
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: t.textMuted, lineHeight: 1.8 }}>
          <b style={{ color: t.accentWarm }}>v</b> = vektor eigen (arah yang <b>tidak berubah</b> setelah transformasi)
          <br /><b style={{ color: t.accent2 }}>λ</b> = nilai eigen (faktor penskalaan)
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { title: "Properti 1", desc: "Hanya untuk matriks persegi (n×n)", color: t.accent },
          { title: "Properti 2", desc: "Maks punya n nilai eigen", color: t.accent2 },
          { title: "Properti 3", desc: "Eigenvectors dari λ berbeda → bebas linier", color: t.accent3 },
          { title: "Simetri", desc: "Jika A simetri → eigenvectors saling orthogonal", color: t.accentWarm },
        ].map((p, i) => (
          <div key={i} style={{
            background: p.color + "10", borderRadius: 8, padding: 10,
            border: `1px solid ${p.color}25`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: p.color, marginBottom: 3 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <button onClick={() => setShowTransform(!showTransform)} style={{
        width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${t.accent}40`,
        background: t.accent + "15", color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 600,
        marginBottom: 12,
      }}>
        {showTransform ? "Sembunyikan" : "Lihat"} Visualisasi Eigenvector
      </button>

      {showTransform && (
        <div style={{ display: "flex", justifyContent: "center", animation: "fadeIn 0.3s both" }}>
          <svg width={w} height={h} style={{ background: t.bgCard, borderRadius: 12, border: `1px solid ${t.border}` }}>
            <CoordGrid w={w} h={h} t={t} cx={cx} cy={cy} scale={sc} />
            {/* Eigenvector 1 - doesn't change direction */}
            <Arrow x1={cx} y1={cy} x2={cx + 1.5 * sc} y2={cy + 1.5 * sc} color={t.accent3} width={3} />
            <Arrow x1={cx} y1={cy} x2={cx + 1.5 * sc * 0.707} y2={cy + 1.5 * sc * 0.707} color={t.accent3 + "50"} width={2} dashed />
            <text x={cx + 1.5 * sc + 5} y={cy + 1.5 * sc + 5} fill={t.accent3} fontSize={10}>eigen ✓</text>
            {/* Regular vector - changes direction */}
            <Arrow x1={cx} y1={cy} x2={cx + 2 * sc} y2={cy - 2 * sc} color={t.danger} width={2} />
            <Arrow x1={cx} y1={cy} x2={cx + 2 * sc} y2={cy} color={t.danger + "50"} width={2} dashed />
            <text x={cx + 2 * sc + 5} y={cy - 2 * sc - 5} fill={t.danger} fontSize={10}>arah berubah ✗</text>
            <text x={10} y={20} fill={t.textDim} fontSize={10}>— asli  --- setelah transformasi</text>
          </svg>
        </div>
      )}
    </div>
  );
}

function DiagonalSection({ t }) {
  return (
    <div>
      <SectionTitle t={t} icon="🔲" title="Diagonalisasi Matriks" />

      <div style={{ background: t.bgAccent, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${t.borderAccent}` }}>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
          <b style={{ color: t.accent }}>Tujuan:</b> Ubah matriks kovarian menjadi matriks diagonal (kovarian antar-fitur = 0).
          <br />Ini artinya fitur-fitur baru <b style={{ color: t.accent3 }}>tidak saling berkorelasi!</b>
        </div>
      </div>

      {/* The key equation */}
      <div style={{
        background: t.bgCard, borderRadius: 16, padding: 24, textAlign: "center",
        border: `2px solid ${t.accent2}30`, marginBottom: 20,
      }}>
        <div style={{ fontSize: 12, color: t.textDim, marginBottom: 10 }}>Persamaan kunci diagonalisasi:</div>
        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Fira Code', monospace", color: t.accent2 }}>
          D = P⁻¹CP
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
          {[
            { sym: "C", desc: "Matriks kovarian awal", color: t.accent },
            { sym: "P", desc: "Matriks eigenvectors", color: t.accent3 },
            { sym: "D", desc: "Matriks diagonal (eigenvalues)", color: t.accentWarm },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: item.color, fontFamily: "'Fira Code', monospace" }}>{item.sym}</div>
              <div style={{ fontSize: 11, color: t.textMuted, maxWidth: 100 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual transformation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        {/* Before */}
        <div style={{ background: t.bgCard, borderRadius: 10, padding: 12, border: `1px solid ${t.danger}30`, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: t.danger, fontWeight: 600, marginBottom: 6 }}>SEBELUM</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, fontFamily: "'Fira Code', monospace", fontSize: 11 }}>
            {[
              [t.accentWarm, t.danger, t.danger],
              [t.danger, t.accentWarm, t.danger],
              [t.danger, t.danger, t.accentWarm],
            ].map((row, i) => row.map((c, j) => (
              <div key={`${i}${j}`} style={{
                width: 36, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                background: c + "20", borderRadius: 4, color: c, fontWeight: i === j ? 700 : 400,
              }}>
                {i === j ? "var" : "cov"}
              </div>
            )))}
          </div>
          <div style={{ fontSize: 10, color: t.textDim, marginTop: 4 }}>ada korelasi</div>
        </div>

        <svg width={50} height={30}><Arrow x1={5} y1={15} x2={45} y2={15} color={t.accent2} width={2.5} /></svg>

        {/* After */}
        <div style={{ background: t.bgCard, borderRadius: 10, padding: 12, border: `1px solid ${t.accent3}30`, textAlign: "center" }}>
          <div style={{ fontSize: 10, color: t.accent3, fontWeight: 600, marginBottom: 6 }}>SESUDAH</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, fontFamily: "'Fira Code', monospace", fontSize: 11 }}>
            {[0, 1, 2].map(i => [0, 1, 2].map(j => (
              <div key={`${i}${j}`} style={{
                width: 36, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                background: i === j ? t.accent3 + "20" : "transparent",
                borderRadius: 4, color: i === j ? t.accent3 : t.textDim,
                fontWeight: i === j ? 700 : 400,
              }}>
                {i === j ? "λ" + (i + 1) : "0"}
              </div>
            )))}
          </div>
          <div style={{ fontSize: 10, color: t.textDim, marginTop: 4 }}>independen!</div>
        </div>
      </div>
    </div>
  );
}

function PCAStepsSection({ t }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      num: 1, title: "Standarisasi",
      desc: "Kurangi setiap nilai dengan mean kolomnya → mean jadi 0",
      detail: "DataAdjust = Data − mean",
      visual: "standardize",
    },
    {
      num: 2, title: "Hitung Kovarian",
      desc: "Hitung matriks kovarian dari data yang sudah distandarisasi",
      detail: "Matriks berukuran n×n (n = jumlah fitur)",
      visual: "covariance",
    },
    {
      num: 3, title: "Cari Eigen",
      desc: "Hitung eigenvalue & eigenvector dari matriks kovarian",
      detail: "Eigenvectors = arah principal components",
      visual: "eigen",
    },
    {
      num: 4, title: "Urutkan Eigen",
      desc: "Urutkan eigenvalue dari terbesar ke terkecil",
      detail: "Eigenvalue terbesar = PC paling penting",
      visual: "sort",
    },
    {
      num: 5, title: "Transformasi",
      desc: "Kalikan data dengan matriks transformasi [T]",
      detail: "x' = [T] · x → fitur baru!",
      visual: "transform",
    },
  ];

  const exampleData = {
    original: [[2.5, 2.4], [0.5, 0.7], [2.2, 2.9], [1.9, 2.2], [3.1, 3.0]],
    adjusted: [[0.69, 0.49], [-1.31, -1.21], [0.39, 0.99], [0.09, 0.29], [1.29, 1.09]],
    transformed: [[-0.828, -0.175], [1.778, 0.143], [-0.992, 0.384], [-0.274, 0.130], [-1.676, -0.209]],
  };

  const s = steps[activeStep];
  const w = 300, h = 220, cxV = w / 2, cyV = h / 2, scV = 45;

  const getPoints = () => {
    if (activeStep === 0) return exampleData.adjusted;
    if (activeStep <= 3) return exampleData.adjusted;
    return exampleData.transformed;
  };

  return (
    <div>
      <SectionTitle t={t} icon="🧬" title="5 Langkah PCA" />

      {/* Step selector */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {steps.map((step, i) => (
          <button key={i} onClick={() => setActiveStep(i)} style={{
            flex: 1, padding: "10px 2px", borderRadius: 8,
            border: `2px solid ${activeStep === i ? t.accent : t.border}`,
            background: activeStep === i ? t.accent + "18" : t.bgCard,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: activeStep === i ? t.accent : t.textDim }}>{step.num}</div>
            <div style={{ fontSize: 9, color: activeStep === i ? t.accent : t.textDim, fontWeight: 600, marginTop: 2 }}>{step.title}</div>
          </button>
        ))}
      </div>

      {/* Step content */}
      <div key={activeStep} style={{
        background: t.bgCard, borderRadius: 14, padding: 20,
        border: `1px solid ${t.accent}20`, animation: "fadeIn 0.3s both",
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 6 }}>
          Step {s.num}: {s.title}
        </div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 10 }}>{s.desc}</div>
        <div style={{
          background: t.accent + "10", borderRadius: 8, padding: 10, fontFamily: "'Fira Code', monospace",
          fontSize: 14, color: t.accent, textAlign: "center", marginBottom: 16,
        }}>
          {s.detail}
        </div>

        {/* Interactive scatter */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={w} height={h} style={{ borderRadius: 10, background: t.bgSurface }}>
            <CoordGrid w={w} h={h} t={t} cx={cxV} cy={cyV} scale={scV} showGrid />
            {activeStep >= 2 && activeStep <= 4 && <>
              <Arrow x1={cxV} y1={cyV} x2={cxV + (-0.678) * scV * 2.5} y2={cyV - (-0.735) * scV * 2.5} color={t.accent3 + "80"} width={2} />
              <Arrow x1={cxV} y1={cyV} x2={cxV + (-0.735) * scV * 2.5} y2={cyV - (0.678) * scV * 2.5} color={t.danger + "60"} width={2} />
            </>}
            {getPoints().map((p, i) => (
              <DataPoint key={i} cx={cxV + p[0] * scV} cy={cyV - p[1] * scV}
                r={5} fill={activeStep >= 4 ? t.accent2 : t.accentWarm} delay={i * 0.05} />
            ))}
            {activeStep >= 2 && activeStep < 4 && (
              <text x={10} y={15} fill={t.textDim} fontSize={9}>
                <tspan fill={t.accent3}>— PC1 (λ=1.284)</tspan>
                {"  "}
                <tspan fill={t.danger}>— PC2 (λ=0.049)</tspan>
              </text>
            )}
          </svg>
        </div>

        {/* Data table */}
        {activeStep === 0 && (
          <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "center", fontSize: 11, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: t.textDim, fontWeight: 600, marginBottom: 4, textAlign: "center" }}>Original</div>
              {exampleData.original.map((d, i) => (
                <div key={i} style={{ color: t.textMuted, fontFamily: "'Fira Code', monospace" }}>({d.join(", ")})</div>
              ))}
            </div>
            <div style={{ color: t.accent, fontSize: 20, alignSelf: "center" }}>→</div>
            <div>
              <div style={{ color: t.accent, fontWeight: 600, marginBottom: 4, textAlign: "center" }}>Adjusted</div>
              {exampleData.adjusted.map((d, i) => (
                <div key={i} style={{ color: t.accent, fontFamily: "'Fira Code', monospace" }}>({d.join(", ")})</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VarianceSection({ t }) {
  const eigenvalues = [1.284, 0.049];
  const total = eigenvalues.reduce((a, b) => a + b, 0);
  const explained = eigenvalues.map(v => v / total);
  const cumulative = explained.reduce((acc, v) => [...acc, (acc.length ? acc[acc.length - 1] : 0) + v], []);

  // Multi-component example
  const multiEigen = [4.2, 1.8, 0.6, 0.3, 0.15, 0.08, 0.05, 0.02];
  const multiTotal = multiEigen.reduce((a, b) => a + b, 0);
  const multiExplained = multiEigen.map(v => v / multiTotal);
  const multiCum = multiExplained.reduce((acc, v) => [...acc, (acc.length ? acc[acc.length - 1] : 0) + v], []);

  const barW = 320, barH = 180, barPad = 40;

  return (
    <div>
      <SectionTitle t={t} icon="📈" title="Explained Variance" />

      <div style={{ background: t.bgAccent, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${t.borderAccent}` }}>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
          <b style={{ color: t.accent }}>Berapa PC yang harus dipilih?</b> Lihat explained variance!
          <br />Pilih sejumlah PC yang kumulatifnya mencapai ~90-95%.
        </div>
      </div>

      {/* Formula */}
      <div style={{
        background: t.bgCard, borderRadius: 12, padding: 16, textAlign: "center",
        border: `1px solid ${t.border}`, marginBottom: 20, fontFamily: "'Fira Code', monospace",
      }}>
        <div style={{ fontSize: 12, color: t.textDim, marginBottom: 6 }}>Explained Variance Ratio PC ke-k:</div>
        <div style={{ fontSize: 18, color: t.accentWarm }}>
          EV<sub>k</sub> = λ<sub>k</sub> / (λ₁ + λ₂ + ... + λ<sub>n</sub>)
        </div>
      </div>

      {/* Simple example */}
      <div style={{ background: t.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${t.border}`, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 10 }}>Contoh (2D data):</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {eigenvalues.map((ev, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                background: `conic-gradient(${i === 0 ? t.accent : t.accent2} ${explained[i] * 360}deg, ${t.border} 0deg)`,
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%", background: t.bgCard,
                  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: i === 0 ? t.accent : t.accent2 }}>
                    {(explained[i] * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 6 }}>PC{i + 1}</div>
              <div style={{ fontSize: 11, color: t.textDim }}>λ = {ev.toFixed(3)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-component bar chart */}
      <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>Contoh dataset 8 dimensi:</div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={barW} height={barH} style={{ overflow: "visible" }}>
          {multiExplained.map((v, i) => {
            const barWidth = (barW - barPad * 2) / multiEigen.length - 4;
            const x = barPad + i * (barWidth + 4);
            const maxH = barH - 50;
            const bh = v * maxH / multiExplained[0] * 0.8;
            return (
              <g key={i}>
                <rect x={x} y={barH - 30 - bh} width={barWidth} height={bh} rx={3}
                  fill={i < 3 ? t.accent : t.textDim + "40"}
                  style={{ animation: `fadeIn 0.5s ${i * 0.08}s both` }} />
                <text x={x + barWidth / 2} y={barH - 30 - bh - 5} textAnchor="middle"
                  fill={t.textMuted} fontSize={9}>{(v * 100).toFixed(0)}%</text>
                <text x={x + barWidth / 2} y={barH - 15} textAnchor="middle"
                  fill={t.textDim} fontSize={9}>PC{i + 1}</text>
              </g>
            );
          })}
          {/* Cumulative line */}
          {multiCum.map((v, i) => {
            const barWidth = (barW - barPad * 2) / multiEigen.length - 4;
            const x = barPad + i * (barWidth + 4) + barWidth / 2;
            const y = barH - 30 - v * (barH - 50);
            const nextI = i + 1;
            if (nextI >= multiCum.length) return null;
            const nx = barPad + nextI * (barWidth + 4) + barWidth / 2;
            const ny = barH - 30 - multiCum[nextI] * (barH - 50);
            return (
              <g key={`line${i}`}>
                <line x1={x} y1={y} x2={nx} y2={ny} stroke={t.accentWarm} strokeWidth={2} />
                <circle cx={x} cy={y} r={3} fill={t.accentWarm} />
                {(i === 0 || i === 2) && (
                  <text x={x} y={y - 8} textAnchor="middle" fill={t.accentWarm} fontSize={9}>
                    {(v * 100).toFixed(0)}%
                  </text>
                )}
              </g>
            );
          })}
          {/* Last cum dot */}
          <circle cx={barPad + (multiEigen.length - 1) * ((barW - barPad * 2) / multiEigen.length)} cy={barH - 30 - (barH - 50)} r={3} fill={t.accentWarm} />
          
          {/* 90% threshold line */}
          <line x1={barPad} y1={barH - 30 - 0.9 * (barH - 50)} x2={barW - barPad}
            y2={barH - 30 - 0.9 * (barH - 50)} stroke={t.danger} strokeWidth={1} strokeDasharray="4 3" />
          <text x={barW - barPad + 3} y={barH - 30 - 0.9 * (barH - 50) + 4} fill={t.danger} fontSize={9}>90%</text>
        </svg>
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: t.textMuted, marginTop: 8 }}>
        <span style={{ color: t.accent }}>■</span> Individual &nbsp;
        <span style={{ color: t.accentWarm }}>●</span> Kumulatif &nbsp;
        <span style={{ color: t.danger }}>- -</span> Threshold 90%
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: t.accent3, marginTop: 6, fontWeight: 600 }}>
        → Pilih 3 PC pertama sudah cukup! (91% variance explained)
      </div>
    </div>
  );
}

function ApplicationSection({ t }) {
  return (
    <div>
      <SectionTitle t={t} icon="🎭" title="Aplikasi: Face Recognition" />

      <div style={{ background: t.bgAccent, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${t.borderAccent}` }}>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
          PCA dipakai untuk <b style={{ color: t.accent }}>eigenfaces</b> — representasi wajah menggunakan komponen utama.
          Dataset LFW: gambar 50×37 pixel = <b style={{ color: t.accentWarm }}>1850 dimensi per gambar!</b>
        </div>
      </div>

      {/* Dimension reduction visual */}
      <div style={{
        background: t.bgCard, borderRadius: 14, padding: 20, textAlign: "center",
        border: `1px solid ${t.border}`, marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {/* Original */}
          <div>
            <div style={{
              width: 70, height: 80, borderRadius: 8, background: `linear-gradient(135deg, ${t.textDim}40, ${t.textDim}20)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
              border: `1px solid ${t.border}`,
            }}>🧑</div>
            <div style={{ fontSize: 11, color: t.danger, fontWeight: 700, marginTop: 6 }}>1850 dim</div>
            <div style={{ fontSize: 9, color: t.textDim }}>50 × 37 px</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg width={60} height={24}><Arrow x1={5} y1={12} x2={55} y2={12} color={t.accent2} width={2.5} /></svg>
            <div style={{ fontSize: 10, color: t.accent2, fontWeight: 600 }}>PCA</div>
          </div>

          {/* Reduced */}
          <div>
            <div style={{
              width: 30, height: 80, borderRadius: 8, background: `linear-gradient(135deg, ${t.accent3}40, ${t.accent3}20)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              border: `1px solid ${t.accent3}30`,
            }}>📊</div>
            <div style={{ fontSize: 11, color: t.accent3, fontWeight: 700, marginTop: 6 }}>150 dim</div>
            <div style={{ fontSize: 9, color: t.textDim }}>hanya 8.1%</div>
          </div>
        </div>
        <div style={{ fontSize: 20, color: t.accentWarm, fontWeight: 800, marginTop: 16 }}>
          95.5% informasi tetap terjaga!
        </div>
      </div>

      {/* Eigenface concept */}
      <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 10 }}>Cara kerja Eigenfaces:</div>
      <div style={{
        background: t.bgCard, borderRadius: 12, padding: 16, border: `1px solid ${t.border}`,
        fontFamily: "'Fira Code', monospace", textAlign: "center", fontSize: 14, color: t.text,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          <span>🧑 = c₀·</span>
          <div style={{ width: 32, height: 36, borderRadius: 4, background: t.accent + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>E₀</div>
          <span>+ c₁·</span>
          <div style={{ width: 32, height: 36, borderRadius: 4, background: t.accent2 + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>E₁</div>
          <span>+ ... + c₁₄₉·</span>
          <div style={{ width: 32, height: 36, borderRadius: 4, background: t.textDim + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>E₁₄₉</div>
        </div>
        <div style={{ fontSize: 11, color: t.textMuted, marginTop: 10, fontFamily: "inherit" }}>
          Setiap wajah = kombinasi linear dari 150 eigenfaces (basis baru)
        </div>
      </div>

      {/* Key insight */}
      <div style={{
        marginTop: 16, background: `linear-gradient(135deg, ${t.accent}10, ${t.accent2}10)`,
        borderRadius: 12, padding: 16, border: `1px solid ${t.accent}20`,
      }}>
        <div style={{ fontSize: 13, color: t.text, fontWeight: 600, marginBottom: 6 }}>Insight Penting:</div>
        <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.7 }}>
          Eigenface pertama menangkap fitur umum (pencahayaan, bentuk wajah). Eigenface terakhir menangkap noise/detail kecil.
          Dengan membuang eigenface terakhir, kita mengurangi noise sekaligus menghemat memori & komputasi.
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ t, icon, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: 0, letterSpacing: -0.5 }}>{title}</h2>
    </div>
  );
}

// ═══════════ MAIN APP ═══════════
export default function PCAVisualization() {
  const [theme, setTheme] = useState("light");
  const [activeSection, setActiveSection] = useState("intro");
  const t = THEMES[theme];

  const renderSection = () => {
    switch (activeSection) {
      case "intro": return <IntroSection t={t} />;
      case "covariance": return <CovarianceSection t={t} />;
      case "basis": return <BasisSection t={t} />;
      case "transform": return <TransformSection t={t} />;
      case "eigen": return <EigenSection t={t} />;
      case "diagonal": return <DiagonalSection t={t} />;
      case "pca-steps": return <PCAStepsSection t={t} />;
      case "variance": return <VarianceSection t={t} />;
      case "app": return <ApplicationSection t={t} />;
      default: return null;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: t.bg, color: t.text,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: "all 0.3s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes growUp { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); } }
        * { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: ${t.textDim}40; border-radius: 4px; }
        button { font-family: inherit; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        padding: "20px 16px 12px", borderBottom: `1px solid ${t.border}`,
        background: t.bgSurface, position: "sticky", top: 0, zIndex: 10,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: t.accent, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
                Materi 06 — KASDaD
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: t.text, marginTop: 2, letterSpacing: -0.5 }}>
                Reduksi Dimensi & PCA
              </div>
            </div>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
              width: 40, height: 40, borderRadius: 10, border: `1px solid ${t.border}`,
              background: t.bgCard, cursor: "pointer", fontSize: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Nav */}
          <div style={{
            display: "flex", gap: 2, overflowX: "auto", paddingBottom: 4,
            scrollbarWidth: "none", msOverflowStyle: "none",
          }}>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                padding: "6px 10px", borderRadius: 8, border: "none",
                background: activeSection === s.id ? t.accent + "20" : "transparent",
                color: activeSection === s.id ? t.accent : t.textDim,
                cursor: "pointer", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px 80px" }}>
        <div key={activeSection} style={{ animation: "fadeIn 0.3s both" }}>
          {renderSection()}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, gap: 8 }}>
          {SECTIONS.findIndex(s => s.id === activeSection) > 0 ? (
            <button onClick={() => {
              const idx = SECTIONS.findIndex(s => s.id === activeSection);
              if (idx > 0) setActiveSection(SECTIONS[idx - 1].id);
            }} style={{
              flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${t.border}`,
              background: t.bgCard, color: t.textMuted, cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>
              ← {SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) - 1]?.label}
            </button>
          ) : <div style={{ flex: 1 }} />}
          {SECTIONS.findIndex(s => s.id === activeSection) < SECTIONS.length - 1 ? (
            <button onClick={() => {
              const idx = SECTIONS.findIndex(s => s.id === activeSection);
              if (idx < SECTIONS.length - 1) setActiveSection(SECTIONS[idx + 1].id);
            }} style={{
              flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${t.accent}40`,
              background: t.accent + "15", color: t.accent, cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>
              {SECTIONS[SECTIONS.findIndex(s => s.id === activeSection) + 1]?.label} →
            </button>
          ) : <div style={{ flex: 1 }} />}
        </div>
      </div>
    </div>
  );
}
