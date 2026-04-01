import { useState, useEffect, useRef } from "react";

const CITIES={Arad:{x:91,y:210,h:366},Bucharest:{x:520,y:440,h:0},Craiova:{x:380,y:510,h:160},Drobeta:{x:260,y:500,h:242},Eforie:{x:640,y:490,h:161},Fagaras:{x:380,y:220,h:176},Giurgiu:{x:490,y:530,h:77},Hirsova:{x:620,y:380,h:151},Iasi:{x:570,y:170,h:226},Lugoj:{x:200,y:380,h:244},Mehadia:{x:220,y:430,h:241},Neamt:{x:510,y:130,h:234},Oradea:{x:170,y:120,h:380},Pitesti:{x:420,y:370,h:100},"R.Vilcea":{x:310,y:320,h:193},Sibiu:{x:280,y:240,h:253},Timisoara:{x:120,y:340,h:329},Urziceni:{x:560,y:400,h:80},Vaslui:{x:600,y:250,h:199},Zerind:{x:130,y:160,h:374}};
const EDGES=[["Arad","Zerind",75],["Arad","Sibiu",140],["Arad","Timisoara",118],["Zerind","Oradea",71],["Oradea","Sibiu",151],["Timisoara","Lugoj",111],["Lugoj","Mehadia",70],["Mehadia","Drobeta",75],["Drobeta","Craiova",120],["Craiova","Pitesti",138],["Craiova","R.Vilcea",146],["Sibiu","Fagaras",99],["Sibiu","R.Vilcea",80],["Fagaras","Bucharest",211],["R.Vilcea","Pitesti",97],["Pitesti","Bucharest",101],["Bucharest","Giurgiu",90],["Bucharest","Urziceni",85],["Urziceni","Hirsova",98],["Hirsova","Eforie",86],["Urziceni","Vaslui",142],["Vaslui","Iasi",92],["Iasi","Neamt",87]];
function nb(c){const n=[];for(const[a,b,w]of EDGES){if(a===c)n.push({city:b,cost:w});if(b===c)n.push({city:a,cost:w});}return n.sort((a,b)=>a.city.localeCompare(b.city));}

function runBFS(s,g){const st=[];const q=[{c:s,p:[s],g:0}];const seen=new Set([s]);st.push({f:[s],exp:[...seen],cur:null,path:[s],cost:0,msg:`Masukkan ${s} ke Queue`,ph:"init"});while(q.length){const n=q.shift();st.push({f:q.map(x=>x.c),exp:[...seen],cur:n.c,path:n.p,cost:n.g,msg:`Pop "${n.c}" dari DEPAN queue (FIFO)`,ph:"pop"});if(n.c===g){st.push({f:q.map(x=>x.c),exp:[...seen],cur:n.c,path:n.p,cost:n.g,msg:`🎉 "${g}" ditemukan! Cost: ${n.g}`,ph:"goal"});return st;}const nbs=nb(n.c);const add=[];for(const x of nbs)if(!seen.has(x.city)){seen.add(x.city);q.push({c:x.city,p:[...n.p,x.city],g:n.g+x.cost});add.push(x.city);}if(add.length)st.push({f:q.map(x=>x.c),exp:[...seen],cur:n.c,path:n.p,cost:n.g,msg:`Expand "${n.c}" → [${add.join(", ")}] masuk BELAKANG queue`,ph:"expand",add});}return st;}

function runDFS(s,g){const st=[];const sk=[{c:s,p:[s],g:0}];const seen=new Set([s]);st.push({f:[s],exp:[...seen],cur:null,path:[s],cost:0,msg:`Masukkan ${s} ke Stack`,ph:"init"});while(sk.length){const n=sk.pop();st.push({f:sk.map(x=>x.c),exp:[...seen],cur:n.c,path:n.p,cost:n.g,msg:`Pop "${n.c}" dari ATAS stack (LIFO)`,ph:"pop"});if(n.c===g){st.push({f:sk.map(x=>x.c),exp:[...seen],cur:n.c,path:n.p,cost:n.g,msg:`🎉 "${g}" ditemukan! Cost: ${n.g}`,ph:"goal"});return st;}const nbs=nb(n.c).reverse();const add=[];for(const x of nbs)if(!seen.has(x.city)){seen.add(x.city);sk.push({c:x.city,p:[...n.p,x.city],g:n.g+x.cost});add.push(x.city);}if(add.length)st.push({f:sk.map(x=>x.c),exp:[...seen],cur:n.c,path:n.p,cost:n.g,msg:`Expand "${n.c}" → push [${add.join(", ")}] ke ATAS stack`,ph:"expand",add});}return st;}

function runUCS(s,g){const st=[];const pq=[{c:s,p:[s],g:0}];const best=new Map([[s,0]]);st.push({f:[`${s}(0)`],exp:[...best.keys()],cur:null,path:[s],cost:0,msg:`Masukkan ${s} (cost=0) ke Priority Queue`,ph:"init"});while(pq.length){pq.sort((a,b)=>a.g-b.g);const n=pq.shift();st.push({f:pq.map(x=>`${x.c}(${x.g})`),exp:[...best.keys()],cur:n.c,path:n.p,cost:n.g,msg:`Pop "${n.c}" (cost=${n.g}) — TERKECIL di PQ`,ph:"pop"});if(n.c===g){st.push({f:pq.map(x=>`${x.c}(${x.g})`),exp:[...best.keys()],cur:n.c,path:n.p,cost:n.g,msg:`🎉 Optimal! "${g}" cost: ${n.g}`,ph:"goal"});return st;}const nbs=nb(n.c);const add=[];for(const x of nbs){const ng=n.g+x.cost;if(!best.has(x.city)||ng<best.get(x.city)){best.set(x.city,ng);pq.push({c:x.city,p:[...n.p,x.city],g:ng});add.push(`${x.city}(${ng})`);}}if(add.length)st.push({f:pq.map(x=>`${x.c}(${x.g})`),exp:[...best.keys()],cur:n.c,path:n.p,cost:n.g,msg:`Expand "${n.c}" → [${add.join(", ")}]`,ph:"expand",add});}return st;}

