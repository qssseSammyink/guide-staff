// dashboard client: checa sessão curta via /api/session
async function fetchJson(path){
  const res = await fetch(path, { credentials: 'same-origin' });
  return res.json();
}

async function init(){
  // checar sessão; se não estiver logado -> volta ao index
  const s = await fetchJson('/api/session');
  if (!s.ok) return window.location.href = '/';
  // exibir user
  document.getElementById('userInfo').textContent = s.user.username + ' (Discord)';
}

document.getElementById && init();

// logout
if (document.getElementById('logoutBtn')){
  document.getElementById('logoutBtn').addEventListener('click', async ()=>{
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
    window.location.href = '/';
  });
}

// fetch members (opcional - fake)
if (document.getElementById('btnFetch')){
  document.getElementById('btnFetch').addEventListener('click', async ()=>{
    const m = ['Aster#0001','LunaFur#2233','NovaFemboy#9999','CelestialFox#1111'];
    document.getElementById('members').innerHTML = m.map(x=>'<li>'+x+'</li>').join('');
    document.getElementById('info').textContent = 'Dados atualizados em ' + new Date().toLocaleString();
  });
}
