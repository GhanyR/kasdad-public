import { useState, useEffect, useCallback, useMemo } from "react";

const THEMES = {
  dark: {
    bg: "#0a0a0c", bgCard: "#111114", bgCardHover: "#16161a", bgSurface: "#0e0e11",
    text: "#e4e4e7", textMuted: "#71717a", textDim: "#52525b",
    accent: "#e8b931", accentSoft: "#e8b93118", accentBorder: "#e8b93130",
    green: "#4ade80", red: "#f87171", blue: "#60a5fa", purple: "#a78bfa", pink: "#f472b6", orange: "#fb923c", cyan: "#22d3ee",
    border: "#1e1e22", borderSoft: "#18181b",
    codeBg: "#0c0c0e",
  },
  light: {
    bg: "#f8f7f4", bgCard: "#ffffff", bgCardHover: "#fafaf8", bgSurface: "#f0efe8",
    text: "#1a1a1e", textMuted: "#6b7280", textDim: "#9ca3af",
    accent: "#b8860b", accentSoft: "#b8860b12", accentBorder: "#b8860b30",
    green: "#16a34a", red: "#dc2626", blue: "#2563eb", purple: "#7c3aed", pink: "#db2777", orange: "#ea580c", cyan: "#0891b2",
    border: "#e5e2d9", borderSoft: "#ebe8df",
    codeBg: "#f5f4ef",
  },
};

const ease = "cubic-bezier(0.22, 1, 0.36, 1)";

// ══════════════════════════════════════════
//  SECTIONS DATA
// ══════════════════════════════════════════
const SECTIONS = [
  { id: "overview", title: "Apa itu KNN?", icon: "🎯", sub: "Instance-based Learning" },
  { id: "distance", title: "Distance Metrics", icon: "📏", sub: "4 Cara Ukur Jarak" },
  { id: "classification", title: "KNN Classification", icon: "🏷️", sub: "Majority Voting" },
  { id: "regression", title: "KNN Regression", icon: "📈", sub: "Average Neighbors" },
  { id: "normalization", title: "Normalisasi Data", icon: "⚖️", sub: "Kenapa Penting?" },
  { id: "encoding", title: "Feature Encoding", icon: "🔤", sub: "Label vs One-Hot" },
  { id: "choosing_k", title: "Memilih K", icon: "🔢", sub: "Bias-Variance" },
  { id: "exercise", title: "Latihan Soal", icon: "✏️", sub: "Step-by-Step" },
  { id: "proscons", title: "Analisis KNN", icon: "⚡", sub: "Kelebihan & Kelemahan" },
];

// ══════════════════════════════════════════
//  COMPONENTS
// ══════════════════════════════════════════

function FormulaBox({ t, formula, explanation, color }) {
  return (
    <div style={{
      background: t.codeBg, border: `1px solid ${color || t.accent}30`,
      borderRadius: 14, padding: "18px 22px", marginBottom: 12,
      borderLeft: `3px solid ${color || t.accent}`,
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, color: color || t.accent,
        letterSpacing: 0.5, marginBottom: explanation ? 8 : 0, textAlign: "center",
        lineHeight: 1.6,
      }}>{formula}</div>
      {explanation && (
        <div style={{
          fontFamily: "'Nunito', sans-serif", fontSize: 13, color: t.textMuted,
          textAlign: "center", lineHeight: 1.6,
        }}>{explanation}</div>
      )}
    </div>
  );
}

