const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Discord API proxy routes
const DISCORD_API_BASE = 'https://discord.com/api/v10';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.warn('⚠️ DISCORD_BOT_TOKEN not set! API calls will fail.');
}

// Get bot info
app.get('/api/bot', async (req, res) => {
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to get bot info' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Bot API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
app.get('/api/user/:userId', async (req, res) => {
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    const { userId } = req.params;
    const response = await fetch(`${DISCORD_API_BASE}/users/${userId}`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'User not found' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('User API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile with full details
app.get('/api/user/:userId/profile', async (req, res) => {
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    const { userId } = req.params;
    const response = await fetch(`${DISCORD_API_BASE}/users/${userId}/profile`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Profile not found' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Profile API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bot's guilds
app.get('/api/guilds', async (req, res) => {
  if (!BOT_TOKEN) {
    return res.status(500).json({ error: 'Bot token not configured' });
  }

  try {
    const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to get guilds' });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Guilds API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    botConfigured: !!BOT_TOKEN,
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Discord Profile Designer ready!`);
  console.log(`🤖 Bot ${BOT_TOKEN ? 'configured' : 'NOT configured'}`);
});