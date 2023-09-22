require("dotenv").config();
require("./config/database").connect();
const axios = require("axios")
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const User = require("./model/userSchema");
const auth = require("./middleware/auth");
const addToDo = require("./routes/addToDo")
const deleteTodo =require("./routes/deleteToDo")
const editToDo = require("./routes/editToDo")
const getToDo = require("./routes/getToDo")


const app = express();

app.use(express.json());
app.use(cors())

app.use('/addToDo', addToDo)
app.use('/deleteToDo', deleteTodo)
app.use('/editToDo', editToDo)
app.use('/getToDo', getToDo)


app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      return res.status(400).send("All input is required");
    }
    
    // Check if user already exists
    // Validate if user exists in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = new User({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    const result = await user.save();
    console.log(result);

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    const data = {token: token, first_name: user.first_name}
    // Save user token
    user.token = token;

    // Return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    
    // Validate if user exists in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
        // console.log(user);
      // Save user token
      // user.token = token;
      const data = {token: token, first_name: user.first_name}
      // console.log(data);

      // Return user
      return res.status(200).json(data);
    }

    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// Check if the task exceeds 140 characters.
app.use((req, res, next) => {
  if (req.body.title && req.body.title.length > 140) {
    return res.status(400).send("Task cannot exceed 140 characters");
  }
  
  // Check if the request is of the JSON content type.
  if (req.headers["content-type"] !== "application/json") {
    return res.status(415).send("Unsupported media type");
  }
  
  // Move to the next middleware function.
  next();
});

// This should be the last route, else any route after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;
