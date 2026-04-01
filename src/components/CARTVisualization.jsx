import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "overview", label: "Overview", icon: "🌳" },
  { id: "learning", label: "Learning Methods", icon: "🧠" },
  { id: "structure", label: "Struktur CART", icon: "🔀" },
  { id: "algorithm", label: "Algoritma", icon: "⚙️" },
  { id: "cost", label: "Cost Functions", icon: "📐" },
  { id: "classification", label: "Classification Tree", icon: "🏷️" },
  { id: "regression", label: "Regression Tree", icon: "📈" },
  { id: "hyperparams", label: "Hyperparameters", icon: "🎛️" },
  { id: "proscons", label: "Pros & Cons", icon: "⚖️" },
];

// ========== THEMES ==========
const themes = {
  dark: {
    bg: "#0a0a0f", card: "#12121a", cardHover: "#1a1a25",
    text: "#e8e8ed", textMuted: "#8888a0", textDim: "#555570",
    accent: "#6c63ff", accentGlow: "#6c63ff30", accentSoft: "#6c63ff15",
    accent2: "#ff6b9d", accent3: "#00d4aa", accent4: "#ffa726",
    border: "#222235", borderLight: "#1a1a2e",
    green: "#4ade80", red: "#f87171", yellow: "#fbbf24", blue: "#60a5fa",
    surface: "#15151f", surfaceHover: "#1e1e2d",
    gradient: "linear-gradient(135deg, #6c63ff 0%, #ff6b9d 100%)",
    nodeBg: "#1e1e2d", leafBg: "#0d2818", leafBorder: "#22c55e40",
    internalBg: "#1a1530", internalBorder: "#6c63ff40",
  },
  light: {
    bg: "#f8f7f4", card: "#ffffff", cardHover: "#fafafa",
    text: "#1a1a2e", textMuted: "#6b6b80", textDim: "#9999aa",
    accent: "#5046e5", accentGlow: "#5046e530", accentSoft: "#5046e510",
    accent2: "#e5466b", accent3: "#059669", accent4: "#d97706",
    border: "#e5e5ea", borderLight: "#f0f0f4",
    green: "#16a34a", red: "#dc2626", yellow: "#ca8a04", blue: "#2563eb",
    surface: "#f0eff2", surfaceHover: "#e8e7ec",
    gradient: "linear-gradient(135deg, #5046e5 0%, #e5466b 100%)",
    nodeBg: "#f0eff2", leafBg: "#ecfdf5", leafBorder: "#16a34a40",
    internalBg: "#eef2ff", internalBorder: "#5046e540",
  },
};

// ========== ANIMATED TREE NODE ==========
function TreeNode({ x, y, label, type, t, delay = 0, onClick, highlight }) {
  const isLeaf = type === "leaf";
  const isRoot = type === "root";
  const w = label.length > 12 ? 140 : 110;
  const h = 40;
  return (
    <g style={{ cursor: onClick ? "pointer" : "default", animation: `fadeUp 0.5s ${delay}s both` }} onClick={onClick}>
      <rect x={x - w/2} y={y - h/2} width={w} height={h} rx={isLeaf ? 20 : 10}
        fill={isLeaf ? t.leafBg : isRoot ? t.internalBg : t.nodeBg}
        stroke={isLeaf ? t.leafBorder : highlight ? t.accent : t.border}
        strokeWidth={highlight ? 2.5 : 1.5}
        style={{ filter: highlight ? `drop-shadow(0 0 8px ${t.accentGlow})` : "none" }}
      />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fill={isLeaf ? t.green : t.text} fontSize={11} fontWeight={600}
        fontFamily="'DM Sans', sans-serif">{label}</text>
    </g>
  );
}

function TreeEdge({ x1, y1, x2, y2, label, t, delay = 0 }) {
  const midY = y1 + (y2 - y1) * 0.5;
  return (
    <g style={{ animation: `fadeUp 0.4s ${delay}s both` }}>
      <path d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
        fill="none" stroke={t.border} strokeWidth={1.5} />
      {label && <text x={(x1+x2)/2 + (x2 > x1 ? 8 : -8)} y={(y1+y2)/2 - 4}
        textAnchor="middle" fill={t.textMuted} fontSize={10}
        fontFamily="'JetBrains Mono', monospace">{label}</text>}
    </g>
  );
}

