const crypto = require('crypto');
const db = require('../db');

const generate = () => {
  return crypto.randomBytes(3).toString('hex');
};

exports.generate_link = async (req, res) => {
  const { group_id } = req.body;
  const invite_code = generate();

  if (!group_id) {
    return res.status(400).json({ error: 'group_id обязательно' });
  }

  try {
    const [existingInvite] = await db.query('SELECT * FROM invite_link WHERE invite_code = ?', [invite_code]);

    if (existingInvite.length > 0) {
      return res.status(409).json({ error: 'Этот инвайт-код уже существует' });
    }

    await db.query(
      'INSERT INTO invite_link (invite_code, group_id, is_active) VALUES (?, ?, ?)',
      [invite_code, group_id, 1]
    );

    res.status(201).json({
      message: 'Инвайт-код создан',
      invite_code
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
};

exports.generate_links = async (req, res) => {
  const { group_id, count } = req.body;

  if (!group_id || !count || isNaN(count) || count < 1) {
    return res.status(400).json({ error: 'Неправильный group_id или count (должен быть > 0)' });
  }

  const inviteCodes = [];

  try {
    for (let i = 0; i < count; i++) {
      const code = generate();

      const [existingInvite] = await db.query('SELECT * FROM invite_link WHERE invite_code = ?', [code]);

      if (existingInvite.length > 0) {
        i--; 
        continue;
      }

      await db.query(
        'INSERT INTO invite_link (invite_code, group_id, is_active) VALUES (?, ?, ?)',
        [code, group_id, 1]
      );

      inviteCodes.push({ invite_code: code });
    }

    res.status(201).json({
      message: `Создано ${count} инвайтов`,
      invites: inviteCodes
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при массовой генерации', details: err.message });
  }
};
