import { useState, useEffect } from "react";

// ═══════════════════════════════════════════
// MATERI 3 — SAINS DATA  (v2 — Full Rebuild)
// ═══════════════════════════════════════════

const TH = {
  dark: {
    bg: "#0c111b", bg2: "#111827", card: "rgba(255,255,255,0.035)", cardH: "rgba(255,255,255,0.065)",
    text: "#e2e8f0", sub: "#94a3b8", dim: "#475569", bdr: "rgba(255,255,255,0.07)",
    cyan: "#22d3ee", blue: "#60a5fa", purple: "#a78bfa", amber: "#fbbf24",
    rose: "#fb7185", green: "#34d399", pink: "#f472b6", orange: "#fb923c",
    grad: "linear-gradient(135deg,#22d3ee,#a78bfa)", sh: "0 12px 40px rgba(0,0,0,0.5)",
  },
  light: {
    bg: "#f1f5f9", bg2: "#ffffff", card: "rgba(0,0,0,0.025)", cardH: "rgba(0,0,0,0.055)",
    text: "#1e293b", sub: "#64748b", dim: "#94a3b8", bdr: "rgba(0,0,0,0.08)",
    cyan: "#0891b2", blue: "#2563eb", purple: "#7c3aed", amber: "#d97706",
    rose: "#e11d48", green: "#059669", pink: "#db2777", orange: "#ea580c",
    grad: "linear-gradient(135deg,#0891b2,#7c3aed)", sh: "0 12px 40px rgba(0,0,0,0.06)",
  },
};

const NAV = [
  { id: "motivasi", l: "Motivasi" }, { id: "bigdata", l: "Big Data" },
  { id: "definisi", l: "Definisi" }, { id: "analytics", l: "Analytics" },
  { id: "ecosystem", l: "Ekosistem" }, { id: "roles", l: "Peran" },
  { id: "pipeline", l: "Pipeline" }, { id: "crisp", l: "CRISP-DM" },
  { id: "casestudy", l: "Studi Kasus" }, { id: "datatypes", l: "Tipe Data" },
  { id: "failures", l: "Kegagalan" }, { id: "methods", l: "Metodologi" },
];

function Cd({ c, children, s, gl, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick}
      style={{ background: h ? c.cardH : c.card, border: `1px solid ${gl && h ? c.cyan + "40" : c.bdr}`,
        borderRadius: 16, padding: 24, transition: "all .3s", cursor: onClick ? "pointer" : "default",
        boxShadow: h ? c.sh : "none", ...s }}>
      {children}
    </div>
  );
}

function Sec({ c, id, icon, title, sub, children }) {
  return (
    <section id={id} style={{ padding: "52px 0 20px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 24 }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, background: c.grad,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{title}</h2>
        </div>
        {sub && <p style={{ margin: 0, color: c.sub, fontSize: 13, paddingLeft: 38 }}>{sub}</p>}
      </div>
      {children}
    </section>
  );
}

function Tag({ color, children }) {
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20,
    background: color + "18", color, fontSize: 10, fontWeight: 700, letterSpacing: .5,
    textTransform: "uppercase" }}>{children}</span>;
}

function Why({ c, children }) {
  return (
    <div style={{ margin: "12px 0", padding: "12px 16px", borderRadius: 12,
      background: c.amber + "08", borderLeft: `3px solid ${c.amber}` }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: c.amber, letterSpacing: .5 }}>KENAPA PENTING?</span>
      <p style={{ margin: "4px 0 0", fontSize: 12, color: c.text, lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

function Trap({ c, children }) {
  return (
    <div style={{ margin: "8px 0", padding: "10px 14px", borderRadius: 10,
      background: c.rose + "08", borderLeft: `3px solid ${c.rose}` }}>
      <p style={{ margin: 0, fontSize: 11, color: c.rose, fontWeight: 600 }}>⚠ JEBAKAN: {children}</p>
    </div>
  );
}

// ═══════ 1. MOTIVASI ═══════
function MotivasiSec({ c }) {
  const qs = [
    { q: "Kata kunci apa yang paling sering dicari di Google?", cat: "Descriptive", color: c.cyan },
    { q: "Apa yang sedang trend di TikTok / Instagram?", cat: "Descriptive", color: c.cyan },
    { q: "Berapa harga saham PT. PIK 2 Tbk besok?", cat: "Predictive", color: c.purple },
    { q: "Bagaimana sentimen orang terhadap DeepSeek?", cat: "Diagnostic", color: c.amber },
    { q: "Kenapa user e-commerce tinggalkan keranjang?", cat: "Diagnostic", color: c.amber },
    { q: "Lagu apa yang cocok direkomendasikan besok?", cat: "Prescriptive", color: c.green },
  ];
  return (
    <Sec c={c} id="motivasi" icon="💡" title="Motivasi: Kenapa Sains Data?"
      sub="Pertanyaan-pertanyaan ini bisa dijawab dengan sains data + learning agent">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {qs.map((q, i) => (
          <Cd key={i} c={c} s={{ padding: 14, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>❓</span>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 12, color: c.text, lineHeight: 1.5 }}>{q.q}</p>
              <Tag color={q.color}>{q.cat}</Tag>
            </div>
          </Cd>
        ))}
      </div>
      <Why c={c}>Semua pertanyaan ini butuh DATA + METODE SISTEMATIS untuk dijawab. Tanpa pendekatan yang benar, kita cuma nebak. Sains data memberikan kerangka kerja ilmiah untuk mengubah data mentah menjadi jawaban yang bisa diandalkan.</Why>

      <Cd c={c} s={{ marginTop: 16, padding: 28 }}>
        <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, color: c.dim, letterSpacing: 1.5, textTransform: "uppercase" }}>
          Bagaimana Caranya? → Learning Agent Pipeline
        </p>
        <svg viewBox="0 0 820 200" style={{ width: "100%", display: "block" }}>
          {[
            { x: 0, w: 140, l1: "KUMPULAN", l2: "INFORMASI", sub: "Data mentah dari dunia nyata", color: c.cyan },
            { x: 175, w: 140, l1: "REPRESENTASI", l2: "DATA", sub: "Input + Expected Output", color: c.amber },
            { x: 350, w: 130, l1: "TRAIN", l2: "MODEL", sub: "Komputer belajar pola", color: c.purple },
            { x: 520, w: 130, l1: "RUN", l2: "INFERENCE", sub: "Query masuk → model proses", color: c.green },
            { x: 690, w: 130, l1: "INFERRED", l2: "ANSWER", sub: "Prediksi / Jawaban", color: c.rose },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={15} width={b.w} height={85} rx={14} fill={b.color + "12"} stroke={b.color} strokeWidth={1.5} />
              <text x={b.x + b.w / 2} y={42} textAnchor="middle" fill={b.color} fontSize={11} fontWeight={800} fontFamily="inherit">{b.l1}</text>
              <text x={b.x + b.w / 2} y={56} textAnchor="middle" fill={b.color} fontSize={11} fontWeight={800} fontFamily="inherit">{b.l2}</text>
              <text x={b.x + b.w / 2} y={82} textAnchor="middle" fill={c.dim} fontSize={9} fontFamily="inherit">{b.sub}</text>
              {i < 4 && <path d={`M${b.x + b.w + 8} 57 L${[175, 350, 520, 690][i] - 8} 57`} stroke={c.dim} strokeWidth={1.5} strokeDasharray="5 3" markerEnd="url(#arr1)" />}
            </g>
          ))}
          <path d="M755 105 L755 150 Q755 165 740 165 L80 165 Q65 165 65 150 L65 105" fill="none" stroke={c.dim + "40"} strokeWidth={1} strokeDasharray="4 4" />
          <text x={410} y={185} textAnchor="middle" fill={c.dim} fontSize={9} fontFamily="inherit" fontStyle="italic">↻ Feedback loop — model terus diperbaiki dengan data baru</text>
          <defs><marker id="arr1" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill={c.dim} /></marker></defs>
        </svg>
        <Why c={c}>Ini inti dari semua sistem AI/ML. Tapi banyak pertanyaan muncul: dari mana datanya? Apakah bersih? Gimana tahu hasilnya bagus? Itulah kenapa butuh METODOLOGI sains data yang sistematis!</Why>
      </Cd>
    </Sec>
  );
}

