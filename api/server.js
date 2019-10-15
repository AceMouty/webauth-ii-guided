const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
// express-sessions
const sessions = require('express-session')
// kenx sessions
const knexSessionStore = require('connect-session-knex')(sessions)

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knexConfig = require('../database/dbConfig');

const server = express();

// session config
const sessionConfig = {
  name: "session_cookie", // default would be sid but you NEVER leave the default
  secret: "keep it secrect, keep it safe", // use a env var for this in prod
  cookie: {
    httpOnly: true, //JS can NOT access the cookie
    maxAge: 1000 * 60 * 60, // experation time in ms
    secure: false, // setting to be used as https OR http. True in prod
  },
  resave: false,
  saveUninitialized: true, // GDP laws prevent this being true, set to false in prod
  // change to use our database instead of memeory to save the sessions
  store: new knexSessionStore({
    knex: knexConfig, // this is how you talk to the DB
    createtable: true, // create us a session table in the DB
    clearInterval: 1000 * 60 * 30 // clear out old sessions every 30 min
  })
}

// Global middleware
server.use(sessions(sessionConfig))
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;
