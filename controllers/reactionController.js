const db = require('../db');

exports.reactToThread = async (req, res) => {
  const { student_id, thread_id, type_reaction } = req.body;

  if (!student_id || !thread_id || !['like', 'dislike'].includes(type_reaction)) {
    return res.status(400).json({ error: 'Неверные входные данные: студент, тред и реакция обязательны' });
  }

  try {
    const query = `
      INSERT INTO thread_reaction (student_id, thread_id, type_reaction)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE type_reaction = VALUES(type_reaction)
    `;
    const [result] = await db.query(query, [student_id, thread_id, type_reaction]);
    res.status(201).json({ message: 'Реакция сохранена/обновлена', thread_reaction_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при установке реакции на тред' });
  }
};

exports.reactToAnswer = async (req, res) => {
  const { student_id, answer_id, type_reaction } = req.body;

  if (!student_id || !answer_id || !['like', 'dislike'].includes(type_reaction)) {
    return res.status(400).json({ error: 'Неверные входные данные: студент, ответ и реакция обязательны' });
  }

  try {
    const query = `
      INSERT INTO answer_reaction (student_id, answer_id, type_reaction)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE type_reaction = VALUES(type_reaction)
    `;
    const [result] = await db.query(query, [student_id, answer_id, type_reaction]);
    res.status(201).json({ message: 'Реакция сохранена/обновлена', answer_reaction_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при установке реакции на ответ' });
  }
};

exports.deleteThreadReaction = async (req, res) => {
  const { student_id, thread_id } = req.body;

  if (!student_id || !thread_id) {
    return res.status(400).json({ error: 'Необходимы student_id и thread_id для удаления реакции' });
  }

  try {
    // Проверка существования реакции перед удалением
    const [checkResult] = await db.query(
      'SELECT * FROM thread_reaction WHERE student_id = ? AND thread_id = ?',
      [student_id, thread_id]
    );

    if (checkResult.length === 0) {
      return res.status(404).json({ error: 'Реакция не найдена' });
    }

    const [result] = await db.query(
      'DELETE FROM thread_reaction WHERE student_id = ? AND thread_id = ?',
      [student_id, thread_id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Реакция удалена' });
    } else {
      res.status(500).json({ error: 'Не удалось удалить реакцию' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении реакции на тред' });
  }
};

exports.deleteAnswerReaction = async (req, res) => {
  const { student_id, answer_id } = req.body;

  if (!student_id || !answer_id) {
    return res.status(400).json({ error: 'Необходимы student_id и answer_id для удаления реакции' });
  }

  try {
    // Проверка существования реакции перед удалением
    const [checkResult] = await db.query(
      'SELECT * FROM answer_reaction WHERE student_id = ? AND answer_id = ?',
      [student_id, answer_id]
    );

    if (checkResult.length === 0) {
      return res.status(404).json({ error: 'Реакция не найдена' });
    }

    const [result] = await db.query(
      'DELETE FROM answer_reaction WHERE student_id = ? AND answer_id = ?',
      [student_id, answer_id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Реакция удалена' });
    } else {
      res.status(500).json({ error: 'Не удалось удалить реакцию' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении реакции на ответ' });
  }
};

exports.getAnswerReactionsCount = async (req, res) => {
  const { answer_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT type_reaction, COUNT(*) as count 
       FROM answer_reaction 
       WHERE answer_id = ? 
       GROUP BY type_reaction`,
      [answer_id]
    );

    const reactionCount = { like: 0, dislike: 0 };

    rows.forEach(row => {
      if (row.type_reaction === 'like') reactionCount.like = row.count;
      if (row.type_reaction === 'dislike') reactionCount.dislike = row.count;
    });

    res.json(reactionCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении реакций на ответ' });
  }
};

exports.getAllAnswerReactions = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;  // Пагинация по умолчанию

  try {
    const [rows] = await db.query(
      'SELECT * FROM answer_reaction LIMIT ?, ?',
      [(page - 1) * limit, limit]
    );
    res.json({ reactions: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении реакций на ответы' });
  }
};

exports.getAllThreadReactions = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;  // Пагинация по умолчанию

  try {
    const [rows] = await db.query(
      'SELECT * FROM thread_reaction LIMIT ?, ?',
      [(page - 1) * limit, limit]
    );
    res.json({ reactions: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении реакций на треды' });
  }
};


exports.getThreadReactionsByThreadId = async (req, res) => {
  const { thread_id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM thread_reaction WHERE thread_id = ?',
      [thread_id]
    );
    res.json({ reactions: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении реакций на тред' });
  }
};

exports.getAnswerReactionsByAnswerId = async (req, res) => {
  const { answer_id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM answer_reaction WHERE answer_id = ?',
      [answer_id]
    );
    res.json({ reactions: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении реакций на ответ' });
  }
};

exports.getThreadReactionsCount = async (req, res) => {
  const { thread_id } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT type_reaction, COUNT(*) as count 
       FROM thread_reaction 
       WHERE thread_id = ? 
       GROUP BY type_reaction`,
      [thread_id]
    );

    const reactionCount = { like: 0, dislike: 0 };

    rows.forEach(row => {
      if (row.type_reaction === 'like') reactionCount.like = row.count;
      if (row.type_reaction === 'dislike') reactionCount.dislike = row.count;
    });

    res.json(reactionCount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении реакций на тред' });
  }
};

exports.updateReaction = async (req, res) => { // апдейтт реакций на ответ и тред
  const { student_id, thread_id, answer_id, type_reaction } = req.body;

  if (!student_id || (!thread_id && !answer_id) || !['like', 'dislike'].includes(type_reaction)) {
    return res.status(400).json({ error: 'Неверные входные данные' });
  }

  try {
    let query;
    let params;
    let countQuery;
    let countParams;


    if (thread_id) {
      query = `
        INSERT INTO thread_reaction (student_id, thread_id, type_reaction)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE type_reaction = VALUES(type_reaction)
      `;
      params = [student_id, thread_id, type_reaction];
      countQuery = `
        SELECT 
          COALESCE(SUM(CASE WHEN tr.type_reaction = 'like' THEN 1 ELSE 0 END), 0) AS likes,
          COALESCE(SUM(CASE WHEN tr.type_reaction = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
        FROM thread_reaction tr
        WHERE tr.thread_id = ?
      `;
      countParams = [thread_id];
    }

    else if (answer_id) {
      query = `
        INSERT INTO answer_reaction (student_id, answer_id, type_reaction)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE type_reaction = VALUES(type_reaction)
      `;
      params = [student_id, answer_id, type_reaction];
      countQuery = `
        SELECT 
          COALESCE(SUM(CASE WHEN ar.type_reaction = 'like' THEN 1 ELSE 0 END), 0) AS likes,
          COALESCE(SUM(CASE WHEN ar.type_reaction = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
        FROM answer_reaction ar
        WHERE ar.answer_id = ?
      `;
      countParams = [answer_id];
    }

    await db.query(query, params);

    const [counts] = await db.query(countQuery, countParams);

    res.status(200).json({
      message: 'Реакция обновлена',
      likes: counts[0].likes,
      dislikes: counts[0].dislikes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении реакции' });
  }
};