// ═══════ 2. BIG DATA ═══════
function BigDataSec({ c }) {
  const [sel, setSel] = useState(null);
  const vs = [
    { n: "Volume", icon: "📦", color: c.cyan, short: "Seberapa BESAR?", d: "Data terakumulasi sangat besar — terabyte sampai yottabyte",
      ex: "Facebook: 4+ petabytes/hari. Google: 8.5 miliar search/hari.", why: "Butuh tools khusus (Hadoop, Spark) — ga bisa Excel lagi!" },
    { n: "Velocity", icon: "⚡", color: c.amber, short: "Seberapa CEPAT?", d: "Data terhasilkan sangat cepat — per detik, per menit",
      ex: "Twitter: 500K+ tweet/menit. Sensor IoT: ribuan reading/detik.", why: "Tentukan: batch processing (berkala) atau stream processing (real-time)." },
    { n: "Variety", icon: "🔀", color: c.purple, short: "Seberapa BERAGAM?", d: "Terstruktur (tabel), semi (JSON), tidak terstruktur (teks, gambar, video)",
      ex: "80% data dunia TIDAK terstruktur (teks, gambar, video).", why: "Tantangan: ubah data beragam ini jadi format yang bisa dianalisis." },
    { n: "Veracity", icon: "🔍", color: c.rose, short: "Seberapa AKURAT?", d: "Kesesuaian data dengan fakta semakin sulit ditakar",
      ex: "Fake reviews, bot accounts, data survei bias.", why: "Garbage in = garbage out! Makanya data cleaning 70-90% waktu proyek." },
    { n: "Value", icon: "💎", color: c.green, short: "Seberapa BERNILAI?", d: "Kemampuan menghasilkan value (profit, efisiensi, manfaat sosial)",
      ex: "Netflix hemat $1B/tahun dari recommendation engine.", why: "Data tanpa value = sampah mahal. Tujuan akhir = VALUE, bukan model keren." },
    { n: "Variability", icon: "🔄", color: c.pink, short: "Seberapa BERVARIASI?", d: "Variasi penggunaan data di berbagai konteks & aplikasi",
      ex: "Data transaksi → fraud detection + segmentation + forecasting.", why: "Satu dataset bisa punya banyak kegunaan — kreativitas kuncinya!" },
  ];
  return (
    <Sec c={c} id="bigdata" icon="⬡" title="Big Data — 6V"
      sub="Kenapa kita hidup di era 'Big Data'? Karena data sekarang punya 6 karakteristik ini">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
        {vs.map((v, i) => (
          <Cd key={i} c={c} gl onClick={() => setSel(sel === i ? null : i)}
            s={{ padding: 16, borderLeft: `3px solid ${sel === i ? v.color : "transparent"}`, transition: "all .3s",
              transform: sel === i ? "scale(1.02)" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{v.icon}</span>
              <div>
                <div style={{ fontWeight: 800, color: v.color, fontSize: 14 }}>{v.n}</div>
                <div style={{ fontSize: 10, color: c.dim, fontStyle: "italic" }}>{v.short}</div>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: c.sub, lineHeight: 1.5 }}>{v.d}</p>
          </Cd>
        ))}
      </div>
      {sel !== null && (
        <Cd c={c} s={{ borderTop: `3px solid ${vs[sel].color}`, animation: "fadeIn .3s" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div><Tag color={vs[sel].color}>Contoh Nyata</Tag><p style={{ margin: "8px 0 0", fontSize: 12, color: c.text, lineHeight: 1.6 }}>{vs[sel].ex}</p></div>
            <div><Tag color={c.amber}>Kenapa Penting?</Tag><p style={{ margin: "8px 0 0", fontSize: 12, color: c.text, lineHeight: 1.6 }}>{vs[sel].why}</p></div>
          </div>
        </Cd>
      )}
    </Sec>
  );
}

// ═══════ 3. DEFINISI ═══════
function DefinisiSec({ c }) {
  return (
    <Sec c={c} id="definisi" icon="📖" title="Apa itu Sains Data?"
      sub="Definisi formal dan scope dari data science">
      <Cd c={c} s={{ marginBottom: 16, padding: 28, borderLeft: `4px solid ${c.cyan}` }}>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: c.text, lineHeight: 1.6 }}>
          <span style={{ color: c.cyan }}>Sains Data</span> = ekstraksi <span style={{ color: c.amber, fontWeight: 800 }}>insight</span> dari data yang <em>messy</em>
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: c.sub }}>
          Tujuan: <strong style={{ color: c.green }}>pengambilan keputusan masa depan</strong> atau <strong style={{ color: c.purple }}>pemahaman masa lampau</strong>
        </p>
      </Cd>
      <Why c={c}>Kata "messy" penting — data dunia nyata ga pernah rapi. Ada yang kosong, duplikat, format beda. Sains data bukan cuma ML, tapi keseluruhan proses dari data kotor sampai keputusan bermanfaat.</Why>
      <p style={{ fontSize: 12, fontWeight: 700, color: c.dim, letterSpacing: 1, textTransform: "uppercase", margin: "20px 0 10px" }}>Area Dasar yang Dibutuhkan</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { n: "Math", icon: "🔢", color: c.purple }, { n: "Statistics", icon: "📊", color: c.amber },
          { n: "Domain Expertise", icon: "🏢", color: c.green }, { n: "Data Engineering", icon: "🔧", color: c.cyan },
          { n: "Scientific Method", icon: "🔬", color: c.rose }, { n: "Hacker Mindset", icon: "💻", color: c.pink },
          { n: "Visualization", icon: "📈", color: c.blue }, { n: "Adv. Computing", icon: "🖥️", color: c.orange },
        ].map((a, i) => (
          <div key={i} style={{ padding: "8px 14px", borderRadius: 10, background: a.color + "10",
            border: `1px solid ${a.color}25`, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>{a.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: a.color }}>{a.n}</span>
          </div>
        ))}
      </div>
    </Sec>
  );
}

