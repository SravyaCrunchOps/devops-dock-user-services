const winston = require('winston');
require('winston-daily-rotate-file');


const { combine, timestamp, json, prettyPrint, errors } = winston.format;

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debud: 4,
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}


const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: './logger/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '7d',
    level: 'info'
})

const errorFileRotateTransport = new winston.transports.DailyRotateFile({
    filename: './logger/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '7d',
    level: 'error',
})


const logger = winston.createLogger({
    level: level(),
    levels,
    format: combine(
        errors({stack: true}),
        json(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss A'}),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        fileRotateTransport,
        errorFileRotateTransport,
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: './logger/exception.log' }),
    ], 
});

module.exports = logger;


// new winston.transports.File({
//     filename: './logger/pomodoro_user_info.log',
//     level: 'info',
//     format: combine(infoFilter(), timestamp('YYYY-MM-DD hh:mm:ss.SSS A'), json(), prettyPrint())
// }),