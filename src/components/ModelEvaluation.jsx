import { useState, useEffect, useRef, useMemo } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');`;

const SECTIONS = [
  { id: "overview", label: "Overview", icon: "🗺️" },
  { id: "methodology", label: "Metodologi", icon: "🔬" },
  { id: "regression", label: "Regresi", icon: "📈" },
  { id: "confusion", label: "Confusion Matrix", icon: "🎯" },
  { id: "metrics", label: "Metrik Klasifikasi", icon: "⚖️" },
  { id: "f1deep", label: "F1 & F-Beta", icon: "🔥" },
  { id: "roc", label: "ROC & AUC", icon: "📊" },
  { id: "multiclass", label: "Multiclass", icon: "🎨" },
  { id: "choosing", label: "Pilih Metrik", icon: "🧭" },
  { id: "ttest", label: "Statistical Test", icon: "🧪" },
];

// ============ THEME ============
const themes = {
  dark: {
    bg: "#0a0a0c", bgCard: "#111114", bgCard2: "#18181b", bgCard3: "#0f0f12",
    text: "#e4e4e7", textMuted: "#71717a", textDim: "#52525b",
    accent: "#e8b931", accent2: "#f59e0b", accent3: "#fbbf24",
    green: "#4ade80", red: "#f87171", blue: "#60a5fa", purple: "#a78bfa", pink: "#f472b6", cyan: "#22d3ee",
    border: "#27272a", borderLight: "#3f3f46",
    correct: "#22c55e", wrong: "#ef4444",
    glassBg: "rgba(17,17,20,0.85)", glassBlur: "blur(20px)",
  },
  light: {
    bg: "#f8f7f4", bgCard: "#ffffff", bgCard2: "#f1f0ed", bgCard3: "#e8e7e3",
    text: "#1c1917", textMuted: "#78716c", textDim: "#a8a29e",
    accent: "#b45309", accent2: "#d97706", accent3: "#f59e0b",
    green: "#16a34a", red: "#dc2626", blue: "#2563eb", purple: "#7c3aed", pink: "#db2777", cyan: "#0891b2",
    border: "#d6d3d1", borderLight: "#e7e5e4",
    correct: "#16a34a", wrong: "#dc2626",
    glassBg: "rgba(255,255,255,0.85)", glassBlur: "blur(20px)",
  },
};

// ============ ANIMATED NUMBER ============
function AnimNum({ value, duration = 800, decimals = 0, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = null;
    const from = 0;
    const to = value;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * ease);
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [value]);
  return <span>{display.toFixed(decimals)}{suffix}</span>;
}

// ============ INTERACTIVE CONFUSION MATRIX ============
function InteractiveConfusionMatrix({ t }) {
  const [tp, setTp] = useState(50);
  const [fn, setFn] = useState(10);
  const [fp, setFp] = useState(5);
  const [tn, setTn] = useState(35);
  const total = tp + fn + fp + tn;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
  const specificity = (tn + fp) > 0 ? tn / (tn + fp) : 0;
  const f1 = (precision + recall) > 0 ? 2 * precision * recall / (precision + recall) : 0;
  const gmean = Math.sqrt(recall * specificity);

  const SliderRow = ({ label, value, setValue, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, fontWeight: 600, color, width: 28, textAlign: "right" }}>{label}</span>
      <input type="range" min={0} max={200} value={value} onChange={e => setValue(+e.target.value)}
        style={{ flex: 1, accentColor: color, height: 4 }} />
      <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13, fontWeight: 600, color: t.text, width: 36, textAlign: "right" }}>{value}</span>
    </div>
  );

  const MetricBadge = ({ label, value, color, desc }) => (
    <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 12, padding: "10px 14px", textAlign: "center", minWidth: 90 }}>
      <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: t.textMuted, letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 22, fontWeight: 700, color }}>{(value * 100).toFixed(1)}%</div>
      {desc && <div style={{ fontFamily: "'Outfit'", fontSize: 9, color: t.textDim, marginTop: 3 }}>{desc}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Matrix Visual */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gridTemplateRows: "auto 1fr 1fr", gap: 3 }}>
            <div />
            <div style={{ textAlign: "center", fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: t.accent, padding: 6 }}>Pred +</div>
            <div style={{ textAlign: "center", fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: t.blue, padding: 6 }}>Pred −</div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: t.accent, padding: 6, textAlign: "right", writingMode: "horizontal-tb" }}>Act +</div>
            <div style={{ background: `${t.correct}18`, border: `2px solid ${t.correct}40`, borderRadius: 14, padding: 16, textAlign: "center", transition: "all 0.3s" }}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 10, color: t.correct, fontWeight: 600, marginBottom: 4 }}>TRUE POSITIVE</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 32, fontWeight: 700, color: t.correct }}>{tp}</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 9, color: t.textDim, marginTop: 2 }}>✅ Benar positif</div>
            </div>
            <div style={{ background: `${t.wrong}10`, border: `2px solid ${t.wrong}25`, borderRadius: 14, padding: 16, textAlign: "center", transition: "all 0.3s" }}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 10, color: t.wrong, fontWeight: 600, marginBottom: 4 }}>FALSE NEGATIVE</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 32, fontWeight: 700, color: t.wrong }}>{fn}</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 9, color: t.textDim, marginTop: 2 }}>😱 Positif lolos</div>
            </div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: t.blue, padding: 6, textAlign: "right" }}>Act −</div>
            <div style={{ background: `${t.wrong}10`, border: `2px solid ${t.wrong}25`, borderRadius: 14, padding: 16, textAlign: "center", transition: "all 0.3s" }}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 10, color: t.wrong, fontWeight: 600, marginBottom: 4 }}>FALSE POSITIVE</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 32, fontWeight: 700, color: t.wrong }}>{fp}</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 9, color: t.textDim, marginTop: 2 }}>🚨 Salah alarm</div>
            </div>
            <div style={{ background: `${t.correct}18`, border: `2px solid ${t.correct}40`, borderRadius: 14, padding: 16, textAlign: "center", transition: "all 0.3s" }}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 10, color: t.correct, fontWeight: 600, marginBottom: 4 }}>TRUE NEGATIVE</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 32, fontWeight: 700, color: t.correct }}>{tn}</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 9, color: t.textDim, marginTop: 2 }}>✅ Benar negatif</div>
            </div>
          </div>
        </div>
        {/* Sliders */}
        <div>
          <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 12, letterSpacing: 1 }}>GESER UNTUK EKSPLORASI</div>
          <SliderRow label="TP" value={tp} setValue={setTp} color={t.correct} />
          <SliderRow label="FN" value={fn} setValue={setFn} color={t.wrong} />
          <SliderRow label="FP" value={fp} setValue={setFp} color={t.wrong} />
          <SliderRow label="TN" value={tn} setValue={setTn} color={t.correct} />
          <div style={{ marginTop: 12, padding: "10px 14px", background: `${t.accent}08`, borderRadius: 10, border: `1px solid ${t.accent}20` }}>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textMuted }}>Total: <strong style={{ color: t.text }}>{total}</strong> sampel</div>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textMuted, marginTop: 2 }}>Aktual + : <strong style={{ color: t.accent }}>{tp + fn}</strong> | Aktual − : <strong style={{ color: t.blue }}>{fp + tn}</strong></div>
          </div>
        </div>
      </div>
      {/* Metrics */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <MetricBadge label="ACCURACY" value={accuracy} color={t.cyan} desc="(TP+TN)/All" />
        <MetricBadge label="PRECISION" value={precision} color={t.purple} desc="TP/(TP+FP)" />
        <MetricBadge label="RECALL" value={recall} color={t.accent} desc="TP/(TP+FN)" />
        <MetricBadge label="SPECIFICITY" value={specificity} color={t.blue} desc="TN/(TN+FP)" />
        <MetricBadge label="F1-SCORE" value={f1} color={t.pink} desc="Harmonic Mean" />
        <MetricBadge label="G-MEAN" value={gmean} color={t.green} desc="√(Sens×Spec)" />
      </div>
    </div>
  );
}