// ═══════ 4. ANALYTICS ═══════
function AnalyticsSec({ c }) {
  const [sel, setSel] = useState(null);
  const ts = [
    { n: "Descriptive", q: "APA yang terjadi?", icon: "📊", color: c.cyan,
      d: "Melihat ke BELAKANG — merangkum data historis", ex: "Dashboard penjualan bulan lalu",
      an: "Seperti kaca spion — lihat apa yang sudah terjadi", tool: "SQL, pivot tables, Tableau" },
    { n: "Diagnostic", q: "MENGAPA ini terjadi?", icon: "🔍", color: c.amber,
      d: "Menggali LEBIH DALAM — cari root cause fenomena", ex: "Kenapa penjualan Q3 turun 20%?",
      an: "Seperti dokter diagnosa penyebab sakit", tool: "Drill-down, correlation, root-cause analysis" },
    { n: "Predictive", q: "APA yang AKAN terjadi?", icon: "🔮", color: c.purple,
      d: "Melihat ke DEPAN — prediksi berdasarkan pola historis", ex: "Prediksi harga saham besok",
      an: "Seperti ramalan cuaca — berdasarkan pola, bisa salah", tool: "ML, regression, classification" },
    { n: "Prescriptive", q: "APA yang HARUS dilakukan?", icon: "💡", color: c.green,
      d: "Rekomendasi AKSI — tindakan terbaik berdasarkan prediksi", ex: "Harga optimal produk baru",
      an: "Seperti GPS — bukan cuma bilang macet, tapi kasih rute alternatif", tool: "Optimization, simulation, RL" },
  ];
  return (
    <Sec c={c} id="analytics" icon="📐" title="4 Tipe Data Analytics"
      sub="Dari yang paling simple ke paling complex — setiap level menambah value">
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginBottom: 8 }}>
        {ts.map((t, i) => (
          <div key={i} onClick={() => setSel(sel === i ? null : i)} style={{ flex: 1, cursor: "pointer" }}>
            <div style={{
              height: 90 + i * 44, borderRadius: 14, padding: 16,
              background: sel === i ? t.color + "18" : t.color + "08",
              border: `1.5px solid ${sel === i ? t.color : c.bdr}`,
              display: "flex", flexDirection: "column", justifyContent: "flex-end", transition: "all .3s", position: "relative" }}>
              <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 2 }}>
                {[1,2,3,4].map(n => <div key={n} style={{ width: 3, height: 10, borderRadius: 2, background: n <= i + 1 ? t.color : c.dim + "30" }} />)}
              </div>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: t.color }}>{t.n}</div>
              <div style={{ fontSize: 10, color: c.sub, fontStyle: "italic", marginTop: 2 }}>"{t.q}"</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", margin: "8px 0 16px" }}>
        <span style={{ fontSize: 10, color: c.dim, fontWeight: 600 }}>MUDAH</span>
        <div style={{ flex: 1, maxWidth: 250, height: 2, background: c.grad, borderRadius: 2 }} />
        <span style={{ fontSize: 10, color: c.dim, fontWeight: 600 }}>SULIT + BERNILAI</span>
      </div>
      {sel !== null && (
        <Cd c={c} s={{ borderTop: `3px solid ${ts[sel].color}`, animation: "fadeIn .3s" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 28 }}>{ts[sel].icon}</span>
            <div>
              <h3 style={{ margin: 0, color: ts[sel].color, fontSize: 17 }}>{ts[sel].n} Analytics</h3>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: c.text }}>{ts[sel].d}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[{ l: "Contoh", v: ts[sel].ex, tg: ts[sel].color }, { l: "Analogi", v: ts[sel].an, tg: c.blue }, { l: "Tools", v: ts[sel].tool, tg: c.dim }].map((r, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: r.tg + "08" }}>
                <Tag color={r.tg}>{r.l}</Tag>
                <p style={{ margin: "6px 0 0", fontSize: 11, color: c.text, lineHeight: 1.5 }}>{r.v}</p>
              </div>
            ))}
          </div>
          <Trap c={c}>
            {sel === 0 && "\"Bagaimana penjualan Q3?\" = Descriptive kalau masa LALU. Kalau Q3 belum terjadi = PREDICTIVE!"}
            {sel === 1 && "Diagnostic bukan cuma \"lihat data\" — harus cari PENYEBAB. Merangkum aja = masih Descriptive."}
            {sel === 2 && "Prediksi ≠ pasti benar! Selalu ada uncertainty. Estimasi shelf-life/masa pakai = REGRESSION (output kontinu)."}
            {sel === 3 && "\"Berapa harga optimal?\" = Prescriptive (rekomendasi aksi), BUKAN Predictive."}
          </Trap>
        </Cd>
      )}
    </Sec>
  );
}

