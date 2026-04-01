import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
//   KASDAD MATERI 1 · KECERDASAN ARTIFISIAL
//   Rebuilt with deep explanations & polished visuals
// ═══════════════════════════════════════════════════════════

const P = {
  dark: {
    bg: "#080b14", bg2: "#0d1020", card: "#111528", cardHover: "#161b34",
    surface: "#1a1f38", surfaceAlt: "#0f1225",
    text: "#e4e2f0", sub: "#9694b0", dim: "#5c5a75", faint: "#33314a",
    gold: "#f0b440", teal: "#45d4c8", rose: "#f76c82", violet: "#a68df8", sky: "#58b8f0",
    border: "#1e2240", borderLight: "#282d50",
  },
  light: {
    bg: "#f4f1ec", bg2: "#edeae4", card: "#ffffff", cardHover: "#faf8f4",
    surface: "#f0ede6", surfaceAlt: "#e8e5de",
    text: "#1c1a2e", sub: "#6e6b85", dim: "#a09db5", faint: "#d0cee0",
    gold: "#c08818", teal: "#2a9e94", rose: "#d84858", violet: "#7b60c8", sky: "#3888c0",
    border: "#e0ddd5", borderLight: "#d5d2ca",
  },
};

const SECTS = [
  { id: "def", label: "Definisi AI", ic: "📖" },
  { id: "agent", label: "Agen Cerdas", ic: "🤖" },
  { id: "env", label: "Lingkungan", ic: "🌍" },
  { id: "atype", label: "Tipe Agen", ic: "🧬" },
  { id: "taxo", label: "Taksonomi", ic: "🗂️" },
  { id: "hist", label: "Sejarah", ic: "📜" },
  { id: "ml", label: "Dasar ML", ic: "⚡" },
];

const Pill = ({ children, color }) => (
  <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.5, color, background: color + "12", padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
);

const Why = ({ children, t }) => (
  <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 12, background: t.gold + "06", borderLeft: `3px solid ${t.gold}40` }}>
    <div style={{ fontSize: 10, fontWeight: 800, color: t.gold, letterSpacing: 1.5, marginBottom: 4 }}>💡 KENAPA INI PENTING?</div>
    <div style={{ fontSize: 12, color: t.sub, lineHeight: 1.65 }}>{children}</div>
  </div>
);

const STitle = ({ t, ic, title, sub }) => (
  <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 4 }}>
    <div style={{ fontSize: 36, marginBottom: 6 }}>{ic}</div>
    <h2 style={{ fontSize: 24, fontWeight: 800, color: t.text, letterSpacing: -0.5, lineHeight: 1.2, margin: "0 0 6px" }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: t.sub, margin: 0, maxWidth: 520, marginInline: "auto", lineHeight: 1.6 }}>{sub}</p>}
  </div>
);

const InfoBlock = ({ t, label, text, col }) => (
  <div style={{ padding: "10px 14px", borderRadius: 10, background: t.surfaceAlt, borderLeft: `3px solid ${col}35` }}>
    <div style={{ fontSize: 9, fontWeight: 800, color: col, letterSpacing: 1.5, marginBottom: 3, textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 12, color: t.text, lineHeight: 1.65 }}>{text}</div>
  </div>
);

// ═══════════ SECTION 1: DEFINISI AI ═══════════

