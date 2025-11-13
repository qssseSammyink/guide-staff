async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  return res.json();
}

async function initDashboard() {
  const s = await fetchJson('/api/session');
  if (!s.ok) return window.location.href = '/';
  
  const user = s.user;
  document.getElementById('welcome').textContent = `Bem-vindo, ${user.username}!`;

  // Checa se é Staff ou Owner via backend
  const staffCheck = await fetchJson('/api/isStaff');
  if (!staffCheck.ok) {
    document.getElementById('staff-panel').style.display = 'none';
    document.getElementById('not-staff').style.display = 'block';
    return;
  }

  document.getElementById('staff-panel').style.display = 'block';
  document.getElementById('not-staff').style.display = 'none';

  // Pega membros do servidor
  const membersRes = await fetchJson('/api/members');
  const membersList = document.getElementById('members');
  if (membersRes.ok) {
    membersList.innerHTML = membersRes.members.map(u => `<li>${u.username}</li>`).join('');
  }

  // Botões Staff
  document.getElementById('btnKick').onclick = () => alert('Usuário expulso (simulado)');
  document.getElementById('btnBan').onclick = () => alert('Usuário banido (simulado)');
  document.getElementById('btnLogout').onclick = async () => {
    await fetchJson('/api/logout');
    window.location.href = '/';
  };
}

initDashboard();
