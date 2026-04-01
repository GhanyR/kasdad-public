import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════
// RANDOM FORESTS — MATERI 8 VISUALIZATION
// ═══════════════════════════════════════════

const SECTIONS = [
  { id: "cart", label: "CART Recap", icon: "🌳" },
  { id: "ensemble", label: "Ensemble Learning", icon: "🎭" },
  { id: "rf", label: "Random Forest", icon: "🌲" },
  { id: "perf", label: "Performance", icon: "📊" },
];

// ── MINI DECISION TREE COMPONENT ──
function MiniTree({ dark, highlight, size = 1 }) {
  const s = 24 * size;
  const c = dark ? { node: "#60a5fa", leaf: "#34d399", edge: "#475569", bg: "rgba(30,41,59,0.6)" } : { node: "#3b82f6", leaf: "#10b981", edge: "#cbd5e1", bg: "rgba(241,245,249,0.8)" };
  return (
    <svg width={s * 5} height={s * 4} viewBox="0 0 120 96" style={{ filter: highlight ? `drop-shadow(0 0 8px ${c.node}44)` : "none", transition: "filter 0.3s" }}>
      <line x1="60" y1="12" x2="30" y2="40" stroke={c.edge} strokeWidth="2" />
      <line x1="60" y1="12" x2="90" y2="40" stroke={c.edge} strokeWidth="2" />
      <line x1="30" y1="40" x2="15" y2="68" stroke={c.edge} strokeWidth="2" />
      <line x1="30" y1="40" x2="45" y2="68" stroke={c.edge} strokeWidth="2" />
      <line x1="90" y1="40" x2="75" y2="68" stroke={c.edge} strokeWidth="2" />
      <line x1="90" y1="40" x2="105" y2="68" stroke={c.edge} strokeWidth="2" />
      <circle cx="60" cy="12" r="8" fill={c.node} />
      <circle cx="30" cy="40" r="8" fill={c.node} />
      <circle cx="90" cy="40" r="8" fill={c.node} />
      <circle cx="15" cy="68" r="7" fill={c.leaf} />
      <circle cx="45" cy="68" r="7" fill={c.leaf} />
      <circle cx="75" cy="68" r="7" fill={c.leaf} />
      <circle cx="105" cy="68" r="7" fill={c.leaf} />
    </svg>
  );
}

