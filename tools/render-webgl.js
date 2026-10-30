const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('E',e.message));
await p.goto('file://'+__dirname+'/anim.html');fs.mkdirSync(__dirname+'/f',{recursive:true});
const FPS=30,A=+process.argv[2],N=+process.argv[3];for(let i=A;i<N;i++){const fn=__dirname+"/f/"+String(i).padStart(4,"0")+".jpg";
const u=await p.evaluate((t)=>{draw(t);return document.getElementById('c').toDataURL('image/jpeg',0.95)},i/FPS);
fs.writeFileSync(fn,Buffer.from(u.split(',')[1],'base64'));if(i%50==0)console.log(i,new Date().toISOString());}
await b.close();console.log('DONE');})();
