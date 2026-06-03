// JSOW v9 - Teacher
var tCurTab='roster';
function tTab(tab,el){tCurTab=tab;el.parentElement.querySelectorAll('.tab').forEach(function(t){t.classList.remove('on')});el.classList.add('on');renderTeach()}

function renderTeach(){
  var ts=$('teach-stats');
  if(ts){
    var total=S.tStudents.length;var active=S.tStudents.filter(function(s){return s.status==='active'}).length;
    var pending=S.tMessages.filter(function(m){return !m.read}).length;
    var avgScore=total?Math.round(S.tStudents.reduce(function(s,st){return s+st.quizAvg},0)/total):0;
    ts.innerHTML='<div class="card stat"><div class="sv2">'+total+'</div><div class="sl2">Students</div></div>'+
      '<div class="card stat"><div class="sv2">'+active+'</div><div class="sl2">Active</div></div>'+
      '<div class="card stat"><div class="sv2">'+pending+'</div><div class="sl2">Unread</div></div>'+
      '<div class="card stat"><div class="sv2">'+avgScore+'%</div><div class="sl2">Avg Score</div></div>';
  }
  var tc=$('tc');if(!tc)return;

  if(tCurTab==='roster'){
    var h='<div style="display:flex;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px"><input class="inp" placeholder="Search students..." oninput="filterStudents(this.value)" style="width:280px"><button class="btn btn-g" onclick="showAddStudent()">+ Add Student</button></div>';
    h+='<div class="card" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Student</th><th>Email</th><th>WSET</th><th>Courses</th><th>Lessons</th><th>Quiz Avg</th><th>Status</th><th>Actions</th></tr></thead><tbody id="roster-body">';
    S.tStudents.forEach(function(s){h+=studentRow(s)});
    h+='</tbody></table></div>';tc.innerHTML=h;

  } else if(tCurTab==='assess'){
    var h='<div class="h3" style="margin-top:0">Gradebook</div>';
    h+='<div class="card" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Student</th><th>WSET L1</th><th>WSET L2</th><th>WSET L3</th><th>Avg</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    S.tStudents.forEach(function(s){
      var l1=s.enrolled.includes(2)?Math.round(60+Math.random()*35)+'%':'—';
      var l2=s.enrolled.includes(3)?Math.round(50+Math.random()*40)+'%':'—';
      var l3=s.enrolled.includes(4)?Math.round(45+Math.random()*45)+'%':'—';
      var pass=s.quizAvg>=55;
      h+='<tr><td style="font-weight:600">'+s.name+'</td><td>'+l1+'</td><td>'+l2+'</td><td>'+l3+'</td><td style="color:var(--g);font-weight:600">'+s.quizAvg+'%</td><td><span class="sts '+(pass?'sts-ok':'sts-w')+'">'+(pass?'Passing':'At Risk')+'</span></td><td><button class="btn btn-o btn-s" onclick="showGradeOverride('+s.id+')">✏️</button> <button class="btn btn-ghost btn-s" onclick="showStudentDetail('+s.id+')">View</button></td></tr>';
    });
    h+='</tbody></table></div>';tc.innerHTML=h;

  } else if(tCurTab==='mycourses'){
    var myCourses=[C[1],C[2],C[3]];
    var h='<div class="ga">';
    myCourses.forEach(function(co){
      var totalL=co.m.reduce(function(s,m){return s+m.l.length},0);
      var enrolled=S.tStudents.filter(function(s){return s.enrolled.includes(co.id)}).length;
      h+='<div class="card"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><span style="font-size:30px">'+co.ic+'</span><div><div style="font-weight:600;font-size:15px">'+co.t+'</div><div style="font-size:11px;color:var(--t3)">'+co.m.length+' modules · '+totalL+' lessons · '+enrolled+' students</div></div></div><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn btn-o btn-s" onclick="showCourseEditor('+co.id+')">✏️ Edit</button><button class="btn btn-o btn-s" onclick="showLessonManager('+co.id+')">📂 Lessons</button><button class="btn btn-o btn-s" onclick="showCourseAnalytics('+co.id+')">📊 Analytics</button><button class="btn btn-o btn-s" onclick="showVideoManager('+co.id+')">🎥 Videos</button></div></div>';
    });
    h+='</div>';tc.innerHTML=h;

  } else if(tCurTab==='builder'){
    tc.innerHTML='<div class="card"><div class="h3" style="margin-top:0">Create New Course</div><div class="row"><div class="field"><label class="lbl">Course Title</label><input class="inp" id="cb-title" placeholder="e.g. WSET Level 1 Refresher"></div><div class="field"><label class="lbl">Level</label><select class="inp" id="cb-level"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div></div><div class="row"><div class="field"><label class="lbl">Duration</label><input class="inp" id="cb-dur" placeholder="e.g. 8 hours"></div><div class="field"><label class="lbl">Icon Emoji</label><input class="inp" id="cb-icon" placeholder="🍇" style="width:80px"></div></div><div class="field"><label class="lbl">Description</label><textarea class="ta" id="cb-desc" placeholder="Course description..."></textarea></div><div class="h3">Modules & Lessons</div><div id="cb-modules"></div><button class="btn btn-o btn-s" onclick="addBuilderModule()" style="margin-bottom:14px">+ Add Module</button><br><button class="btn btn-g btn-l" onclick="saveCourseBuilder()">Create Course</button></div>';
    addBuilderModule();

  } else if(tCurTab==='quizedit'){
    var h='<div style="display:flex;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px"><div class="h3" style="margin:0">Question Bank ('+teacherQuizzes.length+')</div><button class="btn btn-g" onclick="showAddQuestion()">+ Add Question</button></div>';
    h+='<div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">';
    C.forEach(function(co){h+='<button class="btn btn-ghost btn-s" onclick="filterQuiz('+co.id+')">'+co.ic+'</button>'});
    h+='<button class="btn btn-o btn-s" onclick="filterQuiz(0)">All</button></div>';
    h+='<div class="card" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Course</th><th>Question</th><th>Answer</th><th>Actions</th></tr></thead><tbody id="quiz-body">';
    teacherQuizzes.forEach(function(q,i){var co=C.find(function(x){return x.id===q.ci});
      h+='<tr><td>'+(co?co.ic:'')+'</td><td style="max-width:360px">'+q.q+'</td><td style="color:var(--gn)">'+q.o[q.a]+'</td><td><button class="btn btn-o btn-s" onclick="showEditQuestion('+i+')">✏️</button> <button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="deleteQuestion('+i+')">🗑️</button></td></tr>';
    });
    h+='</tbody></table></div>';tc.innerHTML=h;

  } else if(tCurTab==='tnotes'){
    var wines=['Penfolds Bin 389 2021','Henschke Hill of Grace 2018','Yalumba Signature 2019','d\'Arenberg Dead Arm 2020','Torbreck RunRig 2019','Tyrrell\'s Vat 1 2017','Moss Wood Cabernet 2020','Leeuwin Art Series 2020'];
    var reviews=S.tStudents.filter(function(s){return s.notes>0}).map(function(s,i){return {student:s.name,wine:wines[i%wines.length],rating:Math.floor(3+Math.random()*3),date:s.lastActive,status:i%2===0?'Pending':'Reviewed'}});
    var h='<div class="card" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Student</th><th>Wine</th><th>Rating</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>';
    reviews.forEach(function(r){h+='<tr><td style="font-weight:600">'+r.student+'</td><td>'+r.wine+'</td><td style="color:var(--g)">'+'★'.repeat(r.rating)+'☆'.repeat(5-r.rating)+'</td><td style="color:var(--t3)">'+r.date+'</td><td><span class="sts '+(r.status==='Reviewed'?'sts-ok':'sts-w')+'">'+r.status+'</span></td><td><button class="btn btn-o btn-s" onclick="showTastingReview(\''+r.student+'\',\''+r.wine.replace(/'/g,"\\'")+'\')">'+(r.status==='Pending'?'Review':'View')+'</button></td></tr>'});
    h+='</tbody></table></div>';tc.innerHTML=h;

  } else if(tCurTab==='messages'){
    var h='';
    S.tMessages.forEach(function(m,i){
      h+='<div class="card" style="margin-bottom:10px;'+(m.read?'':'border-left:3px solid var(--g)')+'"><div style="display:flex;justify-content:space-between;align-items:start"><div><strong>'+m.from+'</strong> <span style="font-size:11px;color:var(--t3)">'+m.date+'</span>'+(m.read?'':'<span style="color:var(--g);font-size:10px;margin-left:8px">● NEW</span>')+'</div>'+(m.read?'':'<button class="btn btn-ghost btn-s" onclick="markRead('+i+')">Mark Read</button>')+'</div><div style="font-weight:600;margin:6px 0;font-size:14px">'+m.subj+'</div><p style="font-size:13px;color:var(--t2);line-height:1.6">'+m.body+'</p>'+(m.reply?'<div class="reply" style="margin-top:8px"><strong>Your reply:</strong><p style="margin-top:4px">'+m.reply+'</p></div>':'')+(!m.reply?'<div style="margin-top:10px;display:flex;gap:8px"><input class="inp" id="reply-'+i+'" placeholder="Type your reply..." style="flex:1;padding:8px 12px"><button class="btn btn-g btn-s" onclick="sendReply('+i+')">Send</button></div>':'')+'</div>';
    });
    tc.innerHTML=h||'<div class="card" style="text-align:center;padding:30px;color:var(--t2)">No messages.</div>';
  }
}

// ── Teacher: Student CRUD ──
function studentRow(s){
  return '<tr><td style="font-weight:600">'+s.name+'</td><td style="color:var(--t3);font-size:11px">'+s.email+'</td><td>'+s.wset+'</td><td>'+s.enrolled.length+'</td><td>'+s.lessons+'</td><td style="color:var(--g)">'+s.quizAvg+'%</td><td><span class="sts '+(s.status==='active'?'sts-ok':'sts-w')+'">'+s.status+'</span></td><td style="white-space:nowrap"><button class="btn btn-o btn-s" onclick="showStudentDetail('+s.id+')">👁️</button> <button class="btn btn-o btn-s" onclick="showEditStudent('+s.id+')">✏️</button> <button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="deleteStudent('+s.id+')">🗑️</button> <button class="btn btn-ghost btn-s" onclick="showResetPassword('+s.id+')" title="Reset Password" style="color:var(--g);border:1px solid var(--g)">🔑 Reset Pwd</button></td></tr>';
}
function filterStudents(q){q=q.toLowerCase();var body=$('roster-body');if(!body)return;var filtered=q?S.tStudents.filter(function(s){return s.name.toLowerCase().includes(q)||s.email.toLowerCase().includes(q)}):S.tStudents;body.innerHTML=filtered.map(function(s){return studentRow(s)}).join('')}
function showStudentDetail(id){
  var s=S.tStudents.find(function(x){return x.id===id});if(!s)return;
  var courses=s.enrolled.map(function(cid){var co=C.find(function(x){return x.id===cid});return co?co.t:'Unknown'}).join(', ');
  showModal('<h2>'+s.name+'</h2><div class="g2" style="margin-bottom:14px"><div><div class="lbl">Email</div><div>'+s.email+'</div></div><div><div class="lbl">WSET Level</div><div>'+s.wset+'</div></div><div><div class="lbl">Status</div><span class="sts '+(s.status==='active'?'sts-ok':'sts-w')+'">'+s.status+'</span></div><div><div class="lbl">Last Active</div><div>'+s.lastActive+'</div></div></div><div class="lbl">Enrolled Courses</div><p style="margin-bottom:12px">'+courses+'</p><div class="g4" style="margin-bottom:14px"><div class="card stat" style="padding:10px"><div class="sv2" style="font-size:22px">'+s.lessons+'</div><div class="sl2">Lessons</div></div><div class="card stat" style="padding:10px"><div class="sv2" style="font-size:22px">'+s.quizAvg+'%</div><div class="sl2">Quiz Avg</div></div><div class="card stat" style="padding:10px"><div class="sv2" style="font-size:22px">'+s.notes+'</div><div class="sl2">Notes</div></div><div class="card stat" style="padding:10px"><div class="sv2" style="font-size:22px">'+s.points.toLocaleString()+'</div><div class="sl2">Points</div></div></div><button class="btn btn-o" onclick="closeModal()">Close</button>');
}
function showAddStudent(){
  showModal('<h2>Add New Student</h2><div class="row"><div class="field"><label class="lbl">Full Name</label><input class="inp" id="as-name" placeholder="Full name"></div><div class="field"><label class="lbl">Email</label><input class="inp" id="as-email" placeholder="email@example.com"></div></div><div class="row"><div class="field"><label class="lbl">WSET Level</label><select class="inp" id="as-wset"><option>None</option><option>Level 1</option><option>Level 2</option><option>Level 3</option></select></div><div class="field"><label class="lbl">Enrol in Course</label><select class="inp" id="as-course">'+C.map(function(c){return '<option value="'+c.id+'">'+c.t+'</option>'}).join('')+'</select></div></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="addStudent()">Add Student</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>');
}
function addStudent(){var name=($('as-name')||{}).value;var email=($('as-email')||{}).value;if(!name||!email){toast('Fill in all fields');return}S.tStudents.push({id:Date.now(),name:name,email:email,enrolled:[parseInt(($('as-course')||{}).value)],lessons:0,points:0,lastActive:new Date().toISOString().split('T')[0],status:'active',wset:($('as-wset')||{}).value,notes:0,quizAvg:0});saveState();closeModal();renderTeach();toast('Student added: '+name)}
function showEditStudent(id){
  var s=S.tStudents.find(function(x){return x.id===id});if(!s)return;
  var courseChecks=C.map(function(co){var checked=s.enrolled.includes(co.id)?'checked':'';return '<label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:4px"><input type="checkbox" value="'+co.id+'" '+checked+' class="es-course"> '+co.ic+' '+co.t+'</label>'}).join('');
  showModal('<h2>Edit Student</h2><div class="row"><div class="field"><label class="lbl">Full Name</label><input class="inp" id="es-name" value="'+s.name+'"></div><div class="field"><label class="lbl">Email</label><input class="inp" id="es-email" value="'+s.email+'"></div></div><div class="row"><div class="field"><label class="lbl">WSET Level</label><select class="inp" id="es-wset"><option '+(s.wset==='None'?'selected':'')+'>None</option><option '+(s.wset==='Level 1'?'selected':'')+'>Level 1</option><option '+(s.wset==='Level 2'?'selected':'')+'>Level 2</option><option '+(s.wset==='Level 3'?'selected':'')+'>Level 3</option></select></div><div class="field"><label class="lbl">Status</label><select class="inp" id="es-status"><option '+(s.status==='active'?'selected':'')+'>active</option><option '+(s.status==='inactive'?'selected':'')+'>inactive</option></select></div></div><div class="field"><label class="lbl">Enrolled Courses</label>'+courseChecks+'</div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="saveEditStudent('+id+')">Save Changes</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>');
}
function saveEditStudent(id){
  var s=S.tStudents.find(function(x){return x.id===id});if(!s)return;
  s.name=($('es-name')||{}).value||s.name;
  s.email=($('es-email')||{}).value||s.email;
  s.wset=($('es-wset')||{}).value||s.wset;
  s.status=($('es-status')||{}).value||s.status;
  var checks=document.querySelectorAll('.es-course');
  s.enrolled=[];checks.forEach(function(cb){if(cb.checked)s.enrolled.push(parseInt(cb.value))});
  saveState();closeModal();renderTeach();toast('Student updated: '+s.name);
}
function deleteStudent(id){
  var s=S.tStudents.find(function(x){return x.id===id});if(!s)return;
  if(!confirm('Remove '+s.name+' from the platform?'))return;
  S.tStudents=S.tStudents.filter(function(x){return x.id!==id});
  saveState();renderTeach();toast(s.name+' removed');
}
function showGradeOverride(id){var s=S.tStudents.find(function(x){return x.id===id});if(!s)return;showModal('<h2>Grade Override — '+s.name+'</h2><p style="color:var(--t2);margin-bottom:14px">Current average: <strong style="color:var(--g)">'+s.quizAvg+'%</strong></p><div class="field"><label class="lbl">New Grade (%)</label><input class="inp" id="go-grade" type="number" min="0" max="100" value="'+s.quizAvg+'"></div><div class="field"><label class="lbl">Reason</label><textarea class="ta" id="go-reason" placeholder="e.g. Mitigating circumstances..."></textarea></div><div style="display:flex;gap:8px"><button class="btn btn-g" onclick="applyGradeOverride('+id+')">Save</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function applyGradeOverride(id){var grade=parseInt(($('go-grade')||{}).value);if(isNaN(grade)||grade<0||grade>100){toast('Enter valid grade 0-100');return}var s=S.tStudents.find(function(x){return x.id===id});if(s){s.quizAvg=grade;saveState();closeModal();renderTeach();toast('Grade updated')}}
function markRead(i){S.tMessages[i].read=true;saveState();renderTeach();toast('Marked as read')}
function sendReply(i){var inp=$('reply-'+i);if(!inp||!inp.value.trim())return;S.tMessages[i].reply=inp.value.trim();S.tMessages[i].read=true;saveState();renderTeach();toast('Reply sent!')}

// ── Teacher: Course Management ──
function showCourseEditor(cid){var co=C.find(function(x){return x.id===cid});if(!co)return;showModal('<h2>Edit — '+co.t+'</h2><div class="field"><label class="lbl">Title</label><input class="inp" id="ce-title" value="'+co.t+'"></div><div class="field"><label class="lbl">Description</label><textarea class="ta" id="ce-desc">'+co.d+'</textarea></div><div class="field"><label class="lbl">Duration</label><input class="inp" id="ce-dur" value="'+co.du+'"></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="saveCourseEdit('+cid+')">Save</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function saveCourseEdit(cid){var co=C.find(function(x){return x.id===cid});if(!co)return;co.t=($('ce-title')||{}).value||co.t;co.d=($('ce-desc')||{}).value||co.d;co.du=($('ce-dur')||{}).value||co.du;closeModal();renderTeach();toast('Course updated!')}
function showLessonManager(cid){var co=C.find(function(x){return x.id===cid});if(!co)return;var ci=C.indexOf(co);var h='<h2>Lessons \u2014 '+co.t+'</h2>';
co.m.forEach(function(mod,mi){
h+='<div class="mh2" style="display:flex;align-items:center;justify-content:space-between">Module '+(mi+1)+': '+mod.n+'<button class="btn btn-ghost btn-s" onclick="addModuleLesson('+ci+','+mi+')" style="color:var(--g)">+ Add Lesson</button></div>';
mod.l.forEach(function(les,li){
h+='<div class="li2" style="display:flex;align-items:center;gap:6px;padding:10px 12px;margin-bottom:3px;background:var(--bg3);border-radius:8px">';
h+='<span style="font-size:11px;color:var(--t3);min-width:28px">'+(mi+1)+'.'+(li+1)+'</span>';
h+='<strong style="flex:1;font-size:13px">'+les.n+'</strong>';
h+='<span style="font-size:11px;color:var(--t3);margin-right:4px">'+(les.v?'\uD83C\uDFA5':'\uD83D\uDCC4')+'</span>';
if(li>0)h+='<button class="btn btn-ghost btn-s" onclick="moveLessonUp('+ci+','+mi+','+li+')" title="Move up">\u25B2</button>';
if(li<mod.l.length-1)h+='<button class="btn btn-ghost btn-s" onclick="moveLessonDown('+ci+','+mi+','+li+')" title="Move down">\u25BC</button>';
h+='<button class="btn btn-o btn-s" onclick="showLessonEditor('+co.id+','+mi+','+li+')">Edit</button>';
h+='<button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="deleteLesson('+ci+','+mi+','+li+')" title="Delete">\uD83D\uDDD1\uFE0F</button>';
h+='</div>'})});
h+='<div style="margin-top:18px"><button class="btn btn-o" onclick="closeModal()">Close</button></div>';
showModal(h)}
function addModuleLesson(ci,mi){var title=prompt('New lesson title:');if(!title)return;C[ci].m[mi].l.push({n:title,v:'',c:'<p>Lesson content goes here. Click Edit to add content, images, and videos.</p>'});toast('Lesson added: '+title);closeModal();showLessonManager(C[ci].id)}
function moveLessonUp(ci,mi,li){if(li<=0)return;var arr=C[ci].m[mi].l;var tmp=arr[li];arr[li]=arr[li-1];arr[li-1]=tmp;closeModal();showLessonManager(C[ci].id);toast('Moved up')}
function moveLessonDown(ci,mi,li){var arr=C[ci].m[mi].l;if(li>=arr.length-1)return;var tmp=arr[li];arr[li]=arr[li+1];arr[li+1]=tmp;closeModal();showLessonManager(C[ci].id);toast('Moved down')}
function deleteLesson(ci,mi,li){var name=C[ci].m[mi].l[li].n;if(!confirm('Delete lesson "'+name+'"?'))return;C[ci].m[mi].l.splice(li,1);closeModal();showLessonManager(C[ci].id);toast('Deleted: '+name)}
function showCourseAnalytics(cid){var co=C.find(function(x){return x.id===cid});if(!co)return;var enrolled=S.tStudents.filter(function(s){return s.enrolled.includes(cid)}).length;showModal('<h2>Analytics — '+co.t+'</h2><div class="g3" style="margin-bottom:14px"><div class="card stat" style="padding:12px"><div class="sv2" style="font-size:22px">'+enrolled+'</div><div class="sl2">Enrolled</div></div><div class="card stat" style="padding:12px"><div class="sv2" style="font-size:22px">'+Math.round(65+Math.random()*25)+'%</div><div class="sl2">Completion</div></div><div class="card stat" style="padding:12px"><div class="sv2" style="font-size:22px">'+Math.round(70+Math.random()*20)+'%</div><div class="sl2">Avg Quiz</div></div></div><button class="btn btn-o" onclick="closeModal()">Close</button>')}
function showVideoManager(cid){var co=C.find(function(x){return x.id===cid});if(!co)return;var ci=C.indexOf(co);var h='<h2>Videos — '+co.t+'</h2><p style="color:var(--t2);font-size:12px;margin-bottom:14px">Paste YouTube video IDs. They embed automatically in the player.</p>';co.m.forEach(function(mod,mi){mod.l.forEach(function(les,li){h+='<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.02)"><span style="flex:1;font-size:12px">'+les.n+'</span><input class="inp" style="width:160px;padding:5px 8px;font-size:11px" value="'+(les.v||'')+'" placeholder="YouTube ID" onchange="C['+ci+'].m['+mi+'].l['+li+'].v=this.value">'+(les.v?'<span style="color:var(--gn);font-size:11px">✅</span>':'<span style="color:var(--t3);font-size:11px">—</span>')+'</div>'})});h+='<div style="margin-top:14px;display:flex;gap:8px"><button class="btn btn-g" onclick="toast(\'Videos saved!\');closeModal()">Save</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>';showModal(h)}

// Course Builder
var builderModCount=0;
function addBuilderModule(){builderModCount++;var el=$('cb-modules');if(!el)return;var div=document.createElement('div');div.className='card';div.style.marginBottom='10px';div.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><input class="inp" placeholder="Module name..." style="flex:1;margin-right:8px" id="cbm-n-'+builderModCount+'"><button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="this.parentElement.parentElement.remove()">✕</button></div><div id="cbm-l-'+builderModCount+'"></div><button class="btn btn-ghost btn-s" onclick="addBuilderLesson('+builderModCount+')">+ Add Lesson</button>';el.appendChild(div);addBuilderLesson(builderModCount)}
var builderLesCount=0;
function addBuilderLesson(modId){builderLesCount++;var el=$('cbm-l-'+modId);if(!el)return;var div=document.createElement('div');div.style.cssText='margin-bottom:8px;padding:8px;background:var(--bg3);border-radius:8px';div.innerHTML='<div class="row" style="margin-bottom:6px"><div class="field" style="margin:0"><input class="inp" placeholder="Lesson title" style="padding:7px 10px;font-size:12px"></div><div class="field" style="margin:0"><input class="inp" placeholder="YouTube ID (optional)" style="padding:7px 10px;font-size:12px"></div></div><textarea class="ta" placeholder="Lesson content..." style="min-height:50px;font-size:12px"></textarea>';el.appendChild(div)}
function saveCourseBuilder(){var title=($('cb-title')||{}).value;if(!title){toast('Enter course title');return}toast('Course "'+title+'" created!');tCurTab='mycourses';renderTeach()}

// Quiz Editor
function showAddQuestion(){showModal('<h2>Add Question</h2><div class="field"><label class="lbl">Course</label><select class="inp" id="aq-course">'+C.map(function(c){return '<option value="'+c.id+'">'+c.t+'</option>'}).join('')+'</select></div><div class="field"><label class="lbl">Question</label><textarea class="ta" id="aq-q" placeholder="Enter question..."></textarea></div><div class="field"><label class="lbl">Option A</label><input class="inp" id="aq-a"></div><div class="field"><label class="lbl">Option B</label><input class="inp" id="aq-b"></div><div class="field"><label class="lbl">Option C</label><input class="inp" id="aq-c"></div><div class="field"><label class="lbl">Option D</label><input class="inp" id="aq-d"></div><div class="row"><div class="field"><label class="lbl">Correct</label><select class="inp" id="aq-correct"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select></div><div class="field"><label class="lbl">Explanation</label><input class="inp" id="aq-expl"></div></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="addQuestion()">Add</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function addQuestion(){var q=($('aq-q')||{}).value;if(!q){toast('Enter question');return}teacherQuizzes.push({ci:parseInt(($('aq-course')||{}).value),q:q,o:[($('aq-a')||{}).value,($('aq-b')||{}).value,($('aq-c')||{}).value,($('aq-d')||{}).value],a:parseInt(($('aq-correct')||{}).value),e:($('aq-expl')||{}).value});closeModal();renderTeach();toast('Question added!')}
function showEditQuestion(i){var q=teacherQuizzes[i];if(!q)return;showModal('<h2>Edit Question</h2><div class="field"><label class="lbl">Question</label><textarea class="ta" id="eq-q">'+q.q+'</textarea></div><div class="field"><label class="lbl">A</label><input class="inp" id="eq-a" value="'+q.o[0]+'"></div><div class="field"><label class="lbl">B</label><input class="inp" id="eq-b" value="'+q.o[1]+'"></div><div class="field"><label class="lbl">C</label><input class="inp" id="eq-c" value="'+q.o[2]+'"></div><div class="field"><label class="lbl">D</label><input class="inp" id="eq-d" value="'+q.o[3]+'"></div><div class="row"><div class="field"><label class="lbl">Correct</label><select class="inp" id="eq-correct"><option value="0" '+(q.a===0?'selected':'')+'>A</option><option value="1" '+(q.a===1?'selected':'')+'>B</option><option value="2" '+(q.a===2?'selected':'')+'>C</option><option value="3" '+(q.a===3?'selected':'')+'>D</option></select></div><div class="field"><label class="lbl">Explanation</label><input class="inp" id="eq-expl" value="'+q.e+'"></div></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="saveEditQuestion('+i+')">Save</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function saveEditQuestion(i){teacherQuizzes[i].q=($('eq-q')||{}).value;teacherQuizzes[i].o=[($('eq-a')||{}).value,($('eq-b')||{}).value,($('eq-c')||{}).value,($('eq-d')||{}).value];teacherQuizzes[i].a=parseInt(($('eq-correct')||{}).value);teacherQuizzes[i].e=($('eq-expl')||{}).value;closeModal();renderTeach();toast('Question updated!')}
function deleteQuestion(i){if(confirm('Delete this question?')){teacherQuizzes.splice(i,1);renderTeach();toast('Question deleted')}}
function filterQuiz(cid){var body=$('quiz-body');if(!body)return;var qs=cid===0?teacherQuizzes:teacherQuizzes.filter(function(q){return q.ci===cid});body.innerHTML=qs.map(function(q){var co=C.find(function(x){return x.id===q.ci});var realIdx=teacherQuizzes.indexOf(q);return '<tr><td>'+(co?co.ic:'')+'</td><td style="max-width:360px">'+q.q+'</td><td style="color:var(--gn)">'+q.o[q.a]+'</td><td><button class="btn btn-o btn-s" onclick="showEditQuestion('+realIdx+')">✏️</button> <button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="deleteQuestion('+realIdx+')">🗑️</button></td></tr>'}).join('')}
function showTastingReview(student,wine){showModal('<h2>Tasting Review</h2><div class="lbl">Student</div><p style="margin-bottom:10px">'+student+'</p><div class="lbl">Wine</div><p style="margin-bottom:10px">'+wine+'</p><div class="field"><label class="lbl">Feedback</label><textarea class="ta" placeholder="Provide SAT-structured feedback..."></textarea></div><div class="row"><div class="field"><label class="lbl">Grade</label><select class="inp"><option>Pass</option><option>Merit</option><option>Distinction</option><option>Needs Improvement</option></select></div><div class="field"><label class="lbl">Status</label><select class="inp"><option>Reviewed</option><option>Pending</option></select></div></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="toast(\'Review saved!\');closeModal()">Save</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}

// ═══════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════


function showResetPassword(sid){var s=S.tStudents.find(function(x){return x.id===sid});if(!s)return;var tp=generateTempPassword();showModal('<h2>Reset Password</h2><p style="color:var(--t2);margin-bottom:14px">Set new password for <strong>'+s.name+'</strong></p><div class="field"><label class="lbl">New Password</label><input class="inp" id="rp-pw" value="'+tp+'"></div><p style="font-size:11px;color:var(--t3);margin-bottom:14px">Share this password securely with the student.</p><div style="display:flex;gap:8px"><button class="btn btn-g" onclick="applyPwReset('+s.id+')">Set Password</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function applyPwReset(sid){var pw=(document.getElementById('rp-pw')||{}).value;if(!pw||pw.length<6){toast('Min 6 characters');return}var s=S.tStudents.find(function(x){return x.id===sid});if(!s)return;var u=USERS.find(function(x){return x.email===s.email});if(u){hashPassword(pw).then(function(h){u.hash=h;closeModal();toast('Password reset for '+s.name)})}else{hashPassword(pw).then(function(h){USERS.push({email:s.email,hash:h,role:'student',name:s.name,initials:s.name.split(' ').map(function(w){return w[0]}).join('')});closeModal();toast('Account created for '+s.name)})}}

function showLessonEditor(ci,mi,li){var co=C.find(function(x){return x.id===ci});if(!co)return;var les=co.m[mi].l[li];if(!les)return;var cIdx=C.indexOf(co);var h='<h2>Edit Lesson</h2>';
h+='<div class="field"><label class="lbl">Lesson Title</label><input class="inp" id="le-title" value="'+les.n.replace(/"/g,'&quot;')+'"></div>';
h+='<div class="field"><label class="lbl">YouTube Video ID</label><input class="inp" id="le-video" value="'+(les.v||'')+'" placeholder="Paste YouTube ID (e.g. dQw4w9WgXcQ)"></div>';
h+='<div class="field"><label class="lbl">Lesson Content</label>';
h+='<div class="le-toolbar">';
var cmds=[['bold','<b>B</b>'],['italic','<i>I</i>'],['underline','<u>U</u>'],['insertUnorderedList','• List'],['insertOrderedList','1. List'],['formatBlock','H3']];
cmds.forEach(function(c){h+='<button class="btn btn-ghost btn-s" onmousedown="event.preventDefault();document.execCommand(\''+c[0]+'\''+(c[0]==='formatBlock'?',null,\'h3\'':'')+')">'+c[1]+'</button>'});
h+='<label class="btn btn-ghost btn-s le-upload-btn" title="Upload Image">📷 Image<input type="file" accept="image/*" onchange="handleLessonImage(this)" style="display:none"></label>';
h+='</div>';
h+='<div id="le-img-preview" style="display:none;padding:12px;background:var(--bg4);border:1px solid rgba(255,255,255,.04);margin-bottom:4px"><p style="font-size:11px;color:var(--g);margin-bottom:8px">IMAGE PREVIEW — adjust width, then click Insert</p><img id="le-img-thumb" style="max-width:100%;border-radius:6px;display:block;margin-bottom:8px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><label style="font-size:11px;color:var(--t2);white-space:nowrap">Width:</label><input type="range" id="le-img-width" min="10" max="100" value="100" style="flex:1;accent-color:var(--g)" oninput="document.getElementById(\'le-img-thumb\').style.width=this.value+\'%\';document.getElementById(\'le-img-pct\').textContent=this.value+\'%\'"><span id="le-img-pct" style="font-size:11px;color:var(--t2);min-width:35px">100%</span></div><button class="btn btn-g btn-s" onclick="insertLessonImage()">Insert into Lesson</button> <button class="btn btn-ghost btn-s" onclick="document.getElementById(\'le-img-preview\').style.display=\'none\'">Cancel</button></div>';
h+='<div id="le-content" contenteditable="true" class="le-editor">'+les.c+'</div>';
h+='</div>';
h+='<div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-g" onclick="saveLessonEdit('+cIdx+','+mi+','+li+')">Save Changes</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>';
showModal(h)}

var _leImgData='';
function handleLessonImage(input){
  if(!input.files||!input.files[0])return;
  var file=input.files[0];
  if(file.size>5242880){toast('Image must be under 5MB');return}
  var reader=new FileReader();
  reader.onload=function(e){
    _leImgData=e.target.result;
    var prev=document.getElementById('le-img-preview');
    var thumb=document.getElementById('le-img-thumb');
    if(prev&&thumb){thumb.src=_leImgData;thumb.style.width='100%';prev.style.display='block';
    var slider=document.getElementById('le-img-width');if(slider)slider.value=100;
    var pct=document.getElementById('le-img-pct');if(pct)pct.textContent='100%'}
  };
  reader.readAsDataURL(file);
  input.value='';
}
function insertLessonImage(){
  if(!_leImgData){toast('No image loaded');return}
  var w=document.getElementById('le-img-width');
  var width=w?w.value:100;
  var img='<div style="margin:16px 0;text-align:center"><img src="'+_leImgData+'" style="width:'+width+'%;max-width:100%;border-radius:8px;display:inline-block" alt="Lesson image"></div>';
  var editor=document.getElementById('le-content');
  if(editor){editor.focus();document.execCommand('insertHTML',false,img)}
  document.getElementById('le-img-preview').style.display='none';
  _leImgData='';
  toast('Image inserted');
}
function saveLessonEdit(cIdx,mi,li){var t=(document.getElementById('le-title')||{}).value;var v=(document.getElementById('le-video')||{}).value;var c=document.getElementById('le-content');if(!t){toast('Enter title');return}C[cIdx].m[mi].l[li].n=t;C[cIdx].m[mi].l[li].v=v||'';if(c)C[cIdx].m[mi].l[li].c=c.innerHTML;closeModal();renderTeach();toast('Lesson saved: '+t)}
