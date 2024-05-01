const winston = require('winston');
const expressWinston = require('express-winston');

const { transports, format } = require('winston');


const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: './logger/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '7d',
    level: 'info',
    zippedArchive: true
})

const errorFileRotateTransport = new winston.transports.DailyRotateFile({
    filename: './logger/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '7d',
    level: 'error',
    zippedArchive: true
})

const expWin = expressWinston.logger({
    format: format.combine(
        format.json(),
        format.prettyPrint()
    ),
    transports: [
        fileRotateTransport
    ],
    
});

const errLogger = expressWinston.errorLogger({
    format: format.combine(
        format.errors({stack: true}),
        format.json(),
        format.simple(),
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss A'}),
    ),
    transports: [
        errorFileRotateTransport
    ]
});

module.exports = {
    logger: expWin,
    errLogger: errLogger
}