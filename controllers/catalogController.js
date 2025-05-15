const db = require('../db');

exports.get_all_catalogs = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT catalog_id, name_catalog FROM catalog');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get_catalog_id = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM catalog WHERE catalog_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Каталог не найден' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getThreadsByCatalogs = async (req, res) => {
  try {
    const catalogIds = req.query.catalogs?.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

    if (!catalogIds || catalogIds.length === 0) {
      return res.status(400).json({ error: 'Не переданы ID каталогов' });
    }

    const placeholders = catalogIds.map(() => '?').join(', ');

    const sql = `
      SELECT t.*, s.student_name AS student_name, g.group_name AS group_name,
             (SELECT COUNT(*) FROM answer a WHERE a.thread_id = t.thread_id) AS answer_count,
             t.created_date
      FROM thread t
      LEFT JOIN student s ON t.student_id = s.student_id
      LEFT JOIN groups_university g ON s.group_id = g.group_id
      WHERE t.catalog_id IN (${placeholders})
      ORDER BY t.created_date DESC
    `;

    const [threads] = await db.query(sql, catalogIds);

    res.status(200).json(threads);
  } catch (error) {
    console.error('Ошибка при получении тредов по каталогам:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};


