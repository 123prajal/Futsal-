const express = require("express");
const app = express();
const PORT = 7000;
const mongoose = require("mongoose");
const route = require('./routes/users');
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/Futsal_App' })
}));

app.use('/', route);

mongoose.connect("mongodb://localhost:27017/Futsal_App")
    .then(() => {
        console.log("MongoDB is Connected");
    })
    .catch((err) => {
        console.log(err, "MongoDB connection failed");
    });

app.listen(PORT, () => {
    console.log("Server connected to port:", PORT);
});