function DefSection({ t }) {
  const [sel, setSel] = useState(null);
  const defs = [
    { q: "Thinking Humanly", label: "Cognitive Modeling", ic: "🧠", col: t.rose,
      who: "Haugeland 1985, Bellman 1978",
      core: "Bagaimana membuat komputer berpikir seperti manusia?",
      method: "Untuk menjawab ini, kita harus tahu dulu bagaimana manusia berpikir. Caranya lewat introspeksi (mengamati pikiran sendiri), eksperimen psikologi (observasi perilaku), dan brain imaging (scan otak).",
      field: "Cognitive Science = gabungan model AI + psikologi eksperimental → membangun teori tentang cara kerja akal manusia",
      ex: "Convolutional Neural Networks (CNN) terinspirasi dari cara visual cortex otak memproses gambar — neuron di otak merespons area kecil (receptive field), CNN meniru ini dengan filter.",
      critique: "Kita belum sepenuhnya paham cara manusia berpikir, jadi sulit menjadikan itu standar." },
    { q: "Thinking Rationally", label: "Laws of Thought", ic: "⚖️", col: t.violet,
      who: "Charniak & McDermott 1985, Winston 1992",
      core: "Bagaimana membuat komputer berpikir secara logis dan benar?",
      method: "Pakai logika formal — penalaran yang tak terbantahkan. Jika premis benar dan aturan benar, kesimpulan PASTI benar.",
      field: "Classical logic (proposisional, first-order), probabilistic logic untuk menangani ketidakpastian",
      ex: "Modus Ponens: Jika hujan → jalan basah. Sekarang hujan. Maka: jalan basah. Ini 100% valid secara logika.",
      critique: "3 masalah: (1) Manusia sering TIDAK rasional, (2) Tidak semua pengetahuan bisa ditulis dalam logika formal, (3) Tidak scalable — terlalu lambat untuk masalah besar." },
    { q: "Acting Humanly", label: "Turing Test", ic: "🎭", col: t.teal,
      who: "Kurzweil 1990, Rich & Knight 1991",
      core: "Bisakah mesin berperilaku sehingga tidak bisa dibedakan dari manusia?",
      method: "Turing Test: seorang tester bertanya ke mesin dan manusia lewat teks. Jika tester tidak bisa bedakan mana mesin, mesin itu \"cerdas\".",
      field: "Untuk lulus perlu: NLP (komunikasi), knowledge representation (simpan pengetahuan), automated reasoning, machine learning. Total Turing Test tambah: computer vision + robotika.",
      ex: "Chatbot modern seperti ChatGPT bisa meyakinkan banyak orang bahwa itu manusia — tapi apakah benar-benar \"berpikir\"?",
      critique: "Pesawat terbang sukses tanpa meniru kepakan sayap burung. AI juga tidak harus meniru perilaku manusia untuk bisa cerdas." },
    { q: "Acting Rationally", label: "Rational Agent", ic: "🎯", col: t.gold, star: true,
      who: "Poole et al. 1998, Nilsson 1998",
      core: "\"Do the right thing\" — bertindak untuk hasil TERBAIK yang diharapkan.",
      method: "Rational agent = agen yang selalu memilih aksi dengan expected outcome terbaik. Diukur lewat fungsi utilitas atau cost function.",
      field: "Lebih general dari thinking rationally karena mencakup perilaku tanpa penalaran eksplisit (contoh: refleks menarik tangan dari kompor panas — rasional tapi tanpa \"berpikir logis\"). Paling mudah dimodelkan secara matematis.",
      ex: "Self-driving car: sensor deteksi situasi → pilih aksi yang memaksimalkan keselamatan + kecepatan + kenyamanan.",
      critique: "Perfect rationality (selalu optimal) sering impossible di dunia nyata yang kompleks. Solusi: bounded rationality — cari yang \"cukup baik\" dalam batasan komputasi." },
  ];

  return (
    <div>
      <STitle t={t} ic="📖" title="4 Definisi Kecerdasan Artifisial" sub="Russell & Norvig membagi definisi AI berdasarkan 2 dimensi: Thinking vs Acting, dan Humanly vs Rationally" />
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Column headers */}
        <div style={{ display: "grid", gridTemplateColumns: "42px 1fr 1fr", gap: 10, marginBottom: 6 }}>
          <div/>
          <div style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: t.dim, letterSpacing: 2 }}>👤 HUMAN-LIKE</div>
          <div style={{ textAlign: "center", fontSize: 10.5, fontWeight: 700, color: t.dim, letterSpacing: 2 }}>📐 RATIONAL</div>
        </div>
        {[["🧠", "THOUGHT", [0, 1]], ["🦾", "BEHAVIOR", [2, 3]]].map(([rowIc, rowLabel, idxs], ri) => (
          <div key={ri} style={{ display: "grid", gridTemplateColumns: "42px 1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
              <span style={{ fontSize: 18 }}>{rowIc}</span>
              <span style={{ fontSize: 7, fontWeight: 800, color: t.dim, letterSpacing: 1, writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{rowLabel}</span>
            </div>
            {idxs.map(idx => {
              const d = defs[idx]; const isO = sel === idx;
              return (
                <div key={idx} onClick={() => setSel(isO ? null : idx)} style={{
                  padding: "16px 18px", borderRadius: 16, cursor: "pointer",
                  background: isO ? d.col + "0a" : t.card, border: `1.5px solid ${isO ? d.col + "50" : t.border}`,
                  transition: "all 0.3s", boxShadow: isO ? `0 0 24px ${d.col}10` : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 24 }}>{d.ic}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: d.col }}>{d.label}</div>
                      <div style={{ fontSize: 10, color: t.dim }}>{d.who}</div>
                    </div>
                    {d.star && <Pill color={d.col}>Model Standar</Pill>}
                  </div>
                  <p style={{ fontSize: 12.5, color: isO ? t.text : t.sub, lineHeight: 1.6, margin: 0 }}>{d.core}</p>
                  {isO && (
                    <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                      <InfoBlock t={t} label="Pendekatan" text={d.method} col={d.col} />
                      <InfoBlock t={t} label="Bidang Terkait" text={d.field} col={t.teal} />
                      <InfoBlock t={t} label="Contoh Nyata" text={d.ex} col={t.sky} />
                      <InfoBlock t={t} label="Kritik / Kelemahan" text={d.critique} col={t.rose} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Why t={t}>
        Di kuliah ini, kita pakai pendekatan <strong style={{ color: t.gold }}>Acting Rationally</strong> karena paling mudah dimodelkan secara matematis. Tapi ada <strong style={{ color: t.rose }}>Value Alignment Problem</strong> — bagaimana memastikan tujuan mesin selaras dengan keinginan manusia? Contoh: mesin catur yang disuruh "menang" bisa curang. Solusinya → <strong style={{ color: t.teal }}>Provably Beneficial AI</strong>.
      </Why>
    </div>
  );
}

// ═══════════ SECTION 2: AGEN CERDAS ═══════════

function AgentSection({ t }) {
  return (
    <div>
      <STitle t={t} ic="🤖" title="Agen Cerdas" sub="Agen = entitas yang merasakan lingkungan lewat sensor, lalu bertindak lewat aktuator" />
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ padding: "24px 16px", borderRadius: 18, background: t.card, border: `1px solid ${t.border}`, marginBottom: 16 }}>
          <svg viewBox="0 0 640 300" style={{ width: "100%", height: "auto" }}>
            <defs>
              <marker id="ap" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill={t.violet}/></marker>
              <marker id="aa" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill={t.rose}/></marker>
              <marker id="ag" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={t.dim}/></marker>
            </defs>
            <rect x="15" y="10" width="360" height="280" rx="22" fill="none" stroke={t.gold + "30"} strokeWidth="1.5"/>
            <text x="195" y="40" textAnchor="middle" fill={t.gold} fontSize="13" fontWeight="800" letterSpacing="3">AGEN</text>
            <rect x="430" y="10" width="195" height="280" rx="22" fill="none" stroke={t.teal + "25"} strokeWidth="1.5" strokeDasharray="8 4"/>
            <text x="528" y="40" textAnchor="middle" fill={t.teal} fontSize="12" fontWeight="700" letterSpacing="2">LINGKUNGAN</text>
            <text x="528" y="58" textAnchor="middle" fill={t.dim} fontSize="9">dunia luar agen</text>
            <rect x="240" y="70" width="120" height="50" rx="12" fill={t.violet + "12"} stroke={t.violet + "40"} strokeWidth="1.5"/>
            <text x="300" y="95" textAnchor="middle" fill={t.violet} fontSize="13" fontWeight="700">Sensor</text>
            <text x="300" y="110" textAnchor="middle" fill={t.dim} fontSize="9">kamera, GPS, sonar</text>
            <rect x="55" y="115" width="220" height="80" rx="16" fill={t.surface} stroke={t.borderLight} strokeWidth="1.5"/>
            <text x="165" y="148" textAnchor="middle" fill={t.text} fontSize="12" fontWeight="700">Fungsi / Program Agen</text>
            <text x="165" y="172" textAnchor="middle" fill={t.gold} fontSize="16" fontWeight="800" fontFamily="'Courier New', monospace">f : P* → A</text>
            <rect x="240" y="210" width="120" height="50" rx="12" fill={t.rose + "12"} stroke={t.rose + "40"} strokeWidth="1.5"/>
            <text x="300" y="235" textAnchor="middle" fill={t.rose} fontSize="13" fontWeight="700">Aktuator</text>
            <text x="300" y="250" textAnchor="middle" fill={t.dim} fontSize="9">kemudi, gas, rem</text>
            <line x1="430" y1="95" x2="365" y2="95" stroke={t.violet} strokeWidth="2.5" markerEnd="url(#ap)"/>
            <rect x="375" y="76" width="60" height="18" rx="4" fill={t.violet + "15"}/>
            <text x="405" y="89" textAnchor="middle" fill={t.violet} fontSize="9.5" fontWeight="700">Percepts</text>
            <path d="M 270 120 Q 250 130 250 135 L 230 135" stroke={t.dim} strokeWidth="1.5" fill="none" markerEnd="url(#ag)"/>
            <path d="M 230 195 Q 250 200 260 210" stroke={t.dim} strokeWidth="1.5" fill="none" markerEnd="url(#ag)"/>
            <line x1="365" y1="235" x2="430" y2="235" stroke={t.rose} strokeWidth="2.5" markerEnd="url(#aa)"/>
            <rect x="375" y="218" width="55" height="18" rx="4" fill={t.rose + "15"}/>
            <text x="403" y="231" textAnchor="middle" fill={t.rose} fontSize="9.5" fontWeight="700">Actions</text>
          </svg>
        </div>

        {/* Formula */}
        <div style={{ padding: "16px 20px", borderRadius: 14, background: t.gold + "04", border: `1px solid ${t.gold}15`, marginBottom: 16 }}>
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: t.gold, fontFamily: "'Courier New', monospace", marginBottom: 10 }}>f : P* → A</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { sym: "P*", name: "Percept Sequence", desc: "Seluruh riwayat percept dari awal — bukan cuma yang sekarang! Ini complete history.", col: t.violet },
              { sym: "A", name: "Action", desc: "Tindakan yang dipilih agen: gerakan fisik (belok), atau keputusan (approve/reject).", col: t.rose },
              { sym: "f", name: "Agent Function", desc: "Pemetaan abstrak dari seluruh history percept ke aksi. Agent Program = implementasi konkritnya di hardware.", col: t.gold },
            ].map((s, i) => (
              <div key={i} style={{ padding: "12px", borderRadius: 10, background: t.card, border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.col, fontFamily: "monospace", marginBottom: 4 }}>{s.sym}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: s.col, marginBottom: 3 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.55 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PEAS */}
        <div style={{ padding: "18px 20px", borderRadius: 14, background: t.card, border: `1px solid ${t.border}`, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 4 }}>🎯 PEAS Framework</div>
          <div style={{ fontSize: 11.5, color: t.sub, marginBottom: 14 }}>Sebelum desain agen, definisikan <strong style={{ color: t.text }}>lingkup tugasnya</strong>. Contoh: Taksi Otonom</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { l: "P", full: "Performance", desc: "Ukuran sukses → aman, cepat, patuh rambu, nyaman", col: t.gold, note: "Diukur pada LINGKUNGAN, bukan state agen!" },
              { l: "E", full: "Environment", desc: "Dunia luar → jalan, rambu, kendaraan lain, penumpang", col: t.teal, note: "Menentukan seberapa sulit masalah agen" },
              { l: "A", full: "Actuators", desc: "Alat bertindak → kemudi, gas, rem, klakson, sinyal", col: t.rose, note: "Menentukan aksi apa saja yang tersedia" },
              { l: "S", full: "Sensors", desc: "Alat persepsi → kamera, LIDAR, sonar, speedometer, GPS", col: t.violet, note: "Menentukan seberapa banyak info yang bisa didapat" },
            ].map((p, i) => (
              <div key={i} style={{ padding: "12px 14px", borderRadius: 12, background: p.col + "06", borderLeft: `3px solid ${p.col}40` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: p.col + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: p.col }}>{p.l}</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.col }}>{p.full}</span>
                </div>
                <div style={{ fontSize: 11.5, color: t.text, lineHeight: 1.5, marginBottom: 4 }}>{p.desc}</div>
                <div style={{ fontSize: 10, color: t.gold, fontStyle: "italic" }}>⚠️ {p.note}</div>
              </div>
            ))}
          </div>
        </div>

        <Why t={t}>
          Performance measure diukur pada <strong style={{ color: t.text }}>keadaan lingkungan</strong>, bukan state internal agen. Kalau vacuum cleaner diukur dari "jumlah debu dibersihkan dalam 8 jam", agen bisa curang — sebar debu dulu baru bersihkan! Ukur <strong style={{ color: t.teal }}>kebersihan lantai keseluruhan</strong> lebih tepat.
        </Why>
      </div>
    </div>
  );
}

// ═══════════ SECTION 3: ENVIRONMENT TYPES ═══════════

function EnvSection({ t }) {
  const [open, setOpen] = useState(null);
  const envs = [
    { prop: "Observable", a: "Fully", b: "Partially", ic: "👁️", col: t.teal, mean: "Apakah sensor bisa lihat SELURUH keadaan lingkungan?", exA: "Catur — seluruh papan terlihat", exB: "Mengemudi — ada blind spot", why: "Jika partially → agen perlu internal state/model untuk melacak hal yang tidak terlihat." },
    { prop: "Agents", a: "Single", b: "Multi", ic: "👥", col: t.violet, mean: "Apakah ada entitas lain yang juga bertindak di lingkungan?", exA: "Sudoku — hanya kamu", exB: "Catur — ada lawan", why: "Multi-agent bisa kompetitif atau kooperatif. Perilaku agen lain jadi sumber ketidakpastian." },
    { prop: "Deterministic", a: "Deterministic", b: "Stochastic", ic: "🎲", col: t.sky, mean: "Apakah state selanjutnya 100% pasti berdasarkan state + aksi sekarang?", exA: "Catur — pasti", exB: "Mengemudi — ban bisa bocor tiba-tiba", why: "Stochastic → agen harus menangani probabilitas & ketidakpastian." },
    { prop: "Memory", a: "Episodic", b: "Sequential", ic: "🔗", col: t.rose, mean: "Apakah aksi sekarang mempengaruhi keputusan masa depan?", exA: "Deteksi spam — tiap email independen", exB: "Catur — setiap langkah mengubah posisi", why: "Sequential jauh lebih sulit karena setiap langkah berdampak jangka panjang." },
    { prop: "Timing", a: "Static", b: "Dynamic", ic: "⏱️", col: t.gold, mean: "Apakah lingkungan berubah SAAT agen berpikir?", exA: "Teka-teki silang — no time pressure", exB: "Mengemudi — mobil lain terus bergerak", why: "Semi-dynamic: lingkungan tidak berubah tapi skor berubah (catur + clock)." },
    { prop: "Values", a: "Discrete", b: "Continuous", ic: "📊", col: t.teal, mean: "Berapa banyak kemungkinan state/aksi/percept?", exA: "Catur — posisi terbatas", exB: "Self-driving — posisi tak terbatas", why: "Continuous → butuh teknik numerik/sampling, tidak bisa enumerate semua." },
    { prop: "Knowledge", a: "Known", b: "Unknown", ic: "❓", col: t.violet, mean: "Apakah agen tahu semua aturan/hukum lingkungan?", exA: "Catur — aturan lengkap", exB: "Video game baru — belum tahu efek tombol", why: "INI BUKAN sifat lingkungan, tapi sifat PENGETAHUAN agen. Known bisa partially observable (Solitaire). Unknown bisa fully observable (video game baru)." },
  ];

  return (
    <div>
      <STitle t={t} ic="🌍" title="7 Properti Lingkungan" sub="Sifat lingkungan menentukan seberapa sulit masalah & desain agen yang tepat" />
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {envs.map((e, i) => {
          const isO = open === i;
          return (
            <div key={i} style={{ marginBottom: 6, borderRadius: 14, overflow: "hidden", border: `1px solid ${isO ? e.col + "35" : t.border}`, background: isO ? e.col + "04" : t.card, transition: "all 0.3s", cursor: "pointer" }} onClick={() => setOpen(isO ? null : i)}>
              <div style={{ display: "flex", alignItems: "center", padding: "13px 18px", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{e.ic}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: t.text }}>{e.prop}</span>
                <Pill color={t.teal}>{e.a}</Pill>
                <span style={{ fontSize: 10, color: t.dim }}>vs</span>
                <Pill color={t.rose}>{e.b}</Pill>
                <span style={{ fontSize: 12, color: t.dim, transition: "transform 0.3s", transform: isO ? "rotate(180deg)" : "" }}>▾</span>
              </div>
              {isO && (
                <div style={{ padding: "0 18px 16px" }}>
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: t.surfaceAlt, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: e.col, letterSpacing: 1 }}>APA MAKSUDNYA?</div>
                    <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6, marginTop: 2 }}>{e.mean}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    <div style={{ padding: "10px 14px", borderRadius: 10, background: t.teal + "06", borderLeft: `3px solid ${t.teal}35` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: t.teal }}>{e.a}</div>
                      <div style={{ fontSize: 11.5, color: t.sub, marginTop: 3 }}>{e.exA}</div>
                    </div>
                    <div style={{ padding: "10px 14px", borderRadius: 10, background: t.rose + "06", borderLeft: `3px solid ${t.rose}35` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: t.rose }}>{e.b}</div>
                      <div style={{ fontSize: 11.5, color: t.sub, marginTop: 3 }}>{e.exB}</div>
                    </div>
                  </div>
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: t.gold + "06", borderLeft: `3px solid ${t.gold}35` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: t.gold, letterSpacing: 1 }}>💡 KENAPA PENTING?</div>
                    <div style={{ fontSize: 11.5, color: t.text, lineHeight: 1.6, marginTop: 2 }}>{e.why}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {/* Comparison table */}
        <div style={{ marginTop: 16, padding: "18px 20px", borderRadius: 14, background: t.card, border: `1px solid ${t.border}`, overflowX: "auto" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.gold, marginBottom: 12 }}>📊 Perbandingan (sering keluar UTS!)</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr>{["", "Catur + Clock", "Catur biasa", "Mengemudi"].map((h,i) => (<th key={i} style={{ padding: "8px 10px", textAlign: "left", borderBottom: `2px solid ${t.border}`, color: i===0?t.dim:t.gold, fontWeight: 700, fontSize: 10 }}>{h}</th>))}</tr></thead>
            <tbody>
              {[["Observable?","✅ Fully","✅ Fully","❌ Partial"],["Single agent?","❌ No","❌ No","❌ No"],["Deterministic?","✅ Yes","✅ Yes","❌ No"],["Episodic?","❌ Sequential","❌ Sequential","❌ Sequential"],["Static?","⚠️ Semi-dynamic","✅ Static","❌ Dynamic"],["Discrete?","✅ Yes","✅ Yes","❌ Continuous"]].map((row,i) => (
                <tr key={i} style={{ background: i%2===0 ? t.surfaceAlt : "transparent" }}>{row.map((c,j) => (<td key={j} style={{ padding: "7px 10px", color: j===0?t.sub:t.text, fontWeight: j===0?600:400 }}>{c}</td>))}</tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 8, fontSize: 10.5, color: t.dim }}>⚠️ Semi-dynamic = lingkungan tidak berubah, tapi skor (waktu) berubah saat agen berpikir.</div>
        </div>
        <div style={{ marginTop: 12, padding: "14px 18px", borderRadius: 12, background: t.rose + "06", border: `1px dashed ${t.rose}25`, textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.rose }}>🌏 Dunia Nyata </span>
          <span style={{ fontSize: 12, color: t.sub }}>= Partial, Multi, Stochastic, Sequential, Dynamic, Continuous, Unknown — </span>
          <strong style={{ color: t.text }}>paling kompleks!</strong>
        </div>
      </div>
    </div>
  );
}

// ═══════════ SECTION 4: AGENT TYPES ═══════════

function ATypeSection({ t }) {
  const [sel, setSel] = useState(null);
  const agents = [
    { name: "Simple Reflex", lv: 1, ic: "💡", col: t.teal, core: "Langsung respon percept sekarang — seperti refleks, tanpa ingatan", how: "IF kondisi THEN aksi. Tidak ada memori, tidak ada model.", ex: "Thermostat: IF suhu > 25°C THEN nyalakan AC", limit: "Hanya bekerja di fully observable. Tanpa memori → bisa infinite loop.", key: "Paling sederhana. Zero internal state." },
    { name: "Model-Based Reflex", lv: 2, ic: "🗺️", col: t.sky, core: "Punya internal state + model dunia untuk track keadaan yang tak terlihat", how: "2 model: (1) Model Transisi — efek aksi terhadap lingkungan, (2) Model Sensor — bagaimana keadaan tercermin di percept.", ex: "Mobil otonom yang tahu posisi mobil lain meskipun sesaat tak terlihat di kamera", limit: "Masih pakai condition-action rules, tidak bisa planning.", key: "Bisa handle partially observable dengan menyimpan state." },
    { name: "Goal-Based", lv: 3, ic: "🏁", col: t.violet, core: "Punya GOAL masa depan, bisa cari sekuens aksi menuju goal", how: "Model + Goal → Search/Planning → Sequence of actions.", ex: "GPS: goal = sampai Senayan. Cari rute, pertimbangkan macet.", limit: "Goal binary (tercapai/tidak). Jika banyak rute ke goal, tidak bisa pilih \"terbaik\".", key: "Beda utama: bisa melihat ke DEPAN dan PLANNING." },
    { name: "Utility-Based", lv: 4, ic: "⭐", col: t.gold, core: "Banyak cara menuju goal → pilih yang memaksimalkan expected utility", how: "Utility function = internalisasi performance measure. Pilih aksi yang maximize expected utility.", ex: "Taksi: rute A cepat tapi sempit, rute B lambat tapi aman → timbang tradeoff.", limit: "Utility function sulit ditentukan sempurna. Perfect rationality impossible.", key: "Paling canggih dalam pemilihan aksi. Handle partial + non-deterministic." },
    { name: "Learning Agent", lv: 5, ic: "📚", col: t.rose, core: "Bukan tipe aksi baru — ini tentang bagaimana agen BELAJAR & BERKEMBANG", how: "4 komponen: Performance element (pilih aksi), Critic (evaluasi), Learning element (perbaiki), Problem generator (eksplore hal baru).", ex: "AlphaGo: belajar dari jutaan game, critic bilang menang/kalah, update strategi.", limit: "Semua 4 tipe di atas bisa dijadikan learning agent.", key: "Bisa improve dari pengalaman. Problem generator penting agar tidak stuck." },
  ];

  return (
    <div>
      <STitle t={t} ic="🧬" title="5 Tipe Program Agen" sub="Dari sederhana ke canggih — setiap level tambahkan kemampuan baru" />
      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", left: 23, top: 12, bottom: 12, width: 2, background: `linear-gradient(to bottom, ${t.teal}30, ${t.gold}30, ${t.rose}30)` }}/>
        {agents.map((a, i) => {
          const isO = sel === i;
          return (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 8, position: "relative" }} onClick={() => setSel(isO ? null : i)}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, background: isO ? a.col+"18" : t.card, border: `2.5px solid ${isO ? a.col : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, zIndex: 1, transition: "all 0.3s", cursor: "pointer", boxShadow: isO ? `0 0 16px ${a.col}20` : "none" }}>{a.ic}</div>
              <div style={{ flex: 1, borderRadius: 14, padding: "14px 18px", cursor: "pointer", background: isO ? a.col+"06" : t.card, border: `1px solid ${isO ? a.col+"35" : t.border}`, transition: "all 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: a.col }}>{a.name}</span>
                  <span style={{ fontSize: 9, color: t.dim, background: t.surfaceAlt, padding: "2px 7px", borderRadius: 8, fontWeight: 600 }}>Level {a.lv}</span>
                </div>
                <div style={{ fontSize: 12, color: t.sub, lineHeight: 1.55 }}>{a.core}</div>
                {isO && (
                  <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                    <InfoBlock t={t} label="Cara Kerja" text={a.how} col={a.col} />
                    <InfoBlock t={t} label="Contoh" text={a.ex} col={t.teal} />
                    <InfoBlock t={t} label="Keterbatasan" text={a.limit} col={t.rose} />
                    <div style={{ padding: "8px 12px", borderRadius: 8, background: t.gold+"08", border: `1px solid ${t.gold}15` }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: t.gold }}>🔑 </span>
                      <span style={{ fontSize: 11.5, color: t.text }}>{a.key}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════ SECTION 5: TAXONOMY ═══════════

function TaxoSection({ t }) {
  return (
    <div>
      <STitle t={t} ic="🗂️" title="Taksonomi AI" sub="Peta besar AI — di mana kita sekarang?" />
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[{ title: "Narrow AI (Weak)", ic: "🎯", col: t.teal, status: "✅ SUDAH ADA", sCl: t.teal, desc: "Satu tugas spesifik saja. Tidak bisa generalisasi.", ex: "Chatbot reservasi, spam filter, face recognition", trait: "Repetitif, tanpa keputusan otonom" },
            { title: "General AI (Strong)", ic: "🧠", col: t.violet, status: "❌ MASIH RISET", sCl: t.rose, desc: "Semua tugas seperti manusia — berpikir, menalar, belajar.", ex: "??? (belum ada)", trait: "Pengambilan keputusan otonom" }].map((c,i) => (
            <div key={i} style={{ padding: "18px", borderRadius: 16, background: c.col+"06", border: `1px solid ${c.col}20` }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{c.ic}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.col, marginBottom: 4 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: t.sub, lineHeight: 1.6, marginBottom: 6 }}>{c.desc}</div>
              <div style={{ fontSize: 10.5, color: t.dim, marginBottom: 3 }}>Contoh: {c.ex}</div>
              <div style={{ fontSize: 10.5, color: t.dim, marginBottom: 8 }}>Sifat: {c.trait}</div>
              <Pill color={c.sCl}>{c.status}</Pill>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: 16, background: t.card, border: `1px solid ${t.border}`, marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>Hubungan AI, ML, DL, dan Data Science</div>
          <svg viewBox="0 0 480 280" style={{ width: "100%", maxWidth: 440, height: "auto" }}>
            <ellipse cx="160" cy="155" rx="125" ry="110" fill="none" stroke={t.teal+"20"} strokeWidth="1.5" strokeDasharray="5 3"/>
            <text x="70" y="250" fill={t.teal} fontSize="10" fontWeight="600">Data Science</text>
            <text x="80" y="264" fill={t.dim} fontSize="8">Big Data</text>
            <circle cx="290" cy="140" r="120" fill={t.gold+"06"} stroke={t.gold+"25"} strokeWidth="1.5"/>
            <text x="375" y="45" fill={t.gold} fontSize="12" fontWeight="700">AI</text>
            <circle cx="300" cy="148" r="80" fill={t.violet+"08"} stroke={t.violet+"25"} strokeWidth="1.5"/>
            <text x="345" y="100" fill={t.violet} fontSize="10" fontWeight="600">Machine</text>
            <text x="345" y="113" fill={t.violet} fontSize="10" fontWeight="600">Learning</text>
            <circle cx="305" cy="158" r="42" fill={t.rose+"10"} stroke={t.rose+"30"} strokeWidth="1.5"/>
            <text x="285" y="155" fill={t.rose} fontSize="9" fontWeight="600">Deep</text>
            <text x="282" y="167" fill={t.rose} fontSize="9" fontWeight="600">Learning</text>
          </svg>
          <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.6, maxWidth: 400, margin: "8px auto 0" }}>AI adalah payung besar. ML ⊂ AI belajar dari data. DL ⊂ ML pakai neural network berlapis. Data Science beririsan — tidak semua DS pakai ML.</div>
        </div>
        <div style={{ padding: "18px 20px", borderRadius: 14, background: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.gold, letterSpacing: 1, marginBottom: 12 }}>3 POKOK BAHASAN AI</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[{ ic: "🔍", n: "Search & Optimization", d: "BFS, DFS, UCS, A*, Gradient Descent", col: t.teal },
              { ic: "📐", n: "Logic & Knowledge", d: "Propositional Logic, FOL, Bayesian Net", col: t.violet },
              { ic: "⚡", n: "Learning Agents", d: "Decision Tree, KNN, Neural Network", col: t.gold, focus: true }].map((a,i) => (
              <div key={i} style={{ padding: "14px", borderRadius: 12, background: a.col+"06", border: `1px solid ${a.col}15`, textAlign: "center" }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{a.ic}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: a.col, marginBottom: 4 }}>{a.n}</div>
                <div style={{ fontSize: 10.5, color: t.sub, lineHeight: 1.5, marginBottom: 6 }}>{a.d}</div>
                {a.focus && <Pill color={t.gold}>Fokus Kuliah</Pill>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════ SECTION 6: HISTORY ═══════════

function HistSection({ t }) {
  const ev = [
    { yr: "1943", txt: "McCulloch & Pitts: model neuron buatan pertama — pondasi neural networks", col: t.teal, era: "Fondasi" },
    { yr: "1950", txt: "Turing menulis \"Computing Machinery & Intelligence\" → Turing Test", col: t.teal, era: "Fondasi" },
    { yr: "1956", txt: "Dartmouth Conference — istilah \"Artificial Intelligence\" resmi lahir", col: t.gold, era: "Fondasi" },
    { yr: "1957", txt: "Rosenblatt: Perceptron — neural network pertama yang bisa belajar", col: t.teal, era: "Fondasi" },
    { yr: "1965", txt: "ELIZA — program NLP pertama, simulasi percakapan", col: t.violet, era: "Awal" },
    { yr: "1974", txt: "AI Winter pertama — pendanaan turun, harapan vs realita", col: t.rose, era: "Winter" },
    { yr: "1980", txt: "Expert Systems populer — perusahaan mulai pakai AI", col: t.sky, era: "Revival" },
    { yr: "1986", txt: "Backpropagation (Hinton dkk.) — training deep neural networks jadi mungkin", col: t.violet, era: "Revival" },
    { yr: "1997", txt: "IBM Deep Blue kalahkan Kasparov — pertama kalinya komputer menang vs grandmaster", col: t.gold, era: "Revival" },
    { yr: "2012", txt: "Deep neural net kenali kucing di YouTube — awal era deep learning", col: t.teal, era: "Modern" },
    { yr: "2015", txt: "AlphaGo kalahkan Lee Sedol di Go — dianggap mustahil sebelumnya", col: t.gold, era: "Modern" },
    { yr: "2020", txt: "GPT-3: terobosan besar NLP, teks sangat meyakinkan", col: t.violet, era: "GenAI" },
    { yr: "2022", txt: "ChatGPT dirilis — AI jadi mainstream", col: t.rose, era: "GenAI" },
    { yr: "2025", txt: "DeepSeek R1: reasoning berkualitas tinggi, biaya training hanya $5.6M — guncang industri", col: t.gold, era: "GenAI" },
  ];
  return (
    <div>
      <STitle t={t} ic="📜" title="Sejarah Singkat AI" sub="1943–2025: drama, winter, kebangkitan, dan revolusi" />
      <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
        <div style={{ position: "absolute", left: 60, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, ${t.teal}30, ${t.gold}30, ${t.rose}30)` }}/>
        {ev.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 6, position: "relative" }}>
            <div style={{ width: 50, textAlign: "right", paddingTop: 10, flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: e.col, fontFamily: "monospace" }}>{e.yr}</div>
            </div>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: e.col+"30", border: `2.5px solid ${e.col}`, flexShrink: 0, marginTop: 10, zIndex: 1, boxShadow: `0 0 10px ${e.col}25` }}/>
            <div style={{ flex: 1, padding: "10px 14px", borderRadius: 12, background: t.card, border: `1px solid ${t.border}` }}>
              <Pill color={e.col}>{e.era}</Pill>
              <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6, marginTop: 4 }}>{e.txt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════ SECTION 7: ML BASICS ═══════════

function MLSection({ t }) {
  const [openML, setOpenML] = useState(null);
  const types = [
    { name: "Supervised Learning", ic: "🏷️", col: t.gold, idea: "Belajar dari data + label (jawaban benar)", input: "Data + Label", output: "Model prediktif",
      why: "Seperti belajar dari buku soal + kunci jawaban — lihat soal dan jawabannya, lalu bisa jawab soal baru.",
      kids: [{ name: "Classification", desc: "Prediksi kelas (diskret)", ex: "Spam/Not Spam, Approve/Reject", ic: "📦", col: t.gold }, { name: "Regression", desc: "Prediksi angka (kontinu)", ex: "Harga rumah, suhu besok", ic: "📈", col: t.teal }] },
    { name: "Unsupervised Learning", ic: "🔍", col: t.teal, idea: "Belajar pola dari data TANPA label", input: "Data saja", output: "Kelompok/pola",
      why: "Seperti anak kecil kelompokkan mainan berdasarkan bentuk/warna — tanpa diajari nama-namanya.",
      kids: [{ name: "Clustering", desc: "Kelompokkan data mirip", ex: "Segmentasi pelanggan mall", ic: "🫧", col: t.teal }, { name: "Dim. Reduction", desc: "Kurangi fitur, pertahankan info", ex: "PCA untuk visualisasi", ic: "🗜️", col: t.sky }] },
    { name: "Reinforcement Learning", ic: "🎮", col: t.violet, idea: "Belajar lewat trial & error + reward/punishment", input: "Env + Actions + Rewards", output: "Policy optimal",
      why: "Seperti latih anjing: treat kalau benar (reward), diabaikan kalau salah. Lama-lama agen tahu apa yang harus dilakukan.",
      kids: [{ name: "Game AI", desc: "Belajar strategi game", ex: "AlphaGo main Go", ic: "♟️", col: t.violet }, { name: "Robotics", desc: "Belajar navigasi/manipulasi", ex: "Robot belajar jalan", ic: "🤖", col: t.rose }] },
  ];

  return (
    <div>
      <STitle t={t} ic="⚡" title="Konsep Dasar Machine Learning" sub="Komputer belajar pola dari data, bukan diprogram manual" />
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Traditional vs ML */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          <div style={{ padding: "18px", borderRadius: 16, background: t.card, border: `1px solid ${t.border}`, textAlign: "center" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: t.dim, letterSpacing: 1.5, marginBottom: 14 }}>TRADITIONAL PROGRAMMING</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "6px 14px", borderRadius: 8, background: t.teal+"12", color: t.teal, fontSize: 12, fontWeight: 600 }}>Data</div>
                <div style={{ padding: "6px 14px", borderRadius: 8, background: t.violet+"12", color: t.violet, fontSize: 12, fontWeight: 600 }}>Program</div>
              </div>
              <span style={{ fontSize: 16, color: t.dim }}>→</span>
              <div style={{ padding: "12px 16px", borderRadius: 10, background: t.sky+"10", border: `1px solid ${t.sky}20` }}><div style={{ fontSize: 11, fontWeight: 700, color: t.sky }}>Computer</div></div>
              <span style={{ fontSize: 16, color: t.dim }}>→</span>
              <div style={{ padding: "6px 14px", borderRadius: 8, background: t.rose+"12", color: t.rose, fontSize: 12, fontWeight: 600 }}>Output</div>
            </div>
            <div style={{ fontSize: 10.5, color: t.dim, marginTop: 10 }}>Manusia tulis aturan → komputer jalankan</div>
          </div>
          <div style={{ padding: "18px", borderRadius: 16, background: t.gold+"04", border: `1px solid ${t.gold}20`, textAlign: "center" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: t.gold, letterSpacing: 1.5, marginBottom: 14 }}>MACHINE LEARNING</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ padding: "6px 14px", borderRadius: 8, background: t.teal+"12", color: t.teal, fontSize: 12, fontWeight: 600 }}>Data</div>
                <div style={{ padding: "6px 14px", borderRadius: 8, background: t.rose+"12", color: t.rose, fontSize: 12, fontWeight: 600 }}>Output</div>
              </div>
              <span style={{ fontSize: 16, color: t.dim }}>→</span>
              <div style={{ padding: "12px 16px", borderRadius: 10, background: t.gold+"10", border: `1px solid ${t.gold}20` }}><div style={{ fontSize: 11, fontWeight: 700, color: t.gold }}>Computer</div></div>
              <span style={{ fontSize: 16, color: t.dim }}>→</span>
              <div style={{ padding: "6px 14px", borderRadius: 8, background: t.violet+"12", color: t.violet, fontSize: 12, fontWeight: 600 }}>Program</div>
            </div>
            <div style={{ fontSize: 10.5, color: t.gold, marginTop: 10, fontWeight: 600 }}>Komputer temukan aturan sendiri dari data!</div>
          </div>
        </div>

        {types.map((ml, i) => {
          const isO = openML === i;
          return (
            <div key={i} onClick={() => setOpenML(isO ? null : i)} style={{ marginBottom: 8, borderRadius: 14, cursor: "pointer", background: isO ? ml.col+"06" : t.card, border: `1px solid ${isO ? ml.col+"30" : t.border}`, transition: "all 0.3s", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 26 }}>{ml.ic}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: ml.col }}>{ml.name}</div>
                  <div style={{ fontSize: 12, color: t.sub, marginTop: 2 }}>{ml.idea}</div>
                </div>
                <span style={{ fontSize: 14, color: t.dim, transform: isO ? "rotate(180deg)" : "", transition: "transform 0.3s" }}>▾</span>
              </div>
              {isO && (
                <div style={{ padding: "0 18px 16px" }}>
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: t.gold+"06", borderLeft: `3px solid ${t.gold}35`, marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: t.gold, letterSpacing: 1 }}>🎯 ANALOGINYA</div>
                    <div style={{ fontSize: 12, color: t.text, lineHeight: 1.6, marginTop: 2 }}>{ml.why}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                    <div style={{ padding: "10px", borderRadius: 8, background: t.surfaceAlt }}><div style={{ fontSize: 9, fontWeight: 700, color: t.teal, letterSpacing: 1 }}>INPUT</div><div style={{ fontSize: 11.5, color: t.text, marginTop: 2 }}>{ml.input}</div></div>
                    <div style={{ padding: "10px", borderRadius: 8, background: t.surfaceAlt }}><div style={{ fontSize: 9, fontWeight: 700, color: t.rose, letterSpacing: 1 }}>OUTPUT</div><div style={{ fontSize: 11.5, color: t.text, marginTop: 2 }}>{ml.output}</div></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {ml.kids.map((k,j) => (
                      <div key={j} style={{ padding: "12px", borderRadius: 10, background: k.col+"06", border: `1px solid ${k.col}12` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><span>{k.ic}</span><span style={{ fontSize: 12, fontWeight: 700, color: k.col }}>{k.name}</span></div>
                        <div style={{ fontSize: 11, color: t.sub, lineHeight: 1.5 }}>{k.desc}</div>
                        <div style={{ fontSize: 10, color: t.dim, marginTop: 4, fontStyle: "italic" }}>→ {k.ex}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* 3 Elements */}
        <div style={{ marginTop: 16, padding: "18px 20px", borderRadius: 14, background: t.card, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.gold, marginBottom: 12 }}>🔑 3 Elemen Kunci ML <span style={{ fontWeight: 400, color: t.dim }}>(Domingos 2012)</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
            {[{ n: "Representation", d: "Bentuk model?", ex: "Decision Tree, NN, KNN", ic: "🏗️", col: t.teal },
              { n: "Evaluation", d: "Ukur kualitas?", ex: "Accuracy, MSE, F1", ic: "📏", col: t.gold },
              { n: "Optimization", d: "Cari model terbaik?", ex: "Gradient Descent, Greedy", ic: "⚡", col: t.rose }].map((e,i) => (
              <div key={i} style={{ padding: "14px", borderRadius: 12, background: e.col+"06", border: `1px solid ${e.col}12`, textAlign: "center" }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{e.ic}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: e.col, marginBottom: 2 }}>{e.n}</div>
                <div style={{ fontSize: 11, color: t.text, marginBottom: 4 }}>{e.d}</div>
                <div style={{ fontSize: 10, color: t.dim }}>{e.ex}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 10, background: t.violet+"06", border: `1px solid ${t.violet}15` }}>
            <div style={{ fontSize: 11.5, color: t.text, lineHeight: 1.6 }}>
              <strong style={{ color: t.violet }}>Contoh:</strong> Klasifikasi "beli komputer?" pakai Multilayer Perceptron → Representation: <strong>Neural Network</strong>, Evaluation: <strong>Accuracy</strong>, Optimization: <strong>Gradient Descent</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════ MAIN ═══════════

export default function App() {
  const [dark, setDark] = useState(false);
  const [sec, setSec] = useState("def");
  const t = dark ? P.dark : P.light;
  const R = { def: DefSection, agent: AgentSection, env: EnvSection, atype: ATypeSection, taxo: TaxoSection, hist: HistSection, ml: MLSection };
  const Content = R[sec];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Segoe UI', -apple-system, sans-serif", transition: "background 0.35s, color 0.35s" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${t.faint};border-radius:4px}strong{color:${t.text};font-weight:700}`}</style>

      <div style={{ padding: "14px 20px 10px", borderBottom: `1px solid ${t.border}`, background: t.bg+"ee", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <Pill color={t.gold}>Materi 1</Pill>
            <span style={{ fontSize: 10, color: t.dim }}>KASDAD · Week 1</span>
          </div>
          <h1 style={{ fontSize: 19, fontWeight: 800, color: t.text, letterSpacing: -0.3 }}>Kecerdasan Artifisial</h1>
        </div>
        <button onClick={() => setDark(!dark)} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, width: 40, height: 40, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{dark ? "☀️" : "🌙"}</button>
      </div>

      <div style={{ padding: "8px 12px", overflowX: "auto", display: "flex", gap: 4, borderBottom: `1px solid ${t.border}`, background: t.bg+"ee", backdropFilter: "blur(12px)", position: "sticky", top: 68, zIndex: 99 }}>
        {SECTS.map(s => (
          <button key={s.id} onClick={() => setSec(s.id)} style={{ background: sec===s.id ? t.gold+"12" : "transparent", border: `1px solid ${sec===s.id ? t.gold+"30" : "transparent"}`, borderRadius: 10, padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", transition: "all 0.2s" }}>
            <span style={{ fontSize: 14 }}>{s.ic}</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: sec===s.id ? t.gold : t.sub }}>{s.label}</span>
          </button>
        ))}
      </div>

      <div key={sec} style={{ padding: "24px 16px 80px", maxWidth: 820, margin: "0 auto", animation: "fadeIn 0.3s ease-out" }}>
        <Content t={t} />
      </div>
    </div>
  );
}
