const express = require('express');
require('dotenv/config');
const mongoose = require('mongoose');
const port = 3000;

const app = express();

app.use(express.json({limit: '50mb'}));

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

app.use('/user', userRoute);
app.use('/auth', authRoute);

// Connect to DB
mongoose.connect( process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true },() => { 
  console.log('connected to DB!');
});

console.log("Listening at localhost:3000")
app.listen(process.env.PORT || port);