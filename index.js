const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const morganMiddleware = require('./middlewares/morganMiddleware');
const { logger, errLogger } = require('./logger/expressWinston');

const port = config.server.port;

require('./middlewares/passport');

const app = express();

// mongoose connect
const mongoUrl = config.database.mongoUrl;
const db = mongoose.connect(mongoUrl)

app.use(express.json());


// session middleware
app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
}));



// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// cors middleware
app.use(cors({
    origin: config.urls.baseUrl,
    methods: "GET,POST,PUT,DELETE",
    headers: "x-access-token, Content-Type, Accept, Access-Control-Allow-Credentials",
    credentials: true,
}));

// route handler
app.use(logger);
app.use(morganMiddleware);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use(errLogger);

// database and port handler
if(db) {
    app.listen(port, (err, client) => {
        if(err) console.log(err.message)
        console.log('server connected at PORT: ', port)
        console.log("MongoDb database is connected")
    });
}