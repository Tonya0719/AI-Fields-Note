import { readFileSync, existsSync } from "node:fs";
const argv = process.argv.slice(2);
const today = new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:"Asia/Shanghai"}).format(new Date());
const index=JSON.parse(readFileSync("content/index.json","utf8")).issues;
const records=new Map(index.map(x=>[x.date.replaceAll(".","-"),x]));
const options={from:null,to:null};
for(let i=0;i<argv.length;i+=2){
  if(!["--from","--to"].includes(argv[i]) || !/^\d{4}-\d{2}-\d{2}$/.test(argv[i+1]??"")) throw Error("Expected --from YYYY-MM-DD or --to YYYY-MM-DD");
  const v=argv[i+1],d=new Date(v+"T00:00:00Z");
  if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==v)throw Error("Invalid calendar date: "+v);
  options[argv[i].slice(2)]=v;
}
const end=options.to??today;
const latest=[...records.keys()].sort().at(-1);
const start=options.from??(latest&&latest<end?latest:end);
if(start>end)throw Error("--from exceeds --to");
let rows=[];
for(let d=new Date(start+"T00:00:00Z");d.toISOString().slice(0,10)<=end;d.setUTCDate(d.getUTCDate()+1)){
  const date=d.toISOString().slice(0,10), r=records.get(date);
  rows.push({date,indexed:r?.issue??null,source:existsSync("content/sources/"+date+".md"),json:existsSync("content/issues/"+date+".json"),recovery:existsSync("content/recovery/"+date+".md"),contentHash:r?.contentHash??null});
}
console.log(JSON.stringify({timezone:"Asia/Shanghai",from:start,to:end,latestIndexed:latest,dates:rows},null,2));
