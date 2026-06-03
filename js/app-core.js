// JSOW v9 - Core
function $(id){return document.getElementById(id)}
function lk(c,m,l){return c+'-'+m+'-'+l}
function gp(cid){var co=C.find(function(x){return x.id===cid});if(!co)return 0;var t=0,d=0;co.m.forEach(function(m,mi){m.l.forEach(function(l,li){t++;if(S.progress[lk(cid,mi,li)])d++})});return t?Math.round(d/t*100):0}
function tl(){return Object.values(S.progress).filter(function(v){return v}).length}
function icc(cid){return gp(cid)===100}
function toast(msg){var t=$('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},3000)}
function toggleN(){var d=$('ndd');if(d)d.classList.toggle('sh')}
function showModal(html){var o=$('modal'),b=$('modal-body');if(o&&b){b.innerHTML=html;o.classList.add('show')}}
function closeModal(){var o=$('modal');if(o)o.classList.remove('show')}
function medal(i){if(i===0)return '🥇 ';if(i===1)return '🥈 ';if(i===2)return '🥉 ';return '#'+(i+1)}
document.addEventListener('click',function(e){if(e.target.id==='modal')closeModal()});

// ── LOGIN ──


function togglePw(){var p=document.getElementById('l-pass');if(!p)return;p.type=p.type==='password'?'text':'password'}
function toggleMobileMenu(){var nm=document.getElementById('navlinks');var ov=document.getElementById('mob-overlay');if(nm)nm.classList.toggle('open');if(ov)ov.classList.toggle('show')}
function doLogin(){
  var now=Date.now();
  if(now<lockoutUntil){document.getElementById('l-err').textContent='Too many attempts. Please wait.';return}
  var email=(document.getElementById('l-email')||{}).value||'';
  var pass=(document.getElementById('l-pass')||{}).value||'';
  if(!email||!pass){document.getElementById('l-err').textContent='Please enter email and password';return}
  document.getElementById('l-err').textContent='Signing in...';
  hashPassword(pass).then(function(hash){
    var user=USERS.find(function(u){return u.email===email.toLowerCase().trim()&&u.hash===hash});
    if(!user){loginAttempts++;if(loginAttempts>=MAX_ATTEMPTS){lockoutUntil=Date.now()+(LOCKOUT_SECONDS*1000);document.getElementById('l-err').textContent='Account locked for '+LOCKOUT_SECONDS+'s';loginAttempts=0}else{document.getElementById('l-err').textContent='Invalid email or password ('+loginAttempts+'/'+MAX_ATTEMPTS+')'}return}
    loginAttempts=0;S.user=user;S.role=user.role;S.session={token:Math.random().toString(36).slice(2),expires:Date.now()+(SESSION_HOURS*3600000)};
    saveState();document.getElementById('l-err').textContent='';showApp(user);toast('Welcome, '+user.name+'!');
  }).catch(function(e){console.error(e);document.getElementById('l-err').textContent='Login error'});
}
function showApp(user){
  document.getElementById('login').style.display='none';document.getElementById('topnav').style.display='flex';document.getElementById('mainwrap').style.display='block';
  document.querySelectorAll('.nav-student,.nav-teacher,.nav-admin').forEach(function(el){el.style.display='none'});
  if(user.role==='student'){document.querySelectorAll('.nav-student').forEach(function(el){el.style.display='inline'})}
  else if(user.role==='teacher'){document.querySelectorAll('.nav-teacher').forEach(function(el){el.style.display='inline'})}
  else if(user.role==='admin'){document.querySelectorAll('.nav-admin').forEach(function(el){el.style.display='inline'})}
  document.getElementById('uav').textContent=user.initials;
  if(document.getElementById('wmsg'))document.getElementById('wmsg').textContent='Welcome back, '+user.name.split(' ')[0];
  if(document.getElementById('pn'))document.getElementById('pn').value=user.name;
  if(document.getElementById('pe'))document.getElementById('pe').value=user.email;
  if(user.role==='teacher')go('teach');else if(user.role==='admin')go('admin');else{renderDash();renderCat()}
}
function goHome(){if(S.role==='teacher')go('teach');else if(S.role==='admin')go('admin');else go('dash')}
function doLogout(){S.user=null;S.role=null;S.session=null;saveState();document.getElementById('login').style.display='flex';document.getElementById('topnav').style.display='none';document.getElementById('mainwrap').style.display='none';document.querySelectorAll('.nav-student,.nav-teacher,.nav-admin').forEach(function(el){el.style.display='none'})}
function showRegister(){showModal('<h2>Request Access</h2><p style="color:var(--t2);margin-bottom:16px">Complete the form and our team will create your account within 24 hours.</p><div class="row"><div class="field"><label class="lbl">Full Name</label><input class="inp" placeholder="Your full name"></div><div class="field"><label class="lbl">Email</label><input class="inp" placeholder="your@email.com"></div></div><div class="field"><label class="lbl">Message</label><textarea class="ta" placeholder="Tell us about your wine education goals..."></textarea></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="toast(String.fromCharCode(83,117,98,109,105,116,116,101,100,33));closeModal()">Submit</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function go(pg){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('on')});
  var el=$('pg-'+pg);if(el)el.classList.add('on');
  document.querySelectorAll('.nm a').forEach(function(a){a.classList.remove('on')});
  var nl=$('n-'+pg);if(nl)nl.classList.add('on');
  var d=$('ndd');if(d)d.classList.remove('sh');
  window.scrollTo({top:0,behavior:'smooth'});
  var renders={dash:renderDash,cat:renderCat,journal:renderJournal,certs:renderCerts,gam:renderGam,com:renderCom,prof:renderProf,teach:renderTeach,admin:renderAdmin,cal:renderCal,play:renderPlayer};
  if(renders[pg])renders[pg]();
}

// ── DASHBOARD (clickable stats) ──
function renderDash(){
  if($('d-e'))$('d-e').textContent=S.enrolled.length;
  if($('d-l'))$('d-l').textContent=tl();
  if($('d-p'))$('d-p').textContent=S.points;
  if($('d-s'))$('d-s').textContent=S.streak;
  var dc=$('dc');
  if(dc){
    if(!S.enrolled.length){dc.innerHTML='<div class="card" style="color:var(--t2);padding:30px;text-align:center">No courses enrolled yet. <a onclick="go(\'cat\')">Browse courses →</a></div>';return}
    var h='<div class="ga">';
    S.enrolled.forEach(function(cid){var co=C.find(function(x){return x.id===cid});if(!co)return;var p=gp(cid);
      h+='<div class="card" style="cursor:pointer" onclick="viewCourse('+cid+')">'+
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px"><span style="font-size:26px">'+co.ic+'</span><div><div style="font-weight:600">'+co.t+'</div><div style="font-size:12px;color:var(--t3)">'+co.du+'</div></div></div>'+
        '<div class="prog"><div class="pf2" style="width:'+p+'%"></div></div>'+
        '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--t2);margin-top:4px"><span>'+p+'%</span>'+(icc(cid)?'<span style="color:var(--gn)">✅ Complete</span>':'<span style="color:var(--g)">Continue →</span>')+'</div></div>'});
    dc.innerHTML=h+'</div>';
  }
  var da=$('da');
  if(da){
    var a=[];
    if(tl()>0)a.push('✅ Completed '+tl()+' lesson'+(tl()>1?'s':''));
    if(S.tn.length)a.push('📝 Logged '+S.tn.length+' tasting note'+(S.tn.length>1?'s':''));
    if(S.ub.length)a.push('🏅 Earned '+S.ub.length+' badge'+(S.ub.length>1?'s':''));
    if(S.points)a.push('⭐ '+S.points+' points earned');
    if(S.streak)a.push('🔥 '+S.streak+'-day learning streak');
    if(!a.length)a.push('Start learning to see your activity here!');
    da.innerHTML=a.map(function(x){return '<div class="card" style="margin-bottom:8px;padding:14px 18px;font-size:14px">'+x+'</div>'}).join('');
  }
}

// ── CATALOGUE (no prices, no cart) ──
var catF='all';
function filt(f,el){catF=f;if(el){el.parentElement.querySelectorAll('.btn').forEach(function(b){b.className='btn btn-ghost btn-s'});el.className='btn btn-o btn-s'}renderCat()}
function renderCat(){
  var el=$('cg');if(!el)return;
  var courses=C;
  if(catF!=='all')courses=C.filter(function(c){return c.lv===catF});
  el.innerHTML=courses.map(function(co){
    var en=S.enrolled.includes(co.id);var lc=co.lv==='beginner'?'lvl-b':co.lv==='intermediate'?'lvl-i':'lvl-a';
    var totalL=co.m.reduce(function(s,m){return s+m.l.length},0);
    return '<div class="card" style="padding:0;overflow:hidden">'+
      '<div class="cc-img" style="background:'+co.gr+'"><span style="position:relative;z-index:1">'+co.ic+'</span></div>'+
      '<div class="cc-body">'+
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span class="lvl '+lc+'">'+co.lv+'</span><span style="font-size:11px;color:var(--t3)">⭐ '+co.r+'</span></div>'+
        '<div class="cc-title">'+co.t+'</div>'+
        '<div class="cc-desc">'+co.d+'</div>'+
        '<div class="cc-meta"><span>'+co.st+' students</span><span>'+co.m.length+' modules · '+totalL+' lessons</span></div>'+
        (en?'<button class="btn btn-g btn-w" onclick="viewCourse('+co.id+')">Continue Learning →</button>'
          :'<button class="btn btn-o btn-w" onclick="viewCourse('+co.id+')">View Course</button>')+
      '</div></div>'}).join('');
}

// ── COURSE PLAYER (no video placeholder, notes area) ──

function toggleNotes(){if(!S._notesOpen)S._notesOpen=false;S._notesOpen=!S._notesOpen;var b=$('notes-body');var h=$('notes-toggle');if(b)b.style.display=S._notesOpen?'block':'none';if(h)h.classList.toggle('open',S._notesOpen)}
