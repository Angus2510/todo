var express = require('express');
var router = express.Router();
const User = require('../model/userSchema'); // Assuming the user model/schema is defined in 'userSchema'

// Import the JWT library for token verification
const jwt = require('jsonwebtoken');

// Middleware function to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);

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

router.put('/updateOne/:index', verifyToken, async function(req, res, next) {
  try {
    const { index } = req.params;
    const { value } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user.user_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the todo item by index in the 'todo' array
    const todoItem = user.todo[index];

    if (!todoItem) {
      return res.status(404).json({ error: 'Todo item not found' });
    }

    // Update the todo item with the new value
    todoItem.todo = value;

    // Save the updated user object
    await user.save();

    res.json(user);
    console.log("todo updated")
  } catch (error) {
    console.error("An error occurred while updating the todo:", error);
    res.status(500).json({ error: "Failed to update the todo" });
  }
});

module.exports = router;
