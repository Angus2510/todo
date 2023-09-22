var express = require('express');
var router = express.Router();
const User = require('../model/userSchema'); // Assuming the user model/schema is defined in 'userSchema'

// Import the JWT library for token verification
const jwt = require('jsonwebtoken');

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }else {

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Attach the decoded token payload to the request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
};

router.post('/add', verifyToken, async function (req, res, next) {
  try {
    const { value } = req.body;
    console.log(value);
    
   
    // Find the user by ID
    const user = await User.findById({_id: req.user.user_id});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newTodo = {
      todo: value.todo, 
      id: user.todo.length + 1}

    // Push the new todo into the 'todo' array
    user.todo.push(value);

    // Save the updated user object
    await user.save();

    console.log(user);
    res.json(user.todo);
    
  } catch (error) {
    console.error('An error occurred while adding the todo:', error);
    res.status(500).json({ error: 'Failed to add the todo' });
    
  }
});

module.exports = router;