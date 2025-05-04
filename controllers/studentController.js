const db = require('../db');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { invite_code, student_name, login, password } = req.body;

  if (!invite_code || !student_name || !login || !password) {
    return res.status(400).json({ error: 'заполните все поля: invite_code, student_name, login, password' });
  }

  try {
    const [invite] = await db.query(
      'SELECT * FROM invite_link WHERE invite_code = ? AND is_active = 1',
      [invite_code]
    );

    if (invite.length === 0) {
      return res.status(400).json({ error: 'неверный или неактивный инвайт-код' });
    }

    const group_id = invite[0].group_id;

    const [existing] = await db.query(
      'SELECT * FROM student WHERE login = ?',
      [login]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'пользователь с таким логином уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO student (group_id, invite_code, student_name, login, password) VALUES (?, ?, ?, ?, ?)',
      [group_id, invite_code, student_name, login, hashedPassword]
    );

    await db.query(
      'UPDATE invite_link SET is_active = 0 WHERE invite_code = ?',
      [invite_code]
    );

    res.status(201).json({
      message: 'регистрация прошла успешно',
      student_id: result.insertId
    });

  } catch (err) {
    console.error('ошибка при регистрации:', err);
    res.status(500).json({ error: 'Ошибка на сервере', details: err.message });
  }
};

exports.login = async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: 'логин и пароль обязательны' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM student WHERE login = ?',
      [login]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'неверные данные' });
    }

    const match = await bcrypt.compare(password, rows[0].password);

    if (!match) {
      return res.status(401).json({ error: 'неверный пароль' });
    }

    res.json({
      message: 'вход успешен',
      student: {
        id: rows[0].student_id,  
        name: rows[0].student_name,
        login: rows[0].login,
        group_id: rows[0].group_id
      }
    });

  } catch (err) {
    console.error('ошибка при входе:', err);
    res.status(500).json({ error: 'ERROR', details: err.message });
  }
};

exports.delete_student = async (req, res) => {
  const { student_id } = req.body;

  if (!student_id) {
    return res.status(400).json({ error: 'укажите student_id' });
  }

  try {
    const [result] = await db.query(
      'DELETE FROM student WHERE student_id = ?',
      [student_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'студент не найден' });
    }

    res.status(200).json({ message: 'студент удален из базы данных' });
  } catch (err) {
    console.error('ошибка:', err);
    res.status(500).json({ error: 'ошибка сервера', details: err.message });
  }
};

exports.get_all_students = async (req, res) => {
  try {
    const [students] = await db.query('SELECT student_id, student_name, login, group_id FROM student');
    res.status(200).json({ students });
  } catch (err) {
    console.error('ошибка:', err);
    res.status(500).json({ error: 'ошибка сервера', details: err.message });
  }
};


exports.get_student_id = async (req, res) => {
  const { student_id } = req.params;

  try {
    const [rows] = await db.query('SELECT student_id, student_name, login, group_id FROM student WHERE student_id = ?', [student_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'студент не найден' });
    }
    res.status(200).json({ student: rows[0] });
  } catch (err) {
    console.error('ошибка:', err);
    res.status(500).json({ error: 'ошибка сервера', details: err.message });
  }
};
