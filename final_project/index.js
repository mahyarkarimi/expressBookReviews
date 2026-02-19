const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(403).json({message: "Authorization header is required"});
    }
    const token = authorization.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(403).json({message: "Token is required"});
    }
    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({message: "Invalid token"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