function runGBFS(s,g){const st=[];const pq=[{c:s,p:[s],g:0,h:CITIES[s].h}];const seen=new Set([s]);st.push({f:[`${s}(h=${CITIES[s].h})`],exp:[...seen],cur:null,path:[s],cost:0,msg:`Masukkan ${s} (h=${CITIES[s].h}) ke PQ`,ph:"init"});while(pq.length){pq.sort((a,b)=>a.h-b.h);const n=pq.shift();st.push({f:pq.map(x=>`${x.c}(h=${x.h})`),exp:[...seen],cur:n.c,path:n.p,cost:n.g,msg:`Pop "${n.c}" (h=${n.h}) — heuristic TERKECIL`,ph:"pop"});if(n.c===g){st.push({f:pq.map(x=>`${x.c}(h=${x.h})`),exp:[...seen],cur:n.c,path:n.p,cost:n.g,msg:`🎉 "${g}" ditemukan! Cost: ${n.g} (belum tentu optimal!)`,ph:"goal"});return st;}const add=[];for(const x of nb(n.c))if(!seen.has(x.city)){seen.add(x.city);pq.push({c:x.city,p:[...n.p,x.city],g:n.g+x.cost,h:CITIES[x.city].h});add.push(`${x.city}(h=${CITIES[x.city].h})`);}if(add.length)st.push({f:pq.map(x=>`${x.c}(h=${x.h})`),exp:[...seen],cur:n.c,path:n.p,cost:n.g,msg:`Expand → [${add.join(", ")}]`,ph:"expand",add});}return st;}

function runAStar(s,g){const st=[];const pq=[{c:s,p:[s],g:0,h:CITIES[s].h,f:CITIES[s].h}];const best=new Map([[s,CITIES[s].h]]);st.push({f:[`${s}(f=${CITIES[s].h})`],exp:[...best.keys()],cur:null,path:[s],cost:0,msg:`${s}: g=0 + h=${CITIES[s].h} = f=${CITIES[s].h}`,ph:"init"});while(pq.length){pq.sort((a,b)=>a.f-b.f);const n=pq.shift();st.push({f:pq.map(x=>`${x.c}(${x.f})`),exp:[...best.keys()],cur:n.c,path:n.p,cost:n.g,msg:`Pop "${n.c}" (g=${n.g} + h=${n.h} = f=${n.f})`,ph:"pop"});if(n.c===g){st.push({f:pq.map(x=>`${x.c}(${x.f})`),exp:[...best.keys()],cur:n.c,path:n.p,cost:n.g,msg:`🎉 Optimal! Cost: ${n.g}`,ph:"goal"});return st;}const add=[];for(const x of nb(n.c)){const ng=n.g+x.cost,h=CITIES[x.city].h,nf=ng+h;if(!best.has(x.city)||nf<best.get(x.city)){best.set(x.city,nf);pq.push({c:x.city,p:[...n.p,x.city],g:ng,h,f:nf});add.push(`${x.city}(f=${nf})`);}}if(add.length)st.push({f:pq.map(x=>`${x.c}(${x.f})`),exp:[...best.keys()],cur:n.c,path:n.p,cost:n.g,msg:`Expand → [${add.join(", ")}]`,ph:"expand",add});}return st;}

const ALGOS={"BFS":runBFS,"DFS":runDFS,"UCS":runUCS,"GBFS":runGBFS,"A*":runAStar};

export default function App(){
const[dk,setDk]=useState(false);
const[tab,setTab]=useState("overview");
const[algo,setAlgo]=useState("BFS");
const[step,setSt]=useState(0);
const[steps,setSteps]=useState([]);
const[play,setPlay]=useState(false);
const tmr=useRef(null);
const T=dk?{bg:"#08080d",bg2:"#0d0d14",card:"#111119",bdr:"#1a1a2a",tx:"#e8e8f2",sub:"#6e6e88",dim:"#2e2e42",bl:"#7b9bff",rd:"#ff7b8e",gn:"#7bffa8",am:"#ffcb7b",pr:"#b87bff",cy:"#7bdfff",code:"#0a0a11"}:{bg:"#f5f3ed",bg2:"#ece9e0",card:"#ffffff",bdr:"#ddd8cb",tx:"#1a1a2e",sub:"#6b6b7f",dim:"#c5c0b2",bl:"#3b5bdb",rd:"#e03131",gn:"#2b8a3e",am:"#e67700",pr:"#7048e8",cy:"#1098ad",code:"#f0ede4"};

useEffect(()=>{const fn=ALGOS[algo];if(fn){setSteps(fn("Arad","Bucharest"));setSt(0);setPlay(false);}},[algo]);
useEffect(()=>{if(play&&step<steps.length-1)tmr.current=setTimeout(()=>setSt(s=>s+1),1000);else setPlay(false);return()=>clearTimeout(tmr.current);},[play,step,steps.length]);
const cur=steps[step]||{};

const Box=({children,s})=><div style={{background:T.card,border:`1px solid ${T.bdr}`,borderRadius:14,padding:20,...s}}>{children}</div>;
const Tag=({children,c})=><span style={{display:"inline-block",padding:"2px 9px",borderRadius:6,fontSize:10,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",background:`${c||T.bl}14`,color:c||T.bl,border:`1px solid ${c||T.bl}28`}}>{children}</span>;
const H=({em,children})=><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}><span style={{fontSize:26}}>{em}</span><h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:28,color:T.tx,fontWeight:600,margin:0}}>{children}</h2></div>;
const Why=({children})=><div style={{background:`${T.pr}0a`,border:`1px solid ${T.pr}20`,borderRadius:10,padding:"12px 16px",margin:"12px 0",borderLeft:`3px solid ${T.pr}`}}><div style={{fontFamily:"monospace",fontSize:10,color:T.pr,fontWeight:700,letterSpacing:1.5,marginBottom:6}}>💡 KENAPA?</div><div style={{fontSize:13,color:T.tx,lineHeight:1.75}}>{children}</div></div>;
const Props=({items})=><div style={{display:"grid",gridTemplateColumns:`repeat(${items.length},1fr)`,gap:6,marginTop:12}}>{items.map((p,i)=><div key={i} style={{background:T.code,borderRadius:8,padding:10,textAlign:"center"}}><div style={{fontSize:9,color:T.sub}}>{p.l}</div><div style={{fontSize:13,fontWeight:700,color:p.c,fontFamily:"monospace",margin:"4px 0"}}>{p.v}</div><div style={{fontSize:9,color:T.sub,lineHeight:1.3}}>{p.n}</div></div>)}</div>;

