// ---- PASTE YOUR FIREBASE CONFIG HERE (see README.md) to turn on live shared chat & Google login ----
const CFG={};
const OWNER='dapidran9@gmail.com';
const LIVE=!!CFG.apiKey&&typeof firebase!=='undefined';
const TERMS=['Term 1','Term 2','Term 3'];
const SUBJECTS=[
{n:'General Mathematics',i:'➗',c:'#2a7f8e'},{n:'Pre-Calculus',i:'📐',c:'#6a5acd'},{n:'Earth & Life Science',i:'🌍',c:'#3f8f6b'},
{n:'Computer Programming (ITIS)',i:'💻',c:'#e9a23b'},{n:'Oral Communication',i:'🗣️',c:'#d9644a'},{n:'Reading & Writing',i:'✍️',c:'#b5487f'},
{n:'Physical Education',i:'🏃',c:'#4a86c5'},{n:'Contemporary Philippine Arts',i:'🎨',c:'#8a6a3f'}];
const db={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const me=()=>db.get('me',null),isOwner=()=>me()&&me().email===OWNER;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let fs,auth;
const S={
 init(){if(LIVE){firebase.initializeApp(CFG);fs=firebase.firestore();auth=firebase.auth()}},
 add(c,o){o.ts=Date.now();if(LIVE)return fs.collection(c).add(o);const a=db.get(c,[]);o.id='i'+Date.now()+Math.random();a.push(o);db.set(c,a);dispatchEvent(new Event('l-'+c));return Promise.resolve()},
 watch(c,cb){if(LIVE)return fs.collection(c).orderBy('ts').onSnapshot(s=>cb(s.docs.map(d=>({id:d.id,...d.data()}))));const f=()=>cb(db.get(c,[]));f();addEventListener('l-'+c,f);addEventListener('storage',e=>e.key==c&&f())},
 upd(c,id,p){if(LIVE)return fs.collection(c).doc(id).update(p);db.set(c,db.get(c,[]).map(x=>x.id==id?{...x,...p}:x));dispatchEvent(new Event('l-'+c))},
 del(c,id){if(LIVE)return fs.collection(c).doc(id).delete();db.set(c,db.get(c,[]).filter(x=>x.id!=id));dispatchEvent(new Event('l-'+c))}};
function finish(name,email){email=(email||'').toLowerCase();db.set('me',{name,email});S.add('logins',{name,email:email||'—',at:new Date().toLocaleString()});location.href='index.html'}
async function googleLogin(){
 try{if(LIVE){const r=await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());return finish(r.user.displayName,r.user.email)}
 const e=(prompt('Google Sign-In (demo mode): enter your Gmail')||'').trim().toLowerCase();if(!e)return;
 if(!/^[^@\s]+@gmail\.com$/.test(e))return alert('Please use a valid Gmail address.');finish(e.split('@')[0],e)}catch(x){alert('Sign-in failed: '+x.message)}}
async function createAccount(name,email){
 name=name.trim();email=email.trim().toLowerCase();
 if(email){if(!/^[^@\s]+@gmail\.com$/.test(email))return'Only Gmail addresses are accepted (example: name@gmail.com).';if(!name)name=email.split('@')[0]}
 else if(name.split(/\s+/).length<2)return'No Gmail? Then enter your full name (first and last).';
 if(LIVE)try{await auth.signInAnonymously()}catch(x){return'Enable Anonymous sign-in in Firebase. '+x.message}
 finish(name,email);return''}
function logout(){if(LIVE)auth.signOut();localStorage.removeItem('me');location.href='login.html'}
function boot(page,fn){S.init();if(!me()){location.href='login.html';return}
 const L=[['index.html','🏠 Dashboard'],['subjects.html','📚 Subjects'],['chat.html','💬 Class Chat']];if(isOwner())L.push(['admin.html','🛡️ Owner Panel']);
 document.body.insertAdjacentHTML('afterbegin',`<aside><a href="index.html" style="padding:0"><img src="logo.svg" alt="G11 STEM ITIS A1"></a>${L.map(l=>`<a href="${l[0]}" class="${l[0]==page?'on':''}">${l[1]}</a>`).join('')}<div class="me">${esc(me().name)}${isOwner()?' · Owner':''}${LIVE?'':'<br>⚠ Demo mode (local only)'}<br><a href="#" onclick="logout();return false" style="padding:6px 0">Log out</a></div></aside>`);
 const m=document.querySelector('main');fn(m)}
const lessonCard=l=>`<div class="card" style="margin:8px 0"><span class="chip">${esc(l.t)}</span><h3>${esc(l.ti)}</h3><p style="white-space:pre-wrap;margin:.3em 0">${esc(l.tx)}</p>${l.link?`<a href="${esc(l.link)}" target="_blank" rel="noopener">🔗 Open link</a>`:''}${l.im?`<img class="n" src="${l.im}">`:''}<br><small style="color:var(--mute)">by ${esc(l.by)}</small>${canDel(l)?`<br><button class="no sm" onclick="delLesson('${l.id}')">🗑 Delete</button>`:''}</div>`;
const canDel=l=>isOwner()||l.k==(me().email||me().name);
function delLesson(id){if(confirm('Delete this lesson? This cannot be undone.'))S.del('lessons',id)}
