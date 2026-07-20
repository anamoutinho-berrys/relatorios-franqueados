const GRAPH = 'https://graph.facebook.com/v20.0';

module.exports = async function handler(req, res) {
  const token = process.env.TOKEN_META;
  if (!token) {
    res.status(500).json({ error: { message: 'TOKEN_META não configurado nas variáveis de ambiente do Vercel.' } });
    return;
  }

  const { path, ...params } = req.query;
  if (!path) {
    res.status(400).json({ error: { message: 'Parâmetro "path" é obrigatório.' } });
    return;
  }

  const url = new URL(`${GRAPH}/${path}`);
  url.searchParams.set('access_token', token);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    url.searchParams.set(k, Array.isArray(v) ? v[0] : v);
  }

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: { message: e.message } });
  }
};
