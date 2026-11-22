// claudopus.ai/api/consent: whether the visitor's country asks for a yes before analytics cookies, from the country Vercel
// gives each request. consent.js shows the banner only on { ask: true }; elsewhere Clarity loads without asking.
// The EU and EEA with the EU's outer regions (French overseas departments, Saint Martin, Åland), the UK with Gibraltar and
// the Crown dependencies, Switzerland, and Turkey, whose cookie rules also ask first. An unknown country asks too.
const ASK = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'GF', 'GP', 'MQ', 'RE', 'YT', 'MF', 'AX',
  'IS', 'LI', 'NO',
  'GB', 'GI', 'GG', 'JE', 'IM',
  'CH', 'TR',
])

export const asks = country => {
  const code = String(country || '').trim().toUpperCase()
  return !code || ASK.has(code)
}

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store')
  res.status(200).json({ ask: asks(req.headers['x-vercel-ip-country']) })
}
