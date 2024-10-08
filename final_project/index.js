const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.session.token || req.headers['authorization'];

  if (!token) {
     return res.status(403).send("Access denied, no token provided");
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
     if (err) {
        return res.status(401).send("Invalid token");
     }
     req.user = decoded; // Store user info for next middleware
     next(); // Proceed to the next middleware/route handler
  });
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
