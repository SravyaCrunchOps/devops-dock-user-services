const winston = require('winston');

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

const logger = winston.createLogger({
    format: combine(
        errors({stack: true}),
        colorize({all: true}),
        json(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss A'}),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            level: 'info'
        })
    ]
});

module.exports = logger;