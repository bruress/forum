const db = require('../db');

const isModerator = async (student_id) => {
  const [result] = await db.query('SELECT 1 FROM moderator WHERE student_id = ?', [student_id]);
  return result.length > 0;
};


exports.create_thread = async (req, res) => {
  const { student_id, catalog_id, thread_name, thread_text, anonim_state } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO thread (student_id, catalog_id, thread_name, thread_text, created_date, anonim_state) VALUES (?, ?, ?, ?, NOW(), ?)',
      [student_id, catalog_id, thread_name, thread_text, anonim_state]
    );
    res.status(201).json({ thread_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get_all_threads = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, s.student_name AS student_name, g.group_name AS group_name
      FROM thread t
      LEFT JOIN student s ON t.student_id = s.student_id
      LEFT JOIN groups_university g ON s.group_id = g.group_id
    `);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.get_thread_id = async (req, res) => {
  const { thread_id } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM thread WHERE thread_id = ?', [thread_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'тред не найден' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete_thread = async (req, res) => {
  const { student_id, thread_id } = req.body;

  const isMod = await isModerator(student_id);
  if (!isMod) {
    return res.status(403).json({ error: 'вы не модератор' });
  }

  try {
    await db.query('DELETE FROM thread WHERE thread_id = ?', [thread_id]);
    res.status(200).json({ message: 'тред удален' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getThreadsByCatalog = async (req, res) => {
  const { catalog_id } = req.params;

  try {
    const [threads] = await db.query(`
      SELECT t.*, s.student_name AS student_name, g.group_name AS group_name,
             (SELECT COUNT(*) FROM answer a WHERE a.thread_id = t.thread_id) AS answer_count,
             t.created_date
      FROM thread t
      LEFT JOIN student s ON t.student_id = s.student_id
      LEFT JOIN groups_university g ON s.group_id = g.group_id
      WHERE t.catalog_id = ?
      ORDER BY t.created_date DESC
    `, [catalog_id]);

    if (threads.length === 0) {
      return res.status(404).json({ message: 'Треды не найдены' });
    }

    res.json(threads);
  } catch (error) {
    console.error('Ошибка при получении тредов:', error);
    res.status(500).json({ message: 'Ошибка при получении тредов' });
  }
};
