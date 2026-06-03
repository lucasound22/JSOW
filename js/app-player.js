// JSOW v9 - Player
function viewCourse(cid){
  if(!S.enrolled.includes(cid)){S.enrolled.push(cid);saveState()}
  S.curCourse=cid;S.curMi=0;S.curLi=0;saveState();go('play');
}
function renderPlayer(){
  var co=C.find(function(x){return x.id===S.curCourse});
  if(!co){$('pls').innerHTML='<p style="color:var(--t2)">Select a course from the catalogue.</p>';$('plm').innerHTML='';$('pln').style.display='none';return}
  // Sidebar
  var sb='<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><img src="logo.png" style="width:24px;height:auto;object-fit:contain"><span style="font:600 13px var(--hf);color:var(--g)">'+co.t+'</span></div>';
  sb+='<div class="prog"><div class="pf2" style="width:'+gp(co.id)+'%"></div></div>';
  sb+='<div style="font-size:10px;color:var(--t3);margin-bottom:14px">'+gp(co.id)+'% complete · '+co.du+'</div>';
  co.m.forEach(function(mod,mi){
    sb+='<div class="mh2">Module '+(mi+1)+': '+mod.n+'</div>';
    mod.l.forEach(function(les,li){
      var done=S.progress[lk(co.id,mi,li)];var active=mi===S.curMi&&li===S.curLi;
      sb+='<div class="li2'+(active?' on':'')+(done?' done':'')+'" onclick="selLes('+mi+','+li+')"><span style="flex-shrink:0;width:16px;text-align:center;font-size:11px">'+(done?'✅':'○')+'</span>'+les.n+'</div>';
    });
  });
  sb+='<div style="margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,.03)"><button class="btn btn-o btn-w btn-s" onclick="startQuiz('+co.id+')">📝 Take Assessment</button></div>';
  $('pls').innerHTML=sb;
  // Main content
  var mod=co.m[S.curMi];var les=mod?mod.l[S.curLi]:null;if(!les){$('plm').innerHTML='';$('pln').style.display='none';return}
  var done=S.progress[lk(co.id,S.curMi,S.curLi)];
  var mn='';
  // Only show video if YouTube ID exists
  if(les.v&&les.v.trim()){mn+='<div class="vid-box"><iframe src="https://www.youtube.com/embed/'+les.v+'?rel=0" allowfullscreen></iframe></div>'}
  mn+='<h2 style="font:600 28px var(--hf);color:var(--g);margin-bottom:6px;line-height:1.25">'+les.n+'</h2>';
  mn+='<div style="font-size:11px;color:var(--t3);margin-bottom:16px">'+co.t+' → '+mod.n+' → Lesson '+(S.curLi+1)+' of '+mod.l.length+'</div>';
  mn+='<div class="card" style="margin-bottom:18px;line-height:1.85;font-size:15px">'+les.c+'</div>';
  mn+='<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">';
  if(S.curMi>0||S.curLi>0)mn+='<button class="btn btn-o" onclick="prevLes()">← Previous</button>';else mn+='<div></div>';
  mn+='<div style="display:flex;gap:8px">';
  if(!done)mn+='<button class="btn btn-g" onclick="compLes()">✅ Mark Complete</button>';
  else mn+='<span style="color:var(--gn);font-size:13px;display:flex;align-items:center;gap:4px">✅ Completed</span>';
  mn+='<button class="btn btn-o" onclick="nextLes()">Next →</button></div></div>';
  $('plm').innerHTML=mn;
  // Notes area
  $('pln').style.display='block';var nk=lk(S.curCourse,S.curMi,S.curLi);var hn=S.lessonNotes&&S.lessonNotes[nk]&&S.lessonNotes[nk].trim();var nh=$('notes-toggle');if(nh){nh.innerHTML='\uD83D\uDCDD My Notes '+(hn?'<span style="font-size:10px;color:var(--gn)">(saved)</span>':'')+'<span style="font-size:10px;color:var(--t3);margin-left:auto">click to '+(S._notesOpen?'collapse':'expand')+'</span>'}var nb=$('notes-body');if(nb){nb.style.display=S._notesOpen?'block':'none'}
  var noteKey=lk(S.curCourse,S.curMi,S.curLi);
  var noteEl=$('lesson-notes');
  if(noteEl)noteEl.value=S.lessonNotes[noteKey]||'';
  var savedEl=$('notes-saved');if(savedEl)savedEl.classList.remove('show');
}
function saveLessonNotes(){
  var noteKey=lk(S.curCourse,S.curMi,S.curLi);
  var noteEl=$('lesson-notes');
  if(noteEl)S.lessonNotes[noteKey]=noteEl.value;
  saveState();
  var savedEl=$('notes-saved');if(savedEl){savedEl.classList.add('show');setTimeout(function(){savedEl.classList.remove('show')},2000)}
}
function selLes(mi,li){S.curMi=mi;S.curLi=li;renderPlayer()}
function prevLes(){var co=C.find(function(x){return x.id===S.curCourse});if(!co)return;if(S.curLi>0)S.curLi--;else if(S.curMi>0){S.curMi--;S.curLi=co.m[S.curMi].l.length-1}renderPlayer()}
function nextLes(){var co=C.find(function(x){return x.id===S.curCourse});if(!co)return;if(S.curLi<co.m[S.curMi].l.length-1)S.curLi++;else if(S.curMi<co.m.length-1){S.curMi++;S.curLi=0}renderPlayer()}
function compLes(){S.progress[lk(S.curCourse,S.curMi,S.curLi)]=true;S.points+=25;saveState();toast('✅ +25 points!');checkBadges();renderPlayer()}