// ============ ROC SIMULATOR ============
function ROCSimulator({ t }) {
  const [quality, setQuality] = useState(70);
  const points = useMemo(() => {
    const pts = [];
    const q = quality / 100;
    for (let i = 0; i <= 20; i++) {
      const fpr = i / 20;
      const tpr = Math.min(1, Math.pow(fpr, 1 - q * 0.85));
      pts.push({ fpr, tpr });
    }
    return pts;
  }, [quality]);
  const auc = useMemo(() => {
    let area = 0;
    for (let i = 1; i < points.length; i++) {
      area += (points[i].fpr - points[i - 1].fpr) * (points[i].tpr + points[i - 1].tpr) / 2;
    }
    return area;
  }, [points]);
  const W = 300, H = 250, pad = 40;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(v => (
          <g key={v}>
            <line x1={pad} y1={pad + (1 - v) * (H - 2 * pad)} x2={W - pad} y2={pad + (1 - v) * (H - 2 * pad)} stroke={t.border} strokeWidth={0.5} />
            <text x={pad - 6} y={pad + (1 - v) * (H - 2 * pad) + 4} fontSize={9} fill={t.textDim} textAnchor="end" fontFamily="'IBM Plex Mono'">{v.toFixed(1)}</text>
            <line x1={pad + v * (W - 2 * pad)} y1={pad} x2={pad + v * (W - 2 * pad)} y2={H - pad} stroke={t.border} strokeWidth={0.5} />
            <text x={pad + v * (W - 2 * pad)} y={H - pad + 16} fontSize={9} fill={t.textDim} textAnchor="middle" fontFamily="'IBM Plex Mono'">{v.toFixed(1)}</text>
          </g>
        ))}
        {/* Diagonal (random) */}
        <line x1={pad} y1={H - pad} x2={W - pad} y2={pad} stroke={t.textDim} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
        <text x={W - pad - 10} y={pad + 20} fontSize={8} fill={t.textDim} fontFamily="'IBM Plex Mono'">Random</text>
        {/* AUC fill */}
        <path d={`M ${pad} ${H - pad} ` + points.map(p => `L ${pad + p.fpr * (W - 2 * pad)} ${pad + (1 - p.tpr) * (H - 2 * pad)}`).join(" ") + ` L ${W - pad} ${H - pad} Z`}
          fill={auc > 0.7 ? `${t.correct}15` : `${t.accent}10`} />
        {/* ROC curve */}
        <path d={points.map((p, i) => `${i === 0 ? "M" : "L"} ${pad + p.fpr * (W - 2 * pad)} ${pad + (1 - p.tpr) * (H - 2 * pad)}`).join(" ")}
          fill="none" stroke={auc > 0.7 ? t.correct : t.accent} strokeWidth={2.5} strokeLinecap="round" />
        {/* Labels */}
        <text x={W / 2} y={H - 4} fontSize={10} fill={t.textMuted} textAnchor="middle" fontFamily="'Outfit'" fontWeight={600}>False Positive Rate (1 − Specificity)</text>
        <text x={10} y={H / 2} fontSize={10} fill={t.textMuted} textAnchor="middle" fontFamily="'Outfit'" fontWeight={600} transform={`rotate(-90, 10, ${H / 2})`}>True Positive Rate (Recall)</text>
      </svg>
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
        <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textMuted }}>Buruk</span>
        <input type="range" min={5} max={98} value={quality} onChange={e => setQuality(+e.target.value)}
          style={{ width: 180, accentColor: t.accent }} />
        <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textMuted }}>Sempurna</span>
      </div>
      <div style={{ marginTop: 8, fontFamily: "'IBM Plex Mono'", fontSize: 20, fontWeight: 700, color: auc > 0.8 ? t.correct : auc > 0.6 ? t.accent : t.wrong }}>
        AUC = {auc.toFixed(3)}
      </div>
      <div style={{ fontFamily: "'Outfit'", fontSize: 11, color: t.textMuted, marginTop: 2 }}>
        {auc > 0.9 ? "Excellent! 🎯" : auc > 0.8 ? "Good classifier 👍" : auc > 0.7 ? "Fair 🤔" : auc > 0.5 ? "Poor ⚠️" : "Worse than random! 💀"}
      </div>
    </div>
  );
}

