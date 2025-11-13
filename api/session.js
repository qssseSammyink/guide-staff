// Rota para checar se o usuário está logado (cookie)
module.exports = (req, res) => {
  const cookie = (req.headers.cookie || '')
    .split(';')
    .map(s => s.trim())
    .find(s => s.startsWith('sf_sess='));

  if (!cookie) return res.json({ ok: false });

  try {
    const val = cookie.split('=')[1];
    const json = JSON.parse(Buffer.from(val, 'base64').toString('utf8'));
    return res.json({ ok: true, user: json });
  } catch (e) {
    return res.json({ ok: false });
  }
};