// ========== SECTION: OVERVIEW ==========
function OverviewSection({ t }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.border}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.06 }}>🌳</div>
          <div style={{ fontSize: 13, color: t.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>WHAT IS CART?</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text, lineHeight: 1.3, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>Classification &<br/>Regression Tree</div>
          <div style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7 }}>
            Decision tree yang bisa digunakan untuk <span style={{ color: t.accent, fontWeight: 600 }}>classification</span> (output diskret) dan <span style={{ color: t.accent2, fontWeight: 600 }}>regression</span> (output kontinu). Analoginya seperti program <code style={{ background: t.surface, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>if-then-else</code> yang besar.
          </div>
        </div>
        <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 13, color: t.accent2, fontWeight: 700, letterSpacing: 1, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>SUPERVISED LEARNING</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { emoji: "📥", label: "Input (X)", desc: "Fitur-fitur data" },
              { emoji: "🎯", label: "Output (Y)", desc: "Label/Nilai target" },
              { emoji: "🔄", label: "Training", desc: "Belajar pola X→Y" },
              { emoji: "🔮", label: "Prediksi", desc: "Estimasi Y baru" },
            ].map((item, i) => (
              <div key={i} style={{ flex: "1 1 45%", background: t.surface, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.text }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual: How CART works */}
      <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.border}`, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: t.accent3, fontWeight: 700, letterSpacing: 1, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>CARA KERJA CART — ANALOGI SEDERHANA</div>
        <svg viewBox="0 0 700 220" style={{ width: "100%" }}>
          {/* Vehicle example tree */}
          <TreeNode x={350} y={30} label="Bisa terbang?" type="root" t={t} delay={0} />
          <TreeEdge x1={350} y1={50} x2={200} y2={90} label="Ya" t={t} delay={0.1} />
          <TreeEdge x1={350} y1={50} x2={500} y2={90} label="Tidak" t={t} delay={0.1} />
          <TreeNode x={200} y={110} label="Ada roda?" type="internal" t={t} delay={0.2} />
          <TreeNode x={500} y={110} label="Ada baling²?" type="internal" t={t} delay={0.2} />
          <TreeEdge x1={200} y1={130} x2={120} y2={170} label="Ya" t={t} delay={0.3} />
          <TreeEdge x1={200} y1={130} x2={280} y2={170} label="Tidak" t={t} delay={0.3} />
          <TreeEdge x1={500} y1={130} x2={420} y2={170} label="Ya" t={t} delay={0.3} />
          <TreeEdge x1={500} y1={130} x2={580} y2={170} label="Tidak" t={t} delay={0.3} />
          <TreeNode x={120} y={190} label="🚗 Mobil" type="leaf" t={t} delay={0.4} />
          <TreeNode x={280} y={190} label="⛵ Kapal" type="leaf" t={t} delay={0.4} />
          <TreeNode x={420} y={190} label="🚁 Helikopter" type="leaf" t={t} delay={0.4} />
          <TreeNode x={580} y={190} label="✈️ Pesawat" type="leaf" t={t} delay={0.4} />
        </svg>
      </div>
    </div>
  );
}

// ========== SECTION: LEARNING METHODS ==========
function LearningSection({ t }) {
  const [active, setActive] = useState(0);
  const methods = [
    { name: "Supervised", icon: "👨‍🏫", color: t.accent, desc: "Belajar dari data yang sudah ada label/jawaban", example: "Classification, Regression", visual: "Input + Label → Model → Prediksi", key: "CART termasuk di sini!" },
    { name: "Unsupervised", icon: "🔍", color: t.accent2, desc: "Belajar dari data TANPA label — cari pola sendiri", example: "Clustering, Dimensionality Reduction", visual: "Input (tanpa label) → Model → Pola/Grup", key: "Hasil bisa berbeda-beda" },
    { name: "Semi-supervised", icon: "🔄", color: t.accent3, desc: "Gabungan: sebagian data ada label, sebagian tidak", example: "Label Propagation, Self-Training", visual: "Sedikit Label + Banyak Unlabeled → Model", key: "Hemat biaya labeling" },
    { name: "Reinforcement", icon: "🎮", color: t.accent4, desc: "Belajar dari reward/punishment atas aksi yang dilakukan", example: "Game AI, Robot Control", visual: "Aksi → Reward/Punishment → Perbaiki", key: "Trial and error" },
  ];
  const m = methods[active];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {methods.map((mt, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex: 1, padding: "14px 12px", borderRadius: 12, border: `1.5px solid ${active === i ? mt.color : t.border}`,
            background: active === i ? `${mt.color}12` : t.card, cursor: "pointer", transition: "all 0.3s",
          }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{mt.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: active === i ? mt.color : t.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{mt.name}</div>
          </button>
        ))}
      </div>
      <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1.5px solid ${m.color}30`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -10, right: 10, fontSize: 80, opacity: 0.05 }}>{m.icon}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{m.icon}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text, fontFamily: "'DM Sans', sans-serif" }}>{m.name} Learning</div>
            <div style={{ fontSize: 12, color: m.color, fontWeight: 600 }}>{m.example}</div>
          </div>
        </div>
        <div style={{ fontSize: 15, color: t.text, lineHeight: 1.7, marginBottom: 16 }}>{m.desc}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ background: t.surface, borderRadius: 10, padding: "10px 16px", flex: 1 }}>
            <div style={{ fontSize: 10, color: t.textDim, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>FLOW</div>
            <div style={{ fontSize: 13, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>{m.visual}</div>
          </div>
          <div style={{ background: `${m.color}10`, borderRadius: 10, padding: "10px 16px", border: `1px solid ${m.color}20` }}>
            <div style={{ fontSize: 10, color: m.color, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>KEY POINT</div>
            <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{m.key}</div>
          </div>
        </div>
      </div>
      
      {/* Classification vs Regression */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ background: t.card, borderRadius: 14, padding: 20, border: `1px solid ${t.accent}25` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: t.accent }}/>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.accent }}>Classification</span>
          </div>
          <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 8 }}>Output Y = <strong style={{ color: t.text }}>diskret</strong> (kategori)</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Spam/Not Spam", "Kucing/Anjing", "Iya/Tidak"].map((ex, i) => (
              <span key={i} style={{ background: `${t.accent}12`, color: t.accent, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{ex}</span>
            ))}
          </div>
        </div>
        <div style={{ background: t.card, borderRadius: 14, padding: 20, border: `1px solid ${t.accent2}25` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: t.accent2 }}/>
            <span style={{ fontSize: 14, fontWeight: 700, color: t.accent2 }}>Regression</span>
          </div>
          <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 8 }}>Output Y = <strong style={{ color: t.text }}>kontinu</strong> (angka)</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Harga Rumah", "Nilai Ujian", "Temperatur"].map((ex, i) => (
              <span key={i} style={{ background: `${t.accent2}12`, color: t.accent2, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{ex}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== SECTION: STRUCTURE ==========
function StructureSection({ t }) {
  const [highlight, setHighlight] = useState(null);
  const parts = [
    { id: "internal", name: "Internal Node", color: t.accent, icon: "🔵", desc: "Tempat pengujian/pertanyaan terhadap suatu variabel input. Contoh: 'Umur ≤ 12.5?'" },
    { id: "edge", name: "Edge (Cabang)", color: t.accent4, icon: "➡️", desc: "Representasi nilai-nilai yang mungkin dari variabel input. Contoh: 'Ya' / 'Tidak', atau '≤ t' / '> t'" },
    { id: "leaf", name: "Leaf Node", color: t.green, icon: "🟢", desc: "Node akhir yang memberikan output/prediksi. Di classification = kelas, di regression = rata-rata nilai." },
  ];
  return (
    <div>
      <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.border}`, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: t.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>ANATOMI DECISION TREE</div>
        <svg viewBox="0 0 600 250" style={{ width: "100%" }}>
          {/* Root */}
          <TreeNode x={300} y={30} label="Root Node" type="root" t={t} highlight={highlight === "internal"} />
          <TreeEdge x1={300} y1={50} x2={150} y2={100} label="≤ t" t={t} delay={0} />
          <TreeEdge x1={300} y1={50} x2={450} y2={100} label="> t" t={t} delay={0} />
          <TreeNode x={150} y={120} label="Internal Node" type="internal" t={t} highlight={highlight === "internal"} />
          <TreeNode x={450} y={120} label="Leaf: Kelas A" type="leaf" t={t} highlight={highlight === "leaf"} />
          <TreeEdge x1={150} y1={140} x2={80} y2={190} label="Ya" t={t} />
          <TreeEdge x1={150} y1={140} x2={220} y2={190} label="Tidak" t={t} />
          <TreeNode x={80} y={210} label="Leaf: Kelas B" type="leaf" t={t} highlight={highlight === "leaf"} />
          <TreeNode x={220} y={210} label="Leaf: Kelas A" type="leaf" t={t} highlight={highlight === "leaf"} />
          
          {/* Annotations */}
          {highlight === "edge" && <>
            <rect x={195} y={65} width={50} height={20} rx={4} fill={t.accent4} opacity={0.3} />
            <rect x={380} y={65} width={50} height={20} rx={4} fill={t.accent4} opacity={0.3} />
          </>}
        </svg>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {parts.map((p, i) => (
          <div key={i}
            onMouseEnter={() => setHighlight(p.id)} onMouseLeave={() => setHighlight(null)}
            style={{ background: highlight === p.id ? `${p.color}12` : t.card, borderRadius: 14, padding: 18, border: `1.5px solid ${highlight === p.id ? p.color : t.border}`, cursor: "pointer", transition: "all 0.3s" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: p.color, marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== SECTION: ALGORITHM ==========
function AlgorithmSection({ t }) {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "1. Kumpulkan Data di Node", desc: "Di node i, kumpulkan semua data (examples) yang 'sampai' di node tersebut. Di root node, semua data training ada di sini.", visual: "📦", formula: "𝒟ᵢ = {(xₙ, yₙ) ∈ Nᵢ}" },
    { title: "2. Coba Semua Split", desc: "Untuk SETIAP variabel input j dan SETIAP kemungkinan nilai t, coba bagi data jadi 2 kelompok.", visual: "✂️", formula: "𝒟ᵢ¹(j,t) dan 𝒟ᵢ²(j,t)" },
    { title: "3. Hitung Cost Tiap Split", desc: "Hitung cost (Gini/Entropy/MSE) untuk tiap kemungkinan split. Cost rendah = split bagus!", visual: "📐", formula: "(|𝒟¹|/|𝒟|)·cost(𝒟¹) + (|𝒟²|/|𝒟|)·cost(𝒟²)" },
    { title: "4. Pilih Split Terbaik", desc: "Pilih pasangan (variabel j, threshold t) yang menghasilkan cost PALING KECIL.", visual: "🏆", formula: "arg min cost(split)" },
    { title: "5. Buat Node Anak", desc: "Split data jadi 2 node anak berdasarkan split terbaik. Ulangi dari langkah 1 untuk tiap anak!", visual: "🔀", formula: "𝒟ᵢ₁ = 𝒟¹, 𝒟ᵢ₂ = 𝒟²" },
    { title: "6. Berhenti Ketika...", desc: "Node sudah pure (semua data sama labelnya), atau tidak ada variabel tersisa, atau hyperparameter tercapai.", visual: "🛑", formula: "cost(𝒟ᵢ) = 0 → leaf node" },
  ];
  const s = steps[step];
  
  return (
    <div>
      <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.border}`, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: t.accent, fontWeight: 700, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace" }}>ALGORITMA CART — STEP BY STEP</div>
          <div style={{ display: "flex", gap: 6 }}>
            {steps.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${step === i ? t.accent : t.border}`,
                background: step === i ? `${t.accent}18` : "transparent", cursor: "pointer",
                color: step === i ? t.accent : t.textMuted, fontSize: 12, fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace"
              }}>{i + 1}</button>
            ))}
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ fontSize: 48, width: 70, height: 70, borderRadius: 16, background: `${t.accent}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.visual}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{s.title}</div>
            <div style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7, marginBottom: 12 }}>{s.desc}</div>
            <div style={{ background: t.surface, borderRadius: 10, padding: "10px 16px", display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: t.accent, border: `1px solid ${t.accent}20` }}>{s.formula}</div>
          </div>
        </div>
      </div>
      
      {/* Split Types */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: t.card, borderRadius: 14, padding: 20, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 12, color: t.blue, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>VARIABEL NUMERIK</div>
          <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7, marginBottom: 10 }}>
            Split berdasarkan threshold: <code style={{ color: t.text, background: t.surface, padding: "1px 6px", borderRadius: 4 }}>xⱼ ≤ t</code> vs <code style={{ color: t.text, background: t.surface, padding: "1px 6px", borderRadius: 4 }}>xⱼ {'>'} t</code>
          </div>
          <div style={{ fontSize: 12, color: t.textMuted }}>
            Split point = <span style={{ color: t.blue }}>midpoint</span> antara nilai-nilai yang ada.
            <br/>Misal: 7, 12, 18 → split points = {"{"}9.5, 15{"}"}
          </div>
        </div>
        <div style={{ background: t.card, borderRadius: 14, padding: 20, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 12, color: t.accent2, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>VARIABEL KATEGORIKAL</div>
          <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7, marginBottom: 10 }}>
            Split berdasarkan nilai: <code style={{ color: t.text, background: t.surface, padding: "1px 6px", borderRadius: 4 }}>xⱼ = t</code> vs <code style={{ color: t.text, background: t.surface, padding: "1px 6px", borderRadius: 4 }}>xⱼ ≠ t</code>
          </div>
          <div style={{ fontSize: 12, color: t.textMuted }}>
            Jika k nilai berbeda → <span style={{ color: t.accent2 }}>k binary split</span> berbeda,
            <br/>atau 1 <span style={{ color: t.accent2 }}>multi-way split</span> → k cabang
          </div>
        </div>
      </div>
      
      <div style={{ background: `${t.accent4}08`, borderRadius: 12, padding: 16, marginTop: 12, border: `1px solid ${t.accent4}20` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.accent4, marginBottom: 4 }}>⚡ PENTING: CART = GREEDY</div>
        <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>CART memilih split terbaik di SETIAP node secara lokal. Tidak melihat ke depan! Artinya hasilnya mungkin bukan global optimum, tapi prosesnya cepat.</div>
      </div>
    </div>
  );
}

