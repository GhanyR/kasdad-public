import { useState, useEffect, useRef } from "react";

const FONTS = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap";

const T = {
  dark: {
    bg:"#09090b",card:"#111113",card2:"#18181b",surf:"#1c1c20",
    tx:"#fafafa",tx2:"#a1a1aa",tx3:"#52525b",
    brd:"#27272a",brd2:"#3f3f46",
    g:"#34d399",b:"#60a5fa",y:"#fbbf24",r:"#fb7185",p:"#a78bfa",o:"#fb923c",
    sh:"0 2px 24px #0005",
  },
  light: {
    bg:"#fafaf9",card:"#ffffff",card2:"#f5f5f4",surf:"#e7e5e4",
    tx:"#0c0a09",tx2:"#57534e",tx3:"#a8a29e",
    brd:"#d6d3d1",brd2:"#a8a29e",
    g:"#059669",b:"#2563eb",y:"#d97706",r:"#e11d48",p:"#7c3aed",o:"#ea580c",
    sh:"0 2px 16px #0001",
  }
};

const NAV = [
  {id:"overview",lb:"Overview",ic:"🗺️"},
  {id:"collection",lb:"Data Collection",ic:"📥"},
  {id:"eda",lb:"EDA & Tipe Data",ic:"🔍"},
  {id:"stats",lb:"Statistik",ic:"📊"},
  {id:"viz",lb:"Visualisasi Data",ic:"🎨"},
  {id:"dirty",lb:"Dirty Data",ic:"🗑️"},
  {id:"cleaning",lb:"Data Cleaning",ic:"🧹"},
  {id:"integration",lb:"Integration",ic:"🔗"},
  {id:"transform",lb:"Transformasi",ic:"⚙️"},
  {id:"reduction",lb:"Reduksi & Balance",ic:"📦"},
];

const C=({children,t,...p})=><div style={{background:t.card,borderRadius:16,padding:24,border:`1px solid ${t.brd}`,boxShadow:t.sh,...(p.style||{})}}>{children}</div>;
const H2=({children,t,ic})=><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>{ic&&<span style={{fontSize:28}}>{ic}</span>}<h2 style={{fontFamily:"'Instrument Serif'",fontSize:32,color:t.tx,margin:0,lineHeight:1.2}}>{children}</h2></div>;
const H3=({children,t,c,ic})=><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>{ic&&<span style={{fontSize:20}}>{ic}</span>}<h3 style={{fontFamily:"'Instrument Serif'",fontSize:22,color:c||t.g,margin:0}}>{children}</h3></div>;
const P=({children,t})=><p style={{fontSize:14,color:t.tx2,lineHeight:1.85,margin:"0 0 14px",fontFamily:"'Geist'"}}>{children}</p>;
const B=({children,c})=><span style={{display:"inline-block",padding:"2px 9px",borderRadius:6,fontSize:10.5,fontWeight:600,fontFamily:"'Geist Mono'",background:`${c}18`,color:c,border:`1px solid ${c}30`}}>{children}</span>;
const Fm=({f,lb,t,desc})=><div style={{background:t.card2,borderRadius:12,padding:"14px 18px",border:`1px solid ${t.brd}`,marginBottom:10}}>{lb&&<div style={{fontSize:10,color:t.tx3,fontFamily:"'Geist Mono'",marginBottom:5,letterSpacing:1.5,textTransform:"uppercase"}}>{lb}</div>}<div style={{fontSize:17,fontFamily:"'Geist Mono'",color:t.g,fontWeight:500}}>{f}</div>{desc&&<div style={{fontSize:12,color:t.tx3,marginTop:6,lineHeight:1.6}}>{desc}</div>}</div>;
const Tip=({children,t,type="info"})=>{const c=type==="warn"?t.r:type==="why"?t.p:t.y;const ic=type==="warn"?"⚠️":type==="why"?"🤔":"💡";return<div style={{background:`${c}0a`,borderLeft:`3px solid ${c}`,padding:"11px 15px",borderRadius:"0 10px 10px 0",marginBottom:12,fontSize:13,color:t.tx2,lineHeight:1.7}}>{ic} {children}</div>};
const G=({cols=2,gap=12,children,style})=><div style={{display:"grid",gridTemplateColumns:`repeat(${cols}, 1fr)`,gap,...(style||{})}}>{children}</div>;
const Sp=({h=16})=><div style={{height:h}}/>;
const Tag=({children,c})=><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:8,background:`${c}12`,color:c,fontSize:11,fontWeight:600,fontFamily:"'Geist'"}}>{children}</span>;

