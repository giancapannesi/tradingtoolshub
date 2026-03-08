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

  const KIT_API_KEY = process.env.KIT_API_KEY;
  if (!KIT_API_KEY) {
    console.error('KIT_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const KIT_FORM_ID = process.env.KIT_FORM_ID;
  const cleanEmail = email.toLowerCase().trim();

  try {
    // Step 1: Create subscriber in Kit
    const createRes = await fetch('https://api.kit.com/v4/subscribers', {
      method: 'POST',
      headers: {
        'X-Kit-Api-Key': KIT_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: cleanEmail,
        fields: {
          'Source': 'tradingtoolshub.com footer',
        },
      }),
    });

    if (!createRes.ok && createRes.status !== 200) {
      const err = await createRes.json();
      console.error('Kit create subscriber error:', err);
      return res.status(500).json({ error: 'Failed to subscribe' });
    }

    // Step 2: Add subscriber to form (triggers automations/welcome sequence)
    if (KIT_FORM_ID) {
      const formRes = await fetch(`https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers`, {
        method: 'POST',
        headers: {
          'X-Kit-Api-Key': KIT_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: cleanEmail,
        }),
      });

      if (!formRes.ok && formRes.status !== 200) {
        const err = await formRes.json();
        console.error('Kit add to form error:', err);
        // Subscriber was still created, just not added to form
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
