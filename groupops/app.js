(()=>{
'use strict';
const KEY='groupops_demo_actions_v1';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':'&quot;');
let actions=[];
try{actions=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){actions=[]}
const detail={
 'sol-import':{sev:'RED',title:'Solar landed-cost drift',area:'Solar Import · SOL-CN-2409',exposure:'Rs 4.80m',owner:'Commercial Head + Procurement',why:'Synthetic FX basis and freight changed after dealer quotations were issued. Three quotations now fall below the configured target margin.',evidence:['PO value and supplier invoice','Freight estimate revision','Synthetic FX basis 278 → 284 PKR/USD','Three dealer quotations using old landed cost'],next:'Reprice/approve exception before commitment; no autonomous price change.'},
 'led-credit':{sev:'RED',title:'Dealer credit exposure above limit',area:'LED Wholesale · Dealer M-12',exposure:'Rs 2.20m',owner:'Finance Head',why:'Outstanding is Rs 5.2m against a configured Rs 3.0m credit limit while a new Rs 6.8m order awaits dispatch.',evidence:['Dealer ledger snapshot','Approved credit profile','Open sales order','Ageing summary'],next:'Authorized human decides hold, partial release or revised terms.'},
 'led-qc':{sev:'RED',title:'LED batch QC hold',area:'LED Import · Batch LED-CN-77',exposure:'Rs 1.05m',owner:'QC + Procurement',why:'Synthetic incoming sample found driver failures above the configured acceptance threshold. Batch remains quarantined before wholesale dispatch.',evidence:['Incoming inspection sheet','Sample failure log','Supplier batch reference','Warehouse quarantine record'],next:'Expand inspection or open supplier claim before release.'},
 'sol-performance':{sev:'AMBER',title:'Owned solar site below baseline',area:'Solar O&M · Site S-04',exposure:'Rs 402k',owner:'O&M Lead',why:'Weather-adjusted production is 18% below the synthetic baseline; inverter availability is 92.8% with one downtime event.',evidence:['Inverter event summary','Expected vs actual generation','String/MPPT review queue','Maintenance history'],next:'Technical team reviews inverter/string cause and records corrective evidence.'},
 'fuel-hsd':{sev:'AMBER',title:'HSD closing stock variance',area:'Petrol · Fuel Site 07',exposure:'Rs 173,030',owner:'Manager 07',why:'Expected close 20,625 L versus physical close 20,020 L creates a 605 L negative variance.',evidence:['Opening stock','Delivery record','Nozzle meter sales','Physical tank close'],next:'Manager response + evidence; owner closes only after review.'},
 'fuel-cash':{sev:'AMBER',title:'Deposit below expected cash',area:'Petrol · Fuel Site 14',exposure:'Rs 85,000',owner:'Finance + Manager 14',why:'Verified synthetic deposit is below expected shift cash.',evidence:['Shift settlement','Synthetic deposit slip','Card settlement','Cash expectation'],next:'Finance reconciles and records accountable resolution.'}
};
function persist(){localStorage.setItem(KEY,JSON.stringify(actions))}
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__gToast);window.__gToast=setTimeout(()=>t.classList.remove('show'),1500)}
function showView(name){
  $$('.view').forEach(v=>v.hidden=v.dataset.viewName!==name);
  $$('[data-view-target]').forEach(b=>b.classList.toggle('active',b.dataset.viewTarget===name));
  window.scrollTo?.({top:0,behavior:'smooth'});
}
function showSegment(spec){
  const [module,segment]=spec.split(':');
  $$('[data-subview]').forEach(v=>{if(v.dataset.module===module)v.hidden=v.dataset.segmentName!==segment});
  $$('[data-segment]').forEach(b=>{const [m,s]=(b.dataset.segment||'').split(':');if(m===module)b.classList.toggle('active',s===segment)});
}
function closeDrawer(){$('#drawer').classList.remove('show');$('#backdrop').classList.remove('show');$('#drawer').setAttribute('aria-hidden','true')}
function record(id,label){actions.unshift({at:new Date().toLocaleString('en-PK'),id,label});actions=actions.slice(0,20);persist();renderAudit();toast(label)}
function openDetail(id){
  const d=detail[id];if(!d)return;
  $('#drawerBody').innerHTML=`<b class="sev ${esc(d.sev)}">${esc(d.sev)}</b><p class="meta">${esc(d.area)}</p><h2>${esc(d.title)}</h2><div class="detailgrid"><div><span>Exposure</span><b>${esc(d.exposure)}</b></div><div><span>Accountable role</span><b>${esc(d.owner)}</b></div></div><h3>Why this exists</h3><div class="notice">${esc(d.why)}</div><h3>Evidence</h3><div class="evidence">${d.evidence.map(x=>`<div>✓ ${esc(x)}</div>`).join('')}</div><h3>Required next step</h3><div class="notice">${esc(d.next)}</div><div class="actions"><button class="primary" data-action="Reviewed">Mark reviewed</button><button data-action="Response requested">Request response</button><button class="danger" data-action="Resolved in demo">Resolve demo</button></div><p class="meta">Synthetic demo only. No external message, dispatch, payment, pricing or financial action is executed.</p>`;
  $$('[data-action]').forEach(b=>b.onclick=()=>record(id,b.dataset.action));
  $('#drawer').classList.add('show');$('#backdrop').classList.add('show');$('#drawer').setAttribute('aria-hidden','false');
}
function renderAudit(){
  const el=$('#auditList');if(!el)return;
  el.innerHTML=actions.length?actions.map(a=>`<div><b>${esc(a.label)} · ${esc(a.id)}</b><small>${esc(a.at)} · Owner demo action</small></div>`).join(''):'<div><b>No owner actions yet</b><small>Open an exception and mark reviewed/request/resolve to populate this synthetic audit.</small></div>';
}
$$('[data-view-target]').forEach(b=>b.onclick=()=>showView(b.dataset.viewTarget));
$$('[data-segment]').forEach(b=>b.onclick=()=>showSegment(b.dataset.segment));
$$('[data-open]').forEach(b=>b.onclick=()=>openDetail(b.dataset.open));
$('#closeDrawer').onclick=closeDrawer;$('#backdrop').onclick=closeDrawer;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
renderAudit();showView('owner');
})();