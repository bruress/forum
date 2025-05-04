const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/register-invite', studentController.register);
router.post('/login', studentController.login);
router.get('/students', studentController.get_all_students);
router.get('/students/:student_id', studentController.get_student_id);
router.delete('/students', studentController.delete_student);
module.exports = router;
