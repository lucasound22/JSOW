// JSOW v9 - Admin
var aCurTab='analytics';var chartsInit=false;
function aTab(tab,el){aCurTab=tab;el.parentElement.querySelectorAll('.tab').forEach(function(t){t.classList.remove('on')});el.classList.add('on');chartsInit=false;renderAdmin()}

function renderAdmin(){
  var ac=$('ac');if(!ac)return;

  if(aCurTab==='analytics'){
    ac.innerHTML='<div class="g4" style="margin-bottom:22px"><div class="card stat"><div class="sv2">247</div><div class="sl2">Total Learners</div></div><div class="card stat"><div class="sv2">1,847</div><div class="sl2">Lessons Done</div></div><div class="card stat"><div class="sv2">72%</div><div class="sl2">Avg Completion</div></div><div class="card stat"><div class="sv2">78%</div><div class="sl2">Pass Rate</div></div></div><div class="card" style="margin-bottom:18px"><div class="h3" style="margin-top:0">Enrollment Trends</div><div class="cht"><canvas id="ach1"></canvas></div></div><div class="g2"><div class="card"><div class="h3" style="margin-top:0">Completions by Month</div><div class="cht"><canvas id="ach2"></canvas></div></div><div class="card"><div class="h3" style="margin-top:0">Course Popularity</div><div class="cht"><canvas id="ach3"></canvas></div></div></div>';
    setTimeout(initCharts,300);

  } else if(aCurTab==='users'){
    var h='<div style="display:flex;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px"><input class="inp" placeholder="Search users..." style="width:280px" oninput="filterAdminUsers(this.value)"><div style="display:flex;gap:6px"><button class="btn btn-g" onclick="showAddUser()">+ Add User</button><button class="btn btn-o" onclick="toast(\'Exporting CSV...\')">📥 Export</button></div></div>';
    h+='<div class="card" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>WSET</th><th>Courses</th><th>Status</th><th>Actions</th></tr></thead><tbody id="ausers-body">';
    S.tStudents.forEach(function(s){h+=adminUserRow(s)});
    h+='</tbody></table></div>';ac.innerHTML=h;

  } else if(aCurTab==='courses'){
    var h='<div class="h2">All Courses ('+C.length+')</div>';
    h+='<div class="card"><table class="tbl"><thead><tr><th>Course</th><th>Owner</th><th>Level</th><th>Modules</th><th>Lessons</th><th>Students</th><th>Actions</th></tr></thead><tbody>';
    C.forEach(function(co,ci){var tl=co.m.reduce(function(s,m){return s+m.l.length},0);
    var own=USERS.find(function(u){return u.email===co.ow});
    h+='<tr><td>'+co.ic+' <strong>'+co.t+'</strong></td><td style="font-size:11px;color:var(--t3)">'+(own?own.name:(co.ow||'Unassigned'))+'</td><td>'+co.lv+'</td><td>'+co.m.length+'</td><td>'+tl+'</td><td>'+co.st.toLocaleString()+'</td>';
    h+='<td style="white-space:nowrap"><button class="btn btn-o btn-s" onclick="showAdminCourseEditor('+co.id+')">Edit</button> ';
    h+='<button class="btn btn-ghost btn-s" onclick="showAdminLessonMgr('+co.id+')" style="color:var(--g)">Lessons</button> ';
    h+='<button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="adminDeleteCourse('+ci+')">Delete</button></td></tr>'});
    h+='</tbody></table></div>';ac.innerHTML=h;
} else if(aCurTab==='enrol'){
    var h='<div class="h3" style="margin-top:0">Manage Enrolments</div><p style="color:var(--t2);font-size:13px;margin-bottom:16px">Add or remove students from courses. Click a student to manage their enrolments.</p>';
    h+='<div class="card" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Student</th><th>Email</th>';
    C.forEach(function(co){h+='<th style="text-align:center">'+co.ic+'</th>'});
    h+='<th>Actions</th></tr></thead><tbody>';
    S.tStudents.forEach(function(s){
      h+='<tr><td style="font-weight:600">'+s.name+'</td><td style="font-size:11px;color:var(--t3)">'+s.email+'</td>';
      C.forEach(function(co){var enrolled=s.enrolled.includes(co.id);h+='<td style="text-align:center"><span style="cursor:pointer;font-size:16px" onclick="toggleEnrol('+s.id+','+co.id+')">'+(enrolled?'✅':'⬜')+'</span></td>'});
      h+='<td><button class="btn btn-o btn-s" onclick="showEditStudent('+s.id+')">✏️</button></td></tr>';
    });
    h+='</tbody></table></div>';ac.innerHTML=h;

  } else if(aCurTab==='promos'){
    var h='<div style="display:flex;justify-content:space-between;margin-bottom:14px"><div class="h3" style="margin:0">Promotions ('+S.aPromos.length+')</div><button class="btn btn-g" onclick="showAddPromo()">+ New Promo</button></div>';
    h+='<div class="card" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Code</th><th>Discount</th><th>Uses</th><th>Max</th><th>Expires</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    S.aPromos.forEach(function(p,i){h+='<tr><td style="font-weight:600;font-family:monospace;color:var(--g)">'+p.code+'</td><td>'+p.disc+'%</td><td>'+p.uses+'</td><td>'+p.maxUses+'</td><td style="color:var(--t3)">'+p.exp+'</td><td><span class="sts '+(p.status==='Active'?'sts-ok':p.status==='Expired'?'sts-r':'sts-w')+'">'+p.status+'</span></td><td><button class="btn btn-o btn-s" onclick="showEditPromo('+i+')">✏️</button> <button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="deletePromo('+i+')">🗑️</button></td></tr>'});
    h+='</tbody></table></div>';ac.innerHTML=h;

  } else if(aCurTab==='events'){
    var h='<div style="display:flex;justify-content:space-between;margin-bottom:14px"><div class="h3" style="margin:0">Events ('+S.aEvents.length+')</div><button class="btn btn-g" onclick="showAddEvent()">+ New Event</button></div>';
    h+='<div class="card" style="overflow-x:auto"><table class="tbl"><thead><tr><th>Date</th><th>Event</th><th>Type</th><th>Location</th><th>Actions</th></tr></thead><tbody>';
    S.aEvents.sort(function(a,b){return a.dt.localeCompare(b.dt)}).forEach(function(e,i){var emoji={exam:'📝',masterclass:'🎓',tasting:'🍷',workshop:'📚'}[e.ty]||'📅';h+='<tr><td style="color:var(--g)">'+e.dt+'</td><td style="font-weight:600">'+emoji+' '+e.t+'</td><td>'+e.ty+'</td><td style="color:var(--t3)">'+e.l+'</td><td><button class="btn btn-o btn-s" onclick="showEditEvent('+i+')">✏️</button> <button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="deleteEvent('+i+')">🗑️</button></td></tr>'});
    h+='</tbody></table></div>';ac.innerHTML=h;

  } else if(aCurTab==='settings'){
    ac.innerHTML='<div class="g2"><div class="card"><div class="h3" style="margin-top:0">Platform Settings</div><div class="field"><label class="lbl">Site Name</label><input class="inp" value="Joval School of Wine"></div><div class="field"><label class="lbl">Contact Email</label><input class="inp" value="jsow@joval.com.au"></div><div class="field"><label class="lbl">Enrolment Mode</label><select class="inp"><option selected>Teacher Managed</option><option>Open</option><option>Invitation Only</option></select></div><div class="field"><label class="lbl">Pass Mark (%)</label><input class="inp" type="number" value="55"></div><button class="btn btn-g" onclick="toast(\'Settings saved!\')">Save</button></div><div class="card"><div class="h3" style="margin-top:0">Notifications</div><div class="field"><label class="lbl">Welcome Email</label><select class="inp"><option selected>Enabled</option><option>Disabled</option></select></div><div class="field"><label class="lbl">Certificate Email</label><select class="inp"><option selected>Enabled</option><option>Disabled</option></select></div><div class="field"><label class="lbl">Quiz Result Email</label><select class="inp"><option selected>Enabled</option><option>Disabled</option></select></div><button class="btn btn-g" onclick="toast(\'Saved!\')">Save</button></div></div><div class="card" style="margin-top:18px;border-color:rgba(198,40,40,.1)"><div class="h3" style="margin-top:0;color:var(--r)">Danger Zone</div><p style="font-size:12px;color:var(--t3);margin-bottom:10px">These actions are irreversible.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-d btn-s" onclick="if(confirm(\'Reset ALL progress?\')){localStorage.removeItem(\'jsow4\');location.reload()}">Reset All Progress</button><button class="btn btn-o btn-s" onclick="toast(\'Exporting...\')">📥 Export Data</button></div></div>';
  }
}