// ═══════ 5. ECOSYSTEM ═══════
function EcosystemSec({ c }) {
  const [hov, setHov] = useState(null);
  const ls = [
    { n: "Artificial Intelligence", d: "Bidang PALING LUAS — segala upaya bikin mesin 'cerdas'", color: c.cyan, r: 148 },
    { n: "Machine Learning", d: "SUBSET AI — mesin belajar dari data, tanpa diprogram satu-satu", color: c.purple, r: 112 },
    { n: "Neural Networks", d: "SUBSET ML — arsitektur terinspirasi neuron otak", color: c.amber, r: 76 },
    { n: "Deep Learning", d: "SUBSET NN — banyak layer → sangat powerful", color: c.rose, r: 42 },
  ];
  return (
    <Sec c={c} id="ecosystem" icon="🔭" title="Ekosistem: AI vs Data Science vs Big Data"
      sub="Hubungan dan perbedaan — ini sering keluar di UTS!">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <Cd c={c} s={{ padding: 20 }}>
          <svg viewBox="0 0 400 360" style={{ width: "100%" }}>
            {ls.map((l, i) => (
              <g key={i} style={{ cursor: "pointer" }} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
                <circle cx={210} cy={155} r={l.r} fill={hov === i ? l.color + "15" : l.color + "06"}
                  stroke={l.color} strokeWidth={hov === i ? 2 : 1} style={{ transition: "all .3s" }} />
                <text x={210} y={155 - l.r + 16} textAnchor="middle" fill={hov === i ? l.color : c.dim}
                  fontSize={l.r > 100 ? 10 : 9} fontWeight={700} fontFamily="inherit">{l.n}</text>
              </g>
            ))}
            <ellipse cx={130} cy={250} rx={92} ry={62} fill={c.green + "06"} stroke={c.green}
              strokeWidth={hov === "ds" ? 2 : 1} strokeDasharray="6 3" style={{ cursor: "pointer", transition: "all .3s" }}
              onMouseEnter={() => setHov("ds")} onMouseLeave={() => setHov(null)} />
            <text x={85} y={292} textAnchor="middle" fill={hov === "ds" ? c.green : c.dim} fontSize={10} fontWeight={700} fontFamily="inherit">Data Science</text>
            <ellipse cx={140} cy={280} rx={112} ry={52} fill={c.orange + "04"} stroke={c.orange}
              strokeWidth={hov === "bd" ? 2 : 1} strokeDasharray="6 3" style={{ cursor: "pointer", transition: "all .3s" }}
              onMouseEnter={() => setHov("bd")} onMouseLeave={() => setHov(null)} />
            <text x={65} y={328} textAnchor="middle" fill={hov === "bd" ? c.orange : c.dim} fontSize={10} fontWeight={700} fontFamily="inherit">Big Data</text>
          </svg>
        </Cd>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ls.map((l, i) => (
            <div key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{ padding: "10px 14px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
                background: hov === i ? l.color + "10" : "transparent",
                border: `1px solid ${hov === i ? l.color : c.bdr}`, transition: "all .3s", cursor: "pointer" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
              <div><div style={{ fontSize: 12, fontWeight: 700, color: l.color }}>{l.n}</div><div style={{ fontSize: 10, color: c.sub }}>{l.d}</div></div>
            </div>
          ))}
          {[{ n: "Data Science", d: "Ekstraksi insight — OVERLAP dengan AI & Big Data, tapi scope sendiri", color: c.green, k: "ds" },
            { n: "Big Data", d: "Data masif (6V) — fokus INFRASTRUKTUR penyimpanan & pemrosesan", color: c.orange, k: "bd" }].map(l => (
            <div key={l.k} onMouseEnter={() => setHov(l.k)} onMouseLeave={() => setHov(null)}
              style={{ padding: "10px 14px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
                background: hov === l.k ? l.color + "10" : "transparent",
                border: `1px solid ${hov === l.k ? l.color : c.bdr}`, transition: "all .3s", cursor: "pointer" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px dashed ${l.color}`, flexShrink: 0 }} />
              <div><div style={{ fontSize: 12, fontWeight: 700, color: l.color }}>{l.n}</div><div style={{ fontSize: 10, color: c.sub }}>{l.d}</div></div>
            </div>
          ))}
          <Trap c={c}>Data Science ≠ Big Data ≠ AI! DS BERIRISAN tapi punya scope sendiri. DS bisa tanpa Big Data (pakai data kecil), AI bisa tanpa DS (rule-based).</Trap>
        </div>
      </div>
    </Sec>
  );
}

// ═══════ 6. ROLES ═══════
function RolesSec({ c }) {
  const [sel, setSel] = useState(0);
  const rs = [
    { n: "Data Engineer", icon: "🔧", color: c.cyan, focus: "INFRASTRUKTUR — biar data bisa diakses",
      tasks: ["Mengumpulkan & mengelola data", "Membangun pipeline ETL", "Maintain arsitektur database"],
      skills: ["Data Ingest & ETL", "Database Systems", "Hadoop / Spark", "Data APIs", "Data Warehousing"],
      analogy: "Seperti TUKANG LEDENG — pastikan air (data) mengalir lancar" },
    { n: "Data Scientist", icon: "🧪", color: c.purple, focus: "ANALISIS — ubah data mentah jadi insight",
      tasks: ["Data mentah → insight via ML", "Eksperimen model & algoritma", "Storytelling & visualisasi"],
      skills: ["Python / R", "ML & Deep Learning", "Feature Engineering", "Statistics", "Visualization"],
      analogy: "Seperti DETEKTIF — cari petunjuk tersembunyi di data" },
    { n: "Business Stakeholder", icon: "💼", color: c.amber, focus: "KEPUTUSAN — terjemahkan insight ke aksi",
      tasks: ["Ukur ROI & NPV", "Analisis value chains", "Keputusan strategis berbasis data"],
      skills: ["Business Intelligence", "Statistics", "Data Stewardship", "Communication", "Domain Expertise"],
      analogy: "Seperti KAPTEN KAPAL — tentukan arah berdasarkan info crew" },
  ];
  return (
    <Sec c={c} id="roles" icon="👥" title="Peran Pelaku Sains Data"
      sub="Setiap industri bisa bervariasi, tapi umumnya ada 3 peran utama">
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {rs.map((r, i) => (
          <div key={i} onClick={() => setSel(i)} style={{ flex: 1, padding: "16px 14px", borderRadius: 14,
            cursor: "pointer", textAlign: "center", background: sel === i ? r.color + "12" : c.card,
            border: `2px solid ${sel === i ? r.color : c.bdr}`, transition: "all .3s" }}>
            <span style={{ fontSize: 32, display: "block", marginBottom: 6 }}>{r.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: sel === i ? r.color : c.sub }}>{r.n}</span>
          </div>
        ))}
      </div>
      <Cd c={c} s={{ borderTop: `3px solid ${rs[sel].color}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
          <div>
            <Tag color={rs[sel].color}>Fokus</Tag>
            <h4 style={{ margin: "8px 0", color: rs[sel].color, fontSize: 14 }}>{rs[sel].focus}</h4>
            {rs[sel].tasks.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "flex-start" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: rs[sel].color, marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: c.text }}>{t}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: c.blue + "08" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: c.blue }}>💭 ANALOGI:</span>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: c.text }}>{rs[sel].analogy}</p>
            </div>
          </div>
          <div>
            <Tag color={c.dim}>Core Skills</Tag>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {rs[sel].skills.map((s, i) => (
                <span key={i} style={{ padding: "5px 10px", borderRadius: 8, background: rs[sel].color + "10",
                  color: rs[sel].color, fontSize: 11, fontWeight: 600, border: `1px solid ${rs[sel].color}25` }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </Cd>
    </Sec>
  );
}

// ═══════ 7. PIPELINE ═══════
function PipelineSec({ c }) {
  return (
    <Sec c={c} id="pipeline" icon="⚙️" title="Training vs Usage"
      sub="Sistem KA punya 2 tahap: buat model (training) dan pakai model (usage)">
      <Cd c={c} s={{ marginBottom: 14, padding: 22 }}>
        <Tag color={c.purple}>Tahap 1: Training (Pengembangan)</Tag>
        <p style={{ margin: "6px 0 12px", fontSize: 11, color: c.sub }}>Fokus: bangun model yang <strong style={{ color: c.text }}>akurat dan rigid</strong> — proses panjang & mahal</p>
        <svg viewBox="0 0 780 60" style={{ width: "100%", display: "block" }}>
          {[{ x: 0, l: "Define Goal", color: c.cyan }, { x: 135, l: "Gather Data", color: c.amber },
            { x: 270, l: "Prepare Data", color: c.purple }, { x: 405, l: "Create Model", color: c.green },
            { x: 540, l: "Evaluate", color: c.rose }, { x: 660, l: "Deploy", color: c.pink }].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={8} width={115} height={38} rx={10} fill={b.color + "12"} stroke={b.color} strokeWidth={1.5} />
              <text x={b.x + 57} y={32} textAnchor="middle" fill={b.color} fontSize={10} fontWeight={700} fontFamily="inherit">{b.l}</text>
              {i < 5 && <path d={`M${b.x + 120} 27 L${[135, 270, 405, 540, 660][i] - 5} 27`} stroke={c.dim} strokeWidth={1.5} markerEnd="url(#arrP2)" />}
            </g>
          ))}
          <defs><marker id="arrP2" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill={c.dim} /></marker></defs>
        </svg>
      </Cd>
      <Cd c={c} s={{ padding: 22 }}>
        <Tag color={c.green}>Tahap 2: Usage (Penggunaan)</Tag>
        <p style={{ margin: "6px 0 12px", fontSize: 11, color: c.sub }}>Model sudah jadi → masukkan data baru → dapat hasil — cepat & murah</p>
        <svg viewBox="0 0 480 60" style={{ width: "55%", display: "block" }}>
          {[{ x: 0, l: "Send Data", color: c.cyan }, { x: 160, l: "Run Model", color: c.purple }, { x: 330, l: "Get Result", color: c.green }].map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={8} width={130} height={38} rx={10} fill={b.color + "12"} stroke={b.color} strokeWidth={1.5} />
              <text x={b.x + 65} y={32} textAnchor="middle" fill={b.color} fontSize={10} fontWeight={700} fontFamily="inherit">{b.l}</text>
              {i < 2 && <path d={`M${b.x + 135} 27 L${[160, 330][i] - 5} 27`} stroke={c.dim} strokeWidth={1.5} markerEnd="url(#arrP2)" />}
            </g>
          ))}
        </svg>
      </Cd>
      <Why c={c}>Bedakan! Training = panjang & mahal. Usage = cepat & murah. Kayak belajar masak (training) vs masak sehari-hari (usage).</Why>
    </Sec>
  );
}

