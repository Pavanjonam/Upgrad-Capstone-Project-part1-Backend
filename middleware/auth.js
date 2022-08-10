const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
  const token = req.header('x-auth-token');
  
  // chances are we don't have a token at all, in this case return 401 response
  if(!token) return res.status(401).send("Please Login first to access this endpoint!");

  // Now verify if this is a valid token 
  try{
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    next(); 
    
  } catch(ex){
    res.status(400).send('Invalid token.'); // 400 bad request 
  }
}

module.exports = auth;
