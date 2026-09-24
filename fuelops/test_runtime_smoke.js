const fs=require('fs'),vm=require('vm'),assert=require('assert');
function el(dataset={}){
  return {
    dataset,
    value:'',
    innerHTML:'',
    textContent:'',
    style:{},
    className:'',
    onclick:null,
    oninput:null,
    classList:{add(){},remove(){},toggle(){}},
    setAttribute(){},
    scrollIntoView(){}
  };
}
const one={};
['#kpis','#brief','#exceptions','#sitesBody','#auditBody','#search','#backdrop','#reset','#toast','#attention','#drawer','#drawerHead','#drawerBody'].forEach(k=>one[k]=el());
const lists={
  '.filter':[el({filter:'ALL'}),el({filter:'RED'}),el({filter:'AMBER'})],
  '[data-go]':[el({go:'today'}),el({go:'sites'}),el({go:'divisions'}),el({go:'audit'})],
  '[data-pulse]':[el({pulse:'fuel'}),el({pulse:'solar'}),el({pulse:'projects'})],
  '.ex':[]
};
const document={
  body:{style:{}},
  querySelector:s=>one[s]||el(),
  querySelectorAll:s=>lists[s]||[],
  addEventListener(){}
};
const store={};
const context={
  console,document,Intl,Date,Set,Array,JSON,Math,
  localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]},
  confirm:()=>true,
  setTimeout:()=>1,clearTimeout(){},
};
context.window=context;context.self=context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(__dirname+'/logic.js','utf8'),context,{filename:'logic.js'});
vm.runInContext(fs.readFileSync(__dirname+'/app.js','utf8'),context,{filename:'app.js'});
assert.ok(one['#kpis'].innerHTML.includes('Network sales'),'KPIs did not render');
assert.ok(one['#brief'].textContent.length>0,'Morning brief did not render');
assert.ok(one['#sitesBody'].innerHTML.includes('Fuel Site 01'),'Site rows did not render');
assert.equal(typeof lists['.filter'][0].onclick,'function','Filter handler missing');
assert.equal(typeof lists['[data-go]'][0].onclick,'function','Nav handler missing');
assert.equal(typeof lists['[data-pulse]'][0].onclick,'function','Division handler missing');
console.log('PASS FuelOps browser startup smoke');