function IQRDemo({t}){
  const [step,setStep]=useState(0);
  const raw=[5,7,4,4,6,2,8];
  const sorted=[2,4,4,5,6,7,8];
  const steps=[
    {title:"Data Mentah",data:raw,hl:[],note:"Kita punya 7 data point. Langkah pertama: urutkan!"},
    {title:"Step 1: Urutkan",data:sorted,hl:[],note:"Data diurutkan dari kecil ke besar."},
    {title:"Step 2: Cari Q2 (Median)",data:sorted,hl:[3],note:"n=7, posisi tengah = ke-4 → Q2 = 5. Median membagi data jadi 2 bagian."},
    {title:"Step 3: Cari Q1",data:sorted,hl:[1],note:"Q1 = median dari bagian BAWAH [2,4,4] → Q1 = 4"},
    {title:"Step 4: Cari Q3",data:sorted,hl:[5],note:"Q3 = median dari bagian ATAS [6,7,8] → Q3 = 7"},
    {title:"Hasil!",data:sorted,hl:[1,3,5],note:"IQR = Q3 − Q1 = 7 − 4 = 3  |  Range = 8 − 2 = 6"},
  ];
  const s=steps[step];
  return(
    <div style={{background:t.card2,borderRadius:14,padding:20,border:`1px solid ${t.brd}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:600,color:t.g,fontFamily:"'Geist'"}}>{s.title}</div>
        <div style={{display:"flex",gap:6}}>
          {steps.map((_,i)=><button key={i} onClick={()=>setStep(i)} style={{width:i===step?24:8,height:8,borderRadius:4,border:"none",background:i===step?t.g:`${t.tx3}40`,cursor:"pointer",transition:"all .2s"}}/>)}
        </div>
      </div>
      <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:14}}>
        {s.data.map((v,i)=>{
          const isHl=s.hl.includes(i);const isQ2=step>=2&&i===3;const isLower=step>=3&&i<3;const isUpper=step>=4&&i>3;
          let bg=`${t.tx3}15`,col=t.tx2,bdr=t.brd;
          if(isHl){bg=`${t.g}20`;col=t.g;bdr=t.g}
          if(isQ2&&step>=2){bg=`${t.y}20`;col=t.y;bdr=t.y}
          if(isLower&&step===3){bg=`${t.b}12`;bdr=`${t.b}40`}
          if(isUpper&&step===4){bg=`${t.p}12`;bdr=`${t.p}40`}
          return<div key={i} style={{width:44,height:44,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:600,fontFamily:"'Geist Mono'",background:bg,color:col,border:`2px solid ${bdr}`,transition:"all .3s"}}>{v}</div>
        })}
      </div>
      {step>=2&&<div style={{display:"flex",justifyContent:"center",gap:24,marginBottom:8}}>
        {step>=3&&<B c={t.b}>Q1 = 4</B>}{step>=2&&<B c={t.y}>Q2 = 5</B>}{step>=4&&<B c={t.p}>Q3 = 7</B>}
      </div>}
      <div style={{fontSize:13,color:t.tx2,textAlign:"center",lineHeight:1.6}}>{s.note}</div>
      <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:12}}>
        <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} style={{padding:"6px 16px",borderRadius:8,border:`1px solid ${t.brd}`,background:t.card,color:step===0?t.tx3:t.tx2,cursor:step===0?"default":"pointer",fontSize:12,fontFamily:"'Geist'"}}>← Prev</button>
        <button onClick={()=>setStep(Math.min(steps.length-1,step+1))} disabled={step===steps.length-1} style={{padding:"6px 16px",borderRadius:8,border:"none",background:step===steps.length-1?t.tx3:t.g,color:step===steps.length-1?"#fff9":"#000",cursor:step===steps.length-1?"default":"pointer",fontSize:12,fontWeight:600,fontFamily:"'Geist'"}}>Next →</button>
      </div>
    </div>
  );
}

function BoxPlotSVG({t}){
  const W=460,H=150,pad=50,y=60;
  const min=2.78,q1=4.045,med=6.595,q3=9.01,mx=17.11;
  const iqr=q3-q1;const rlb=q1-1.5*iqr;const rub=q3+1.5*iqr;
  const lo=Math.min(rlb,min)-1,hi=Math.max(rub,mx)+2;
  const sc=v=>pad+((v-lo)/(hi-lo))*(W-pad*2);
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%"}}>
      <line x1={sc(min)} y1={y} x2={sc(q1)} y2={y} stroke={t.g} strokeWidth={2}/>
      <line x1={sc(q3)} y1={y} x2={sc(rub)} y2={y} stroke={t.g} strokeWidth={2}/>
      <rect x={sc(q1)} y={y-22} width={sc(q3)-sc(q1)} height={44} fill={`${t.g}12`} stroke={t.g} strokeWidth={2} rx={6}/>
      <line x1={sc(med)} y1={y-22} x2={sc(med)} y2={y+22} stroke={t.y} strokeWidth={3}/>
      <line x1={sc(min)} y1={y-10} x2={sc(min)} y2={y+10} stroke={t.g} strokeWidth={2}/>
      <line x1={sc(rub)} y1={y-10} x2={sc(rub)} y2={y+10} stroke={t.o} strokeWidth={2}/>
      <circle cx={sc(mx)} cy={y} r={5} fill="none" stroke={t.r} strokeWidth={2}/>
      <text x={sc(mx)} y={y+24} textAnchor="middle" fill={t.r} fontSize={9} fontFamily="'Geist Mono'" fontWeight={600}>Outlier!</text>
      {[[min,"Min",t.b],[q1,"Q1",t.g],[med,"Median",t.y],[q3,"Q3",t.g],[rub,"RUB",t.o]].map(([v,l,c],i)=>(
        <g key={i}><text x={sc(v)} y={y+40} textAnchor="middle" fill={c} fontSize={9} fontFamily="'Geist'" fontWeight={600}>{l}</text><text x={sc(v)} y={y+52} textAnchor="middle" fill={t.tx3} fontSize={8} fontFamily="'Geist Mono'">{v.toFixed(2)}</text></g>
      ))}
      <line x1={sc(q1)} y1={y-32} x2={sc(q3)} y2={y-32} stroke={t.p} strokeWidth={1.5}/>
      <line x1={sc(q1)} y1={y-36} x2={sc(q1)} y2={y-28} stroke={t.p} strokeWidth={1.5}/>
      <line x1={sc(q3)} y1={y-36} x2={sc(q3)} y2={y-28} stroke={t.p} strokeWidth={1.5}/>
      <text x={sc((q1+q3)/2)} y={y-38} textAnchor="middle" fill={t.p} fontSize={10} fontFamily="'Geist Mono'" fontWeight={600}>IQR = {iqr.toFixed(2)}</text>
    </svg>
  );
}

function SkewSVG({t}){
  const draw=(skew,cx)=>{let pts=[];for(let x=-3.5;x<=3.5;x+=.08){const s=x-skew*.6;const y=Math.exp(-s*s/2)/2.507;pts.push(`${cx+x*28},${100-y*200}`);}return pts.join(" ");};
  return(
    <svg viewBox="0 0 480 140" style={{width:"100%"}}>
      {[{sk:-.9,cx:90,lb:"Left-Skewed",sub:"mean < median < mode",c:t.b},{sk:0,cx:240,lb:"Normal",sub:"mean ≈ median ≈ mode",c:t.g},{sk:.9,cx:390,lb:"Right-Skewed",sub:"mode < median < mean",c:t.r}].map((d,i)=>(
        <g key={i}>
          <line x1={d.cx-70} y1={100} x2={d.cx+70} y2={100} stroke={`${t.tx3}30`} strokeWidth={1}/>
          <polyline points={draw(d.sk,d.cx)} fill={`${d.c}10`} stroke={d.c} strokeWidth={2.5}/>
          <text x={d.cx} y={118} textAnchor="middle" fill={d.c} fontSize={11} fontFamily="'Geist'" fontWeight={600}>{d.lb}</text>
          <text x={d.cx} y={132} textAnchor="middle" fill={t.tx3} fontSize={8} fontFamily="'Geist Mono'">{d.sub}</text>
        </g>
      ))}
    </svg>
  );
}

function CorrSVG({t}){
  const gen=(r,seed)=>{const pts=[];for(let i=0;i<25;i++){const p1=Math.sin(seed*1000+i*137.508)*43758.5453%1;const p2=Math.sin(seed*2000+i*267.123)*23421.6312%1;const x=(p1-.5)*56;const noise=(p2-.5)*(1-Math.abs(r))*50;pts.push([x,-(r*x+noise)*.55]);}return pts;};
  return(
    <svg viewBox="0 0 520 130" style={{width:"100%"}}>
      {[{r:.95,lb:"r ≈ 1",desc:"Positif kuat",c:t.g,seed:1},{r:.4,lb:"r ≈ 0.4",desc:"Positif lemah",c:t.b,seed:2},{r:0,lb:"r ≈ 0",desc:"Tidak ada linear",c:t.y,seed:3},{r:-.85,lb:"r ≈ -1",desc:"Negatif kuat",c:t.r,seed:4}].map((d,i)=>{
        const cx=65+i*130;
        return(<g key={i}><rect x={cx-50} y={8} width={100} height={80} rx={8} fill={`${d.c}06`} stroke={`${d.c}20`} strokeWidth={1}/>{gen(d.r,d.seed).map((p,j)=><circle key={j} cx={cx+p[0]} cy={48+p[1]} r={3} fill={d.c} opacity={.65}/>)}<text x={cx} y={104} textAnchor="middle" fill={d.c} fontSize={11} fontFamily="'Geist Mono'" fontWeight={600}>{d.lb}</text><text x={cx} y={118} textAnchor="middle" fill={t.tx3} fontSize={8.5} fontFamily="'Geist'">{d.desc}</text></g>);
      })}
    </svg>
  );
}

function NormDemo({t}){
  const raw=[2,5,10,15,20];const mx=20,mn=2;
  const mean=raw.reduce((a,b)=>a+b)/raw.length;
  const std=Math.sqrt(raw.reduce((a,b)=>a+(b-mean)**2,0)/raw.length);
  const methods=[
    {name:"Original",vals:raw,formula:"—",c:t.tx2},
    {name:"Simple Scaling",vals:raw.map(v=>+(v/mx).toFixed(3)),formula:"x / x_max",c:t.g},
    {name:"Min-Max",vals:raw.map(v=>+((v-mn)/(mx-mn)).toFixed(3)),formula:"(x−min)/(max−min)",c:t.b},
    {name:"Z-Score",vals:raw.map(v=>+((v-mean)/std).toFixed(3)),formula:"(x−μ)/σ",c:t.p},
  ];
  return(
    <div style={{display:"grid",gap:8}}>
      {methods.map((m,mi)=>(
        <div key={mi} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:`${m.c}06`,border:`1px solid ${m.c}15`}}>
          <div style={{width:130,flexShrink:0}}>
            <div style={{fontSize:12,fontWeight:600,color:m.c,fontFamily:"'Geist'"}}>{m.name}</div>
            <div style={{fontSize:9,color:t.tx3,fontFamily:"'Geist Mono'",marginTop:2}}>{m.formula}</div>
          </div>
          <div style={{display:"flex",gap:6,flex:1}}>
            {m.vals.map((v,vi)=>{
              const maxAbs=Math.max(...m.vals.map(Math.abs));
              const w=maxAbs>0?(Math.abs(v)/maxAbs)*100:0;
              return(<div key={vi} style={{flex:1,textAlign:"center"}}>
                <div style={{height:28,borderRadius:4,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
                  <div style={{width:"100%",height:`${Math.max(w,5)}%`,borderRadius:4,background:`${m.c}35`,transition:"all .3s"}}/>
                </div>
                <div style={{fontSize:10,fontFamily:"'Geist Mono'",color:m.c,marginTop:3,fontWeight:500}}>{v}</div>
              </div>);
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function KurtSVG({t}){
  const draw=(k,cx)=>{let pts=[];const w=k==="l"?.6:k==="p"?1.3:1;const h=k==="l"?1.4:k==="p"?.65:1;for(let x=-3;x<=3;x+=.08){const y=h*Math.exp(-x*x/(2*w*w));pts.push(`${cx+x*24},${85-y*70}`);}return pts.join(" ");};
  return(
    <svg viewBox="0 0 420 115" style={{width:"100%"}}>
      {[{k:"p",cx:80,lb:"Platykurtic",sub:"K < 3 → datar",c:t.b},{k:"m",cx:210,lb:"Mesokurtic",sub:"K = 3 → normal",c:t.g},{k:"l",cx:340,lb:"Leptokurtic",sub:"K > 3 → lancip, banyak outlier!",c:t.r}].map((d,i)=>(
        <g key={i}><line x1={d.cx-55} y1={85} x2={d.cx+55} y2={85} stroke={`${t.tx3}25`} strokeWidth={1}/><polyline points={draw(d.k,d.cx)} fill={`${d.c}0c`} stroke={d.c} strokeWidth={2.5}/><text x={d.cx} y={100} textAnchor="middle" fill={d.c} fontSize={10} fontFamily="'Geist'" fontWeight={600}>{d.lb}</text><text x={d.cx} y={112} textAnchor="middle" fill={t.tx3} fontSize={7.5} fontFamily="'Geist Mono'">{d.sub}</text></g>
      ))}
    </svg>
  );
}

function CrispSVG({t}){
  const cx=180,cy=145,r=105;
  const phases=[{lb:"Business\nUnderstanding",a:-90,c:t.p},{lb:"Data\nUnderstanding",a:-30,c:t.b},{lb:"Data\nPreparation",a:30,c:t.g},{lb:"Modeling",a:90,c:t.y},{lb:"Evaluation",a:150,c:t.r},{lb:"Deployment",a:210,c:t.tx3}];
  return(
    <svg viewBox="0 0 360 290" style={{width:"100%",maxWidth:380}}>
      <circle cx={cx} cy={cy} r={r+18} fill="none" stroke={`${t.tx3}20`} strokeWidth={1.5} strokeDasharray="4 6"/>
      <circle cx={cx} cy={cy} r={28} fill={`${t.g}10`} stroke={`${t.g}40`} strokeWidth={1.5}/>
      <text x={cx} y={cy-3} textAnchor="middle" fill={t.g} fontSize={8} fontFamily="'Geist Mono'" fontWeight={600}>DATA</text>
      <text x={cx} y={cy+9} textAnchor="middle" fill={t.tx3} fontSize={7} fontFamily="'Geist Mono'">center</text>
      {phases.map((p,i)=>{const rad=p.a*Math.PI/180;const x=cx+r*Math.cos(rad);const y=cy+r*Math.sin(rad);const lines=p.lb.split("\n");const hl=i===1||i===2;
        return(<g key={i}><line x1={cx+32*Math.cos(rad)} y1={cy+32*Math.sin(rad)} x2={x-24*Math.cos(rad)} y2={y-24*Math.sin(rad)} stroke={`${p.c}35`} strokeWidth={1} strokeDasharray={hl?"":"3 3"}/><circle cx={x} cy={y} r={hl?24:20} fill={hl?`${p.c}18`:`${p.c}08`} stroke={p.c} strokeWidth={hl?2:1}/>{lines.map((l,li)=><text key={li} x={x} y={y+(li-(lines.length-1)/2)*11} textAnchor="middle" fill={p.c} fontSize={hl?8:7.5} fontFamily="'Geist'" fontWeight={hl?700:500} dominantBaseline="central">{l}</text>)}{hl&&<circle cx={x} cy={y} r={hl?24:20} fill="none" stroke={p.c} strokeWidth={1} opacity={.3}><animate attributeName="r" from={24} to={30} dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" from=".3" to="0" dur="2s" repeatCount="indefinite"/></circle>}</g>);
      })}
      <text x={cx} y={cy+r+45} textAnchor="middle" fill={t.tx3} fontSize={9} fontFamily="'Geist'">Materi 4 fokus pada fase yang berkedip</text>
    </svg>
  );
}

function SecOverview({t}){return(<><H2 t={t} ic="🗺️">Materi 4: From Raw Data to Ready Data</H2><P t={t}>Bayangkan mau masak <b style={{color:t.y}}>seblak</b>: (1) beli bahan <i>(collection)</i>, (2) cek bahan — ini kencur atau jahe? <i>(understanding)</i>, (3) cuci, potong, blender <i>(preparation)</i>. <b style={{color:t.g}}>Tanpa persiapan yang benar, masakannya gagal.</b></P><Sp/><C t={t}><H3 t={t} c={t.p} ic="🔄">CRISP-DM Framework</H3><P t={t}>Standar proses data science. Sifatnya <b style={{color:t.y}}>ITERATIF</b> — bisa bolak-balik ke fase sebelumnya.</P><div style={{display:"flex",justifyContent:"center"}}><CrispSVG t={t}/></div></C><Sp/><G cols={3} gap={10}>{[{ic:"📥",lb:"Data Collection",desc:"Kumpulkan bahan mentah dari berbagai sumber",c:t.b,ph:"Fase 1"},{ic:"🔍",lb:"Data Understanding",desc:"Pahami karakteristik: tipe, distribusi, kualitas",c:t.g,ph:"Fase 2"},{ic:"🔧",lb:"Data Preparation",desc:"Bersihkan & transformasi agar siap dimasak",c:t.y,ph:"Fase 3"}].map((d,i)=>(<div key={i} style={{padding:20,borderRadius:14,background:`${d.c}08`,border:`1px solid ${d.c}20`,textAlign:"center"}}><div style={{fontSize:32,marginBottom:6}}>{d.ic}</div><B c={d.c}>{d.ph}</B><div style={{fontSize:15,fontWeight:700,color:d.c,fontFamily:"'Instrument Serif'",margin:"8px 0 4px"}}>{d.lb}</div><div style={{fontSize:12,color:t.tx2}}>{d.desc}</div></div>))}</G><Sp/><Tip t={t} type="why"><b>Kenapa ini penting?</b> Data scientist menghabiskan <b style={{color:t.r}}>~80% waktu</b> untuk collecting + preparing data. Garbage In = Garbage Out!</Tip></>);}

function SecCollection({t}){return(<><H2 t={t} ic="📥">Data Collection</H2><P t={t}>Mengumpulkan data yang dibutuhkan untuk menjawab pertanyaan bisnis.</P><G cols={2} gap={12}><C t={t} style={{borderTop:`3px solid ${t.g}`}}><H3 t={t} c={t.g} ic="👤">Data Primer</H3><P t={t}><b style={{color:t.g}}>Kenapa?</b> Data spesifik belum ada → kumpulkan sendiri dari sumber asli.</P>{["Interview — tanya langsung","Observasi — amati perilaku","Survei/Kuesioner — pertanyaan terstruktur","Focus Group — diskusi kelompok","Oral Histories — rekam pengalaman"].map((s,i)=><div key={i} style={{padding:"5px 0",fontSize:13,color:t.tx2,borderBottom:`1px solid ${t.brd}`,display:"flex",gap:8}}><span style={{color:t.g}}>›</span>{s}</div>)}</C><C t={t} style={{borderTop:`3px solid ${t.b}`}}><H3 t={t} c={t.b} ic="🌐">Data Sekunder</H3><P t={t}><b style={{color:t.b}}>Kenapa?</b> Sudah dikumpulkan orang lain. Lebih cepat & murah.</P>{["Internet / Web / API","Arsip Organisasi","Perpustakaan & Jurnal","Database Publik","Open Data Portal"].map((s,i)=><div key={i} style={{padding:"5px 0",fontSize:13,color:t.tx2,borderBottom:`1px solid ${t.brd}`,display:"flex",gap:8}}><span style={{color:t.b}}>›</span>{s}</div>)}</C></G><Sp/><C t={t}><H3 t={t} c={t.y} ic="🔓">Open Data</H3><P t={t}>Data bebas untuk publik. Prinsip: <b style={{color:t.y}}>Public, Accessible, Reusable, Complete, Timely, Managed</b>.</P><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["Kaggle","UCI ML Repo","Data.gov","World Bank","Satudata Jakarta","Google Dataset Search","OpenML","Nasdaq"].map((s,i)=><B key={i} c={t.y}>{s}</B>)}</div></C><Sp/><C t={t}><H3 t={t} c={t.p} ic="📡">Sumber Modern</H3><G cols={3} gap={10}>{[{ic:"💬",nm:"Social Media",desc:"500M+ tweets/hari, via API, unstructured. Punya terms!",c:t.b},{ic:"🕷️",nm:"Web Scraping",desc:"Otomatis ekstrak dari web. Tools: BeautifulSoup, Scrapy.",c:t.g},{ic:"📱",nm:"IoT",desc:"Sensor: camera→video, lock→sidik jari. Data multimodal.",c:t.p}].map((s,i)=><div key={i} style={{padding:14,borderRadius:12,background:`${s.c}06`,border:`1px solid ${s.c}18`}}><span style={{fontSize:22}}>{s.ic}</span><div style={{fontSize:13,fontWeight:700,color:s.c,marginTop:6}}>{s.nm}</div><div style={{fontSize:11.5,color:t.tx2,marginTop:4,lineHeight:1.5}}>{s.desc}</div></div>)}</G></C><Sp/><C t={t}><H3 t={t} c={t.g} ic="📄">Format Data</H3><G cols={2} gap={10}>{[{nm:"CSV",full:"Comma-Separated Values",ex:"name,age\nAli,20",why:"Paling umum, ringan, semua tools support."},{nm:"TSV",full:"Tab-Separated Values",ex:"name→age→city",why:"Seperti CSV tapi TAB. Berguna kalau data ada koma."},{nm:"JSON",full:"JavaScript Object Notation",ex:'{"name":"Ali"}',why:"Cocok data nested. Standar API web."},{nm:"XML",full:"eXtensible Markup Language",ex:"<n>Ali</n>",why:"Verbose tapi masih di enterprise."}].map((f,i)=><div key={i} style={{padding:12,borderRadius:10,background:t.card2,border:`1px solid ${t.brd}`}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><B c={t.g}>{f.nm}</B><span style={{fontSize:10,color:t.tx3}}>{f.full}</span></div><div style={{fontFamily:"'Geist Mono'",fontSize:10,color:t.tx3,background:`${t.g}08`,padding:"4px 8px",borderRadius:6,marginBottom:4}}>{f.ex}</div><div style={{fontSize:11,color:t.tx2}}>{f.why}</div></div>)}</G></C><Sp/><Tip t={t} type="warn"><b>Tantangan:</b> Ketersediaan kurang, kualitas buruk (NA, outlier), semantik tidak jelas, bias sampling, privasi & etika.</Tip></>);}

function SecEDA({t}){return(<><H2 t={t} ic="🔍">EDA & Tipe Data</H2><P t={t}>EDA = analisis awal untuk memahami data sebelum modeling. Diciptakan John W. Tukey (1977).</P><C t={t}><H3 t={t} c={t.y} ic="🤔">Kenapa EDA?</H3><Tip t={t} type="why"><b>Tanpa EDA = coding buta.</b> Kamu tidak tahu data bersih atau tidak, ada pola tersembunyi atau tidak. EDA = buka mata sebelum melangkah.</Tip><G cols={2} gap={10}><div style={{padding:14,borderRadius:12,background:`${t.b}08`,border:`1px solid ${t.b}18`}}><div style={{fontSize:13,fontWeight:700,color:t.b,marginBottom:6}}>🔎 Familiarisasi</div>{["Berapa atribut? Tipe apa?","Ada missing values?","Distribusi tiap variabel?","Dataset imbalanced?"].map((s,i)=><div key={i} style={{fontSize:12,color:t.tx2,padding:"3px 0"}}>• {s}</div>)}</div><div style={{padding:14,borderRadius:12,background:`${t.y}08`,border:`1px solid ${t.y}18`}}><div style={{fontSize:13,fontWeight:700,color:t.y,marginBottom:6}}>🎯 Hunting Insight</div>{["Ada outlier?","Korelasi antar atribut?","Pola dalam distribusi?","Perbandingan antar grup?"].map((s,i)=><div key={i} style={{fontSize:12,color:t.tx2,padding:"3px 0"}}>• {s}</div>)}</div></G></C><Sp/><C t={t}><H3 t={t} c={t.p} ic="📋">Tipe Data: NOIR</H3><P t={t}>Sebelum analisis, HARUS tahu tipe datamu. Akronim <b style={{color:t.p}}>NOIR</b>: semakin kanan → semakin banyak operasi valid.</P><G cols={4} gap={8}>{[{nm:"Nominal",type:"Kategorikal",ex:"Warna mata, Gender",what:"Label saja",ops:"= ≠",why:"Tidak ada urutan. 'Merah' ≠ lebih besar dari 'Biru'.",c:t.r},{nm:"Ordinal",type:"Kategorikal",ex:"Sangat Puas > Puas",what:"Label + urutan",ops:"= ≠ < >",why:"Ada ranking, tapi jarak antar level TIDAK pasti sama.",c:t.o},{nm:"Interval",type:"Numerik",ex:"Suhu °C, Tahun",what:"Urutan + jarak sama",ops:"= ≠ < > + −",why:"20°→30° = 30°→40°. Tapi 0°C ≠ 'tidak ada suhu'.",c:t.b},{nm:"Rasio",type:"Numerik",ex:"Tinggi, Berat, Harga",what:"Interval + true zero",ops:"= ≠ < > + − × ÷",why:"0 kg = tidak ada berat. 10 kg = 2× dari 5 kg.",c:t.g}].map((d,i)=><div key={i} style={{padding:14,borderRadius:14,background:`${d.c}06`,border:`1px solid ${d.c}18`}}><B c={d.c}>{d.type}</B><div style={{fontSize:18,fontWeight:700,color:d.c,fontFamily:"'Instrument Serif'",margin:"6px 0 3px"}}>{d.nm}</div><div style={{fontSize:11,color:t.tx2,marginBottom:4}}>{d.what}</div><div style={{fontFamily:"'Geist Mono'",fontSize:10,color:d.c,background:`${d.c}10`,padding:"2px 8px",borderRadius:4,display:"inline-block",marginBottom:4}}>{d.ops}</div><div style={{fontSize:10,color:t.tx3,fontStyle:"italic"}}>Ex: {d.ex}</div><Sp h={4}/><div style={{fontSize:10.5,color:t.tx2,lineHeight:1.4}}>{d.why}</div></div>)}</G><Sp h={8}/><Tip t={t}>Urutan NOIR: <b>N</b>ominal → <b>O</b>rdinal → <b>I</b>nterval → <b>R</b>asio. Kiri paling terbatas, kanan paling fleksibel.</Tip></C></>);}

function SecStats({t}){return(<><H2 t={t} ic="📊">Statistik Deskriptif</H2><C t={t}><H3 t={t} c={t.g} ic="🎯">Central Tendency — "Di Mana Pusat Data?"</H3><G cols={3} gap={10}>{[{nm:"Mean",formula:"Σxᵢ / n",desc:"Rata-rata semua",pros:"Pakai semua data",cons:"Sensitif outlier!",ex:"1,2,3,4,100 → mean=22",c:t.g},{nm:"Median",formula:"Nilai ke-(n+1)/2",desc:"Nilai tengah",pros:"Robust outlier",cons:"Abaikan data lain",ex:"1,2,3,4,100 → med=3",c:t.b},{nm:"Mode",formula:"argmax(freq)",desc:"Paling sering",pros:"Bisa untuk kategorikal",cons:"Bisa >1 (bimodal)",ex:"1,2,2,3 → mode=2",c:t.y}].map((m,i)=><div key={i} style={{padding:16,borderRadius:14,background:`${m.c}06`,border:`1px solid ${m.c}18`}}><div style={{fontSize:18,fontWeight:700,color:m.c,fontFamily:"'Instrument Serif'"}}>{m.nm}</div><div style={{fontFamily:"'Geist Mono'",fontSize:13,color:m.c,background:`${m.c}10`,padding:"3px 10px",borderRadius:6,display:"inline-block",margin:"6px 0"}}>{m.formula}</div><div style={{fontSize:12,color:t.tx2,marginBottom:4}}>{m.desc}</div><div style={{fontSize:11,color:t.g}}>✓ {m.pros}</div><div style={{fontSize:11,color:t.r}}>✗ {m.cons}</div><div style={{fontSize:10,color:t.tx3,fontStyle:"italic",background:`${t.tx3}08`,padding:"4px 8px",borderRadius:6,marginTop:6}}>{m.ex}</div></div>)}</G></C><Sp/><C t={t}><H3 t={t} c={t.b} ic="↔️">Variation — "Seberapa Menyebar?"</H3><Fm lb="Range" f="Range = Max − Min" t={t} desc="Simpel tapi sangat sensitif outlier."/><Fm lb="IQR" f="IQR = Q3 − Q1" t={t} desc="Sebaran 50% data tengah. Robust karena abaikan 25% atas & bawah."/><Fm lb="Variance (Sample)" f="s² = Σ(xᵢ − x̄)² / (n − 1)" t={t} desc="Rata-rata kuadrat deviasi. Dibagi (n-1) = Bessel's correction untuk sample."/><Fm lb="Standard Deviation" f="s = √(variance)" t={t} desc="Akar variance. Satuan sama dengan data asli → lebih mudah diinterpretasi."/><Tip t={t} type="why"><b>Kenapa variance DAN std dev?</b> Variance menghilangkan tanda negatif (kuadrat), tapi satuan jadi 'kuadrat'. Std dev mengembalikan ke satuan asli via akar kuadrat.</Tip></C><Sp/><C t={t}><H3 t={t} c={t.y} ic="🧮">Interaktif: Hitung IQR Step-by-Step</H3><IQRDemo t={t}/></C><Sp/><C t={t}><H3 t={t} c={t.p} ic="📦">Box Plot & Outlier Detection</H3><P t={t}>Box plot = 5 dimensi distribusi sekaligus. Outlier via IQR:</P><Fm lb="Batas Bawah" f="RLB = Q1 − 1.5 × IQR" t={t}/><Fm lb="Batas Atas" f="RUB = Q3 + 1.5 × IQR" t={t}/><BoxPlotSVG t={t}/><Tip t={t} type="why"><b>Kenapa 1.5×IQR?</b> Pada distribusi normal, ~99.3% data ada dalam range ini. Yang di luar = sangat langka → outlier.</Tip></C><Sp/><C t={t}><H3 t={t} c={t.r} ic="📐">Skewness — "Ke Mana Data Miring?"</H3><P t={t}>Mengukur <b style={{color:t.r}}>asimetri</b>. Saat miring, mean "ditarik" ke arah ekor panjang.</P><SkewSVG t={t}/><Tip t={t}>Contoh right-skew: gaji karyawan (banyak rendah, sedikit sangat tinggi → mean ditarik ke kanan).</Tip></C><Sp/><C t={t}><H3 t={t} c={t.o} ic="⛰️">Kurtosis — "Seberapa Lancip?"</H3><P t={t}>Kurtosis tinggi = <b style={{color:t.r}}>banyak outlier</b>!</P><KurtSVG t={t}/></C><Sp/><C t={t}><H3 t={t} c={t.g} ic="🔗">Pearson Correlation</H3><P t={t}>Mengukur hubungan <b style={{color:t.g}}>LINEAR</b> dua variabel. Range: -1 sampai +1.</P><Fm lb="Pearson r" f="r = Σ(xᵢ−x̄)(yᵢ−ȳ) / √[Σ(xᵢ−x̄)² · Σ(yᵢ−ȳ)²]" t={t}/><Sp h={8}/><CorrSVG t={t}/><Sp h={8}/><Tip t={t} type="warn"><b>JEBAKAN!</b> r=0 BUKAN berarti tidak ada hubungan! Bisa non-linear (parabola, sinusoidal). Pearson HANYA deteksi linear.</Tip><Tip t={t} type="why"><b>Kapan pakai apa?</b> Pearson → interval/rasio. Spearman ρ → ordinal/monotonic. Chi-Square χ² → kategorikal.</Tip></C></>);}

function SecViz({t}){return(<><H2 t={t} ic="🎨">Data Visualization</H2><P t={t}>Tujuan: (1) eksplorasi, (2) komunikasi jelas, (3) representasi tidak bias, (4) support keputusan.</P><C t={t}><H3 t={t} c={t.y} ic="✨">LESS IS MORE</H3><P t={t}>Setiap elemen visual harus <b style={{color:t.y}}>mendukung pesan utama</b>. Yang tidak perlu → hapus.</P><Tip t={t} type="warn">Hindari: 3D tanpa alasan, background berlebihan, warna terlalu banyak, proporsi salah, y-axis tidak dari 0.</Tip></C><Sp/><C t={t}><H3 t={t} c={t.g} ic="📊">Kapan Pakai Chart Apa?</H3><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))",gap:8}}>{[{nm:"Line Plot",use:"Tren waktu",when:"Time-series",ic:"📈",c:t.g,dt:"Kontinu"},{nm:"Bar Chart",use:"Bandingkan kategori",when:"Perbandingan",ic:"📊",c:t.b,dt:"Kategorikal"},{nm:"Histogram",use:"Distribusi frekuensi",when:"1 var numerik",ic:"📉",c:t.p,dt:"Numerik"},{nm:"Scatter Plot",use:"Korelasi 2 var",when:"Cari hubungan",ic:"⚬",c:t.g,dt:"2 Numerik"},{nm:"Box Plot",use:"Distribusi + outlier",when:"Bandingkan grup",ic:"📦",c:t.y,dt:"Numerik"},{nm:"Pie Chart",use:"Proporsi (hati²!)",when:"Max 5 kategori",ic:"🥧",c:t.r,dt:"Kategorikal"},{nm:"Heat Map",use:"Variasi multi-var",when:"Matriks korelasi",ic:"🟧",c:t.o,dt:"Matrix"},{nm:"Bubble Plot",use:"3 variabel",when:"X, Y, + size",ic:"🫧",c:t.b,dt:"3 Numerik"},{nm:"Area Plot",use:"Tren kumulatif",when:"Total beberapa grup",ic:"🏔️",c:t.g,dt:"Kontinu"},{nm:"Tree Map",use:"Hierarki",when:"Data bertingkat",ic:"🌳",c:t.p,dt:"Hierarki"},{nm:"Word Cloud",use:"Frekuensi kata",when:"Analisis teks",ic:"☁️",c:t.y,dt:"Teks"},{nm:"Waffle Chart",use:"Progress",when:"Alternatif pie",ic:"🧇",c:t.o,dt:"Kategorikal"},{nm:"Density Plot",use:"Distribusi smooth",when:"KDE, bandingkan",ic:"〰️",c:t.r,dt:"Numerik"}].map((c,i)=><div key={i} style={{padding:"10px 12px",borderRadius:12,background:`${c.c}05`,border:`1px solid ${c.c}15`}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:16}}>{c.ic}</span><B c={c.c}>{c.dt}</B></div><div style={{fontSize:12,fontWeight:600,color:c.c,margin:"4px 0 2px"}}>{c.nm}</div><div style={{fontSize:11,color:t.tx2}}>{c.use}</div><div style={{fontSize:9.5,color:t.tx3,fontStyle:"italic"}}>{c.when}</div></div>)}</div></C><Sp/><C t={t}><H3 t={t} c={t.p} ic="⚖️">Histogram vs Bar Chart</H3><G cols={2} gap={12}><div style={{padding:14,borderRadius:12,background:`${t.b}08`,border:`1px solid ${t.b}18`}}><div style={{fontSize:15,fontWeight:700,color:t.b,fontFamily:"'Instrument Serif'",marginBottom:8}}>Histogram</div>{["Data NUMERIK kontinu","Bar MENEMPEL (no gap)","X = range/bin","Distribusi FREKUENSI","Bin size penting! Kecil→noisy, besar→hilang detail","Y-axis HARUS dari 0"].map((s,i)=><div key={i} style={{fontSize:12,color:t.tx2,padding:"3px 0"}}>• {s}</div>)}</div><div style={{padding:14,borderRadius:12,background:`${t.y}08`,border:`1px solid ${t.y}18`}}><div style={{fontSize:15,fontWeight:700,color:t.y,fontFamily:"'Instrument Serif'",marginBottom:8}}>Bar Chart</div>{["Data KATEGORIKAL","Ada GAP antar bar","X = kategori (label)","PERBANDINGAN nilai","Variasi: single, dual, stacked, horizontal","Horizontal → mudah baca label panjang"].map((s,i)=><div key={i} style={{fontSize:12,color:t.tx2,padding:"3px 0"}}>• {s}</div>)}</div></G></C><Sp/><Tip t={t} type="warn"><b>Masalah Pie Chart:</b> Manusia buruk bandingkan sudut. Label susah cocokkan. % kecil hilang. Warna habis. Solusi: horizontal bar chart!</Tip></>);}

function SecDirty({t}){return(<><H2 t={t} ic="🗑️">Dirty Data & GIGO</H2><P t={t}>Data dunia nyata <b style={{color:t.r}}>hampir selalu kotor</b>. Prinsip GIGO: bad data in → bad results out.</P><C t={t} style={{textAlign:"center",padding:28}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,flexWrap:"wrap"}}>{[{lb:"🗑️ Data Kotor",c:t.r},{lb:"→",c:t.tx3},{lb:"⚙️ Analisis",c:t.tx2},{lb:"→",c:t.tx3},{lb:"💩 Hasil Sampah",c:t.r}].map((s,i)=><div key={i} style={s.lb==="→"?{fontSize:24,color:s.c}:{padding:"14px 20px",borderRadius:12,background:`${s.c}08`,border:`1px solid ${s.c}20`,fontSize:15,fontWeight:700,color:s.c}}>{s.lb}</div>)}</div><div style={{marginTop:10,fontSize:13,color:t.tx3}}>vs</div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:10,flexWrap:"wrap"}}>{[{lb:"✨ Data Bersih",c:t.g},{lb:"→",c:t.tx3},{lb:"⚙️ Analisis",c:t.tx2},{lb:"→",c:t.tx3},{lb:"🎯 Insight Akurat",c:t.g}].map((s,i)=><div key={i} style={s.lb==="→"?{fontSize:24,color:s.c}:{padding:"14px 20px",borderRadius:12,background:`${s.c}08`,border:`1px solid ${s.c}20`,fontSize:15,fontWeight:700,color:s.c}}>{s.lb}</div>)}</div></C><Sp/><C t={t}><H3 t={t} c={t.y} ic="📋">Masalah Survey</H3><G cols={2} gap={8}>{["Responden hanya jawab sebagian","Bukan target yang diinginkan","Terlalu cepat (asal klik)","Straight-line (semua sama)","Jawaban tidak realistis (umur 999)","Jawaban kontradiktif"].map((s,i)=><div key={i} style={{padding:"8px 12px",borderRadius:10,background:`${t.y}06`,border:`1px solid ${t.y}15`,fontSize:12,color:t.tx2,display:"flex",gap:8}}><span style={{color:t.y}}>⚡</span>{s}</div>)}</G></C><Sp/><Tip t={t} type="why">57% data scientist bilang cleaning = bagian <b style={{color:t.r}}>PALING TIDAK MENYENANGKAN</b>. Tapi ini ~80% waktu!</Tip><C t={t}><H3 t={t} c={t.g} ic="🔧">Data Preparation = Solusi</H3><div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>{[{s:"Cleaning",c:t.g},{s:"Integration",c:t.b},{s:"Transformation",c:t.y},{s:"Selection",c:t.p},{s:"Reduction",c:t.o},{s:"Discretization",c:t.r},{s:"Balancing",c:t.b}].map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6}}><Tag c={d.c}>{d.s}</Tag>{i<6&&<span style={{color:t.tx3}}>→</span>}</div>)}</div></C></>);}

function SecCleaning({t}){return(<><H2 t={t} ic="🧹">Data Cleaning</H2><P t={t}>Tiga masalah utama:</P><G cols={3} gap={10}>{[{nm:"Missing",ic:"❓",c:t.y,desc:"Data kosong/NA/blank",why:"Responden skip, sensor error, data unavailable.",sols:["Cek sumber (selalu coba dulu!)","Replace mean (numerik normal)","Replace modus (kategorikal)","Replace 0/konstan (domain logic)","Nearest neighbor (time-series)","Domain knowledge (expert)","Drop (NA terlalu banyak)"]},{nm:"Noisy",ic:"📡",c:t.r,desc:"Error, outlier, berantakan",why:"Human error, sensor rusak, bug kode, lingkungan.",sols:["Regression smoothing","Clustering (deteksi outlier)","Manual inspection","Binning"]},{nm:"Inconsistent",ic:"🔀",c:t.p,desc:"Format beda untuk hal sama",why:"Beda sumber, beda entry, data outdated.",sols:["Formatting (NY → New York)","Standarisasi (metric ↔ imperial)","Validasi tipe (age: 'twenty'→20)"]}].map((d,i)=><div key={i} style={{padding:16,borderRadius:14,background:`${d.c}06`,border:`1px solid ${d.c}18`}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:20}}>{d.ic}</span><div style={{fontSize:16,fontWeight:700,color:d.c,fontFamily:"'Instrument Serif'"}}>{d.nm}</div></div><div style={{fontSize:12,color:t.tx2,marginBottom:4}}>{d.desc}</div><div style={{fontSize:10.5,color:t.tx3,fontStyle:"italic",marginBottom:8}}>{d.why}</div><div style={{fontSize:10.5,fontWeight:600,color:d.c,marginBottom:4}}>Solusi:</div>{d.sols.map((s,j)=><div key={j} style={{fontSize:11.5,color:t.tx2,padding:"3px 0",borderBottom:`1px solid ${t.brd}`,display:"flex",gap:6}}><span style={{color:d.c,fontSize:8,marginTop:4}}>●</span>{s}</div>)}</div>)}</G><Sp/><Tip t={t}><b>Data Munging/Wrangling</b> = konversi format sulit → mudah. Ex: teks resep → data terstruktur.</Tip></>);}

function SecIntegration({t}){return(<><H2 t={t} ic="🔗">Data Integration</H2><P t={t}>Gabungkan data dari berbagai sumber menjadi satu kesatuan koheren.</P><div style={{display:"grid",gap:12}}>{[{step:"1. Schema Integration",ic:"🏗️",c:t.b,desc:"Gabungkan metadata. Nama beda tapi artinya sama.",ex:"A.cust_id ≡ B.cust_# → sama!"},{step:"2. Resolve Conflicts",ic:"⚔️",c:t.y,desc:"Atasi perbedaan nilai untuk entitas sama.",ex:"Bill Clinton = William Clinton. Metric vs imperial."},{step:"3. Handle Redundancy",ic:"♻️",c:t.r,desc:"Hapus atribut redundan (deteksi via korelasi).",ex:"is_male & is_female → r=-1 → hapus satu. annual_revenue = monthly×12."}].map((s,i)=><C key={i} t={t} style={{borderLeft:`4px solid ${s.c}`}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:20}}>{s.ic}</span><div style={{fontSize:15,fontWeight:700,color:s.c,fontFamily:"'Instrument Serif'"}}>{s.step}</div></div><div style={{fontSize:13,color:t.tx2,marginBottom:6}}>{s.desc}</div><div style={{fontSize:12,color:t.tx3,fontStyle:"italic",background:`${s.c}06`,padding:"6px 10px",borderRadius:8}}>💡 {s.ex}</div></C>)}</div><Sp/><C t={t}><H3 t={t} c={t.p} ic="🔍">Deteksi Redundansi</H3><G cols={2} gap={10}><div style={{padding:12,borderRadius:12,background:`${t.g}06`,border:`1px solid ${t.g}18`}}><B c={t.g}>Pearson r</B><div style={{fontSize:12,color:t.tx2,marginTop:6}}>Variabel <b>numerik</b>. |r|≈1 → redundan.</div></div><div style={{padding:12,borderRadius:12,background:`${t.p}06`,border:`1px solid ${t.p}18`}}><B c={t.p}>Chi-Square χ²</B><div style={{fontSize:12,color:t.tx2,marginTop:6}}>Variabel <b>kategorikal</b>. Uji independensi.</div></div></G><Fm lb="Chi-Square" f="χ² = Σ (Observed − Expected)² / Expected" t={t} desc="χ² besar → variabel TIDAK independen (ada hubungan)."/></C></>);}

function SecTransform({t}){return(<><H2 t={t} ic="⚙️">Transformasi, Selection & Discretization</H2><C t={t}><H3 t={t} c={t.g} ic="🔄">Jenis Transformasi</H3><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{[{nm:"Smoothing: hilangkan noise",c:t.g},{nm:"Aggregation: rangkum data",c:t.b},{nm:"Generalization: naik level abstraksi",c:t.y},{nm:"Normalization: skalakan range",c:t.p},{nm:"Feature Construction: buat fitur baru",c:t.o}].map((d,i)=><Tag key={i} c={d.c}>{d.nm}</Tag>)}</div></C><Sp/><C t={t}><H3 t={t} c={t.p} ic="📏">Normalization — 3 Metode</H3><Tip t={t} type="why"><b>Kenapa?</b> "age" (0-100) vs "income" (0-20jt). Tanpa normalisasi, income mendominasi model karena nilainya besar — padahal belum tentu lebih penting!</Tip><Fm lb="① Simple Feature Scaling" f="x_new = x_old / x_max" t={t} desc="Range: 0..1. Simpel tapi sensitif outlier di max."/><Fm lb="② Min-Max" f="x_new = (x_old − x_min) / (x_max − x_min)" t={t} desc="Range: pasti 0..1. Paling umum. Sensitif outlier."/><Fm lb="③ Z-Score" f="x_new = (x_old − μ) / σ" t={t} desc="Mean=0, std=1. BISA negatif. Lebih robust. μ=mean, σ=std dev."/><Sp h={8}/><div style={{fontSize:13,fontWeight:600,color:t.tx,marginBottom:8}}>Perbandingan (data: 2, 5, 10, 15, 20):</div><NormDemo t={t}/></C><Sp/><C t={t}><H3 t={t} c={t.y} ic="✂️">Data Selection</H3><G cols={2} gap={10}><div style={{padding:14,borderRadius:12,background:`${t.b}06`,border:`1px solid ${t.b}18`}}><div style={{fontSize:13,fontWeight:700,color:t.b}}>Column Selection</div><div style={{fontSize:12,color:t.tx2,marginTop:4}}>Pilih kolom tertentu. Ex: dari 10 kolom → ambil "Position" & "Salary" saja.</div><div style={{fontSize:10.5,color:t.tx3,marginTop:4,fontStyle:"italic"}}>Why? Kurangi dimensi, fokus fitur relevan.</div></div><div style={{padding:14,borderRadius:12,background:`${t.y}06`,border:`1px solid ${t.y}18`}}><div style={{fontSize:13,fontWeight:700,color:t.y}}>Row Selection</div><div style={{fontSize:12,color:t.tx2,marginTop:4}}>Filter baris. Ex: Salary ≥ 10 juta saja.</div><div style={{fontSize:10.5,color:t.tx3,marginTop:4,fontStyle:"italic"}}>Why? Fokus subset relevan untuk analisis.</div></div></G></C><Sp/><C t={t}><H3 t={t} c={t.r} ic="🎚️">Data Discretization</H3><P t={t}>Ubah <b style={{color:t.r}}>kontinu → kategori diskret</b>.</P><div style={{padding:14,borderRadius:12,background:`${t.r}06`,border:`1px solid ${t.r}18`}}><div style={{fontSize:12,fontWeight:600,color:t.r,marginBottom:8}}>Ex: Wine consumption → Kategori</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>{[{r:"≤ 1.00",lb:"0"},{r:"1.01–2.00",lb:"1"},{r:"2.01–5.00",lb:"2"},{r:"> 5.00",lb:"3"}].map((b,i)=><div key={i} style={{textAlign:"center",padding:8,borderRadius:8,background:`${t.r}08`}}><div style={{fontSize:20,fontWeight:700,color:t.r,fontFamily:"'Geist Mono'"}}>{b.lb}</div><div style={{fontSize:9.5,color:t.tx3}}>{b.r}</div></div>)}</div></div><Tip t={t}><b>Binning:</b> Urutkan → bagi ke bin (equal-freq/equal-width) → smooth by mean/median/boundaries.</Tip></C></>);}

function SecReduction({t}){return(<><H2 t={t} ic="📦">Data Reduction & Balancing</H2><P t={t}>Representasi data lebih kecil tapi analisis tetap sama/mirip.</P><C t={t}><H3 t={t} c={t.g} ic="🗜️">Strategi Reduction</H3><G cols={2} gap={10}>{[{nm:"Data Cube Aggregation",ic:"🧊",desc:"Harian→bulanan→tahunan",why:"Kurangi baris, pertahankan pola.",c:t.g},{nm:"Dimensionality Reduction",ic:"📐",desc:"PCA, Feature Selection",why:"Terlalu banyak fitur → curse of dimensionality.",c:t.b},{nm:"Numerosity Reduction",ic:"🔢",desc:"Sampling, clustering, histogram",why:"Banyak baris tapi pola sudah jelas.",c:t.y},{nm:"Data Compression",ic:"📦",desc:"Lossless (string) vs Lossy (audio)",why:"Storage/bandwidth terbatas.",c:t.p}].map((s,i)=><div key={i} style={{padding:14,borderRadius:14,background:`${s.c}06`,border:`1px solid ${s.c}18`}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:18}}>{s.ic}</span><div style={{fontSize:13,fontWeight:700,color:s.c}}>{s.nm}</div></div><div style={{fontSize:12,color:t.tx2,marginBottom:4}}>{s.desc}</div><div style={{fontSize:10.5,color:t.tx3,fontStyle:"italic"}}>💡 {s.why}</div></div>)}</G></C><Sp/><C t={t}><H3 t={t} c={t.r} ic="⚖️">Data Balancing</H3><P t={t}>Imbalanced → model bias ke mayoritas. Ex: fraud (99.5% non-fraud, 0.5% fraud).</P><Tip t={t} type="why"><b>Kenapa masalah?</b> Model malas — prediksi mayoritas saja sudah 99.5% akurat. Tapi gagal deteksi fraud yang justru paling penting!</Tip><G cols={2} gap={12}><div style={{padding:18,borderRadius:14,background:`${t.b}06`,border:`1px solid ${t.b}18`,textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:t.b,fontFamily:"'Instrument Serif'",marginBottom:6}}>Undersampling</div><div style={{fontSize:12,color:t.tx2}}>Kurangi sampel <b>mayoritas</b>.</div><div style={{fontSize:10.5,color:t.tx3,marginTop:8}}>⚠ Risiko: kehilangan informasi</div></div><div style={{padding:18,borderRadius:14,background:`${t.o}06`,border:`1px solid ${t.o}18`,textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:t.o,fontFamily:"'Instrument Serif'",marginBottom:6}}>Oversampling</div><div style={{fontSize:12,color:t.tx2}}>Perbanyak sampel <b>minoritas</b>.</div><div style={{fontSize:10.5,color:t.tx3,marginTop:8}}>⚠ Risiko: overfitting (duplikat)</div></div></G></C><Sp/><C t={t} style={{borderTop:`3px solid ${t.g}`}}><H3 t={t} c={t.g} ic="📋">Ringkasan Data Preparation</H3><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8}}>{[{s:"Cleaning",d:"Missing, noisy, inconsistent",c:t.g},{s:"Integration",d:"Gabungkan, resolve conflict",c:t.b},{s:"Transformation",d:"Smoothing, normalisasi",c:t.y},{s:"Selection",d:"Pilih kolom & baris",c:t.p},{s:"Reduction",d:"Kurangi dimensi/ukuran",c:t.o},{s:"Discretization",d:"Kontinu → kategori",c:t.r},{s:"Balancing",d:"Seimbangkan kelas",c:t.b}].map((d,i)=><div key={i} style={{padding:12,borderRadius:12,background:`${d.c}06`,border:`1px solid ${d.c}18`,textAlign:"center"}}><div style={{fontSize:12,fontWeight:700,color:d.c}}>{d.s}</div><div style={{fontSize:10,color:t.tx3,marginTop:3}}>{d.d}</div></div>)}</div></C></>);}

export default function App(){
  const [mode,setMode]=useState("light");
  const [sec,setSec]=useState("overview");
  const t=T[mode];const ref=useRef();
  useEffect(()=>{ref.current&&(ref.current.scrollTop=0)},[sec]);
  const R={overview:SecOverview,collection:SecCollection,eda:SecEDA,stats:SecStats,viz:SecViz,dirty:SecDirty,cleaning:SecCleaning,integration:SecIntegration,transform:SecTransform,reduction:SecReduction};
  const Sec=R[sec]||SecOverview;
  return(
    <div style={{minHeight:"100vh",background:t.bg,color:t.tx,fontFamily:"'Geist',sans-serif",display:"flex",flexDirection:"column",transition:"background .3s,color .3s"}}>
      <link href={FONTS} rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${t.brd};border-radius:3px}::-webkit-scrollbar-track{background:transparent}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{padding:"12px 24px",borderBottom:`1px solid ${t.brd}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:`${t.card}ee`,backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:26}}>📚</span><div><div style={{fontFamily:"'Instrument Serif'",fontSize:20,color:t.tx}}>Materi 4</div><div style={{fontSize:9.5,color:t.tx3,fontFamily:"'Geist Mono'",letterSpacing:1.5}}>DATA COLLECTION · EDA · STATISTICS · PREPARATION</div></div></div>
        <button onClick={()=>setMode(m=>m==="dark"?"light":"dark")} style={{background:t.card2,border:`1px solid ${t.brd}`,borderRadius:20,padding:"5px 14px",cursor:"pointer",color:t.tx,fontSize:12,fontFamily:"'Geist'",display:"flex",alignItems:"center",gap:6}}>{mode==="dark"?"☀️ Light":"🌙 Dark"}</button>
      </div>
      <div style={{display:"flex",flex:1,minHeight:0}}>
        <div style={{width:195,minWidth:195,borderRight:`1px solid ${t.brd}`,padding:"10px 6px",overflowY:"auto",background:`${t.card}60`}}>
          {NAV.map(n=>{const a=sec===n.id;return<button key={n.id} onClick={()=>setSec(n.id)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",borderRadius:10,border:a?`1px solid ${t.g}30`:"1px solid transparent",cursor:"pointer",background:a?`${t.g}10`:"transparent",color:a?t.g:t.tx2,fontSize:12.5,fontWeight:a?600:400,fontFamily:"'Geist'",textAlign:"left",transition:"all .15s",marginBottom:1}}><span style={{fontSize:14}}>{n.ic}</span>{n.lb}</button>})}
        </div>
        <div ref={ref} style={{flex:1,padding:"28px 36px",overflowY:"auto"}}>
          <div style={{maxWidth:900,animation:"fadeIn .3s ease"}}><Sec t={t}/><div style={{height:60}}/></div>
        </div>
      </div>
    </div>
  );
}