// ============ REGRESSION VISUAL ============
function RegressionVisual({ t }) {
  const data = [
    { label: "A", x: 0, y: 0, yp: 1 },
    { label: "B", x: 1, y: 3, yp: 1.5 },
    { label: "C", x: 5, y: 2, yp: 3.5 },
    { label: "D", x: 7, y: 7, yp: 4.5 },
  ];
  const W = 320, H = 240, pad = 45;
  const maxX = 8, maxY = 8;
  const toSvg = (x, y) => [pad + (x / maxX) * (W - 2 * pad), H - pad - (y / maxY) * (H - 2 * pad)];

  const mae = data.reduce((s, d) => s + Math.abs(d.y - d.yp), 0) / data.length;
  const mse = data.reduce((s, d) => s + Math.pow(d.y - d.yp, 2), 0) / data.length;
  const rmse = Math.sqrt(mse);
  const yMean = data.reduce((s, d) => s + d.y, 0) / data.length;
  const ssReg = data.reduce((s, d) => s + Math.pow(d.y - d.yp, 2), 0);
  const ssTotal = data.reduce((s, d) => s + Math.pow(d.y - yMean, 2), 0);
  const r2 = 1 - ssReg / ssTotal;

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Grid */}
        {[0, 2, 4, 6, 8].map(v => {
          const [, sy] = toSvg(0, v);
          const [sx] = toSvg(v, 0);
          return (
            <g key={v}>
              <line x1={pad} y1={sy} x2={W - pad} y2={sy} stroke={t.border} strokeWidth={0.3} />
              <text x={pad - 6} y={sy + 4} fontSize={9} fill={t.textDim} textAnchor="end" fontFamily="'IBM Plex Mono'">{v}</text>
              <line x1={sx} y1={pad} x2={sx} y2={H - pad} stroke={t.border} strokeWidth={0.3} />
              <text x={sx} y={H - pad + 14} fontSize={9} fill={t.textDim} textAnchor="middle" fontFamily="'IBM Plex Mono'">{v}</text>
            </g>
          );
        })}
        {/* Regression line */}
        {(() => { const [x1, y1] = toSvg(0, 1); const [x2, y2] = toSvg(8, 5); return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={t.blue} strokeWidth={2} />; })()}
        {/* Error lines & points */}
        {data.map((d, i) => {
          const [px, py] = toSvg(d.x, d.y);
          const [, ppy] = toSvg(d.x, d.yp);
          return (
            <g key={i}>
              <line x1={px} y1={py} x2={px} y2={ppy} stroke={t.wrong} strokeWidth={2} strokeDasharray="3 2" opacity={0.8} />
              <circle cx={px} cy={py} r={5} fill={t.accent} stroke={t.bg} strokeWidth={1.5} />
              <text x={px + 8} y={py - 6} fontSize={10} fill={t.accent} fontFamily="'Outfit'" fontWeight={700}>{d.label}</text>
            </g>
          );
        })}
        <text x={W - pad} y={pad + 10} fontSize={9} fill={t.blue} fontFamily="'IBM Plex Mono'">y* = ½x + 1</text>
      </svg>
      {/* Metrics */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: t.textMuted, letterSpacing: 1.5, marginBottom: 10 }}>METRIK REGRESI</div>
        {[
          { name: "MAE", val: mae, formula: "1/N × Σ|y − y*|", desc: "Rata-rata jarak absolut" , color: t.accent },
          { name: "MSE", val: mse, formula: "1/N × Σ(y − y*)²", desc: "Rata-rata kuadrat error", color: t.pink },
          { name: "RMSE", val: rmse, formula: "√MSE", desc: "Akar MSE, satuan sama dgn y", color: t.purple },
          { name: "R²", val: r2, formula: "1 − SS_reg / SS_total", desc: `${(r2 * 100).toFixed(0)}% variasi y dijelaskan x`, color: t.blue },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "8px 12px", background: `${m.color}08`, borderRadius: 10, border: `1px solid ${m.color}20` }}>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13, fontWeight: 700, color: m.color, width: 48 }}>{m.name}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textDim }}>{m.formula}</div>
              <div style={{ fontFamily: "'Outfit'", fontSize: 10, color: t.textMuted }}>{m.desc}</div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 16, fontWeight: 700, color: m.color }}>{m.val.toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ CROSS VALIDATION VISUAL ============
function CVVisual({ t }) {
  const [cvType, setCvType] = useState("kfold");
  const [k, setK] = useState(5);
  const [activeExp, setActiveExp] = useState(0);

  const experiments = useMemo(() => {
    if (cvType === "kfold") {
      return Array.from({ length: k }, (_, i) => ({
        blocks: Array.from({ length: k }, (_, j) => j === i ? "test" : "train"),
      }));
    } else if (cvType === "loocv") {
      const n = 8;
      return Array.from({ length: n }, (_, i) => ({
        blocks: Array.from({ length: n }, (_, j) => j === i ? "test" : "train"),
      }));
    } else {
      return Array.from({ length: 3 }, () => {
        const n = 12;
        const blocks = Array.from({ length: n }, () => "train");
        const testIdx = new Set();
        while (testIdx.size < 3) testIdx.add(Math.floor(Math.random() * n));
        testIdx.forEach(idx => blocks[idx] = "test");
        return { blocks };
      });
    }
  }, [cvType, k]);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {[
          { id: "kfold", label: "K-Fold CV" },
          { id: "loocv", label: "LOOCV" },
          { id: "random", label: "Random Subsampling" },
        ].map(cv => (
          <button key={cv.id} onClick={() => { setCvType(cv.id); setActiveExp(0); }}
            style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${cvType === cv.id ? t.accent : t.border}`,
              background: cvType === cv.id ? `${t.accent}15` : "transparent", color: cvType === cv.id ? t.accent : t.textMuted,
              cursor: "pointer", fontFamily: "'Outfit'", fontSize: 12, fontWeight: 600 }}>
            {cv.label}
          </button>
        ))}
      </div>
      {cvType === "kfold" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textMuted }}>K =</span>
          <input type="range" min={2} max={10} value={k} onChange={e => { setK(+e.target.value); setActiveExp(0); }}
            style={{ width: 120, accentColor: t.accent }} />
          <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 14, fontWeight: 700, color: t.accent }}>{k}</span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {experiments.map((exp, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, opacity: activeExp === i ? 1 : 0.4, transition: "opacity 0.3s", cursor: "pointer" }}
            onClick={() => setActiveExp(i)}
            onMouseEnter={() => setActiveExp(i)}>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: t.textDim, width: 60, textAlign: "right" }}>Exp {i + 1}</span>
            <div style={{ display: "flex", gap: 2, flex: 1 }}>
              {exp.blocks.map((b, j) => (
                <div key={j} style={{
                  flex: 1, height: 24, borderRadius: 4,
                  background: b === "test" ? `${t.accent}90` : `${t.blue}30`,
                  border: `1px solid ${b === "test" ? t.accent : t.blue}40`,
                  transition: "all 0.3s",
                }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10, justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: `${t.blue}30`, border: `1px solid ${t.blue}40` }} />
          <span style={{ fontFamily: "'Outfit'", fontSize: 11, color: t.textMuted }}>Training</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: `${t.accent}90`, border: `1px solid ${t.accent}` }} />
          <span style={{ fontFamily: "'Outfit'", fontSize: 11, color: t.textMuted }}>Validation / Test</span>
        </div>
      </div>
      <div style={{ marginTop: 10, padding: "8px 12px", background: `${t.accent}08`, borderRadius: 8, fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textMuted, textAlign: "center" }}>
        Error akhir = <strong style={{ color: t.accent }}>rata-rata error dari {experiments.length} eksperimen</strong>
        <span style={{ marginLeft: 8, color: t.textDim }}>E = (1/{experiments.length}) × Σ Eᵢ</span>
      </div>
    </div>
  );
}

// ============ F1 DEEP DIVE ============
function F1DeepDive({ t }) {
  const [prec, setPrec] = useState(60);
  const [rec, setRec] = useState(80);
  const [beta, setBeta] = useState(1);
  const p = prec / 100, r = rec / 100;
  const f1 = (p + r) > 0 ? 2 * p * r / (p + r) : 0;
  const simpleMean = (p + r) / 2;
  const fBeta = (p + r) > 0 ? (1 + beta * beta) * p * r / (beta * beta * p + r) : 0;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Precision: <strong style={{ color: t.purple }}>{prec}%</strong></div>
          <input type="range" min={1} max={99} value={prec} onChange={e => setPrec(+e.target.value)} style={{ width: "100%", accentColor: t.purple }} />
        </div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Recall: <strong style={{ color: t.accent }}>{rec}%</strong></div>
          <input type="range" min={1} max={99} value={rec} onChange={e => setRec(+e.target.value)} style={{ width: "100%", accentColor: t.accent }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ padding: "12px 20px", borderRadius: 14, background: `${t.textDim}10`, border: `1px solid ${t.border}`, textAlign: "center" }}>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 9, color: t.textDim, letterSpacing: 1 }}>SIMPLE MEAN</div>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 24, fontWeight: 700, color: t.textMuted }}>{(simpleMean * 100).toFixed(1)}%</div>
        </div>
        <div style={{ padding: "12px 20px", borderRadius: 14, background: `${t.pink}10`, border: `2px solid ${t.pink}40`, textAlign: "center" }}>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 9, color: t.pink, letterSpacing: 1, fontWeight: 600 }}>F1-SCORE ★</div>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 24, fontWeight: 700, color: t.pink }}>{(f1 * 100).toFixed(1)}%</div>
        </div>
        <div style={{ padding: "12px 20px", borderRadius: 14, background: `${t.cyan}10`, border: `1px solid ${t.cyan}40`, textAlign: "center" }}>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 9, color: t.cyan, letterSpacing: 1 }}>F-BETA (β={beta})</div>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 24, fontWeight: 700, color: t.cyan }}>{(fBeta * 100).toFixed(1)}%</div>
        </div>
      </div>
      <div style={{ padding: "10px 14px", background: `${t.accent}06`, borderRadius: 10, border: `1px solid ${t.accent}15`, marginBottom: 12 }}>
        <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 600, color: t.accent, marginBottom: 6 }}>Kenapa F1, bukan Simple Mean?</div>
        <div style={{ fontFamily: "'Crimson Pro'", fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>
          Kalau Precision = {prec}% dan Recall = {rec}%, simple mean = {(simpleMean * 100).toFixed(1)}% — terlihat {simpleMean > 0.4 ? "lumayan" : "rendah"}. Tapi F1 = {(f1 * 100).toFixed(1)}% — {f1 < simpleMean ? "lebih rendah karena F1 menghukum ketidakseimbangan!" : "hampir sama karena cukup seimbang."}
          {Math.abs(p - r) > 0.3 && <strong style={{ color: t.wrong }}> Gap besar antara precision & recall = F1 jatuh drastis!</strong>}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textMuted, marginBottom: 6 }}>β = <strong style={{ color: t.cyan }}>{beta.toFixed(1)}</strong> {beta === 1 ? "(F1 — seimbang)" : beta > 1 ? "(lebih pentingkan Recall)" : "(lebih pentingkan Precision)"}</div>
        <input type="range" min={1} max={30} value={beta * 10} onChange={e => setBeta(+e.target.value / 10)} style={{ width: "100%", accentColor: t.cyan }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono'", fontSize: 9, color: t.textDim, marginTop: 2 }}>
          <span>β{"<"}1 → Precision ↑</span>
          <span>β=1 → F1</span>
          <span>β{">"}1 → Recall ↑</span>
        </div>
      </div>
    </div>
  );
}

// ============ MULTICLASS VISUAL ============
function MulticlassVisual({ t }) {
  const cm = [[4, 6, 3], [1, 2, 0], [1, 2, 6]];
  const classes = ["Cat 🐱", "Fish 🐟", "Hen 🐔"];

  const perClass = classes.map((cls, i) => {
    const tp = cm[i][i];
    const fp = cm.reduce((s, row, ri) => ri !== i ? s + row[i] : s, 0);
    const fn = cm[i].reduce((s, v, j) => j !== i ? s + v : s, 0);
    const prec = tp / (tp + fp);
    const rec = tp / (tp + fn);
    const f1 = 2 * prec * rec / (prec + rec);
    return { cls, tp, fp, fn, prec, rec, f1 };
  });

  const totalTP = perClass.reduce((s, c) => s + c.tp, 0);
  const totalFP = perClass.reduce((s, c) => s + c.fp, 0);
  const microP = totalTP / (totalTP + totalFP);
  const macroF1 = perClass.reduce((s, c) => s + c.f1, 0) / perClass.length;

  return (
    <div>
      {/* Confusion Matrix */}
      <div style={{ display: "grid", gridTemplateColumns: `60px repeat(3, 1fr)`, gridTemplateRows: `30px repeat(3, 1fr)`, gap: 3, marginBottom: 16, maxWidth: 360 }}>
        <div />
        {classes.map(c => <div key={c} style={{ textAlign: "center", fontFamily: "'Outfit'", fontSize: 10, fontWeight: 600, color: t.accent, padding: 4 }}>{c}</div>)}
        {cm.map((row, i) => (
          <>
            <div style={{ fontFamily: "'Outfit'", fontSize: 10, fontWeight: 600, color: t.blue, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>{classes[i]}</div>
            {row.map((v, j) => (
              <div key={j} style={{
                background: i === j ? `${t.correct}20` : v > 0 ? `${t.wrong}10` : "transparent",
                border: `1px solid ${i === j ? t.correct + "40" : t.border}`,
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'IBM Plex Mono'", fontSize: 18, fontWeight: 700,
                color: i === j ? t.correct : v > 0 ? t.wrong : t.textDim, padding: 12,
              }}>{v}</div>
            ))}
          </>
        ))}
      </div>
      {/* Per class */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {perClass.map((c, i) => (
          <div key={i} style={{ flex: 1, minWidth: 120, padding: "10px 12px", background: t.bgCard2, borderRadius: 10, border: `1px solid ${t.border}` }}>
            <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 600, color: t.text, marginBottom: 6 }}>{c.cls}</div>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: t.textMuted }}>
              Prec: <strong style={{ color: t.purple }}>{(c.prec * 100).toFixed(1)}%</strong><br />
              Rec: <strong style={{ color: t.accent }}>{(c.rec * 100).toFixed(1)}%</strong><br />
              F1: <strong style={{ color: t.pink }}>{(c.f1 * 100).toFixed(1)}%</strong>
            </div>
          </div>
        ))}
      </div>
      {/* Macro vs Micro */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, padding: "12px 14px", background: `${t.purple}08`, borderRadius: 10, border: `1px solid ${t.purple}25` }}>
          <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: t.purple, marginBottom: 4 }}>MACRO-F1</div>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 20, fontWeight: 700, color: t.purple }}>{(macroF1 * 100).toFixed(1)}%</div>
          <div style={{ fontFamily: "'Crimson Pro'", fontSize: 11, color: t.textDim, marginTop: 4 }}>Rata-rata F1 per kelas. Setiap kelas bobotnya sama — sensitif terhadap kelas minoritas.</div>
        </div>
        <div style={{ flex: 1, padding: "12px 14px", background: `${t.cyan}08`, borderRadius: 10, border: `1px solid ${t.cyan}25` }}>
          <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: t.cyan, marginBottom: 4 }}>MICRO-F1</div>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 20, fontWeight: 700, color: t.cyan }}>{(microP * 100).toFixed(1)}%</div>
          <div style={{ fontFamily: "'Crimson Pro'", fontSize: 11, color: t.textDim, marginTop: 4 }}>Hitung TP & FP global lalu F1. Kelas mayoritas mendominasi — mirip accuracy.</div>
        </div>
      </div>
    </div>
  );
}

// ============ METRIC CHOOSER ============
function MetricChooser({ t }) {
  const [answers, setAnswers] = useState({});
  const questions = [
    { id: "output", q: "Apa output model kamu?", opts: [{ v: "class", l: "Label Kelas" }, { v: "prob", l: "Probabilitas" }] },
    { id: "balance", q: "Apakah kelas seimbang?", opts: [{ v: "yes", l: "Ya, seimbang" }, { v: "no", l: "Tidak, imbalanced" }], show: a => a.output === "class" },
    { id: "important", q: "Kelas mana lebih penting?", opts: [{ v: "both", l: "Dua-duanya" }, { v: "pos", l: "Kelas Positif" }], show: a => a.output === "class" && a.balance === "no" },
    { id: "cost", q: "Error mana lebih mahal?", opts: [{ v: "equal", l: "Sama aja" }, { v: "fp", l: "False Positive" }, { v: "fn", l: "False Negative" }], show: a => a.important === "pos" },
    { id: "probNeed", q: "Butuh probabilities atau labels?", opts: [{ v: "prob", l: "Probabilities" }, { v: "label", l: "Class Labels" }], show: a => a.output === "prob" },
  ];

  const getRecommendation = () => {
    const a = answers;
    if (a.output === "class" && a.balance === "yes") return { metric: "Accuracy", color: t.cyan, why: "Kelas seimbang → Accuracy reliable, mudah diinterpretasi" };
    if (a.important === "both") return { metric: "G-Mean", color: t.green, why: "Kedua kelas penting → G-Mean menyeimbangkan sensitivity & specificity" };
    if (a.cost === "equal") return { metric: "F1-Score", color: t.pink, why: "FP & FN sama-sama costly → F1 menyeimbangkan precision & recall" };
    if (a.cost === "fp") return { metric: "F0.5-Score", color: t.purple, why: "FP lebih mahal (e.g. spam detection) → F0.5 prioritaskan Precision" };
    if (a.cost === "fn") return { metric: "F2-Score", color: t.accent, why: "FN lebih mahal (e.g. deteksi penyakit) → F2 prioritaskan Recall" };
    if (a.probNeed === "prob") return { metric: "Brier Score", color: t.blue, why: "Butuh kualitas probabilitas → Brier Score mengukur kalibrasi" };
    if (a.probNeed === "label" && a.important === "pos") return { metric: "PR-AUC", color: t.pink, why: "Kelas positif penting + threshold-invariant → PR-AUC" };
    if (a.probNeed === "label") return { metric: "ROC-AUC", color: t.accent, why: "Butuh evaluasi di berbagai threshold → ROC-AUC" };
    return null;
  };

  const rec = getRecommendation();

  return (
    <div>
      {questions.filter(q => !q.show || q.show(answers)).map(q => (
        <div key={q.id} style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Outfit'", fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 8 }}>{q.q}</div>
          <div style={{ display: "flex", gap: 6 }}>
            {q.opts.map(opt => (
              <button key={opt.v} onClick={() => {
                const next = { ...answers, [q.id]: opt.v };
                // Clear downstream
                const idx = questions.findIndex(x => x.id === q.id);
                questions.slice(idx + 1).forEach(x => delete next[x.id]);
                setAnswers(next);
              }}
                style={{
                  padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit'", fontSize: 12, fontWeight: 600,
                  border: `1px solid ${answers[q.id] === opt.v ? t.accent : t.border}`,
                  background: answers[q.id] === opt.v ? `${t.accent}15` : "transparent",
                  color: answers[q.id] === opt.v ? t.accent : t.textMuted,
                }}>
                {opt.l}
              </button>
            ))}
          </div>
        </div>
      ))}
      {rec && (
        <div style={{ marginTop: 16, padding: "16px 20px", background: `${rec.color}10`, borderRadius: 14, border: `2px solid ${rec.color}35`, animation: "fadeUp 0.4s" }}>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: rec.color, letterSpacing: 2, fontWeight: 600 }}>REKOMENDASI</div>
          <div style={{ fontFamily: "'Outfit'", fontSize: 26, fontWeight: 800, color: rec.color, marginTop: 4 }}>{rec.metric}</div>
          <div style={{ fontFamily: "'Crimson Pro'", fontSize: 14, color: t.textMuted, marginTop: 6 }}>{rec.why}</div>
        </div>
      )}
      {Object.keys(answers).length > 0 && (
        <button onClick={() => setAnswers({})} style={{ marginTop: 10, padding: "6px 14px", borderRadius: 6, border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, cursor: "pointer", fontFamily: "'Outfit'", fontSize: 11 }}>Reset</button>
      )}
    </div>
  );
}


// ============ MAIN APP ============
export default function ModelEvaluationViz() {
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const t = isDark ? themes.dark : themes.light;

  const Card = ({ children, style = {}, accent = null }) => (
    <div style={{
      background: t.bgCard, borderRadius: 16, border: `1px solid ${accent ? accent + "25" : t.border}`,
      padding: 24, marginBottom: 16, ...style,
      ...(accent ? { borderLeft: `3px solid ${accent}` } : {}),
    }}>{children}</div>
  );

  const SectionTitle = ({ icon, title, subtitle }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <h2 style={{ fontFamily: "'Crimson Pro'", fontSize: 28, fontWeight: 400, color: t.text, margin: 0 }}>{title}</h2>
      </div>
      {subtitle && <p style={{ fontFamily: "'Crimson Pro'", fontSize: 15, color: t.textMuted, margin: 0, marginLeft: 38 }}>{subtitle}</p>}
    </div>
  );

  const Formula = ({ children, label, color = t.accent }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 8, background: `${color}08`, border: `1px solid ${color}20`, margin: "3px 0" }}>
      {label && <span style={{ fontFamily: "'Outfit'", fontSize: 10, fontWeight: 600, color, letterSpacing: 1 }}>{label}</span>}
      <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13, color: t.text, fontWeight: 500 }}>{children}</span>
    </div>
  );

  const KeyPoint = ({ emoji, text, color = t.accent }) => (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
      <span style={{ fontSize: 14, marginTop: 1 }}>{emoji}</span>
      <span style={{ fontFamily: "'Crimson Pro'", fontSize: 14, color: t.textMuted, lineHeight: 1.6 }}>{text}</span>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <>
            <SectionTitle icon="🗺️" title="Supervised Model Evaluation" subtitle="Bagaimana mengevaluasi model ML dengan tepat?" />
            <Card accent={t.accent}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.accent, marginBottom: 12, letterSpacing: 1 }}>DUA MASALAH UTAMA</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ padding: 16, borderRadius: 12, background: `${t.blue}08`, border: `1px solid ${t.blue}20` }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: t.blue, marginBottom: 6 }}>1. Methodology</div>
                  <div style={{ fontFamily: "'Crimson Pro'", fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>
                    Bagaimana membagi dataset untuk training & testing? Pendekatan: Holdout, Cross-Validation (Random Subsampling, K-Fold, LOOCV)
                  </div>
                </div>
                <div style={{ padding: 16, borderRadius: 12, background: `${t.pink}08`, border: `1px solid ${t.pink}20` }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: t.pink, marginBottom: 6 }}>2. Quantification</div>
                  <div style={{ fontFamily: "'Crimson Pro'", fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>
                    Metrik apa yang tepat untuk evaluasi? Classification: Accuracy, Precision, Recall, F1, AUC. Regression: MAE, MSE, RMSE, R²
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.wrong, marginBottom: 10, letterSpacing: 1 }}>⚠️ TESTING NOs — JANGAN DILAKUKAN!</div>
              <KeyPoint emoji="🚫" text="Jangan pakai training set untuk testing → overestimate performa (seperti ujian pakai soal latihan!)" color={t.wrong} />
              <KeyPoint emoji="🚫" text="Jangan pakai testing set untuk tuning model → data bocor, hasil bias" color={t.wrong} />
              <KeyPoint emoji="✅" text="Model yang baik = bisa prediksi data yang BELUM PERNAH dilihat sebelumnya!" color={t.correct} />
            </Card>
            <Card accent={t.purple}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.purple, marginBottom: 10, letterSpacing: 1 }}>PEMBAGIAN DATA</div>
              <div style={{ display: "flex", gap: 2, marginBottom: 12, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ flex: 50, background: `${t.blue}40`, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: t.text }}>Training (50%)</div>
                  <div style={{ fontFamily: "'Crimson Pro'", fontSize: 10, color: t.textMuted }}>Bangun model</div>
                </div>
                <div style={{ flex: 25, background: `${t.accent}40`, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: t.text }}>Validation (25%)</div>
                  <div style={{ fontFamily: "'Crimson Pro'", fontSize: 10, color: t.textMuted }}>Tuning / selection</div>
                </div>
                <div style={{ flex: 25, background: `${t.pink}40`, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, color: t.text }}>Testing (25%)</div>
                  <div style={{ fontFamily: "'Crimson Pro'", fontSize: 10, color: t.textMuted }}>Evaluasi final</div>
                </div>
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: t.textDim, textAlign: "center" }}>Referensi lain: 80:20 (training : testing) tanpa validation terpisah</div>
            </Card>
          </>
        );

      case "methodology":
        return (
          <>
            <SectionTitle icon="🔬" title="Metodologi Evaluasi" subtitle="Holdout & Cross-Validation — cara membagi data yang tepat" />
            <Card accent={t.accent}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.accent, marginBottom: 6 }}>Holdout</div>
              <div style={{ fontFamily: "'Crimson Pro'", fontSize: 14, color: t.textMuted, lineHeight: 1.6, marginBottom: 10 }}>
                Bagi data jadi 2: training & testing. Simpel, tapi ada masalah — kalau proporsi kelas tidak seimbang saat split, estimasi error bisa <strong style={{ color: t.wrong }}>pessimistic</strong>.
              </div>
            </Card>
            <Card accent={t.blue}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.blue, marginBottom: 10 }}>Cross-Validation (Interaktif)</div>
              <CVVisual t={t} />
            </Card>
            <Card accent={t.purple}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.purple, marginBottom: 10 }}>Nilai K — Trade-off</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: 12, borderRadius: 10, background: `${t.blue}08`, border: `1px solid ${t.blue}20` }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: t.blue }}>K Besar</div>
                  <KeyPoint emoji="✅" text="Bias kecil (estimasi error akurat)" />
                  <KeyPoint emoji="⚠️" text="Variance besar" />
                  <KeyPoint emoji="⏰" text="Komputasi lama" />
                </div>
                <div style={{ padding: 12, borderRadius: 10, background: `${t.accent}08`, border: `1px solid ${t.accent}20` }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: t.accent }}>K Kecil</div>
                  <KeyPoint emoji="✅" text="Komputasi cepat" />
                  <KeyPoint emoji="✅" text="Variance kecil" />
                  <KeyPoint emoji="⚠️" text="Bias besar" />
                </div>
              </div>
              <div style={{ marginTop: 12, padding: "8px 14px", background: `${t.accent}10`, borderRadius: 8, textAlign: "center" }}>
                <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12, fontWeight: 700, color: t.accent }}>Umumnya K = 10</span>
                <span style={{ fontFamily: "'Crimson Pro'", fontSize: 12, color: t.textMuted, marginLeft: 8 }}>| Dataset besar → K=3 cukup | Dataset kecil → LOOCV</span>
              </div>
            </Card>
          </>
        );

      case "regression":
        return (
          <>
            <SectionTitle icon="📈" title="Metrik Regresi" subtitle="MAE, MSE, RMSE, R² — mengukur error antara y aktual dan y prediksi" />
            <Card accent={t.blue}>
              <RegressionVisual t={t} />
            </Card>
            <Card accent={t.accent}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.accent, marginBottom: 10 }}>R² — Koefisien Determinasi</div>
              <Formula color={t.blue}>R² = 1 − SS_regression / SS_total</Formula>
              <div style={{ fontFamily: "'Crimson Pro'", fontSize: 14, color: t.textMuted, lineHeight: 1.7, marginTop: 10 }}>
                SS_regression = Σ(y − y*)² → error terhadap garis regresi<br />
                SS_total = Σ(y − ȳ)² → error terhadap garis mean
              </div>
              <KeyPoint emoji="📏" text="Rentang 0–1 (umumnya). R² = 0.55 artinya 55% variasi y bisa dijelaskan oleh x" />
              <KeyPoint emoji="⚠️" text="R² mendekati 1 TIDAK SELALU bagus! Cek residual plot — kalau ada pola, model masih bisa diperbaiki" color={t.wrong} />
            </Card>
          </>
        );

      case "confusion":
        return (
          <>
            <SectionTitle icon="🎯" title="Confusion Matrix" subtitle="Geser slider untuk eksplorasi bagaimana TP, FP, FN, TN mempengaruhi semua metrik" />
            <Card accent={t.accent}>
              <InteractiveConfusionMatrix t={t} />
            </Card>
            <Card accent={t.purple}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.purple, marginBottom: 10 }}>Cara Baca (dengan Analogi)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { term: "TP", icon: "✅", desc: "Dibilang sakit, memang sakit", color: t.correct },
                  { term: "FP", icon: "🚨", desc: "Dibilang sakit, padahal sehat (false alarm)", color: t.wrong },
                  { term: "FN", icon: "😱", desc: "Dibilang sehat, padahal sakit (lolos!)", color: t.wrong },
                  { term: "TN", icon: "✅", desc: "Dibilang sehat, memang sehat", color: t.correct },
                ].map(x => (
                  <div key={x.term} style={{ padding: "10px 12px", borderRadius: 8, background: `${x.color}08`, border: `1px solid ${x.color}20` }}>
                    <span style={{ fontFamily: "'IBM Plex Mono'", fontWeight: 700, color: x.color, fontSize: 14 }}>{x.term} {x.icon}</span>
                    <div style={{ fontFamily: "'Crimson Pro'", fontSize: 12, color: t.textMuted, marginTop: 2 }}>{x.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        );

      case "metrics":
        return (
          <>
            <SectionTitle icon="⚖️" title="Metrik Klasifikasi Biner" subtitle="Precision, Recall, Specificity — masing-masing punya perspektif berbeda" />
            <Card accent={t.purple}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.purple, marginBottom: 12 }}>Tiga Perspektif</div>
              {[
                { name: "Precision", formula: "TP / (TP + FP)", question: "Dari semua yang diprediksi +, berapa yang benar?", focus: "Kolom prediksi +", analogy: "Alarm pemadam: kalau bunyi, apakah benar ada kebakaran?", color: t.purple },
                { name: "Recall / Sensitivity", formula: "TP / (TP + FN)", question: "Dari semua yang MEMANG +, berapa yang ketangkap?", focus: "Baris aktual +", analogy: "Detektor penyakit: berapa persen orang sakit yang terdeteksi?", color: t.accent },
                { name: "Specificity", formula: "TN / (TN + FP)", question: "Dari semua yang MEMANG −, berapa yang benar diidentifikasi?", focus: "Baris aktual −", analogy: "Berapa persen orang sehat yang benar-benar dibilang sehat?", color: t.blue },
              ].map((m, i) => (
                <div key={i} style={{ padding: "14px 16px", marginBottom: 10, borderRadius: 12, background: `${m.color}06`, border: `1px solid ${m.color}20` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 700, color: m.color }}>{m.name}</span>
                    <Formula color={m.color}>{m.formula}</Formula>
                  </div>
                  <div style={{ fontFamily: "'Crimson Pro'", fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>
                    <strong style={{ color: t.text }}>Pertanyaan:</strong> {m.question}<br />
                    <strong style={{ color: t.text }}>Fokus:</strong> {m.focus}<br />
                    <strong style={{ color: t.text }}>Analogi:</strong> {m.analogy}
                  </div>
                </div>
              ))}
            </Card>
            <Card accent={t.wrong}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 13, fontWeight: 700, color: t.wrong, marginBottom: 6 }}>⚠️ Jebakan Accuracy pada Imbalanced Class</div>
              <div style={{ fontFamily: "'Crimson Pro'", fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>
                Contoh: 1000 data (950 negatif, 50 positif). Model selalu prediksi "negatif" → Accuracy = 95%! Tapi Recall = 0% — tidak ada satupun kasus positif yang terdeteksi. <strong style={{ color: t.wrong }}>Accuracy bisa misleading!</strong>
              </div>
            </Card>
          </>
        );

      case "f1deep":
        return (
          <>
            <SectionTitle icon="🔥" title="F1-Score & F-Beta" subtitle="Harmonic mean — kenapa lebih baik dari simple mean?" />
            <Card accent={t.pink}>
              <F1DeepDive t={t} />
            </Card>
            <Card accent={t.cyan}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.cyan, marginBottom: 10 }}>F-Beta Cheat Sheet</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { beta: "β < 1", metric: "F0.5", focus: "Precision ↑", example: "Spam filter — jangan hapus email penting!", color: t.purple },
                  { beta: "β = 1", metric: "F1", focus: "Seimbang", example: "Default jika FP = FN sama-sama costly", color: t.pink },
                  { beta: "β > 1", metric: "F2", focus: "Recall ↑", example: "Deteksi kanker — jangan sampai lolos!", color: t.accent },
                ].map((b, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 10, background: `${b.color}08`, border: `1px solid ${b.color}25`, textAlign: "center" }}>
                    <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 18, fontWeight: 700, color: b.color }}>{b.metric}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: t.textDim, marginTop: 2 }}>{b.beta}</div>
                    <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 600, color: t.text, marginTop: 6 }}>{b.focus}</div>
                    <div style={{ fontFamily: "'Crimson Pro'", fontSize: 11, color: t.textMuted, marginTop: 4 }}>{b.example}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <Formula color={t.cyan} label="F-BETA">F_β = (1+β²) × (prec×rec) / (β²×prec + rec)</Formula>
              </div>
            </Card>
          </>
        );

      case "roc":
        return (
          <>
            <SectionTitle icon="📊" title="ROC Curve & AUC" subtitle="Evaluasi classifier di berbagai threshold" />
            <Card accent={t.accent}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.accent, marginBottom: 10 }}>Simulator ROC (Interaktif)</div>
              <ROCSimulator t={t} />
            </Card>
            <Card accent={t.blue}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.blue, marginBottom: 10 }}>Konsep Threshold</div>
              <div style={{ fontFamily: "'Crimson Pro'", fontSize: 14, color: t.textMuted, lineHeight: 1.7, marginBottom: 10 }}>
                Bayangkan alat tes COVID output angka 0–1. Threshold 0.8 → ketat (FP rendah, FN tinggi). Threshold 0.4 → longgar (FP tinggi, FN rendah). ROC plot TPR vs FPR di semua threshold.
              </div>
              <KeyPoint emoji="📏" text="AUC = luas di bawah ROC. Mendekati 1 = bagus. 0.5 = random. < 0.5 = lebih buruk dari random!" />
              <KeyPoint emoji="🔑" text="AUC bersifat scale & threshold-invariant — berbeda dari F1 yang tergantung satu threshold" />
              <KeyPoint emoji="📈" text="PR-AUC: Precision vs Recall curve — gunakan jika kelas positif lebih penting" />
            </Card>
          </>
        );

      case "multiclass":
        return (
          <>
            <SectionTitle icon="🎨" title="Multiclass Classification" subtitle="Macro vs Micro averaging — cara menghitung F1 untuk >2 kelas" />
            <Card accent={t.purple}>
              <MulticlassVisual t={t} />
            </Card>
            <Card accent={t.green}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.green, marginBottom: 10 }}>OvR — One vs Rest</div>
              <div style={{ fontFamily: "'Crimson Pro'", fontSize: 14, color: t.textMuted, lineHeight: 1.7 }}>
                Untuk setiap kelas, anggap hanya ada 2 kelas: kelas itu vs semua kelas lain. Hitung Precision, Recall, F1 per kelas, lalu gabungkan.
              </div>
            </Card>
          </>
        );

      case "choosing":
        return (
          <>
            <SectionTitle icon="🧭" title="Pilih Metrik yang Tepat" subtitle="Jawab pertanyaan di bawah untuk menemukan metrik terbaik" />
            <Card accent={t.accent}>
              <MetricChooser t={t} />
            </Card>
          </>
        );

      case "ttest":
        return (
          <>
            <SectionTitle icon="🧪" title="Statistical Test (t-test)" subtitle="Apakah perbedaan performa model A vs B signifikan secara statistik?" />
            <Card accent={t.blue}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.blue, marginBottom: 12 }}>5 Langkah t-test</div>
              {[
                { step: 1, title: "Buat Hipotesis", desc: "H₀: μ₁ = μ₂ (sama) | H₁: μ₁ < μ₂ (model kita lebih baik)", icon: "📝" },
                { step: 2, title: "Tentukan Signifikansi", desc: "α = 0.05 atau 0.1, cari t-critical dari tabel (df = n+m−2)", icon: "📊" },
                { step: 3, title: "Hitung Test Score", desc: "TS = (X̄₁ − X̄₂) / √(Sp² × (1/n + 1/m))", icon: "🔢" },
                { step: 4, title: "Bandingkan", desc: "Apakah TS masuk area reject H₀ atau accept H₀?", icon: "⚖️" },
                { step: 5, title: "Kesimpulan", desc: "Reject H₀ → perbedaan signifikan. Accept H₀ → belum cukup bukti", icon: "✅" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${t.blue}15`, border: `1px solid ${t.blue}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono'", fontSize: 14, fontWeight: 700, color: t.blue, flexShrink: 0 }}>{s.step}</div>
                  <div>
                    <div style={{ fontFamily: "'Outfit'", fontSize: 13, fontWeight: 700, color: t.text }}>{s.icon} {s.title}</div>
                    <div style={{ fontFamily: "'Crimson Pro'", fontSize: 13, color: t.textMuted }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </Card>
            <Card accent={t.accent}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: t.accent, marginBottom: 8 }}>Pooled Estimator</div>
              <Formula color={t.accent}>Sp² = ((n−1)S₁² + (m−1)S₂²) / (n+m−2)</Formula>
              <div style={{ fontFamily: "'Crimson Pro'", fontSize: 13, color: t.textMuted, marginTop: 8 }}>
                Digunakan ketika variance populasi tidak diketahui tapi diasumsikan sama. n, m = jumlah data tiap grup. S₁², S₂² = variance sampel.
              </div>
            </Card>
            <Card accent={t.green}>
              <KeyPoint emoji="💡" text="Kenapa perlu t-test? Karena accuracy 76% vs 74% belum tentu berarti model pertama lebih baik — bisa jadi kebetulan!" />
              <KeyPoint emoji="🎯" text="Jika TS masuk rejection area → perbedaan SIGNIFIKAN (bukan kebetulan)" />
              <KeyPoint emoji="📋" text="Dalam ML: jalankan K-fold CV, dapatkan K nilai metrik, lalu t-test antara dua model" />
            </Card>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: t.bg, minHeight: "100vh", color: t.text, transition: "all 0.3s" }}>
      <style>{FONTS}{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type="range"] { -webkit-appearance: auto; height: 4px; border-radius: 4px; outline: none; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: t.glassBg, backdropFilter: t.glassBlur, borderBottom: `1px solid ${t.border}`, padding: "12px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 10, color: t.accent, letterSpacing: 2, fontWeight: 600 }}>MATERI 09 · KASDAD</div>
            <h1 style={{ fontFamily: "'Crimson Pro'", fontSize: 22, fontWeight: 400, color: t.text }}>Supervised Model Evaluation</h1>
          </div>
          <button onClick={() => setIsDark(!isDark)} style={{
            padding: "6px 14px", borderRadius: 8, border: `1px solid ${t.border}`,
            background: "transparent", cursor: "pointer", fontFamily: "'IBM Plex Mono'", fontSize: 12, color: t.textMuted,
          }}>
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", display: "flex", gap: 20 }}>
        {/* Sidebar */}
        <div style={{ width: 200, flexShrink: 0, position: "sticky", top: 80, height: "calc(100vh - 100px)", overflowY: "auto", paddingTop: 20, paddingBottom: 20 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left",
                padding: "8px 12px", marginBottom: 2, borderRadius: 8, border: "none", cursor: "pointer",
                background: activeSection === s.id ? `${t.accent}12` : "transparent",
                color: activeSection === s.id ? t.accent : t.textMuted,
                fontFamily: "'Outfit'", fontSize: 12, fontWeight: activeSection === s.id ? 700 : 500,
                transition: "all 0.2s",
              }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, paddingTop: 20, paddingBottom: 60, animation: "fadeUp 0.4s" }} key={activeSection}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