// ========== SECTION: COST FUNCTIONS ==========
function CostSection({ t }) {
  const [tab, setTab] = useState("gini");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { id: "gini", label: "Gini Index", color: t.accent },
          { id: "entropy", label: "Entropy", color: t.accent2 },
          { id: "mse", label: "MSE (Regression)", color: t.accent3 },
        ].map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${tab === tb.id ? tb.color : t.border}`,
            background: tab === tb.id ? `${tb.color}12` : t.card, cursor: "pointer",
            color: tab === tb.id ? tb.color : t.textMuted, fontSize: 13, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s"
          }}>{tb.label}</button>
        ))}
      </div>
      
      {tab === "gini" && (
        <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.accent}25` }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>Gini Index</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>Mengukur seberapa "campur" sebuah node. Makin kecil = makin murni (bagus!)</div>
          
          <div style={{ background: t.surface, borderRadius: 12, padding: 20, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontFamily: "'JetBrains Mono', monospace", color: t.text, marginBottom: 8 }}>
              𝒢 = 1 − Σ p²<sub>c</sub>
            </div>
            <div style={{ fontSize: 12, color: t.textMuted }}>dimana p<sub>c</sub> = proporsi data kelas c di node tersebut</div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div style={{ background: `${t.green}08`, borderRadius: 10, padding: 14, border: `1px solid ${t.green}20`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: t.green, fontWeight: 700, marginBottom: 6 }}>PURE NODE</div>
              <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 6 }}>
                {[1,1,1,1].map((_,i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: t.green }}/>)}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: t.text }}>𝒢 = 1 − 1² = <strong>0</strong></div>
            </div>
            <div style={{ background: `${t.accent4}08`, borderRadius: 10, padding: 14, border: `1px solid ${t.accent4}20`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: t.accent4, fontWeight: 700, marginBottom: 6 }}>AGAK CAMPUR</div>
              <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 6 }}>
                {[1,1,1,0].map((v,i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: v ? t.green : t.red }}/>)}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: t.text }}>𝒢 = 1−(¾)²−(¼)² = <strong>0.375</strong></div>
            </div>
            <div style={{ background: `${t.red}08`, borderRadius: 10, padding: 14, border: `1px solid ${t.red}20`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: t.red, fontWeight: 700, marginBottom: 6 }}>SANGAT CAMPUR</div>
              <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 6 }}>
                {[1,0,1,0].map((v,i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: v ? t.green : t.red }}/>)}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: t.text }}>𝒢 = 1−(½)²−(½)² = <strong>0.5</strong></div>
            </div>
          </div>
          
          <div style={{ background: `${t.accent}08`, borderRadius: 10, padding: 14, marginTop: 12, border: `1px solid ${t.accent}15` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.accent, marginBottom: 4 }}>💡 CARA HITUNG COST SPLIT</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: t.text, lineHeight: 1.8 }}>
              cost(split) = (n₁/N) × 𝒢₁ + (n₂/N) × 𝒢₂
            </div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>n₁, n₂ = jumlah data di tiap anak, N = total data di parent</div>
          </div>
        </div>
      )}
      
      {tab === "entropy" && (
        <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.accent2}25` }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 4 }}>Entropy (Deviance/Impurity)</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>Alternatif dari Gini. Mengukur "ketidakpastian" di sebuah node.</div>
          
          <div style={{ background: t.surface, borderRadius: 12, padding: 20, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontFamily: "'JetBrains Mono', monospace", color: t.text, marginBottom: 8 }}>
              H = −Σ p<sub>c</sub> · log(p<sub>c</sub>)
            </div>
            <div style={{ fontSize: 12, color: t.textMuted }}>Entropy = 0 artinya node pure, makin besar = makin campur</div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: `${t.green}08`, borderRadius: 10, padding: 14, border: `1px solid ${t.green}20`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: t.green, fontWeight: 700, marginBottom: 6 }}>PURE: [4, 0]</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: t.text }}>H = <strong>0</strong></div>
            </div>
            <div style={{ background: `${t.red}08`, borderRadius: 10, padding: 14, border: `1px solid ${t.red}20`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: t.red, fontWeight: 700, marginBottom: 6 }}>MAX IMPURE: [2, 2]</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: t.text }}>H = <strong>1.0</strong> (log₂)</div>
            </div>
          </div>
          
          <div style={{ background: `${t.accent2}08`, borderRadius: 10, padding: 14, marginTop: 12, border: `1px solid ${t.accent2}15` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.accent2, marginBottom: 4 }}>🔑 GINI vs ENTROPY</div>
            <div style={{ fontSize: 13, color: t.textMuted }}>Keduanya mengukur "kemurnian" node. Gini lebih cepat dihitung, Entropy lebih sensitif terhadap perubahan probabilitas. Dalam praktik, hasilnya sering mirip.</div>
          </div>
        </div>
      )}
      
      {tab === "mse" && (
        <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.accent3}25` }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: t.text, marginBottom: 4 }}>Mean Squared Error (MSE)</div>
          <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 16 }}>Untuk <strong>regression tree</strong>. Mengukur seberapa jauh nilai-nilai dari rata-ratanya.</div>
          
          <div style={{ background: t.surface, borderRadius: 12, padding: 20, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontFamily: "'JetBrains Mono', monospace", color: t.text, marginBottom: 8 }}>
              cost(𝒟) = (1/|𝒟|) Σ (yₙ − ȳ)²
            </div>
            <div style={{ fontSize: 12, color: t.textMuted }}>ȳ = rata-rata nilai output di node tersebut</div>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: `${t.green}08`, borderRadius: 10, padding: 14, border: `1px solid ${t.green}20`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: t.green, fontWeight: 700, marginBottom: 6 }}>NILAI MIRIP</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Data: [74, 75, 73]</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: t.text }}>ȳ=74, MSE = <strong>0.67</strong></div>
            </div>
            <div style={{ background: `${t.red}08`, borderRadius: 10, padding: 14, border: `1px solid ${t.red}20`, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: t.red, fontWeight: 700, marginBottom: 6 }}>NILAI BERVARIASI</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Data: [23, 42, 11]</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: t.text }}>ȳ=25.3, MSE = <strong>161.6</strong></div>
            </div>
          </div>
          
          <div style={{ background: `${t.accent3}08`, borderRadius: 10, padding: 14, marginTop: 12, border: `1px solid ${t.accent3}15` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.accent3, marginBottom: 4 }}>📌 LEAF NODE VALUE</div>
            <div style={{ fontSize: 13, color: t.textMuted }}>Di regression tree, leaf node mengembalikan <strong style={{ color: t.text }}>rata-rata</strong> nilai output dari semua data di node tersebut.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== SECTION: CLASSIFICATION TREE WALKTHROUGH ==========
