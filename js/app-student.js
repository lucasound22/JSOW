// JSOW v9 - Student Pages
function renderJournal(){
  var el=$('jnl');if(!el)return;
  if(!S.tn.length){el.innerHTML='<div class="card" style="color:var(--t2);text-align:center;padding:30px">No tasting notes yet.</div>';return}
  el.innerHTML=S.tn.slice().reverse().map(function(n,ri){
    var idx=S.tn.length-1-ri;var stars='★'.repeat(n.rt)+'☆'.repeat(5-n.rt);
    return '<div class="card" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between"><div><strong>'+n.n+'</strong> '+(n.v?'('+n.v+')':'')+'</div><button onclick="delNote('+idx+')" class="btn-ghost" style="color:var(--r)">🗑️</button></div><div style="font-size:12px;color:var(--t3);margin:4px 0">'+(n.g||'')+' '+(n.r?'· '+n.r:'')+' · '+new Date(n.dt).toLocaleDateString('en-AU')+'</div><div style="color:var(--g);margin-bottom:8px">'+stars+'</div>'+(n.a?'<div style="font-size:13px;margin-bottom:4px"><strong style="color:var(--g)">Appearance:</strong> '+n.a+'</div>':'')+(n.no?'<div style="font-size:13px;margin-bottom:4px"><strong style="color:var(--g)">Nose:</strong> '+n.no+'</div>':'')+(n.p?'<div style="font-size:13px;margin-bottom:4px"><strong style="color:var(--g)">Palate:</strong> '+n.p+'</div>':'')+(n.c?'<div style="font-size:13px"><strong style="color:var(--g)">Conclusion:</strong> '+n.c+'</div>':'')+'</div>'}).join('');
}
function saveNote(e){
  e.preventDefault();var g=function(id){return ($('tn-'+id)||{}).value||''};var w=g('n');if(!w){toast('Enter wine name');return}
  S.tn.push({n:w,v:g('v'),g:g('g'),r:g('r'),a:g('a'),no:g('no'),p:g('p'),c:g('c'),rt:parseInt(g('rt'))||4,dt:new Date().toISOString()});
  S.points+=15;saveState();renderJournal();['n','v','g','r','a','no','p','c'].forEach(function(id){var el=$('tn-'+id);if(el)el.value=''});toast('📝 Saved! +15 points');checkBadges();
}
function delNote(i){S.tn.splice(i,1);saveState();renderJournal();toast('Note deleted')}

// ── CERTIFICATES ──
function renderCerts(){
  var el=$('clist');if(!el)return;var done=S.enrolled.filter(function(cid){return icc(cid)});
  if(!done.length){el.innerHTML='<div style="text-align:center;padding:50px"><div style="font-size:52px;margin-bottom:14px">🎓</div><h2 style="font:600 24px var(--hf);color:var(--t)">No Certificates Yet</h2><p style="color:var(--t2);margin-top:8px">Complete all lessons in a course to earn your certificate</p></div>';return}
  el.innerHTML=done.map(function(cid){var co=C.find(function(x){return x.id===cid});if(!co)return '';var code='JSOW-'+String(cid).padStart(3,'0')+'-'+Date.now().toString(36).toUpperCase().slice(-6);var name=(S.user?S.user.name:'Wine Enthusiast');
    return '<div class="cert"><img src="logo.png"><div style="font:300 11px var(--bf);color:var(--t3);text-transform:uppercase;letter-spacing:3px;margin-bottom:6px">Joval School of Wine</div><h2 style="font:700 28px var(--hf);color:var(--g);margin-bottom:14px">Certificate of Completion</h2><p style="font-size:14px;color:var(--t2)">This certifies that</p><h3 style="font:700 26px var(--hf);color:var(--t);margin:10px 0">'+name+'</h3><p style="font-size:14px;color:var(--t2)">has successfully completed</p><h3 style="font:600 20px var(--hf);color:var(--gl);margin:10px 0">'+co.t+'</h3><p style="color:var(--t3);font-size:13px;margin-top:14px">'+new Date().toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})+'</p><div style="margin-top:22px;padding-top:14px;border-top:1px solid rgba(201,168,76,.1);font-size:11px;color:var(--t3)">Hilary Fordham DipWSET — Group Wine Ambassador & Educator<br>Verification: '+code+'</div></div><div style="text-align:center;margin-bottom:28px"><button class="btn btn-g" onclick="window.print()">🖨️ Print Certificate</button></div>'}).join('');
}