const RMap=({cur:c,path,exp,showH})=>{
  const ps=new Set(path||[]),es=new Set(exp||[]),pe=[];
  if(path&&path.length>1)for(let i=0;i<path.length-1;i++)pe.push([path[i],path[i+1]]);
  return <svg viewBox="0 0 720 590" style={{width:"100%",fontFamily:"system-ui"}}>
    <defs><filter id="gl"><feGaussianBlur stdDeviation="4" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="pu"><stop offset="0%" stopColor={T.bl} stopOpacity="0.25"/><stop offset="100%" stopColor={T.bl} stopOpacity="0"/></radialGradient></defs>
    {EDGES.map(([a,b,w],i)=>{const ca=CITIES[a],cb=CITIES[b],ip=pe.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a));
      const mx=(ca.x+cb.x)/2,my=(ca.y+cb.y)/2;const dx=cb.x-ca.x,dy=cb.y-ca.y;const len=Math.sqrt(dx*dx+dy*dy);const ox=-dy/len*8,oy=dx/len*8;
      return <g key={i}><line x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y} stroke={ip?T.bl:T.dim} strokeWidth={ip?3:1} opacity={ip?1:0.3} strokeLinecap="round" filter={ip?"url(#gl)":undefined}/>
        <text x={mx+ox} y={my+oy} fill={ip?T.bl:T.sub} fontSize={8} textAnchor="middle" fontFamily="monospace" opacity={0.7}>{w}</text></g>;})}
    {Object.entries(CITIES).map(([nm,{x,y,h}])=>{const ic=c===nm,ip=ps.has(nm),ie=es.has(nm),ig=nm==="Bucharest",is=nm==="Arad";
      const r=ic?13:ip?9:6;const fl=ic?T.bl:ig?T.rd:is?T.gn:ip?T.am:ie?T.dim:(dk?"#1a1a28":"#d8d4ca");
      return <g key={nm}>{ic&&<circle cx={x} cy={y} r={28} fill="url(#pu)"><animate attributeName="r" values="20;32;20" dur="2s" repeatCount="indefinite"/></circle>}
        <circle cx={x} cy={y} r={r} fill={fl} stroke={ic?T.bl:ip?T.am:"none"} strokeWidth={2}/>
        <text x={x} y={y-r-4} fill={ic?T.bl:ip?T.tx:T.sub} fontSize={ic?11:9} textAnchor="middle" fontWeight={ic||ip?700:500}>{nm}</text>
        {showH&&<text x={x+r+3} y={y+3} fill={T.pr} fontSize={7} fontFamily="monospace" fontWeight={700}>h={h}</text>}
      </g>;})}
    <g transform="translate(10,565)">{[{c:T.gn,l:"Start"},{c:T.rd,l:"Goal"},{c:T.bl,l:"Current"},{c:T.am,l:"Path"},{c:T.dim,l:"Explored"}].map(({c,l},i)=>
      <g key={i} transform={`translate(${i*120},0)`}><circle cx={5} cy={0} r={4} fill={c}/><text x={14} y={4} fill={T.sub} fontSize={9}>{l}</text></g>)}</g>
  </svg>;};

const DSVis=({type,items,popL,addL})=>{
  const cols=[T.bl,T.am,T.gn,T.rd,T.pr,T.cy];
  return <svg viewBox="0 0 520 80" style={{width:"100%",maxWidth:500,margin:"8px 0"}}>
    <rect x={0} y={8} width={520} height={48} rx={8} fill={T.code} stroke={T.bdr}/>
    {items.map((it,i)=>{const w=Math.min(70,480/Math.max(items.length,1)),x=8+i*(w+4);
      return <g key={i}><rect x={x} y={14} width={w} height={36} rx={5} fill={`${cols[i%6]}15`} stroke={`${cols[i%6]}35`}/>
        <text x={x+w/2} y={36} textAnchor="middle" fill={cols[i%6]} fontSize={9} fontWeight={600} fontFamily="monospace">{it}</text></g>;})}
    <text x={4} y={72} fill={T.gn} fontSize={9} fontFamily="monospace" fontWeight={700}>← {popL}</text>
    <text x={516} y={72} fill={T.am} fontSize={9} fontFamily="monospace" fontWeight={700} textAnchor="end">{addL} →</text>
    <text x={260} y={5} fill={T.sub} fontSize={8} fontFamily="monospace" textAnchor="middle">{type}</text>
  </svg>;};

// ═══════════════ TABS ═══════════════
const OverviewTab=()=><div>
  <div style={{textAlign:"center",padding:"48px 20px 36px"}}>
    <div style={{fontFamily:"monospace",fontSize:11,color:T.bl,letterSpacing:4,marginBottom:10}}>MATERI 02 · KASDAD · FASILKOM UI</div>
    <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:42,color:T.tx,fontWeight:700,lineHeight:1.15,margin:0}}>Uninformed &</h1>
    <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:42,color:T.bl,fontWeight:700,fontStyle:"italic",margin:0}}>Informed Search</h1>
    <p style={{fontSize:15,color:T.sub,maxWidth:530,margin:"20px auto 0",lineHeight:1.8}}>
      Bayangkan kamu tersesat di kota asing. <strong style={{color:T.tx}}>Uninformed search</strong> = jalan tanpa peta. <strong style={{color:T.tx}}>Informed search</strong> = punya GPS dengan estimasi jarak.
    </p>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
    {[{em:"🤖",t:"Problem-Solving Agent",d:"Agent yang punya goal & merencanakan aksi lewat search",c:T.bl},{em:"🗺",t:"State Space",d:"Semua kemungkinan keadaan direpresentasikan sbg graph",c:T.gn},{em:"🔍",t:"Search Strategy",d:"Cara memilih node mana yang di-expand duluan — inti perbedaan",c:T.am}].map((x,i)=>
      <Box key={i} s={{borderTop:`3px solid ${x.c}`,textAlign:"center",padding:24}}><div style={{fontSize:32,marginBottom:8}}>{x.em}</div><div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:6}}>{x.t}</div><div style={{fontSize:12,color:T.sub,lineHeight:1.6}}>{x.d}</div></Box>)}
  </div>
  <Box s={{marginBottom:20}}>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.bl,letterSpacing:2,marginBottom:10}}>CONTOH UTAMA — PETA ROMANIA</div>
    <p style={{fontSize:13,color:T.sub,lineHeight:1.7,marginBottom:14}}>Agent di <strong style={{color:T.gn}}>Arad</strong>, harus ke <strong style={{color:T.rd}}>Bucharest</strong>. Angka = biaya jalan (km). Tugas: cari rute terbaik!</p>
    <RMap/>
  </Box>
  <Box>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.am,letterSpacing:2,marginBottom:12}}>ASUMSI LINGKUNGAN</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {[{em:"👁",t:"Fully Observable",d:"Agent lihat seluruh peta"},{em:"🎯",t:"Deterministic",d:"Aksi pasti hasilnya sesuai prediksi"},{em:"⏸",t:"Static",d:"Peta tak berubah saat berpikir"},{em:"🔢",t:"Discrete",d:"State & aksi terbatas"}].map((a,i)=>
        <div key={i} style={{background:T.code,borderRadius:10,padding:14,textAlign:"center"}}><div style={{fontSize:22,marginBottom:6}}>{a.em}</div><div style={{fontSize:11,fontWeight:700,color:T.tx,marginBottom:3}}>{a.t}</div><div style={{fontSize:10,color:T.sub,lineHeight:1.4}}>{a.d}</div></div>)}
    </div>
    <Why>Dengan 4 asumsi ini, agent bisa menghitung rute SEBELUM jalan — seperti buka Google Maps dulu sebelum nyetir. Solusinya pasti bisa dijalankan tanpa kejutan di tengah jalan.</Why>
  </Box>
</div>;