function VisualCard({ t, children, title, accent, style: s }) {
  return (
    <div style={{
      background: t.bgCard, border: `1px solid ${t.border}`,
      borderRadius: 18, overflow: "hidden", ...s,
    }}>
      {title && (
        <div style={{
          padding: "14px 20px", borderBottom: `1px solid ${t.border}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: accent || t.accent,
          }} />
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600,
            color: accent || t.accent, letterSpacing: 0.5,
          }}>{title}</span>
        </div>
      )}
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

function Chip({ t, label, color, filled }) {
  return (
    <span style={{
      display: "inline-block", padding: "4px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
      background: filled ? color : `${color}15`,
      color: filled ? "#fff" : color,
      border: `1px solid ${color}30`,
      letterSpacing: 0.3,
    }}>{label}</span>
  );
}

// ══════════════════════════════════════════
//  SECTION: OVERVIEW
// ══════════════════════════════════════════
function SectionOverview({ t }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { label: "Simpan Data Training", desc: "KNN tidak \"belajar\" model. Semua data training disimpan apa adanya.", icon: "💾" },
    { label: "Data Baru Masuk", desc: "Saat ada data baru yang perlu diprediksi, baru proses dimulai.", icon: "🆕" },
    { label: "Hitung Jarak", desc: "Hitung jarak data baru ke SEMUA data training.", icon: "📏" },
    { label: "Pilih K Terdekat", desc: "Ambil K data training yang paling dekat (nearest neighbors).", icon: "🎯" },
    { label: "Voting / Rata-rata", desc: "Classification → mayoritas vote. Regression → rata-rata nilai.", icon: "🗳️" },
  ];

  return (
    <div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24,
      }}>
        <VisualCard t={t} title="LAZY LEARNING" accent={t.orange}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>😴</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: t.text, fontWeight: 700 }}>
              "Males belajar dulu, nanti aja kalau ditanya"
            </div>
          </div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
            KNN tidak membuat model saat training. Ia hanya <span style={{ color: t.orange, fontWeight: 700 }}>menyimpan semua data</span>. 
            Proses prediksi baru terjadi saat ada data test masuk. Makanya disebut <span style={{ color: t.orange, fontWeight: 700 }}>instance-based learning</span>.
          </div>
        </VisualCard>

        <VisualCard t={t} title="EAGER LEARNING (pembanding)" accent={t.blue}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📚</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: t.text, fontWeight: 700 }}>
              "Belajar dulu baru jawab soal"
            </div>
          </div>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
            Decision Tree, Random Forest membangun model saat training. 
            Training <span style={{ color: t.blue, fontWeight: 700 }}>lambat</span>, tapi prediksi <span style={{ color: t.blue, fontWeight: 700 }}>cepat</span>. 
            Kebalikan dari KNN yang training cepat tapi prediksi lambat.
          </div>
        </VisualCard>
      </div>

      {/* Step by step flow */}
      <VisualCard t={t} title="CARA KERJA KNN — STEP BY STEP">
        <div style={{ display: "flex", gap: 0, marginBottom: 20, justifyContent: "center" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => setActiveStep(i)} style={{
                width: 48, height: 48, borderRadius: "50%",
                border: `2px solid ${activeStep === i ? t.accent : t.border}`,
                background: activeStep === i ? `${t.accent}20` : t.bgSurface,
                cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
                transition: `all 0.3s ${ease}`,
                transform: activeStep === i ? "scale(1.15)" : "scale(1)",
              }}>{s.icon}</button>
              {i < steps.length - 1 && (
                <div style={{
                  width: 40, height: 2,
                  background: i < activeStep ? t.accent : t.border,
                  transition: `background 0.3s ${ease}`,
                }} />
              )}
            </div>
          ))}
        </div>
        <div style={{
          background: t.bgSurface, borderRadius: 14, padding: "20px 24px",
          border: `1px solid ${t.border}`, textAlign: "center",
          minHeight: 80,
          transition: `all 0.3s ${ease}`,
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700,
            color: t.accent, marginBottom: 8,
          }}>Step {activeStep + 1}: {steps[activeStep].label}</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif", fontSize: 14, color: t.textMuted, lineHeight: 1.7,
          }}>{steps[activeStep].desc}</div>
        </div>
      </VisualCard>
    </div>
  );
}

// ══════════════════════════════════════════
//  SECTION: DISTANCE METRICS
// ══════════════════════════════════════════
function SectionDistance({ t }) {
  const [activeMetric, setActiveMetric] = useState("euclidean");

  const metrics = {
    euclidean: {
      name: "Euclidean Distance", color: t.blue,
      formula: "D(p,q) = √( Σ(pₖ - qₖ)² )",
      analogy: "Jarak garis lurus antara 2 titik. Bayangkan burung terbang langsung dari A ke B.",
      example: "p(1,2,3), q(4,5,6)\nD = √((1-4)² + (2-5)² + (3-6)²)\n  = √(9 + 9 + 9) = √27 ≈ 5.196",
      when: "Fitur numerik kontinu, skala seragam",
    },
    manhattan: {
      name: "Manhattan Distance", color: t.orange,
      formula: "d(p,q) = Σ|pᵢ - qᵢ|",
      analogy: "Jarak \"jalanan kota\" — hanya bisa jalan lurus horizontal/vertikal. Seperti navigasi di grid kota Manhattan, NY.",
      example: "p(1,2,3), q(4,5,6)\nd = |1-4| + |2-5| + |3-6|\n  = 3 + 3 + 3 = 9",
      when: "Data grid-like, fitur independen",
    },
    cosine: {
      name: "Cosine Similarity", color: t.purple,
      formula: "cos(p,q) = (p·q) / (‖p‖ × ‖q‖)",
      analogy: "Mengukur sudut antara 2 vektor. Tidak peduli panjang vektor, hanya arahnya. Cocok untuk teks & dokumen.",
      example: "p(1,2,3), q(4,5,6)\ncos = (1×4 + 2×5 + 3×6) / (√14 × √77)\n    = 32 / 32.83 ≈ 0.975",
      when: "Text similarity, dokumen, rekomendasi",
    },
    jaccard: {
      name: "Jaccard Similarity", color: t.green,
      formula: "J(p,q) = |p ∩ q| / |p ∪ q|",
      analogy: "Persentase kecocokan antara 2 himpunan. \"Berapa banyak yang sama dibanding total semua?\"",
      example: "C1 = {item2, item6, item9}\nC3 = {item1, item2, item6}\nJ = |{item2,item6}| / |{item1,item2,item6,item9}|\n  = 2/4 = 0.5",
      when: "Data biner (beli/tidak), set membership",
    },
  };

  const m = metrics[activeMetric];

  return (
    <div>
      {/* Metric selector */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20,
      }}>
        {Object.entries(metrics).map(([key, val]) => (
          <button key={key} onClick={() => setActiveMetric(key)} style={{
            padding: "14px 12px", borderRadius: 14, border: `1.5px solid ${activeMetric === key ? val.color : t.border}`,
            background: activeMetric === key ? `${val.color}12` : t.bgCard,
            cursor: "pointer", transition: `all 0.3s ${ease}`,
            transform: activeMetric === key ? "scale(1.03)" : "scale(1)",
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700,
              color: activeMetric === key ? val.color : t.textMuted,
              letterSpacing: 0.3,
            }}>{val.name}</div>
          </button>
        ))}
      </div>

      {/* Detail */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
      }}>
        <div>
          <FormulaBox t={t} formula={m.formula} color={m.color} />
          
          <VisualCard t={t} title="ANALOGI" accent={m.color}>
            <div style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 14, color: t.text, lineHeight: 1.8,
            }}>{m.analogy}</div>
          </VisualCard>

          <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 12, background: `${m.color}08`, border: `1px solid ${m.color}20` }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: 1, marginBottom: 4 }}>KAPAN PAKAI?</div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: t.textMuted }}>{m.when}</div>
          </div>
        </div>

        <VisualCard t={t} title="CONTOH PERHITUNGAN" accent={m.color}>
          <pre style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: t.text,
            lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0,
            background: t.codeBg, padding: 16, borderRadius: 10,
          }}>{m.example}</pre>
        </VisualCard>
      </div>

      {/* Visual comparison */}
      <div style={{ marginTop: 20 }}>
        <VisualCard t={t} title="PERBANDINGAN VISUAL JARAK">
          <svg viewBox="0 0 600 220" style={{ width: "100%", height: "auto" }}>
            {/* Grid */}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`vg${i}`} x1={80 + i * 80} y1={20} x2={80 + i * 80} y2={200} stroke={t.border} strokeWidth={0.5} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`hg${i}`} x1={60} y1={20 + i * 45} x2={560} y2={20 + i * 45} stroke={t.border} strokeWidth={0.5} />
            ))}

            {/* Euclidean — straight line */}
            <line x1={120} y1={170} x2={440} y2={40} stroke={t.blue} strokeWidth={2.5} strokeDasharray={activeMetric === "euclidean" ? "none" : "6 4"} opacity={activeMetric === "euclidean" ? 1 : 0.3} />
            
            {/* Manhattan — grid path */}
            <polyline points="120,170 440,170 440,40" fill="none" stroke={t.orange} strokeWidth={2.5} strokeDasharray={activeMetric === "manhattan" ? "none" : "6 4"} opacity={activeMetric === "manhattan" ? 1 : 0.3} />

            {/* Points */}
            <circle cx={120} cy={170} r={8} fill={t.accent} />
            <text x={120} y={195} textAnchor="middle" fill={t.textMuted} fontSize={11} fontFamily="'Space Grotesk', sans-serif">A (1,1)</text>
            
            <circle cx={440} cy={40} r={8} fill={t.pink} />
            <text x={440} y={30} textAnchor="middle" fill={t.textMuted} fontSize={11} fontFamily="'Space Grotesk', sans-serif">B (5,4)</text>

            {/* Labels */}
            <text x={280} y={90} textAnchor="middle" fill={t.blue} fontSize={12} fontWeight="bold" fontFamily="'Space Grotesk', sans-serif" opacity={activeMetric === "euclidean" ? 1 : 0.3}>
              Euclidean = √(16+9) ≈ 5
            </text>
            <text x={450} y={115} textAnchor="start" fill={t.orange} fontSize={12} fontWeight="bold" fontFamily="'Space Grotesk', sans-serif" opacity={activeMetric === "manhattan" ? 1 : 0.3}>
              Manhattan = 4+3 = 7
            </text>
          </svg>
        </VisualCard>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
//  SECTION: CLASSIFICATION
// ══════════════════════════════════════════
function SectionClassification({ t }) {
  const [kVal, setKVal] = useState(3);
  
  const data = [
    { id: 1, sr: 4, ss: 10, type: "A", dist: null },
    { id: 2, sr: 5, ss: 20, type: "A", dist: null },
    { id: 3, sr: 5, ss: 12, type: "A", dist: null },
    { id: 4, sr: 6, ss: 15, type: "B", dist: null },
    { id: 5, sr: 6, ss: 17, type: "B", dist: null },
    { id: 6, sr: 3, ss: 20, type: "C", dist: null },
    { id: 7, sr: 4, ss: 14, type: "C", dist: null },
    { id: 8, sr: 5, ss: 15, type: "C", dist: null },
    { id: 9, sr: 6, ss: 16, type: "D", dist: null },
    { id: 10, sr: 6, ss: 20, type: "D", dist: null },
    { id: 11, sr: 5, ss: 10, type: "D", dist: null },
    { id: 12, sr: 7, ss: 18, type: "D", dist: null },
  ];

  const testPoint = { sr: 5, ss: 22 };
  const typeColors = { A: t.blue, B: t.orange, C: t.green, D: t.purple };

  const withDist = data.map(d => ({
    ...d,
    dist: Math.abs(d.sr - testPoint.sr) + Math.abs(d.ss - testPoint.ss),
  })).sort((a, b) => a.dist - b.dist);

  const neighbors = withDist.slice(0, kVal);
  const votes = {};
  neighbors.forEach(n => { votes[n.type] = (votes[n.type] || 0) + 1; });
  const prediction = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <div>
      <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, color: t.textMuted, lineHeight: 1.8, marginBottom: 20 }}>
        Klasifikasi KNN menggunakan <span style={{ color: t.accent, fontWeight: 700 }}>majority voting</span> — label yang paling banyak muncul di antara K tetangga terdekat menjadi prediksi.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Scatter plot */}
        <VisualCard t={t} title="SCATTER PLOT — SALARY RANK vs SPENDING SCORE">
          <svg viewBox="0 0 320 280" style={{ width: "100%", height: "auto" }}>
            {/* Axes */}
            <line x1={40} y1={240} x2={300} y2={240} stroke={t.textDim} strokeWidth={1} />
            <line x1={40} y1={240} x2={40} y2={20} stroke={t.textDim} strokeWidth={1} />
            <text x={170} y={268} textAnchor="middle" fill={t.textMuted} fontSize={10} fontFamily="'Space Grotesk'">Salary Rank</text>
            <text x={14} y={130} textAnchor="middle" fill={t.textMuted} fontSize={10} fontFamily="'Space Grotesk'" transform="rotate(-90,14,130)">Spending</text>

            {/* Grid lines */}
            {[0, 5, 10, 15, 20, 25].map(v => (
              <g key={v}>
                <line x1={40} y1={240 - v * 8.5} x2={300} y2={240 - v * 8.5} stroke={t.border} strokeWidth={0.5} />
                <text x={34} y={244 - v * 8.5} textAnchor="end" fill={t.textDim} fontSize={8}>{v}</text>
              </g>
            ))}

            {/* Data points */}
            {data.map(d => {
              const isNeighbor = neighbors.find(n => n.id === d.id);
              return (
                <g key={d.id}>
                  {isNeighbor && <circle cx={40 + d.sr * 35} cy={240 - d.ss * 8.5} r={14} fill="none" stroke={t.accent} strokeWidth={1.5} strokeDasharray="3 2" />}
                  <circle cx={40 + d.sr * 35} cy={240 - d.ss * 8.5} r={6} fill={typeColors[d.type]} opacity={isNeighbor ? 1 : 0.5} />
                </g>
              );
            })}

            {/* Test point */}
            <circle cx={40 + testPoint.sr * 35} cy={240 - testPoint.ss * 8.5} r={8} fill="none" stroke={t.accent} strokeWidth={2} />
            <circle cx={40 + testPoint.sr * 35} cy={240 - testPoint.ss * 8.5} r={4} fill={t.accent} />
            <text x={40 + testPoint.sr * 35 + 12} y={240 - testPoint.ss * 8.5 + 4} fill={t.accent} fontSize={9} fontWeight="bold" fontFamily="'Space Grotesk'">TEST (5,22)</text>

            {/* Legend */}
            {Object.entries(typeColors).map(([type, color], i) => (
              <g key={type}>
                <circle cx={260} cy={30 + i * 18} r={5} fill={color} />
                <text x={270} y={34 + i * 18} fill={t.textMuted} fontSize={10} fontFamily="'Space Grotesk'">{type}</text>
              </g>
            ))}
          </svg>
        </VisualCard>

        {/* Results table */}
        <div>
          {/* K selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700, color: t.textMuted, display: "flex", alignItems: "center", marginRight: 4 }}>K =</div>
            {[1, 3, 5, 7].map(k => (
              <button key={k} onClick={() => setKVal(k)} style={{
                width: 40, height: 36, borderRadius: 10,
                border: `1.5px solid ${kVal === k ? t.accent : t.border}`,
                background: kVal === k ? `${t.accent}15` : t.bgCard,
                color: kVal === k ? t.accent : t.textMuted,
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 700,
                cursor: "pointer",
              }}>{k}</button>
            ))}
          </div>

          {/* Distance table */}
          <VisualCard t={t} title={`JARAK KE TEST POINT (Manhattan)`} accent={t.cyan}>
            <div style={{ maxHeight: 240, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>
                    {["ID", "SR", "SS", "Type", "Dist"].map(h => (
                      <th key={h} style={{
                        padding: "8px 6px", textAlign: "center", fontFamily: "'Space Grotesk'",
                        fontWeight: 700, color: t.textDim, fontSize: 10, letterSpacing: 1,
                        borderBottom: `1px solid ${t.border}`, position: "sticky", top: 0,
                        background: t.bgCard,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {withDist.map((d, i) => {
                    const isN = i < kVal;
                    return (
                      <tr key={d.id} style={{ background: isN ? `${t.accent}08` : "transparent" }}>
                        <td style={{ padding: "7px 6px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.text, borderBottom: `1px solid ${t.borderSoft}` }}>{d.id}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.textMuted, borderBottom: `1px solid ${t.borderSoft}` }}>{d.sr}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.textMuted, borderBottom: `1px solid ${t.borderSoft}` }}>{d.ss}</td>
                        <td style={{ padding: "7px 6px", textAlign: "center", borderBottom: `1px solid ${t.borderSoft}` }}>
                          <span style={{ color: typeColors[d.type], fontWeight: 700, fontFamily: "'Space Grotesk'" }}>{d.type}</span>
                        </td>
                        <td style={{ padding: "7px 6px", textAlign: "center", fontFamily: "'IBM Plex Mono'", fontWeight: isN ? 700 : 400, color: isN ? t.accent : t.textDim, borderBottom: `1px solid ${t.borderSoft}` }}>{d.dist}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </VisualCard>

          {/* Prediction result */}
          <div style={{
            marginTop: 12, padding: "16px 20px", borderRadius: 14,
            background: `${typeColors[prediction]}12`, border: `1.5px solid ${typeColors[prediction]}40`,
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5 }}>PREDIKSI DENGAN K={kVal}</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 800, color: typeColors[prediction], marginTop: 4 }}>
              Type {prediction}
            </div>
            <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: t.textMuted, marginTop: 6 }}>
              Votes: {Object.entries(votes).map(([type, count]) => `${type}=${count}`).join(", ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
//  SECTION: REGRESSION
// ══════════════════════════════════════════
function SectionRegression({ t }) {
  const data = [
    { id: 1, area: 100, bed: 3, bath: 2, dist: 5, price: 1500, edist: 27.00 },
    { id: 2, area: 120, bed: 4, bath: 3, dist: 10, price: 1700, edist: 7.21 },
    { id: 3, area: 80, bed: 2, bath: 1, dist: 7, price: 1200, edist: 45.81 },
    { id: 4, area: 200, bed: 5, bath: 4, dist: 3, price: 3000, edist: 75.98 },
    { id: 5, area: 150, bed: 3, bath: 2, dist: 15, price: 1800, edist: 25.08 },
    { id: 6, area: 90, bed: 2, bath: 1, dist: 12, price: 1000, edist: 35.27 },
  ];

  const sorted = [...data].sort((a, b) => a.edist - b.edist);
  const k3 = sorted.slice(0, 3);
  const avgPrice = Math.round(k3.reduce((s, d) => s + d.price, 0) / 3);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <VisualCard t={t} title="PERBEDAAN DENGAN CLASSIFICATION" accent={t.pink}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 12, background: `${t.blue}08`, border: `1px solid ${t.blue}20`, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>🏷️</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 12, fontWeight: 700, color: t.blue }}>Classification</div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.textMuted, marginTop: 4 }}>Output: <strong style={{ color: t.text }}>Label/Kategori</strong></div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 11, color: t.textDim, marginTop: 2 }}>Majority Voting</div>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: `${t.green}08`, border: `1px solid ${t.green}20`, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>📈</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 12, fontWeight: 700, color: t.green }}>Regression</div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.textMuted, marginTop: 4 }}>Output: <strong style={{ color: t.text }}>Angka Kontinu</strong></div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 11, color: t.textDim, marginTop: 2 }}>Rata-rata Nilai</div>
            </div>
          </div>
        </VisualCard>

        <VisualCard t={t} title="RUMUS PREDIKSI REGRESI" accent={t.green}>
          <FormulaBox t={t} formula="ŷ = (1/k) × Σyᵢ" explanation="Prediksi = rata-rata nilai target dari K tetangga terdekat" color={t.green} />
          <div style={{ fontFamily: "'Nunito'", fontSize: 13, color: t.textMuted, lineHeight: 1.7, marginTop: 8 }}>
            Sama seperti classification, cari K terdekat dulu. Bedanya, alih-alih voting, kita <span style={{ color: t.green, fontWeight: 700 }}>rata-ratakan nilai y</span> dari tetangga.
          </div>
        </VisualCard>
      </div>

      {/* Example */}
      <VisualCard t={t} title="CONTOH: PREDIKSI HARGA RUMAH (K=3, Euclidean)" accent={t.accent}>
        <div style={{ fontFamily: "'Nunito'", fontSize: 13, color: t.textMuted, marginBottom: 14 }}>
          Data baru: Luas 125m², 3 kamar, 4 bath, 15km dari pusat kota. Berapa harganya?
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["ID", "Luas", "Kamar", "Bath", "Jarak", "Harga (Jt)", "Euclidean"].map(h => (
                    <th key={h} style={{ padding: "8px 5px", textAlign: "center", fontFamily: "'Space Grotesk'", fontWeight: 700, color: t.textDim, fontSize: 9, letterSpacing: 0.5, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((d, i) => {
                  const isN = i < 3;
                  return (
                    <tr key={d.id} style={{ background: isN ? `${t.accent}08` : "transparent" }}>
                      <td style={{ padding: "7px 5px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.text, borderBottom: `1px solid ${t.borderSoft}` }}>{d.id}</td>
                      <td style={{ padding: "7px 5px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.textMuted, borderBottom: `1px solid ${t.borderSoft}` }}>{d.area}</td>
                      <td style={{ padding: "7px 5px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.textMuted, borderBottom: `1px solid ${t.borderSoft}` }}>{d.bed}</td>
                      <td style={{ padding: "7px 5px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.textMuted, borderBottom: `1px solid ${t.borderSoft}` }}>{d.bath}</td>
                      <td style={{ padding: "7px 5px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.textMuted, borderBottom: `1px solid ${t.borderSoft}` }}>{d.dist}</td>
                      <td style={{ padding: "7px 5px", textAlign: "center", fontFamily: "'IBM Plex Mono'", fontWeight: isN ? 700 : 400, color: isN ? t.green : t.textMuted, borderBottom: `1px solid ${t.borderSoft}` }}>{d.price.toLocaleString()}</td>
                      <td style={{ padding: "7px 5px", textAlign: "center", fontFamily: "'IBM Plex Mono'", fontWeight: isN ? 700 : 400, color: isN ? t.accent : t.textDim, borderBottom: `1px solid ${t.borderSoft}` }}>{d.edist.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ padding: 14, borderRadius: 12, background: `${t.green}08`, border: `1px solid ${t.green}25`, textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 10, fontWeight: 700, color: t.green, letterSpacing: 1 }}>3 TERDEKAT</div>
              {k3.map(d => (
                <div key={d.id} style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12, color: t.text, marginTop: 4 }}>
                  ID{d.id}: {d.price.toLocaleString()} Jt
                </div>
              ))}
            </div>
            <div style={{ padding: 16, borderRadius: 14, background: `${t.accent}12`, border: `1.5px solid ${t.accent}40`, textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: 1 }}>PREDIKSI</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 26, fontWeight: 800, color: t.accent }}>{avgPrice.toLocaleString()}</div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 11, color: t.textMuted }}>Juta IDR</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: t.textDim, marginTop: 4 }}>
                ({k3.map(d => d.price).join(" + ")}) / 3
              </div>
            </div>
          </div>
        </div>
      </VisualCard>
    </div>
  );
}

// ══════════════════════════════════════════
//  SECTION: NORMALIZATION
// ══════════════════════════════════════════
function SectionNormalization({ t }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Before normalization */}
        <VisualCard t={t} title="❌ TANPA NORMALISASI" accent={t.red}>
          <div style={{ fontFamily: "'Nunito'", fontSize: 13, color: t.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
            Feature 1: range 1-2, Feature 2: range 100-200
          </div>
          <div style={{ background: t.codeBg, padding: 14, borderRadius: 10, fontFamily: "'IBM Plex Mono'", fontSize: 12, lineHeight: 1.8, color: t.text }}>
            <div>Data: [1, 150] → A &nbsp;&nbsp; [2, 110] → B</div>
            <div>Test: [1, 100] → True class: <span style={{ color: t.blue, fontWeight: 700 }}>A</span></div>
            <div style={{ marginTop: 8, borderTop: `1px solid ${t.border}`, paddingTop: 8 }}>
              <div>D(test, A) = √((1-1)² + (100-150)²)</div>
              <div style={{ color: t.red, fontWeight: 700 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= √(0 + 2500) = <span style={{ fontSize: 16 }}>50</span></div>
              <div style={{ marginTop: 4 }}>D(test, B) = √((1-2)² + (100-110)²)</div>
              <div style={{ color: t.green, fontWeight: 700 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= √(1 + 100) = <span style={{ fontSize: 16 }}>10.05</span></div>
            </div>
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: `${t.red}15`, color: t.red, fontWeight: 700, textAlign: "center" }}>
              Prediksi: B → ❌ SALAH!
            </div>
          </div>
          <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.red, marginTop: 10, lineHeight: 1.6 }}>
            Feature 2 (range besar) mendominasi perhitungan jarak. Feature 1 jadi tidak berpengaruh!
          </div>
        </VisualCard>

        {/* After normalization */}
        <VisualCard t={t} title="✅ DENGAN NORMALISASI" accent={t.green}>
          <div style={{ fontFamily: "'Nunito'", fontSize: 13, color: t.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
            Semua feature di-scale ke range yang sama (misal /100)
          </div>
          <div style={{ background: t.codeBg, padding: 14, borderRadius: 10, fontFamily: "'IBM Plex Mono'", fontSize: 12, lineHeight: 1.8, color: t.text }}>
            <div>Data: [1, 1.5] → A &nbsp;&nbsp; [2, 1.1] → B</div>
            <div>Test: [1, 1.0] → True class: <span style={{ color: t.blue, fontWeight: 700 }}>A</span></div>
            <div style={{ marginTop: 8, borderTop: `1px solid ${t.border}`, paddingTop: 8 }}>
              <div>D(test, A) = √((1-1)² + (1-1.5)²)</div>
              <div style={{ color: t.green, fontWeight: 700 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= √(0 + 0.25) = <span style={{ fontSize: 16 }}>0.5</span></div>
              <div style={{ marginTop: 4 }}>D(test, B) = √((1-2)² + (1-1.1)²)</div>
              <div style={{ color: t.red, fontWeight: 700 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= √(1 + 0.01) = <span style={{ fontSize: 16 }}>1.004</span></div>
            </div>
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: `${t.green}15`, color: t.green, fontWeight: 700, textAlign: "center" }}>
              Prediksi: A → ✅ BENAR!
            </div>
          </div>
          <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.green, marginTop: 10, lineHeight: 1.6 }}>
            Sekarang kedua feature punya pengaruh seimbang dalam menghitung jarak!
          </div>
        </VisualCard>
      </div>

      <VisualCard t={t} title="VISUAL: KENAPA NORMALISASI PENTING?" accent={t.accent}>
        <svg viewBox="0 0 700 180" style={{ width: "100%", height: "auto" }}>
          {/* Before */}
          <text x={175} y={18} textAnchor="middle" fill={t.red} fontSize={12} fontWeight="bold" fontFamily="'Space Grotesk'">Tanpa Normalisasi</text>
          <rect x={20} y={30} width={310} height={140} rx={10} fill={`${t.red}08`} stroke={`${t.red}30`} strokeWidth={1} />
          {/* Feature 2 dominates - horizontal spread huge */}
          <circle cx={80} cy={60} r={8} fill={t.blue} /> {/* A */}
          <text x={80} y={82} textAnchor="middle" fill={t.blue} fontSize={9} fontFamily="'Space Grotesk'" fontWeight="bold">A</text>
          <circle cx={280} cy={65} r={8} fill={t.orange} /> {/* B */}
          <text x={280} y={87} textAnchor="middle" fill={t.orange} fontSize={9} fontFamily="'Space Grotesk'" fontWeight="bold">B</text>
          <circle cx={40} cy={120} r={8} fill={t.accent} /> {/* Test */}
          <text x={40} y={142} textAnchor="middle" fill={t.accent} fontSize={9} fontFamily="'Space Grotesk'" fontWeight="bold">Test</text>
          {/* Lines */}
          <line x1={40} y1={120} x2={80} y2={60} stroke={t.blue} strokeWidth={1} strokeDasharray="4 2" />
          <text x={55} y={85} fill={t.blue} fontSize={9} fontFamily="'IBM Plex Mono'">50</text>
          <line x1={40} y1={120} x2={280} y2={65} stroke={t.orange} strokeWidth={1} strokeDasharray="4 2" />
          <text x={160} y={108} fill={t.orange} fontSize={9} fontFamily="'IBM Plex Mono'">10</text>
          <text x={165} y={160} textAnchor="middle" fill={t.red} fontSize={10} fontFamily="'Nunito'">Feature 2 mendominasi!</text>

          {/* After */}
          <text x={525} y={18} textAnchor="middle" fill={t.green} fontSize={12} fontWeight="bold" fontFamily="'Space Grotesk'">Dengan Normalisasi</text>
          <rect x={370} y={30} width={310} height={140} rx={10} fill={`${t.green}08`} stroke={`${t.green}30`} strokeWidth={1} />
          <circle cx={500} cy={55} r={8} fill={t.blue} />
          <text x={500} y={77} textAnchor="middle" fill={t.blue} fontSize={9} fontFamily="'Space Grotesk'" fontWeight="bold">A</text>
          <circle cx={560} cy={110} r={8} fill={t.orange} />
          <text x={560} y={132} textAnchor="middle" fill={t.orange} fontSize={9} fontFamily="'Space Grotesk'" fontWeight="bold">B</text>
          <circle cx={460} cy={100} r={8} fill={t.accent} />
          <text x={460} y={122} textAnchor="middle" fill={t.accent} fontSize={9} fontFamily="'Space Grotesk'" fontWeight="bold">Test</text>
          <line x1={460} y1={100} x2={500} y2={55} stroke={t.blue} strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={475} y={72} fill={t.blue} fontSize={9} fontFamily="'IBM Plex Mono'">0.5</text>
          <line x1={460} y1={100} x2={560} y2={110} stroke={t.orange} strokeWidth={1.5} strokeDasharray="4 2" />
          <text x={510} y={118} fill={t.orange} fontSize={9} fontFamily="'IBM Plex Mono'">1.0</text>
          <text x={525} y={160} textAnchor="middle" fill={t.green} fontSize={10} fontFamily="'Nunito'">Seimbang &amp; akurat!</text>
        </svg>
      </VisualCard>
    </div>
  );
}

// ══════════════════════════════════════════
//  SECTION: ENCODING
// ══════════════════════════════════════════
function SectionEncoding({ t }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <VisualCard t={t} title="LABEL ENCODING" accent={t.orange}>
          <div style={{ fontFamily: "'Nunito'", fontSize: 13, color: t.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
            Setiap kategori diberi <span style={{ color: t.orange, fontWeight: 700 }}>angka urut</span>. Simple, tapi bisa bermasalah karena model bisa "mengira" ada urutan/jarak antar kategori.
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14, flexWrap: "wrap" }}>
            {[{ label: "Action", val: 1 }, { label: "Comedy", val: 2 }, { label: "Drama", val: 3 }, { label: "Horror", val: 4 }].map(x => (
              <div key={x.label} style={{ padding: "10px 16px", borderRadius: 12, background: `${t.orange}08`, border: `1px solid ${t.orange}20`, textAlign: "center" }}>
                <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.textMuted }}>{x.label}</div>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 20, fontWeight: 800, color: t.orange }}>{x.val}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 10, background: `${t.red}08`, border: `1px solid ${t.red}20` }}>
            <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.red, lineHeight: 1.6 }}>
              ⚠️ Masalah: Model bisa anggap Drama(3) - Action(1) = 2, tapi Comedy(2) - Action(1) = 1. Seolah-olah Comedy lebih "mirip" Action daripada Drama!
            </div>
          </div>
          <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: `${t.green}08`, border: `1px solid ${t.green}20` }}>
            <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.green, lineHeight: 1.6 }}>
              ✅ Cocok untuk: Data <strong>ordinal</strong> (ada urutan natural). Contoh: Poor → Good → Excellent (1, 2, 3)
            </div>
          </div>
        </VisualCard>

        <VisualCard t={t} title="ONE-HOT ENCODING" accent={t.blue}>
          <div style={{ fontFamily: "'Nunito'", fontSize: 13, color: t.textMuted, lineHeight: 1.7, marginBottom: 14 }}>
            Setiap kategori jadi <span style={{ color: t.blue, fontWeight: 700 }}>kolom baru</span> dengan nilai 0 atau 1. Tidak ada asumsi urutan, tapi menambah dimensi data.
          </div>
          <div style={{ overflowX: "auto", marginBottom: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["", "Action", "Comedy", "Drama", "Horror"].map(h => (
                    <th key={h} style={{ padding: "8px", textAlign: "center", fontFamily: "'Space Grotesk'", fontWeight: 700, color: t.blue, fontSize: 10, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[["Action", 1, 0, 0, 0], ["Comedy", 0, 1, 0, 0], ["Drama", 0, 0, 1, 0], ["Horror", 0, 0, 0, 1]].map(row => (
                  <tr key={row[0]}>
                    <td style={{ padding: "7px 8px", fontFamily: "'Nunito'", fontSize: 12, fontWeight: 600, color: t.text, borderBottom: `1px solid ${t.borderSoft}` }}>{row[0]}</td>
                    {row.slice(1).map((v, i) => (
                      <td key={i} style={{ padding: "7px 8px", textAlign: "center", fontFamily: "'IBM Plex Mono'", fontWeight: v ? 800 : 400, color: v ? t.blue : t.textDim, borderBottom: `1px solid ${t.borderSoft}`, fontSize: v ? 16 : 12 }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 10, background: `${t.green}08`, border: `1px solid ${t.green}20` }}>
            <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.green, lineHeight: 1.6 }}>
              ✅ Cocok untuk: Data <strong>nominal</strong> (tidak ada urutan). Contoh: warna, genre, negara
            </div>
          </div>
          <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: `${t.orange}08`, border: `1px solid ${t.orange}20` }}>
            <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.orange, lineHeight: 1.6 }}>
              ⚠️ Curse of dimensionality: jika ada 1000 kategori = 1000 kolom baru!
            </div>
          </div>
        </VisualCard>
      </div>

      <div style={{ marginTop: 16 }}>
        <VisualCard t={t} title="KAPAN PAKAI APA?" accent={t.accent}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { type: "Label Encoding", when: "Data ordinal (ada urutan)", ex: "Pendidikan: SMA=1, S1=2, S2=3, S3=4", color: t.orange },
              { type: "One-Hot Encoding", when: "Data nominal (tanpa urutan)", ex: "Genre: Action, Comedy, Drama → kolom terpisah", color: t.blue },
              { type: "Binary (0/1)", when: "Data boolean / ya-tidak", ex: "Menikah: Ya=1, Tidak=0", color: t.green },
            ].map(x => (
              <div key={x.type} style={{ padding: 14, borderRadius: 14, background: `${x.color}06`, border: `1px solid ${x.color}20`, textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontSize: 13, fontWeight: 700, color: x.color, marginBottom: 6 }}>{x.type}</div>
                <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.text, marginBottom: 6 }}>{x.when}</div>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: t.textDim }}>{x.ex}</div>
              </div>
            ))}
          </div>
        </VisualCard>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
//  SECTION: CHOOSING K
// ══════════════════════════════════════════
function SectionChoosingK({ t }) {
  return (
    <div>
      <VisualCard t={t} title="EFEK NILAI K TERHADAP DECISION BOUNDARY" accent={t.accent}>
        <svg viewBox="0 0 700 200" style={{ width: "100%", height: "auto" }}>
          {/* K=1 */}
          <rect x={10} y={10} width={210} height={180} rx={12} fill={t.bgSurface} stroke={t.border} />
          <text x={115} y={30} textAnchor="middle" fill={t.red} fontSize={13} fontWeight="bold" fontFamily="'Space Grotesk'">K = 1</text>
          {/* Jagged boundary */}
          <path d="M30,130 L50,90 L60,110 L80,70 L100,100 L120,60 L140,95 L160,55 L180,90 L200,80" fill="none" stroke={t.red} strokeWidth={2} />
          <text x={115} y={165} textAnchor="middle" fill={t.red} fontSize={10} fontFamily="'Nunito'" fontWeight="bold">OVERFITTING</text>
          <text x={115} y={180} textAnchor="middle" fill={t.textDim} fontSize={9} fontFamily="'Nunito'">Boundary sangat zigzag</text>
          {/* Dots */}
          {[[40, 120, t.blue], [70, 80, t.orange], [100, 110, t.blue], [130, 65, t.orange], [160, 100, t.blue], [190, 75, t.orange],
            [55, 105, t.orange], [85, 90, t.blue], [120, 85, t.orange], [150, 70, t.blue]].map(([x, y, c], i) => (
            <circle key={i} cx={x} cy={y} r={4} fill={c} opacity={0.6} />
          ))}

          {/* K=5 */}
          <rect x={245} y={10} width={210} height={180} rx={12} fill={t.bgSurface} stroke={t.border} />
          <text x={350} y={30} textAnchor="middle" fill={t.green} fontSize={13} fontWeight="bold" fontFamily="'Space Grotesk'">K = 5</text>
          <path d="M265,110 Q310,75 350,85 Q390,95 430,80" fill="none" stroke={t.green} strokeWidth={2.5} />
          <text x={350} y={165} textAnchor="middle" fill={t.green} fontSize={10} fontFamily="'Nunito'" fontWeight="bold">JUST RIGHT</text>
          <text x={350} y={180} textAnchor="middle" fill={t.textDim} fontSize={9} fontFamily="'Nunito'">Boundary smooth &amp; akurat</text>
          {[[275, 120, t.blue], [305, 80, t.orange], [335, 110, t.blue], [365, 65, t.orange], [395, 100, t.blue], [425, 75, t.orange],
            [290, 105, t.orange], [320, 90, t.blue], [355, 85, t.orange], [385, 70, t.blue]].map(([x, y, c], i) => (
            <circle key={i} cx={x} cy={y} r={4} fill={c} opacity={0.6} />
          ))}

          {/* K=20 */}
          <rect x={480} y={10} width={210} height={180} rx={12} fill={t.bgSurface} stroke={t.border} />
          <text x={585} y={30} textAnchor="middle" fill={t.purple} fontSize={13} fontWeight="bold" fontFamily="'Space Grotesk'">K = 20</text>
          <line x1={500} y1={95} x2={670} y2={90} stroke={t.purple} strokeWidth={2.5} />
          <text x={585} y={165} textAnchor="middle" fill={t.purple} fontSize={10} fontFamily="'Nunito'" fontWeight="bold">UNDERFITTING</text>
          <text x={585} y={180} textAnchor="middle" fill={t.textDim} fontSize={9} fontFamily="'Nunito'">Boundary terlalu simpel</text>
          {[[510, 120, t.blue], [540, 80, t.orange], [570, 110, t.blue], [600, 65, t.orange], [630, 100, t.blue], [660, 75, t.orange],
            [525, 105, t.orange], [555, 90, t.blue], [590, 85, t.orange], [620, 70, t.blue]].map(([x, y, c], i) => (
            <circle key={i} cx={x} cy={y} r={4} fill={c} opacity={0.6} />
          ))}
        </svg>
      </VisualCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <VisualCard t={t} title="HUBUNGAN K DAN BIAS-VARIANCE" accent={t.cyan}>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { k: "K kecil (1-3)", bias: "Low Bias", variance: "High Variance", effect: "Sensitif noise, overfitting", color: t.red },
              { k: "K sedang (5-15)", bias: "Balance", variance: "Balance", effect: "Sweet spot — cari pakai cross-validation", color: t.green },
              { k: "K besar (20+)", bias: "High Bias", variance: "Low Variance", effect: "Terlalu general, underfitting", color: t.purple },
            ].map(x => (
              <div key={x.k} style={{ padding: "12px 16px", borderRadius: 12, background: `${x.color}06`, border: `1px solid ${x.color}20`, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ minWidth: 80, fontFamily: "'IBM Plex Mono'", fontSize: 12, fontWeight: 700, color: x.color }}>{x.k}</div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontSize: 11, color: t.text }}>{x.bias} · {x.variance}</div>
                  <div style={{ fontFamily: "'Nunito'", fontSize: 11, color: t.textDim }}>{x.effect}</div>
                </div>
              </div>
            ))}
          </div>
        </VisualCard>

        <VisualCard t={t} title="TIPS MEMILIH K" accent={t.accent}>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              "Gunakan cross-validation untuk test berbagai K",
              "K ganjil lebih baik untuk binary classification (hindari seri)",
              "K = 1 hampir tidak pernah dipakai — terlalu rentan noise",
              "Rule of thumb: K ≈ √n (n = jumlah data training)",
              "K terlalu besar = hilang aspek lokalitas",
            ].map((tip, i) => (
              <div key={i} style={{ padding: "10px 14px", borderRadius: 10, background: t.bgSurface, border: `1px solid ${t.border}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12, fontWeight: 700, color: t.accent, minWidth: 20 }}>{i + 1}.</div>
                <div style={{ fontFamily: "'Nunito'", fontSize: 13, color: t.text, lineHeight: 1.5 }}>{tip}</div>
              </div>
            ))}
          </div>
        </VisualCard>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
//  SECTION: EXERCISE
// ══════════════════════════════════════════
function SectionExercise({ t }) {
  const [encoding, setEncoding] = useState("onehot");
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div>
      <div style={{ fontFamily: "'Nunito'", fontSize: 14, color: t.textMuted, lineHeight: 1.7, marginBottom: 16 }}>
        Latihan dari slide: Prediksi Viewer Category menggunakan Manhattan distance (tanpa normalisasi).
      </div>

      {/* Toggle encoding */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ id: "onehot", label: "One-Hot Encoding" }, { id: "label", label: "Label Encoding" }].map(e => (
          <button key={e.id} onClick={() => { setEncoding(e.id); setShowAnswer(false); }} style={{
            padding: "10px 20px", borderRadius: 12,
            border: `1.5px solid ${encoding === e.id ? t.accent : t.border}`,
            background: encoding === e.id ? `${t.accent}12` : t.bgCard,
            color: encoding === e.id ? t.accent : t.textMuted,
            fontFamily: "'Space Grotesk'", fontSize: 13, fontWeight: 600,
            cursor: "pointer",
          }}>{e.label}</button>
        ))}
      </div>

      {encoding === "onehot" ? (
        <VisualCard t={t} title="ONE-HOT ENCODING — TEST: Drama, Basic, 11hrs" accent={t.blue}>
          <div style={{ fontFamily: "'Nunito'", fontSize: 13, color: t.textMuted, marginBottom: 12 }}>
            Test point: Action=0, Comedy=0, Drama=1, Horror=0, Subscription=1 (Basic), Watch Time=11
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  {["Act", "Com", "Dra", "Hor", "Sub", "Time", "Target", "Dist"].map(h => (
                    <th key={h} style={{ padding: "7px 5px", textAlign: "center", fontFamily: "'Space Grotesk'", fontWeight: 700, color: t.textDim, fontSize: 9, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [1, 0, 0, 0, 2, 15, "Frequent", 7, t.green],
                  [0, 1, 0, 0, 1, 5, "Casual", 8, null],
                  [0, 0, 1, 0, 2, 12, "Frequent", 2, t.green],
                  [0, 0, 0, 1, 0, 7, "Occasional", 7, null],
                  [0, 1, 0, 0, 0, 4, "Casual", 10, null],
                  [1, 0, 0, 0, 1, 10, "Occasional", 3, t.green],
                  [0, 0, 1, 0, 2, 14, "Frequent", 4, null],
                  [0, 0, 0, 1, 2, 6, "Casual", 8, null],
                  [0, 1, 0, 0, 1, 8, "Occasional", 5, null],
                  [1, 0, 0, 0, 0, 3, "Casual", 11, null],
                ].map((row, i) => (
                  <tr key={i} style={{ background: row[8] ? `${t.accent}08` : "transparent" }}>
                    {row.slice(0, 7).map((v, j) => (
                      <td key={j} style={{ padding: "6px 5px", textAlign: "center", fontFamily: j < 6 ? "'IBM Plex Mono'" : "'Nunito'", fontSize: j === 6 ? 10 : 11, color: j === 6 ? (v === "Frequent" ? t.green : v === "Casual" ? t.blue : t.orange) : t.textMuted, fontWeight: j === 6 ? 600 : 400, borderBottom: `1px solid ${t.borderSoft}` }}>{v}</td>
                    ))}
                    <td style={{ padding: "6px 5px", textAlign: "center", fontFamily: "'IBM Plex Mono'", fontWeight: row[8] ? 700 : 400, color: row[8] ? t.accent : t.textDim, borderBottom: `1px solid ${t.borderSoft}` }}>{row[7]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
            <div style={{ padding: 12, borderRadius: 12, background: `${t.green}08`, border: `1px solid ${t.green}25`, textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: 1 }}>K=3</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 18, fontWeight: 800, color: t.green }}>Frequent Viewer</div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 10, color: t.textDim }}>Freq=2, Occ=1 → Frequent menang</div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: `${t.green}08`, border: `1px solid ${t.green}25`, textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: 1 }}>K=5</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 18, fontWeight: 800, color: t.green }}>Frequent Viewer</div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 10, color: t.textDim }}>Freq=3, Occ=2 → Frequent menang</div>
            </div>
          </div>
        </VisualCard>
      ) : (
        <VisualCard t={t} title="LABEL ENCODING — TEST: Genre=3, Sub=1, Time=11" accent={t.orange}>
          <div style={{ fontFamily: "'Nunito'", fontSize: 13, color: t.textMuted, marginBottom: 12 }}>
            Genre: Action=1, Comedy=2, Drama=3, Horror=4. Subscription: Free=0, Basic=1, Premium=2.
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  {["Genre", "Sub", "Time", "Target", "Manhattan", "Euclidean"].map(h => (
                    <th key={h} style={{ padding: "7px 6px", textAlign: "center", fontFamily: "'Space Grotesk'", fontWeight: 700, color: t.textDim, fontSize: 10, borderBottom: `1px solid ${t.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [1, 2, 15, "Frequent", 7, 4.58],
                  [2, 1, 5, "Casual", 7, 6.08],
                  [3, 2, 12, "Frequent", 2, 1.41],
                  [4, 0, 7, "Occasional", 6, 4.24],
                  [2, 0, 4, "Casual", 9, 7.14],
                  [1, 1, 10, "Occasional", 3, 2.24],
                  [3, 2, 14, "Frequent", 4, 3.16],
                  [4, 2, 6, "Casual", 7, 5.20],
                  [2, 1, 8, "Occasional", 4, 3.16],
                  [1, 0, 3, "Casual", 11, 8.31],
                ].map((row, i) => {
                  const mHighlight = [2, 5, 6, 8].includes(i); // sorted by manhattan: idx 2(d=2), 5(d=3), 6(d=4), 8(d=4)
                  return (
                    <tr key={i} style={{ background: mHighlight ? `${t.accent}06` : "transparent" }}>
                      {row.slice(0, 4).map((v, j) => (
                        <td key={j} style={{ padding: "6px", textAlign: "center", fontFamily: j < 3 ? "'IBM Plex Mono'" : "'Nunito'", fontSize: j === 3 ? 10 : 11, color: j === 3 ? (v === "Frequent" ? t.green : v === "Casual" ? t.blue : t.orange) : t.textMuted, fontWeight: j === 3 ? 600 : 400, borderBottom: `1px solid ${t.borderSoft}` }}>{v}</td>
                      ))}
                      <td style={{ padding: "6px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.orange, borderBottom: `1px solid ${t.borderSoft}` }}>{row[4]}</td>
                      <td style={{ padding: "6px", textAlign: "center", fontFamily: "'IBM Plex Mono'", color: t.purple, borderBottom: `1px solid ${t.borderSoft}` }}>{row[5]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
            <div style={{ padding: 12, borderRadius: 12, background: `${t.green}08`, border: `1px solid ${t.green}25`, textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: 1 }}>K=3 (Manhattan)</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 800, color: t.green }}>Frequent Viewer</div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 10, color: t.textDim }}>d=2(Freq), d=3(Occ), d=4(Freq)</div>
            </div>
            <div style={{ padding: 12, borderRadius: 12, background: `${t.orange}08`, border: `1px solid ${t.orange}25`, textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 10, fontWeight: 700, color: t.textMuted, letterSpacing: 1 }}>K=5 (Manhattan)</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 800, color: t.orange }}>Occasional Viewer</div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 10, color: t.textDim }}>Freq=2, Occ=2, Casual=1 → tie-break</div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 12, background: `${t.red}08`, border: `1px solid ${t.red}20` }}>
            <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.red, lineHeight: 1.6 }}>
              ⚠️ Perhatikan: Label Encoding menghasilkan prediksi <strong>berbeda</strong> dari One-Hot Encoding untuk K=5! Ini karena label encoding memberikan "jarak palsu" antar kategori nominal.
            </div>
          </div>
        </VisualCard>
      )}
    </div>
  );
}

// ══════════════════════════════════════════
//  SECTION: PROS & CONS
// ══════════════════════════════════════════
function SectionProsCons({ t }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <VisualCard t={t} title="✅ KELEBIHAN KNN" accent={t.green}>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { title: "Simpel & Intuitif", desc: "Konsepnya sangat mudah dipahami — cari tetangga terdekat, lalu vote/rata-rata" },
              { title: "Non-parametric", desc: "Tidak perlu asumsi distribusi data. Bisa handle data yang tidak linear" },
              { title: "Versatile", desc: "Bisa untuk classification DAN regression" },
              { title: "No Training Time", desc: "Fase training = simpan data saja, O(1)" },
            ].map((p, i) => (
              <div key={i} style={{ padding: "10px 14px", borderRadius: 10, background: `${t.green}06`, border: `1px solid ${t.green}15` }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontSize: 12, fontWeight: 700, color: t.green, marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </VisualCard>

        <VisualCard t={t} title="❌ KELEMAHAN KNN" accent={t.red}>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { title: "Prediksi Lambat", desc: "Harus hitung jarak ke SEMUA data training setiap prediksi. Kompleksitas O(knd)" },
              { title: "Butuh Data Banyak", desc: "Performa buruk kalau data training sedikit" },
              { title: "Sensitif Skala", desc: "WAJIB normalisasi! Feature dengan range besar mendominasi" },
              { title: "Curse of Dimensionality", desc: "Performa menurun drastis jika dimensi (fitur) sangat banyak" },
            ].map((c, i) => (
              <div key={i} style={{ padding: "10px 14px", borderRadius: 10, background: `${t.red}06`, border: `1px solid ${t.red}15` }}>
                <div style={{ fontFamily: "'Space Grotesk'", fontSize: 12, fontWeight: 700, color: t.red, marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontFamily: "'Nunito'", fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </VisualCard>
      </div>

      <VisualCard t={t} title="KOMPLEKSITAS KOMPUTASI" accent={t.cyan}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {[
            { label: "Hitung 1 jarak", formula: "O(d)", desc: "d = jumlah dimensi/fitur" },
            { label: "1 nearest neighbor", formula: "O(nd)", desc: "n = jumlah data training" },
            { label: "K nearest neighbors", formula: "O(knd)", desc: "k = jumlah neighbors" },
            { label: "Total prediksi", formula: "O(knd)", desc: "Mahal untuk data besar!" },
          ].map((c, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 12, background: t.bgSurface, border: `1px solid ${t.border}`, textAlign: "center" }}>
              <div style={{ fontFamily: "'Nunito'", fontSize: 11, color: t.textMuted, marginBottom: 6 }}>{c.label}</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 18, fontWeight: 800, color: t.cyan }}>{c.formula}</div>
              <div style={{ fontFamily: "'Nunito'", fontSize: 10, color: t.textDim, marginTop: 4 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </VisualCard>

      {/* Comparison with other models */}
      <div style={{ marginTop: 16 }}>
        <VisualCard t={t} title="KNN vs MODEL LAIN" accent={t.accent}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["", "KNN", "Decision Tree", "Random Forest"].map(h => (
                    <th key={h} style={{ padding: "10px 8px", textAlign: "center", fontFamily: "'Space Grotesk'", fontWeight: 700, color: t.accent, fontSize: 11, borderBottom: `2px solid ${t.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Tipe Learning", "Lazy", "Eager", "Eager"],
                  ["Training", "Cepat (simpan saja)", "Lambat (build tree)", "Lambat (build trees)"],
                  ["Prediksi", "Lambat (hitung jarak)", "Cepat (traverse tree)", "Cepat (aggregate)"],
                  ["Normalisasi?", "✅ WAJIB", "❌ Tidak perlu", "❌ Tidak perlu"],
                  ["Encoding?", "✅ WAJIB", "❌ Tidak perlu", "❌ Tidak perlu"],
                  ["Interpretable?", "Sedang", "Tinggi", "Rendah"],
                  ["Outlier?", "⚠️ Sensitif", "⚠️ Sensitif", "✅ Robust"],
                ].map((row, ri) => (
                  <tr key={ri}>
                    {row.map((c, ci) => (
                      <td key={ci} style={{
                        padding: "9px 8px", textAlign: ci === 0 ? "left" : "center",
                        fontFamily: ci === 0 ? "'Space Grotesk'" : "'Nunito'",
                        fontWeight: ci === 0 ? 600 : 400,
                        color: ci === 0 ? t.textDim : t.text,
                        fontSize: ci === 0 ? 11 : 12,
                        borderBottom: `1px solid ${t.borderSoft}`,
                        background: ci === 1 ? `${t.accent}04` : "transparent",
                      }}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </VisualCard>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════
export default function App() {
  const [theme, setTheme] = useState("light");
  const [activeSection, setActiveSection] = useState("overview");
  const t = THEMES[theme];

  const renderSection = () => {
    switch (activeSection) {
      case "overview": return <SectionOverview t={t} />;
      case "distance": return <SectionDistance t={t} />;
      case "classification": return <SectionClassification t={t} />;
      case "regression": return <SectionRegression t={t} />;
      case "normalization": return <SectionNormalization t={t} />;
      case "encoding": return <SectionEncoding t={t} />;
      case "choosing_k": return <SectionChoosingK t={t} />;
      case "exercise": return <SectionExercise t={t} />;
      case "proscons": return <SectionProsCons t={t} />;
      default: return null;
    }
  };

  const currentIdx = SECTIONS.findIndex(s => s.id === activeSection);

  return (
    <div style={{
      minHeight: "100vh", background: t.bg, color: t.text,
      fontFamily: "'Nunito', sans-serif",
      transition: `background 0.5s ${ease}, color 0.3s ${ease}`,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%,100% { opacity:0.4 } 50% { opacity:1 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 4px; }
      `}</style>

      {/* Background texture */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${t.accent}06, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${t.purple}04, transparent 70%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
        {/* ══════ HEADER ══════ */}
        <header style={{ padding: "32px 0 0", animation: "fadeUp 0.6s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.accent, animation: "glow 2s infinite" }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: t.textDim, letterSpacing: 2 }}>MATERI 11 — KASDAD 2025/2026</span>
            </div>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{
              padding: "6px 14px", borderRadius: 20, border: `1px solid ${t.border}`,
              background: t.bgCard, cursor: "pointer", fontSize: 12,
              fontFamily: "'Space Grotesk', sans-serif", color: t.textMuted,
            }}>
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 700, letterSpacing: "-0.02em", color: t.text, lineHeight: 1.1,
          }}>
            K-Nearest Neighbor
          </h1>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: t.textMuted, marginTop: 4 }}>
            Classification & Regression — <span style={{ color: t.accent, fontWeight: 700 }}>Complete Visual Guide</span>
          </p>

          {/* Section nav */}
          <div style={{
            display: "flex", gap: 6, marginTop: 20, paddingBottom: 16, overflowX: "auto",
            borderBottom: `1px solid ${t.border}`,
          }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                padding: "8px 14px", borderRadius: 12, border: `1px solid ${activeSection === s.id ? t.accent : t.border}`,
                background: activeSection === s.id ? `${t.accent}12` : "transparent",
                cursor: "pointer", whiteSpace: "nowrap",
                transition: `all 0.3s ${ease}`,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600,
                  color: activeSection === s.id ? t.accent : t.textMuted,
                }}>{s.title}</span>
              </button>
            ))}
          </div>
        </header>

        {/* ══════ CONTENT ══════ */}
        <main style={{ padding: "24px 0 60px", animation: "fadeUp 0.4s both" }} key={activeSection}>
          {/* Section title */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{SECTIONS[currentIdx]?.icon}</span>
              <div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: t.text }}>
                  {SECTIONS[currentIdx]?.title}
                </h2>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, color: t.textMuted }}>
                  {SECTIONS[currentIdx]?.sub}
                </div>
              </div>
            </div>
          </div>

          {renderSection()}

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 20, borderTop: `1px solid ${t.border}` }}>
            {currentIdx > 0 ? (
              <button onClick={() => setActiveSection(SECTIONS[currentIdx - 1].id)} style={{
                padding: "10px 20px", borderRadius: 12, border: `1px solid ${t.border}`,
                background: t.bgCard, cursor: "pointer", fontFamily: "'Space Grotesk'",
                fontSize: 13, color: t.textMuted,
              }}>← {SECTIONS[currentIdx - 1].title}</button>
            ) : <div />}
            {currentIdx < SECTIONS.length - 1 ? (
              <button onClick={() => setActiveSection(SECTIONS[currentIdx + 1].id)} style={{
                padding: "10px 20px", borderRadius: 12, border: `1px solid ${t.accent}40`,
                background: `${t.accent}10`, cursor: "pointer", fontFamily: "'Space Grotesk'",
                fontSize: 13, color: t.accent, fontWeight: 600,
              }}>{SECTIONS[currentIdx + 1].title} →</button>
            ) : <div />}
          </div>
        </main>
      </div>
    </div>
  );
}