// ── ANIMATED BOOTSTRAP DEMO ──
function BootstrapDemo({ dark }) {
  const [step, setStep] = useState(0);
  const original = [
    { id: "A", color: "#ef4444" },
    { id: "B", color: "#f59e0b" },
    { id: "C", color: "#10b981" },
    { id: "D", color: "#3b82f6" },
  ];
  const bootstrapped = [
    [
      { id: "B", color: "#f59e0b" },
      { id: "A", color: "#ef4444" },
      { id: "D", color: "#3b82f6" },
      { id: "D", color: "#3b82f6" },
    ],
    [
      { id: "C", color: "#10b981" },
      { id: "C", color: "#10b981" },
      { id: "A", color: "#ef4444" },
      { id: "B", color: "#f59e0b" },
    ],
    [
      { id: "A", color: "#ef4444" },
      { id: "D", color: "#3b82f6" },
      { id: "B", color: "#f59e0b" },
      { id: "A", color: "#ef4444" },
    ],
  ];

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 2000);
    return () => clearInterval(t);
  }, []);

  const bg = dark ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.7)";
  const border = dark ? "rgba(71,85,105,0.5)" : "rgba(203,213,225,0.5)";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const muted = dark ? "#94a3b8" : "#64748b";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ background: bg, borderRadius: 12, padding: "12px 16px", border: `1px solid ${border}` }}>
          <div style={{ fontSize: 11, color: muted, marginBottom: 8, textAlign: "center", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Original (N=4)</div>
          <div style={{ display: "flex", gap: 6 }}>
            {original.map((d, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>{d.id}</div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 28, color: muted }}>→</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bootstrapped.map((bs, bi) => (
            <div key={bi} style={{
              background: bg, borderRadius: 10, padding: "8px 12px", border: `1px solid ${step === bi + 1 ? "#f59e0b" : border}`,
              opacity: step === 0 || step === bi + 1 ? 1 : 0.4, transition: "all 0.5s", transform: step === bi + 1 ? "scale(1.05)" : "scale(1)"
            }}>
              <div style={{ fontSize: 10, color: muted, marginBottom: 4, fontWeight: 600 }}>Sample #{bi + 1}</div>
              <div style={{ display: "flex", gap: 4 }}>
                {bs.map((d, i) => (
                  <div key={i} style={{ width: 30, height: 30, borderRadius: 6, background: d.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, fontFamily: "monospace", boxShadow: bs.filter(x => x.id === d.id).length > 1 ? `0 0 8px ${d.color}88` : "none" }}>{d.id}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12, color: muted, textAlign: "center", maxWidth: 400, lineHeight: 1.5 }}>
        Sampling <b style={{ color: text }}>dengan pengembalian</b> — data bisa muncul lebih dari sekali! Rata-rata tiap sample melihat <b style={{ color: "#f59e0b" }}>~63%</b> data asli, sisanya <b style={{ color: "#ef4444" }}>~37%</b> jadi out-of-bag.
      </div>
    </div>
  );
}

// ── VOTING DEMO ──
function VotingDemo({ dark }) {
  const [votes, setVotes] = useState([null, null, null, null, null]);
  const [final, setFinal] = useState(null);
  const [running, setRunning] = useState(false);

  const runVoting = () => {
    setRunning(true);
    setFinal(null);
    setVotes([null, null, null, null, null]);
    const results = ["Yes", "Yes", "No", "Yes", "Yes"];
    results.forEach((v, i) => {
      setTimeout(() => {
        setVotes((prev) => { const n = [...prev]; n[i] = v; return n; });
        if (i === results.length - 1) {
          setTimeout(() => { setFinal("Yes"); setRunning(false); }, 600);
        }
      }, (i + 1) * 500);
    });
  };

  const bg = dark ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.7)";
  const border = dark ? "rgba(71,85,105,0.5)" : "rgba(203,213,225,0.5)";
  const muted = dark ? "#94a3b8" : "#64748b";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
        {votes.map((v, i) => (
          <div key={i} style={{
            width: 80, padding: "10px 0", borderRadius: 12, background: bg, border: `1px solid ${border}`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            transform: v ? "scale(1)" : "scale(0.9)", opacity: v ? 1 : 0.4, transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            <MiniTree dark={dark} size={0.5} highlight={!!v} />
            <div style={{
              fontSize: 13, fontWeight: 700, color: v === "Yes" ? "#10b981" : v === "No" ? "#ef4444" : muted,
              minHeight: 20
            }}>{v || "..."}</div>
          </div>
        ))}
      </div>

      {final && (
        <div style={{
          padding: "10px 24px", borderRadius: 12, background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff", fontWeight: 700, fontSize: 16, animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          boxShadow: "0 4px 20px rgba(16,185,129,0.4)"
        }}>
          Majority Vote → {final} (4/5)
        </div>
      )}

      <button onClick={runVoting} disabled={running} style={{
        padding: "8px 20px", borderRadius: 8, border: "none", cursor: running ? "not-allowed" : "pointer",
        background: running ? muted : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
        fontWeight: 600, fontSize: 13, transition: "all 0.3s"
      }}>
        {running ? "Voting..." : "▶ Jalankan Voting"}
      </button>
    </div>
  );
}

// ── FEATURE SUBSET DEMO ──
function FeatureSubsetDemo({ dark }) {
  const [selected, setSelected] = useState([0, 2]);
  const features = ["Chest Pain", "Blood Circ.", "Blocked Art.", "Weight"];
  const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6"];
  const bg = dark ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.7)";
  const border = dark ? "rgba(71,85,105,0.5)" : "rgba(203,213,225,0.5)";
  const muted = dark ? "#94a3b8" : "#64748b";
  const text = dark ? "#e2e8f0" : "#1e293b";

  const shuffle = () => {
    const indices = [0, 1, 2, 3];
    const n = 2;
    const shuffled = indices.sort(() => Math.random() - 0.5).slice(0, n);
    setSelected(shuffled);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontSize: 12, color: muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>D = 4 fitur total, pilih d = 2 secara acak</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {features.map((f, i) => (
          <div key={i} style={{
            padding: "8px 14px", borderRadius: 10,
            background: selected.includes(i) ? colors[i] + "22" : bg,
            border: `2px solid ${selected.includes(i) ? colors[i] : border}`,
            color: selected.includes(i) ? colors[i] : muted,
            fontWeight: 600, fontSize: 13, transition: "all 0.4s",
            transform: selected.includes(i) ? "scale(1.08)" : "scale(1)",
            boxShadow: selected.includes(i) ? `0 2px 12px ${colors[i]}33` : "none"
          }}>
            {selected.includes(i) && "✓ "}{f}
          </div>
        ))}
      </div>
      <button onClick={shuffle} style={{
        padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer",
        background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff",
        fontWeight: 600, fontSize: 12
      }}>🎲 Acak Ulang Fitur</button>
      <div style={{ fontSize: 11, color: muted, textAlign: "center" }}>
        Setiap node di setiap tree hanya melihat <b style={{ color: text }}>subset acak</b> dari fitur — bukan semua!
      </div>
    </div>
  );
}

// ── PERFORMANCE CHART ──
function PerfChart({ dark }) {
  const data = [
    { trees: 10, rf: 0.0625, boost: 0.0615, bag: 0.058 },
    { trees: 50, rf: 0.057, boost: 0.057, bag: 0.054 },
    { trees: 100, rf: 0.050, boost: 0.047, bag: 0.054 },
    { trees: 200, rf: 0.049, boost: 0.047, bag: 0.056 },
    { trees: 300, rf: 0.050, boost: 0.046, bag: 0.055 },
    { trees: 400, rf: 0.048, boost: 0.045, bag: 0.055 },
    { trees: 500, rf: 0.047, boost: 0.045, bag: 0.057 },
  ];

  const W = 420, H = 200, P = { t: 20, r: 20, b: 40, l: 50 };
  const iW = W - P.l - P.r, iH = H - P.t - P.b;
  const minY = 0.044, maxY = 0.064;

  const x = (v) => P.l + ((v - 10) / 490) * iW;
  const y = (v) => P.t + ((maxY - v) / (maxY - minY)) * iH;

  const line = (key, color) => {
    const pts = data.map((d) => `${x(d.trees)},${y(d[key])}`).join(" ");
    return (
      <g key={key}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => <circle key={i} cx={x(d.trees)} cy={y(d[key])} r="3.5" fill={color} />)}
      </g>
    );
  };

  const gridColor = dark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)";
  const labelColor = dark ? "#94a3b8" : "#64748b";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        {[0.045, 0.050, 0.055, 0.060].map((v) => (
          <g key={v}>
            <line x1={P.l} y1={y(v)} x2={W - P.r} y2={y(v)} stroke={gridColor} strokeDasharray="4,4" />
            <text x={P.l - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill={labelColor}>{v.toFixed(3)}</text>
          </g>
        ))}
        {data.map((d) => (
          <text key={d.trees} x={x(d.trees)} y={H - 10} textAnchor="middle" fontSize="10" fill={labelColor}>{d.trees}</text>
        ))}
        {line("bag", "#f59e0b")}
        {line("rf", "#3b82f6")}
        {line("boost", "#10b981")}
        <text x={W / 2} y={H - 0} textAnchor="middle" fontSize="11" fill={labelColor} fontWeight="600">Number of Trees</text>
        <text x={12} y={H / 2} textAnchor="middle" fontSize="11" fill={labelColor} fontWeight="600" transform={`rotate(-90,12,${H / 2})`}>Test Error</text>
      </svg>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        {[{ label: "Random Forest", color: "#3b82f6" }, { label: "Boosting", color: "#10b981" }, { label: "Bagging", color: "#f59e0b" }].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
            <span style={{ fontSize: 12, color: labelColor, fontWeight: 500 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── COMPARISON TABLE ──
function ComparisonVisual({ dark }) {
  const bg = dark ? "rgba(30,41,59,0.4)" : "rgba(241,245,249,0.6)";
  const border = dark ? "rgba(71,85,105,0.4)" : "rgba(203,213,225,0.5)";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const muted = dark ? "#94a3b8" : "#64748b";

  const items = [
    { label: "Interpretability", dt: 5, rf: 2, dtLabel: "Tinggi", rfLabel: "Rendah" },
    { label: "Akurasi", dt: 2, rf: 5, dtLabel: "Rendah", rfLabel: "Tinggi" },
    { label: "Overfitting Risk", dt: 5, rf: 2, dtLabel: "Tinggi", rfLabel: "Rendah" },
    { label: "Variance", dt: 5, rf: 2, dtLabel: "Tinggi", rfLabel: "Rendah" },
    { label: "Kecepatan", dt: 5, rf: 3, dtLabel: "Cepat", rfLabel: "Sedang" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>🌳 Single Decision Tree</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>🌲 Random Forest</span>
      </div>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: bg, borderRadius: 10, border: `1px solid ${border}` }}>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>{item.dtLabel}</span>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ width: 16, height: 6, borderRadius: 3, background: i < item.dt ? "#f59e0b" : dark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)", transition: "all 0.3s" }} />
              ))}
            </div>
          </div>
          <div style={{ width: 100, textAlign: "center", fontSize: 11, fontWeight: 700, color: text, flexShrink: 0 }}>{item.label}</div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ width: 16, height: 6, borderRadius: 3, background: i < item.rf ? "#10b981" : dark ? "rgba(71,85,105,0.3)" : "rgba(203,213,225,0.5)", transition: "all 0.3s" }} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>{item.rfLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PIPELINE VISUAL ──
function RFPipeline({ dark }) {
  const [activeStep, setActiveStep] = useState(0);
  const muted = dark ? "#94a3b8" : "#64748b";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const bg = dark ? "rgba(30,41,59,0.5)" : "rgba(241,245,249,0.7)";
  const border = dark ? "rgba(71,85,105,0.5)" : "rgba(203,213,225,0.5)";

  useEffect(() => {
    const t = setInterval(() => setActiveStep((s) => (s + 1) % 4), 2500);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { icon: "📦", title: "Original Data", desc: "Dataset asli (N baris, D fitur)", color: "#6366f1" },
    { icon: "🎲", title: "Bootstrap Sampling", desc: "Ambil N sampel acak (dengan pengembalian)", color: "#f59e0b" },
    { icon: "🌳", title: "Build Trees", desc: "Bangun tree, tiap split pilih d fitur acak", color: "#10b981" },
    { icon: "🗳️", title: "Aggregate", desc: "Voting (klasifikasi) / Rata-rata (regresi)", color: "#3b82f6" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div onClick={() => setActiveStep(i)} style={{
            width: 130, padding: "14px 12px", borderRadius: 14, background: bg, cursor: "pointer",
            border: `2px solid ${activeStep === i ? s.color : border}`,
            transform: activeStep === i ? "scale(1.06)" : "scale(1)",
            boxShadow: activeStep === i ? `0 4px 20px ${s.color}33` : "none",
            transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", textAlign: "center"
          }}>
            <div style={{ fontSize: 28 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: activeStep === i ? s.color : text, marginTop: 4 }}>{s.title}</div>
            <div style={{ fontSize: 10, color: muted, marginTop: 4, lineHeight: 1.4 }}>{s.desc}</div>
          </div>
          {i < 3 && <div style={{ fontSize: 18, color: muted }}>→</div>}
        </div>
      ))}
    </div>
  );
}