const ConceptsTab=()=><div>
  <H em="🧩">Konsep Dasar</H>
  <Box s={{marginBottom:16}}>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.gn,letterSpacing:2,marginBottom:16}}>EVOLUSI AGENT</div>
    <svg viewBox="0 0 680 95" style={{width:"100%"}}>{[{x:20,l:"Reflex Agent",s:"IF kotor → sedot",c:T.sub},{x:240,l:"Goal-Based",s:"Punya tujuan, evaluasi aksi",c:T.am},{x:460,l:"Problem-Solving",s:"Formalisasi + Search!",c:T.bl}].map(({x,l,s,c},i)=>
      <g key={i}><rect x={x} y={10} width={200} height={65} rx={10} fill={`${c}0c`} stroke={`${c}30`} strokeWidth={1.5}/><text x={x+100} y={35} textAnchor="middle" fill={c} fontSize={12} fontWeight={700}>{["⚡","🎯","🧠"][i]} {l}</text><text x={x+100} y={55} textAnchor="middle" fill={T.sub} fontSize={10}>{s}</text>
        {i<2&&<><line x1={x+205} y1={42} x2={x+235} y2={42} stroke={T.dim} strokeWidth={1.5} strokeDasharray="4,3"/><polygon points={`${x+232},38 ${x+232},46 ${x+240},42`} fill={T.dim}/></>}</g>)}</svg>
    <Why><strong>Reflex agent</strong> langsung bereaksi (cocok untuk tugas simpel). Tapi navigasi kota? Perlu <strong>berpikir dulu</strong> — formalisasi masalah jadi state space, lalu cari urutan aksi terbaik. Itulah <strong>problem-solving agent</strong>.</Why>
  </Box>
  <Box s={{marginBottom:16}}>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.bl,letterSpacing:2,marginBottom:16}}>STATE SPACE — 5 KOMPONEN WAJIB</div>
    <p style={{fontSize:13,color:T.sub,lineHeight:1.7,marginBottom:14}}>State space = <strong style={{color:T.tx}}>peta lengkap semua kemungkinan</strong>. Dimodelkan sebagai <strong style={{color:T.tx}}>graph</strong>: node=state, edge=aksi, weight=biaya.</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {[{em:"📍",t:"States",d:"Semua keadaan yang mungkin",ex:"LocatedIn(Arad), LocatedIn(Sibiu), ...",c:T.bl,w:"Semua titik di peta yang bisa dikunjungi"},
        {em:"🚩",t:"S_init",d:"Titik awal — sebelum aksi pertama",ex:"S_init = LocatedIn(Arad)",c:T.gn,w:"Di mana kamu SEKARANG?"},
        {em:"🎬",t:"PosAct(s)",d:"Aksi yang tersedia di state s",ex:"PosAct(Arad) = {DriveTo(Sibiu), DriveTo(Tim), DriveTo(Zer)}",c:T.am,w:"Dari sini, ke mana saja kamu BISA pergi?"},
        {em:"➡️",t:"NextState(s,a)",d:"State baru setelah melakukan aksi a di state s",ex:"NextState(Arad, DriveTo(Sibiu)) = LocatedIn(Sibiu)",c:T.pr,w:"Kalau belok kiri, sampai di mana?"},
        {em:"💰",t:"ActCost(s,a,s')",d:"Biaya satu langkah dari s ke s'",ex:"ActCost(Arad, DriveTo(Sibiu), Sibiu) = 140",c:T.rd,w:"Berapa ongkos langkah ini?"},
      ].map((x,i)=><div key={i} style={{background:T.code,borderRadius:10,padding:14,borderLeft:`3px solid ${x.c}`}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><span style={{fontSize:18}}>{x.em}</span><span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:x.c}}>{x.t}</span></div>
        <div style={{fontSize:12,color:T.tx,marginBottom:6,lineHeight:1.5}}>{x.d}</div>
        <div style={{fontSize:10,color:T.sub,fontFamily:"monospace",background:dk?"#080810":"#e8e5dc",padding:"5px 8px",borderRadius:5,marginBottom:6,wordBreak:"break-all"}}>{x.ex}</div>
        <div style={{fontSize:11,color:x.c,fontStyle:"italic"}}>→ {x.w}</div>
      </div>)}
    </div>
  </Box>
  <Box s={{marginBottom:16}}>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.rd,letterSpacing:2,marginBottom:12}}>SOLUSI = PATH DARI START KE GOAL</div>
    <svg viewBox="0 0 680 105" style={{width:"100%"}}>{["Arad","Sibiu","R.Vilcea","Pitesti","Bucharest"].map((c,i)=>{const x=25+i*140,costs=[0,140,220,317,418];
      return <g key={i}><rect x={x} y={15} width={100} height={42} rx={8} fill={`${T.bl}0c`} stroke={`${T.bl}30`}/><text x={x+50} y={40} textAnchor="middle" fill={T.tx} fontSize={10} fontWeight={600}>{c}</text>
        <text x={x+50} y={72} textAnchor="middle" fill={T.bl} fontSize={10} fontFamily="monospace">g={costs[i]}</text>
        {i<4&&<><line x1={x+104} y1={36} x2={x+136} y2={36} stroke={T.am} strokeWidth={2}/><text x={x+120} y={30} fill={T.am} fontSize={8} textAnchor="middle" fontFamily="monospace">{[140,80,97,101][i]}</text></>}</g>;})}<text x={340} y={98} textAnchor="middle" fill={T.gn} fontSize={12} fontWeight={700} fontFamily="monospace">PathCost = 140+80+97+101 = 418 ✓ OPTIMAL</text></svg>
    <Why><strong>PathCost</strong> = jumlah semua ActCost di path. <strong>Optimal solution</strong> = path dgn PathCost terkecil. Rute Arad→Sibiu→R.Vilcea→Pitesti→Bucharest = 418 adalah optimal. Rute lewat Fagaras (450) lebih mahal — bukan optimal.</Why>
  </Box>
  <Box>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.cy,letterSpacing:2,marginBottom:14}}>FRONTIER & EXPLORED — JANTUNG SEARCH</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <div style={{background:T.code,borderRadius:10,padding:16}}>
        <div style={{fontSize:14,fontWeight:700,color:T.bl,marginBottom:8}}>📦 Frontier</div>
        <div style={{fontSize:12,color:T.sub,lineHeight:1.7,marginBottom:10}}>Node yang <strong style={{color:T.tx}}>menunggu giliran</strong> di-expand. <strong style={{color:T.bl}}>Data structure frontier = strategi search!</strong></div>
        <div style={{display:"flex",flexWrap:"wrap",gap:4}}><Tag c={T.bl}>Queue → BFS</Tag><Tag c={T.rd}>Stack → DFS</Tag><Tag c={T.am}>PriorityQ → UCS/A*</Tag></div>
      </div>
      <div style={{background:T.code,borderRadius:10,padding:16}}>
        <div style={{fontSize:14,fontWeight:700,color:T.gn,marginBottom:8}}>📋 Explored Set</div>
        <div style={{fontSize:12,color:T.sub,lineHeight:1.7}}>Dictionary berisi state yang <strong style={{color:T.tx}}>sudah dikunjungi</strong>. Tujuan: <strong style={{color:T.rd}}>cegah infinite loop!</strong></div>
        <Why>Tanpa explored set, graph dgn cycle (A→B→C→A) bisa muter-muter selamanya tanpa pernah menemukan goal.</Why>
      </div>
    </div>
  </Box>
