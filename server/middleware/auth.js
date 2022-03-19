const models = require('../models');
const Promise = require('bluebird');

const queryToSession = queryResult => (
  {
    id: queryResult.id,
    hash: queryResult.hash,
    userId: queryResult.userId,
    user: queryResult.user
  }
);

const createSession = (req, res, next) => {
  models.Sessions.create()
    .then(result => models.Sessions.get({id: result.insertId}))
    .then(session => {
      req.session = { id: session.id, hash: session.hash, userId: session.userId };
      req.cookies.shortlyid = session.hash;
      res.cookie('shortlyid', session.hash, { maxAge: (1000 * 60 * 60), path: '/' });
      next();
    });
};

module.exports.createSession = (req, res, next) => {
  // res.cookie('shortlyid', 'heehoodd', { maxAge: (1000 * 60 * 60), path: '/' });
  if (Object.keys(req.cookies).length === 0) {
    createSession(req, res, next);
  } else {
    models.Sessions.get({hash: req.cookies.shortlyid})
      .then(sessionQuery => {
        if (sessionQuery) {
          req.session = queryToSession(sessionQuery);
          next();
        } else {
          createSession(req, res, next);
        }
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

module.exports.logIn = (req, res, next) => {

};