// ═══════ 8. CRISP-DM ═══════
function CrispSec({ c }) {
  const [sel, setSel] = useState(null);
  const ps = [
    { n: "Business Understanding", num: 1, color: c.cyan, icon: "🎯", q: "Masalah apa yang mau dipecahkan?",
      d: "Definisikan masalah bisnis dulu — BUKAN langsung ke data/model!", detail: "Tentukan tujuan spesifik & pendekatan analitik (desc/diag/pred/presc). Tahap PALING KRUSIAL.",
      trap: "Perumusan scope bersama stakeholder = Business Understanding. Download data = BUKAN ini!" },
    { n: "Data Understanding", num: 2, color: c.amber, icon: "🔎", q: "Data apa yang dibutuhkan?",
      d: "Tentukan kebutuhan data, kumpulkan, pahami dengan EDA.", detail: "Tentukan konten, format, representasi. Iterasi jika data kurang → kembali ke fase 1.",
      trap: "Mengunduh data dari berbagai sumber = Data Understanding, BUKAN Data Preparation!" },
    { n: "Data Preparation", num: 3, color: c.purple, icon: "🧹", q: "Bagaimana menyiapkan data?",
      d: "Cleaning, integrasi, feature engineering. 70-90% WAKTU PROYEK!", detail: "Handle missing values, duplikat, encoding, normalisasi, feature engineering.",
      trap: "Feature engineering juga bagian Data Prep! Ini fase PALING MEMAKAN WAKTU." },
    { n: "Modeling", num: 4, color: c.green, icon: "🧠", q: "Model apa yang cocok?",
      d: "Pilih & latih model. Bersifat ITERATIF — eksperimen berulang.", detail: "Decision Tree, KNN, Naive Bayes, dll. Tune parameter. Bandingkan algoritma.",
      trap: "Implementasi kNN untuk estimasi harga = Modeling. Pengukuran regresi = EVALUATION, bukan Modeling!" },
    { n: "Evaluation", num: 5, color: c.rose, icon: "✅", q: "Apakah model menjawab masalah bisnis?",
      d: "Evaluasi kualitas model DAN kesesuaian dengan business problem.", detail: "Bukan cuma metrik teknis — harus BERGUNA untuk bisnis. Presentasi ke stakeholders.",
      trap: "Evaluasi = cek BUSINESS QUESTION dari fase 1 terjawab, bukan hanya accuracy tinggi!" },
    { n: "Deployment", num: 6, color: c.pink, icon: "🚀", q: "Bagaimana menerapkan di dunia nyata?",
      d: "Deploy, A/B testing, monitoring, evaluasi berkelanjutan.", detail: "TIDAK BERHENTI setelah deploy! ML models always get worse over time. Retraining berkala.",
      trap: "Deploy ≠ selesai! Model HARUS terus dimonitor dan di-retrain." },
  ];
  return (
    <Sec c={c} id="crisp" icon="🔄" title="CRISP-DM"
      sub="Cross-Industry Standard Process for Data Mining — metodologi PALING POPULER. Iteratif!">
      <Cd c={c} s={{ padding: 20, marginBottom: 14 }}>
        <svg viewBox="0 0 500 270" style={{ width: "100%", display: "block" }}>
          <circle cx={250} cy={135} r={32} fill={c.blue + "08"} stroke={c.bdr} strokeWidth={1} />
          <text x={250} y={131} textAnchor="middle" fill={c.dim} fontSize={9} fontWeight={700} fontFamily="inherit">DATA</text>
          <text x={250} y={143} textAnchor="middle" fill={c.dim} fontSize={7} fontFamily="inherit">(di tengah)</text>
          {ps.map((p, i) => {
            const a = (Math.PI / 3) * i - Math.PI / 2, R = 105;
            const x = 250 + R * Math.cos(a), y = 135 + R * Math.sin(a);
            const na = (Math.PI / 3) * ((i + 1) % 6) - Math.PI / 2;
            const nx = 250 + R * Math.cos(na), ny = 135 + R * Math.sin(na);
            const isA = sel === i;
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => setSel(sel === i ? null : i)}>
                <line x1={x} y1={y} x2={nx} y2={ny} stroke={isA ? p.color : c.bdr} strokeWidth={1} />
                <circle cx={x} cy={y} r={isA ? 34 : 30} fill={isA ? p.color + "20" : p.color + "08"}
                  stroke={p.color} strokeWidth={isA ? 2.5 : 1.5} style={{ transition: "all .3s" }} />
                <text x={x} y={y - 4} textAnchor="middle" fill={isA ? p.color : c.sub} fontSize={8} fontWeight={700} fontFamily="inherit">
                  {p.n.split(" ")[0]}
                </text>
                <text x={x} y={y + 7} textAnchor="middle" fill={isA ? p.color : c.sub} fontSize={7} fontWeight={600} fontFamily="inherit">
                  {p.n.split(" ").slice(1).join(" ")}
                </text>
                <text x={x} y={y + 19} textAnchor="middle" fill={p.color} fontSize={9} fontWeight={800} fontFamily="inherit">{p.num}</text>
              </g>
            );
          })}
          <text x={250} y={260} textAnchor="middle" fill={c.dim} fontSize={9} fontFamily="inherit" fontStyle="italic">↻ Iteratif — bisa kembali ke fase sebelumnya</text>
        </svg>
      </Cd>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 14 }}>
        {ps.map((p, i) => (
          <div key={i} onClick={() => setSel(sel === i ? null : i)}
            style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer",
              background: sel === i ? p.color + "12" : c.card, border: `1.5px solid ${sel === i ? p.color : c.bdr}`, transition: "all .3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>{p.icon}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: p.color }}>{p.num}. {p.n}</div>
                <div style={{ fontSize: 9, color: c.dim, fontStyle: "italic" }}>{p.q}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sel !== null && (
        <Cd c={c} s={{ borderTop: `3px solid ${ps[sel].color}`, animation: "fadeIn .3s" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 24 }}>{ps[sel].icon}</span>
            <div><Tag color={ps[sel].color}>Fase {ps[sel].num}</Tag>
              <h3 style={{ margin: "4px 0 0", color: ps[sel].color, fontSize: 16 }}>{ps[sel].n}</h3></div>
          </div>
          <p style={{ margin: "0 0 6px", fontSize: 13, color: c.text, lineHeight: 1.6 }}>{ps[sel].d}</p>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: c.sub, lineHeight: 1.6 }}>{ps[sel].detail}</p>
          <Trap c={c}>{ps[sel].trap}</Trap>
        </Cd>
      )}
    </Sec>
  );
}

