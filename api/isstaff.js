module.exports = async (req, res) => {
  const cookie = req.headers.cookie || '';
  const session = cookie.split(';').find(c => c.trim().startsWith('sf_sess='));
  if (!session) return res.json({ ok: false });

  const user = JSON.parse(Buffer.from(session.split('=')[1], 'base64').toString());
  const isStaff = user.id === process.env.OWNER_ID || user.roles?.includes(process.env.STAFF_ROLE_ID);
  res.json({ ok: !!isStaff });
};
