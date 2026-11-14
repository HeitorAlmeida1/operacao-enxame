function shootFrom(x,y,ang,spd,o){G.proj.push(Object.assign({x,y,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,r:5,dmg:10,life:1,pierce:0,hit:new Set(),c:'#fff',src:CUR,evo:CURE},o))}
function addZone(z){z.src=z.src||CUR;z.life*=ST.dur;G.zones.push(z)}function addMark(m){m.src=m.src||CUR;G.marks.push(m)}function addTimer(o){o.src=CUR;G.timers.push(o)}
const shoot=(ang,spd,o)=>shootFrom(P.x,P.y,ang,spd,o);
function nearest(max,from=P,skip){let b=null,bd=max*max;for(const e of G.enemies){if(e.dead||e===skip)continue;const d=d2(e,from);if(d<bd){bd=d;b=e}}return b}
function aim(){if(PAD.aim!==null)return PAD.aim;if(manual)return Math.atan2(mouse.y-H/2,mouse.x-W/2);const e=nearest(650);return e?Math.atan2(e.y-P.y,e.x-P.x):P.face}
const auraR=w=>(60+8*w.lvl)*ST.area;
const petMul=()=>P.aug.pets?1.5:1;
function coneHit(a,R,sp,dm,each){let n=0;for(const e of G.enemies){if(e.dead)continue;const dd=Math.sqrt(d2(e,P));if(dd>R+e.r)continue;let df=Math.atan2(e.y-P.y,e.x-P.x)-a;df=Math.atan2(Math.sin(df),Math.cos(df));
  if(sp>=Math.PI||Math.abs(df)<sp||dd<P.r+e.r){damage(e,dm);n++;if(each)each(e)}}return n}
