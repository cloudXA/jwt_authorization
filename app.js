const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// Verify Token 
function verifyToken(req, res, next) {
  // Get auth header value 
  const bearerHeader = req.headers['authorization'];
  // check if bearer is undefiend 
  if (typeof bearerHeader !== 'undefined') {
    //split at the space 
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    //Set the token
    req.token = bearerToken;
    //Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

// 前端将token放在authorization请求头，请求protected route 
app.post('/api/posts', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created ...',
        authData
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
    id: 1, 
    username: 'brad',
    email: 'brad@email.com'
  }

  // 生成user信息的token，返回给前端token
  jwt.sign({user}, 'secretKey', { expiresIn: '60s' }, (err, token) => {
    res.json({
      token
    });
  });
});




app.listen(5000, () => console.log('server started on port 5000'))