// ═══════ 9. CASE STUDY ═══════
function CaseStudySec({ c }) {
  const [step, setStep] = useState(0);
  const ss = [
    { ph: "Business Understanding", color: c.cyan, icon: "🏥", items: [
      { l: "Masalah", v: "Pankreatitis Akut (AP) di ICU. Kematian 1-5%. Sulit identifikasi pasien risiko tinggi." },
      { l: "Pertanyaan", v: "Bagaimana alokasi sumber daya terbatas untuk perawatan efisien?" },
      { l: "Reformulasi", v: "Minimalisasi dampak AP → prediksi risiko kematian pasien." },
      { l: "Tujuan", v: "Prediksi risiko keparahan/kematian dari data historis." },
      { l: "Pendekatan", v: "Klasifikasi (risiko tinggi vs tidak) → Decision Tree." }] },
    { ph: "Data Understanding", color: c.amber, icon: "📋", items: [
      { l: "Syarat", v: "Usia >18, di ICU ≥24 jam, diagnosis AP." },
      { l: "Sumber", v: "Electronic Health Records (EHR) RS." },
      { l: "Format", v: "1 entri per pasien, kolom = variabel." },
      { l: "Label", v: "Meninggal = risiko tinggi, sisanya = tidak." }] },
    { ph: "Data Preparation", color: c.purple, icon: "🧹", items: [
      { l: "Integrasi", v: "3 sumber: pendaftaran + lab/klinis + perangkat ICU." },
      { l: "Cleaning", v: "Data 24 jam pertama saja. Hapus duplikat. Hapus >20% missing." },
      { l: "Feature Eng.", v: "Agregasi data historis per pasien (rerata)." },
      { l: "Variabel", v: "Umur, kelamin, WBC, platelet, creatinine, glukosa, dll." }] },
    { ph: "Modeling", color: c.green, icon: "🌳", items: [
      { l: "Model", v: "Decision Tree classifier." },
      { l: "Input", v: "Fitur klinis & lab yang sudah di-prepare." },
      { l: "Output", v: "Risiko kematian: Ya / Tidak." },
      { l: "Proses", v: "Iteratif — eksperimen berulang." }] },
    { ph: "Evaluation", color: c.rose, icon: "✅", items: [
      { l: "Cek", v: "Apakah model menjawab business question awal?" },
      { l: "Stakeholder", v: "Pastikan manajemen RS paham output." },
      { l: "Metrik", v: "Accuracy, recall, precision, F1 + dampak klinis." }] },
    { ph: "Deployment", color: c.pink, icon: "🚀", items: [
      { l: "Deploy", v: "Model diuji real-time di ICU." },
      { l: "Edukasi", v: "Petugas klinis diajari baca output model." },
      { l: "Feedback", v: "Umpan balik → penyempurnaan model." },
      { l: "Maintain", v: "Monitoring + retraining berkala." }] },
  ];
  return (
    <Sec c={c} id="casestudy" icon="⚕️" title="Studi Kasus: Pankreatitis Akut"
      sub="Penerapan CRISP-DM pada prediksi risiko kematian di ICU">
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {ss.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{ flex: 1, padding: "8px 6px", borderRadius: 10,
            cursor: "pointer", textAlign: "center", background: step === i ? s.color + "15" : c.card,
            border: `1.5px solid ${step === i ? s.color : c.bdr}`, transition: "all .3s" }}>
            <span style={{ fontSize: 18, display: "block" }}>{s.icon}</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: step === i ? s.color : c.dim }}>{s.ph.split(" ")[0]}</span>
          </div>
        ))}
      </div>
      <Cd c={c} s={{ borderTop: `3px solid ${ss[step].color}`, animation: "fadeIn .3s" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>{ss[step].icon}</span>
          <div><Tag color={ss[step].color}>Fase {step + 1}</Tag><h3 style={{ margin: "4px 0 0", color: ss[step].color, fontSize: 16 }}>{ss[step].ph}</h3></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {ss[step].items.map((it, i) => (
            <div key={i} style={{ padding: "10px 12px", borderRadius: 10, background: ss[step].color + "06",
              border: `1px solid ${ss[step].color}12`,
              gridColumn: i === ss[step].items.length - 1 && ss[step].items.length % 2 !== 0 ? "1/-1" : "auto" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: ss[step].color, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>{it.l}</div>
              <p style={{ margin: 0, fontSize: 11, color: c.text, lineHeight: 1.5 }}>{it.v}</p>
            </div>
          ))}
        </div>
      </Cd>
    </Sec>
  );
}

// ═══════ 10. DATA TYPES ═══════
function DataTypesSec({ c }) {
  const [sel, setSel] = useState(0);
  const ts = [
    { n: "Tabular", icon: "📊", color: c.cyan, d: "Data format TABEL — baris = entri, kolom = variabel. Paling umum.",
      ex: "Human Body Measurement: Age, BMI, Body Fat %, Heart Rate, dll.",
      tasks: ["Clustering → rekomendasi fitness per kelompok", "Regresi → prediksi BMI", "Klasifikasi → kategori berat badan", "Time-series → body fat vs usia"] },
    { n: "Textual", icon: "📝", color: c.purple, d: "Data TEKS — buku, tweet, review. Analisis sentimen, topik, pola bahasa.",
      ex: "Sentimen Harry Potter per bab, asosiasi kata per umur di Facebook.",
      tasks: ["Sentiment analysis", "Topic modeling berita", "Word association per kelompok", "Bias detection media"] },
    { n: "Image", icon: "🖼️", color: c.amber, d: "Data CITRA — satelit, X-ray, CCTV. Ekstrak informasi visual.",
      ex: "Citra satelit malam → prediksi GDP. Indonesia 1997→1998: cahaya -6%, GDP -13%.",
      tasks: ["Restorasi warna foto lama", "Deteksi penyakit dari X-ray/MRI", "Deteksi kriminal CCTV", "Prediksi ekonomi dari satelit"] },
  ];
  return (
    <Sec c={c} id="datatypes" icon="🗂️" title="Data Reimagined — Tipe Data"
      sub="Data bukan cuma angka di tabel! Teks, gambar, suara — semuanya bisa dianalisis">
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {ts.map((t, i) => (
          <div key={i} onClick={() => setSel(i)} style={{ flex: 1, padding: "16px 14px", borderRadius: 14,
            cursor: "pointer", textAlign: "center", background: sel === i ? t.color + "12" : c.card,
            border: `2px solid ${sel === i ? t.color : c.bdr}`, transition: "all .3s" }}>
            <span style={{ fontSize: 30, display: "block", marginBottom: 6 }}>{t.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: sel === i ? t.color : c.sub }}>{t.n} Data</span>
          </div>
        ))}
      </div>
      <Cd c={c} s={{ borderTop: `3px solid ${ts[sel].color}` }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: c.text, lineHeight: 1.6 }}>{ts[sel].d}</p>
        <div style={{ padding: "8px 12px", borderRadius: 8, background: ts[sel].color + "08", marginBottom: 12 }}>
          <Tag color={ts[sel].color}>Contoh</Tag>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: c.text }}>{ts[sel].ex}</p>
        </div>
        <Tag color={c.amber}>Analisis yang bisa dilakukan</Tag>
        <div style={{ marginTop: 8 }}>
          {ts[sel].tasks.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4, alignItems: "flex-start" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: ts[sel].color, marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: c.text }}>{t}</span>
            </div>
          ))}
        </div>
      </Cd>
    </Sec>
  );
}