// Admin helpers
function toggleEnrol(sid,cid){var s=S.tStudents.find(function(x){return x.id===sid});if(!s)return;var idx=s.enrolled.indexOf(cid);if(idx>=0)s.enrolled.splice(idx,1);else s.enrolled.push(cid);saveState();renderAdmin();toast(s.name+(idx>=0?' removed from':' enrolled in')+' course')}
function adminUserRow(s){return '<tr><td style="font-weight:600">'+s.name+'</td><td style="color:var(--t3);font-size:11px">'+s.email+'</td><td>Student</td><td>'+s.wset+'</td><td>'+s.enrolled.length+'</td><td><span class="sts '+(s.status==='active'?'sts-ok':'sts-w')+'">'+s.status+'</span></td><td><button class="btn btn-o btn-s" onclick="showEditStudent('+s.id+')">✏️</button> <button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="deleteStudent('+s.id+')">🗑️</button> <button class="btn btn-ghost btn-s" onclick="showAdminResetPw('+s.id+')" style="color:var(--g);border:1px solid var(--g)">🔑 Reset Pwd</button></td></tr>'}
function filterAdminUsers(q){q=q.toLowerCase();var body=$('ausers-body');if(!body)return;body.innerHTML=(q?S.tStudents.filter(function(s){return s.name.toLowerCase().includes(q)||s.email.toLowerCase().includes(q)}):S.tStudents).map(function(s){return adminUserRow(s)}).join('')}
function showAddUser(){showModal('<h2>Add User</h2><div class="row"><div class="field"><label class="lbl">Full Name</label><input class="inp" id="au-name"></div><div class="field"><label class="lbl">Email</label><input class="inp" id="au-email"></div></div><div class="row"><div class="field"><label class="lbl">Role</label><select class="inp"><option>Student</option><option>Teacher</option><option>Admin</option></select></div><div class="field"><label class="lbl">WSET</label><select class="inp" id="au-wset"><option>None</option><option>Level 1</option><option>Level 2</option><option>Level 3</option></select></div></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="addAdminUser()">Add</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function addAdminUser(){var name=($('au-name')||{}).value;var email=($('au-email')||{}).value;if(!name||!email){toast('Fill in all fields');return}S.tStudents.push({id:Date.now(),name:name,email:email,enrolled:[],lessons:0,points:0,lastActive:new Date().toISOString().split('T')[0],status:'active',wset:($('au-wset')||{}).value,notes:0,quizAvg:0});saveState();closeModal();renderAdmin();toast('User added: '+name)}
function showAddPromo(){showModal('<h2>New Promotion</h2><div class="row"><div class="field"><label class="lbl">Code</label><input class="inp" id="ap-code" style="text-transform:uppercase"></div><div class="field"><label class="lbl">Discount %</label><input class="inp" id="ap-disc" type="number" min="1" max="100"></div></div><div class="row"><div class="field"><label class="lbl">Max Uses</label><input class="inp" id="ap-max" type="number"></div><div class="field"><label class="lbl">Expiry</label><input class="inp" id="ap-exp" type="date"></div></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="addPromo()">Create</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function addPromo(){var code=($('ap-code')||{}).value.toUpperCase();if(!code){toast('Enter code');return}S.aPromos.push({id:Date.now(),code:code,disc:parseInt(($('ap-disc')||{}).value)||10,uses:0,maxUses:parseInt(($('ap-max')||{}).value)||100,exp:($('ap-exp')||{}).value||'2026-12-31',status:'Active'});saveState();closeModal();renderAdmin();toast('Promo created: '+code)}
function showEditPromo(i){var p=S.aPromos[i];if(!p)return;showModal('<h2>Edit Promotion</h2><div class="row"><div class="field"><label class="lbl">Code</label><input class="inp" id="ep-code" value="'+p.code+'"></div><div class="field"><label class="lbl">Discount %</label><input class="inp" id="ep-disc" type="number" value="'+p.disc+'"></div></div><div class="row"><div class="field"><label class="lbl">Max Uses</label><input class="inp" id="ep-max" type="number" value="'+p.maxUses+'"></div><div class="field"><label class="lbl">Expiry</label><input class="inp" id="ep-exp" type="date" value="'+p.exp+'"></div></div><div class="field"><label class="lbl">Status</label><select class="inp" id="ep-status"><option '+(p.status==='Active'?'selected':'')+'>Active</option><option '+(p.status==='Paused'?'selected':'')+'>Paused</option><option '+(p.status==='Expired'?'selected':'')+'>Expired</option></select></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="saveEditPromo('+i+')">Save</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function saveEditPromo(i){S.aPromos[i].code=($('ep-code')||{}).value.toUpperCase();S.aPromos[i].disc=parseInt(($('ep-disc')||{}).value);S.aPromos[i].maxUses=parseInt(($('ep-max')||{}).value);S.aPromos[i].exp=($('ep-exp')||{}).value;S.aPromos[i].status=($('ep-status')||{}).value;saveState();closeModal();renderAdmin();toast('Updated!')}
function deletePromo(i){if(confirm('Delete?')){S.aPromos.splice(i,1);saveState();renderAdmin();toast('Deleted')}}
function showAddEvent(){showModal('<h2>New Event</h2><div class="field"><label class="lbl">Title</label><input class="inp" id="ae-title"></div><div class="row"><div class="field"><label class="lbl">Date</label><input class="inp" id="ae-date" type="date"></div><div class="field"><label class="lbl">Type</label><select class="inp" id="ae-type"><option value="exam">Exam</option><option value="masterclass">Masterclass</option><option value="tasting">Tasting</option><option value="workshop">Workshop</option></select></div></div><div class="field"><label class="lbl">Description</label><textarea class="ta" id="ae-desc"></textarea></div><div class="field"><label class="lbl">Location</label><input class="inp" id="ae-loc" value="Joval Melbourne, Abbotsford"></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="addEvent()">Create</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function addEvent(){var title=($('ae-title')||{}).value;if(!title){toast('Enter title');return}S.aEvents.push({dt:($('ae-date')||{}).value,t:title,ty:($('ae-type')||{}).value,d:($('ae-desc')||{}).value,l:($('ae-loc')||{}).value||'Joval Melbourne'});saveState();closeModal();renderAdmin();toast('Event created!')}
function showEditEvent(i){var e=S.aEvents[i];if(!e)return;showModal('<h2>Edit Event</h2><div class="field"><label class="lbl">Title</label><input class="inp" id="ee-title" value="'+e.t+'"></div><div class="row"><div class="field"><label class="lbl">Date</label><input class="inp" id="ee-date" type="date" value="'+e.dt+'"></div><div class="field"><label class="lbl">Type</label><select class="inp" id="ee-type"><option value="exam" '+(e.ty==='exam'?'selected':'')+'>Exam</option><option value="masterclass" '+(e.ty==='masterclass'?'selected':'')+'>Masterclass</option><option value="tasting" '+(e.ty==='tasting'?'selected':'')+'>Tasting</option><option value="workshop" '+(e.ty==='workshop'?'selected':'')+'>Workshop</option></select></div></div><div class="field"><label class="lbl">Description</label><textarea class="ta" id="ee-desc">'+e.d+'</textarea></div><div class="field"><label class="lbl">Location</label><input class="inp" id="ee-loc" value="'+e.l+'"></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="saveEditEvent('+i+')">Save</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function saveEditEvent(i){S.aEvents[i].t=($('ee-title')||{}).value;S.aEvents[i].dt=($('ee-date')||{}).value;S.aEvents[i].ty=($('ee-type')||{}).value;S.aEvents[i].d=($('ee-desc')||{}).value;S.aEvents[i].l=($('ee-loc')||{}).value;saveState();closeModal();renderAdmin();toast('Updated!')}
function deleteEvent(i){if(confirm('Delete?')){S.aEvents.splice(i,1);saveState();renderAdmin();toast('Deleted')}}

// Charts
function initCharts(){
  if(chartsInit)return;chartsInit=true;
  try{
    var g='#C9A84C',r='#9B2335',gn='#388E3C',bl='#42A5F5';var mo=['Jan','Feb','Mar','Apr','May','Jun'];
    var c1=$('ach1'),c2=$('ach2'),c3=$('ach3');
    if(c1)new Chart(c1,{type:'line',data:{labels:mo,datasets:[{label:'Enrollments',data:[42,58,65,78,92,112],borderColor:g,backgroundColor:'rgba(201,168,76,.05)',fill:true,tension:.4,pointBackgroundColor:g,pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#999'}}},scales:{x:{ticks:{color:'#666'},grid:{color:'rgba(255,255,255,.02)'}},y:{ticks:{color:'#666'},grid:{color:'rgba(255,255,255,.02)'}}}}});
    if(c2)new Chart(c2,{type:'bar',data:{labels:mo,datasets:[{label:'Completions',data:[28,35,42,51,64,72],backgroundColor:g,borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#999'}}},scales:{x:{ticks:{color:'#666'},grid:{color:'rgba(255,255,255,.02)'}},y:{ticks:{color:'#666'},grid:{color:'rgba(255,255,255,.02)'}}}}});
    if(c3)new Chart(c3,{type:'doughnut',data:{labels:C.map(function(c){return c.t.split(' ').slice(0,3).join(' ')}),datasets:[{data:C.map(function(c){return c.st}),backgroundColor:[r,g,bl,gn,'#E57373','#81C784','#FFB74D'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#999',font:{size:9}}}}}});
  }catch(e){console.log('Charts:',e)}
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════

function showAdminResetPw(sid){var s=S.tStudents.find(function(x){return x.id===sid});if(!s)return;var tp=generateTempPassword();showModal('<h2>Reset Password</h2><p style="color:var(--t2);margin-bottom:14px">New password for <strong>'+s.name+'</strong></p><div class="field"><label class="lbl">Password</label><input class="inp" id="arp-pw" value="'+tp+'"></div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-g" onclick="applyAdminPw('+s.id+')">Set</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function applyAdminPw(sid){var pw=(document.getElementById('arp-pw')||{}).value;if(!pw||pw.length<6){toast('Min 6 chars');return}var s=S.tStudents.find(function(x){return x.id===sid});if(!s)return;var u=USERS.find(function(x){return x.email===s.email});if(u){hashPassword(pw).then(function(h){u.hash=h;closeModal();toast('Password updated')})}else{hashPassword(pw).then(function(h){USERS.push({email:s.email,hash:h,role:'student',name:s.name,initials:s.name.split(' ').map(function(w){return w[0]}).join('')});closeModal();toast('Account created')})}}

function showAdminLessonMgr(cid){var co=C.find(function(x){return x.id===cid});if(!co)return;var ci=C.indexOf(co);var h='<h2>Lessons \u2014 '+co.t+'</h2>';
co.m.forEach(function(mod,mi){
h+='<div class="mh2" style="display:flex;align-items:center;justify-content:space-between">Module '+(mi+1)+': '+mod.n+'<button class="btn btn-ghost btn-s" onclick="addModuleLesson('+ci+','+mi+')" style="color:var(--g)">+ Add Lesson</button></div>';
mod.l.forEach(function(les,li){
h+='<div class="li2" style="display:flex;align-items:center;gap:6px;padding:10px 12px;margin-bottom:3px;background:var(--bg3);border-radius:8px">';
h+='<span style="font-size:11px;color:var(--t3);min-width:28px">'+(mi+1)+'.'+(li+1)+'</span>';
h+='<strong style="flex:1;font-size:13px">'+les.n+'</strong>';
if(li>0)h+='<button class="btn btn-ghost btn-s" onclick="moveLessonUp('+ci+','+mi+','+li+')" title="Move up">\u25B2</button>';
if(li<mod.l.length-1)h+='<button class="btn btn-ghost btn-s" onclick="moveLessonDown('+ci+','+mi+','+li+')" title="Move down">\u25BC</button>';
h+='<button class="btn btn-o btn-s" onclick="showLessonEditor('+co.id+','+mi+','+li+')">Edit</button>';
h+='<button class="btn btn-ghost btn-s" style="color:var(--r)" onclick="deleteLesson('+ci+','+mi+','+li+')" title="Delete">\uD83D\uDDD1\uFE0F</button>';
h+='</div>'});});
h+='<div style="margin-top:18px"><button class="btn btn-o" onclick="closeModal()">Close</button></div>';showModal(h)}
function showAdminCourseEditor(cid){var co=C.find(function(x){return x.id===cid});if(!co)return;
var oo=USERS.filter(function(u){return u.role==='teacher'}).map(function(u){return '<option value="'+u.email+'"'+(co.ow===u.email?' selected':'')+'>'+u.name+'</option>'}).join('');
showModal('<h2>Edit Course</h2><div class="field"><label class="lbl">Title</label><input class="inp" id="ace-t" value="'+co.t.replace(/"/g,'&quot;')+'"></div><div class="field"><label class="lbl">Owner / Teacher</label><select class="inp" id="ace-ow">'+oo+'</select></div><div class="field"><label class="lbl">Description</label><textarea class="ta" id="ace-d">'+co.d+'</textarea></div><div class="field"><label class="lbl">Duration</label><input class="inp" id="ace-du" value="'+co.du+'"></div><div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-g" onclick="saveAdminCE('+co.id+')">Save</button><button class="btn btn-o" onclick="closeModal()">Cancel</button></div>')}
function saveAdminCE(cid){var co=C.find(function(x){return x.id===cid});if(!co)return;co.t=($('ace-t')||{}).value||co.t;co.d=($('ace-d')||{}).value||co.d;co.du=($('ace-du')||{}).value||co.du;co.ow=($('ace-ow')||{}).value||co.ow;closeModal();renderAdmin();toast('Course updated')}
function adminDeleteCourse(ci){if(!confirm('DELETE "'+C[ci].t+'"? This cannot be undone.'))return;var n=C[ci].t;C.splice(ci,1);renderAdmin();toast('Deleted: '+n)}
