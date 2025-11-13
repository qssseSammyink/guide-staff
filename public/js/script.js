async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  return res.json();
}

function addLog(text) {
  const logs = document.getElementById('logs');
  const li = document.createElement('li');
  li.textContent = text;
  logs.prepend(li);
}

async function initDashboard() {
  const s = await fetchJson('/api/session');
  if (!s.ok) return window.location.href = '/';

  const user = s.user;
  document.getElementById('user-avatar').src = user.avatarURL || '';
  document.getElementById('user-tag').textContent = `${user.username}#${user.discriminator}`;
  document.getElementById('user-id').textContent = `ID: ${user.id}`;
  document.getElementById('user-roles').textContent = user.roles.join(', ');

  const staffCheck = await fetchJson('/api/isStaff');
  if (!staffCheck.ok) {
    alert('Você não tem acesso Staff');
    window.location.href = '/';
    return;
  }

  document.getElementById('btnKick').onclick = () => addLog('Usuário expulso (simulado)');
  document.getElementById('btnBan').onclick = () => addLog('Usuário banido (simulado)');
  document.getElementById('btnMute').onclick = () => addLog('Usuário silenciado (simulado)');
  document.getElementById('btnWarn').onclick = () => addLog('Usuário avisado (simulado)');
  document.getElementById('btnReport').onclick = () => addLog('Relatório gerado (simulado)');
  document.getElementById('btnLogout').onclick = async () => {
    await fetchJson('/api/logout');
    window.location.href = '/';
  };

  addLog('Dashboard carregado com sucesso!');
}

initDashboard();
