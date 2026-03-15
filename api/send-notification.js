export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { authorName, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8234168902:AAErlAX-JoJxBBLk5SNvkykKgEyb3R4mCY8';
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7600441724';

  const message = `💬 새 메시지!\n\n작성자: ${authorName || '알 수 없음'}\n내용: ${content}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
