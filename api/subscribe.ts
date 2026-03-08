import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'https://tradingtoolshub.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const EO_API_KEY = process.env.EO_API_KEY;
  const EO_LIST_ID = process.env.EO_LIST_ID;

  if (!EO_API_KEY || !EO_LIST_ID) {
    console.error('EmailOctopus not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const eoRes = await fetch(`https://emailoctopus.com/api/1.6/lists/${EO_LIST_ID}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: EO_API_KEY,
        email_address: cleanEmail,
        status: 'SUBSCRIBED',
      }),
    });

    const responseBody = await eoRes.json();

    if (eoRes.ok) {
      return res.status(200).json({ success: true });
    }

    if (responseBody?.error?.code === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
      return res.status(200).json({ success: true });
    }

    console.error('EmailOctopus error:', JSON.stringify(responseBody));
    return res.status(500).json({ error: 'Failed to subscribe' });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
