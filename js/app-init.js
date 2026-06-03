// JSOW v9 - Init
function init(){
  try{localStorage.removeItem('jsow3');localStorage.removeItem('jsow4');localStorage.removeItem('jsow5');localStorage.removeItem('jsow6');localStorage.removeItem('jsow7');localStorage.removeItem('jsow8')}catch(e){}
  loadState();
  if(S.user&&S.role){
    if(S.session&&S.session.expires&&Date.now()>S.session.expires){S.user=null;S.role=null;S.session=null;saveState();document.getElementById('login').style.display='flex';return}
    var user=USERS.find(function(u){return u.email===S.user.email});
    if(user){showApp(user);return}
    S.user=null;S.role=null;S.session=null;saveState();
  }
  document.getElementById('login').style.display='flex';
}
document.addEventListener('DOMContentLoaded',init);
document.addEventListener('click',function(e){if(e.target.id==='modal')closeModal()});
