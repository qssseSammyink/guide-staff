module.exports = async (req, res) => {
  const cookie = req.headers.cookie || '';
  const session = cookie.split(';').find(c => c.trim().startsWith('sf_sess='));
  if (!session) return res.status(403).json({ ok: false });

  const user = JSON.parse(Buffer.from(session.split('=')[1], 'base64').toString());
  const isStaff = user.id === process.env.OWNER_ID || user.roles?.includes(process.env.STAFF_ROLE_ID);
  if (!isStaff) return res.status(403).json({ ok: false });

  const members = [
    { username: 'Aster#0001' },
    { username: 'Nova#1234' },
    { username: 'Celestial#5678' }
  ];

  res.json({ ok: true, members });
};
