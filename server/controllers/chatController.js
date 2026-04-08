// @desc  Chat with AI assistant
// @route POST /api/chat
// @access Private
const chat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  try {
    // Dynamically import so the server starts even without an API key
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are LifeOS AI Assistant – a friendly personal productivity coach. ' +
            'Help users with tasks, goals, expense tracking, diary reflections, and overall life management. ' +
            'Keep responses concise and actionable.',
        },
        { role: 'user', content: message },
      ],
      max_tokens: 500,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI error:', error.message);
    res.status(500).json({ message: 'AI service error. Please check your OPENAI_API_KEY.' });
  }
};

module.exports = { chat };
