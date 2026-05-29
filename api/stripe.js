import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, ...params } = req.body;

  try {
    if (action === 'createCheckout') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: params.items,
        mode: params.mode || 'subscription',
        success_url: params.success_url,
        cancel_url: params.cancel_url,
      });
      return res.status(200).json({ url: session.url });
    }

    res.status(400).json({ error: 'Action inconnue' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