// ── QUIZ ──
function startQuiz(cid){
  S.quizQs=Q.filter(function(q){return q.ci===cid}).sort(function(){return Math.random()-.5});
  if(!S.quizQs.length)S.quizQs=Q.sort(function(){return Math.random()-.5}).slice(0,10);
  S.quizIdx=0;S.quizScore=0;S.quizSel=-1;if(S.quizInt)clearInterval(S.quizInt);go('quiz');renderQ();
}
function renderQ(){
  var qb=$('qb');if(!qb||!S.quizQs.length)return;var q=S.quizQs[S.quizIdx];S.quizSel=-1;S.quizTimer=45;
  if(S.quizInt)clearInterval(S.quizInt);
  S.quizInt=setInterval(function(){S.quizTimer--;var te=$('qt');if(te)te.textContent=S.quizTimer+'s';if(S.quizTimer<=0){clearInterval(S.quizInt);submitAns()}},1000);
  var h='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><span style="color:var(--t2);font-size:13px">Question '+(S.quizIdx+1)+' of '+S.quizQs.length+'</span><span id="qt" style="font:700 22px var(--hf);color:var(--g)">'+S.quizTimer+'s</span></div>';
  h+='<div class="prog" style="margin-bottom:14px"><div class="pf2" style="width:'+(S.quizIdx/S.quizQs.length*100)+'%"></div></div>';
  h+='<h3 style="font-size:18px;margin-bottom:18px;line-height:1.5">'+q.q+'</h3>';
  q.o.forEach(function(opt,i){h+='<div class="q-opt" id="qo-'+i+'" onclick="selOpt('+i+')">'+String.fromCharCode(65+i)+'. '+opt+'</div>'});
  h+='<div style="margin-top:18px;text-align:right"><button class="btn btn-g" onclick="submitAns()">Submit Answer</button></div><div id="qfb" style="margin-top:14px"></div>';
  qb.innerHTML=h;
}
function selOpt(i){S.quizSel=i;document.querySelectorAll('.q-opt').forEach(function(o){o.classList.remove('sel')});var e=$('qo-'+i);if(e)e.classList.add('sel')}
function submitAns(){
  if(S.quizInt)clearInterval(S.quizInt);var q=S.quizQs[S.quizIdx];var ok=S.quizSel===q.a;if(ok)S.quizScore++;
  q.o.forEach(function(o,i){var e=$('qo-'+i);if(!e)return;e.style.pointerEvents='none';if(i===q.a)e.classList.add('ok');else if(i===S.quizSel&&!ok)e.classList.add('no')});
  var fb=$('qfb');
  if(fb)fb.innerHTML='<div class="card" style="border-left:3px solid '+(ok?'var(--gn)':'var(--r)')+'"><strong>'+(ok?'✅ Correct!':'❌ Incorrect')+'</strong><br><span style="font-size:13px;color:var(--t2)">'+q.e+'</span></div>'+
    '<div style="margin-top:14px;text-align:right"><button class="btn btn-g" onclick="nextQ()">'+(S.quizIdx<S.quizQs.length-1?'Next Question →':'See Results')+'</button></div>';
}
function nextQ(){S.quizIdx++;if(S.quizIdx>=S.quizQs.length)showResults();else renderQ()}
function showResults(){
  var pct=Math.round(S.quizScore/S.quizQs.length*100);var pass=pct>=55;
  S.points+=S.quizScore*10;if(pass)S.cq.push(Date.now());saveState();checkBadges();
  $('qb').innerHTML='<div style="text-align:center;padding:30px"><div style="font-size:52px;margin-bottom:14px">'+(pass?'🎉':'📚')+'</div><h2 style="font:700 28px var(--hf);color:var(--g);margin-bottom:8px">'+(pass?'Congratulations — You Passed!':'Keep Studying')+'</h2><p style="font-size:18px;margin-bottom:6px">Score: <strong style="color:var(--g)">'+S.quizScore+'/'+S.quizQs.length+' ('+pct+'%)</strong></p><p style="font-size:14px;color:var(--t2);margin-bottom:24px">+'+(S.quizScore*10)+' points earned</p><div style="display:flex;gap:10px;justify-content:center"><button class="btn btn-g" onclick="go(\''+(S.curCourse?'play':'cat')+'\')">Back to Course</button><button class="btn btn-o" onclick="startQuiz('+(S.curCourse||0)+')">Retake</button></div></div>';
}

// ── TASTING JOURNAL ──
