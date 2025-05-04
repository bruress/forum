const db = require('../db');

exports.create_answer = async (req, res) => {
  const { thread_id, student_id, answer_text, anonim_state = 0 } = req.body;

  if (!thread_id || !student_id || !answer_text) {
    return res.status(400).json({ error: 'Заполните все обязательные поля (thread_id, student_id, answer_text)' });
  }
  const anon = anonim_state === 1 ? 1 : 0;
  try {
    const insertQuery = `
      INSERT INTO answer (thread_id, student_id, answer_text, created_date, anonim_state)
      VALUES (?, ?, ?, NOW(), ?)
    `;
    const [insertResult] = await db.query(insertQuery, [thread_id, student_id, answer_text, anon]);
    const groupQuery = `
      SELECT g.group_name 
      FROM student s
      JOIN groups_university g ON s.group_id = g.group_id
      WHERE s.student_id = ?
    `;
    const [groupResult] = await db.query(groupQuery, [student_id]);
    const groupName = groupResult.length > 0 ? groupResult[0].group_name : 'Группа не указана';
    res.status(201).json({
      message: 'Ответ успешно добавлен',
      answer: {
        answer_id: insertResult.insertId,
        thread_id,
        student_id,
        answer_text,
        anonim_state: anon,
        created_date: new Date(),
        group_name: groupName
      }
    });
  } 
  catch (err) {
    console.error('Ошибка при добавлении ответа:', err);

    res.status(500).json({
      error: 'Ошибка сервера при создании ответа',
    });
  }
};

exports.get_answers = async (req, res) => {
  const { thread_id } = req.params;
  try {
    const getAnswersQuery = `
      SELECT 
        a.answer_id, 
        a.thread_id, 
        a.student_id, 
        a.answer_text, 
        a.created_date, 
        a.anonim_state, 
        s.student_name AS author_name,
        g.group_name
      FROM answer a
      LEFT JOIN student s ON a.student_id = s.student_id
      LEFT JOIN groups_university g ON s.group_id = g.group_id
      WHERE a.thread_id = ?
    `;
    const [rows] = await db.query(getAnswersQuery, [thread_id]);
    if (rows.length > 0) {
      res.json(rows);
    } 
    else {
      res.status(404).json({ error: 'Ответы не найдены для данного поста' });
    }
  } 
  catch (err) {
    console.error('Ошибка при получении ответов:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении ответов' });
  }
};

exports.get_answer_id = async (req, res) => {
  const { answer_id } = req.params;
  try {
    const query = `
      SELECT a.answer_id, a.thread_id, a.student_id, a.answer_text, a.created_date, a.anonim_state, g.group_name
      FROM answer a
      LEFT JOIN student s ON a.student_id = s.student_id
      LEFT JOIN groups_university g ON s.group_id = g.group_id
      WHERE a.answer_id = ?
    `;
    const [rows] = await db.query(query, [answer_id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } 
    else {
      res.status(404).json({ error: 'Ответ не найден' });
    }
  } 
  catch (err) {
    logger.error('Ошибка при получении ответа по ID:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении ответа' });
  }
};

exports.delete_answer = async (req, res) => {
  const { answer_id } = req.params;
  const { student_id } = req.body;
  if (!student_id || !answer_id) {
    return res.status(400).json({ error: 'Необходимы student_id и answer_id' });
  }
  try {
    const isMod = await isModerator(student_id);
    if (!isMod) {
      return res.status(403).json({ error: 'Вы не модератор' });
    }
    const [result] = await db.query('DELETE FROM answer WHERE answer_id = ?', [answer_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ответ для удаления не найден' });
    }
    res.status(200).json({ message: 'Ответ успешно удалён' });
  } 
  catch (err) {
    logger.error('Ошибка при удалении ответа:', err);
    res.status(500).json({ error: 'Ошибка сервера при удалении ответа' });
  }
};

