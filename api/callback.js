const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.writeHead(302, { Location: '/' }), res.end();

  const params = new URLSearchParams();
  params.append('client_id', process.env.DISCORD_CLIENT_ID);
  params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.DISCORD_REDIRECT_URI);

  // troca code por access_token
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  const token = await tokenRes.json();
  if (!token.access_token) return res.writeHead(302, { Location: '/?error=token' }), res.end();

  // pega usuário
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });
  const user = await userRes.json();

  // checa se está no servidor (guild)
  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });
  const guilds = await guildsRes.json();
  const guildId = process.env.MY_GUILD_ID || '1438357746813632594';
  const inGuild = Array.isArray(guilds) && guilds.find(g => g.id === guildId);
  if (!inGuild) return res.writeHead(302, { Location: '/?error=not_in_guild' }), res.end();

  // checa roles com BOT_TOKEN
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const STAFF_ROLE_ID = process.env.STAFF_ROLE_ID || '1438357746813632594';
  if (!BOT_TOKEN) return res.writeHead(302, { Location: '/?error=no_bot' }), res.end();

  const memberRes = await fetch(`https://discord.com/api/guilds/${guildId}/members/${user.id}`, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` }
  });
  if (memberRes.status !== 200) return res.writeHead(302, { Location: '/?error=not_member' }), res.end();

  const member = await memberRes.json();
  const hasRole = Array.isArray(member.roles) && member.roles.includes(STAFF_ROLE_ID);
  if (!hasRole) return res.writeHead(302, { Location: '/?error=no_role' }), res.end();

  // sucesso: cria cookie de sessão simples
  const sessionValue = Buffer.from(JSON.stringify({ id: user.id, username: user.username })).toString('base64');
  res.setHeader('Set-Cookie', `sf_sess=${sessionValue}; HttpOnly; Path=/; Max-Age=3600`);

  // redireciona para dashboard
  res.writeHead(302, { Location: '/dashboard.html' });
  res.end();
};