// ═══════════════ SECTION COMPONENTS ═══════════════

function CartSection({ dark }) {
  const bg = dark ? "rgba(30,41,59,0.4)" : "rgba(241,245,249,0.6)";
  const border = dark ? "rgba(71,85,105,0.4)" : "rgba(203,213,225,0.4)";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const muted = dark ? "#94a3b8" : "#64748b";
  const accent = "#f59e0b";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* What is CART */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 16 }}>
          Apa itu CART? <span style={{ color: muted, fontWeight: 400, fontSize: 14 }}>(Classification & Regression Trees)</span>
        </div>

        {/* Tree structure visual */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 250px" }}>
            <svg width="280" height="200" viewBox="0 0 280 200">
              {/* Edges */}
              <line x1="140" y1="30" x2="70" y2="90" stroke={dark ? "#475569" : "#cbd5e1"} strokeWidth="2" />
              <line x1="140" y1="30" x2="210" y2="90" stroke={dark ? "#475569" : "#cbd5e1"} strokeWidth="2" />
              <line x1="70" y1="90" x2="35" y2="150" stroke={dark ? "#475569" : "#cbd5e1"} strokeWidth="2" />
              <line x1="70" y1="90" x2="105" y2="150" stroke={dark ? "#475569" : "#cbd5e1"} strokeWidth="2" />

              {/* Labels */}
              <text x="140" y="60" textAnchor="middle" fontSize="9" fill={muted}>Iya</text>
              <text x="200" y="60" textAnchor="middle" fontSize="9" fill={muted}>Tidak</text>
              <text x="40" y="120" textAnchor="middle" fontSize="9" fill={muted}>Iya</text>
              <text x="100" y="120" textAnchor="middle" fontSize="9" fill={muted}>Tidak</text>

              {/* Root */}
              <rect x="90" y="10" width="100" height="32" rx="8" fill="#6366f1" />
              <text x="140" y="30" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Suka Soda?</text>

              {/* Internal */}
              <rect x="20" y="74" width="100" height="32" rx="8" fill="#3b82f6" />
              <text x="70" y="94" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Umur ≤ 12.5?</text>

              {/* Leaf right */}
              <rect x="165" y="74" width="90" height="32" rx="8" fill="#ef4444" />
              <text x="210" y="94" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">Tidak Suka</text>

              {/* Leaf left-left */}
              <rect x="0" y="138" width="70" height="28" rx="8" fill="#ef4444" />
              <text x="35" y="156" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">Tidak Suka</text>

              {/* Leaf left-right */}
              <rect x="75" y="138" width="60" height="28" rx="8" fill="#10b981" />
              <text x="105" y="156" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">Suka!</text>
            </svg>
          </div>

          <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "🔵", label: "Internal Node", desc: "Pertanyaan/tes terhadap fitur input", color: "#3b82f6" },
              { icon: "↗️", label: "Edge/Cabang", desc: "Kemungkinan jawaban dari pertanyaan", color: muted },
              { icon: "🟢", label: "Leaf Node", desc: "Prediksi akhir (output)", color: "#10b981" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: muted }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CART Weaknesses → Why RF */}
      <div style={{ background: `linear-gradient(135deg, ${dark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.05)"}, ${dark ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.05)"})`, borderRadius: 16, padding: 24, border: `1px solid ${dark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)"}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#ef4444", marginBottom: 16 }}>
          ⚠️ Kelemahan CART yang Harus Diatasi
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { title: "High Variance", desc: "Perubahan kecil di data → tree bisa berubah total", icon: "📉" },
            { title: "Mudah Overfit", desc: "Tree terlalu dalam → hafal noise di training data", icon: "🎯" },
            { title: "Greedy", desc: "Tiap split ambil keputusan terbaik lokal, bukan global optimal", icon: "🤏" },
          ].map((w) => (
            <div key={w.title} style={{ flex: "1 1 140px", padding: 14, background: bg, borderRadius: 12, border: `1px solid ${border}` }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{w.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>{w.title}</div>
              <div style={{ fontSize: 11, color: muted, marginTop: 4, lineHeight: 1.5 }}>{w.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "10px 16px", borderRadius: 10, background: dark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.06)", border: `1px solid rgba(16,185,129,0.3)`, textAlign: "center" }}>
          <span style={{ fontSize: 13, color: "#10b981", fontWeight: 700 }}>💡 Solusi: Gabungkan BANYAK tree → Random Forest!</span>
        </div>
      </div>
    </div>
  );
}

function EnsembleSection({ dark }) {
  const bg = dark ? "rgba(30,41,59,0.4)" : "rgba(241,245,249,0.6)";
  const border = dark ? "rgba(71,85,105,0.4)" : "rgba(203,213,225,0.4)";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const muted = dark ? "#94a3b8" : "#64748b";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Concept */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 6 }}>Ensemble = Kekuatan Gabungan</div>
        <div style={{ fontSize: 13, color: muted, marginBottom: 20, lineHeight: 1.6 }}>
          Bayangkan kamu tanya 100 orang soal jawaban kuis. Satu orang mungkin salah, tapi <b style={{ color: text }}>mayoritas kemungkinan besar benar</b>. Itu prinsip ensemble!
        </div>

        {/* Single vs Ensemble visual */}
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", padding: 16, background: dark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.04)", borderRadius: 14, border: "1px solid rgba(239,68,68,0.2)", flex: "1 1 180px" }}>
            <MiniTree dark={dark} size={1.2} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginTop: 8 }}>Single Tree</div>
            <div style={{ fontSize: 11, color: muted }}>1 prediksi → bisa salah</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", fontSize: 28, color: muted }}>vs</div>

          <div style={{ textAlign: "center", padding: 16, background: dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.04)", borderRadius: 14, border: "1px solid rgba(16,185,129,0.2)", flex: "1 1 180px" }}>
            <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
              {[0, 1, 2].map((i) => <MiniTree key={i} dark={dark} size={0.6} highlight />)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981", marginTop: 8 }}>Ensemble</div>
            <div style={{ fontSize: 11, color: muted }}>N prediksi → ambil mayoritas</div>
          </div>
        </div>
      </div>

      {/* Formulas */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>📐 Cara Menggabungkan Prediksi</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 250px", padding: 16, borderRadius: 12, background: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.25)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", marginBottom: 8 }}>Averaging (Regresi)</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: text, textAlign: "center", padding: "8px 0" }}>
              f(y|x) = <span style={{ fontSize: 14 }}>1/M</span> × Σ f<sub>m</sub>(y|x)
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 8 }}>
              <b>M</b> = jumlah base model, <b>f<sub>m</sub></b> = prediksi model ke-m. Hasil akhir = rata-rata semua prediksi.
            </div>
          </div>

          <div style={{ flex: "1 1 250px", padding: 16, borderRadius: 12, background: dark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.25)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>Majority Vote (Klasifikasi)</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: text, textAlign: "center", padding: "8px 0" }}>
              ŷ = mode(ŷ₁, ŷ₂, ..., ŷ<sub>M</sub>)
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 8 }}>
              <b>mode</b> = nilai yang paling sering muncul. Pilih kelas yang diprediksi mayoritas tree.
            </div>
          </div>

          <div style={{ flex: "1 1 250px", padding: 16, borderRadius: 12, background: dark ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.25)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>Stacking (Weighted)</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: text, textAlign: "center", padding: "8px 0" }}>
              f(y|x) = Σ w<sub>m</sub> × f<sub>m</sub>(y|x)
            </div>
            <div style={{ fontSize: 11, color: muted, marginTop: 8 }}>
              <b>w<sub>m</sub></b> = bobot model ke-m. Model yang lebih akurat diberi bobot lebih tinggi.
            </div>
          </div>
        </div>
      </div>

      {/* Bagging */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 6 }}>🎒 Bagging (Bootstrap Aggregating)</div>
        <div style={{ fontSize: 12, color: muted, marginBottom: 16, lineHeight: 1.5 }}>
          Metode ensemble sederhana: latih M model dengan <b style={{ color: text }}>sampel data yang berbeda-beda</b> (via bootstrap sampling), lalu gabungkan hasilnya.
        </div>
        <BootstrapDemo dark={dark} />

        <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", padding: 12, borderRadius: 10, background: dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>✅ Kelebihan</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>Mencegah ketergantungan berlebihan pada satu data → lebih robust & general</div>
          </div>
          <div style={{ flex: "1 1 200px", padding: 12, borderRadius: 10, background: dark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#ef4444" }}>⚠️ Catatan</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>Bagging tidak selalu meningkatkan kinerja — tergantung base model & data</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RFSection({ dark }) {
  const bg = dark ? "rgba(30,41,59,0.4)" : "rgba(241,245,249,0.6)";
  const border = dark ? "rgba(71,85,105,0.4)" : "rgba(203,213,225,0.4)";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const muted = dark ? "#94a3b8" : "#64748b";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Pipeline */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 6 }}>🌲 Bagaimana Random Forest Bekerja?</div>
        <div style={{ fontSize: 12, color: muted, marginBottom: 20, lineHeight: 1.5 }}>
          Random Forest = <b style={{ color: "#10b981" }}>Bagging</b> + <b style={{ color: "#f59e0b" }}>Random Feature Selection</b>. Bukan cuma data yang diacak, tapi juga fitur yang dipakai tiap split!
        </div>
        <RFPipeline dark={dark} />
      </div>

      {/* 3 Steps Detail */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>📋 3 Langkah Membangun Random Forest</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              step: 1, title: "Bootstrap Sampling", color: "#6366f1",
              visual: <BootstrapDemo dark={dark} />,
              desc: "Dari N data asli, ambil N data secara acak DENGAN pengembalian. Jadi data bisa duplikat! ~63% data terpakai, sisanya ~37% jadi out-of-bag (bisa dipakai sebagai test set)."
            },
            {
              step: 2, title: "Random Feature Selection", color: "#f59e0b",
              visual: <FeatureSubsetDemo dark={dark} />,
              desc: "Saat membangun tree, di setiap node/split, hanya d fitur acak yang dipertimbangkan (dari total D fitur). Biasanya d = √D untuk klasifikasi, d = D/3 untuk regresi."
            },
            {
              step: 3, title: "Voting / Averaging", color: "#10b981",
              visual: <VotingDemo dark={dark} />,
              desc: "Untuk klasifikasi: ambil majority vote dari semua tree. Untuk regresi: rata-ratakan prediksi semua tree."
            },
          ].map((s) => (
            <div key={s.step} style={{ padding: 20, borderRadius: 14, background: dark ? `${s.color}11` : `${s.color}08`, border: `1px solid ${s.color}33` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>{s.step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.title}</div>
              </div>
              <div style={{ fontSize: 12, color: muted, lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</div>
              {s.visual}
            </div>
          ))}
        </div>
      </div>

      {/* Hyperparameters */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>⚙️ Hyperparameters Random Forest</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {[
            { name: "n_estimators", desc: "Jumlah tree dalam forest", icon: "🌲", importance: "high" },
            { name: "max_samples", desc: "Ukuran bootstrap sample per tree", icon: "📦", importance: "medium" },
            { name: "max_features", desc: "Jumlah fitur acak per split (d)", icon: "🎲", importance: "high" },
            { name: "max_depth", desc: "Kedalaman maksimum setiap tree", icon: "📏", importance: "high" },
            { name: "min_samples_split", desc: "Min data untuk bisa split node", icon: "✂️", importance: "medium" },
            { name: "min_samples_leaf", desc: "Min data di setiap leaf node", icon: "🍃", importance: "medium" },
          ].map((hp) => (
            <div key={hp.name} style={{ padding: 12, borderRadius: 10, background: dark ? "rgba(30,41,59,0.5)" : "rgba(255,255,255,0.6)", border: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{hp.icon}</span>
                <code style={{ fontSize: 12, fontWeight: 700, color: hp.importance === "high" ? "#f59e0b" : text, fontFamily: "monospace" }}>{hp.name}</code>
              </div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.4 }}>{hp.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerfSection({ dark }) {
  const bg = dark ? "rgba(30,41,59,0.4)" : "rgba(241,245,249,0.6)";
  const border = dark ? "rgba(71,85,105,0.4)" : "rgba(203,213,225,0.4)";
  const text = dark ? "#e2e8f0" : "#1e293b";
  const muted = dark ? "#94a3b8" : "#64748b";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Performance Chart */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 6 }}>Test Error vs Jumlah Tree</div>
        <div style={{ fontSize: 12, color: muted, marginBottom: 20 }}>Semakin banyak tree, error cenderung menurun dan stabil (tapi butuh waktu lebih lama)</div>
        <PerfChart dark={dark} />
      </div>

      {/* Why RF works */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>🧠 Mengapa Random Forest Bekerja?</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: 16, borderRadius: 12, background: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.25)", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontStyle: "italic", color: "#818cf8", fontWeight: 600 }}>
              "Nobody knows everything, but everybody knows something."
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { icon: "🎯", title: "Mayoritas Benar", desc: "Walaupun ada tree yang salah, mayoritas tree biasanya memprediksi benar → voting menghasilkan jawaban tepat", color: "#10b981" },
              { icon: "🎲", title: "Error Tidak Sinkron", desc: "Karena sampling & fitur acak, tree yang berbeda membuat error di tempat yang BERBEDA → saling menutupi", color: "#6366f1" },
              { icon: "📉", title: "Variance Berkurang", desc: "Rata-rata dari banyak model high-variance → model ensemble dengan variance lebih rendah (bias tetap sama)", color: "#f59e0b" },
            ].map((r) => (
              <div key={r.title} style={{ flex: "1 1 180px", padding: 14, borderRadius: 12, background: dark ? `${r.color}11` : `${r.color}06`, border: `1px solid ${r.color}33` }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.title}</div>
                <div style={{ fontSize: 11, color: muted, marginTop: 6, lineHeight: 1.5 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DT vs RF comparison */}
      <div style={{ background: bg, borderRadius: 16, padding: 24, border: `1px solid ${border}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: text, marginBottom: 16 }}>⚖️ Decision Tree vs Random Forest</div>
        <ComparisonVisual dark={dark} />
      </div>

      {/* Pros & Cons */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 250px", padding: 20, borderRadius: 16, background: dark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#10b981", marginBottom: 12 }}>✅ Kelebihan RF</div>
          {[
            "Serbaguna (klasifikasi & regresi)",
            "Hyperparameter mudah dipahami",
            "Tidak overfit dengan cukup tree",
            "Robust terhadap outlier & noise",
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: "#10b981", fontSize: 12, marginTop: 1 }}>●</span>
              <span style={{ fontSize: 12, color: muted, lineHeight: 1.4 }}>{p}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 250px", padding: 20, borderRadius: 16, background: dark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#ef4444", marginBottom: 12 }}>❌ Kekurangan RF</div>
          {[
            "Lebih banyak tree = lebih lambat",
            "Sulit diinterpretasi (bukan 1 tree lagi)",
            "Tidak bisa jelaskan hubungan antar fitur",
            "Butuh lebih banyak memori & komputasi",
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ color: "#ef4444", fontSize: 12, marginTop: 1 }}>●</span>
              <span style={{ fontSize: 12, color: muted, lineHeight: 1.4 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaways for UTS */}
      <div style={{ padding: 20, borderRadius: 16, background: `linear-gradient(135deg, ${dark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.06)"}, ${dark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.06)"})`, border: `1px solid ${dark ? "rgba(245,158,11,0.3)" : "rgba(245,158,11,0.2)"}` }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#f59e0b", marginBottom: 12 }}>⚡ Poin Kritis untuk UTS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "RF = Bagging + Random Feature Selection. Dua sumber randomness!",
            "Bootstrap sampling = sampling DENGAN pengembalian, ~63% data terpakai",
            "Out-of-bag (~37%) bisa digunakan sebagai validasi tanpa perlu split data terpisah",
            "Untuk klasifikasi: majority vote. Untuk regresi: averaging",
            "Bagging menurunkan VARIANCE, bukan bias. Bias tetap sama seperti base model",
            "Base model boosting = high bias (weak learner). Base model bagging = high variance",
            "Boosting TIDAK bisa diparalelkan (sequential). Bagging/RF BISA diparalelkan",
            "Semakin random fitur yang dipilih → tree semakin tidak berkorelasi → ensemble semakin kuat",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: "#f59e0b", fontSize: 14, fontWeight: 800, minWidth: 20 }}>{i + 1}.</span>
              <span style={{ fontSize: 12, color: text, lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════ MAIN APP ═══════════════

export default function RandomForestViz() {
  const [dark, setDark] = useState(false);
  const [activeSection, setActiveSection] = useState("cart");

  const theme = {
    bg: dark ? "#0b0f1a" : "#f8fafc",
    surface: dark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.8)",
    text: dark ? "#e2e8f0" : "#1e293b",
    muted: dark ? "#94a3b8" : "#64748b",
    border: dark ? "rgba(71,85,105,0.4)" : "rgba(203,213,225,0.5)",
    navBg: dark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.95)",
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", position: "relative", overflow: "hidden", transition: "background 0.4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        @keyframes popIn { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}; border-radius: 3px; }
        button { transition: all 0.2s; }
        button:hover { filter: brightness(1.1); }
      `}</style>

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-15%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${dark ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.04)"}, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: `radial-gradient(circle, ${dark ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.03)"}, transparent 70%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 880, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Header */}
        <header style={{ padding: "32px 0 24px", animation: "fadeUp 0.6s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#10b981", marginBottom: 4 }}>Materi 08 · KASDaD</div>
              <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1, background: "linear-gradient(135deg, #10b981, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Random Forests
              </h1>
              <div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>Ensemble Learning dengan Decision Trees</div>
            </div>
            <button onClick={() => setDark(!dark)} style={{
              width: 44, height: 44, borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.surface,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
            }}>
              {dark ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Nav */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                padding: "8px 16px", borderRadius: 10, border: `1px solid ${activeSection === s.id ? "#10b981" : theme.border}`,
                background: activeSection === s.id ? (dark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)") : theme.surface,
                color: activeSection === s.id ? "#10b981" : theme.muted,
                fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.3s"
              }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main style={{ animation: "fadeUp 0.5s both" }} key={activeSection}>
          {activeSection === "cart" && <CartSection dark={dark} />}
          {activeSection === "ensemble" && <EnsembleSection dark={dark} />}
          {activeSection === "rf" && <RFSection dark={dark} />}
          {activeSection === "perf" && <PerfSection dark={dark} />}
        </main>

        {/* Footer */}
        <footer style={{ textAlign: "center", padding: "32px 0 16px", color: theme.muted, fontSize: 11 }}>
          Materi 08 — Random Forests · Semester Genap 2025/2026
        </footer>
      </div>
    </div>
  );
}