</div>;

const UninformedTab=()=><div>
  <H em="🔍">Uninformed Search</H>
  <p style={{fontSize:14,color:T.sub,lineHeight:1.7,marginBottom:20}}>Disebut <strong style={{color:T.tx}}>"blind"</strong> karena <strong style={{color:T.tx}}>tak tahu arah goal</strong>. Perbedaan antar strategi HANYA: <strong style={{color:T.bl}}>urutan expand node</strong>.</p>

  {/* BFS */}
  <Box s={{marginBottom:16,borderLeft:`3px solid ${T.bl}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:20,fontWeight:700,color:T.tx,fontFamily:"'Playfair Display',Georgia,serif"}}>📋 Breadth-First Search</div><Tag c={T.bl}>QUEUE (FIFO)</Tag></div>
    <div style={{fontSize:13,color:T.bl,fontWeight:600,marginBottom:8}}>Expand node paling DEKAT ke root dulu — level per level</div>
    <DSVis type="Queue — First In, First Out" items={["Sibiu","Tim.","Zerind","Oradea","Fag."]} popL="POP sini" addL="ADD sini"/>
    <Why>Cari kunci di rumah → cek <strong>semua ruangan lantai 1</strong> dulu, baru naik lantai 2. Queue menjamin ini: yang masuk duluan, keluar duluan. Jadi level demi level tereksplorasi sempurna.</Why>
    <Props items={[{l:"Complete?",v:"Ya ✓",c:T.gn,n:"jika b finite"},{l:"Time",v:"O(bᵈ)",c:T.am,n:"semua node sampai lvl d"},{l:"Space",v:"O(bᵈ)",c:T.rd,n:"simpan semua di memori!"},{l:"Optimal?",v:"=cost only",c:T.am,n:"jika step cost sama"}]}/>
    <div style={{marginTop:10,background:`${T.rd}08`,border:`1px solid ${T.rd}18`,borderRadius:8,padding:"8px 12px",fontSize:12,color:T.sub}}>⚠️ <strong style={{color:T.rd}}>Masalah: MEMORI.</strong> b=10, d=12 → 10¹² node ≈ 1 petabyte!</div>
  </Box>

  {/* DFS */}
  <Box s={{marginBottom:16,borderLeft:`3px solid ${T.rd}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:20,fontWeight:700,color:T.tx,fontFamily:"'Playfair Display',Georgia,serif"}}>📚 Depth-First Search</div><Tag c={T.rd}>STACK (LIFO)</Tag></div>
    <div style={{fontSize:13,color:T.rd,fontWeight:600,marginBottom:8}}>Expand node paling JAUH dari root — terus maju sampai mentok</div>
    <DSVis type="Stack — Last In, First Out" items={["Oradea","Fagaras","R.Vilcea","Sibiu"]} popL="POP sini" addL="PUSH sini"/>
    <Why>Di labirin → <strong>terus maju sampai buntu</strong>, baru balik coba arah lain. Hemat memori (cuma simpan 1 path), tapi bisa <strong>nyasar sangat dalam</strong> meski goal dekat dari start.</Why>
    <Props items={[{l:"Complete?",v:"Bisa tidak!",c:T.rd,n:"loop tanpa explored"},{l:"Time",v:"O(bᵐ)",c:T.rd,n:"m bisa >> d!"},{l:"Space",v:"O(bm)",c:T.gn,n:"hemat! 1 path saja"},{l:"Optimal?",v:"Tidak ✗",c:T.rd,n:"bisa path panjang dulu"}]}/>
  </Box>

  {/* UCS */}
  <Box s={{marginBottom:16,borderLeft:`3px solid ${T.am}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:20,fontWeight:700,color:T.tx,fontFamily:"'Playfair Display',Georgia,serif"}}>⚖️ Uniform Cost Search</div><Tag c={T.am}>PRIORITY QUEUE (g)</Tag></div>
    <div style={{fontSize:13,color:T.am,fontWeight:600,marginBottom:8}}>Expand node dgn TOTAL PATH COST kumulatif terkecil</div>
    <DSVis type="Priority Queue — sorted by g(n) ascending" items={["Zer(75)","Tim(118)","Sib(140)","Ora(146)"]} popL="POP terkecil" addL="INSERT sorted"/>
    <Why>BFS optimal jika step cost sama. Tapi kalau beda? UCS selalu pilih yang <strong>total biayanya paling murah</strong>. Hasilnya: <strong style={{color:T.gn}}>selalu optimal!</strong><br/><br/><strong>Fun fact:</strong> UCS = BFS jika semua cost sama. UCS mirip Dijkstra, tapi berhenti begitu goal ketemu (Dijkstra hitung ke SEMUA node).</Why>
    <Props items={[{l:"Complete?",v:"Ya ✓",c:T.gn,n:"jika cost > 0"},{l:"Time",v:"O(b^⌊C*/ε⌋)",c:T.am,n:"C*=optimal, ε=min step"},{l:"Space",v:"O(b^⌊C*/ε⌋)",c:T.rd,n:"bisa sangat besar"},{l:"Optimal?",v:"Ya! ✓",c:T.gn,n:"always cheapest"}]}/>
  </Box>

  {/* IDS */}
  <Box s={{borderLeft:`3px solid ${T.gn}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:20,fontWeight:700,color:T.tx,fontFamily:"'Playfair Display',Georgia,serif"}}>🔄 Iterative Deepening</div><Tag c={T.gn}>BEST Uninformed</Tag></div>
    <div style={{fontSize:13,color:T.gn,fontWeight:600,marginBottom:8}}>Jalankan DFS dgn depth limit 0, 1, 2, 3, ... naik terus sampai goal ketemu</div>
    <svg viewBox="0 0 600 85" style={{width:"100%",margin:"8px 0"}}>{[0,1,2,3].map(d=>{const x=8+d*150;return <g key={d}><rect x={x} y={8} width={135} height={55} rx={8} fill={`${T.gn}0a`} stroke={`${T.gn}22`}/><text x={x+67} y={28} textAnchor="middle" fill={T.gn} fontSize={11} fontWeight={700}>DFS limit={d}</text><text x={x+67} y={48} textAnchor="middle" fill={T.sub} fontSize={10}>{d===3?"✓ Found!":"✗ Cutoff"}</text>{d<3&&<text x={x+142} y={38} fill={T.dim} fontSize={14}>→</text>}</g>;})}</svg>
    <Why>Gabungkan yang terbaik dari BFS & DFS:<br/>• <strong style={{color:T.gn}}>Space O(bd)</strong> dari DFS — hemat memori<br/>• <strong style={{color:T.gn}}>Completeness</strong> dari BFS — pasti ketemu<br/>• <strong style={{color:T.gn}}>Time O(bᵈ)</strong> — sama dgn BFS!<br/><br/>"Boros karena ulang?" → Tidak! Node level atas sedikit. Overhead cuma ~11% jika b=10. <strong>Strategi uninformed terbaik</strong> saat depth goal unknown.</Why>
    <Props items={[{l:"Complete?",v:"Ya ✓",c:T.gn,n:"b finite"},{l:"Time",v:"O(bᵈ)",c:T.gn,n:"sama BFS!"},{l:"Space",v:"O(bd)",c:T.gn,n:"linear! spt DFS"},{l:"Optimal?",v:"=cost only",c:T.am,n:"jika step cost sama"}]}/>
  </Box>
