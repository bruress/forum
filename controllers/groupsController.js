const db = require('../db'); 
exports.getAllGroups = async (req, res) => {
    try {
        const [groups] = await db.query('SELECT * FROM groups_university');
        res.status(200).json(groups);
    } catch (error) {
        console.error('Ошибка при получении групп:', error);
        res.status(500).json({ error: 'Ошибка сервера при получении групп' });
    }
};

exports.getGroupById = async (req, res) => {
    const groupId = req.params.group_id;
    try {
        const [rows] = await db.query('SELECT * FROM groups_university WHERE group_id = ?', [groupId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ error: 'Группа не найдена' });
        }
    } catch (error) {
        console.error('Ошибка при получении группы:', error);
        res.status(500).json({ error: 'Ошибка сервера при получении группы' }); 
    }
    
};


exports.createGroup = async (req, res) => {
    const { group_name } = req.body;
    if (!group_name) {
        return res.status(400).json({ error: 'Название группы обязательно' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO groups_university (group_name) VALUES (?)',
            [group_name]
        );
        res.status(201).json({
            message: 'Группа успешно создана',
            group: {
                group_id: result.insertId,
                group_name
            }
        });
    } catch (error) {
        console.error('Ошибка при создании группы:', error);
        res.status(500).json({ error: 'Ошибка сервера при создании группы' });
    }
};


exports.updateGroup = async (req, res) => {
    const { group_id } = req.params;
    const { group_name } = req.body;

    if (!group_name) {
        return res.status(400).json({ error: 'Название группы обязательно для обновления' });
    }

    try {
        const [result] = await db.query(
            'UPDATE groups_university SET group_name = ? WHERE group_id = ?',
            [group_name, group_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Группа не найдена' });
        }
        res.status(200).json({ message: 'Группа успешно обновлена' });
    } catch (error) {
        console.error('Ошибка при обновлении группы:', error);
        res.status(500).json({ error: 'Ошибка сервера при обновлении группы' });
    }
};

exports.deleteGroup = async (req, res) => {
    const { group_id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM groups_university WHERE group_id = ?',
            [group_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Группа не найдена' });
        }
        res.status(200).json({ message: 'Группа успешно удалена' });
    } catch (error) {
        console.error('Ошибка при удалении группы:', error);
        res.status(500).json({ error: 'Ошибка сервера при удалении группы' });
    }
};
