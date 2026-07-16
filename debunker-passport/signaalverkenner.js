const clusters = [
  {id:'SC-041',n:'01',type:'proximity',title:'Langdurige nabijheid bij lage snelheid',window:'03:42–05:18',objects:'2 vaartuigen',status:'review',statusLabel:'Bronvergelijking nodig',x:650,y:302,description:'Twee synthetische vaartuigen bleven 96 minuten binnen 120 meter en voeren beide langzamer dan 1,5 knoop.',alternative:'Geplande bunkerlevering, loods- of sleepdienst, wachten op een ligplaats of een andere reguliere servicehandeling.',sources:'Havenaanloop, ligplaatsplanning, bunker delivery note, MFM-log, VHF/agentregistratie en terminaljournaal.',case:true},
  {id:'SC-017',n:'02',type:'gap',title:'AIS-onderbreking nabij terminalzone',window:'00:48–01:21',objects:'1 vaartuig',status:'alternative',statusLabel:'Alternatief waarschijnlijk',x:908,y:206,description:'Een positiecontinuïteit van 33 minuten ontbreekt nabij een terminalzone.',alternative:'Ontvangstverlies, onderhoud aan boord, dekking of foutieve filtering in de bronfeed.',sources:'Tweede AIS-provider, radarspoor, terminalregistratie en onderhoudslog.'},
  {id:'SC-023',n:'03',type:'dwell',title:'Verblijfsduur buiten historisch venster',window:'06:05–09:44',objects:'1 vaartuig',status:'unreviewed',statusLabel:'Nog niet beoordeeld',x:1082,y:388,description:'De synthetische verblijfsduur ligt buiten het gebruikelijke venster voor dit vaartuigtype en deze zone.',alternative:'Congestie, bunkeren, reparatie, wachtopdracht of gewijzigde terminalplanning.',sources:'Ligplaatsplanning, agentbericht, havenbezoek en terminaljournaal.'},
  {id:'SC-028',n:'04',type:'repeat',title:'Herhaald contact in twee havenbekkens',window:'10:12–13:06',objects:'3 vaartuigen',status:'review',statusLabel:'Bronvergelijking nodig',x:455,y:320,description:'Dezelfde combinatie vaartuigen kwam binnen één etmaal tweemaal kort bij elkaar.',alternative:'Gezamenlijke dienstregeling, sleepassistentie, bevoorrading of gedeelde ligplaatswachtrij.',sources:'Port-callgegevens, dienstenorders, agentregistratie en VHF-log.'},
  {id:'SC-032',n:'05',type:'identity',title:'Statische AIS-identiteit gewijzigd',window:'14:02–14:19',objects:'1 vaartuig',status:'unreviewed',statusLabel:'Nog niet beoordeeld',x:562,y:126,description:'Een statisch identificatieveld veranderde binnen hetzelfde havenbezoek.',alternative:'Correctie van invoer, apparatuurwissel, charterwissel of bronnormalisatie.',sources:'Scheepsregister, vorige AIS-berichten, agentdossier en apparatuurlog.'},
  {id:'SC-036',n:'06',type:'proximity',title:'Kort nabijheidsvenster in hoofdvaarweg',window:'16:33–16:48',objects:'2 vaartuigen',status:'alternative',statusLabel:'Alternatief waarschijnlijk',x:244,y:354,description:'Twee sporen kruisten 15 minuten binnen de ingestelde afstandsdrempel.',alternative:'Reguliere passage of oplopen in een drukke vaarweg.',sources:'Koers- en snelheidsverloop, verkeersbeeld en vaarwegcontext.'},
  {id:'SC-052',n:'07',type:'gap',title:'Positiesprong na brononderbreking',window:'19:18–20:04',objects:'1 vaartuig',status:'review',statusLabel:'Bronvergelijking nodig',x:788,y:474,description:'Na een onderbreking hervat het spoor op een positie die niet goed aansluit op de laatst bekende beweging.',alternative:'Datavertraging, samenvoegfout tussen ontvangers of onvolledige satellietdekking.',sources:'Ruwe berichten, ontvangststations, tweede provider en havenradar.'},
  {id:'SC-061',n:'08',type:'dwell',title:'Onverwachte stilstand in aanloopgebied',window:'22:26–23:31',objects:'1 vaartuig',status:'unreviewed',statusLabel:'Nog niet beoordeeld',x:120,y:420,description:'Een vaartuig bleef buiten een ankerzone langer dan de ingestelde contextdrempel vrijwel stil liggen.',alternative:'Verkeersaanwijzing, technische controle, loodswissel of weersomstandigheid.',sources:'VTS-bericht, loodsregistratie, weerdata en scheepsjournaal.'}
];