</div>;

const InformedTab=()=><div>
  <H em="🧠">Informed Search</H>
  <p style={{fontSize:14,color:T.sub,lineHeight:1.7,marginBottom:20}}>Agent punya <strong style={{color:T.pr}}>heuristic h(n)</strong> — estimasi biaya dari n ke goal. Seperti punya <strong style={{color:T.tx}}>kompas</strong>!</p>

  <Box s={{marginBottom:16,borderLeft:`3px solid ${T.pr}`}}>
    <div style={{fontSize:18,fontWeight:700,color:T.tx,marginBottom:10,fontFamily:"'Playfair Display',Georgia,serif"}}>🧭 Heuristic Function</div>
    <div style={{fontSize:13,color:T.sub,lineHeight:1.7,marginBottom:12}}>Fungsi <strong style={{color:T.pr}}>h(n)</strong> yang <strong style={{color:T.tx}}>mengestimasi</strong> biaya tersisa dari state n ke goal. Untuk Romania: <strong style={{color:T.tx}}>jarak garis lurus (SLD)</strong> ke Bucharest.</div>
    <svg viewBox="0 0 600 80" style={{width:"100%",margin:"8px 0"}}><rect x={10} y={5} width={580} height={62} rx={10} fill={`${T.pr}08`} stroke={`${T.pr}18`}/>
      {[{c:"Arad",h:366,x:60},{c:"Sibiu",h:253,x:180},{c:"Fagaras",h:176,x:300},{c:"Pitesti",h:100,x:420},{c:"Buch.",h:0,x:540}].map(({c,h,x},i)=>
        <g key={i}><circle cx={x} cy={36} r={18} fill={`${T.pr}12`} stroke={`${T.pr}35`}/><text x={x} y={33} textAnchor="middle" fill={T.tx} fontSize={8} fontWeight={600}>{c}</text><text x={x} y={44} textAnchor="middle" fill={T.pr} fontSize={8} fontFamily="monospace">h={h}</text></g>)}</svg>
    <Why>SLD bagus karena <strong>garis lurus SELALU ≤ jarak jalan sebenarnya</strong>. Jadi SLD tak pernah "menipu" — ini disebut <strong style={{color:T.gn}}>admissible</strong>.</Why>
  </Box>

  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
    <Box s={{borderTop:`3px solid ${T.gn}`}}>
      <div style={{fontSize:14,fontWeight:700,color:T.gn,marginBottom:8}}>✅ Admissible</div>
      <div style={{fontFamily:"monospace",fontSize:15,color:T.tx,textAlign:"center",padding:"12px 0",background:T.code,borderRadius:8,marginBottom:10}}>0 ≤ h(n) ≤ h*(n)</div>
      <div style={{fontSize:12,color:T.sub,lineHeight:1.7}}>h*(n) = biaya optimal sebenarnya. Heuristic <strong style={{color:T.tx}}>TIDAK BOLEH overestimate</strong>.</div>
      <Why>Ibarat teman bilang "paling jauh 5 km" — boleh lebih dekat, tapi JANGAN bilang lebih jauh dari kenyataan.</Why>
      <div style={{fontSize:12,color:T.gn,fontWeight:600,marginTop:8}}>→ Jamin A* optimal</div>
    </Box>
    <Box s={{borderTop:`3px solid ${T.cy}`}}>
      <div style={{fontSize:14,fontWeight:700,color:T.cy,marginBottom:8}}>✅ Consistent</div>
      <div style={{fontFamily:"monospace",fontSize:15,color:T.tx,textAlign:"center",padding:"12px 0",background:T.code,borderRadius:8,marginBottom:10}}>h(n) ≤ c(n,a,n') + h(n')</div>
      <div style={{fontSize:12,color:T.sub,lineHeight:1.7}}><strong style={{color:T.tx}}>Triangle inequality</strong>: jarak langsung ≤ jarak lewat tetangga.</div>
      <Why>Estimasi Arad→Bucharest langsung tidak boleh lebih dari (Arad→Sibiu) + (estimasi Sibiu→Bucharest). Logis!</Why>
      <div style={{fontSize:12,color:T.cy,fontWeight:600,marginTop:8}}>→ Consistent ⊂ Admissible (selalu!)</div>
    </Box>
  </div>

  {/* GBFS */}
  <Box s={{marginBottom:16,borderLeft:`3px solid ${T.pr}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:20,fontWeight:700,color:T.tx,fontFamily:"'Playfair Display',Georgia,serif"}}>🏃 Greedy Best-First</div><Tag c={T.pr}>PQ by h(n)</Tag></div>
    <div style={{fontFamily:"monospace",fontSize:15,color:T.pr,textAlign:"center",padding:12,background:T.code,borderRadius:8,marginBottom:10}}>Eval(n) = h(n)</div>
    <Why>Seperti orang yang <strong>selalu jalan ke arah yang TERLIHAT paling dekat</strong>. Cepat? Iya. Bisa tersesat? Juga! Ada gunung menghalangi → SLD bilang dekat, jalan sebenarnya jauh.<br/><br/><strong style={{color:T.rd}}>TIDAK optimal, TIDAK complete!</strong> Jangan tertipu nama "best-first".</Why>
    <Props items={[{l:"Complete?",v:"Tidak ✗",c:T.rd,n:""},{l:"Time",v:"O(bᵐ)",c:T.rd,n:""},{l:"Space",v:"O(bᵐ)",c:T.rd,n:""},{l:"Optimal?",v:"Tidak ✗",c:T.rd,n:""}]}/>
  </Box>

  {/* A* */}
  <Box s={{borderLeft:`3px solid ${T.bl}`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:20,fontWeight:700,color:T.tx,fontFamily:"'Playfair Display',Georgia,serif"}}>⭐ A* Search</div><Tag c={T.bl}>PQ by f(n)=g(n)+h(n)</Tag></div>
    <svg viewBox="0 0 600 75" style={{width:"100%",margin:"6px 0"}}><rect x={60} y={2} width={480} height={48} rx={10} fill={`${T.bl}08`} stroke={`${T.bl}20`}/><text x={300} y={28} textAnchor="middle" fill={T.tx} fontSize={22} fontWeight={700} fontFamily="monospace">f(n) = g(n) + h(n)</text><text x={300} y={44} textAnchor="middle" fill={T.sub} fontSize={10}>estimated total cost melalui node n</text>
      <text x={180} y={68} textAnchor="middle" fill={T.am} fontSize={11} fontWeight={600}>g(n) = biaya aktual</text><text x={300} y={68} fill={T.dim} fontSize={14} textAnchor="middle">+</text><text x={420} y={68} textAnchor="middle" fill={T.pr} fontSize={11} fontWeight={600}>h(n) = estimasi sisa</text></svg>
    <Why>A* gabungkan <strong style={{color:T.am}}>biaya sudah dikeluarkan (g)</strong> + <strong style={{color:T.pr}}>estimasi biaya sisa (h)</strong> = total estimated cost. Ini sweet spot:<br/>• UCS = A* dgn h=0 (hanya lihat g)<br/>• GBFS = A* abaikan g (hanya lihat h)<br/>• <strong style={{color:T.gn}}>A* = yang terbaik dari kedua dunia! Optimal + Complete.</strong></Why>
    <Props items={[{l:"Complete?",v:"Ya ✓",c:T.gn,n:"kondisi tertentu"},{l:"Time",v:"Varies",c:T.am,n:"tergantung h"},{l:"Space",v:"Varies",c:T.am,n:"tergantung h"},{l:"Optimal?",v:"Ya! ✓✓",c:T.gn,n:"jika h admissible"}]}/>
    <div style={{marginTop:10,background:`${T.gn}0a`,border:`1px solid ${T.gn}20`,borderRadius:8,padding:"8px 12px",fontSize:12,color:T.sub}}>✅ Optimal jika h <strong style={{color:T.gn}}>admissible</strong>. Tidak re-explore jika h <strong style={{color:T.gn}}>consistent</strong>.</div>
  </Box>
</div>;

const SimTab=()=><div>
  <H em="🎮">Live Simulator</H>
  <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
    {["BFS","DFS","UCS","GBFS","A*"].map(a=><button key={a} onClick={()=>{setAlgo(a);setSt(0);setPlay(false);}} style={{fontFamily:"monospace",fontSize:12,fontWeight:700,padding:"8px 18px",borderRadius:8,cursor:"pointer",border:`2px solid ${algo===a?T.bl:T.bdr}`,background:algo===a?`${T.bl}15`:"transparent",color:algo===a?T.bl:T.sub}}>{a}</button>)}
  </div>
  <Box s={{marginBottom:14}}><RMap cur={cur.cur} path={cur.path} exp={cur.exp} showH={algo==="GBFS"||algo==="A*"}/></Box>
  <Box s={{marginBottom:14}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span style={{fontFamily:"monospace",fontSize:11,color:T.bl}}>STEP {step+1}/{steps.length}</span>
      <div style={{display:"flex",gap:4}}>
        {[{l:"⏮",fn:()=>{setSt(0);setPlay(false);}},{l:"◀",fn:()=>setSt(s=>Math.max(0,s-1))},{l:play?"⏸":"▶",fn:()=>setPlay(!play),p:true},{l:"▶",fn:()=>setSt(s=>Math.min(steps.length-1,s+1))}].map((b,i)=>
          <button key={i} onClick={b.fn} style={{fontFamily:"monospace",fontSize:13,padding:"6px 12px",borderRadius:6,cursor:"pointer",border:`1px solid ${b.p?T.bl:T.bdr}`,background:b.p?`${T.bl}15`:"transparent",color:b.p?T.bl:T.sub}}>{b.l}</button>)}
      </div>
    </div>
    <div style={{width:"100%",height:4,background:T.code,borderRadius:2,marginBottom:12}}><div style={{height:4,borderRadius:2,background:cur.ph==="goal"?T.gn:T.bl,width:`${((step+1)/Math.max(steps.length,1))*100}%`,transition:"width 0.3s"}}/></div>
    <div style={{background:cur.ph==="goal"?`${T.gn}0c`:`${T.bl}06`,borderRadius:10,padding:14,border:`1px solid ${cur.ph==="goal"?`${T.gn}22`:T.bdr}`}}>
      <div style={{fontSize:14,color:cur.ph==="goal"?T.gn:T.tx,fontWeight:600}}>{cur.msg||"Pilih algoritma & tekan Play"}</div>
      {cur.path&&<div style={{fontFamily:"monospace",fontSize:11,color:T.bl,marginTop:8}}>Path: {cur.path.join(" → ")}{cur.cost!=null&&<span style={{color:T.am}}> (cost: {cur.cost})</span>}</div>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
      {[{l:"FRONTIER",c:T.bl,d:cur.f},{l:"EXPLORED",c:T.gn,d:cur.exp}].map((x,i)=><div key={i} style={{background:T.code,borderRadius:8,padding:10}}>
        <div style={{fontFamily:"monospace",fontSize:9,color:x.c,marginBottom:4}}>{x.l} ({(x.d||[]).length})</div>
        <div style={{fontFamily:"monospace",fontSize:9,color:T.sub,lineHeight:1.8,maxHeight:90,overflow:"auto",wordBreak:"break-all"}}>{(x.d||[]).join(", ")||"empty"}</div>
      </div>)}
    </div>
  </Box>
</div>;

const CompareTab=()=><div>
  <H em="📊">Rangkuman</H>
  <Box s={{marginBottom:16,overflowX:"auto"}}>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.bl,letterSpacing:2,marginBottom:12}}>TABEL PERBANDINGAN</div>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}><thead><tr style={{borderBottom:`2px solid ${T.bdr}`}}>{["","BFS","DFS","UCS","IDS","GBFS","A*"].map((h,i)=><th key={i} style={{padding:"8px 6px",textAlign:"center",color:i?T.bl:T.sub,fontFamily:"monospace",fontSize:10,fontWeight:700}}>{h}</th>)}</tr></thead>
      <tbody>{[{l:"Frontier",v:["Queue","Stack","PQ(g)","Stk+lim","PQ(h)","PQ(g+h)"]},{l:"Complete?",v:["+Ya*","-Tidak**","+Ya","+Ya","-Tidak","+Ya***"]},{l:"Time",v:["O(bᵈ)","O(bᵐ)","O(b^⌊C*/ε⌋)","O(bᵈ)","O(bᵐ)","Varies"]},{l:"Space",v:["O(bᵈ)","O(bm)","O(b^⌊C*/ε⌋)","O(bd)","O(bᵐ)","Varies"]},{l:"Optimal?",v:["~=cost","-Tidak","+Ya!","~=cost","-Tidak","+Ya!"]},{l:"Pakai h?",v:["Tidak","Tidak","Tidak","Tidak","+Ya","+Ya"]}].map((r,i)=><tr key={i} style={{borderBottom:`1px solid ${T.bdr}`}}><td style={{padding:"8px 6px",fontFamily:"monospace",fontSize:9,color:T.sub,fontWeight:700}}>{r.l}</td>{r.v.map((v,j)=>{const cl=v.replace(/^[+\-~]/,"");const c=v[0]==="+"?T.gn:v[0]==="-"?T.rd:v[0]==="~"?T.am:T.tx;return <td key={j} style={{padding:"8px 6px",textAlign:"center",fontFamily:"monospace",fontSize:10,fontWeight:600,color:c}}>{cl}</td>;})}</tr>)}</tbody></table>
    <div style={{fontSize:10,color:T.sub,marginTop:8}}>* b finite | ** bisa jika m bounded + explored | *** finite states</div>
  </Box>
  <Box s={{marginBottom:16}}>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.am,letterSpacing:2,marginBottom:12}}>KAPAN PAKAI APA?</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
      {[{a:"BFS",w:"Step cost sama, goal dangkal",em:"📋",c:T.bl},{a:"DFS",w:"Memori terbatas, banyak solusi",em:"📚",c:T.rd},{a:"UCS",w:"Cost beda, butuh optimal",em:"⚖️",c:T.am},{a:"IDS",w:"Space besar, depth unknown — BEST blind!",em:"🔄",c:T.gn},{a:"GBFS",w:"Butuh cepat, optimal ga penting",em:"🏃",c:T.pr},{a:"A*",w:"Butuh optimal + heuristic bagus — BEST!",em:"⭐",c:T.bl}].map((x,i)=>
        <div key={i} style={{background:T.code,borderRadius:8,padding:12}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:16}}>{x.em}</span><span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:x.c}}>{x.a}</span></div><div style={{fontSize:11,color:T.sub,lineHeight:1.5}}>{x.w}</div></div>)}
    </div>
  </Box>
  <Box s={{marginBottom:16}}>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.pr,letterSpacing:2,marginBottom:12}}>RUMUS PENTING</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      {[{f:"f(n) = g(n) + h(n)",d:"A*: total estimated cost",c:T.bl},{f:"0 ≤ h(n) ≤ h*(n)",d:"Admissible: never overestimate",c:T.gn},{f:"h(n) ≤ c(n,a,n') + h(n')",d:"Consistent: triangle inequality",c:T.cy},{f:"PathCost = Σ ActCost",d:"Total biaya sepanjang path",c:T.am}].map((r,i)=>
        <div key={i} style={{background:T.code,borderRadius:8,padding:12,borderLeft:`3px solid ${r.c}`}}><div style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:r.c,marginBottom:4}}>{r.f}</div><div style={{fontSize:11,color:T.sub}}>{r.d}</div></div>)}
    </div>
  </Box>
  <Box>
    <div style={{fontFamily:"monospace",fontSize:10,color:T.rd,letterSpacing:2,marginBottom:12}}>⚠️ JEBAKAN UTS</div>
    {[{t:"UCS = A* dengan h(n)=0",d:"Tanpa heuristic, A* jadi UCS"},{t:"BFS optimal HANYA jika step cost SAMA",d:"Cost beda? Pakai UCS!"},{t:"DFS bisa INFINITE LOOP",d:"Tanpa explored set di graph dgn cycle"},{t:"IDS Time = O(bᵈ) — SAMA dgn BFS",d:"Overhead pengulangan cuma ~11%"},{t:"GBFS TIDAK optimal & TIDAK complete",d:"Nama 'best-first' menipu — dia cuma greedy"},{t:"Consistent → Admissible, BUKAN sebaliknya",d:"Consistent lebih ketat"},{t:"b ≠ d ≠ m",d:"b=branching, d=depth goal, m=max depth tree"},{t:"h₂(Manhattan) ≥ h₁(misplaced) selalu",d:"Keduanya admissible, h₂ lebih informatif"}].map((x,i)=>
      <div key={i} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:i<7?`1px solid ${T.bdr}`:"none"}}>
        <div style={{minWidth:24,height:24,borderRadius:6,background:`${T.rd}15`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace",fontSize:11,fontWeight:700,color:T.rd,flexShrink:0}}>{i+1}</div>
        <div><div style={{fontSize:13,fontWeight:700,color:T.tx,marginBottom:2}}>{x.t}</div><div style={{fontSize:12,color:T.sub}}>{x.d}</div></div>
      </div>)}
  </Box>
</div>;

const TABS=[{id:"overview",l:"Overview",e:"🗺"},{id:"concepts",l:"Konsep",e:"🧩"},{id:"uninformed",l:"Uninformed",e:"🔍"},{id:"informed",l:"Informed",e:"🧠"},{id:"sim",l:"Simulator",e:"🎮"},{id:"compare",l:"Rangkuman",e:"📊"}];
const tabs={overview:<OverviewTab/>,concepts:<ConceptsTab/>,uninformed:<UninformedTab/>,informed:<InformedTab/>,sim:<SimTab/>,compare:<CompareTab/>};

return <div style={{minHeight:"100vh",background:T.bg,color:T.tx,fontFamily:"system-ui,-apple-system,sans-serif",transition:"background 0.3s,color 0.3s"}}>
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.bdr};border-radius:3px}button:hover{filter:brightness(1.1)}strong{color:${T.tx}}`}</style>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",borderBottom:`1px solid ${T.bdr}`,position:"sticky",top:0,zIndex:100,background:`${T.bg}ee`,backdropFilter:"blur(16px)"}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>🔍 Search</span><Tag c={T.bl}>Materi 02</Tag></div>
    <button onClick={()=>setDk(!dk)} style={{width:44,height:24,borderRadius:12,border:`1px solid ${T.bdr}`,background:dk?T.bl:T.bg2,cursor:"pointer",position:"relative",transition:"all 0.3s"}}><div style={{width:18,height:18,borderRadius:9,background:dk?T.bg:T.card,position:"absolute",top:2,left:dk?23:2,transition:"all 0.3s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,boxShadow:"0 1px 3px #0002"}}>{dk?"🌙":"☀️"}</div></button>
  </div>
  <div style={{display:"flex",gap:2,padding:"10px 20px",overflowX:"auto",borderBottom:`1px solid ${T.bdr}`}}>
    {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{fontSize:12,fontWeight:tab===t.id?700:500,padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",background:tab===t.id?`${T.bl}12`:"transparent",color:tab===t.id?T.bl:T.sub,whiteSpace:"nowrap",transition:"all 0.2s"}}>{t.e} {t.l}</button>)}
  </div>
  <div style={{maxWidth:780,margin:"0 auto",padding:"24px 20px 80px"}}>{tabs[tab]}</div>
</div>;
}
