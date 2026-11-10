// usage: node check-text-zones.js <scene> <durationSec>  (prints every text box outside the safe area; {} = clean)
// records every fillText bounding box over sampled times; prints any that leave the safe area
const {chromium}=require('playwright');const v=process.argv[2],D=+process.argv[3];
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('E',e.message));
await p.goto('file://'+__dirname+'/p_'+v+'.html');await p.waitForFunction('window.TEXREADY===true');
const bad=await p.evaluate((D)=>{const ctx=document.getElementById('c').getContext('2d');const of=ctx.fillText.bind(ctx);const B={};
 ctx.fillText=function(s,px,py){const m=ctx.measureText(s);const tr=ctx.getTransform();const X=tr.a*px+tr.e,Y=tr.d*py+tr.f;const w=m.width*tr.a;
  let x0=ctx.textAlign==='center'?X-w/2:ctx.textAlign==='right'?X-w:X;const x1=x0+w;const sz=parseInt((ctx.font.match(/(\d+)px/)||[0,0])[1]);
  if(ctx.globalAlpha>0.05&&(x0<60||x1>930||Y-sz<320||Y>1440)){const k=s;if(!B[k])B[k]=[Math.round(x0),Math.round(x1),Math.round(Y),sz];}
  return of(s,px,py);};
 for(let t=0;t<D;t+=0.1)draw(t);return B;},D);
console.log(JSON.stringify(bad,null,0));await b.close()})();
