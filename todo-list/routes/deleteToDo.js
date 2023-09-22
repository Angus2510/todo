var express = require('express');
var router = express.Router();
const User = require('../model/userSchema');

// Import the JWT library for token verification
const jwt = require('jsonwebtoken');

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Attach the decoded token payload to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.delete('/delete/:index', verifyToken, async function(req, res, next) {
  try {
    const { index } = req.params;

    // Find the user by ID
    const user = await User.findById({_id: req.user.user_id});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the todo item by index in the 'todo' array
    const todoItem = user.todo[index];

    if (!todoItem) {
      return res.status(404).json({ error: 'Todo item not found' });
    }

    // Remove the todo item from the array
    user.todo.splice(index, 1);

    // Save the updated user object
    await user.save();

    res.json({ message: 'Todo deleted successfully' });
    console.log('Todo deleted');
  } catch (error) {
    console.error("An error occurred while deleting the todo:", error);
    res.status(500).json({ error: "Failed to delete the todo" });
  }
});

module.exports = router;