// ═══════ 11. FAILURES ═══════
function FailuresSec({ c }) {
  const cs = [
    { a: "Problem", d: "Tidak jelas / salah formulasi. Over-promise.", icon: "❓", color: c.rose, pct: 30 },
    { a: "Data", d: "Tidak cukup, tidak tepat, kualitas buruk, bias, makna tidak jelas.", icon: "💾", color: c.amber, pct: 35 },
    { a: "Model", d: "Terlalu kompleks, metrik tidak tepat.", icon: "🧩", color: c.purple, pct: 15 },
    { a: "Algoritma", d: "Terlalu rumit, tak bisa dipahami.", icon: "⚙️", color: c.cyan, pct: 10 },
    { a: "SDM", d: "One-man show, stakeholder support kurang.", icon: "👥", color: c.green, pct: 10 },
  ];
  return (
    <Sec c={c} id="failures" icon="⚠️" title="Kegagalan Proyek Sains Data"
      sub="Menurut Gartner (2018): mayoritas proyek gagal. Kenapa?">
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {[{ v: "15-20%", l: "Proyek SELESAI", color: c.amber }, { v: "~8%", l: "Menghasilkan VALUE", color: c.rose }, { v: "70-90%", l: "Waktu di DATA PREP", color: c.cyan }].map((s, i) => (
          <Cd key={i} c={c} s={{ flex: 1, textAlign: "center", padding: "16px 12px" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.v}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: c.text, marginTop: 4 }}>{s.l}</div>
          </Cd>
        ))}
      </div>
      <Cd c={c} s={{ padding: 22 }}>
        <p style={{ margin: "0 0 14px", fontSize: 11, fontWeight: 700, color: c.dim, letterSpacing: 1, textTransform: "uppercase" }}>Penyebab Kegagalan</p>
        {cs.map((ca, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14 }}>{ca.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: ca.color, minWidth: 65 }}>{ca.a}</span>
              <span style={{ fontSize: 11, color: c.sub, flex: 1 }}>{ca.d}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, height: 7, background: ca.color + "10", borderRadius: 4 }}>
                <div style={{ width: `${ca.pct}%`, height: "100%", background: ca.color, borderRadius: 4, transition: "width 1s" }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: ca.color, minWidth: 30 }}>{ca.pct}%</span>
            </div>
          </div>
        ))}
      </Cd>
      <Why c={c}>Problem + Data = 65% kegagalan! Makanya jangan langsung loncat ke model. Pahami masalahnya dulu, kurasi datanya benar.</Why>
    </Sec>
  );
}

