import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
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

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

  try {
    // Add contact to Resend Audience
    if (AUDIENCE_ID) {
      const contactRes = await fetch('https://api.resend.com/audiences/' + AUDIENCE_ID + '/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          unsubscribed: false,
        }),
      });

      if (!contactRes.ok) {
        const err = await contactRes.json();
        console.error('Resend contact error:', err);
        // Don't fail — still send welcome email
      }
    }

    // Send welcome email
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TradingToolsHub <hello@tradingtoolshub.com>',
        to: email.toLowerCase().trim(),
        subject: 'Welcome to TradingToolsHub — Your Weekly Trading Tools Roundup',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0F172A; color: #E2E8F0; padding: 40px 30px; border-radius: 12px;">
            <h1 style="color: #3B82F6; font-size: 24px; margin-bottom: 20px;">Welcome to TradingToolsHub</h1>
            <p style="line-height: 1.7; margin-bottom: 16px;">Thanks for subscribing. Every week, you'll get:</p>
            <ul style="line-height: 2; margin-bottom: 20px;">
              <li>New tool reviews and comparisons</li>
              <li>Pricing changes and deals across trading platforms</li>
              <li>Tips on building a better trading stack</li>
              <li>Prop firm updates and challenge results</li>
            </ul>
            <p style="line-height: 1.7; margin-bottom: 20px;">In the meantime, explore what's already live:</p>
            <a href="https://tradingtoolshub.com/best/best-trading-journals/" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 8px;">Best Trading Journals</a>
            <a href="https://tradingtoolshub.com/best/best-prop-firms/" style="display: inline-block; background: #1E293B; color: #E2E8F0; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; border: 1px solid #334155;">Best Prop Firms</a>
            <p style="line-height: 1.7; margin-top: 30px; font-size: 13px; color: #94A3B8;">You're receiving this because you signed up at tradingtoolshub.com. <a href="https://tradingtoolshub.com" style="color: #3B82F6;">Unsubscribe</a></p>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.json();
      console.error('Resend email error:', err);
      // Contact was added even if welcome email fails
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
