const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
// const morgan = require('./middlewares/morgan');
// const { logger, errLogger } = require('./logger/expressWinston');
const logger = require('./logger/logger');
// const morgan = require('morgan');
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
// morgan.token('meta', (req, res) => {
//         return JSON.stringify({
//             meta: {
//                 meta: req.body? req.body.meta : null,
//                 information: req.body ? req.body.message : null,
//                 email: req.body ? req.body.email : null
//             }
//         })
// })
// app.use(morgan(':remote-addr :remote-user [:date[clf]] ":method - HTTP/:http-version :url" :status - :res[content-length] :meta - :response-time ms :referrer'))
app.use((req, res, next) => {
    logger.info(req.originalUrl)
    next()
})

app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// database and port handler
if(db) {
    app.listen(port, (err, client) => {
        if(err) console.log(err.message)
        console.log('server connected at PORT: ', port)
        console.log("MongoDb database is connected")
    });
}