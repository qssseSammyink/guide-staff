module.exports = (req, res) => {
  const cookie = (req.headers.cookie || '').split(';').find(c => c.trim().startsWith('sf_sess='));
  if (!cookie) return res.json({ ok: false });

  try {
    const val = cookie.split('=')[1];
    const json = JSON.parse(Buffer.from(val, 'base64').toString());
    return res.json({ ok: true, user: json });
  } catch {
    return res.json({ ok: false });
  }
};
