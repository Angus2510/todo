var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const todo = require('../model/userSchema');

// Import the JWT library for token verification
const jwt = require('jsonwebtoken');

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
// console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY); 
    // Attach the decoded token payload to the request object
    req.user = decoded;
    //console.log(decoded);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/get', verifyToken, async function(req, res, next) {
  try {
    const todos = await todo.findById({_id: req.user.user_id});
    //console.log(todos);
    // let data = todos.map(todo => {
    //   return { first: todo.first_name, todo: todo.todo, id: todo._id };
    res.json({todo: todos.todo});
  } catch (error) {
    console.error('An error occurred while fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

module.exports = router;
