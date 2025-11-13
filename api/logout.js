module.exports = (req, res) => {
  res.setHeader('Set-Cookie', `sf_sess=; HttpOnly; Path=/; Max-Age=0`);
  res.json({ ok: true });
};
