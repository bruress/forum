const path = require('path'); 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

dotenv.config();

app.use(session({
  secret: 'meow', 
  resave: false,
  saveUninitialized: true,  
  cookie: { secure: false } 
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const threadRoutes = require('./routes/threadRoutes');
const answerRoutes = require('./routes/answerRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const studentRoutes = require('./routes/studentRoutes');
const reactionRoutes = require('./routes/reactionRoutes');
const inviteRoutes = require('./routes/inviteRoutes');
const moderationRoutes = require('./routes/moderationRoutes');
const groupsRoutes = require('./routes/groupsRoutes');

app.use('/api/threads', threadRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/catalogs', catalogRoutes);
app.use('/api/reactions', reactionRoutes); 
app.use('/api/student', studentRoutes);   
app.use('/api/student/invite', inviteRoutes); 
app.use('/api/moderation', moderationRoutes);  
app.use('/api/groups', groupsRoutes);

app.use(express.static(path.join(__dirname, 'frontend', 'sign_in_sign_up')));
app.use(express.static(path.join(__dirname, 'frontend', 'main')));
app.use(express.static(path.join(__dirname, 'frontend', 'create_post')));
app.use(express.static(path.join(__dirname, 'frontend', 'in_catalog')));
app.use(express.static(path.join(__dirname, 'frontend', 'add_answer')));
app.use(express.static(path.join(__dirname, 'frontend', 'error')));


app.get('/', (req, res) => {
  res.send('ПОБЕДА!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ПОРТ: ${PORT}`);
});