// ═══════ 12. METHODS ═══════
function MethodsSec({ c }) {
  const ms = [
    { n: "KDD Process", f: "Teknis", color: c.cyan, steps: ["Selection", "Preprocessing", "Transformation", "Data Mining", "Interpretation"],
      d: "Knowledge Discovery in Databases — proses LINIER. Fokus teknis, kurang bicara bisnis." },
    { n: "CRISP-DM", f: "Bisnis + Teknis", color: c.purple, steps: ["Business Und.", "Data Und.", "Data Prep", "Modeling", "Evaluation", "Deployment"],
      d: "Paling populer — siklus ITERATIF, bisa kembali. Fokus bisnis DAN teknis." },
    { n: "IBM DS", f: "Bisnis + Teknis", color: c.amber, steps: ["Business Und.", "Analytic Approach", "Data Req.", "Collection", "Understanding", "Prep", "Modeling", "Eval", "Deploy", "Feedback"],
      d: "Tambah Analytic Approach & Feedback loop eksplisit." },
    { n: "Microsoft TDSP", f: "Bisnis + Teknis", color: c.green, steps: ["Business Und.", "Data Acquisition", "Modeling", "Deployment", "Acceptance"],
      d: "Team DS Process — detail sub-step seperti Feature Eng & A/B Testing." },
  ];
  return (
    <Sec c={c} id="methods" icon="📋" title="Metodologi Lainnya"
      sub="Semuanya punya pola mirip: pahami masalah → kumpulkan data → siapkan → model → evaluasi → deploy">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {ms.map((m, i) => (
          <Cd key={i} c={c} gl s={{ borderLeft: `3px solid ${m.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <h4 style={{ margin: 0, color: m.color, fontSize: 13 }}>{m.n}</h4><Tag color={m.color}>{m.f}</Tag>
            </div>
            <p style={{ margin: "0 0 8px", fontSize: 10, color: c.sub, lineHeight: 1.5 }}>{m.d}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {m.steps.map((s, j) => (
                <span key={j} style={{ fontSize: 8, padding: "2px 6px", borderRadius: 5, background: m.color + "0a",
                  color: m.color, border: `1px solid ${m.color}20`, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 2 }}>
                  {j > 0 && <span style={{ color: c.dim }}>→</span>}{s}
                </span>
              ))}
            </div>
          </Cd>
        ))}
      </div>
      <Cd c={c} s={{ marginTop: 10, borderLeft: `3px solid ${c.rose}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>🇮🇩</span>
          <div>
            <h4 style={{ margin: 0, color: c.rose, fontSize: 12 }}>SKKNI — Kepmenaker No. 299/2020</h4>
            <p style={{ margin: "3px 0 0", fontSize: 10, color: c.sub }}>Standar Kompetensi Kerja Nasional Indonesia — 21 fungsi dasar AI & Data Science</p>
          </div>
        </div>
      </Cd>
    </Sec>
  );
}

// ═══════ MAIN ═══════
export default function App() {
  const [dark, setDark] = useState(false);
  const [nav, setNav] = useState("motivasi");
  const c = dark ? TH.dark : TH.light;
  useEffect(() => {
    const h = () => { let cur = "motivasi"; for (const s of NAV) { const el = document.getElementById(s.id); if (el && el.getBoundingClientRect().top <= 160) cur = s.id; } setNav(cur); };
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.text, fontFamily: "'DM Sans','Noto Sans',sans-serif", transition: "background .4s,color .4s" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${c.bdr};border-radius:3px}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: c.bg + "e0", backdropFilter: "blur(16px)", borderBottom: `1px solid ${c.bdr}`, padding: "7px 16px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 2, overflowX: "auto", flex: 1, paddingRight: 12 }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                style={{ padding: "4px 9px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: nav === n.id ? c.cyan + "15" : "transparent", color: nav === n.id ? c.cyan : c.dim,
                  fontSize: 10, fontWeight: 700, whiteSpace: "nowrap", transition: "all .2s", fontFamily: "inherit" }}>{n.l}</button>
            ))}
          </div>
          <button onClick={() => setDark(!dark)} style={{ padding: "4px 12px", borderRadius: 20, border: `1px solid ${c.bdr}`,
            background: c.card, color: c.text, cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "inherit" }}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 20px 80px" }}>
        <MotivasiSec c={c} /><BigDataSec c={c} /><DefinisiSec c={c} /><AnalyticsSec c={c} />
        <EcosystemSec c={c} /><RolesSec c={c} /><PipelineSec c={c} /><CrispSec c={c} />
        <CaseStudySec c={c} /><DataTypesSec c={c} /><FailuresSec c={c} /><MethodsSec c={c} />
        <div style={{ marginTop: 60, padding: "20px 0", borderTop: `1px solid ${c.bdr}`, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 11, color: c.dim }}>Materi 03 — Sains Data • CSGE603130 KASDD • Genap 2025/2026</p>
          <p style={{ margin: "3px 0 0", fontSize: 10, color: c.dim }}>Fakultas Ilmu Komputer — Universitas Indonesia</p>
        </div>
      </div>
    </div>
  );
}