function ClassificationSection({ t }) {
  const [walkStep, setWalkStep] = useState(0);
  const data = [
    { no: 1, pop: "Iya", soda: "Iya", umur: 7, ice: "Tidak" },
    { no: 2, pop: "Iya", soda: "Tidak", umur: 12, ice: "Tidak" },
    { no: 3, pop: "Tidak", soda: "Iya", umur: 18, ice: "Iya" },
    { no: 4, pop: "Tidak", soda: "Iya", umur: 35, ice: "Iya" },
    { no: 5, pop: "Iya", soda: "Iya", umur: 38, ice: "Iya" },
    { no: 6, pop: "Iya", soda: "Tidak", umur: 50, ice: "Tidak" },
    { no: 7, pop: "Tidak", soda: "Tidak", umur: 83, ice: "Tidak" },
  ];
  
  const walkSteps = [
    { title: "Data Training", desc: "7 data. Tujuan: prediksi siapa yang suka Ice Age. 3 input: Suka Popcorn, Suka Soda, Umur. 1 output: Suka Ice Age (Iya/Tidak).", splitInfo: null },
    { title: "Hitung Cost: Split 'Suka Popcorn'", desc: "Iya→{1,2,5,6}: 1 Iya + 3 Tidak. Tidak→{3,4,7}: 2 Iya + 1 Tidak.", splitInfo: { name: "Popcorn", cost: "0.405" } },
    { title: "Hitung Cost: Split 'Suka Soda'", desc: "Iya→{1,3,4,5}: 3 Iya + 1 Tidak, 𝒢=0.375. Tidak→{2,6,7}: 0 Iya + 3 Tidak, 𝒢=0. Total = (4/7)(0.375) + (3/7)(0) = 0.214", splitInfo: { name: "Soda", cost: "0.214 ✨ Terbaik!" } },
    { title: "Hitung Cost: Split 'Umur' (best = 15 atau 44)", desc: "Dicoba semua midpoint: 9.5, 15, 26.5, 36.5, 44, 66.5. Cost terendah di t=15 atau t=44 → cost = 0.343.", splitInfo: { name: "Umur (best)", cost: "0.343" } },
    { title: "Root Split → Suka Soda!", desc: "Minimum cost = 0.214 → Split root menggunakan 'Suka Minuman Soda'. Cabang 'Tidak' → semua Tidak suka Ice Age → LEAF. Cabang 'Iya' masih campur → lanjut split.", splitInfo: null },
    { title: "Split Cabang 'Iya' → Umur ≤ 12.5", desc: "Data {1,3,4,5}. Coba Popcorn → cost 0.25. Coba Umur t=12.5 → cost 0. Pilih Umur! Semua node anak sudah pure → jadi LEAF.", splitInfo: null },
  ];
  const ws = walkSteps[walkStep];
  
  return (
    <div>
      {/* Data Table */}
      <div style={{ background: t.card, borderRadius: 14, padding: 16, border: `1px solid ${t.border}`, marginBottom: 16, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
          <thead>
            <tr>
              {["No", "Popcorn", "Soda", "Umur", "Ice Age"].map((h, i) => (
                <th key={i} style={{ padding: "8px 12px", textAlign: "left", color: t.textDim, fontSize: 11, fontWeight: 700, letterSpacing: 1, borderBottom: `1px solid ${t.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td style={{ padding: "6px 12px", color: t.textMuted, borderBottom: `1px solid ${t.border}08` }}>{d.no}</td>
                <td style={{ padding: "6px 12px", color: t.text, borderBottom: `1px solid ${t.border}08` }}>
                  <span style={{ background: d.pop === "Iya" ? `${t.blue}15` : `${t.red}10`, color: d.pop === "Iya" ? t.blue : t.red, padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{d.pop}</span>
                </td>
                <td style={{ padding: "6px 12px", borderBottom: `1px solid ${t.border}08` }}>
                  <span style={{ background: d.soda === "Iya" ? `${t.accent3}15` : `${t.accent4}10`, color: d.soda === "Iya" ? t.accent3 : t.accent4, padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{d.soda}</span>
                </td>
                <td style={{ padding: "6px 12px", color: t.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, borderBottom: `1px solid ${t.border}08` }}>{d.umur}</td>
                <td style={{ padding: "6px 12px", borderBottom: `1px solid ${t.border}08` }}>
                  <span style={{ background: d.ice === "Iya" ? `${t.green}15` : `${t.red}15`, color: d.ice === "Iya" ? t.green : t.red, padding: "2px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{d.ice}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Walkthrough */}
      <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.border}`, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: t.accent, fontWeight: 700, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace" }}>STEP {walkStep + 1} / {walkSteps.length}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setWalkStep(Math.max(0, walkStep - 1))} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.surface, cursor: "pointer", color: t.text, fontSize: 12, fontWeight: 600 }}>← Prev</button>
            <button onClick={() => setWalkStep(Math.min(walkSteps.length - 1, walkStep + 1))} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.accent}`, background: `${t.accent}15`, cursor: "pointer", color: t.accent, fontSize: 12, fontWeight: 600 }}>Next →</button>
          </div>
        </div>
        
        <div style={{ fontSize: 17, fontWeight: 700, color: t.text, marginBottom: 8, fontFamily: "'DM Sans', sans-serif" }}>{ws.title}</div>
        <div style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7, marginBottom: ws.splitInfo ? 12 : 0 }}>{ws.desc}</div>
        
        {ws.splitInfo && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: t.surface, borderRadius: 10, padding: "8px 16px" }}>
            <span style={{ fontSize: 12, color: t.textDim }}>Cost =</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: ws.splitInfo.cost.includes("✨") ? t.green : t.text }}>{ws.splitInfo.cost}</span>
          </div>
        )}
      </div>
      
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 16 }}>
        {walkSteps.map((_, i) => (
          <div key={i} onClick={() => setWalkStep(i)} style={{ width: i === walkStep ? 24 : 8, height: 8, borderRadius: 4, background: i <= walkStep ? t.accent : t.border, cursor: "pointer", transition: "all 0.3s" }}/>
        ))}
      </div>
      
      {/* Final Tree Visualization */}
      <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 13, color: t.green, fontWeight: 700, letterSpacing: 1, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>HASIL AKHIR: CLASSIFICATION TREE</div>
        <svg viewBox="0 0 600 230" style={{ width: "100%" }}>
          <TreeNode x={300} y={30} label="Suka Soda?" type="root" t={t} />
          <TreeEdge x1={300} y1={50} x2={160} y2={95} label="Iya" t={t} />
          <TreeEdge x1={300} y1={50} x2={460} y2={95} label="Tidak" t={t} />
          <TreeNode x={160} y={115} label="Umur ≤ 12.5?" type="internal" t={t} />
          <TreeNode x={460} y={115} label="❌ Tidak Suka" type="leaf" t={t} />
          <TreeEdge x1={160} y1={135} x2={80} y2={180} label="Ya" t={t} />
          <TreeEdge x1={160} y1={135} x2={240} y2={180} label="Tidak" t={t} />
          <TreeNode x={80} y={200} label="❌ Tidak Suka" type="leaf" t={t} />
          <TreeNode x={240} y={200} label="✅ Suka!" type="leaf" t={t} />
        </svg>
        
        <div style={{ background: `${t.accent3}08`, borderRadius: 10, padding: 14, marginTop: 12, border: `1px solid ${t.accent3}15` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.accent3, marginBottom: 4 }}>🧪 PREDIKSI: Suka Popcorn=Iya, Suka Soda=Iya, Umur=31</div>
          <div style={{ fontSize: 13, color: t.textMuted }}>Suka Soda? → Iya → Umur ≤ 12.5? → 31 {'>'} 12.5 → Tidak → <strong style={{ color: t.green }}>✅ Suka Ice Age!</strong></div>
        </div>
      </div>
    </div>
  );
}

// ========== SECTION: REGRESSION TREE ==========
function RegressionSection({ t }) {
  const data = [
    { no: 1, vid: "Semua", lab: "Iya", ujian: 74 },
    { no: 2, vid: "Sebagian", lab: "Tidak", ujian: 23 },
    { no: 3, vid: "Semua", lab: "Iya", ujian: 61 },
    { no: 4, vid: "Semua", lab: "Iya", ujian: 74 },
    { no: 5, vid: "Sebagian", lab: "Tidak", ujian: 25 },
    { no: 6, vid: "Semua", lab: "Iya", ujian: 61 },
    { no: 7, vid: "Sebagian", lab: "Iya", ujian: 54 },
    { no: 8, vid: "Sebagian", lab: "Tidak", ujian: 42 },
  ];
  
  return (
    <div>
      <div style={{ background: t.card, borderRadius: 14, padding: 16, border: `1px solid ${t.border}`, marginBottom: 16, overflowX: "auto" }}>
        <div style={{ fontSize: 13, color: t.accent2, fontWeight: 700, letterSpacing: 1, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace" }}>DATA: PREDIKSI NILAI UJIAN</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["#", "Video Tutorial", "Lab Lengkap?", "Ujian"].map((h, i) => (
                <th key={i} style={{ padding: "6px 10px", textAlign: "left", color: t.textDim, fontSize: 11, fontWeight: 700, borderBottom: `1px solid ${t.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td style={{ padding: "5px 10px", color: t.textMuted, borderBottom: `1px solid ${t.border}08` }}>{d.no}</td>
                <td style={{ padding: "5px 10px", color: t.text, borderBottom: `1px solid ${t.border}08` }}>{d.vid}</td>
                <td style={{ padding: "5px 10px", borderBottom: `1px solid ${t.border}08` }}>
                  <span style={{ color: d.lab === "Iya" ? t.green : t.red, fontWeight: 600, fontSize: 12 }}>{d.lab}</span>
                </td>
                <td style={{ padding: "5px 10px", color: t.accent, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", borderBottom: `1px solid ${t.border}08` }}>{d.ujian}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: t.card, borderRadius: 14, padding: 18, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 12, color: t.accent4, fontWeight: 700, marginBottom: 8 }}>SPLIT: VIDEO TUTORIAL</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: t.textMuted, lineHeight: 2 }}>
            Semua → ȳ=69.67, MSE=37.89<br/>
            Sebagian → ȳ=29.56, MSE=265.8
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: t.text, marginTop: 8, fontWeight: 700 }}>
            Cost = <span style={{ color: t.accent4 }}>174.6</span>
          </div>
        </div>
        <div style={{ background: `${t.green}05`, borderRadius: 14, padding: 18, border: `1px solid ${t.green}20` }}>
          <div style={{ fontSize: 12, color: t.green, fontWeight: 700, marginBottom: 8 }}>SPLIT: LAB LENGKAP ✨</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: t.textMuted, lineHeight: 2 }}>
            Iya → ȳ=65.88, MSE=71.61<br/>
            Tidak → ȳ=22.43, MSE=113.1
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: t.text, marginTop: 8, fontWeight: 700 }}>
            Cost = <span style={{ color: t.green }}>90.97</span> ← Terbaik!
          </div>
        </div>
      </div>
      
      {/* Final Regression Tree */}
      <div style={{ background: t.card, borderRadius: 16, padding: 24, border: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 13, color: t.accent2, fontWeight: 700, letterSpacing: 1, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>HASIL: REGRESSION TREE</div>
        <svg viewBox="0 0 600 250" style={{ width: "100%" }}>
          <TreeNode x={300} y={28} label="Lab Lengkap?" type="root" t={t} />
          <TreeEdge x1={300} y1={48} x2={150} y2={90} label="Iya" t={t} />
          <TreeEdge x1={300} y1={48} x2={450} y2={90} label="Tidak" t={t} />
          <TreeNode x={150} y={110} label="Video Tutorial?" type="internal" t={t} />
          <TreeNode x={450} y={110} label="Video Tutorial?" type="internal" t={t} />
          <TreeEdge x1={150} y1={130} x2={75} y2={175} label="Semua" t={t} />
          <TreeEdge x1={150} y1={130} x2={225} y2={175} label="Sebagian" t={t} />
          <TreeEdge x1={450} y1={130} x2={375} y2={175} label="Semua" t={t} />
          <TreeEdge x1={450} y1={130} x2={525} y2={175} label="Sebagian" t={t} />
          <TreeNode x={75} y={195} label="ȳ = 71.4" type="leaf" t={t} />
          <TreeNode x={225} y={195} label="ȳ = 56.67" type="leaf" t={t} />
          <TreeNode x={375} y={195} label="ȳ = ?" type="leaf" t={t} />
          <TreeNode x={525} y={195} label="ȳ = 22.43" type="leaf" t={t} />
        </svg>
        
        <div style={{ background: `${t.accent2}08`, borderRadius: 10, padding: 14, marginTop: 12, border: `1px solid ${t.accent2}15` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.accent2, marginBottom: 4 }}>📌 PERBEDAAN DENGAN CLASSIFICATION</div>
          <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>
            1. Cost function = <strong style={{ color: t.text }}>MSE</strong> (bukan Gini/Entropy)<br/>
            2. Leaf mengembalikan <strong style={{ color: t.text }}>rata-rata</strong> nilai output (bukan kelas mayoritas)<br/>
            3. Leaf kosong? → gunakan rata-rata dari parent node
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== SECTION: HYPERPARAMETERS ==========
function HyperparamsSection({ t }) {
  const params = [
    { name: "max_depth", desc: "Kedalaman maksimum tree. Makin dalam = makin detail tapi risiko overfit.", icon: "📏", risk: "Terlalu dalam → overfit", safe: "Mulai dari 3-5" },
    { name: "min_samples_split", desc: "Minimum data di node agar boleh di-split lagi.", icon: "✂️", risk: "Terlalu kecil → overfit", safe: "Default: 2" },
    { name: "min_samples_leaf", desc: "Minimum data agar bisa jadi leaf node.", icon: "🍃", risk: "Terlalu kecil → leaf terlalu spesifik", safe: "Default: 1" },
    { name: "max_features", desc: "Jumlah fitur yang dipertimbangkan saat split.", icon: "🎯", risk: "Terlalu sedikit → miss pattern", safe: "None = semua" },
    { name: "max_leaf_nodes", desc: "Batas maksimum jumlah leaf dalam tree.", icon: "🌿", risk: "Terlalu banyak → overfit", safe: "None = unlimited" },
  ];
  
  return (
    <div>
      <div style={{ background: t.card, borderRadius: 16, padding: 20, border: `1px solid ${t.border}`, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: t.accent, fontWeight: 700, letterSpacing: 1, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>PARAMETER vs HYPERPARAMETER</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <div style={{ background: t.surface, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.accent, marginBottom: 6 }}>Parameter</div>
            <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>Dipelajari <strong style={{ color: t.text }}>SELAMA</strong> training. Contoh: struktur tree, split points.</div>
          </div>
          <div style={{ background: t.surface, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.accent2, marginBottom: 6 }}>Hyperparameter</div>
            <div style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>Ditentukan <strong style={{ color: t.text }}>SEBELUM</strong> training. Mengontrol proses learning.</div>
          </div>
        </div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {params.map((p, i) => (
          <div key={i} style={{ background: t.card, borderRadius: 14, padding: 18, border: `1px solid ${t.border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28, width: 44, height: 44, borderRadius: 10, background: t.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: t.accent, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 8 }}>{p.desc}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ background: `${t.red}10`, color: t.red, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>⚠️ {p.risk}</span>
                <span style={{ background: `${t.green}10`, color: t.green, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>✅ {p.safe}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== SECTION: PROS & CONS ==========
function ProsConsSection({ t }) {
  const pros = [
    { text: "Mudah diinterpretasi", detail: "Bisa dibaca seperti if-then-else" },
    { text: "Bisa handle mix data", detail: "Diskret + kontinu sekaligus" },
    { text: "Tidak perlu standardisasi", detail: "Split berdasarkan ranking, bukan skala" },
    { text: "Otomatis feature selection", detail: "Fitur tidak relevan → tidak dipilih" },
    { text: "Robust terhadap outlier", detail: "Split poin = ranking, bukan nilai absolut" },
    { text: "Cepat & scalable", detail: "Training & prediksi sangat efisien" },
    { text: "Handle missing values", detail: "Bisa pakai surrogate splits" },
  ];
  const cons = [
    { text: "Akurasi lebih rendah", detail: "Karena greedy, bukan globally optimal" },
    { text: "Tidak stabil (high variance)", detail: "Perubahan kecil di data → tree berubah banyak" },
    { text: "Nonlinear model", detail: "Sulit memisahkan data yang linearly separable" },
    { text: "Risiko overfitting", detail: "Tree bisa terlalu dalam, hafal data training" },
  ];
  
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.green, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>✅</span> Kelebihan
          </div>
          {pros.map((p, i) => (
            <div key={i} style={{ background: `${t.green}06`, borderRadius: 10, padding: "10px 14px", marginBottom: 8, borderLeft: `3px solid ${t.green}40` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 2 }}>{p.text}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{p.detail}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.red, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 18 }}>❌</span> Kekurangan
          </div>
          {cons.map((c, i) => (
            <div key={i} style={{ background: `${t.red}06`, borderRadius: 10, padding: "10px 14px", marginBottom: 8, borderLeft: `3px solid ${t.red}40` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 2 }}>{c.text}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{c.detail}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Issues */}
      <div style={{ background: t.card, borderRadius: 16, padding: 20, border: `1px solid ${t.border}`, marginTop: 16 }}>
        <div style={{ fontSize: 13, color: t.accent4, fontWeight: 700, letterSpacing: 1, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>ISU PENTING</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: t.surface, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.accent4, marginBottom: 4 }}>Missing Values</div>
            <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>
              Solusi: <strong style={{ color: t.text }}>Imputation</strong> saat preprocessing, atau pakai <strong style={{ color: t.text }}>surrogate splits</strong> (split alternatif yang hasilnya mirip).
            </div>
          </div>
          <div style={{ background: t.surface, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.accent4, marginBottom: 4 }}>Data Fragmentation</div>
            <div style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.6 }}>
              Multi-way split bisa menyebabkan sub-tree dengan <strong style={{ color: t.text }}>data terlalu sedikit</strong> → overfitting. Solusi: batasi dengan hyperparameters.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== MAIN APP ==========
export default function CARTVisualization() {
  const [dark, setDark] = useState(false);
  const [section, setSection] = useState("overview");
  const t = dark ? themes.dark : themes.light;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'DM Sans', sans-serif", transition: "background 0.4s, color 0.4s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
        code { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: `${t.bg}ee`, backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🌳</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>CART — Classification & Regression Tree</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>Materi 7 · KASDAD · Semester Genap 2025/2026</div>
          </div>
        </div>
        <button onClick={() => setDark(!dark)} style={{
          width: 40, height: 40, borderRadius: 10, border: `1px solid ${t.border}`,
          background: t.surface, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center"
        }}>{dark ? "☀️" : "🌙"}</button>
      </div>
      
      {/* Navigation */}
      <div style={{ padding: "12px 24px", borderBottom: `1px solid ${t.border}`, display: "flex", gap: 4, overflowX: "auto", position: "sticky", top: 63, background: `${t.bg}ee`, backdropFilter: "blur(12px)", zIndex: 99 }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            padding: "8px 14px", borderRadius: 8, border: `1px solid ${section === s.id ? t.accent : "transparent"}`,
            background: section === s.id ? `${t.accent}12` : "transparent", cursor: "pointer",
            color: section === s.id ? t.accent : t.textMuted, fontSize: 12, fontWeight: 600,
            whiteSpace: "nowrap", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5
          }}>
            <span style={{ fontSize: 14 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px" }} key={section}>
        <div style={{ animation: "fadeUp 0.4s both" }}>
          {section === "overview" && <OverviewSection t={t} />}
          {section === "learning" && <LearningSection t={t} />}
          {section === "structure" && <StructureSection t={t} />}
          {section === "algorithm" && <AlgorithmSection t={t} />}
          {section === "cost" && <CostSection t={t} />}
          {section === "classification" && <ClassificationSection t={t} />}
          {section === "regression" && <RegressionSection t={t} />}
          {section === "hyperparams" && <HyperparamsSection t={t} />}
          {section === "proscons" && <ProsConsSection t={t} />}
        </div>
      </div>
    </div>
  );
}