// ── GAMIFICATION ──
function renderGam(){
  if($('g-p'))$('g-p').textContent=S.points;if($('g-b'))$('g-b').textContent=S.ub.length;if($('g-s'))$('g-s').textContent=S.streak;
  var jm=$('jmap');
  if(jm)jm.innerHTML=JR.map(function(s){var v=S.enrolled.includes(s.c);return '<div class="card" style="text-align:center;min-width:85px;padding:12px;'+(v?'border-color:var(--gborder);background:rgba(201,168,76,.02)':'opacity:.25')+'"><div style="font-size:24px">'+s.i+'</div><div style="font-size:10px;margin-top:4px;'+(v?'color:var(--g)':'color:var(--t3)')+'">'+s.n+'</div></div>'}).join('');
  var bl=$('blist');
  if(bl)bl.innerHTML=B.map(function(b){var u=S.ub.includes(b.id);return '<div class="card badge-card'+(u?'':' locked')+'"><div style="font-size:34px;margin-bottom:4px">'+b.i+'</div><div style="font-size:12px;font-weight:600">'+b.n+'</div><div style="font-size:10px;color:var(--t3)">'+b.d+'</div>'+(u?'<div style="font-size:9px;color:var(--g);margin-top:3px">✓ UNLOCKED</div>':'')+'</div>'}).join('');
  var lb=$('lbb');
  if(lb){var entries=LB.map(function(e){return e.n==='You'?{n:e.n,p:S.points,b:S.ub.length}:e}).sort(function(a,b){return b.p-a.p});
    lb.innerHTML=entries.map(function(e,i){var me=e.n==='You';return '<tr'+(me?' style="background:rgba(201,168,76,.03);font-weight:600"':'')+'><td>'+medal(i)+'</td><td>'+e.n+(me?' (You)':'')+'</td><td style="color:var(--g)">'+e.p.toLocaleString()+'</td><td>'+e.b+'</td></tr>'}).join('')}
}
function checkBadges(){
  [{id:0,t:function(){return tl()>=1}},{id:1,t:function(){return tl()>=10}},{id:2,t:function(){return S.cq.length>=3}},{id:3,t:function(){return S.tn.length>=5}},{id:4,t:function(){return icc(6)}},{id:5,t:function(){return S.streak>=7}},{id:6,t:function(){return icc(3)}},{id:7,t:function(){return S.points>=1000}},{id:8,t:function(){return C.every(function(c){return icc(c.id)})}},{id:9,t:function(){return S.threads.filter(function(t){return t.a===(S.user?S.user.name:'x')}).length>=10}}].forEach(function(c){if(!S.ub.includes(c.id)&&c.t()){S.ub.push(c.id);var b=B.find(function(x){return x.id===c.id});if(b)toast('🏅 Badge: '+b.n+'!')}});saveState();
}

// ── COMMUNITY ──
function renderCom(){
  var el=$('cth');if(!el)return;
  el.innerHTML=S.threads.map(function(th,i){
    var exp=S.et===th.id;
    var h='<div class="card" style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:start"><div style="cursor:pointer;flex:1" onclick="toggleTh('+th.id+')"><div style="font-weight:600;font-size:15px">'+th.t+'</div><div style="font-size:11px;color:var(--t3);margin-top:2px">'+th.a+' · '+th.dt+' · 👍 '+th.u+' · 💬 '+(th.r||[]).length+'</div></div><button onclick="upvote('+i+')" class="btn-ghost">👍</button></div><p style="font-size:14px;margin-top:8px;line-height:1.6;color:var(--t2)">'+th.b+'</p>';
    if(exp){(th.r||[]).forEach(function(r){h+='<div class="reply"><strong>'+r.a+'</strong> <span style="font-size:11px;color:var(--t3)">'+r.dt+'</span><p style="margin-top:4px">'+r.b+'</p></div>'});h+='<div style="margin-top:10px;display:flex;gap:8px"><input class="inp" id="rpl-'+th.id+'" placeholder="Write a reply..." style="flex:1;padding:8px 12px"><button class="btn btn-g btn-s" onclick="postReply('+th.id+')">Reply</button></div>'}
    return h+'</div>'}).join('');
}
function toggleTh(id){S.et=S.et===id?null:id;renderCom()}
function postTh(){var t=($('ptt')||{}).value||'';var b=($('ppb')||{}).value||'';if(!t||!b){toast('Fill in title and body');return}S.threads.unshift({id:Date.now(),a:S.user?S.user.name:'Student',t:t,b:b,dt:new Date().toISOString().split('T')[0],u:0,r:[]});S.points+=10;saveState();renderCom();if($('ptt'))$('ptt').value='';if($('ppb'))$('ppb').value='';toast('💬 Posted! +10 points');checkBadges()}
function postReply(tid){var inp=document.getElementById('rpl-'+tid);if(!inp||!inp.value.trim())return;var th=S.threads.find(function(t){return t.id===tid});if(!th)return;if(!th.r)th.r=[];th.r.push({a:S.user?S.user.name:'Student',b:inp.value.trim(),dt:new Date().toISOString().split('T')[0]});S.points+=5;saveState();renderCom();toast('Reply posted! +5 pts')}
function upvote(i){S.threads[i].u++;saveState();renderCom()}

