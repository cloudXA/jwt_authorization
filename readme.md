##  依赖安装
### `npm i nodemon -g `
### `npm i`

## 业务逻辑
* 前端设计出表单收集用户信息，通过字符串的方式传递给后端。后端接收数据后将其存储到数据库，同时根据该数据生成token（小票）。传递给前端。nodejs使用jsonwebtoken的sign
```
根据用户数据user生成token
jwt.sign({user}, 'secretKey', { expiresIn: '60s' }, (err, token) => {
    res.json({
      token
    });
  });
```
* 前端将token可以通过cookie的方式或者vuex再或者直接将token用在会话上面，token通过请求头的authorization的方式传递给后端。
```
前端添加请求头
import axios from 'axios';
import router from './router';

// axios 配置
axios.defaults.timeout = 8000;
axios.defaults.baseURL = 'https://api.github.com';

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.token) { //判断token是否存在
      config.headers.Authorization = 'bear ' + localStorage.token;  //将token设置成请求头
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.errno === 999) {
      router.replace('/');
      console.log("token过期");
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);
export default axios;

```
后端通过verifyToken验证，
```
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
```
```
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
```
此时前端就可以根据token向后端获取数据了

[前端如何通过axios发送请求头authorization](https://juejin.im/post/5bab739af265da0aa3593177)