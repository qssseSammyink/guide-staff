// util simples para HTTP fetch
const fetch = require('node-fetch');

module.exports = {
  fetchJson: async (url, opts = {}) => {
    const res = await fetch(url, opts);
    const text = await res.text();
    try {
      return { ok: true, status: res.status, json: JSON.parse(text) };
    } catch (e) {
      return { ok: true, status: res.status, text };
    }
  }
};