// ── PROFILE ──
function renderProf(){
  var pfs=$('pfs'),pfc=$('pfc');
  if(pfs){var stats=[['Enrolled',S.enrolled.length],['Lessons Done',tl()],['Tasting Notes',S.tn.length],['Certificates',S.enrolled.filter(function(c){return icc(c)}).length],['Points',S.points.toLocaleString()],['Streak',S.streak+' days'],['Quizzes Passed',S.cq.length],['Badges',S.ub.length+'/'+B.length]];
    pfs.innerHTML=stats.map(function(s){return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.02);font-size:14px"><span>'+s[0]+'</span><span style="color:var(--g);font-weight:600">'+s[1]+'</span></div>'}).join('')}
  if(pfc){if(!S.enrolled.length){pfc.innerHTML='<p style="color:var(--t2)">No courses yet.</p>';return}
    pfc.innerHTML=S.enrolled.map(function(cid){var co=C.find(function(x){return x.id===cid});if(!co)return '';var p=gp(cid);
      return '<div class="card" style="cursor:pointer" onclick="viewCourse('+cid+')"><div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><span style="font-size:20px">'+co.ic+'</span><span style="font-weight:600">'+co.t+'</span></div><div class="prog"><div class="pf2" style="width:'+p+'%"></div></div><div style="font-size:12px;color:var(--t3);margin-top:4px">'+p+'% complete'+(icc(cid)?' ✅':'')+'</div></div>'}).join('')}
}

// ── CALENDAR ──
function renderCal(){
  var mn=['January','February','March','April','May','June','July','August','September','October','November','December'];
  if($('calt'))$('calt').textContent=mn[S.cm]+' '+S.cy;
  var cd=$('cdays');if(!cd)return;
  var first=new Date(S.cy,S.cm,1).getDay();var days=new Date(S.cy,S.cm+1,0).getDate();var adj=first===0?6:first-1;
  var h='';for(var i=0;i<adj;i++)h+='<div class="cal-day"></div>';
  for(var d=1;d<=days;d++){var ds=S.cy+'-'+String(S.cm+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');var hasEv=S.aEvents.some(function(e){return e.dt===ds});var isToday=d===new Date().getDate()&&S.cm===new Date().getMonth()&&S.cy===new Date().getFullYear();h+='<div class="cal-day'+(isToday?' today':'')+(hasEv?' has-ev':'')+'">'+d+'</div>'}
  cd.innerHTML=h;
  var cev=$('cev');if(!cev)return;
  var mev=S.aEvents.filter(function(e){var dd=new Date(e.dt);return dd.getMonth()===S.cm&&dd.getFullYear()===S.cy});
  if(!mev.length){cev.innerHTML='<p style="color:var(--t3)">No events this month.</p>';return}
  cev.innerHTML=mev.map(function(e){var emoji={exam:'📝',masterclass:'🎓',tasting:'🍷',workshop:'📚'}[e.ty]||'📅';return '<div class="card" style="margin-bottom:10px;display:flex;gap:14px;align-items:start"><div style="text-align:center;min-width:50px"><div style="font-size:20px">'+emoji+'</div><div style="font-size:10px;color:var(--g);margin-top:2px">'+new Date(e.dt).toLocaleDateString('en-AU',{day:'numeric',month:'short'})+'</div></div><div style="flex:1"><div style="font-weight:600;font-size:14px">'+e.t+'</div><div style="font-size:12px;color:var(--t2);margin-top:2px">'+e.d+'</div><div style="font-size:11px;color:var(--t3);margin-top:2px">📍 '+e.l+'</div></div></div>'}).join('');
}
function chMo(d){S.cm+=d;if(S.cm>11){S.cm=0;S.cy++}else if(S.cm<0){S.cm=11;S.cy--}saveState();renderCal()}

// ── SEARCH ──
function doSearch(q){
  if(!q||!q.trim())return;q=q.toLowerCase().trim();go('search');
  if($('sq'))$('sq').textContent='Results for "'+q+'"';
  var res=[];
  C.forEach(function(co){if(co.t.toLowerCase().includes(q)||co.d.toLowerCase().includes(q))res.push({type:'Course',title:co.t,desc:co.d,action:'viewCourse('+co.id+')'});
    co.m.forEach(function(m){m.l.forEach(function(l){if(l.n.toLowerCase().includes(q)||l.c.toLowerCase().replace(/<[^>]*>/g,'').includes(q))res.push({type:'Lesson',title:l.n+' — '+co.t,desc:l.c.replace(/<[^>]*>/g,'').slice(0,150)+'...',action:'viewCourse('+co.id+')'})})})});
  S.threads.forEach(function(t){if(t.t.toLowerCase().includes(q)||t.b.toLowerCase().includes(q))res.push({type:'Discussion',title:t.t,desc:t.b.slice(0,150)+'...',action:"go('com')"})});
  var sr=$('sres');if(!sr)return;
  if(!res.length){sr.innerHTML='<div class="card" style="color:var(--t2);text-align:center;padding:30px">No results found.</div>';return}
  sr.innerHTML='<p style="color:var(--t2);margin-bottom:14px">'+res.length+' result'+(res.length>1?'s':'')+' found</p>'+res.map(function(r){return '<div class="card" style="margin-bottom:10px;cursor:pointer" onclick="'+r.action+'"><span class="lvl lvl-b" style="margin-bottom:6px;display:inline-block">'+r.type+'</span><div style="font-weight:600;margin-bottom:4px">'+r.title+'</div><div style="font-size:13px;color:var(--t2)">'+r.desc+'</div></div>'}).join('');
}
// ═══════════════════════════════════════════
// TEACHER PANEL
// ═══════════════════════════════════════════

