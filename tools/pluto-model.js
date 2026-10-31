// Pluto + Neptune heliocentric model (in-plane, orbit tilt ignored). Elements: NASA NSSDC Pluto fact sheet (J2000 mean elements),
// JPL "Approximate Positions of the Planets" Table 1 for Neptune. Units: AU, years.
(function(G){
const d2r=Math.PI/180;
function kep(M,e){let E=M;for(let i=0;i<40;i++)E-=(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));return E}
function pos(y,a,e,L0,rate,w){const T=(y-2000)/100;const M=((L0+rate*T)-w)*d2r;const E=kep(M,e);
 const nu=2*Math.atan2(Math.sqrt(1+e)*Math.sin(E/2),Math.sqrt(1-e)*Math.cos(E/2));return {r:a*(1-e*Math.cos(E)),lon:w*d2r+nu}}
const PL={a:39.48168677,e:0.24880766,L0:238.92881,rate:36000/247.94,w:224.06676};
const NE={a:30.06992276,e:0.00859048,L0:-55.12002969,rate:218.45945325,w:44.96476227};
G.PLUTO=y=>pos(y,PL.a,PL.e,PL.L0,PL.rate,PL.w);G.NEPTUNE=y=>pos(y,NE.a,NE.e,NE.L0,NE.rate,NE.w);G.PL=PL;G.NE=NE;
G.Y0=1930.13;G.YNOW=2026.83;G.PER=247.94;G.Y1=G.Y0+G.PER; // 18 Feb 1930 discovery; 31 Oct 2026; 2178.07
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));const eio=t=>{t=cl(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
// first segment: monotone cubic through keyframes, slow while Pluto is inside Neptune's distance (1979-1999)
const KT=[1.0,7.0,10.6,13],KY=[G.Y0,1979.0,1999.2,G.YNOW];
const sl=[];{const d=[];for(let i=0;i<3;i++)d.push((KY[i+1]-KY[i])/(KT[i+1]-KT[i]));sl[0]=0;sl[3]=0;for(let i=1;i<3;i++)sl[i]=(d[i-1]*d[i]<=0)?0:2/(1/d[i-1]+1/d[i]);}
function seg1(t){let i=0;while(i<2&&t>KT[i+1])i++;const h=KT[i+1]-KT[i],u=(t-KT[i])/h,u2=u*u,u3=u2*u;
 return (2*u3-3*u2+1)*KY[i]+(u3-2*u2+u)*h*sl[i]+(-2*u3+3*u2)*KY[i+1]+(u3-u2)*h*sl[i+1];}
G.YEAR=t=>t<1.0?G.Y0:t<13?seg1(t):t<17?G.YNOW:t<23.5?G.YNOW+(G.Y1-G.YNOW)*eio((t-17)/6.5):G.Y1;
G.cl=cl;G.eio=eio;
})(typeof window!=='undefined'?window:global);
