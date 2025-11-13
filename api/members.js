const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const cookie = req.headers.cookie || '';
  const session = cookie.split(';').find(c => c.trim().startsWith('sf_sess='));
  if (!session) return res.status(403).json({ ok: false });

  const user = JSON.parse(Buffer.from(session.split('=')[1], 'base64').toString());
  const isStaff = user.id === process.env.OWNER_ID || user.roles?.includes(process.env.STAFF_ROLE_ID);
  if (!isStaff) return res.status(403).json({ ok: false });

  const guildId = process.env.MY_GUILD_ID;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  try {
    // Pega membros do servidor
    const guildRes = await fetch(`https://discord.com/api/guilds/${guildId}/members?limit=1000`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (!guildRes.ok) return res.status(500).json({ ok: false, error: 'Falha ao buscar membros' });

    const members = await guildRes.json();

    // Retorna só username + discriminator + roles
    const data = members.map(m => ({
      username: m.user.username,
      discriminator: m.user.discriminator,
      roles: m.roles
    }));

    res.json({ ok: true, members: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Erro interno' });
  }
};