const trafficLayer=document.getElementById('trafficLayer');
const clusterLayer=document.getElementById('clusterLayer');
const rows=document.getElementById('clusterRows');
const signalFilter=document.getElementById('signalFilter');
const statusFilter=document.getElementById('statusFilter');
let selected=null;

function seeded(index){const x=Math.sin(index*9283.17)*43758.5453;return x-Math.floor(x)}
function waterPoint(index){const band=seeded(index+900);let x=30+seeded(index)*1215;let center=310+55*Math.sin(x/180);let spread=band<.15?210:band<.3?135:95;let y=center+(seeded(index+300)-.5)*spread;if(band<.08){x=480+seeded(index)*280;y=25+seeded(index+100)*185}if(band>.93){x=790+seeded(index)*190;y=440+seeded(index+100)*220}return{x,y}}
for(let i=0;i<186;i++){const p=waterPoint(i);const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',p.x.toFixed(1));c.setAttribute('cy',p.y.toFixed(1));c.setAttribute('r',i%17===0?'3.2':'2');c.setAttribute('class',i%17===0?'traffic major':'traffic');trafficLayer.appendChild(c)}

clusters.forEach(c=>{
  const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','cluster-marker');g.setAttribute('data-id',c.id);g.setAttribute('role','button');g.setAttribute('aria-label',`${c.id}: ${c.title}`);g.innerHTML=`<circle class="ring" cx="${c.x}" cy="${c.y}" r="25"></circle><circle class="core" cx="${c.x}" cy="${c.y}" r="12"></circle><text x="${c.x}" y="${c.y+4}">${c.n}</text>`;g.addEventListener('click',()=>selectCluster(c.id));clusterLayer.appendChild(g);
  const row=document.createElement('button');row.type='button';row.className='cluster-row';row.dataset.id=c.id;row.innerHTML=`<strong>${c.id}</strong><span>${c.title}</span><span>${c.window} UTC</span><span class="status">${c.statusLabel}</span>`;row.addEventListener('click',()=>selectCluster(c.id));rows.appendChild(row)
});

function selectCluster(id){
  const c=clusters.find(item=>item.id===id);if(!c)return;selected=id;
  document.getElementById('clusterCode').textContent=`${c.id} · synthetisch cluster`;
  document.getElementById('clusterTitle').textContent=c.title;
  document.getElementById('clusterDescription').textContent=c.description;
  document.getElementById('clusterFacts').innerHTML=`<div><dt>Regel</dt><dd>${c.type==='gap'?'AIS-onderbreking':c.type==='dwell'?'Verblijfsduur':c.type==='repeat'?'Herhaald contact':c.type==='identity'?'Identiteitswijziging':'Nabijheid + snelheid'}</dd></div><div><dt>Periode</dt><dd>${c.window} UTC</dd></div><div><dt>Objecten</dt><dd>${c.objects}</dd></div><div><dt>Status</dt><dd>${c.statusLabel}</dd></div>`;
  document.getElementById('alternativeText').textContent=c.alternative;document.getElementById('sourcesText').textContent=c.sources;
  document.querySelectorAll('[data-id]').forEach(el=>el.classList.toggle('selected',el.dataset.id===id));
  document.getElementById('caseReviewLink').classList.toggle('is-hidden',!c.case);document.getElementById('caseAvailability').classList.toggle('is-hidden',Boolean(c.case));
}

function applyFilters(){const type=signalFilter.value,status=statusFilter.value;let count=0;clusters.forEach(c=>{const visible=(type==='all'||c.type===type)&&(status==='all'||c.status===status);document.querySelector(`.cluster-marker[data-id="${c.id}"]`).classList.toggle('dimmed',!visible);document.querySelector(`.cluster-row[data-id="${c.id}"]`).classList.toggle('is-hidden',!visible);if(visible)count++});document.getElementById('resultCount').textContent=`${count} cluster${count===1?'':'s'} zichtbaar`}
signalFilter.addEventListener('change',applyFilters);statusFilter.addEventListener('change',applyFilters);selectCluster('SC-041');
