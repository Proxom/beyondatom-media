// Voyager 1 "one light-day" scene model. Light-travel times: NASA Moon fact sheet (384,400 km), NASA Voyager 1 light-day page
// (Sun 8 min 20 s, Neptune avg 4 h 10 min, one light-day = 25,902,068,356 km = 24 h), c = 299,792.458 km/s (exact).
(function(G){
const C=299792.458,MOON=384400/C,SUN=500,NEP=15000,V1=86400;
const LM=Math.log10(MOON),LS=Math.log10(SUN),LN=Math.log10(NEP),LV=Math.log10(V1),L0=-0.70;
// keyframes [t, L=log10(seconds of light travel)]; segments ease in/out, segment 0 eases out only (already in motion at t=0)
const K=[[0,L0],[3.6,LM],[5.2,LM],[10.4,LS],[12.4,LS],[17.4,LN],[19.6,LN],[24.0,LV],[30.5,LV]];
function Lof(t){if(t<=0)return L0;for(let i=1;i<K.length;i++){if(t<=K[i][0]){const a=K[i-1],b=K[i];const u=(t-a[0])/(b[0]-a[0]);
 const e=i===1?1-(1-u)*(1-u):u*u*(3-2*u);return a[1]+(b[1]-a[1])*e}}return LV}
G.VM={C,MOON,SUN,NEP,V1,LM,LS,LN,LV,L0,Lof,K,
 TICKS:[[0,'1 s'],[1,'10 s'],[Math.log10(60),'1 min'],[Math.log10(600),'10 min'],[Math.log10(3600),'1 hour'],[Math.log10(36000),'10 hours'],[LV,'1 day']]};
})(typeof window!=='undefined'?window:global);
