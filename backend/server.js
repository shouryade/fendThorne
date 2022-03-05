import express from "express"
const app = express(); // Create an ExpressJS app
// const bodyParser = require('body-parser'); // Middleware

import{ useArcanaAuth} from "./user-login.js"
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {

  useArcanaAuth();
});


// Route to Login Page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});

app.post('/login', (req, res) => {
  // Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  res.send(`Username: ${username} Password: ${password}`);
});

const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
